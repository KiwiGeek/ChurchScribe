window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="inkwood"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(8, 14, 10, 0.96);
  --surface-strong: #080e0a;
  --surface-accent: #121c14;
  --text: #e4ebe3;
  --muted: #8fa392;
  --border: rgba(120, 150, 120, 0.16);
  --accent: #7d9b72;
  --accent-strong: #b5c9ab;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.65);
  --hero-glow-left: rgba(40, 70, 45, 0.28);
  --hero-glow-right: rgba(20, 40, 25, 0.18);
  --page-gradient: linear-gradient(165deg, #040806 0%, #0a110c 48%, #101811 100%);
  --grid-line-1: rgba(125, 155, 114, 0.07);
  --grid-line-2: rgba(125, 155, 114, 0.03);
  --panel-highlight: linear-gradient(180deg, rgba(125, 155, 114, 0.05), transparent 22%);
  --ghost-surface: rgba(12, 20, 14, 0.9);
  --tool-hover: #162016;
  --tool-hover-border: rgba(125, 155, 114, 0.24);
  --editor-border: rgba(125, 155, 114, 0.1);
  --focus-ring: rgba(125, 155, 114, 0.32);
  --placeholder: rgba(143, 163, 146, 0.55);
  --blockquote-border: rgba(125, 155, 114, 0.42);
  --blockquote-text: #a8bba8;
  --scripture-gradient: linear-gradient(180deg, rgba(9, 15, 11, 0.99), rgba(5, 9, 6, 0.99));
  --select-surface: rgba(10, 16, 12, 0.96);
  --select-border: rgba(125, 155, 114, 0.14);
  --verse-surface: rgba(7, 12, 9, 0.95);
  --verse-border: rgba(125, 155, 114, 0.08);
  --list-text: #a8bba8;
  --input-surface: rgba(10, 16, 12, 0.96);
  --note-chip-surface: rgba(14, 22, 16, 0.9);
  --note-chip-active: #162016;
  --note-chip-border: rgba(125, 155, 114, 0.14);
  --radius-xl: 12px;
  --radius-lg: 10px;
  --radius-md: 8px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "inkwood",
  name: "Inkwood",
  supports: "dark",
  featured: true,
  tags: ["cool", "minimal"],
  swatches: ["#080e0a", "#7d9b72", "#121c14", "#e4ebe3"]
});
