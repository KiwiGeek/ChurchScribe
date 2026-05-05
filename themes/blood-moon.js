window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="blood-moon"] {
  --font-heading: "Cinzel", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(20, 2, 2, 0.95);
  --surface-strong: #140202;
  --surface-accent: #2a0404;
  --text: #ffe0d8;
  --muted: #e07060;
  --border: rgba(255, 80, 40, 0.18);
  --accent: #ff3d00;
  --accent-strong: #ff6e40;
  --shadow: 0 0 80px rgba(255, 0, 0, 0.18);
  --hero-glow-left: rgba(180, 0, 0, 0.35);
  --hero-glow-right: rgba(255, 60, 0, 0.2);
  --page-gradient: linear-gradient(160deg, #0e0000 0%, #1a0202 45%, #200404 100%);
  --grid-line-1: rgba(255, 80, 40, 0.1);
  --grid-line-2: rgba(255, 80, 40, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(255, 40, 0, 0.08), transparent 20%);
  --ghost-surface: rgba(24, 4, 4, 0.82);
  --tool-hover: #2a0404;
  --tool-hover-border: rgba(255, 80, 40, 0.24);
  --editor-border: rgba(255, 80, 40, 0.1);
  --focus-ring: rgba(255, 80, 40, 0.32);
  --placeholder: rgba(224, 112, 96, 0.6);
  --blockquote-border: rgba(255, 80, 40, 0.44);
  --blockquote-text: #e07060;
  --scripture-gradient: linear-gradient(180deg, rgba(20, 2, 2, 0.99), rgba(14, 0, 0, 0.99));
  --select-surface: rgba(20, 2, 2, 0.96);
  --select-border: rgba(255, 80, 40, 0.12);
  --verse-surface: rgba(18, 2, 2, 0.94);
  --verse-border: rgba(255, 80, 40, 0.08);
  --list-text: #e07060;
  --input-surface: rgba(22, 4, 4, 0.96);
  --note-chip-surface: rgba(26, 6, 6, 0.88);
  --note-chip-active: #2a0404;
  --note-chip-border: rgba(255, 80, 40, 0.16);
  --radius-xl: 24px;
  --radius-lg: 16px;
  --radius-md: 10px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "blood-moon",
  name: "Blood Moon",
  supports: "dark",
  swatches: ["#1a0000", "#ff3d00", "#2e0000", "#ffe0d8"]
});
