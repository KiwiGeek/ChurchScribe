window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="tangerine-dream"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 250, 242, 0.95);
  --surface-strong: #fff8f0;
  --surface-accent: #ffe0b8;
  --text: #1e0800;
  --muted: #a04820;
  --border: rgba(240, 96, 16, 0.16);
  --accent: #f06010;
  --accent-strong: #c84000;
  --shadow: 0 24px 80px rgba(220, 100, 20, 0.16);
  --hero-glow-left: rgba(255, 140, 30, 0.32);
  --hero-glow-right: rgba(240, 96, 16, 0.2);
  --page-gradient: linear-gradient(160deg, #fff0d8 0%, #ffd890 45%, #ffc060 100%);
  --grid-line-1: rgba(255, 255, 255, 0.26);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.38), transparent 20%);
  --ghost-surface: rgba(255, 252, 246, 0.8);
  --tool-hover: #ffe0b8;
  --tool-hover-border: rgba(240, 96, 16, 0.2);
  --editor-border: rgba(240, 96, 16, 0.08);
  --focus-ring: rgba(240, 96, 16, 0.28);
  --placeholder: rgba(160, 72, 32, 0.6);
  --blockquote-border: rgba(240, 96, 16, 0.4);
  --blockquote-text: #b03000;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 250, 242, 0.97), rgba(255, 224, 184, 0.98));
  --select-surface: rgba(255, 253, 248, 0.94);
  --select-border: rgba(240, 96, 16, 0.12);
  --verse-surface: rgba(255, 253, 248, 0.9);
  --verse-border: rgba(240, 96, 16, 0.08);
  --list-text: #b03000;
  --input-surface: rgba(255, 253, 248, 0.96);
  --note-chip-surface: rgba(255, 253, 248, 0.82);
  --note-chip-active: #ffe0b8;
  --note-chip-border: rgba(240, 96, 16, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "tangerine-dream",
  name: "Tangerine Dream",
  supports: "light",
  swatches: ["#fff8f0", "#f06010", "#ffe0b8", "#1e0800"]
});
