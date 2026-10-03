window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="quarry-stone"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(244, 245, 247, 0.96);
  --surface-strong: #f4f5f7;
  --surface-accent: #e4e7ec;
  --text: #1f2430;
  --muted: #667085;
  --border: rgba(82, 92, 110, 0.16);
  --accent: #5b677a;
  --accent-strong: #344054;
  --shadow: 0 20px 60px rgba(40, 50, 70, 0.1);
  --hero-glow-left: rgba(140, 150, 170, 0.18);
  --hero-glow-right: rgba(120, 130, 150, 0.1);
  --page-gradient: linear-gradient(160deg, #eceef2 0%, #e4e7ec 50%, #d8dde6 100%);
  --grid-line-1: rgba(255, 255, 255, 0.35);
  --grid-line-2: rgba(255, 255, 255, 0.18);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.45), transparent 20%);
  --ghost-surface: rgba(250, 251, 252, 0.86);
  --tool-hover: #e4e7ec;
  --tool-hover-border: rgba(82, 92, 110, 0.2);
  --editor-border: rgba(82, 92, 110, 0.08);
  --focus-ring: rgba(91, 103, 122, 0.28);
  --placeholder: rgba(102, 112, 133, 0.55);
  --blockquote-border: rgba(91, 103, 122, 0.35);
  --blockquote-text: #475467;
  --scripture-gradient: linear-gradient(180deg, rgba(247, 248, 250, 0.98), rgba(236, 239, 244, 0.98));
  --select-surface: rgba(255, 255, 255, 0.94);
  --select-border: rgba(82, 92, 110, 0.14);
  --verse-surface: rgba(250, 251, 252, 0.92);
  --verse-border: rgba(82, 92, 110, 0.08);
  --list-text: #475467;
  --input-surface: rgba(255, 255, 255, 0.96);
  --note-chip-surface: rgba(255, 255, 255, 0.84);
  --note-chip-active: #e4e7ec;
  --note-chip-border: rgba(82, 92, 110, 0.12);
  --radius-xl: 10px;
  --radius-lg: 8px;
  --radius-md: 6px;
  color-scheme: light;
}
[data-color-theme="quarry-stone"][data-theme="dark"] {
  --surface: rgba(18, 20, 24, 0.96);
  --surface-strong: #121418;
  --surface-accent: #1e2229;
  --text: #e8eaed;
  --muted: #98a2b3;
  --border: rgba(152, 162, 179, 0.14);
  --accent: #98a2b3;
  --accent-strong: #d0d5dd;
  --shadow: 0 28px 80px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(80, 90, 110, 0.16);
  --hero-glow-right: rgba(50, 60, 80, 0.1);
  --page-gradient: linear-gradient(160deg, #0d0f12 0%, #121418 48%, #181b21 100%);
  --grid-line-1: rgba(152, 162, 179, 0.07);
  --grid-line-2: rgba(152, 162, 179, 0.03);
  --panel-highlight: linear-gradient(180deg, rgba(152, 162, 179, 0.05), transparent 20%);
  --ghost-surface: rgba(22, 25, 31, 0.9);
  --tool-hover: #1e2229;
  --tool-hover-border: rgba(152, 162, 179, 0.2);
  --editor-border: rgba(152, 162, 179, 0.09);
  --focus-ring: rgba(152, 162, 179, 0.28);
  --placeholder: rgba(152, 162, 179, 0.5);
  --blockquote-border: rgba(152, 162, 179, 0.35);
  --blockquote-text: #98a2b3;
  --scripture-gradient: linear-gradient(180deg, rgba(16, 18, 22, 0.99), rgba(12, 14, 17, 0.99));
  --select-surface: rgba(18, 20, 24, 0.96);
  --select-border: rgba(152, 162, 179, 0.12);
  --verse-surface: rgba(14, 16, 20, 0.95);
  --verse-border: rgba(152, 162, 179, 0.08);
  --list-text: #98a2b3;
  --input-surface: rgba(18, 20, 24, 0.96);
  --note-chip-surface: rgba(24, 27, 33, 0.9);
  --note-chip-active: #1e2229;
  --note-chip-border: rgba(152, 162, 179, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "quarry-stone",
  name: "Quarry Stone",
  supports: "both",
  featured: true,
  tags: ["cool", "minimal"],
  swatches: ["#f4f5f7", "#5b677a", "#e4e7ec", "#1f2430"]
});
