window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="papyrus-script"] {
  --font-heading: "Cinzel", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(245, 240, 220, 0.96);
  --surface-strong: #f5eedc;
  --surface-accent: #e8dac0;
  --text: #1e1008;
  --muted: #6a5030;
  --border: rgba(74, 56, 32, 0.16);
  --accent: #4a3820;
  --accent-strong: #2e2010;
  --shadow: 0 24px 80px rgba(60, 40, 20, 0.15);
  --hero-glow-left: rgba(160, 130, 80, 0.24);
  --hero-glow-right: rgba(140, 110, 60, 0.16);
  --page-gradient: linear-gradient(160deg, #ede4c8 0%, #e4d8b0 45%, #dac898 100%);
  --grid-line-1: rgba(255, 255, 255, 0.22);
  --grid-line-2: rgba(255, 255, 255, 0.12);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.32), transparent 20%);
  --ghost-surface: rgba(245, 238, 220, 0.76);
  --tool-hover: #e8dac0;
  --tool-hover-border: rgba(74, 56, 32, 0.2);
  --editor-border: rgba(74, 56, 32, 0.08);
  --focus-ring: rgba(74, 56, 32, 0.24);
  --placeholder: rgba(106, 80, 48, 0.6);
  --blockquote-border: rgba(74, 56, 32, 0.36);
  --blockquote-text: #3a2010;
  --scripture-gradient: linear-gradient(180deg, rgba(245, 240, 220, 0.97), rgba(232, 218, 192, 0.98));
  --select-surface: rgba(252, 248, 232, 0.94);
  --select-border: rgba(74, 56, 32, 0.12);
  --verse-surface: rgba(250, 244, 228, 0.9);
  --verse-border: rgba(74, 56, 32, 0.08);
  --list-text: #3a2010;
  --input-surface: rgba(252, 248, 232, 0.96);
  --note-chip-surface: rgba(252, 248, 232, 0.8);
  --note-chip-active: #e8dac0;
  --note-chip-border: rgba(74, 56, 32, 0.1);
  --radius-xl: 4px;
  --radius-lg: 3px;
  --radius-md: 2px;
  color-scheme: light;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "papyrus-script",
  name: "Papyrus Script",
  supports: "light",
  swatches: ["#f5eedc", "#4a3820", "#e8dac0", "#1e1008"]
});
