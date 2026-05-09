window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="neon-sermon"] {
  --font-heading: "Orbitron", sans-serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(10, 0, 16, 0.96);
  --surface-strong: #0a0010;
  --surface-accent: #160024;
  --text: #ffd6ff;
  --muted: #dd80ff;
  --border: rgba(200, 0, 255, 0.18);
  --accent: #e040fb;
  --accent-strong: #f080ff;
  --shadow: 0 0 70px rgba(180, 0, 220, 0.24);
  --hero-glow-left: rgba(200, 0, 255, 0.22);
  --hero-glow-right: rgba(140, 0, 200, 0.16);
  --page-gradient: linear-gradient(160deg, #060010 0%, #0a0018 45%, #100020 100%);
  --grid-line-1: rgba(200, 0, 255, 0.12);
  --grid-line-2: rgba(200, 0, 255, 0.06);
  --panel-highlight: linear-gradient(180deg, rgba(200, 0, 255, 0.06), transparent 20%);
  --ghost-surface: rgba(16, 4, 26, 0.82);
  --tool-hover: #180028;
  --tool-hover-border: rgba(200, 0, 255, 0.28);
  --editor-border: rgba(200, 0, 255, 0.10);
  --focus-ring: rgba(200, 0, 255, 0.36);
  --placeholder: rgba(220, 128, 255, 0.58);
  --blockquote-border: rgba(200, 0, 255, 0.48);
  --blockquote-text: #dd80ff;
  --scripture-gradient: linear-gradient(180deg, rgba(12, 2, 20, 0.99), rgba(8, 0, 14, 0.99));
  --select-surface: rgba(14, 2, 24, 0.96);
  --select-border: rgba(200, 0, 255, 0.14);
  --verse-surface: rgba(10, 1, 18, 0.94);
  --verse-border: rgba(200, 0, 255, 0.08);
  --list-text: #dd80ff;
  --input-surface: rgba(14, 2, 24, 0.96);
  --note-chip-surface: rgba(18, 4, 28, 0.90);
  --note-chip-active: #180028;
  --note-chip-border: rgba(200, 0, 255, 0.14);
  --radius-xl: 4px;
  --radius-lg: 3px;
  --radius-md: 2px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "neon-sermon",
  name: "Neon Sermon",
  supports: "dark",
  swatches: ["#0a0010", "#e040fb", "#160024", "#ffd6ff"]
});
