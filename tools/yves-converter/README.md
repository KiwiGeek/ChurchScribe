# Yves to ChurchScribe Converter

Converts Yves-encrypted Bible zip files (from YouVersion/Bible.com offline
downloads) into ChurchScribe JS translation files.

## Background

YouVersion distributes offline Bible translations as zip archives containing
`.yves` files. Each `.yves` file is an encrypted HTML file representing one
chapter of scripture. The HTML structure follows the
[Unified Scripture XML (USX)](https://ubsicap.github.io/usx/) conventions.

The zip files are named `<translation-id>-<revision>.zip` (e.g. `100-14.zip`
for NASB 1995 revision 14).

## Prerequisites

- Node.js 18 or newer
- npm

## Setup

```bash
cd tools/yves-converter
npm install
```

## Usage

```
node convert-yves.js [zip-file] [options]
```

If no `zip-file` is supplied the tool automatically processes **every `*.zip`
file in the current directory** (batch mode).

### Options

| Option | Description |
|---|---|
| `--metadata <file>` | Path to the translations metadata JSON (see below) |
| `--input <dir>` | Directory to scan for `*.zip` files — batch mode only (default: current directory) |
| `--output <dir>` | Output directory for generated `.js` files (default: current directory) |
| `--code <code>` | Override the translation code — single-file mode only |
| `--help` | Show help message |

### Examples

Convert a single zip file using the translations metadata:

```bash
node convert-yves.js 100-14.zip \
  --metadata 20240318223222.json \
  --output ./out
```

Process all zip files in the current directory (batch mode):

```bash
node convert-yves.js --metadata 20240318223222.json --output ./out
```

Process all zip files from a specific directory (batch mode with `--input`):

```bash
node convert-yves.js \
  --input ./downloads \
  --metadata 20240318223222.json \
  --output ./out
```

Convert a single file without metadata, using a manually specified code:

```bash
node convert-yves.js 100-14.zip --code NASB1995 --output ./out
```

## Metadata JSON

The optional metadata JSON file is produced by the
[bibledotcom-scraper](https://github.com/KiwiGeek/bibledotcom-scraper) tool and
contains information about each translation (title, language, abbreviation,
offline URL, etc.). It has the structure:

```json
{
  "Languages": [ ... ],
  "Versions": {
    "<tag>|<id>": {
      "Id": 100,
      "Abbreviation": "NASB1995",
      "Title": "New American Standard Bible 1995",
      "Language": { "Iso639_1": "en", ... },
      ...
    },
    ...
  }
}
```

## Output Format

The tool produces a single `.js` file that matches the ChurchScribe translation
format used by the built-in translations (KJV, NKJV, ASV, WEB). For example:

```js
window.NASB1995_VERSION = 1;
window.NASB1995_LABEL = "New American Standard Bible 1995";
window.NASB1995_LANGUAGE = "en";
window.NASB1995_COPYRIGHT = "";
window.NASB1995_BIBLE = {
  "Genesis": [
    {
      "chapter": 1,
      "verses": [
        { "verse": 1, "text": "In the beginning God created the heavens and the earth." },
        ...
      ]
    }
  ],
  ...
};
```

When a verse contains inline formatting, an `html` field is added alongside
`text`. The following USX inline classes are converted:

| USX class | HTML output |
|---|---|
| `.it` | `<em>` (italics / translator-added words) |
| `.sc` | `<small>` (small caps) |
| `.nd` | `<span class="divine-name">` (name of deity) |
| `.wj` | `<span class="words-of-jesus">` (words of Jesus) |
| `.note` | Excluded entirely (footnotes are not included) |

## Importing into ChurchScribe

Once you have a `.js` file, you can import it into ChurchScribe:

1. Open ChurchScribe in your browser.
2. Go to **Settings → Bible Translations**.
3. Drag and drop the `.js` file onto the page, **or** enter a URL to the hosted
   file in the "Import from URL" field.

## Copyright Notice

The output files contain the text of copyrighted Bible translations. Please
ensure you have the appropriate rights and licenses before distributing the
generated files. The `--code` flag or post-processing is recommended to add an
accurate copyright notice to the output.
