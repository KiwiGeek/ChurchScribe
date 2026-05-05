window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="morning-mist"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(248, 251, 255, 0.95);
  --surface-strong: #f8fbff;
  --surface-accent: #dce8f4;
  --text: #1a2630;
  --muted: #5c7a8c;
  --border: rgba(107, 143, 168, 0.15);
  --accent: #6b8fa8;
  --accent-strong: #4a6e88;
  --shadow: 0 24px 80px rgba(60, 100, 130, 0.10);
  --hero-glow-left: rgba(107, 143, 168, 0.22);
  --hero-glow-right: rgba(150, 190, 210, 0.14);
  --page-gradient: linear-gradient(160deg, #eef4fa 0%, #dce8f4 45%, #c8dcea 100%);
  --grid-line-1: rgba(255, 255, 255, 0.24);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.40), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.72);
  --tool-hover: #dce8f4;
  --tool-hover-border: rgba(107, 143, 168, 0.20);
  --editor-border: rgba(107, 143, 168, 0.07);
  --focus-ring: rgba(107, 143, 168, 0.24);
  --placeholder: rgba(92, 122, 140, 0.60);
  --blockquote-border: rgba(107, 143, 168, 0.38);
  --blockquote-text: #3e6070;
  --scripture-gradient: linear-gradient(180deg, rgba(248, 251, 255, 0.97), rgba(220, 232, 244, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(107, 143, 168, 0.12);
  --verse-surface: rgba(250, 253, 255, 0.88);
  --verse-border: rgba(107, 143, 168, 0.08);
  --list-text: #3e6070;
  --input-surface: rgba(255, 255, 255, 0.95);
  --note-chip-surface: rgba(255, 255, 255, 0.76);
  --note-chip-active: #dce8f4;
  --note-chip-border: rgba(107, 143, 168, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "morning-mist",
  name: "Morning Mist",
  supports: "light",
  swatches: ["#f8fbff", "#6b8fa8", "#dce8f4", "#1a2630"]
});
