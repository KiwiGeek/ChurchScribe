window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="crimson-faith"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 245, 245, 0.93);
  --surface-strong: #fff5f5;
  --surface-accent: #fce4e4;
  --text: #1a0404;
  --muted: #8b2020;
  --border: rgba(198, 40, 40, 0.14);
  --accent: #c62828;
  --accent-strong: #8e0000;
  --shadow: 0 24px 80px rgba(140, 20, 20, 0.15);
  --hero-glow-left: rgba(229, 57, 53, 0.28);
  --hero-glow-right: rgba(198, 40, 40, 0.18);
  --page-gradient: linear-gradient(160deg, #ffebee 0%, #ffcdd2 45%, #ef9a9a 100%);
  --grid-line-1: rgba(255, 255, 255, 0.2);
  --grid-line-2: rgba(255, 255, 255, 0.12);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.32), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.68);
  --tool-hover: #fce4e4;
  --tool-hover-border: rgba(198, 40, 40, 0.2);
  --editor-border: rgba(198, 40, 40, 0.08);
  --focus-ring: rgba(198, 40, 40, 0.25);
  --placeholder: rgba(139, 32, 32, 0.6);
  --blockquote-border: rgba(198, 40, 40, 0.38);
  --blockquote-text: #6b1414;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 248, 248, 0.97), rgba(252, 228, 228, 0.98));
  --select-surface: rgba(255, 255, 255, 0.9);
  --select-border: rgba(198, 40, 40, 0.12);
  --verse-surface: rgba(255, 250, 250, 0.86);
  --verse-border: rgba(198, 40, 40, 0.08);
  --list-text: #6b1414;
  --input-surface: rgba(255, 255, 255, 0.92);
  --note-chip-surface: rgba(255, 255, 255, 0.74);
  --note-chip-active: #fce4e4;
  --note-chip-border: rgba(198, 40, 40, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="crimson-faith"][data-theme="dark"] {
  --surface: rgba(26, 4, 4, 0.92);
  --surface-strong: #1a0404;
  --surface-accent: #260808;
  --text: #ffebee;
  --muted: #ef9a9a;
  --border: rgba(239, 83, 80, 0.15);
  --accent: #ef5350;
  --accent-strong: #ff8a80;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(180, 30, 30, 0.28);
  --hero-glow-right: rgba(140, 20, 20, 0.18);
  --page-gradient: linear-gradient(160deg, #110202 0%, #1a0404 45%, #220808 100%);
  --grid-line-1: rgba(239, 83, 80, 0.08);
  --grid-line-2: rgba(239, 83, 80, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(239, 83, 80, 0.06), transparent 20%);
  --ghost-surface: rgba(36, 6, 6, 0.8);
  --tool-hover: #2a0606;
  --tool-hover-border: rgba(239, 83, 80, 0.22);
  --editor-border: rgba(239, 83, 80, 0.1);
  --focus-ring: rgba(239, 83, 80, 0.3);
  --placeholder: rgba(239, 154, 154, 0.6);
  --blockquote-border: rgba(239, 83, 80, 0.42);
  --blockquote-text: #ef9a9a;
  --scripture-gradient: linear-gradient(180deg, rgba(28, 5, 5, 0.99), rgba(18, 3, 3, 0.99));
  --select-surface: rgba(28, 5, 5, 0.95);
  --select-border: rgba(239, 83, 80, 0.12);
  --verse-surface: rgba(22, 4, 4, 0.92);
  --verse-border: rgba(239, 83, 80, 0.08);
  --list-text: #ef9a9a;
  --input-surface: rgba(28, 5, 5, 0.95);
  --note-chip-surface: rgba(34, 6, 6, 0.88);
  --note-chip-active: #2a0606;
  --note-chip-border: rgba(239, 83, 80, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "crimson-faith",
  name: "Crimson Faith",
  supports: "both",
  swatches: ["#fff5f5", "#c62828", "#fce4e4", "#1a0404"]
});
