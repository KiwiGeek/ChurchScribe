window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="steel-resolve"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(242, 246, 250, 0.94);
  --surface-strong: #f2f4f6;
  --surface-accent: #dde4ea;
  --text: #0e1820;
  --muted: #4a6070;
  --border: rgba(61, 81, 102, 0.14);
  --accent: #3d5166;
  --accent-strong: #2a3a4e;
  --shadow: 0 24px 80px rgba(40, 60, 90, 0.14);
  --hero-glow-left: rgba(100, 140, 180, 0.22);
  --hero-glow-right: rgba(80, 110, 150, 0.14);
  --page-gradient: linear-gradient(160deg, #e0e8f0 0%, #ccd8e4 45%, #b8c8d8 100%);
  --grid-line-1: rgba(255, 255, 255, 0.24);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.36), transparent 20%);
  --ghost-surface: rgba(246, 250, 254, 0.78);
  --tool-hover: #dde4ea;
  --tool-hover-border: rgba(61, 81, 102, 0.18);
  --editor-border: rgba(61, 81, 102, 0.08);
  --focus-ring: rgba(61, 81, 102, 0.24);
  --placeholder: rgba(74, 96, 112, 0.6);
  --blockquote-border: rgba(61, 81, 102, 0.34);
  --blockquote-text: #2a3a4e;
  --scripture-gradient: linear-gradient(180deg, rgba(242, 246, 250, 0.97), rgba(221, 228, 234, 0.98));
  --select-surface: rgba(250, 252, 255, 0.92);
  --select-border: rgba(61, 81, 102, 0.12);
  --verse-surface: rgba(246, 250, 253, 0.88);
  --verse-border: rgba(61, 81, 102, 0.08);
  --list-text: #2a3a4e;
  --input-surface: rgba(250, 252, 255, 0.94);
  --note-chip-surface: rgba(250, 252, 255, 0.78);
  --note-chip-active: #dde4ea;
  --note-chip-border: rgba(61, 81, 102, 0.1);
  --radius-xl: 8px;
  --radius-lg: 6px;
  --radius-md: 4px;
  color-scheme: light;
}
[data-color-theme="steel-resolve"][data-theme="dark"] {
  --surface: rgba(8, 12, 18, 0.94);
  --surface-strong: #080c12;
  --surface-accent: #101820;
  --text: #dce8f0;
  --muted: #7898b0;
  --border: rgba(100, 140, 180, 0.14);
  --accent: #6080a0;
  --accent-strong: #88a8c8;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.56);
  --hero-glow-left: rgba(60, 100, 150, 0.24);
  --hero-glow-right: rgba(40, 80, 130, 0.18);
  --page-gradient: linear-gradient(160deg, #060a10 0%, #08101a 45%, #0c1420 100%);
  --grid-line-1: rgba(100, 140, 180, 0.1);
  --grid-line-2: rgba(100, 140, 180, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(100, 140, 180, 0.07), transparent 20%);
  --ghost-surface: rgba(12, 18, 26, 0.84);
  --tool-hover: #101820;
  --tool-hover-border: rgba(100, 140, 180, 0.2);
  --editor-border: rgba(100, 140, 180, 0.1);
  --focus-ring: rgba(100, 140, 180, 0.3);
  --placeholder: rgba(120, 152, 176, 0.56);
  --blockquote-border: rgba(100, 140, 180, 0.4);
  --blockquote-text: #7898b0;
  --scripture-gradient: linear-gradient(180deg, rgba(8, 12, 18, 0.99), rgba(5, 8, 14, 0.99));
  --select-surface: rgba(8, 12, 18, 0.96);
  --select-border: rgba(100, 140, 180, 0.12);
  --verse-surface: rgba(7, 10, 16, 0.94);
  --verse-border: rgba(100, 140, 180, 0.08);
  --list-text: #7898b0;
  --input-surface: rgba(10, 14, 22, 0.96);
  --note-chip-surface: rgba(12, 18, 26, 0.88);
  --note-chip-active: #101820;
  --note-chip-border: rgba(100, 140, 180, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "steel-resolve",
  name: "Steel Resolve",
  supports: "both",
  swatches: ["#f2f4f6", "#3d5166", "#dde4ea", "#0e1820"]
});
