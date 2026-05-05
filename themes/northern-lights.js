window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="northern-lights"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(4, 12, 22, 0.95);
  --surface-strong: #04080e;
  --surface-accent: #081825;
  --text: #d0f8f0;
  --muted: #60b8a8;
  --border: rgba(0, 220, 180, 0.18);
  --accent: #00dca0;
  --accent-strong: #80ecd0;
  --shadow: 0 0 80px rgba(0, 180, 140, 0.20);
  --hero-glow-left: rgba(0, 200, 160, 0.24);
  --hero-glow-right: rgba(0, 120, 200, 0.18);
  --page-gradient: linear-gradient(160deg, #020a10 0%, #04101a 45%, #061420 100%);
  --grid-line-1: rgba(0, 220, 180, 0.09);
  --grid-line-2: rgba(0, 220, 180, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(0, 220, 180, 0.06), transparent 20%);
  --ghost-surface: rgba(6, 18, 30, 0.82);
  --tool-hover: #082028;
  --tool-hover-border: rgba(0, 220, 180, 0.28);
  --editor-border: rgba(0, 220, 180, 0.10);
  --focus-ring: rgba(0, 220, 180, 0.34);
  --placeholder: rgba(96, 184, 168, 0.60);
  --blockquote-border: rgba(0, 220, 180, 0.45);
  --blockquote-text: #60c0a8;
  --scripture-gradient: linear-gradient(180deg, rgba(5, 12, 22, 0.99), rgba(3, 8, 16, 0.99));
  --select-surface: rgba(6, 14, 24, 0.96);
  --select-border: rgba(0, 220, 180, 0.14);
  --verse-surface: rgba(4, 10, 18, 0.94);
  --verse-border: rgba(0, 220, 180, 0.08);
  --list-text: #60b8a8;
  --input-surface: rgba(6, 14, 24, 0.96);
  --note-chip-surface: rgba(8, 18, 30, 0.90);
  --note-chip-active: #082028;
  --note-chip-border: rgba(0, 220, 180, 0.15);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "northern-lights",
  name: "Northern Lights",
  supports: "dark",
  swatches: ["#04080e", "#00dca0", "#081825", "#d0f8f0"]
});
