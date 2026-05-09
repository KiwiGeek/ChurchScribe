window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="sage-chapel"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(244, 250, 244, 0.93);
  --surface-strong: #f2f8f2;
  --surface-accent: #d5ead6;
  --text: #1b2e1d;
  --muted: #4d6b4f;
  --border: rgba(46, 91, 49, 0.15);
  --accent: #3a6e42;
  --accent-strong: #2a5430;
  --shadow: 0 24px 80px rgba(40, 80, 45, 0.14);
  --hero-glow-left: rgba(100, 160, 110, 0.28);
  --hero-glow-right: rgba(80, 130, 90, 0.18);
  --page-gradient: linear-gradient(160deg, #e8f5e9 0%, #dcedc8 45%, #c8e6c9 100%);
  --grid-line-1: rgba(255, 255, 255, 0.18);
  --grid-line-2: rgba(255, 255, 255, 0.12);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.65);
  --tool-hover: #c5e1c5;
  --tool-hover-border: rgba(50, 100, 55, 0.2);
  --editor-border: rgba(46, 91, 49, 0.08);
  --focus-ring: rgba(58, 110, 66, 0.25);
  --placeholder: rgba(77, 107, 79, 0.7);
  --blockquote-border: rgba(58, 110, 66, 0.35);
  --blockquote-text: #3d5c40;
  --scripture-gradient: linear-gradient(180deg, rgba(238, 249, 238, 0.97), rgba(220, 237, 221, 0.98));
  --select-surface: rgba(255, 255, 255, 0.88);
  --select-border: rgba(46, 91, 49, 0.12);
  --verse-surface: rgba(245, 252, 245, 0.84);
  --verse-border: rgba(46, 91, 49, 0.08);
  --list-text: #3d5c40;
  --input-surface: rgba(255, 255, 255, 0.9);
  --note-chip-surface: rgba(255, 255, 255, 0.72);
  --note-chip-active: #c5e1c5;
  --note-chip-border: rgba(46, 91, 49, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="sage-chapel"][data-theme="dark"] {
  --surface: rgba(12, 22, 13, 0.88);
  --surface-strong: #0f1a10;
  --surface-accent: #1a2e1c;
  --text: #e8f5e9;
  --muted: #9db89e;
  --border: rgba(150, 200, 155, 0.14);
  --accent: #6abf72;
  --accent-strong: #9cdb9e;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.4);
  --hero-glow-left: rgba(50, 100, 55, 0.22);
  --hero-glow-right: rgba(40, 80, 45, 0.18);
  --page-gradient: linear-gradient(160deg, #0a140b 0%, #0e1a0f 45%, #131f14 100%);
  --grid-line-1: rgba(150, 200, 155, 0.08);
  --grid-line-2: rgba(150, 200, 155, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 20%);
  --ghost-surface: rgba(18, 32, 20, 0.7);
  --tool-hover: #1e3820;
  --tool-hover-border: rgba(150, 220, 160, 0.18);
  --editor-border: rgba(150, 200, 155, 0.1);
  --focus-ring: rgba(106, 191, 114, 0.3);
  --placeholder: rgba(157, 184, 158, 0.75);
  --blockquote-border: rgba(106, 191, 114, 0.42);
  --blockquote-text: #9aafa0;
  --scripture-gradient: linear-gradient(180deg, rgba(14, 24, 15, 0.98), rgba(10, 18, 11, 0.98));
  --select-surface: rgba(14, 24, 15, 0.92);
  --select-border: rgba(150, 200, 155, 0.12);
  --verse-surface: rgba(12, 20, 13, 0.9);
  --verse-border: rgba(150, 200, 155, 0.08);
  --list-text: #9db89e;
  --input-surface: rgba(14, 24, 15, 0.92);
  --note-chip-surface: rgba(18, 30, 20, 0.82);
  --note-chip-active: #1e3820;
  --note-chip-border: rgba(150, 200, 155, 0.1);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "sage-chapel",
  name: "Sage Chapel",
  supports: "both",
  swatches: ["#f2f8f2", "#3a6e42", "#d5ead6", "#1b2e1d"]
});
