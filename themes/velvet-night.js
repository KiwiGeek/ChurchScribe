window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="velvet-night"] {
  --font-heading: "Playfair Display", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(12, 6, 22, 0.96);
  --surface-strong: #0c0616;
  --surface-accent: #1a0e2e;
  --text: #f0e0ff;
  --muted: #c090e8;
  --border: rgba(176, 102, 232, 0.16);
  --accent: #b066e8;
  --accent-strong: #d088ff;
  --shadow: 0 0 80px rgba(140, 60, 200, 0.2);
  --hero-glow-left: rgba(120, 40, 180, 0.32);
  --hero-glow-right: rgba(180, 80, 240, 0.18);
  --page-gradient: linear-gradient(160deg, #080412 0%, #0c0618 45%, #100a20 100%);
  --grid-line-1: rgba(176, 102, 232, 0.1);
  --grid-line-2: rgba(176, 102, 232, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(176, 102, 232, 0.08), transparent 20%);
  --ghost-surface: rgba(16, 10, 28, 0.86);
  --tool-hover: #1a0e2e;
  --tool-hover-border: rgba(176, 102, 232, 0.24);
  --editor-border: rgba(176, 102, 232, 0.1);
  --focus-ring: rgba(176, 102, 232, 0.34);
  --placeholder: rgba(192, 144, 232, 0.58);
  --blockquote-border: rgba(176, 102, 232, 0.44);
  --blockquote-text: #c090e8;
  --scripture-gradient: linear-gradient(180deg, rgba(12, 6, 22, 0.99), rgba(8, 4, 16, 0.99));
  --select-surface: rgba(12, 6, 22, 0.96);
  --select-border: rgba(176, 102, 232, 0.12);
  --verse-surface: rgba(10, 5, 18, 0.94);
  --verse-border: rgba(176, 102, 232, 0.08);
  --list-text: #c090e8;
  --input-surface: rgba(14, 8, 24, 0.96);
  --note-chip-surface: rgba(18, 10, 28, 0.88);
  --note-chip-active: #1a0e2e;
  --note-chip-border: rgba(176, 102, 232, 0.16);
  --radius-xl: 32px;
  --radius-lg: 24px;
  --radius-md: 16px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "velvet-night",
  name: "Velvet Night",
  supports: "dark",
  swatches: ["#0e0818", "#b066e8", "#1c1030", "#f0e0ff"]
});
