window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="ivory-grace"] {
  --font-heading: "Cinzel", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 252, 245, 0.97);
  --surface-strong: #fffcf5;
  --surface-accent: #f0e8d8;
  --text: #2a1e0a;
  --muted: #7a6040;
  --border: rgba(160, 120, 80, 0.14);
  --accent: #a07850;
  --accent-strong: #7a5430;
  --shadow: 0 24px 80px rgba(100, 70, 30, 0.10);
  --hero-glow-left: rgba(160, 120, 80, 0.20);
  --hero-glow-right: rgba(200, 160, 100, 0.14);
  --page-gradient: linear-gradient(160deg, #fdf6e8 0%, #f5ebcf 45%, #e8d8b0 100%);
  --grid-line-1: rgba(255, 255, 255, 0.30);
  --grid-line-2: rgba(255, 255, 255, 0.18);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.42), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.78);
  --tool-hover: #f0e8d8;
  --tool-hover-border: rgba(160, 120, 80, 0.20);
  --editor-border: rgba(160, 120, 80, 0.07);
  --focus-ring: rgba(160, 120, 80, 0.22);
  --placeholder: rgba(122, 96, 64, 0.58);
  --blockquote-border: rgba(160, 120, 80, 0.36);
  --blockquote-text: #5c3e1e;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 252, 245, 0.98), rgba(240, 232, 216, 0.98));
  --select-surface: rgba(255, 255, 255, 0.94);
  --select-border: rgba(160, 120, 80, 0.12);
  --verse-surface: rgba(255, 254, 250, 0.90);
  --verse-border: rgba(160, 120, 80, 0.07);
  --list-text: #5c3e1e;
  --input-surface: rgba(255, 255, 255, 0.96);
  --note-chip-surface: rgba(255, 255, 255, 0.82);
  --note-chip-active: #f0e8d8;
  --note-chip-border: rgba(160, 120, 80, 0.12);
  --radius-xl: 6px;
  --radius-lg: 5px;
  --radius-md: 4px;
  color-scheme: light;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "ivory-grace",
  name: "Ivory Grace",
  supports: "light",
  swatches: ["#fffcf5", "#a07850", "#f0e8d8", "#2a1e0a"]
});
