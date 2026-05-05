window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="graphite"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(245, 246, 248, 0.95);
  --surface-strong: #f5f5f7;
  --surface-accent: #e0e2e8;
  --text: #1a1c22;
  --muted: #5a5e6a;
  --border: rgba(74, 78, 88, 0.14);
  --accent: #4a4e58;
  --accent-strong: #30343e;
  --shadow: 0 24px 80px rgba(50, 55, 70, 0.12);
  --hero-glow-left: rgba(140, 145, 165, 0.22);
  --hero-glow-right: rgba(120, 125, 145, 0.14);
  --page-gradient: linear-gradient(160deg, #e8e8ec 0%, #dcdde4 45%, #d0d0da 100%);
  --grid-line-1: rgba(255, 255, 255, 0.26);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.38), transparent 20%);
  --ghost-surface: rgba(248, 249, 252, 0.78);
  --tool-hover: #e0e2e8;
  --tool-hover-border: rgba(74, 78, 88, 0.18);
  --editor-border: rgba(74, 78, 88, 0.08);
  --focus-ring: rgba(74, 78, 88, 0.24);
  --placeholder: rgba(90, 94, 106, 0.58);
  --blockquote-border: rgba(74, 78, 88, 0.32);
  --blockquote-text: #30343e;
  --scripture-gradient: linear-gradient(180deg, rgba(245, 246, 248, 0.97), rgba(224, 226, 232, 0.98));
  --select-surface: rgba(252, 252, 255, 0.92);
  --select-border: rgba(74, 78, 88, 0.12);
  --verse-surface: rgba(248, 249, 252, 0.88);
  --verse-border: rgba(74, 78, 88, 0.08);
  --list-text: #30343e;
  --input-surface: rgba(252, 252, 255, 0.94);
  --note-chip-surface: rgba(252, 252, 255, 0.78);
  --note-chip-active: #e0e2e8;
  --note-chip-border: rgba(74, 78, 88, 0.1);
  --radius-xl: 4px;
  --radius-lg: 3px;
  --radius-md: 2px;
  color-scheme: light;
}
[data-color-theme="graphite"][data-theme="dark"] {
  --surface: rgba(10, 10, 14, 0.96);
  --surface-strong: #0a0a0e;
  --surface-accent: #181820;
  --text: #e8e8f0;
  --muted: #9090a0;
  --border: rgba(140, 140, 160, 0.14);
  --accent: #8888a0;
  --accent-strong: #b0b0c8;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.62);
  --hero-glow-left: rgba(80, 80, 100, 0.2);
  --hero-glow-right: rgba(60, 60, 80, 0.14);
  --page-gradient: linear-gradient(160deg, #080808 0%, #0a0a0c 45%, #0e0e12 100%);
  --grid-line-1: rgba(140, 140, 160, 0.09);
  --grid-line-2: rgba(140, 140, 160, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(140, 140, 160, 0.06), transparent 20%);
  --ghost-surface: rgba(16, 16, 22, 0.84);
  --tool-hover: #181820;
  --tool-hover-border: rgba(140, 140, 160, 0.18);
  --editor-border: rgba(140, 140, 160, 0.09);
  --focus-ring: rgba(140, 140, 160, 0.26);
  --placeholder: rgba(144, 144, 160, 0.54);
  --blockquote-border: rgba(140, 140, 160, 0.36);
  --blockquote-text: #9090a0;
  --scripture-gradient: linear-gradient(180deg, rgba(10, 10, 14, 0.99), rgba(7, 7, 10, 0.99));
  --select-surface: rgba(10, 10, 14, 0.96);
  --select-border: rgba(140, 140, 160, 0.11);
  --verse-surface: rgba(8, 8, 12, 0.94);
  --verse-border: rgba(140, 140, 160, 0.07);
  --list-text: #9090a0;
  --input-surface: rgba(12, 12, 18, 0.96);
  --note-chip-surface: rgba(16, 16, 22, 0.86);
  --note-chip-active: #181820;
  --note-chip-border: rgba(140, 140, 160, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "graphite",
  name: "Graphite",
  supports: "both",
  swatches: ["#f5f5f7", "#4a4e58", "#e0e2e8", "#1a1c22"]
});
