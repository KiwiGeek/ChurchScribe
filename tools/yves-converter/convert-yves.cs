#!/usr/bin/env dotnet-run
//
// convert-yves.cs
//
// C# port of convert-yves.js — converts Yves-encrypted Bible zip files
// (from YouVersion/Bible.com offline downloads) into ChurchScribe JS
// translation files.
//
// Requires .NET 10 (file-based programs with #: directives).
//
// Usage:
//   dotnet run convert-yves.cs [zip-file] [options]
//
// Options:
//   --metadata <file>   Path to translations metadata JSON
//                       (produced by bibledotcom-scraper)
//   --input    <dir>    Source directory to scan for *.zip files (batch mode,
//                       default: current directory)
//   --output   <dir>    Output directory (default: current directory)
//   --code     <code>   Override the translation code (single-file mode only)
//   --help              Show this help message
//
// Example:
//   dotnet run convert-yves.cs 100-14.zip --metadata 20240318223222.json --output ./out
//

#:sdk Microsoft.NET.Sdk
#:property TargetFramework=net10.0
#:property PublishTrimmed=false
#:package HtmlAgilityPack@1.11.68

// IL2026/IL3050 are AOT-trimming analysis warnings; this is a dev tool that is
// never AOT-compiled, so suppress them for the whole file.
#pragma warning disable IL2026, IL3050

using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using HtmlAgilityPack;

YvesConverter.Run(args);

// ─────────────────────────────────────────────────────────────────────────────

static class YvesConverter
{
    // ── USFM book-code → canonical book name ─────────────────────────────────

    static readonly Dictionary<string, string> UsfmToBook = new(StringComparer.OrdinalIgnoreCase)
    {
        // Old Testament
        ["GEN"] = "Genesis",          ["EXO"] = "Exodus",           ["LEV"] = "Leviticus",
        ["NUM"] = "Numbers",          ["DEU"] = "Deuteronomy",      ["JOS"] = "Joshua",
        ["JDG"] = "Judges",           ["RUT"] = "Ruth",             ["1SA"] = "1 Samuel",
        ["2SA"] = "2 Samuel",         ["1KI"] = "1 Kings",          ["2KI"] = "2 Kings",
        ["1CH"] = "1 Chronicles",     ["2CH"] = "2 Chronicles",     ["EZR"] = "Ezra",
        ["NEH"] = "Nehemiah",         ["EST"] = "Esther",           ["JOB"] = "Job",
        ["PSA"] = "Psalms",           ["PRO"] = "Proverbs",         ["ECC"] = "Ecclesiastes",
        ["SNG"] = "Song of Solomon",  ["ISA"] = "Isaiah",           ["JER"] = "Jeremiah",
        ["LAM"] = "Lamentations",     ["EZK"] = "Ezekiel",          ["DAN"] = "Daniel",
        ["HOS"] = "Hosea",            ["JOL"] = "Joel",             ["AMO"] = "Amos",
        ["OBA"] = "Obadiah",          ["JON"] = "Jonah",            ["MIC"] = "Micah",
        ["NAM"] = "Nahum",            ["HAB"] = "Habakkuk",         ["ZEP"] = "Zephaniah",
        ["HAG"] = "Haggai",           ["ZEC"] = "Zechariah",        ["MAL"] = "Malachi",
        // Deuterocanon / Apocrypha
        ["TOB"] = "Tobit",
        ["JDT"] = "Judith",
        ["ESG"] = "Esther (Greek)",
        ["WIS"] = "Wisdom of Solomon",
        ["SIR"] = "Sirach",
        ["BAR"] = "Baruch",
        ["LJE"] = "Letter of Jeremiah",
        ["S3Y"] = "Prayer of Azariah",
        ["SUS"] = "Susanna",
        ["BEL"] = "Bel and the Dragon",
        ["1MA"] = "1 Maccabees",
        ["2MA"] = "2 Maccabees",
        ["3MA"] = "3 Maccabees",
        ["4MA"] = "4 Maccabees",
        ["1ES"] = "1 Esdras",
        ["2ES"] = "2 Esdras",
        ["MAN"] = "Prayer of Manasseh",
        ["PS2"] = "Psalm 151",
        ["ODA"] = "Odes",
        ["PSS"] = "Psalms of Solomon",
        ["DAG"] = "Daniel (Greek)",
        ["LAO"] = "Laodiceans",
        // Ethiopian Orthodox extra-canonical books
        ["ENO"] = "Enoch",
        ["JUB"] = "Jubilees",
        ["1MQ"] = "1 Meqabyan",
        ["2MQ"] = "2 Meqabyan",
        ["3MQ"] = "3 Meqabyan",
        ["4BA"] = "4 Baruch",
        ["REP"] = "Reproof",
        // New Testament
        ["MAT"] = "Matthew",          ["MRK"] = "Mark",             ["LUK"] = "Luke",
        ["JHN"] = "John",             ["ACT"] = "Acts",             ["LKA"] = "Luke-Acts",
        ["ROM"] = "Romans",
        ["1CO"] = "1 Corinthians",    ["2CO"] = "2 Corinthians",    ["GAL"] = "Galatians",
        ["EPH"] = "Ephesians",        ["PHP"] = "Philippians",      ["COL"] = "Colossians",
        ["1TH"] = "1 Thessalonians",  ["2TH"] = "2 Thessalonians",
        ["1TI"] = "1 Timothy",        ["2TI"] = "2 Timothy",        ["TIT"] = "Titus",
        ["PHM"] = "Philemon",         ["HEB"] = "Hebrews",          ["JAS"] = "James",
        ["1PE"] = "1 Peter",          ["2PE"] = "2 Peter",          ["1JN"] = "1 John",
        ["2JN"] = "2 John",           ["3JN"] = "3 John",           ["JUD"] = "Jude",
        ["REV"] = "Revelation",
    };

    // Canonical book order for consistent output ordering.
    // Deuterocanonical/apocryphal books are placed between Malachi and Matthew,
    // following the standard deuterocanonical ordering used in Catholic bibles.
    static readonly string[] BookOrder =
    [
        // Old Testament
        "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua",
        "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings",
        "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job",
        "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah",
        "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
        "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai",
        "Zechariah", "Malachi",
        // Deuterocanon / Apocrypha
        "Tobit", "Judith", "Esther (Greek)", "Wisdom of Solomon", "Sirach",
        "Baruch", "Letter of Jeremiah", "Prayer of Azariah", "Susanna",
        "Bel and the Dragon", "1 Maccabees", "2 Maccabees", "3 Maccabees",
        "4 Maccabees", "1 Esdras", "2 Esdras", "Prayer of Manasseh", "Psalm 151",
        "Odes", "Psalms of Solomon", "Daniel (Greek)", "Laodiceans",
        // Ethiopian Orthodox extra-canonical books
        "Enoch", "Jubilees", "1 Meqabyan", "2 Meqabyan", "3 Meqabyan", "4 Baruch", "Reproof",
        // New Testament
        "Matthew", "Mark", "Luke", "John", "Acts", "Luke-Acts", "Romans",
        "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians",
        "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy",
        "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John",
        "2 John", "3 John", "Jude", "Revelation",
    ];

    // ── HTML inline class handling ────────────────────────────────────────────

    // All inline USX classes the converter explicitly handles or intentionally
    // ignores.  Any class found on an element that is NOT in this set is added
    // to the unknownClasses collector, which causes the output file to be
    // skipped and a report to be printed.
    //
    // To add support for a new class:
    //   1. Add it here so it stops being reported as unknown.
    //   2. Add rendering logic in HtmlContent() if it needs non-trivial output.
    static readonly HashSet<string> KnownInlineClasses = new(StringComparer.Ordinal)
    {
        // Explicitly rendered
        "it",       // italics / translator-added words  → <em>
        "sc",       // small caps                        → <small>
        "nd",       // divine name                       → <span class="divine-name">
        "wj",       // words of Jesus                    → <span class="words-of-jesus">
        "bd",       // bold text                         → <strong>
        "bdit",     // bold-italic text                  → <strong><em>
        // Excluded by the excludeClasses parameter
        "note",     // footnote
        "label",    // verse number label
        // Transparent wrappers (just pass inner content through)
        "content",
        "verse",
        // vN classes (v1, v2, …) are matched by IsVerseNumberClass() rather
        // than listed literally here.
    };

    // ── JSON serializer options ───────────────────────────────────────────────

    static readonly JsonSerializerOptions JsonOptions = new()
    {
        // Preserve non-ASCII characters (e.g. Amharic) as-is instead of \uXXXX
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        // Omit null fields (the optional "html" field on verse entries)
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    // ── Yves decoding ─────────────────────────────────────────────────────────

    // Decode a Yves-encoded byte buffer.
    // Each byte is rotated right by 5 bits (= rotated left by 3 bits).
    // Bytes are processed in pairs and the pair is swapped before rotation.
    static string DecodeYves(byte[] buffer)
    {
        var bytes = new List<byte>(buffer.Length);
        int i = 0;
        while (i < buffer.Length)
        {
            if (i + 1 < buffer.Length)
            {
                bytes.Add((byte)(((buffer[i + 1] & 0xFF) >> 5) | (((buffer[i + 1] & 0xFF) << 3) & 0xFF)));
                bytes.Add((byte)(((buffer[i]     & 0xFF) >> 5) | (((buffer[i]     & 0xFF) << 3) & 0xFF)));
            }
            else
            {
                bytes.Add((byte)(((buffer[i] & 0xFF) >> 5) | (((buffer[i] & 0xFF) << 3) & 0xFF)));
            }
            i += 2;
        }
        return Encoding.UTF8.GetString([.. bytes]);
    }

    // ── HTML parsing helpers ──────────────────────────────────────────────────

    // Returns true for classes of the form "v" followed by one or more digits
    // (e.g. "v1", "v12", "v176").  These inline verse-number markers are
    // excluded from output, the same as the "label" class.
    static bool IsVerseNumberClass(string cls) =>
        Regex.IsMatch(cls, @"^v\d+$");

    static bool HasClass(HtmlNode node, string cls) =>
        (node.GetAttributeValue("class", "") ?? "")
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Contains(cls, StringComparer.Ordinal);

    static IEnumerable<string> NodeClasses(HtmlNode node) =>
        (node.GetAttributeValue("class", "") ?? "")
            .Split(' ', StringSplitOptions.RemoveEmptyEntries);

    // Collect all text content from a node, but skip any subtree whose root
    // has one of the excluded classes.
    static string TextContent(HtmlNode node, string[] excludeClasses)
    {
        if (node.NodeType == HtmlNodeType.Text)
            return HtmlEntity.DeEntitize(node.InnerHtml);

        if (node.NodeType == HtmlNodeType.Element)
        {
            if (excludeClasses.Any(cls => HasClass(node, cls)))
                return "";
            return string.Concat(node.ChildNodes.Select(c => TextContent(c, excludeClasses)));
        }

        return "";
    }

    // Build an HTML string from a node, skipping subtrees with excluded classes
    // and converting USX inline classes into semantic HTML equivalents.
    //
    // USX → HTML mappings:
    //   .it    → <em>
    //   .sc    → <small>
    //   .nd    → <span class="divine-name">
    //   .wj    → <span class="words-of-jesus">
    //   .bd    → <strong>
    //   .bdit  → <strong><em>
    //   .vN    → excluded entirely (inline verse-number marker)
    //   .note  → excluded entirely
    static string HtmlContent(HtmlNode node, string[] excludeClasses, HashSet<string>? unknownClasses)
    {
        if (node.NodeType == HtmlNodeType.Text)
            return EscapeHtml(HtmlEntity.DeEntitize(node.InnerHtml));

        if (node.NodeType != HtmlNodeType.Element)
            return "";

        if (excludeClasses.Any(cls => HasClass(node, cls)))
            return "";

        // Check every class on this element against the known set
        if (unknownClasses != null)
        {
            foreach (var cls in NodeClasses(node))
            {
                if (!KnownInlineClasses.Contains(cls)
                    && !IsVerseNumberClass(cls)
                    && !excludeClasses.Contains(cls, StringComparer.Ordinal))
                {
                    unknownClasses.Add(cls);
                }
            }
        }

        // vN classes (e.g. v1, v12) are inline verse-number markers — skip them
        if (NodeClasses(node).Any(IsVerseNumberClass))
            return "";

        var inner = string.Concat(node.ChildNodes.Select(c => HtmlContent(c, excludeClasses, unknownClasses)));

        if (HasClass(node, "it"))   return $"<em>{inner}</em>";
        if (HasClass(node, "sc"))   return $"<small>{inner}</small>";
        if (HasClass(node, "nd"))   return $"<span class=\"divine-name\">{inner}</span>";
        if (HasClass(node, "wj"))   return $"<span class=\"words-of-jesus\">{inner}</span>";
        if (HasClass(node, "bd"))   return $"<strong>{inner}</strong>";
        if (HasClass(node, "bdit")) return $"<strong><em>{inner}</em></strong>";

        // .content, .verse and other transparent wrappers — pass inner through
        return inner;
    }

    static string EscapeHtml(string s) => s
        .Replace("&", "&amp;")
        .Replace("<", "&lt;")
        .Replace(">", "&gt;")
        .Replace("\"", "&quot;");

    static string Normalise(string s) =>
        Regex.Replace(s, @"\s+", " ").Trim();

    // ── Yves HTML parser ──────────────────────────────────────────────────────

    // Internal flat structure: book → chapter → verse → VerseEntry
    // Parse a decoded Yves HTML string and return verses grouped by book/chapter.
    static RawData ParseYvesHtml(string html, HashSet<string>? unknownClasses, HashSet<string>? unknownBookCodes)
    {
        var result = new RawData();

        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var allNodes = doc.DocumentNode
            .Descendants()
            .Where(n => n.NodeType == HtmlNodeType.Element
                     && HasClass(n, "verse")
                     && n.Attributes["data-usfm"] != null)
            .ToList();

        foreach (var verseNode in allNodes)
        {
            var usfm  = verseNode.GetAttributeValue("data-usfm", ""); // e.g. "GEN.1.1"
            var parts = usfm.Split('.');
            if (parts.Length != 3) continue;

            if (!int.TryParse(parts[1], out var chapterNum)) continue;
            if (!int.TryParse(parts[2], out var verseNum))   continue;

            var bookCode = parts[0];
            if (!UsfmToBook.TryGetValue(bookCode, out var bookName))
            {
                unknownBookCodes?.Add(bookCode);
                continue;
            }

            var plainText = Normalise(TextContent(verseNode, ["note", "label"]));
            if (string.IsNullOrEmpty(plainText)) continue;

            var richHtml  = Normalise(HtmlContent(verseNode, ["note", "label"], unknownClasses));
            string? htmlField = (!string.IsNullOrEmpty(richHtml) && richHtml != EscapeHtml(plainText))
                ? richHtml
                : null;

            if (!result.TryGetValue(bookName, out var bookData))
                result[bookName] = bookData = [];
            if (!bookData.TryGetValue(chapterNum, out var chapterData))
                bookData[chapterNum] = chapterData = [];

            // A verse can appear in multiple paragraphs; keep the first occurrence
            if (!chapterData.ContainsKey(verseNum))
                chapterData[verseNum] = new VerseEntry { Verse = verseNum, Text = plainText, Html = htmlField };
        }

        return result;
    }

    // Merge per-file parse results into a single book→chapters structure.
    static void MergeInto(RawData accumulator, RawData parsed)
    {
        foreach (var (book, chapters) in parsed)
        {
            if (!accumulator.TryGetValue(book, out var accBook))
                accumulator[book] = accBook = [];
            foreach (var (ch, verses) in chapters)
            {
                if (!accBook.TryGetValue(ch, out var accChapter))
                    accBook[ch] = accChapter = [];
                foreach (var (v, entry) in verses)
                {
                    if (!accChapter.ContainsKey(v))
                        accChapter[v] = entry;
                }
            }
        }
    }

    // Convert the flat structure into the ChurchScribe array format:
    //   { book: [ { chapter, verses: [...] } ] }
    static Dictionary<string, List<ChapterEntry>> ToChurchScribeFormat(RawData raw)
    {
        var output       = new Dictionary<string, List<ChapterEntry>>();
        var presentBooks = raw.Keys.ToHashSet(StringComparer.Ordinal);

        foreach (var book in BookOrder.Where(b => presentBooks.Contains(b)))
        {
            var chapters = raw[book];
            output[book] = [..chapters.Keys
                .OrderBy(ch => ch)
                .Select(chNum => new ChapterEntry
                {
                    Chapter = chNum,
                    Verses  = [..chapters[chNum].Keys
                        .OrderBy(v => v)
                        .Select(vNum => chapters[chNum][vNum])],
                })];
        }

        return output;
    }

    // ── Metadata lookup ───────────────────────────────────────────────────────

    record VersionInfo(int Id, string Abbreviation, string Title, string? Language);

    // Find the version entry matching the numeric id embedded in the zip filename.
    static VersionInfo? FindVersionInMetadata(string zipFilename, JsonDocument metadata)
    {
        var baseName = Path.GetFileNameWithoutExtension(zipFilename);
        var match    = Regex.Match(baseName, @"^(\d+)");
        if (!match.Success) return null;

        var id = int.Parse(match.Groups[1].Value);

        if (!metadata.RootElement.TryGetProperty("Versions", out var versions))
            return null;

        foreach (var prop in versions.EnumerateObject())
        {
            var e = prop.Value;
            if (!e.TryGetProperty("Id", out var idProp) || idProp.GetInt32() != id)
                continue;

            var abbreviation = e.TryGetProperty("Abbreviation", out var abbrProp)
                ? abbrProp.GetString() ?? baseName
                : baseName;

            var title = abbreviation;
            if (e.TryGetProperty("Title",      out var titleProp)  && titleProp.GetString()  is { Length: > 0 } t)  title = t;
            else if (e.TryGetProperty("LocalTitle", out var localProp) && localProp.GetString() is { Length: > 0 } lt) title = lt;

            string? language = null;
            if (e.TryGetProperty("Language", out var langEl))
            {
                if      (langEl.TryGetProperty("Iso639_1", out var iso1) && iso1.GetString() is { Length: > 0 } l1) language = l1;
                else if (langEl.TryGetProperty("Iso639_3", out var iso3) && iso3.GetString() is { Length: > 0 } l3) language = l3;
                else if (langEl.TryGetProperty("Tag",      out var tag)  && tag.GetString()  is { Length: > 0 } tg) language = tg;
            }

            return new VersionInfo(id, abbreviation, title, language);
        }

        return null;
    }

    // ── Output generation ─────────────────────────────────────────────────────

    static string SanitiseCode(string str) =>
        Regex.Replace(str.ToUpperInvariant(), @"[^A-Z0-9_]", "_");

    static string RenderJs(string code, string label, string language, string copyright,
        Dictionary<string, List<ChapterEntry>> bibleData)
    {
        var safeCode = SanitiseCode(code);
        var sb       = new StringBuilder();

        sb.AppendLine($"window.{safeCode}_VERSION = 1;");
        sb.AppendLine($"window.{safeCode}_LABEL = {JsonSerializer.Serialize(label, JsonOptions)};");
        sb.AppendLine($"window.{safeCode}_LANGUAGE = {JsonSerializer.Serialize(language, JsonOptions)};");
        sb.AppendLine($"window.{safeCode}_COPYRIGHT = {JsonSerializer.Serialize(copyright, JsonOptions)};");
        sb.AppendLine($"window.{safeCode}_BIBLE = {JsonSerializer.Serialize(bibleData, JsonOptions)};");

        return sb.ToString();
    }

    // ── CLI ───────────────────────────────────────────────────────────────────

    static void PrintHelp() => Console.Write("""
        Usage: dotnet run convert-yves.cs [zip-file] [options]

        If no zip-file is specified, every *.zip file in the source directory is
        processed automatically (batch mode).

        Options:
          --metadata <file>   Path to translations metadata JSON
          --input    <dir>    Source directory to scan for *.zip files (batch mode only,
                              default: current directory)
          --output   <dir>    Output directory (default: current directory)
          --code     <code>   Override the translation code (single-file mode only)
          --help              Show this help message

        Zip filenames are expected to be of the form <id>-<revision>.zip,
        matching the format used by offline Bible downloads (e.g. 100-14.zip).

        """);

    record CliArgs(string? ZipFile, string? MetadataFile, string InputDir, string OutputDir, string? Code);

    static CliArgs ParseArgs(string[] argv)
    {
        string? zipFile = null, metadataFile = null, code = null;
        string  inputDir = ".", outputDir = ".";

        for (int i = 0; i < argv.Length; i++)
        {
            switch (argv[i])
            {
                case "--help":
                case "-h":
                    PrintHelp();
                    Environment.Exit(0);
                    break;
                case "--metadata": metadataFile = argv[++i]; break;
                case "--input":    inputDir     = argv[++i]; break;
                case "--output":   outputDir    = argv[++i]; break;
                case "--code":     code         = argv[++i]; break;
                default:
                    if (!argv[i].StartsWith("--"))
                        zipFile = argv[i];
                    break;
            }
        }

        return new CliArgs(zipFile, metadataFile, inputDir, outputDir, code);
    }

    record ConvertResult(
        bool            Success,
        string          Code,
        string          Label,
        string?         Reason,
        HashSet<string> UnknownClasses,
        HashSet<string> UnknownBookCodes);

    static ConvertResult Fail(string code, string label, string reason,
        HashSet<string>? unknownClasses   = null,
        HashSet<string>? unknownBookCodes = null) =>
        new(false, code, label, reason,
            unknownClasses   ?? [],
            unknownBookCodes ?? []);

    static ConvertResult ConvertZip(string zipFile, CliArgs args, JsonDocument? metadata)
    {
        if (!File.Exists(zipFile))
        {
            Console.Error.WriteLine($"Error: file not found: {zipFile}");
            return Fail("?", Path.GetFileName(zipFile), "File not found");
        }

        // Resolve translation info
        string? code      = args.Code;
        string? label     = null;
        string? language  = null;
        string  copyright = "";

        var versionInfo = metadata != null ? FindVersionInMetadata(zipFile, metadata) : null;
        if (versionInfo != null)
        {
            code     ??= versionInfo.Abbreviation;
            label      = versionInfo.Title;
            language   = versionInfo.Language;
        }

        code     ??= SanitiseCode(Regex.Replace(Path.GetFileNameWithoutExtension(zipFile), @"-\d+$", ""));
        label    ??= code;
        language ??= "";

        Console.WriteLine($"Converting \"{Path.GetFileName(zipFile)}\"...");
        Console.WriteLine($"  Code:      {code}");
        Console.WriteLine($"  Label:     {label}");
        Console.WriteLine($"  Language:  {language}");

        // Open zip and process each .yves entry
        var rawData          = new RawData();
        var unknownClasses   = new HashSet<string>();
        var unknownBookCodes = new HashSet<string>();
        int processedFiles   = 0;

        using (var zip = ZipFile.OpenRead(zipFile))
        {
            foreach (var entry in zip.Entries)
            {
                if (!entry.Name.EndsWith(".yves", StringComparison.OrdinalIgnoreCase)) continue;

                using var ms = new MemoryStream();
                entry.Open().CopyTo(ms);

                var decoded = DecodeYves(ms.ToArray());
                var parsed  = ParseYvesHtml(decoded, unknownClasses, unknownBookCodes);
                MergeInto(rawData, parsed);
                processedFiles++;
            }
        }

        Console.WriteLine($"  Processed {processedFiles} .yves files");

        if (processedFiles == 0)
        {
            Console.Error.WriteLine($"  Error: no .yves files found in \"{Path.GetFileName(zipFile)}\" — skipping.");
            return Fail(code, label, "No .yves files found");
        }

        // If any unrecognised classes were found, report and skip output
        if (unknownClasses.Count > 0)
        {
            var classList = string.Join(", ", unknownClasses.OrderBy(c => c));
            Console.Error.WriteLine($"  Skipped — unrecognised inline class(es): {classList}");
            Console.Error.WriteLine("  Add handling for these classes to KnownInlineClasses / HtmlContent() and re-run.");
            return Fail(code, label, "Unrecognised inline class(es)", unknownClasses, unknownBookCodes);
        }

        var bibleData = ToChurchScribeFormat(rawData);
        Console.WriteLine($"  Books found: {bibleData.Count}");

        var jsContent = RenderJs(code, label, language, copyright, bibleData);

        // Write output file (UTF-8, no BOM)
        Directory.CreateDirectory(args.OutputDir);
        var safeCode   = SanitiseCode(code);
        var outputFile = Path.Combine(args.OutputDir, $"{safeCode.ToLowerInvariant()}.js");
        File.WriteAllText(outputFile, jsContent, new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));

        Console.WriteLine($"  Output written to: {outputFile}");
        return new ConvertResult(true, code, label, null, [], unknownBookCodes);
    }

    public static void Run(string[] args)
    {
        var cliArgs = ParseArgs(args);

        // Load optional metadata (shared across all conversions)
        JsonDocument? metadata = null;
        if (cliArgs.MetadataFile != null)
        {
            if (!File.Exists(cliArgs.MetadataFile))
            {
                Console.Error.WriteLine($"Error: metadata file not found: {cliArgs.MetadataFile}");
                Environment.Exit(1);
            }
            metadata = JsonDocument.Parse(File.ReadAllText(cliArgs.MetadataFile));
        }

        if (cliArgs.ZipFile != null)
        {
            // Single-file mode
            var result = ConvertZip(cliArgs.ZipFile, cliArgs, metadata);
            if (!result.Success) Environment.Exit(1);
            return;
        }

        // Batch mode: find all *.zip files in the source directory
        var scanDir = Path.GetFullPath(cliArgs.InputDir);
        if (!Directory.Exists(scanDir))
        {
            Console.Error.WriteLine($"Error: input directory not found: {scanDir}");
            Environment.Exit(1);
        }

        var zipFiles = Directory.GetFiles(scanDir, "*.zip")
            .OrderBy(f => f)
            .ToList();

        if (zipFiles.Count == 0)
        {
            Console.Error.WriteLine($"Error: no zip file specified and no *.zip files found in \"{scanDir}\".\n");
            PrintHelp();
            Environment.Exit(1);
        }

        Console.WriteLine($"Found {zipFiles.Count} zip file(s) to convert.\n");

        int succeeded = 0;
        var failures  = new List<(string ZipFile, ConvertResult Result)>();
        // Map of USFM book code → list of "CODE (Label)" strings for every translation that skipped it
        var allUnknownBookCodes = new Dictionary<string, List<string>>();

        foreach (var zipFile in zipFiles)
        {
            // --code is not meaningful across multiple files; ignore it in batch mode
            var batchArgs = cliArgs with { Code = null };
            var result    = ConvertZip(zipFile, batchArgs, metadata);

            if (result.Success) succeeded++;
            else                failures.Add((zipFile, result));

            // Collect unknown book codes from every conversion (success or failure)
            if (result.UnknownBookCodes.Count > 0)
            {
                var tag = result.Code != "?" && !string.IsNullOrEmpty(result.Code)
                    ? $"{result.Code} ({result.Label})"
                    : result.Label ?? Path.GetFileName(zipFile);

                foreach (var bookCode in result.UnknownBookCodes)
                {
                    if (!allUnknownBookCodes.TryGetValue(bookCode, out var list))
                        allUnknownBookCodes[bookCode] = list = [];
                    list.Add(tag);
                }
            }

            Console.WriteLine();
        }

        Console.WriteLine($"Done. {succeeded} succeeded, {failures.Count} failed.");

        if (failures.Count > 0)
        {
            Console.WriteLine("\nFailed conversions:");
            foreach (var (zipFile, f) in failures)
            {
                var tag = f.Code != "?" && !string.IsNullOrEmpty(f.Code)
                    ? $" ({f.Code} — {f.Label})"
                    : $" ({f.Label})";
                Console.WriteLine($"  \"{Path.GetFileName(zipFile)}\"{tag}");
                if (f.UnknownClasses.Count > 0)
                {
                    var classList = string.Join(", ", f.UnknownClasses.OrderBy(c => c));
                    Console.WriteLine($"    Unrecognised inline class(es): {classList}");
                    Console.WriteLine("    Add handling for these classes to KnownInlineClasses / HtmlContent() and re-run.");
                }
                else
                {
                    Console.WriteLine($"    Reason: {f.Reason}");
                }
            }
        }

        if (allUnknownBookCodes.Count > 0)
        {
            Console.WriteLine("\nUnrecognised USFM book codes (verses silently skipped):");
            foreach (var (bookCode, translations) in allUnknownBookCodes.OrderBy(kv => kv.Key))
                Console.WriteLine($"  {bookCode}: {string.Join(", ", translations)}");
        }

        if (failures.Count > 0 || allUnknownBookCodes.Count > 0)
            Environment.Exit(1);
    }
}

// ── Data types ────────────────────────────────────────────────────────────────

class VerseEntry
{
    [JsonPropertyName("verse")] public int     Verse { get; init; }
    [JsonPropertyName("text")]  public string  Text  { get; init; } = "";
    [JsonPropertyName("html")]  public string? Html  { get; init; }
}

class ChapterEntry
{
    [JsonPropertyName("chapter")] public int             Chapter { get; init; }
    [JsonPropertyName("verses")]  public List<VerseEntry> Verses { get; init; } = [];
}

// Convenience subclass so methods can use RawData as a short name for the
// three-level nested dictionary: book → chapter → verse → VerseEntry
class RawData : Dictionary<string, Dictionary<int, Dictionary<int, VerseEntry>>> { }
