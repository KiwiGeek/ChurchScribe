window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="sunset-revival"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 248, 246, 0.93);
  --surface-strong: #fff8f6;
  --surface-accent: #fce4da;
  --text: #1a0508;
  --muted: #8b3040;
  --border: rgba(233, 30, 99, 0.14);
  --accent: #e91e63;
  --accent-strong: #880e4f;
  --shadow: 0 24px 80px rgba(180, 20, 70, 0.14);
  --hero-glow-left: rgba(244, 67, 54, 0.28);
  --hero-glow-right: rgba(233, 30, 99, 0.18);
  --page-gradient: linear-gradient(160deg, #fff3ef 0%, #ffdde0 45%, #ffb3b0 100%);
  --grid-line-1: rgba(255, 255, 255, 0.2);
  --grid-line-2: rgba(255, 255, 255, 0.12);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.32), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.7);
  --tool-hover: #fce4da;
  --tool-hover-border: rgba(233, 30, 99, 0.2);
  --editor-border: rgba(233, 30, 99, 0.08);
  --focus-ring: rgba(233, 30, 99, 0.25);
  --placeholder: rgba(139, 48, 64, 0.62);
  --blockquote-border: rgba(233, 30, 99, 0.38);
  --blockquote-text: #7a1830;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 248, 246, 0.97), rgba(252, 228, 218, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(233, 30, 99, 0.12);
  --verse-surface: rgba(255, 251, 250, 0.88);
  --verse-border: rgba(233, 30, 99, 0.08);
  --list-text: #7a1830;
  --input-surface: rgba(255, 255, 255, 0.94);
  --note-chip-surface: rgba(255, 255, 255, 0.76);
  --note-chip-active: #fce4da;
  --note-chip-border: rgba(233, 30, 99, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="sunset-revival"][data-theme="dark"] {
  --surface: rgba(26, 5, 8, 0.92);
  --surface-strong: #1a0508;
  --surface-accent: #260a10;
  --text: #ffe0e8;
  --muted: #ff6090;
  --border: rgba(255, 96, 144, 0.15);
  --accent: #ff6090;
  --accent-strong: #ff90b8;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(200, 20, 60, 0.3);
  --hero-glow-right: rgba(150, 15, 45, 0.2);
  --page-gradient: linear-gradient(160deg, #130305 0%, #1a0508 45%, #220a10 100%);
  --grid-line-1: rgba(255, 96, 144, 0.08);
  --grid-line-2: rgba(255, 96, 144, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(255, 96, 144, 0.06), transparent 20%);
  --ghost-surface: rgba(36, 8, 14, 0.82);
  --tool-hover: #2a0810;
  --tool-hover-border: rgba(255, 96, 144, 0.22);
  --editor-border: rgba(255, 96, 144, 0.1);
  --focus-ring: rgba(255, 96, 144, 0.3);
  --placeholder: rgba(255, 96, 144, 0.6);
  --blockquote-border: rgba(255, 96, 144, 0.42);
  --blockquote-text: #ff6090;
  --scripture-gradient: linear-gradient(180deg, rgba(28, 6, 10, 0.99), rgba(18, 3, 6, 0.99));
  --select-surface: rgba(28, 6, 10, 0.96);
  --select-border: rgba(255, 96, 144, 0.12);
  --verse-surface: rgba(22, 4, 8, 0.94);
  --verse-border: rgba(255, 96, 144, 0.08);
  --list-text: #ff6090;
  --input-surface: rgba(28, 6, 10, 0.96);
  --note-chip-surface: rgba(34, 8, 14, 0.9);
  --note-chip-active: #2a0810;
  --note-chip-border: rgba(255, 96, 144, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "sunset-revival",
  name: "Sunset Revival",
  supports: "both",
  swatches: ["#fff8f6", "#e91e63", "#fce4da", "#1a0508"]
});
