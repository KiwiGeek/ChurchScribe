window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="golden-hour"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 253, 240, 0.93);
  --surface-strong: #fffdf0;
  --surface-accent: #fff3cd;
  --text: #1a1200;
  --muted: #7d5c00;
  --border: rgba(200, 150, 0, 0.16);
  --accent: #f59f00;
  --accent-strong: #d08700;
  --shadow: 0 24px 80px rgba(160, 120, 0, 0.15);
  --hero-glow-left: rgba(245, 159, 0, 0.3);
  --hero-glow-right: rgba(220, 130, 0, 0.2);
  --page-gradient: linear-gradient(160deg, #fff9e6 0%, #fff0c0 45%, #ffe880 100%);
  --grid-line-1: rgba(255, 255, 255, 0.22);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.35), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.72);
  --tool-hover: #fff3cd;
  --tool-hover-border: rgba(200, 150, 0, 0.2);
  --editor-border: rgba(200, 150, 0, 0.08);
  --focus-ring: rgba(245, 159, 0, 0.28);
  --placeholder: rgba(125, 92, 0, 0.65);
  --blockquote-border: rgba(245, 159, 0, 0.4);
  --blockquote-text: #6b5000;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 252, 238, 0.97), rgba(255, 244, 198, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(200, 150, 0, 0.12);
  --verse-surface: rgba(255, 254, 245, 0.88);
  --verse-border: rgba(200, 150, 0, 0.08);
  --list-text: #6b5000;
  --input-surface: rgba(255, 255, 255, 0.94);
  --note-chip-surface: rgba(255, 255, 255, 0.76);
  --note-chip-active: #fff3cd;
  --note-chip-border: rgba(200, 150, 0, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="golden-hour"][data-theme="dark"] {
  --surface: rgba(26, 18, 0, 0.92);
  --surface-strong: #1a1200;
  --surface-accent: #2e2000;
  --text: #fff9e6;
  --muted: #d4a200;
  --border: rgba(255, 212, 59, 0.14);
  --accent: #ffd43b;
  --accent-strong: #ffe570;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.5);
  --hero-glow-left: rgba(180, 130, 0, 0.3);
  --hero-glow-right: rgba(140, 100, 0, 0.2);
  --page-gradient: linear-gradient(160deg, #120e00 0%, #1c1500 45%, #261c00 100%);
  --grid-line-1: rgba(255, 212, 59, 0.08);
  --grid-line-2: rgba(255, 212, 59, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(255, 212, 59, 0.07), transparent 20%);
  --ghost-surface: rgba(36, 26, 0, 0.8);
  --tool-hover: #2e2200;
  --tool-hover-border: rgba(255, 212, 59, 0.22);
  --editor-border: rgba(255, 212, 59, 0.1);
  --focus-ring: rgba(255, 212, 59, 0.3);
  --placeholder: rgba(212, 162, 0, 0.65);
  --blockquote-border: rgba(255, 212, 59, 0.45);
  --blockquote-text: #d4a200;
  --scripture-gradient: linear-gradient(180deg, rgba(28, 20, 0, 0.99), rgba(18, 13, 0, 0.99));
  --select-surface: rgba(28, 20, 0, 0.95);
  --select-border: rgba(255, 212, 59, 0.12);
  --verse-surface: rgba(22, 16, 0, 0.92);
  --verse-border: rgba(255, 212, 59, 0.08);
  --list-text: #d4a200;
  --input-surface: rgba(28, 20, 0, 0.95);
  --note-chip-surface: rgba(34, 24, 0, 0.88);
  --note-chip-active: #2e2200;
  --note-chip-border: rgba(255, 212, 59, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "golden-hour",
  name: "Golden Hour",
  supports: "both",
  swatches: ["#fffdf0", "#f59f00", "#fff3cd", "#1a1200"]
});
