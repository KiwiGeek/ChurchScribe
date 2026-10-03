window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="clean-paper"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: #ffffff;
  --surface-strong: #ffffff;
  --surface-accent: #f3f3f3;
  --text: #111111;
  --muted: #5c5c5c;
  --border: rgba(0, 0, 0, 0.14);
  --accent: #111111;
  --accent-strong: #000000;
  --shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --page-gradient: #f7f7f7;
  --grid-line-1: transparent;
  --grid-line-2: transparent;
  --panel-highlight: none;
  --ghost-surface: #ffffff;
  --tool-hover: #f0f0f0;
  --tool-hover-border: rgba(0, 0, 0, 0.18);
  --editor-border: rgba(0, 0, 0, 0.08);
  --focus-ring: rgba(0, 0, 0, 0.22);
  --placeholder: rgba(92, 92, 92, 0.55);
  --blockquote-border: rgba(0, 0, 0, 0.35);
  --blockquote-text: #333333;
  --scripture-gradient: #ffffff;
  --select-surface: #ffffff;
  --select-border: rgba(0, 0, 0, 0.16);
  --verse-surface: #fafafa;
  --verse-border: rgba(0, 0, 0, 0.08);
  --list-text: #333333;
  --input-surface: #ffffff;
  --note-chip-surface: #ffffff;
  --note-chip-active: #f0f0f0;
  --note-chip-border: rgba(0, 0, 0, 0.12);
  --radius-xl: 8px;
  --radius-lg: 6px;
  --radius-md: 4px;
  color-scheme: light;
}

[data-color-theme="clean-paper"] body::before {
  display: none;
}

[data-color-theme="clean-paper"] .panel {
  backdrop-filter: none;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04);
}

[data-color-theme="clean-paper"] .panel::after {
  display: none;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "clean-paper",
  name: "Clean Paper",
  supports: "light",
  featured: true,
  tags: ["minimal", "bold"],
  swatches: ["#ffffff", "#111111", "#f3f3f3", "#000000"]
});
