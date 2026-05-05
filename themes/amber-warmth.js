window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="amber-warmth"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 251, 240, 0.95);
  --surface-strong: #fffbf0;
  --surface-accent: #ffe0b2;
  --text: #1a0e00;
  --muted: #8a5c10;
  --border: rgba(240, 144, 0, 0.14);
  --accent: #f09000;
  --accent-strong: #c07000;
  --shadow: 0 24px 80px rgba(180, 110, 0, 0.12);
  --hero-glow-left: rgba(240, 144, 0, 0.26);
  --hero-glow-right: rgba(255, 180, 60, 0.18);
  --page-gradient: linear-gradient(160deg, #fff8e1 0%, #ffe0b2 45%, #ffcc80 100%);
  --grid-line-1: rgba(255, 255, 255, 0.24);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.36), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.72);
  --tool-hover: #ffe0b2;
  --tool-hover-border: rgba(240, 144, 0, 0.20);
  --editor-border: rgba(240, 144, 0, 0.08);
  --focus-ring: rgba(240, 144, 0, 0.26);
  --placeholder: rgba(138, 92, 16, 0.60);
  --blockquote-border: rgba(240, 144, 0, 0.36);
  --blockquote-text: #6a3c00;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 251, 240, 0.97), rgba(255, 224, 178, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(240, 144, 0, 0.12);
  --verse-surface: rgba(255, 253, 245, 0.88);
  --verse-border: rgba(240, 144, 0, 0.08);
  --list-text: #6a3c00;
  --input-surface: rgba(255, 255, 255, 0.94);
  --note-chip-surface: rgba(255, 255, 255, 0.76);
  --note-chip-active: #ffe0b2;
  --note-chip-border: rgba(240, 144, 0, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="amber-warmth"][data-theme="dark"] {
  --surface: rgba(20, 10, 0, 0.93);
  --surface-strong: #140a00;
  --surface-accent: #261500;
  --text: #fff8e1;
  --muted: #d49040;
  --border: rgba(212, 144, 64, 0.15);
  --accent: #d49040;
  --accent-strong: #ffcc80;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.52);
  --hero-glow-left: rgba(180, 100, 0, 0.28);
  --hero-glow-right: rgba(120, 60, 0, 0.20);
  --page-gradient: linear-gradient(160deg, #100800 0%, #140a00 45%, #1c1000 100%);
  --grid-line-1: rgba(212, 144, 64, 0.08);
  --grid-line-2: rgba(212, 144, 64, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(212, 144, 64, 0.06), transparent 20%);
  --ghost-surface: rgba(30, 16, 2, 0.82);
  --tool-hover: #261500;
  --tool-hover-border: rgba(212, 144, 64, 0.22);
  --editor-border: rgba(212, 144, 64, 0.10);
  --focus-ring: rgba(212, 144, 64, 0.30);
  --placeholder: rgba(212, 144, 64, 0.60);
  --blockquote-border: rgba(212, 144, 64, 0.42);
  --blockquote-text: #d49040;
  --scripture-gradient: linear-gradient(180deg, rgba(22, 12, 0, 0.99), rgba(14, 7, 0, 0.99));
  --select-surface: rgba(22, 12, 0, 0.96);
  --select-border: rgba(212, 144, 64, 0.12);
  --verse-surface: rgba(18, 9, 0, 0.94);
  --verse-border: rgba(212, 144, 64, 0.08);
  --list-text: #d49040;
  --input-surface: rgba(22, 12, 0, 0.96);
  --note-chip-surface: rgba(28, 15, 0, 0.88);
  --note-chip-active: #261500;
  --note-chip-border: rgba(212, 144, 64, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "amber-warmth",
  name: "Amber Warmth",
  supports: "both",
  swatches: ["#fffbf0", "#f09000", "#ffe0b2", "#1a0e00"]
});
