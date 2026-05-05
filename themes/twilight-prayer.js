window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="twilight-prayer"] {
  --font-heading: "Cinzel", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(8, 6, 22, 0.96);
  --surface-strong: #080616;
  --surface-accent: #100e28;
  --text: #e0e8ff;
  --muted: #7a90c8;
  --border: rgba(100, 130, 220, 0.16);
  --accent: #7090d8;
  --accent-strong: #a0b8f0;
  --shadow: 0 0 80px rgba(60, 80, 180, 0.22);
  --hero-glow-left: rgba(80, 100, 200, 0.26);
  --hero-glow-right: rgba(40, 60, 160, 0.18);
  --page-gradient: linear-gradient(160deg, #040312 0%, #080618 45%, #0c0820 100%);
  --grid-line-1: rgba(100, 130, 220, 0.09);
  --grid-line-2: rgba(100, 130, 220, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(100, 130, 220, 0.06), transparent 20%);
  --ghost-surface: rgba(12, 10, 32, 0.82);
  --tool-hover: #120e2c;
  --tool-hover-border: rgba(100, 130, 220, 0.26);
  --editor-border: rgba(100, 130, 220, 0.10);
  --focus-ring: rgba(100, 130, 220, 0.32);
  --placeholder: rgba(122, 144, 200, 0.60);
  --blockquote-border: rgba(100, 130, 220, 0.44);
  --blockquote-text: #7a90c8;
  --scripture-gradient: linear-gradient(180deg, rgba(10, 8, 24, 0.99), rgba(6, 5, 16, 0.99));
  --select-surface: rgba(12, 10, 28, 0.96);
  --select-border: rgba(100, 130, 220, 0.14);
  --verse-surface: rgba(10, 8, 22, 0.94);
  --verse-border: rgba(100, 130, 220, 0.08);
  --list-text: #7a90c8;
  --input-surface: rgba(12, 10, 28, 0.96);
  --note-chip-surface: rgba(16, 12, 34, 0.90);
  --note-chip-active: #120e2c;
  --note-chip-border: rgba(100, 130, 220, 0.14);
  --radius-xl: 6px;
  --radius-lg: 5px;
  --radius-md: 4px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "twilight-prayer",
  name: "Twilight Prayer",
  supports: "dark",
  swatches: ["#080616", "#7090d8", "#100e28", "#e0e8ff"]
});
