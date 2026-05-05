window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="rose-garden"] {
  --font-heading: "Playfair Display", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 244, 246, 0.95);
  --surface-strong: #fff4f6;
  --surface-accent: #fce4ec;
  --text: #1a0810;
  --muted: #9e3050;
  --border: rgba(232, 96, 138, 0.14);
  --accent: #e8608a;
  --accent-strong: #c2185b;
  --shadow: 0 24px 80px rgba(180, 40, 80, 0.12);
  --hero-glow-left: rgba(232, 96, 138, 0.26);
  --hero-glow-right: rgba(255, 140, 170, 0.18);
  --page-gradient: linear-gradient(160deg, #fce4ec 0%, #f8bbd0 45%, #f48fb1 100%);
  --grid-line-1: rgba(255, 255, 255, 0.24);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.38), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.74);
  --tool-hover: #fce4ec;
  --tool-hover-border: rgba(232, 96, 138, 0.20);
  --editor-border: rgba(232, 96, 138, 0.07);
  --focus-ring: rgba(232, 96, 138, 0.24);
  --placeholder: rgba(158, 48, 80, 0.60);
  --blockquote-border: rgba(232, 96, 138, 0.36);
  --blockquote-text: #7a1830;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 244, 246, 0.97), rgba(252, 228, 236, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(232, 96, 138, 0.12);
  --verse-surface: rgba(255, 248, 250, 0.88);
  --verse-border: rgba(232, 96, 138, 0.08);
  --list-text: #7a1830;
  --input-surface: rgba(255, 255, 255, 0.94);
  --note-chip-surface: rgba(255, 255, 255, 0.76);
  --note-chip-active: #fce4ec;
  --note-chip-border: rgba(232, 96, 138, 0.12);
  --radius-xl: 32px;
  --radius-lg: 24px;
  --radius-md: 16px;
  color-scheme: light;
}
[data-color-theme="rose-garden"][data-theme="dark"] {
  --surface: rgba(24, 4, 12, 0.93);
  --surface-strong: #18040c;
  --surface-accent: #2a0818;
  --text: #fce4ec;
  --muted: #f06090;
  --border: rgba(240, 96, 144, 0.15);
  --accent: #f06090;
  --accent-strong: #f8a0b8;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.52);
  --hero-glow-left: rgba(180, 40, 80, 0.28);
  --hero-glow-right: rgba(120, 20, 50, 0.20);
  --page-gradient: linear-gradient(160deg, #140208 0%, #18040c 45%, #200810 100%);
  --grid-line-1: rgba(240, 96, 144, 0.08);
  --grid-line-2: rgba(240, 96, 144, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(240, 96, 144, 0.06), transparent 20%);
  --ghost-surface: rgba(34, 8, 18, 0.82);
  --tool-hover: #2a0818;
  --tool-hover-border: rgba(240, 96, 144, 0.22);
  --editor-border: rgba(240, 96, 144, 0.10);
  --focus-ring: rgba(240, 96, 144, 0.30);
  --placeholder: rgba(240, 96, 144, 0.60);
  --blockquote-border: rgba(240, 96, 144, 0.42);
  --blockquote-text: #f06090;
  --scripture-gradient: linear-gradient(180deg, rgba(26, 5, 12, 0.99), rgba(18, 3, 8, 0.99));
  --select-surface: rgba(26, 5, 12, 0.96);
  --select-border: rgba(240, 96, 144, 0.12);
  --verse-surface: rgba(20, 4, 10, 0.94);
  --verse-border: rgba(240, 96, 144, 0.08);
  --list-text: #f06090;
  --input-surface: rgba(26, 5, 12, 0.96);
  --note-chip-surface: rgba(32, 7, 16, 0.88);
  --note-chip-active: #2a0818;
  --note-chip-border: rgba(240, 96, 144, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "rose-garden",
  name: "Rose Garden",
  supports: "both",
  swatches: ["#fff4f6", "#e8608a", "#fce4ec", "#1a0810"]
});
