window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="spring-meadow"] {
  --font-heading: "Playfair Display", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(250, 255, 242, 0.95);
  --surface-strong: #fafff2;
  --surface-accent: #dff2c0;
  --text: #1a2a0a;
  --muted: #5a7a28;
  --border: rgba(100, 155, 40, 0.14);
  --accent: #7aad3a;
  --accent-strong: #5a8a1e;
  --shadow: 0 24px 80px rgba(60, 110, 20, 0.10);
  --hero-glow-left: rgba(122, 173, 58, 0.24);
  --hero-glow-right: rgba(180, 220, 80, 0.16);
  --page-gradient: linear-gradient(160deg, #f0fad8 0%, #dff2c0 45%, #c8e898 100%);
  --grid-line-1: rgba(255, 255, 255, 0.26);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.36), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.74);
  --tool-hover: #dff2c0;
  --tool-hover-border: rgba(100, 155, 40, 0.20);
  --editor-border: rgba(100, 155, 40, 0.08);
  --focus-ring: rgba(122, 173, 58, 0.24);
  --placeholder: rgba(90, 122, 40, 0.60);
  --blockquote-border: rgba(100, 155, 40, 0.38);
  --blockquote-text: #3e6014;
  --scripture-gradient: linear-gradient(180deg, rgba(248, 255, 238, 0.97), rgba(223, 242, 192, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(100, 155, 40, 0.12);
  --verse-surface: rgba(250, 255, 242, 0.88);
  --verse-border: rgba(100, 155, 40, 0.08);
  --list-text: #3e6014;
  --input-surface: rgba(255, 255, 255, 0.95);
  --note-chip-surface: rgba(255, 255, 255, 0.76);
  --note-chip-active: #dff2c0;
  --note-chip-border: rgba(100, 155, 40, 0.12);
  --radius-xl: 32px;
  --radius-lg: 24px;
  --radius-md: 16px;
  color-scheme: light;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "spring-meadow",
  name: "Spring Meadow",
  supports: "light",
  swatches: ["#fafff2", "#7aad3a", "#dff2c0", "#1a2a0a"]
});
