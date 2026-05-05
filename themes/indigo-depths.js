window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="indigo-depths"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(244, 244, 255, 0.94);
  --surface-strong: #f0f0ff;
  --surface-accent: #ddd9ff;
  --text: #0e0c2e;
  --muted: #4a46a0;
  --border: rgba(55, 48, 163, 0.14);
  --accent: #3730a3;
  --accent-strong: #2820a0;
  --shadow: 0 24px 80px rgba(55, 48, 163, 0.16);
  --hero-glow-left: rgba(100, 90, 220, 0.28);
  --hero-glow-right: rgba(80, 70, 200, 0.18);
  --page-gradient: linear-gradient(160deg, #ebebff 0%, #dbd7ff 45%, #cac5ff 100%);
  --grid-line-1: rgba(255, 255, 255, 0.24);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.36), transparent 20%);
  --ghost-surface: rgba(248, 248, 255, 0.76);
  --tool-hover: #ddd9ff;
  --tool-hover-border: rgba(55, 48, 163, 0.2);
  --editor-border: rgba(55, 48, 163, 0.08);
  --focus-ring: rgba(55, 48, 163, 0.26);
  --placeholder: rgba(74, 70, 160, 0.62);
  --blockquote-border: rgba(55, 48, 163, 0.36);
  --blockquote-text: #2820a0;
  --scripture-gradient: linear-gradient(180deg, rgba(244, 244, 255, 0.97), rgba(221, 217, 255, 0.98));
  --select-surface: rgba(252, 252, 255, 0.92);
  --select-border: rgba(55, 48, 163, 0.12);
  --verse-surface: rgba(248, 248, 255, 0.88);
  --verse-border: rgba(55, 48, 163, 0.08);
  --list-text: #2820a0;
  --input-surface: rgba(252, 252, 255, 0.94);
  --note-chip-surface: rgba(252, 252, 255, 0.78);
  --note-chip-active: #ddd9ff;
  --note-chip-border: rgba(55, 48, 163, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="indigo-depths"][data-theme="dark"] {
  --surface: rgba(6, 4, 22, 0.94);
  --surface-strong: #060416;
  --surface-accent: #0e0c30;
  --text: #e8e6ff;
  --muted: #9090e0;
  --border: rgba(120, 110, 230, 0.16);
  --accent: #8080f0;
  --accent-strong: #a0a0ff;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.56);
  --hero-glow-left: rgba(60, 50, 180, 0.28);
  --hero-glow-right: rgba(40, 30, 140, 0.2);
  --page-gradient: linear-gradient(160deg, #040214 0%, #060416 45%, #080620 100%);
  --grid-line-1: rgba(120, 110, 230, 0.1);
  --grid-line-2: rgba(120, 110, 230, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(100, 90, 220, 0.08), transparent 20%);
  --ghost-surface: rgba(10, 8, 28, 0.84);
  --tool-hover: #0e0c30;
  --tool-hover-border: rgba(120, 110, 230, 0.22);
  --editor-border: rgba(120, 110, 230, 0.1);
  --focus-ring: rgba(120, 110, 230, 0.32);
  --placeholder: rgba(144, 144, 224, 0.58);
  --blockquote-border: rgba(120, 110, 230, 0.42);
  --blockquote-text: #9090e0;
  --scripture-gradient: linear-gradient(180deg, rgba(6, 4, 22, 0.99), rgba(4, 2, 16, 0.99));
  --select-surface: rgba(6, 4, 22, 0.96);
  --select-border: rgba(120, 110, 230, 0.12);
  --verse-surface: rgba(5, 3, 18, 0.94);
  --verse-border: rgba(120, 110, 230, 0.08);
  --list-text: #9090e0;
  --input-surface: rgba(8, 6, 24, 0.96);
  --note-chip-surface: rgba(10, 8, 28, 0.88);
  --note-chip-active: #0e0c30;
  --note-chip-border: rgba(120, 110, 230, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "indigo-depths",
  name: "Indigo Depths",
  supports: "both",
  swatches: ["#f0f0ff", "#3730a3", "#ddd9ff", "#0e0c2e"]
});
