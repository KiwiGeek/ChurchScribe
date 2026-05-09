window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="peach-blossom"] {
  --font-heading: "Playfair Display", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 250, 245, 0.95);
  --surface-strong: #fffaf5;
  --surface-accent: #fde0cc;
  --text: #2a1200;
  --muted: #a05030;
  --border: rgba(210, 100, 40, 0.14);
  --accent: #e07030;
  --accent-strong: #b04c1a;
  --shadow: 0 24px 80px rgba(180, 80, 20, 0.12);
  --hero-glow-left: rgba(232, 116, 42, 0.26);
  --hero-glow-right: rgba(255, 160, 80, 0.18);
  --page-gradient: linear-gradient(160deg, #fff0e0 0%, #fde0cc 45%, #f8c8a8 100%);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.40), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.76);
  --tool-hover: #fde0cc;
  --tool-hover-border: rgba(210, 100, 40, 0.20);
  --editor-border: rgba(210, 100, 40, 0.07);
  --focus-ring: rgba(210, 100, 40, 0.24);
  --placeholder: rgba(160, 80, 48, 0.60);
  --blockquote-border: rgba(210, 100, 40, 0.36);
  --blockquote-text: #7a3a10;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 250, 245, 0.97), rgba(253, 224, 204, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(210, 100, 40, 0.12);
  --verse-surface: rgba(255, 252, 248, 0.88);
  --verse-border: rgba(210, 100, 40, 0.08);
  --list-text: #7a3a10;
  --input-surface: rgba(255, 255, 255, 0.95);
  --note-chip-surface: rgba(255, 255, 255, 0.78);
  --note-chip-active: #fde0cc;
  --note-chip-border: rgba(210, 100, 40, 0.12);
  --radius-xl: 32px;
  --radius-lg: 24px;
  --radius-md: 16px;
  color-scheme: light;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "peach-blossom",
  name: "Peach Blossom",
  supports: "light",
  swatches: ["#fffaf5", "#e07030", "#fde0cc", "#2a1200"]
});
