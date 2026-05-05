window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="cyberpunk"] {
  --font-heading: "Orbitron", sans-serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(5, 5, 20, 0.95);
  --surface-strong: #050514;
  --surface-accent: #0a0a2e;
  --text: #e0f7fa;
  --muted: #80cbc4;
  --border: rgba(0, 255, 255, 0.18);
  --accent: #00ffff;
  --accent-strong: #80ffff;
  --shadow: 0 0 60px rgba(0, 255, 255, 0.15);
  --hero-glow-left: rgba(0, 255, 255, 0.18);
  --hero-glow-right: rgba(180, 0, 255, 0.14);
  --page-gradient: linear-gradient(160deg, #000008 0%, #03000f 45%, #050018 100%);
  --grid-line-1: rgba(0, 255, 255, 0.12);
  --grid-line-2: rgba(0, 255, 255, 0.06);
  --panel-highlight: linear-gradient(180deg, rgba(0, 255, 255, 0.06), transparent 20%);
  --ghost-surface: rgba(0, 20, 30, 0.8);
  --tool-hover: #001e28;
  --tool-hover-border: rgba(0, 255, 255, 0.3);
  --editor-border: rgba(0, 255, 255, 0.1);
  --focus-ring: rgba(0, 255, 255, 0.35);
  --placeholder: rgba(128, 203, 196, 0.6);
  --blockquote-border: rgba(0, 255, 255, 0.5);
  --blockquote-text: #80cbc4;
  --scripture-gradient: linear-gradient(180deg, rgba(5, 5, 25, 0.99), rgba(3, 3, 18, 0.99));
  --select-surface: rgba(5, 10, 25, 0.95);
  --select-border: rgba(0, 255, 255, 0.15);
  --verse-surface: rgba(3, 5, 18, 0.95);
  --verse-border: rgba(0, 255, 255, 0.08);
  --list-text: #80cbc4;
  --input-surface: rgba(5, 10, 25, 0.95);
  --note-chip-surface: rgba(5, 10, 28, 0.9);
  --note-chip-active: #001e28;
  --note-chip-border: rgba(0, 255, 255, 0.15);
  --radius-xl: 4px;
  --radius-lg: 4px;
  --radius-md: 4px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "cyberpunk",
  name: "Cyberpunk",
  supports: "dark",
  swatches: ["#050514", "#00ffff", "#0a0a2e", "#e0f7fa"]
});
