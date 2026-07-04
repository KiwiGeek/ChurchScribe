window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="plainsong"] {
  --font-heading: "Manrope", system-ui, sans-serif;
  --font-body: "Manrope", system-ui, sans-serif;
  --surface: #ffffff;
  --surface-strong: #ffffff;
  --surface-accent: #f0f0ee;
  --text: #1c1c1c;
  --muted: #6f6f6c;
  --border: rgba(0, 0, 0, 0.1);
  --accent: #4a6b8a;
  --accent-strong: #33506b;
  --shadow: none;
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --page-gradient: #f6f6f4;
  --grid-line-1: transparent;
  --grid-line-2: transparent;
  --panel-highlight: none;
  --ghost-surface: #ffffff;
  --tool-hover: #f0f0ee;
  --tool-hover-border: rgba(0, 0, 0, 0.14);
  --editor-border: rgba(0, 0, 0, 0.06);
  --focus-ring: rgba(74, 107, 138, 0.25);
  --placeholder: rgba(111, 111, 108, 0.6);
  --blockquote-border: rgba(74, 107, 138, 0.4);
  --blockquote-text: #4a4a48;
  --scripture-gradient: #ffffff;
  --select-surface: #ffffff;
  --select-border: rgba(0, 0, 0, 0.12);
  --verse-surface: #fcfcfb;
  --verse-border: rgba(0, 0, 0, 0.06);
  --list-text: #4a4a48;
  --input-surface: #ffffff;
  --note-chip-surface: #ffffff;
  --note-chip-active: #f0f0ee;
  --note-chip-border: rgba(0, 0, 0, 0.1);
  --radius-xl: 10px;
  --radius-lg: 8px;
  --radius-md: 6px;
  color-scheme: light;
}
[data-color-theme="plainsong"][data-theme="dark"] {
  --surface: #1a1c1e;
  --surface-strong: #1a1c1e;
  --surface-accent: #24272a;
  --text: #e6e6e4;
  --muted: #969693;
  --border: rgba(255, 255, 255, 0.12);
  --accent: #7fa3c4;
  --accent-strong: #a6c4de;
  --shadow: none;
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --page-gradient: #131416;
  --grid-line-1: transparent;
  --grid-line-2: transparent;
  --panel-highlight: none;
  --ghost-surface: #1a1c1e;
  --tool-hover: #24272a;
  --tool-hover-border: rgba(255, 255, 255, 0.16);
  --editor-border: rgba(255, 255, 255, 0.07);
  --focus-ring: rgba(127, 163, 196, 0.3);
  --placeholder: rgba(150, 150, 147, 0.6);
  --blockquote-border: rgba(127, 163, 196, 0.4);
  --blockquote-text: #b8b8b5;
  --scripture-gradient: #1a1c1e;
  --select-surface: #1f2224;
  --select-border: rgba(255, 255, 255, 0.12);
  --verse-surface: #1d2022;
  --verse-border: rgba(255, 255, 255, 0.07);
  --list-text: #b8b8b5;
  --input-surface: #1f2224;
  --note-chip-surface: #1f2224;
  --note-chip-active: #24272a;
  --note-chip-border: rgba(255, 255, 255, 0.1);
  color-scheme: dark;
}

/* ── Declutter: strip decorative chrome, keep the layout ─────────────────── */

/* No background grid overlay */
[data-color-theme="plainsong"] body::before {
  display: none;
}

/* Flat panels: no glass blur, no gloss overlay, hairline borders only */
[data-color-theme="plainsong"] .panel {
  backdrop-filter: none;
  box-shadow: none;
}

[data-color-theme="plainsong"] .panel::after {
  display: none;
}

/* No hover "lift" animations */
[data-color-theme="plainsong"] .theme-toggle:hover,
[data-color-theme="plainsong"] .theme-toggle:focus-visible,
[data-color-theme="plainsong"] .ghost-button:hover,
[data-color-theme="plainsong"] .field select:hover {
  transform: none;
}

/* Quieter header: smaller wordmark, less vertical padding */
[data-color-theme="plainsong"] .app-header h1 {
  font-size: 1.25rem;
}

[data-color-theme="plainsong"] .app-shell {
  padding: 10px 12px 12px;
}

[data-color-theme="plainsong"] .app-header {
  margin-bottom: 8px;
}

/* Tone down uppercase kicker labels */
[data-color-theme="plainsong"] .eyebrow,
[data-color-theme="plainsong"] .panel-kicker {
  letter-spacing: 0.08em;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "plainsong",
  name: "Plainsong",
  supports: "both",
  swatches: ["#f6f6f4", "#4a6b8a", "#ffffff", "#131416"]
});
