window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="plum-twilight"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(248, 242, 252, 0.95);
  --surface-strong: #f8f2fc;
  --surface-accent: #e8d4f4;
  --text: #160820;
  --muted: #7a3a98;
  --border: rgba(142, 68, 173, 0.14);
  --accent: #8e44ad;
  --accent-strong: #6c2e88;
  --shadow: 0 24px 80px rgba(100, 40, 140, 0.12);
  --hero-glow-left: rgba(142, 68, 173, 0.26);
  --hero-glow-right: rgba(186, 120, 220, 0.18);
  --page-gradient: linear-gradient(160deg, #f3e5f5 0%, #e8d4f4 45%, #d8b8ec 100%);
  --grid-line-1: rgba(255, 255, 255, 0.22);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.34), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.70);
  --tool-hover: #e8d4f4;
  --tool-hover-border: rgba(142, 68, 173, 0.20);
  --editor-border: rgba(142, 68, 173, 0.07);
  --focus-ring: rgba(142, 68, 173, 0.24);
  --placeholder: rgba(122, 58, 152, 0.60);
  --blockquote-border: rgba(142, 68, 173, 0.36);
  --blockquote-text: #551a70;
  --scripture-gradient: linear-gradient(180deg, rgba(248, 242, 252, 0.97), rgba(232, 212, 244, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(142, 68, 173, 0.12);
  --verse-surface: rgba(252, 246, 255, 0.88);
  --verse-border: rgba(142, 68, 173, 0.08);
  --list-text: #551a70;
  --input-surface: rgba(255, 255, 255, 0.94);
  --note-chip-surface: rgba(255, 255, 255, 0.76);
  --note-chip-active: #e8d4f4;
  --note-chip-border: rgba(142, 68, 173, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="plum-twilight"][data-theme="dark"] {
  --surface: rgba(14, 6, 22, 0.93);
  --surface-strong: #0e0616;
  --surface-accent: #1c0a2e;
  --text: #f0e4f8;
  --muted: #b870d8;
  --border: rgba(184, 112, 216, 0.15);
  --accent: #b870d8;
  --accent-strong: #d4a0ec;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.54);
  --hero-glow-left: rgba(110, 40, 150, 0.28);
  --hero-glow-right: rgba(70, 20, 110, 0.20);
  --page-gradient: linear-gradient(160deg, #0a0412 0%, #0e0616 45%, #141020 100%);
  --grid-line-1: rgba(184, 112, 216, 0.08);
  --grid-line-2: rgba(184, 112, 216, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(184, 112, 216, 0.06), transparent 20%);
  --ghost-surface: rgba(22, 10, 34, 0.82);
  --tool-hover: #1c0a2e;
  --tool-hover-border: rgba(184, 112, 216, 0.22);
  --editor-border: rgba(184, 112, 216, 0.10);
  --focus-ring: rgba(184, 112, 216, 0.30);
  --placeholder: rgba(184, 112, 216, 0.60);
  --blockquote-border: rgba(184, 112, 216, 0.42);
  --blockquote-text: #b870d8;
  --scripture-gradient: linear-gradient(180deg, rgba(16, 7, 24, 0.99), rgba(10, 4, 16, 0.99));
  --select-surface: rgba(16, 7, 24, 0.96);
  --select-border: rgba(184, 112, 216, 0.12);
  --verse-surface: rgba(14, 6, 22, 0.94);
  --verse-border: rgba(184, 112, 216, 0.08);
  --list-text: #b870d8;
  --input-surface: rgba(16, 7, 24, 0.96);
  --note-chip-surface: rgba(20, 9, 30, 0.88);
  --note-chip-active: #1c0a2e;
  --note-chip-border: rgba(184, 112, 216, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "plum-twilight",
  name: "Plum Twilight",
  supports: "both",
  swatches: ["#f8f2fc", "#8e44ad", "#e8d4f4", "#160820"]
});
