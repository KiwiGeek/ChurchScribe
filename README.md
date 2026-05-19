# Scriptoria

Scriptoria is a lightweight, privacy-friendly sermon and Bible-study note-taking tool that runs entirely in your browser.

## Highlights

- Local-first storage, with entries kept in your browser unless you choose a sync or backup provider.
- Offline-friendly static web app with desktop and mobile layouts.
- Rich-text note editing with headings, lists, quotes, tables, and images.
- Automatic scripture-reference linking with configurable abbreviations and built-in scripture panels.
- Customizable entry types, metadata fields, themes, and user-imported translations.
- Optional sync and backup support for Local Drive, Google Drive, and OneDrive.

## Getting started

There is no build step for local development; this repository is served as static files.

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>.

- Add `?mobile=1` to force the mobile view.
- Add `?desktop=1` to stay on the desktop view.

## Data and privacy

Scriptoria is local-first by default. Your entries stay on your device unless you explicitly connect a sync or backup provider or export a backup file.

## Deployment

GitHub Actions deploys the repository contents to GitHub Pages when changes are pushed to `master`.

## License

This project is licensed under the Mozilla Public License 2.0 (`MPL-2.0`).

MPL 2.0 is a permissive, file-level copyleft license: attribution notices must be preserved, and if you distribute modified MPL-covered files you must make the corresponding source for those files available under the same license. See [/LICENSE](LICENSE) for the full text.
