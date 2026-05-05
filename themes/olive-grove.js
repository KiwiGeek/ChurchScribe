window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="olive-grove"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(248, 248, 240, 0.96);
  --surface-strong: #f8f8f0;
  --surface-accent: #e4e8c8;
  --text: #1a1c08;
  --muted: #606830;
  --border: rgba(123, 140, 74, 0.14);
  --accent: #7b8c4a;
  --accent-strong: #5a6830;
  --shadow: 0 24px 80px rgba(80, 90, 30, 0.10);
  --hero-glow-left: rgba(123, 140, 74, 0.22);
  --hero-glow-right: rgba(170, 188, 100, 0.14);
  --page-gradient: linear-gradient(160deg, #f0f0d8 0%, #e4e8c8 45%, #d4d8a8 100%);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.38), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.74);
  --tool-hover: #e4e8c8;
  --tool-hover-border: rgba(123, 140, 74, 0.20);
  --editor-border: rgba(123, 140, 74, 0.07);
  --focus-ring: rgba(123, 140, 74, 0.24);
  --placeholder: rgba(96, 104, 48, 0.60);
  --blockquote-border: rgba(123, 140, 74, 0.36);
  --blockquote-text: #464c18;
  --scripture-gradient: linear-gradient(180deg, rgba(248, 248, 240, 0.97), rgba(228, 232, 200, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(123, 140, 74, 0.12);
  --verse-surface: rgba(250, 250, 244, 0.88);
  --verse-border: rgba(123, 140, 74, 0.08);
  --list-text: #464c18;
  --input-surface: rgba(255, 255, 255, 0.94);
  --note-chip-surface: rgba(255, 255, 255, 0.78);
  --note-chip-active: #e4e8c8;
  --note-chip-border: rgba(123, 140, 74, 0.12);
  --radius-xl: 20px;
  --radius-lg: 14px;
  --radius-md: 10px;
  color-scheme: light;
}
[data-color-theme="olive-grove"][data-theme="dark"] {
  --surface: rgba(12, 14, 4, 0.94);
  --surface-strong: #0c0e04;
  --surface-accent: #1a1c08;
  --text: #f0f0d8;
  --muted: #a8b060;
  --border: rgba(168, 176, 96, 0.14);
  --accent: #a8b060;
  --accent-strong: #c8d080;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.50);
  --hero-glow-left: rgba(90, 100, 30, 0.26);
  --hero-glow-right: rgba(60, 68, 16, 0.18);
  --page-gradient: linear-gradient(160deg, #080a02 0%, #0c0e04 45%, #121406 100%);
  --grid-line-1: rgba(168, 176, 96, 0.08);
  --grid-line-2: rgba(168, 176, 96, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(168, 176, 96, 0.06), transparent 20%);
  --ghost-surface: rgba(18, 20, 6, 0.82);
  --tool-hover: #1a1c08;
  --tool-hover-border: rgba(168, 176, 96, 0.22);
  --editor-border: rgba(168, 176, 96, 0.10);
  --focus-ring: rgba(168, 176, 96, 0.28);
  --placeholder: rgba(168, 176, 96, 0.58);
  --blockquote-border: rgba(168, 176, 96, 0.40);
  --blockquote-text: #a8b060;
  --scripture-gradient: linear-gradient(180deg, rgba(14, 16, 4, 0.99), rgba(8, 10, 2, 0.99));
  --select-surface: rgba(14, 16, 4, 0.96);
  --select-border: rgba(168, 176, 96, 0.12);
  --verse-surface: rgba(12, 14, 4, 0.94);
  --verse-border: rgba(168, 176, 96, 0.08);
  --list-text: #a8b060;
  --input-surface: rgba(14, 16, 4, 0.96);
  --note-chip-surface: rgba(18, 20, 6, 0.88);
  --note-chip-active: #1a1c08;
  --note-chip-border: rgba(168, 176, 96, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "olive-grove",
  name: "Olive Grove",
  supports: "both",
  swatches: ["#f8f8f0", "#7b8c4a", "#e4e8c8", "#1a1c08"]
});
