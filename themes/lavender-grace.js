window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="lavender-grace"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(248, 244, 254, 0.93);
  --surface-strong: #f8f4fe;
  --surface-accent: #e8dcf8;
  --text: #1a0a30;
  --muted: #6840a8;
  --border: rgba(126, 87, 194, 0.15);
  --accent: #7e57c2;
  --accent-strong: #5e35b1;
  --shadow: 0 24px 80px rgba(90, 50, 170, 0.14);
  --hero-glow-left: rgba(149, 117, 205, 0.28);
  --hero-glow-right: rgba(126, 87, 194, 0.18);
  --page-gradient: linear-gradient(160deg, #ede7f6 0%, #d1c4e9 45%, #b39ddb 100%);
  --grid-line-1: rgba(255, 255, 255, 0.2);
  --grid-line-2: rgba(255, 255, 255, 0.12);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.32), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.7);
  --tool-hover: #e8dcf8;
  --tool-hover-border: rgba(126, 87, 194, 0.2);
  --editor-border: rgba(126, 87, 194, 0.08);
  --focus-ring: rgba(126, 87, 194, 0.25);
  --placeholder: rgba(104, 64, 168, 0.62);
  --blockquote-border: rgba(126, 87, 194, 0.38);
  --blockquote-text: #4a2080;
  --scripture-gradient: linear-gradient(180deg, rgba(245, 241, 253, 0.97), rgba(232, 220, 248, 0.98));
  --select-surface: rgba(255, 255, 255, 0.9);
  --select-border: rgba(126, 87, 194, 0.12);
  --verse-surface: rgba(250, 247, 255, 0.86);
  --verse-border: rgba(126, 87, 194, 0.08);
  --list-text: #4a2080;
  --input-surface: rgba(255, 255, 255, 0.92);
  --note-chip-surface: rgba(255, 255, 255, 0.74);
  --note-chip-active: #e8dcf8;
  --note-chip-border: rgba(126, 87, 194, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="lavender-grace"][data-theme="dark"] {
  --surface: rgba(16, 8, 32, 0.92);
  --surface-strong: #100820;
  --surface-accent: #1c1030;
  --text: #ede7f6;
  --muted: #b39ddb;
  --border: rgba(179, 157, 219, 0.14);
  --accent: #b39ddb;
  --accent-strong: #d1c4e9;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(100, 60, 180, 0.28);
  --hero-glow-right: rgba(80, 40, 150, 0.18);
  --page-gradient: linear-gradient(160deg, #0c0516 0%, #120a22 45%, #180e2e 100%);
  --grid-line-1: rgba(179, 157, 219, 0.08);
  --grid-line-2: rgba(179, 157, 219, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(179, 157, 219, 0.06), transparent 20%);
  --ghost-surface: rgba(24, 14, 45, 0.8);
  --tool-hover: #201240;
  --tool-hover-border: rgba(179, 157, 219, 0.2);
  --editor-border: rgba(179, 157, 219, 0.1);
  --focus-ring: rgba(179, 157, 219, 0.3);
  --placeholder: rgba(179, 157, 219, 0.6);
  --blockquote-border: rgba(179, 157, 219, 0.42);
  --blockquote-text: #b39ddb;
  --scripture-gradient: linear-gradient(180deg, rgba(18, 10, 36, 0.99), rgba(12, 6, 24, 0.99));
  --select-surface: rgba(18, 10, 36, 0.95);
  --select-border: rgba(179, 157, 219, 0.12);
  --verse-surface: rgba(14, 8, 28, 0.92);
  --verse-border: rgba(179, 157, 219, 0.08);
  --list-text: #b39ddb;
  --input-surface: rgba(18, 10, 36, 0.95);
  --note-chip-surface: rgba(22, 12, 44, 0.88);
  --note-chip-active: #201240;
  --note-chip-border: rgba(179, 157, 219, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "lavender-grace",
  name: "Lavender Grace",
  supports: "both",
  swatches: ["#f8f4fe", "#7e57c2", "#e8dcf8", "#1a0a30"]
});
