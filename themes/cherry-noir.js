window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="cherry-noir"] {
  --font-heading: "Playfair Display", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(14, 0, 8, 0.96);
  --surface-strong: #0e0008;
  --surface-accent: #200010;
  --text: #ffe0ea;
  --muted: #e880a0;
  --border: rgba(232, 64, 106, 0.18);
  --accent: #e8406a;
  --accent-strong: #ff6090;
  --shadow: 0 0 80px rgba(200, 30, 80, 0.18);
  --hero-glow-left: rgba(180, 20, 70, 0.32);
  --hero-glow-right: rgba(240, 60, 100, 0.2);
  --page-gradient: linear-gradient(160deg, #0a0006 0%, #120008 45%, #180010 100%);
  --grid-line-1: rgba(232, 64, 106, 0.1);
  --grid-line-2: rgba(232, 64, 106, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(232, 64, 106, 0.08), transparent 20%);
  --ghost-surface: rgba(20, 2, 12, 0.86);
  --tool-hover: #200010;
  --tool-hover-border: rgba(232, 64, 106, 0.24);
  --editor-border: rgba(232, 64, 106, 0.1);
  --focus-ring: rgba(232, 64, 106, 0.32);
  --placeholder: rgba(232, 128, 160, 0.56);
  --blockquote-border: rgba(232, 64, 106, 0.44);
  --blockquote-text: #e880a0;
  --scripture-gradient: linear-gradient(180deg, rgba(14, 0, 8, 0.99), rgba(9, 0, 5, 0.99));
  --select-surface: rgba(14, 0, 8, 0.96);
  --select-border: rgba(232, 64, 106, 0.12);
  --verse-surface: rgba(12, 0, 7, 0.94);
  --verse-border: rgba(232, 64, 106, 0.08);
  --list-text: #e880a0;
  --input-surface: rgba(16, 2, 10, 0.96);
  --note-chip-surface: rgba(20, 2, 12, 0.88);
  --note-chip-active: #200010;
  --note-chip-border: rgba(232, 64, 106, 0.16);
  --radius-xl: 32px;
  --radius-lg: 24px;
  --radius-md: 16px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "cherry-noir",
  name: "Cherry Noir",
  supports: "dark",
  swatches: ["#120008", "#e8406a", "#220010", "#ffe0ea"]
});
