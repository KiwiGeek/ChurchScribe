# How to Convert YouVersion Bible Translations for ChurchScribe

This guide walks you through the full process of obtaining offline Bible
translation archives from YouVersion/Bible.com and converting them into
`.js` files that can be imported into ChurchScribe.

---

## Overview

YouVersion distributes offline Bible translations as Yves-encrypted zip
archives. This tool decrypts and parses those archives, then writes a
ChurchScribe-compatible `.js` translation file ready to import.

The process has three stages:

1. **Obtain** the zip archive(s) from Bible.com
2. **Obtain** the metadata JSON (optional but recommended)
3. **Convert** using this tool

---

## Step 1 – Install Dependencies

You need [Node.js](https://nodejs.org/) version 18 or newer. Check with:

```bash
node --version
```

Then install the tool's dependencies from this directory:

```bash
cd tools/yves-converter
npm install
```

---

## Step 2 – Obtain the Translation Zip File(s)

Bible.com names its offline zip files `<translation-id>-<revision>.zip`
(e.g. `100-14.zip` for NASB 1995 revision 14).

> **Note:** Obtaining these files yourself may require accessing the Bible.com
> mobile app or associated download infrastructure. Ensure you have the
> appropriate rights or license before proceeding.

Put the zip file(s) somewhere accessible on your machine, for example
`~/bibles/downloads/`.

---

## Step 3 – Obtain the Metadata JSON (Recommended)

The metadata JSON maps each numeric translation ID to a human-readable title,
abbreviation, language, and copyright string. Without it the converter will
fall back to using the numeric ID as the translation code.

The metadata file is produced by the companion
[bibledotcom-scraper](https://github.com/KiwiGeek/bibledotcom-scraper) tool.
It is a JSON file with a timestamp-based name such as `20240318223222.json`.

Place it alongside your zip files or in a convenient location, e.g.
`~/bibles/20240318223222.json`.

---

## Step 4 – Convert

### Single file

```bash
node convert-yves.js path/to/100-14.zip \
  --metadata path/to/20240318223222.json \
  --output   path/to/output/dir
```

The tool will print progress and write a file like
`path/to/output/dir/nasb1995.js`.

### Batch mode – process a whole folder

If you have many zip files, point the tool at the folder containing them
and it will process all `*.zip` files it finds:

```bash
node convert-yves.js \
  --input    ~/bibles/downloads \
  --metadata ~/bibles/20240318223222.json \
  --output   ~/bibles/js
```

Output:

```
Found 5 zip file(s) to convert.

Converting "100-14.zip"...
  Code:      NASB1995
  Label:     New American Standard Bible 1995
  Language:  en
  Processed 1189 .yves files
  Books found: 66
  Output written to: /home/user/bibles/js/nasb1995.js

...

Done. 5 succeeded, 0 failed.
```

### Batch mode – current directory

Omit `--input` to scan the directory you run the command from:

```bash
cd ~/bibles/downloads
node /path/to/tools/yves-converter/convert-yves.js \
  --metadata ../20240318223222.json \
  --output   ../js
```

### Overriding the translation code (single-file only)

If the metadata file doesn't contain an entry for a given zip, or you want
to use a custom code, pass `--code`:

```bash
node convert-yves.js 100-14.zip --code NASB1995 --output ./out
```

> `--code` is ignored in batch mode because it cannot meaningfully apply to
> multiple different translations.

---

## Step 5 – Import into ChurchScribe

Once you have a `.js` file:

1. Open **ChurchScribe** in your browser.
2. Navigate to **Settings → Bible Translations**.
3. Either:
   - **Drag and drop** the `.js` file onto the page, **or**
   - Enter a **URL** pointing to the file in the "Import from URL" field (if
     you have hosted the file somewhere).

The new translation will appear in the translation selector immediately.

---

## All Options

```
node convert-yves.js [zip-file] [options]
```

| Option | Description |
|---|---|
| `zip-file` | Path to a single zip archive (optional; omit for batch mode) |
| `--input <dir>` | Directory to scan for `*.zip` files — batch mode only (default: current directory) |
| `--metadata <file>` | Path to the translations metadata JSON |
| `--output <dir>` | Directory to write generated `.js` files (default: current directory) |
| `--code <code>` | Override the translation code — single-file mode only |
| `--help` | Print help and exit |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `Error: no .yves files found in "..."` | The zip may not be a valid YouVersion offline archive, or may be corrupted. |
| Translation code is a number (e.g. `_100`) | The metadata file doesn't include that translation. Pass `--code` to supply the correct abbreviation. |
| `Error: metadata file not found` | Check the path passed to `--metadata`. |
| `Error: input directory not found` | Check the path passed to `--input`. |
| Missing books / verses | Some translations on Bible.com use non-standard book codes. Open an issue with the zip filename so the book-name mapping can be extended. |

---

## Copyright Notice

The generated `.js` files contain the text of copyrighted Bible translations.
**Do not distribute these files** unless you have the rights or license to do
so. The copyright string embedded in the output comes from the metadata JSON;
verify it is accurate before sharing any file.
