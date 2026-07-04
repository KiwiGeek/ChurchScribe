window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="evensong"] {
  --font-heading: "Manrope", system-ui, sans-serif;
  --font-body: "Manrope", system-ui, sans-serif;
  --surface: #ffffff;
  --surface-strong: #ffffff;
  --surface-accent: #e9eef5;
  --text: #16202e;
  --muted: #5c6b80;
  --border: rgba(31, 58, 95, 0.16);
  --accent: #1f3a5f;
  --accent-strong: #16293f;
  --shadow: none;
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --page-gradient: #f2f5f9;
  --grid-line-1: transparent;
  --grid-line-2: transparent;
  --panel-highlight: none;
  --ghost-surface: #ffffff;
  --tool-hover: #e9eef5;
  --tool-hover-border: rgba(31, 58, 95, 0.22);
  --editor-border: rgba(31, 58, 95, 0.08);
  --focus-ring: rgba(31, 58, 95, 0.25);
  --placeholder: rgba(92, 107, 128, 0.6);
  --blockquote-border: rgba(31, 58, 95, 0.45);
  --blockquote-text: #33455e;
  --scripture-gradient: #ffffff;
  --select-surface: #ffffff;
  --select-border: rgba(31, 58, 95, 0.16);
  --verse-surface: #fbfcfe;
  --verse-border: rgba(31, 58, 95, 0.08);
  --list-text: #33455e;
  --input-surface: #ffffff;
  --note-chip-surface: #ffffff;
  --note-chip-active: #e9eef5;
  --note-chip-border: rgba(31, 58, 95, 0.14);
  --radius-xl: 10px;
  --radius-lg: 8px;
  --radius-md: 6px;
  color-scheme: light;
}
[data-color-theme="evensong"][data-theme="dark"] {
  --surface: #101a2b;
  --surface-strong: #101a2b;
  --surface-accent: #1a2740;
  --text: #e3e9f2;
  --muted: #8fa0b8;
  --border: rgba(168, 196, 230, 0.14);
  --accent: #7da2cf;
  --accent-strong: #a8c4e6;
  --shadow: none;
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --page-gradient: #0b1220;
  --grid-line-1: transparent;
  --grid-line-2: transparent;
  --panel-highlight: none;
  --ghost-surface: #101a2b;
  --tool-hover: #1a2740;
  --tool-hover-border: rgba(168, 196, 230, 0.2);
  --editor-border: rgba(168, 196, 230, 0.08);
  --focus-ring: rgba(125, 162, 207, 0.3);
  --placeholder: rgba(143, 160, 184, 0.6);
  --blockquote-border: rgba(125, 162, 207, 0.45);
  --blockquote-text: #b6c5da;
  --scripture-gradient: #101a2b;
  --select-surface: #152034;
  --select-border: rgba(168, 196, 230, 0.14);
  --verse-surface: #131e31;
  --verse-border: rgba(168, 196, 230, 0.08);
  --list-text: #b6c5da;
  --input-surface: #152034;
  --note-chip-surface: #152034;
  --note-chip-active: #1a2740;
  --note-chip-border: rgba(168, 196, 230, 0.12);
  color-scheme: dark;
}

/* ── Declutter: strip decorative chrome, keep the layout ─────────────────── */

/* No background grid overlay */
[data-color-theme="evensong"] body::before {
  display: none;
}

/* Flat panels: no glass blur, no gloss overlay, hairline borders only */
[data-color-theme="evensong"] .panel {
  backdrop-filter: none;
  box-shadow: none;
}

[data-color-theme="evensong"] .panel::after {
  display: none;
}

/* No hover "lift" animations */
[data-color-theme="evensong"] .theme-toggle:hover,
[data-color-theme="evensong"] .theme-toggle:focus-visible,
[data-color-theme="evensong"] .ghost-button:hover,
[data-color-theme="evensong"] .field select:hover {
  transform: none;
}

/* Quieter header: smaller wordmark, less vertical padding */
[data-color-theme="evensong"] .app-header h1 {
  font-size: 1.25rem;
}

[data-color-theme="evensong"] .app-shell {
  padding: 10px 12px 12px;
}

[data-color-theme="evensong"] .app-header {
  margin-bottom: 8px;
}

/* Tone down uppercase kicker labels */
[data-color-theme="evensong"] .eyebrow,
[data-color-theme="evensong"] .panel-kicker {
  letter-spacing: 0.08em;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "evensong",
  name: "Evensong",
  supports: "both",
  swatches: ["#f2f5f9", "#1f3a5f", "#7da2cf", "#0b1220"]
});
