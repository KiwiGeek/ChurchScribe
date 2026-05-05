window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="arctic-frost"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(245, 251, 255, 0.95);
  --surface-strong: #f5fbff;
  --surface-accent: #dbeeff;
  --text: #032340;
  --muted: #2e6b9a;
  --border: rgba(2, 119, 189, 0.14);
  --accent: #0277bd;
  --accent-strong: #01579b;
  --shadow: 0 24px 80px rgba(2, 100, 160, 0.1);
  --hero-glow-left: rgba(2, 136, 209, 0.22);
  --hero-glow-right: rgba(3, 155, 229, 0.16);
  --page-gradient: linear-gradient(160deg, #e3f8ff 0%, #c1edff 45%, #a8e6ff 100%);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.18);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.45), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.78);
  --tool-hover: #dbeeff;
  --tool-hover-border: rgba(2, 119, 189, 0.18);
  --editor-border: rgba(2, 119, 189, 0.07);
  --focus-ring: rgba(2, 119, 189, 0.22);
  --placeholder: rgba(46, 107, 154, 0.6);
  --blockquote-border: rgba(2, 119, 189, 0.32);
  --blockquote-text: #1a4a70;
  --scripture-gradient: linear-gradient(180deg, rgba(245, 251, 255, 0.98), rgba(219, 238, 255, 0.98));
  --select-surface: rgba(255, 255, 255, 0.94);
  --select-border: rgba(2, 119, 189, 0.1);
  --verse-surface: rgba(250, 254, 255, 0.9);
  --verse-border: rgba(2, 119, 189, 0.07);
  --list-text: #1a4a70;
  --input-surface: rgba(255, 255, 255, 0.96);
  --note-chip-surface: rgba(255, 255, 255, 0.8);
  --note-chip-active: #dbeeff;
  --note-chip-border: rgba(2, 119, 189, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="arctic-frost"][data-theme="dark"] {
  --surface: rgba(3, 13, 26, 0.92);
  --surface-strong: #030d1a;
  --surface-accent: #071624;
  --text: #e3f2fd;
  --muted: #81cde4;
  --border: rgba(129, 212, 250, 0.14);
  --accent: #81d4fa;
  --accent-strong: #b3e5fc;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(3, 100, 160, 0.26);
  --hero-glow-right: rgba(1, 87, 155, 0.18);
  --page-gradient: linear-gradient(160deg, #020810 0%, #030e1c 45%, #04122a 100%);
  --grid-line-1: rgba(129, 212, 250, 0.08);
  --grid-line-2: rgba(129, 212, 250, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(129, 212, 250, 0.06), transparent 20%);
  --ghost-surface: rgba(5, 18, 36, 0.8);
  --tool-hover: #091c30;
  --tool-hover-border: rgba(129, 212, 250, 0.2);
  --editor-border: rgba(129, 212, 250, 0.1);
  --focus-ring: rgba(129, 212, 250, 0.3);
  --placeholder: rgba(129, 205, 228, 0.6);
  --blockquote-border: rgba(129, 212, 250, 0.42);
  --blockquote-text: #81cde4;
  --scripture-gradient: linear-gradient(180deg, rgba(4, 14, 28, 0.99), rgba(2, 9, 18, 0.99));
  --select-surface: rgba(4, 14, 28, 0.95);
  --select-border: rgba(129, 212, 250, 0.12);
  --verse-surface: rgba(3, 11, 22, 0.92);
  --verse-border: rgba(129, 212, 250, 0.08);
  --list-text: #81cde4;
  --input-surface: rgba(4, 14, 28, 0.95);
  --note-chip-surface: rgba(6, 18, 35, 0.88);
  --note-chip-active: #091c30;
  --note-chip-border: rgba(129, 212, 250, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "arctic-frost",
  name: "Arctic Frost",
  supports: "both",
  swatches: ["#f5fbff", "#0277bd", "#dbeeff", "#032340"]
});
