window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="deep-space"] {
  --font-heading: "Orbitron", sans-serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(8, 2, 20, 0.95);
  --surface-strong: #080214;
  --surface-accent: #100520;
  --text: #e8e0ff;
  --muted: #9980cc;
  --border: rgba(124, 77, 255, 0.18);
  --accent: #7c4dff;
  --accent-strong: #b39dff;
  --shadow: 0 0 80px rgba(60, 20, 180, 0.25);
  --hero-glow-left: rgba(100, 30, 220, 0.3);
  --hero-glow-right: rgba(40, 10, 120, 0.2);
  --page-gradient: linear-gradient(160deg, #030008 0%, #05000f 45%, #08001a 100%);
  --grid-line-1: rgba(124, 77, 255, 0.1);
  --grid-line-2: rgba(124, 77, 255, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(124, 77, 255, 0.06), transparent 20%);
  --ghost-surface: rgba(12, 4, 30, 0.82);
  --tool-hover: #100830;
  --tool-hover-border: rgba(124, 77, 255, 0.28);
  --editor-border: rgba(124, 77, 255, 0.1);
  --focus-ring: rgba(124, 77, 255, 0.35);
  --placeholder: rgba(153, 128, 204, 0.6);
  --blockquote-border: rgba(124, 77, 255, 0.45);
  --blockquote-text: #9980cc;
  --scripture-gradient: linear-gradient(180deg, rgba(10, 3, 24, 0.99), rgba(6, 1, 16, 0.99));
  --select-surface: rgba(10, 3, 24, 0.96);
  --select-border: rgba(124, 77, 255, 0.14);
  --verse-surface: rgba(8, 2, 20, 0.94);
  --verse-border: rgba(124, 77, 255, 0.08);
  --list-text: #9980cc;
  --input-surface: rgba(10, 3, 24, 0.96);
  --note-chip-surface: rgba(14, 5, 32, 0.9);
  --note-chip-active: #100830;
  --note-chip-border: rgba(124, 77, 255, 0.15);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "deep-space",
  name: "Deep Space",
  supports: "dark",
  swatches: ["#080214", "#7c4dff", "#100520", "#e8e0ff"]
});
