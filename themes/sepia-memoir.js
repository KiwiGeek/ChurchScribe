window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="sepia-memoir"] {
  --font-heading: "Playfair Display", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(248, 242, 224, 0.95);
  --surface-strong: #f8f0e0;
  --surface-accent: #e8d8b8;
  --text: #2a1800;
  --muted: #7a5a3a;
  --border: rgba(100, 70, 30, 0.16);
  --accent: #6b4c2a;
  --accent-strong: #4a3010;
  --shadow: 0 24px 80px rgba(80, 50, 20, 0.16);
  --hero-glow-left: rgba(160, 120, 60, 0.25);
  --hero-glow-right: rgba(140, 100, 50, 0.16);
  --page-gradient: linear-gradient(160deg, #f0e8cc 0%, #e8d8b0 45%, #dcc89a 100%);
  --grid-line-1: rgba(255, 255, 255, 0.24);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.36), transparent 20%);
  --ghost-surface: rgba(248, 240, 220, 0.76);
  --tool-hover: #e8d8b8;
  --tool-hover-border: rgba(100, 70, 30, 0.2);
  --editor-border: rgba(100, 70, 30, 0.08);
  --focus-ring: rgba(107, 76, 42, 0.26);
  --placeholder: rgba(122, 90, 58, 0.62);
  --blockquote-border: rgba(107, 76, 42, 0.38);
  --blockquote-text: #5a3a18;
  --scripture-gradient: linear-gradient(180deg, rgba(248, 242, 224, 0.97), rgba(232, 216, 184, 0.98));
  --select-surface: rgba(255, 252, 240, 0.92);
  --select-border: rgba(100, 70, 30, 0.12);
  --verse-surface: rgba(252, 246, 228, 0.88);
  --verse-border: rgba(100, 70, 30, 0.08);
  --list-text: #5a3a18;
  --input-surface: rgba(255, 252, 240, 0.94);
  --note-chip-surface: rgba(255, 252, 240, 0.78);
  --note-chip-active: #e8d8b8;
  --note-chip-border: rgba(100, 70, 30, 0.1);
  --radius-xl: 4px;
  --radius-lg: 3px;
  --radius-md: 2px;
  color-scheme: light;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "sepia-memoir",
  name: "Sepia Memoir",
  supports: "light",
  swatches: ["#f8f0e0", "#6b4c2a", "#e8d8b8", "#2a1800"]
});
