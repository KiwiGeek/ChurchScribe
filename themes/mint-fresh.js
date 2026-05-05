window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="mint-fresh"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(240, 255, 248, 0.95);
  --surface-strong: #f0fff8;
  --surface-accent: #b2f5e8;
  --text: #001e18;
  --muted: #008070;
  --border: rgba(0, 176, 155, 0.14);
  --accent: #00b09b;
  --accent-strong: #007868;
  --shadow: 0 24px 80px rgba(0, 130, 110, 0.10);
  --hero-glow-left: rgba(0, 176, 155, 0.24);
  --hero-glow-right: rgba(80, 220, 195, 0.16);
  --page-gradient: linear-gradient(160deg, #e0faf4 0%, #b2f5e8 45%, #80e8d4 100%);
  --grid-line-1: rgba(255, 255, 255, 0.26);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.38), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.74);
  --tool-hover: #b2f5e8;
  --tool-hover-border: rgba(0, 176, 155, 0.20);
  --editor-border: rgba(0, 176, 155, 0.07);
  --focus-ring: rgba(0, 176, 155, 0.24);
  --placeholder: rgba(0, 128, 112, 0.60);
  --blockquote-border: rgba(0, 176, 155, 0.36);
  --blockquote-text: #004e44;
  --scripture-gradient: linear-gradient(180deg, rgba(240, 255, 248, 0.97), rgba(178, 245, 232, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(0, 176, 155, 0.12);
  --verse-surface: rgba(245, 255, 252, 0.88);
  --verse-border: rgba(0, 176, 155, 0.08);
  --list-text: #004e44;
  --input-surface: rgba(255, 255, 255, 0.95);
  --note-chip-surface: rgba(255, 255, 255, 0.78);
  --note-chip-active: #b2f5e8;
  --note-chip-border: rgba(0, 176, 155, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="mint-fresh"][data-theme="dark"] {
  --surface: rgba(0, 16, 12, 0.93);
  --surface-strong: #00100c;
  --surface-accent: #001e18;
  --text: #e0faf4;
  --muted: #50c0a8;
  --border: rgba(80, 192, 168, 0.15);
  --accent: #50c0a8;
  --accent-strong: #80dcc8;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.50);
  --hero-glow-left: rgba(0, 140, 120, 0.26);
  --hero-glow-right: rgba(0, 100, 85, 0.18);
  --page-gradient: linear-gradient(160deg, #000c08 0%, #00100c 45%, #001810 100%);
  --grid-line-1: rgba(80, 192, 168, 0.08);
  --grid-line-2: rgba(80, 192, 168, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(80, 192, 168, 0.06), transparent 20%);
  --ghost-surface: rgba(0, 22, 18, 0.82);
  --tool-hover: #001e18;
  --tool-hover-border: rgba(80, 192, 168, 0.22);
  --editor-border: rgba(80, 192, 168, 0.10);
  --focus-ring: rgba(80, 192, 168, 0.30);
  --placeholder: rgba(80, 192, 168, 0.60);
  --blockquote-border: rgba(80, 192, 168, 0.42);
  --blockquote-text: #50c0a8;
  --scripture-gradient: linear-gradient(180deg, rgba(0, 14, 10, 0.99), rgba(0, 8, 6, 0.99));
  --select-surface: rgba(0, 14, 10, 0.96);
  --select-border: rgba(80, 192, 168, 0.12);
  --verse-surface: rgba(0, 10, 8, 0.94);
  --verse-border: rgba(80, 192, 168, 0.08);
  --list-text: #50c0a8;
  --input-surface: rgba(0, 14, 10, 0.96);
  --note-chip-surface: rgba(0, 18, 14, 0.88);
  --note-chip-active: #001e18;
  --note-chip-border: rgba(80, 192, 168, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "mint-fresh",
  name: "Mint Fresh",
  supports: "both",
  swatches: ["#f0fff8", "#00b09b", "#b2f5e8", "#001e18"]
});
