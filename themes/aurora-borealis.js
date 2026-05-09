window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="aurora-borealis"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(2, 10, 16, 0.96);
  --surface-strong: #020a10;
  --surface-accent: #04141e;
  --text: #d0fff8;
  --muted: #70d8c0;
  --border: rgba(0, 232, 200, 0.16);
  --accent: #00e8c8;
  --accent-strong: #40ffdc;
  --shadow: 0 0 80px rgba(0, 200, 160, 0.16);
  --hero-glow-left: rgba(0, 180, 150, 0.3);
  --hero-glow-right: rgba(100, 0, 220, 0.2);
  --page-gradient: linear-gradient(160deg, #010810 0%, #020a14 45%, #040c18 100%);
  --grid-line-1: rgba(0, 232, 200, 0.1);
  --grid-line-2: rgba(0, 232, 200, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(0, 232, 200, 0.07), transparent 20%);
  --ghost-surface: rgba(4, 14, 20, 0.86);
  --tool-hover: #04141e;
  --tool-hover-border: rgba(0, 232, 200, 0.22);
  --editor-border: rgba(0, 232, 200, 0.1);
  --focus-ring: rgba(0, 232, 200, 0.32);
  --placeholder: rgba(112, 216, 192, 0.56);
  --blockquote-border: rgba(0, 232, 200, 0.42);
  --blockquote-text: #70d8c0;
  --scripture-gradient: linear-gradient(180deg, rgba(2, 10, 16, 0.99), rgba(1, 7, 12, 0.99));
  --select-surface: rgba(2, 10, 18, 0.96);
  --select-border: rgba(0, 232, 200, 0.12);
  --verse-surface: rgba(2, 8, 14, 0.94);
  --verse-border: rgba(0, 232, 200, 0.08);
  --list-text: #70d8c0;
  --input-surface: rgba(3, 12, 20, 0.96);
  --note-chip-surface: rgba(4, 14, 22, 0.88);
  --note-chip-active: #04141e;
  --note-chip-border: rgba(0, 232, 200, 0.16);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "aurora-borealis",
  name: "Aurora Borealis",
  supports: "dark",
  swatches: ["#020e12", "#00e8c8", "#051820", "#d0fff8"]
});
