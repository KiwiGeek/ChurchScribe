window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="coastal-breeze"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(240, 252, 255, 0.95);
  --surface-strong: #f0fcff;
  --surface-accent: #b2ebf2;
  --text: #002030;
  --muted: #00707e;
  --border: rgba(0, 151, 167, 0.14);
  --accent: #0097a7;
  --accent-strong: #006978;
  --shadow: 0 24px 80px rgba(0, 100, 120, 0.10);
  --hero-glow-left: rgba(0, 188, 212, 0.26);
  --hero-glow-right: rgba(0, 151, 167, 0.16);
  --page-gradient: linear-gradient(160deg, #e0f7fa 0%, #b2ebf2 45%, #80deea 100%);
  --grid-line-1: rgba(255, 255, 255, 0.26);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.38), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.74);
  --tool-hover: #b2ebf2;
  --tool-hover-border: rgba(0, 151, 167, 0.20);
  --editor-border: rgba(0, 151, 167, 0.07);
  --focus-ring: rgba(0, 151, 167, 0.24);
  --placeholder: rgba(0, 112, 126, 0.60);
  --blockquote-border: rgba(0, 151, 167, 0.38);
  --blockquote-text: #004e5a;
  --scripture-gradient: linear-gradient(180deg, rgba(240, 252, 255, 0.97), rgba(178, 235, 242, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(0, 151, 167, 0.12);
  --verse-surface: rgba(245, 254, 255, 0.88);
  --verse-border: rgba(0, 151, 167, 0.08);
  --list-text: #004e5a;
  --input-surface: rgba(255, 255, 255, 0.95);
  --note-chip-surface: rgba(255, 255, 255, 0.78);
  --note-chip-active: #b2ebf2;
  --note-chip-border: rgba(0, 151, 167, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "coastal-breeze",
  name: "Coastal Breeze",
  supports: "light",
  swatches: ["#f0fcff", "#0097a7", "#b2ebf2", "#002030"]
});
