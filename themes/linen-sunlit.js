window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="linen-sunlit"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 255, 252, 0.97);
  --surface-strong: #ffffff;
  --surface-accent: #f0f0ec;
  --text: #1a1a18;
  --muted: #5c6060;
  --border: rgba(69, 90, 100, 0.13);
  --accent: #455a64;
  --accent-strong: #263238;
  --shadow: 0 24px 80px rgba(30, 40, 45, 0.08);
  --hero-glow-left: rgba(100, 120, 130, 0.18);
  --hero-glow-right: rgba(80, 100, 110, 0.12);
  --page-gradient: linear-gradient(160deg, #fafaf8 0%, #f5f5f0 45%, #eeeee8 100%);
  --grid-line-1: rgba(0, 0, 0, 0.04);
  --grid-line-2: rgba(0, 0, 0, 0.03);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.5), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.82);
  --tool-hover: #f0f0ec;
  --tool-hover-border: rgba(69, 90, 100, 0.16);
  --editor-border: rgba(69, 90, 100, 0.07);
  --focus-ring: rgba(69, 90, 100, 0.2);
  --placeholder: rgba(92, 96, 96, 0.6);
  --blockquote-border: rgba(69, 90, 100, 0.3);
  --blockquote-text: #3a4448;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 255, 252, 0.98), rgba(245, 245, 240, 0.98));
  --select-surface: rgba(255, 255, 255, 0.96);
  --select-border: rgba(69, 90, 100, 0.1);
  --verse-surface: rgba(255, 255, 254, 0.92);
  --verse-border: rgba(69, 90, 100, 0.07);
  --list-text: #3a4448;
  --input-surface: rgba(255, 255, 255, 0.98);
  --note-chip-surface: rgba(255, 255, 255, 0.85);
  --note-chip-active: #f0f0ec;
  --note-chip-border: rgba(69, 90, 100, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "linen-sunlit",
  name: "Linen Sunlit",
  supports: "light",
  swatches: ["#ffffff", "#455a64", "#f0f0ec", "#1a1a18"]
});
