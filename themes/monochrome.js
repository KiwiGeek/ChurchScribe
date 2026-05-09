window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="monochrome"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 255, 255, 0.96);
  --surface-strong: #ffffff;
  --surface-accent: #f0f0f0;
  --text: #111111;
  --muted: #555555;
  --border: rgba(0, 0, 0, 0.14);
  --accent: #222222;
  --accent-strong: #000000;
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.12);
  --hero-glow-left: rgba(180, 180, 180, 0.2);
  --hero-glow-right: rgba(200, 200, 200, 0.12);
  --page-gradient: linear-gradient(160deg, #f8f8f8 0%, #f0f0f0 45%, #e8e8e8 100%);
  --grid-line-1: rgba(255, 255, 255, 0.3);
  --grid-line-2: rgba(255, 255, 255, 0.18);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.78);
  --tool-hover: #e8e8e8;
  --tool-hover-border: rgba(0, 0, 0, 0.15);
  --editor-border: rgba(0, 0, 0, 0.07);
  --focus-ring: rgba(0, 0, 0, 0.2);
  --placeholder: rgba(80, 80, 80, 0.55);
  --blockquote-border: rgba(0, 0, 0, 0.3);
  --blockquote-text: #333333;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(240, 240, 240, 0.98));
  --select-surface: rgba(255, 255, 255, 0.94);
  --select-border: rgba(0, 0, 0, 0.1);
  --verse-surface: rgba(252, 252, 252, 0.9);
  --verse-border: rgba(0, 0, 0, 0.07);
  --list-text: #333333;
  --input-surface: rgba(255, 255, 255, 0.96);
  --note-chip-surface: rgba(255, 255, 255, 0.8);
  --note-chip-active: #e8e8e8;
  --note-chip-border: rgba(0, 0, 0, 0.09);
  --radius-xl: 4px;
  --radius-lg: 3px;
  --radius-md: 2px;
  color-scheme: light;
}
[data-color-theme="monochrome"][data-theme="dark"] {
  --surface: rgba(10, 10, 10, 0.96);
  --surface-strong: #0a0a0a;
  --surface-accent: #1a1a1a;
  --text: #f0f0f0;
  --muted: #aaaaaa;
  --border: rgba(255, 255, 255, 0.12);
  --accent: #dddddd;
  --accent-strong: #ffffff;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.7);
  --hero-glow-left: rgba(80, 80, 80, 0.12);
  --hero-glow-right: rgba(60, 60, 60, 0.08);
  --page-gradient: linear-gradient(160deg, #080808 0%, #0a0a0a 45%, #0e0e0e 100%);
  --grid-line-1: rgba(255, 255, 255, 0.07);
  --grid-line-2: rgba(255, 255, 255, 0.03);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 20%);
  --ghost-surface: rgba(16, 16, 16, 0.85);
  --tool-hover: #1a1a1a;
  --tool-hover-border: rgba(255, 255, 255, 0.14);
  --editor-border: rgba(255, 255, 255, 0.08);
  --focus-ring: rgba(255, 255, 255, 0.25);
  --placeholder: rgba(170, 170, 170, 0.55);
  --blockquote-border: rgba(255, 255, 255, 0.3);
  --blockquote-text: #aaaaaa;
  --scripture-gradient: linear-gradient(180deg, rgba(10, 10, 10, 0.99), rgba(6, 6, 6, 0.99));
  --select-surface: rgba(10, 10, 10, 0.96);
  --select-border: rgba(255, 255, 255, 0.1);
  --verse-surface: rgba(8, 8, 8, 0.94);
  --verse-border: rgba(255, 255, 255, 0.07);
  --list-text: #aaaaaa;
  --input-surface: rgba(12, 12, 12, 0.96);
  --note-chip-surface: rgba(16, 16, 16, 0.86);
  --note-chip-active: #1a1a1a;
  --note-chip-border: rgba(255, 255, 255, 0.1);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "monochrome",
  name: "Monochrome",
  supports: "both",
  swatches: ["#ffffff", "#222222", "#f0f0f0", "#111111"]
});
