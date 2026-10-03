window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="sapphire-lectionary"] {
  --font-heading: "Cinzel", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(244, 247, 252, 0.96);
  --surface-strong: #f4f7fc;
  --surface-accent: #dde7f5;
  --text: #14213d;
  --muted: #4a6080;
  --border: rgba(30, 64, 120, 0.14);
  --accent: #1e4a8c;
  --accent-strong: #123568;
  --shadow: 0 22px 70px rgba(20, 40, 80, 0.12);
  --hero-glow-left: rgba(70, 110, 180, 0.18);
  --hero-glow-right: rgba(30, 74, 140, 0.12);
  --page-gradient: linear-gradient(160deg, #eef3fa 0%, #e2ebf6 48%, #d5e2f2 100%);
  --grid-line-1: rgba(255, 255, 255, 0.4);
  --grid-line-2: rgba(255, 255, 255, 0.2);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.5), transparent 20%);
  --ghost-surface: rgba(250, 252, 255, 0.88);
  --tool-hover: #dde7f5;
  --tool-hover-border: rgba(30, 74, 140, 0.22);
  --editor-border: rgba(30, 74, 140, 0.08);
  --focus-ring: rgba(30, 74, 140, 0.28);
  --placeholder: rgba(74, 96, 128, 0.55);
  --blockquote-border: rgba(30, 74, 140, 0.4);
  --blockquote-text: #2a4068;
  --scripture-gradient: linear-gradient(180deg, rgba(248, 250, 253, 0.98), rgba(232, 240, 250, 0.98));
  --select-surface: rgba(255, 255, 255, 0.95);
  --select-border: rgba(30, 74, 140, 0.14);
  --verse-surface: rgba(250, 252, 255, 0.93);
  --verse-border: rgba(30, 74, 140, 0.08);
  --list-text: #2a4068;
  --input-surface: rgba(255, 255, 255, 0.97);
  --note-chip-surface: rgba(255, 255, 255, 0.86);
  --note-chip-active: #dde7f5;
  --note-chip-border: rgba(30, 74, 140, 0.12);
  --radius-xl: 10px;
  --radius-lg: 8px;
  --radius-md: 6px;
  color-scheme: light;
}
[data-color-theme="sapphire-lectionary"][data-theme="dark"] {
  --surface: rgba(10, 18, 36, 0.96);
  --surface-strong: #0a1224;
  --surface-accent: #142240;
  --text: #e8eef8;
  --muted: #9eb0cc;
  --border: rgba(120, 150, 200, 0.16);
  --accent: #6f97d8;
  --accent-strong: #a8c2ec;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.6);
  --hero-glow-left: rgba(40, 70, 140, 0.28);
  --hero-glow-right: rgba(20, 40, 90, 0.18);
  --page-gradient: linear-gradient(160deg, #060b16 0%, #0a1224 48%, #101c34 100%);
  --grid-line-1: rgba(111, 151, 216, 0.08);
  --grid-line-2: rgba(111, 151, 216, 0.03);
  --panel-highlight: linear-gradient(180deg, rgba(111, 151, 216, 0.06), transparent 20%);
  --ghost-surface: rgba(14, 24, 44, 0.9);
  --tool-hover: #182848;
  --tool-hover-border: rgba(111, 151, 216, 0.24);
  --editor-border: rgba(111, 151, 216, 0.1);
  --focus-ring: rgba(111, 151, 216, 0.32);
  --placeholder: rgba(158, 176, 204, 0.5);
  --blockquote-border: rgba(111, 151, 216, 0.4);
  --blockquote-text: #9eb0cc;
  --scripture-gradient: linear-gradient(180deg, rgba(10, 18, 36, 0.99), rgba(6, 12, 24, 0.99));
  --select-surface: rgba(10, 18, 36, 0.96);
  --select-border: rgba(111, 151, 216, 0.14);
  --verse-surface: rgba(8, 14, 28, 0.95);
  --verse-border: rgba(111, 151, 216, 0.08);
  --list-text: #9eb0cc;
  --input-surface: rgba(10, 18, 36, 0.96);
  --note-chip-surface: rgba(16, 28, 50, 0.9);
  --note-chip-active: #182848;
  --note-chip-border: rgba(111, 151, 216, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "sapphire-lectionary",
  name: "Sapphire Lectionary",
  supports: "both",
  featured: true,
  tags: ["cool", "bold"],
  swatches: ["#f4f7fc", "#1e4a8c", "#dde7f5", "#14213d"]
});
