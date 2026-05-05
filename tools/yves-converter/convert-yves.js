#!/usr/bin/env node
/**
 * convert-yves.js
 *
 * Converts Yves-encrypted Bible zip files (from YouVersion/Bible.com offline
 * downloads) into ChurchScribe JS translation files.
 *
 * Usage:
 *   node convert-yves.js <zip-file> [options]
 *
 * Options:
 *   --metadata <file>   Path to translations metadata JSON
 *                       (produced by bibledotcom-scraper). Used to populate
 *                       label, language, and copyright fields.
 *   --output <dir>      Output directory (default: current directory)
 *   --code <code>       Override the translation code (e.g. NASB1995).
 *                       Defaults to the abbreviation found in metadata.
 *   --help              Show this help message
 *
 * Example:
 *   node convert-yves.js 100-14.zip --metadata 20240318223222.json --output ./out
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const { parseDocument } = require("htmlparser2");
const { DomUtils } = require("htmlparser2");

// ── USFM book-code → canonical book name ─────────────────────────────────────

const USFM_TO_BOOK = {
  GEN: "Genesis",       EXO: "Exodus",        LEV: "Leviticus",
  NUM: "Numbers",       DEU: "Deuteronomy",   JOS: "Joshua",
  JDG: "Judges",        RUT: "Ruth",          "1SA": "1 Samuel",
  "2SA": "2 Samuel",    "1KI": "1 Kings",     "2KI": "2 Kings",
  "1CH": "1 Chronicles","2CH": "2 Chronicles",EZR: "Ezra",
  NEH: "Nehemiah",      EST: "Esther",        JOB: "Job",
  PSA: "Psalms",        PRO: "Proverbs",      ECC: "Ecclesiastes",
  SNG: "Song of Solomon",ISA: "Isaiah",       JER: "Jeremiah",
  LAM: "Lamentations",  EZK: "Ezekiel",       DAN: "Daniel",
  HOS: "Hosea",         JOL: "Joel",          AMO: "Amos",
  OBA: "Obadiah",       JON: "Jonah",         MIC: "Micah",
  NAM: "Nahum",         HAB: "Habakkuk",      ZEP: "Zephaniah",
  HAG: "Haggai",        ZEC: "Zechariah",     MAL: "Malachi",
  MAT: "Matthew",       MRK: "Mark",          LUK: "Luke",
  JHN: "John",          ACT: "Acts",          ROM: "Romans",
  "1CO": "1 Corinthians","2CO": "2 Corinthians",GAL: "Galatians",
  EPH: "Ephesians",     PHP: "Philippians",   COL: "Colossians",
  "1TH": "1 Thessalonians","2TH": "2 Thessalonians",
  "1TI": "1 Timothy",   "2TI": "2 Timothy",   TIT: "Titus",
  PHM: "Philemon",      HEB: "Hebrews",       JAS: "James",
  "1PE": "1 Peter",     "2PE": "2 Peter",     "1JN": "1 John",
  "2JN": "2 John",      "3JN": "3 John",      JUD: "Jude",
  REV: "Revelation",
};

// Canonical book order (for consistent output ordering)
const BOOK_ORDER = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua",
  "Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings",
  "1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job",
  "Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah",
  "Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai",
  "Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans",
  "1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians",
  "Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy",
  "Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John",
  "2 John","3 John","Jude","Revelation",
];

// ── Yves decoding ─────────────────────────────────────────────────────────────

/**
 * Decode a Yves-encoded byte buffer.
 *
 * Each byte is rotated right by 5 bits (equivalent to rotating left by 3 bits).
 * Bytes are processed in pairs and the pair is swapped before rotation.
 *
 * @param {Buffer} buffer
 * @returns {string} Decoded UTF-8 string
 */
function decodeYves(buffer) {
  let i = 0;
  const byteArray = [];
  while (i < buffer.length) {
    if (buffer.length > i + 1) {
      // Swap the pair, then rotate each byte right by 5 bits
      byteArray.push(((0xFF & buffer[i + 1]) >> 5) | (((0xFF & buffer[i + 1]) << 3) & 0xFF));
      byteArray.push(((0xFF & buffer[i])     >> 5) | (((0xFF & buffer[i])     << 3) & 0xFF));
    } else {
      byteArray.push(((0xFF & buffer[i])     >> 5) | (((0xFF & buffer[i])     << 3) & 0xFF));
    }
    i += 2;
  }
  return Buffer.from(byteArray).toString("utf8");
}

// ── HTML parsing ──────────────────────────────────────────────────────────────

/**
 * Check whether a DOM node has a given class.
 *
 * @param {object} node
 * @param {string} cls
 * @returns {boolean}
 */
function hasClass(node, cls) {
  const classes = (node.attribs && node.attribs.class || "").split(/\s+/);
  return classes.includes(cls);
}

/**
 * Collect all text content from a node, but skip any subtree whose root has
 * one of the excluded classes.
 *
 * @param {object} node
 * @param {string[]} excludeClasses
 * @returns {string}
 */
function textContent(node, excludeClasses = []) {
  if (node.type === "text") {
    return node.data;
  }
  if (node.type === "tag") {
    if (excludeClasses.some(cls => hasClass(node, cls))) {
      return "";
    }
    return (node.children || []).map(c => textContent(c, excludeClasses)).join("");
  }
  return "";
}

/**
 * Build an HTML string from a node, but skip subtrees with excluded classes
 * and convert certain USX inline classes into semantic HTML equivalents.
 *
 * USX → HTML mappings used here:
 *   .it   → <em> (italics / translator-added words)
 *   .sc   → <small> (small caps)
 *   .nd   → <span class="divine-name"> (name of deity)
 *   .wj   → <span class="words-of-jesus"> (words of Jesus)
 *   .note → excluded entirely
 *
 * @param {object} node
 * @param {string[]} excludeClasses
 * @returns {string}
 */
function htmlContent(node, excludeClasses = []) {
  if (node.type === "text") {
    return escapeHtml(node.data);
  }
  if (node.type !== "tag") {
    return "";
  }
  if (excludeClasses.some(cls => hasClass(node, cls))) {
    return "";
  }

  const inner = (node.children || []).map(c => htmlContent(c, excludeClasses)).join("");

  if (hasClass(node, "it")) {
    return `<em>${inner}</em>`;
  }
  if (hasClass(node, "sc")) {
    return `<small>${inner}</small>`;
  }
  if (hasClass(node, "nd")) {
    return `<span class="divine-name">${inner}</span>`;
  }
  if (hasClass(node, "wj")) {
    return `<span class="words-of-jesus">${inner}</span>`;
  }
  // For .content and other transparent wrappers, just return inner text
  return inner;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Normalise whitespace: collapse internal runs, trim edges.
 * @param {string} s
 * @returns {string}
 */
function normalise(s) {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Parse a decoded Yves HTML string and return an array of verse objects
 * grouped by book and chapter.
 *
 * Return structure:
 * {
 *   [bookName]: [
 *     { chapter: 1, verses: [ { verse: 1, text: "...", html?: "..." }, ... ] },
 *     ...
 *   ],
 *   ...
 * }
 *
 * @param {string} html
 * @returns {object}
 */
function parseYvesHtml(html) {
  const dom = parseDocument(html, { lowerCaseTags: false });
  const result = {};

  // Find all elements with data-usfm attributes of the form BOOK.CHAPTER.VERSE
  const allNodes = DomUtils.findAll(
    node => node.type === "tag" && hasClass(node, "verse") && node.attribs["data-usfm"],
    dom.children
  );

  for (const verseNode of allNodes) {
    const usfm = verseNode.attribs["data-usfm"]; // e.g. "GEN.1.1"
    const parts = usfm.split(".");
    if (parts.length !== 3) continue;

    const [bookCode, chapterStr, verseStr] = parts;
    const chapterNum = parseInt(chapterStr, 10);
    const verseNum   = parseInt(verseStr,   10);

    if (isNaN(chapterNum) || isNaN(verseNum)) continue;

    const bookName = USFM_TO_BOOK[bookCode];
    if (!bookName) {
      process.stderr.write(`Warning: unknown USFM book code "${bookCode}"\n`);
      continue;
    }

    // Collect all span.content children that are NOT inside a span.note
    const plainText = normalise(textContent(verseNode, ["note", "label"]));
    if (!plainText) continue;

    const richHtml  = normalise(htmlContent(verseNode, ["note", "label"]));
    const entry = { verse: verseNum, text: plainText };
    if (richHtml && richHtml !== escapeHtml(plainText)) {
      entry.html = richHtml;
    }

    if (!result[bookName]) result[bookName] = {};
    if (!result[bookName][chapterNum]) result[bookName][chapterNum] = {};

    // A verse can appear in multiple paragraphs; keep the first occurrence
    if (!result[bookName][chapterNum][verseNum]) {
      result[bookName][chapterNum][verseNum] = entry;
    }
  }

  return result;
}

/**
 * Merge per-file parse results into a single book→chapters structure.
 *
 * @param {object} accumulator  mutable master object { [book]: { [ch]: { [v]: entry } } }
 * @param {object} parsed       result from parseYvesHtml()
 */
function mergeInto(accumulator, parsed) {
  for (const [book, chapters] of Object.entries(parsed)) {
    if (!accumulator[book]) accumulator[book] = {};
    for (const [ch, verses] of Object.entries(chapters)) {
      if (!accumulator[book][ch]) accumulator[book][ch] = {};
      for (const [v, entry] of Object.entries(verses)) {
        if (!accumulator[book][ch][v]) {
          accumulator[book][ch][v] = entry;
        }
      }
    }
  }
}

/**
 * Convert the flat { book: { ch: { v: entry } } } structure into the
 * ChurchScribe array format: { book: [ { chapter, verses: [...] } ] }
 *
 * @param {object} raw
 * @returns {object}
 */
function toChurchScribeFormat(raw) {
  const output = {};
  const presentBooks = Object.keys(raw);
  const ordered = BOOK_ORDER.filter(b => presentBooks.includes(b));

  for (const book of ordered) {
    const chapters = raw[book];
    output[book] = Object.keys(chapters)
      .map(Number)
      .sort((a, b) => a - b)
      .map(chNum => ({
        chapter: chNum,
        verses: Object.keys(chapters[chNum])
          .map(Number)
          .sort((a, b) => a - b)
          .map(vNum => chapters[chNum][vNum]),
      }));
  }
  return output;
}

// ── Metadata lookup ───────────────────────────────────────────────────────────

/**
 * Find the version entry matching the numeric id embedded in the zip filename.
 *
 * @param {string} zipFilename   e.g. "100-14.zip"
 * @param {object} metadata      parsed contents of the metadata JSON
 * @returns {{ id, abbreviation, title, language, copyright }|null}
 */
function findVersionInMetadata(zipFilename, metadata) {
  const match = path.basename(zipFilename, ".zip").match(/^(\d+)/);
  if (!match) return null;

  const id = parseInt(match[1], 10);
  const versions = metadata.Versions || {};

  for (const entry of Object.values(versions)) {
    if (entry.Id === id) {
      return {
        id:           entry.Id,
        abbreviation: entry.Abbreviation,
        title:        entry.Title || entry.LocalTitle || entry.Abbreviation,
        language:     entry.Language
          ? (entry.Language.Iso639_1 ?? entry.Language.Iso639_3 ?? entry.Language.Tag ?? null)
          : null,
        copyright:    null, // not stored in this metadata file; add manually if needed
      };
    }
  }
  return null;
}

// ── Output generation ─────────────────────────────────────────────────────────

/**
 * Sanitise a string for use as a JS identifier component (the translation code).
 *
 * @param {string} str
 * @returns {string}
 */
function sanitiseCode(str) {
  return str.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
}

/**
 * Render the final ChurchScribe .js translation file content.
 *
 * @param {string} code       Translation code, e.g. "NASB1995"
 * @param {string} label      Human-readable label, e.g. "New American Standard Bible 1995"
 * @param {string} language   ISO 639-1 or 639-3 language tag, e.g. "en"
 * @param {string} copyright  Copyright string (may be empty)
 * @param {object} bibleData  ChurchScribe-format { book: [ { chapter, verses } ] }
 * @returns {string}
 */
function renderJs(code, label, language, copyright, bibleData) {
  const safeCode = sanitiseCode(code);
  const lines = [];
  lines.push(`window.${safeCode}_VERSION = 1;`);
  lines.push(`window.${safeCode}_LABEL = ${JSON.stringify(label)};`);
  lines.push(`window.${safeCode}_LANGUAGE = ${JSON.stringify(language || "")};`);
  lines.push(`window.${safeCode}_COPYRIGHT = ${JSON.stringify(copyright || "")};`);
  lines.push(`window.${safeCode}_BIBLE = ${JSON.stringify(bibleData)};`);
  return lines.join("\n") + "\n";
}

// ── CLI ───────────────────────────────────────────────────────────────────────

function printHelp() {
  process.stdout.write(`
Usage: node convert-yves.js [zip-file] [options]

If no zip-file is specified, every *.zip file in the current directory is
processed automatically (batch mode).

Options:
  --metadata <file>   Path to translations metadata JSON
  --output   <dir>    Output directory (default: current directory)
  --code     <code>   Override the translation code (single-file mode only)
  --help              Show this help message

Zip filenames are expected to be of the form <id>-<revision>.zip,
matching the format used by offline Bible downloads (e.g. 100-14.zip).
`);
}

function parseArgs(argv) {
  const args = { zipFile: null, metadataFile: null, outputDir: ".", code: null };
  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else if (arg === "--metadata") {
      args.metadataFile = argv[++i];
    } else if (arg === "--output") {
      args.outputDir = argv[++i];
    } else if (arg === "--code") {
      args.code = argv[++i];
    } else if (!arg.startsWith("--")) {
      args.zipFile = arg;
    }
    i++;
  }
  return args;
}

/**
 * Convert a single zip file and write the output .js translation file.
 *
 * @param {string} zipFile    Path to the zip file
 * @param {object} args       Parsed CLI arguments (outputDir, code)
 * @param {object|null} metadata  Parsed translations metadata JSON, or null
 * @returns {boolean} true on success, false on error
 */
function convertZip(zipFile, args, metadata) {
  if (!fs.existsSync(zipFile)) {
    process.stderr.write(`Error: file not found: ${zipFile}\n`);
    return false;
  }

  // Resolve translation info
  let code      = args.code || null;
  let label     = null;
  let language  = null;
  let copyright = null;

  const versionInfo = metadata ? findVersionInMetadata(zipFile, metadata) : null;
  if (versionInfo) {
    code      = code      || versionInfo.abbreviation;
    label     = versionInfo.title;
    language  = versionInfo.language;
    copyright = versionInfo.copyright || "";
  }

  if (!code) {
    // Fall back to the base name of the zip without the revision suffix
    code = sanitiseCode(path.basename(zipFile, ".zip").replace(/-\d+$/, ""));
  }
  label     = label     || code;
  language  = language  || "";
  copyright = copyright || "";

  process.stdout.write(`Converting "${path.basename(zipFile)}"...\n`);
  process.stdout.write(`  Code:      ${code}\n`);
  process.stdout.write(`  Label:     ${label}\n`);
  process.stdout.write(`  Language:  ${language}\n`);

  // Open zip and process each .yves entry
  const zip     = new AdmZip(zipFile);
  const entries = zip.getEntries();

  const rawData = {}; // { book: { ch: { v: entry } } }
  let processedFiles = 0;

  for (const entry of entries) {
    if (entry.isDirectory) continue;
    if (!entry.entryName.endsWith(".yves")) continue;

    const buffer  = entry.getData();
    const decoded = decodeYves(buffer);
    const parsed  = parseYvesHtml(decoded);
    mergeInto(rawData, parsed);
    processedFiles++;
  }

  process.stdout.write(`  Processed ${processedFiles} .yves files\n`);

  if (processedFiles === 0) {
    process.stderr.write(`  Error: no .yves files found in "${path.basename(zipFile)}" — skipping.\n`);
    return false;
  }

  const bibleData = toChurchScribeFormat(rawData);
  const bookCount = Object.keys(bibleData).length;
  process.stdout.write(`  Books found: ${bookCount}\n`);

  const jsContent = renderJs(code, label, language, copyright, bibleData);

  // Write output file
  if (!fs.existsSync(args.outputDir)) {
    fs.mkdirSync(args.outputDir, { recursive: true });
  }
  const safeCode   = sanitiseCode(code);
  const outputFile = path.join(args.outputDir, `${safeCode.toLowerCase()}.js`);
  fs.writeFileSync(outputFile, jsContent, "utf8");

  process.stdout.write(`  Output written to: ${outputFile}\n`);
  return true;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  // Load optional metadata (shared across all conversions)
  let metadata = null;
  if (args.metadataFile) {
    if (!fs.existsSync(args.metadataFile)) {
      process.stderr.write(`Error: metadata file not found: ${args.metadataFile}\n`);
      process.exit(1);
    }
    metadata = JSON.parse(fs.readFileSync(args.metadataFile, "utf8"));
  }

  if (args.zipFile) {
    // Single-file mode
    if (!convertZip(args.zipFile, args, metadata)) {
      process.exit(1);
    }
    return;
  }

  // Batch mode: find all *.zip files in the current directory
  const zipFiles = fs.readdirSync(".")
    .filter(f => f.toLowerCase().endsWith(".zip"))
    .sort();

  if (zipFiles.length === 0) {
    process.stderr.write("Error: no zip file specified and no *.zip files found in the current directory.\n\n");
    printHelp();
    process.exit(1);
  }

  process.stdout.write(`Found ${zipFiles.length} zip file(s) to convert.\n\n`);

  let succeeded = 0;
  let failed    = 0;
  for (const zipFile of zipFiles) {
    // --code is not meaningful across multiple files; ignore it in batch mode
    const batchArgs = { ...args, code: null };
    if (convertZip(zipFile, batchArgs, metadata)) {
      succeeded++;
    } else {
      failed++;
    }
    process.stdout.write("\n");
  }

  process.stdout.write(`Done. ${succeeded} succeeded, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

main();
