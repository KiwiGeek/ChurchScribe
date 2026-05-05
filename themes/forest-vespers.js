window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="forest-vespers"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(6, 18, 9, 0.92);
  --surface-strong: #06120a;
  --surface-accent: #0b1e0e;
  --text: #c8e6c9;
  --muted: #81c784;
  --border: rgba(102, 187, 106, 0.14);
  --accent: #66bb6a;
  --accent-strong: #a5d6a7;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(40, 100, 45, 0.3);
  --hero-glow-right: rgba(30, 80, 35, 0.2);
  --page-gradient: linear-gradient(160deg, #030c04 0%, #061208 45%, #091a0c 100%);
  --grid-line-1: rgba(102, 187, 106, 0.08);
  --grid-line-2: rgba(102, 187, 106, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(102, 187, 106, 0.06), transparent 20%);
  --ghost-surface: rgba(10, 26, 12, 0.8);
  --tool-hover: #102214;
  --tool-hover-border: rgba(102, 187, 106, 0.2);
  --editor-border: rgba(102, 187, 106, 0.1);
  --focus-ring: rgba(102, 187, 106, 0.3);
  --placeholder: rgba(129, 199, 132, 0.6);
  --blockquote-border: rgba(102, 187, 106, 0.42);
  --blockquote-text: #81c784;
  --scripture-gradient: linear-gradient(180deg, rgba(8, 20, 10, 0.99), rgba(5, 13, 6, 0.99));
  --select-surface: rgba(8, 20, 10, 0.95);
  --select-border: rgba(102, 187, 106, 0.12);
  --verse-surface: rgba(6, 16, 8, 0.92);
  --verse-border: rgba(102, 187, 106, 0.08);
  --list-text: #81c784;
  --input-surface: rgba(8, 20, 10, 0.95);
  --note-chip-surface: rgba(10, 26, 12, 0.88);
  --note-chip-active: #102214;
  --note-chip-border: rgba(102, 187, 106, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "forest-vespers",
  name: "Forest Vespers",
  supports: "dark",
  swatches: ["#06120a", "#66bb6a", "#0b1e0e", "#c8e6c9"]
});
