window.colorThemes = window.colorThemes || [];

// Dyslexia-focused reading theme: OpenDyslexic typeface, soft cream (not
// pure white), slate text (not pure black), extra tracking/leading, and a
// quiet page so scripture and notes stay easy to scan.
(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="easy-read"] {
  --font-heading: "OpenDyslexic", "Comic Sans MS", sans-serif;
  --font-body: "OpenDyslexic", "Comic Sans MS", sans-serif;
  --surface: #fff8ee;
  --surface-strong: #fffaf3;
  --surface-accent: #f3e8d4;
  --text: #243447;
  --muted: #5a6b7d;
  --border: rgba(36, 52, 71, 0.16);
  --accent: #2f6f8f;
  --accent-strong: #1f536c;
  --shadow: 0 14px 36px rgba(36, 52, 71, 0.08);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --page-gradient: #f7efe2;
  --grid-line-1: transparent;
  --grid-line-2: transparent;
  --panel-highlight: none;
  --ghost-surface: #fffaf3;
  --tool-hover: #efe2cc;
  --tool-hover-border: rgba(36, 52, 71, 0.18);
  --editor-border: rgba(36, 52, 71, 0.1);
  --focus-ring: rgba(47, 111, 143, 0.32);
  --placeholder: rgba(90, 107, 125, 0.65);
  --blockquote-border: rgba(47, 111, 143, 0.4);
  --blockquote-text: #314456;
  --scripture-gradient: #fffaf3;
  --select-surface: #fffaf3;
  --select-border: rgba(36, 52, 71, 0.18);
  --verse-surface: #fff4e4;
  --verse-border: rgba(36, 52, 71, 0.1);
  --list-text: #314456;
  --input-surface: #fffaf3;
  --note-chip-surface: #fffaf3;
  --note-chip-active: #efe2cc;
  --note-chip-border: rgba(36, 52, 71, 0.14);
  --radius-xl: 12px;
  --radius-lg: 10px;
  --radius-md: 8px;
  color-scheme: light;
}

[data-color-theme="easy-read"][data-theme="dark"] {
  --surface: #1b2430;
  --surface-strong: #151c26;
  --surface-accent: #243140;
  --text: #f0e6d4;
  --muted: #b7c0cb;
  --border: rgba(240, 230, 212, 0.16);
  --accent: #7eb7d4;
  --accent-strong: #a7d0e6;
  --shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --page-gradient: #121820;
  --grid-line-1: transparent;
  --grid-line-2: transparent;
  --panel-highlight: none;
  --ghost-surface: #1b2430;
  --tool-hover: #2a3a4c;
  --tool-hover-border: rgba(240, 230, 212, 0.18);
  --editor-border: rgba(240, 230, 212, 0.1);
  --focus-ring: rgba(126, 183, 212, 0.34);
  --placeholder: rgba(183, 192, 203, 0.65);
  --blockquote-border: rgba(126, 183, 212, 0.42);
  --blockquote-text: #d7dee6;
  --scripture-gradient: #151c26;
  --select-surface: #1b2430;
  --select-border: rgba(240, 230, 212, 0.16);
  --verse-surface: #202b38;
  --verse-border: rgba(240, 230, 212, 0.1);
  --list-text: #d7dee6;
  --input-surface: #1b2430;
  --note-chip-surface: #1b2430;
  --note-chip-active: #2a3a4c;
  --note-chip-border: rgba(240, 230, 212, 0.14);
  color-scheme: dark;
}

[data-color-theme="easy-read"] body::before {
  display: none;
}

[data-color-theme="easy-read"] .panel {
  backdrop-filter: none;
  box-shadow: 0 1px 0 rgba(36, 52, 71, 0.05), 0 10px 28px rgba(36, 52, 71, 0.06);
}

[data-color-theme="easy-read"][data-theme="dark"] .panel {
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04), 0 12px 32px rgba(0, 0, 0, 0.28);
}

[data-color-theme="easy-read"] .panel::after {
  display: none;
}

[data-color-theme="easy-read"] body,
[data-color-theme="easy-read"] button,
[data-color-theme="easy-read"] input,
[data-color-theme="easy-read"] select,
[data-color-theme="easy-read"] textarea {
  letter-spacing: 0.04em;
  word-spacing: 0.08em;
}

[data-color-theme="easy-read"] .app-header h1 {
  letter-spacing: 0.03em;
}

[data-color-theme="easy-read"] .note-editor {
  font-size: 1.12rem;
  line-height: 1.9;
  letter-spacing: 0.045em;
  word-spacing: 0.1em;
}

[data-color-theme="easy-read"] .chapter-verse {
  font-size: 1.12rem;
  line-height: 2;
  letter-spacing: 0.045em;
  word-spacing: 0.1em;
  max-width: 42rem;
}

[data-color-theme="easy-read"] .verse-text {
  font-family: var(--font-heading);
  font-size: clamp(1.45rem, 2.2vw, 1.95rem);
  line-height: 1.65;
  letter-spacing: 0.04em;
  word-spacing: 0.08em;
}

[data-color-theme="easy-read"] .verse-reference,
[data-color-theme="easy-read"] .field label,
[data-color-theme="easy-read"] .settings-copy,
[data-color-theme="easy-read"] .theme-card-name,
[data-color-theme="easy-read"] .theme-card-meta {
  letter-spacing: 0.03em;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "easy-read",
  name: "Easy Read",
  supports: "both",
  featured: true,
  tags: ["minimal", "bold"],
  swatches: ["#f7efe2", "#2f6f8f", "#fff8ee", "#121820"]
});
