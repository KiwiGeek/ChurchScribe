window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="marigold"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 253, 232, 0.95);
  --surface-strong: #fffde8;
  --surface-accent: #fff3b0;
  --text: #1a1200;
  --muted: #806000;
  --border: rgba(245, 168, 0, 0.16);
  --accent: #f5a800;
  --accent-strong: #c88000;
  --shadow: 0 24px 80px rgba(200, 140, 0, 0.16);
  --hero-glow-left: rgba(255, 200, 0, 0.35);
  --hero-glow-right: rgba(240, 160, 0, 0.22);
  --page-gradient: linear-gradient(160deg, #fff8cc 0%, #ffec80 45%, #ffe040 100%);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent 20%);
  --ghost-surface: rgba(255, 253, 232, 0.8);
  --tool-hover: #fff3b0;
  --tool-hover-border: rgba(245, 168, 0, 0.2);
  --editor-border: rgba(245, 168, 0, 0.08);
  --focus-ring: rgba(245, 168, 0, 0.28);
  --placeholder: rgba(128, 96, 0, 0.58);
  --blockquote-border: rgba(245, 168, 0, 0.4);
  --blockquote-text: #9a6c00;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 253, 232, 0.97), rgba(255, 243, 176, 0.98));
  --select-surface: rgba(255, 255, 240, 0.94);
  --select-border: rgba(245, 168, 0, 0.12);
  --verse-surface: rgba(255, 254, 240, 0.9);
  --verse-border: rgba(245, 168, 0, 0.08);
  --list-text: #9a6c00;
  --input-surface: rgba(255, 255, 240, 0.96);
  --note-chip-surface: rgba(255, 255, 240, 0.82);
  --note-chip-active: #fff3b0;
  --note-chip-border: rgba(245, 168, 0, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "marigold",
  name: "Marigold",
  supports: "light",
  swatches: ["#fffde8", "#f5a800", "#fff3b0", "#1a1200"]
});
