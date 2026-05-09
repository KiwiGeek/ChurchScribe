window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="teal-modern"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(240, 251, 250, 0.93);
  --surface-strong: #f0fbfa;
  --surface-accent: #b2dfdb;
  --text: #002420;
  --muted: #00574a;
  --border: rgba(0, 137, 123, 0.15);
  --accent: #00897b;
  --accent-strong: #00695c;
  --shadow: 0 24px 80px rgba(0, 100, 88, 0.13);
  --hero-glow-left: rgba(0, 150, 136, 0.28);
  --hero-glow-right: rgba(0, 137, 123, 0.18);
  --page-gradient: linear-gradient(160deg, #e0f2f1 0%, #b2dfdb 45%, #80cbc4 100%);
  --grid-line-1: rgba(255, 255, 255, 0.2);
  --grid-line-2: rgba(255, 255, 255, 0.12);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.68);
  --tool-hover: #b2dfdb;
  --tool-hover-border: rgba(0, 137, 123, 0.2);
  --editor-border: rgba(0, 137, 123, 0.08);
  --focus-ring: rgba(0, 137, 123, 0.25);
  --placeholder: rgba(0, 87, 74, 0.65);
  --blockquote-border: rgba(0, 137, 123, 0.38);
  --blockquote-text: #004d42;
  --scripture-gradient: linear-gradient(180deg, rgba(238, 250, 249, 0.97), rgba(178, 223, 219, 0.98));
  --select-surface: rgba(255, 255, 255, 0.9);
  --select-border: rgba(0, 137, 123, 0.12);
  --verse-surface: rgba(245, 252, 251, 0.86);
  --verse-border: rgba(0, 137, 123, 0.08);
  --list-text: #004d42;
  --input-surface: rgba(255, 255, 255, 0.92);
  --note-chip-surface: rgba(255, 255, 255, 0.74);
  --note-chip-active: #b2dfdb;
  --note-chip-border: rgba(0, 137, 123, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="teal-modern"][data-theme="dark"] {
  --surface: rgba(2, 20, 16, 0.92);
  --surface-strong: #021410;
  --surface-accent: #04201a;
  --text: #e0f2f1;
  --muted: #80cbc4;
  --border: rgba(77, 182, 172, 0.14);
  --accent: #4db6ac;
  --accent-strong: #80cbc4;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.5);
  --hero-glow-left: rgba(0, 120, 110, 0.28);
  --hero-glow-right: rgba(0, 100, 90, 0.18);
  --page-gradient: linear-gradient(160deg, #010c0a 0%, #021410 45%, #031c18 100%);
  --grid-line-1: rgba(77, 182, 172, 0.08);
  --grid-line-2: rgba(77, 182, 172, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(77, 182, 172, 0.06), transparent 20%);
  --ghost-surface: rgba(4, 28, 24, 0.8);
  --tool-hover: #062822;
  --tool-hover-border: rgba(77, 182, 172, 0.2);
  --editor-border: rgba(77, 182, 172, 0.1);
  --focus-ring: rgba(77, 182, 172, 0.3);
  --placeholder: rgba(128, 203, 196, 0.6);
  --blockquote-border: rgba(77, 182, 172, 0.42);
  --blockquote-text: #80cbc4;
  --scripture-gradient: linear-gradient(180deg, rgba(3, 22, 18, 0.99), rgba(2, 14, 11, 0.99));
  --select-surface: rgba(3, 22, 18, 0.95);
  --select-border: rgba(77, 182, 172, 0.12);
  --verse-surface: rgba(2, 16, 13, 0.92);
  --verse-border: rgba(77, 182, 172, 0.08);
  --list-text: #80cbc4;
  --input-surface: rgba(3, 22, 18, 0.95);
  --note-chip-surface: rgba(4, 28, 24, 0.88);
  --note-chip-active: #062822;
  --note-chip-border: rgba(77, 182, 172, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "teal-modern",
  name: "Teal Modern",
  supports: "both",
  swatches: ["#f0fbfa", "#00897b", "#b2dfdb", "#002420"]
});
