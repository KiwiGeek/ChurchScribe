window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="cherry-blossom"] {
  --font-heading: "Playfair Display", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 245, 248, 0.93);
  --surface-strong: #fff5f8;
  --surface-accent: #fce4ec;
  --text: #2a0d1a;
  --muted: #8c4060;
  --border: rgba(194, 24, 91, 0.13);
  --accent: #c2185b;
  --accent-strong: #880e4f;
  --shadow: 0 24px 80px rgba(140, 20, 70, 0.12);
  --hero-glow-left: rgba(240, 98, 146, 0.3);
  --hero-glow-right: rgba(194, 24, 91, 0.18);
  --page-gradient: linear-gradient(160deg, #fce4ec 0%, #f8bbd0 45%, #f48fb1 100%);
  --grid-line-1: rgba(255, 255, 255, 0.22);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.35), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.72);
  --tool-hover: #fce4ec;
  --tool-hover-border: rgba(194, 24, 91, 0.18);
  --editor-border: rgba(194, 24, 91, 0.07);
  --focus-ring: rgba(194, 24, 91, 0.22);
  --placeholder: rgba(140, 64, 96, 0.6);
  --blockquote-border: rgba(194, 24, 91, 0.35);
  --blockquote-text: #7a2345;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 248, 251, 0.97), rgba(252, 228, 236, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(194, 24, 91, 0.1);
  --verse-surface: rgba(255, 250, 252, 0.88);
  --verse-border: rgba(194, 24, 91, 0.07);
  --list-text: #7a2345;
  --input-surface: rgba(255, 255, 255, 0.94);
  --note-chip-surface: rgba(255, 255, 255, 0.76);
  --note-chip-active: #fce4ec;
  --note-chip-border: rgba(194, 24, 91, 0.1);
  --radius-xl: 32px;
  --radius-lg: 24px;
  --radius-md: 18px;
  color-scheme: light;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "cherry-blossom",
  name: "Cherry Blossom",
  supports: "light",
  swatches: ["#fff5f8", "#c2185b", "#fce4ec", "#2a0d1a"]
});
