window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="copper-craft"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 248, 242, 0.96);
  --surface-strong: #fff8f2;
  --surface-accent: #f0dcc8;
  --text: #1e0c00;
  --muted: #946030;
  --border: rgba(184, 115, 51, 0.14);
  --accent: #b87333;
  --accent-strong: #8a5018;
  --shadow: 0 24px 80px rgba(140, 80, 20, 0.12);
  --hero-glow-left: rgba(184, 115, 51, 0.24);
  --hero-glow-right: rgba(220, 160, 80, 0.16);
  --page-gradient: linear-gradient(160deg, #fdf0e0 0%, #f0dcc8 45%, #e0c4a0 100%);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.40), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.76);
  --tool-hover: #f0dcc8;
  --tool-hover-border: rgba(184, 115, 51, 0.22);
  --editor-border: rgba(184, 115, 51, 0.07);
  --focus-ring: rgba(184, 115, 51, 0.24);
  --placeholder: rgba(148, 96, 48, 0.60);
  --blockquote-border: rgba(184, 115, 51, 0.36);
  --blockquote-text: #6a3c10;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 248, 242, 0.97), rgba(240, 220, 200, 0.98));
  --select-surface: rgba(255, 255, 255, 0.93);
  --select-border: rgba(184, 115, 51, 0.12);
  --verse-surface: rgba(255, 252, 246, 0.90);
  --verse-border: rgba(184, 115, 51, 0.08);
  --list-text: #6a3c10;
  --input-surface: rgba(255, 255, 255, 0.96);
  --note-chip-surface: rgba(255, 255, 255, 0.80);
  --note-chip-active: #f0dcc8;
  --note-chip-border: rgba(184, 115, 51, 0.12);
  --radius-xl: 12px;
  --radius-lg: 9px;
  --radius-md: 6px;
  color-scheme: light;
}
[data-color-theme="copper-craft"][data-theme="dark"] {
  --surface: rgba(18, 8, 0, 0.94);
  --surface-strong: #120800;
  --surface-accent: #261400;
  --text: #f8e8d0;
  --muted: #c8884a;
  --border: rgba(200, 136, 74, 0.15);
  --accent: #c8884a;
  --accent-strong: #e0a860;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.54);
  --hero-glow-left: rgba(150, 90, 20, 0.28);
  --hero-glow-right: rgba(100, 55, 10, 0.20);
  --page-gradient: linear-gradient(160deg, #0e0600 0%, #120800 45%, #1a1000 100%);
  --grid-line-1: rgba(200, 136, 74, 0.08);
  --grid-line-2: rgba(200, 136, 74, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(200, 136, 74, 0.06), transparent 20%);
  --ghost-surface: rgba(28, 14, 2, 0.82);
  --tool-hover: #261400;
  --tool-hover-border: rgba(200, 136, 74, 0.22);
  --editor-border: rgba(200, 136, 74, 0.10);
  --focus-ring: rgba(200, 136, 74, 0.30);
  --placeholder: rgba(200, 136, 74, 0.60);
  --blockquote-border: rgba(200, 136, 74, 0.42);
  --blockquote-text: #c8884a;
  --scripture-gradient: linear-gradient(180deg, rgba(20, 10, 0, 0.99), rgba(12, 6, 0, 0.99));
  --select-surface: rgba(20, 10, 0, 0.96);
  --select-border: rgba(200, 136, 74, 0.12);
  --verse-surface: rgba(16, 8, 0, 0.94);
  --verse-border: rgba(200, 136, 74, 0.08);
  --list-text: #c8884a;
  --input-surface: rgba(20, 10, 0, 0.96);
  --note-chip-surface: rgba(26, 12, 0, 0.88);
  --note-chip-active: #261400;
  --note-chip-border: rgba(200, 136, 74, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "copper-craft",
  name: "Copper Craft",
  supports: "both",
  swatches: ["#fff8f2", "#b87333", "#f0dcc8", "#1e0c00"]
});
