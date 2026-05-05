window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="ember-glow"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(18, 8, 4, 0.96);
  --surface-strong: #120804;
  --surface-accent: #221008;
  --text: #fff0e0;
  --muted: #c07840;
  --border: rgba(220, 140, 40, 0.18);
  --accent: #f09020;
  --accent-strong: #ffb850;
  --shadow: 0 0 70px rgba(200, 100, 20, 0.22);
  --hero-glow-left: rgba(200, 100, 20, 0.28);
  --hero-glow-right: rgba(160, 60, 10, 0.20);
  --page-gradient: linear-gradient(160deg, #0c0402 0%, #140804 45%, #1c0c06 100%);
  --grid-line-1: rgba(220, 140, 40, 0.09);
  --grid-line-2: rgba(220, 140, 40, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(220, 140, 40, 0.06), transparent 20%);
  --ghost-surface: rgba(28, 12, 6, 0.82);
  --tool-hover: #241008;
  --tool-hover-border: rgba(220, 140, 40, 0.28);
  --editor-border: rgba(220, 140, 40, 0.10);
  --focus-ring: rgba(220, 140, 40, 0.34);
  --placeholder: rgba(192, 120, 64, 0.60);
  --blockquote-border: rgba(220, 140, 40, 0.45);
  --blockquote-text: #c07840;
  --scripture-gradient: linear-gradient(180deg, rgba(20, 8, 4, 0.99), rgba(14, 5, 2, 0.99));
  --select-surface: rgba(22, 10, 5, 0.96);
  --select-border: rgba(220, 140, 40, 0.14);
  --verse-surface: rgba(16, 7, 3, 0.94);
  --verse-border: rgba(220, 140, 40, 0.08);
  --list-text: #c07840;
  --input-surface: rgba(22, 10, 5, 0.96);
  --note-chip-surface: rgba(26, 12, 6, 0.90);
  --note-chip-active: #241008;
  --note-chip-border: rgba(220, 140, 40, 0.14);
  --radius-xl: 20px;
  --radius-lg: 14px;
  --radius-md: 10px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "ember-glow",
  name: "Ember Glow",
  supports: "dark",
  swatches: ["#120804", "#f09020", "#221008", "#fff0e0"]
});
