window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="retro-arcade"] {
  --font-heading: "Orbitron", sans-serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(12, 5, 33, 0.95);
  --surface-strong: #0c0521;
  --surface-accent: #14082e;
  --text: #f0ffe0;
  --muted: #80ff60;
  --border: rgba(57, 255, 20, 0.18);
  --accent: #39ff14;
  --accent-strong: #80ff60;
  --shadow: 0 0 60px rgba(57, 255, 20, 0.12);
  --hero-glow-left: rgba(57, 255, 20, 0.16);
  --hero-glow-right: rgba(160, 30, 220, 0.14);
  --page-gradient: linear-gradient(160deg, #060014 0%, #0d0020 45%, #120030 100%);
  --grid-line-1: rgba(57, 255, 20, 0.12);
  --grid-line-2: rgba(57, 255, 20, 0.06);
  --panel-highlight: linear-gradient(180deg, rgba(57, 255, 20, 0.05), transparent 20%);
  --ghost-surface: rgba(18, 8, 44, 0.82);
  --tool-hover: #160a30;
  --tool-hover-border: rgba(57, 255, 20, 0.28);
  --editor-border: rgba(57, 255, 20, 0.1);
  --focus-ring: rgba(57, 255, 20, 0.3);
  --placeholder: rgba(128, 255, 96, 0.55);
  --blockquote-border: rgba(57, 255, 20, 0.45);
  --blockquote-text: #80ff60;
  --scripture-gradient: linear-gradient(180deg, rgba(14, 6, 36, 0.99), rgba(9, 3, 24, 0.99));
  --select-surface: rgba(14, 6, 36, 0.96);
  --select-border: rgba(57, 255, 20, 0.14);
  --verse-surface: rgba(10, 4, 28, 0.94);
  --verse-border: rgba(57, 255, 20, 0.08);
  --list-text: #80ff60;
  --input-surface: rgba(14, 6, 36, 0.96);
  --note-chip-surface: rgba(16, 8, 40, 0.9);
  --note-chip-active: #160a30;
  --note-chip-border: rgba(57, 255, 20, 0.15);
  --radius-xl: 4px;
  --radius-lg: 4px;
  --radius-md: 2px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "retro-arcade",
  name: "Retro Arcade",
  supports: "dark",
  swatches: ["#0c0521", "#39ff14", "#14082e", "#f0ffe0"]
});
