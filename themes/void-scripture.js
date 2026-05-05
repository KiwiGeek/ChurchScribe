window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="void-scripture"] {
  --font-heading: "Cinzel", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(6, 6, 6, 0.98);
  --surface-strong: #060606;
  --surface-accent: #141414;
  --text: #e8e0d4;
  --muted: #a09888;
  --border: rgba(200, 184, 154, 0.14);
  --accent: #c8b89a;
  --accent-strong: #e0d0b8;
  --shadow: 0 0 60px rgba(0, 0, 0, 0.60);
  --hero-glow-left: rgba(200, 184, 154, 0.12);
  --hero-glow-right: rgba(160, 148, 128, 0.08);
  --page-gradient: linear-gradient(160deg, #040404 0%, #060606 45%, #0a0a0a 100%);
  --grid-line-1: rgba(200, 184, 154, 0.07);
  --grid-line-2: rgba(200, 184, 154, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 20%);
  --ghost-surface: rgba(14, 14, 14, 0.85);
  --tool-hover: #181818;
  --tool-hover-border: rgba(200, 184, 154, 0.18);
  --editor-border: rgba(200, 184, 154, 0.08);
  --focus-ring: rgba(200, 184, 154, 0.28);
  --placeholder: rgba(160, 152, 136, 0.60);
  --blockquote-border: rgba(200, 184, 154, 0.38);
  --blockquote-text: #a09888;
  --scripture-gradient: linear-gradient(180deg, rgba(8, 8, 8, 0.99), rgba(4, 4, 4, 0.99));
  --select-surface: rgba(12, 12, 12, 0.97);
  --select-border: rgba(200, 184, 154, 0.12);
  --verse-surface: rgba(8, 8, 8, 0.95);
  --verse-border: rgba(200, 184, 154, 0.07);
  --list-text: #a09888;
  --input-surface: rgba(12, 12, 12, 0.97);
  --note-chip-surface: rgba(16, 16, 16, 0.90);
  --note-chip-active: #181818;
  --note-chip-border: rgba(200, 184, 154, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "void-scripture",
  name: "Void Scripture",
  supports: "dark",
  swatches: ["#060606", "#c8b89a", "#141414", "#e8e0d4"]
});
