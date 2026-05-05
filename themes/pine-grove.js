window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="pine-grove"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(242, 248, 244, 0.95);
  --surface-strong: #f2f8f4;
  --surface-accent: #c4deca;
  --text: #0a1c10;
  --muted: #2e6040;
  --border: rgba(46, 108, 62, 0.14);
  --accent: #2e6c3e;
  --accent-strong: #1e4e2a;
  --shadow: 0 24px 80px rgba(20, 80, 40, 0.12);
  --hero-glow-left: rgba(46, 108, 62, 0.24);
  --hero-glow-right: rgba(80, 150, 90, 0.16);
  --page-gradient: linear-gradient(160deg, #ddf0e2 0%, #c4deca 45%, #a8ccb2 100%);
  --grid-line-1: rgba(255, 255, 255, 0.22);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.34), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.70);
  --tool-hover: #c4deca;
  --tool-hover-border: rgba(46, 108, 62, 0.20);
  --editor-border: rgba(46, 108, 62, 0.07);
  --focus-ring: rgba(46, 108, 62, 0.24);
  --placeholder: rgba(46, 96, 64, 0.60);
  --blockquote-border: rgba(46, 108, 62, 0.36);
  --blockquote-text: #1a4426;
  --scripture-gradient: linear-gradient(180deg, rgba(242, 248, 244, 0.97), rgba(196, 222, 202, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(46, 108, 62, 0.12);
  --verse-surface: rgba(246, 252, 248, 0.88);
  --verse-border: rgba(46, 108, 62, 0.08);
  --list-text: #1a4426;
  --input-surface: rgba(255, 255, 255, 0.94);
  --note-chip-surface: rgba(255, 255, 255, 0.76);
  --note-chip-active: #c4deca;
  --note-chip-border: rgba(46, 108, 62, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="pine-grove"][data-theme="dark"] {
  --surface: rgba(4, 14, 8, 0.93);
  --surface-strong: #040e08;
  --surface-accent: #0a1c10;
  --text: #ddf0e2;
  --muted: #60a870;
  --border: rgba(96, 168, 112, 0.15);
  --accent: #60a870;
  --accent-strong: #88c898;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.52);
  --hero-glow-left: rgba(30, 90, 45, 0.28);
  --hero-glow-right: rgba(18, 60, 28, 0.20);
  --page-gradient: linear-gradient(160deg, #020a04 0%, #040e08 45%, #060e0a 100%);
  --grid-line-1: rgba(96, 168, 112, 0.08);
  --grid-line-2: rgba(96, 168, 112, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(96, 168, 112, 0.06), transparent 20%);
  --ghost-surface: rgba(8, 20, 12, 0.82);
  --tool-hover: #0a1c10;
  --tool-hover-border: rgba(96, 168, 112, 0.22);
  --editor-border: rgba(96, 168, 112, 0.10);
  --focus-ring: rgba(96, 168, 112, 0.30);
  --placeholder: rgba(96, 168, 112, 0.60);
  --blockquote-border: rgba(96, 168, 112, 0.42);
  --blockquote-text: #60a870;
  --scripture-gradient: linear-gradient(180deg, rgba(5, 14, 8, 0.99), rgba(3, 9, 5, 0.99));
  --select-surface: rgba(5, 14, 8, 0.96);
  --select-border: rgba(96, 168, 112, 0.12);
  --verse-surface: rgba(4, 12, 7, 0.94);
  --verse-border: rgba(96, 168, 112, 0.08);
  --list-text: #60a870;
  --input-surface: rgba(5, 14, 8, 0.96);
  --note-chip-surface: rgba(6, 18, 10, 0.88);
  --note-chip-active: #0a1c10;
  --note-chip-border: rgba(96, 168, 112, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "pine-grove",
  name: "Pine Grove",
  supports: "both",
  swatches: ["#f2f8f4", "#2e6c3e", "#c4deca", "#0a1c10"]
});
