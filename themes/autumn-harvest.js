window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="autumn-harvest"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 251, 245, 0.93);
  --surface-strong: #fffaf5;
  --surface-accent: #ffe0b2;
  --text: #1a0900;
  --muted: #854a00;
  --border: rgba(230, 81, 0, 0.15);
  --accent: #e65100;
  --accent-strong: #bf360c;
  --shadow: 0 24px 80px rgba(180, 70, 0, 0.14);
  --hero-glow-left: rgba(245, 124, 0, 0.3);
  --hero-glow-right: rgba(230, 81, 0, 0.18);
  --page-gradient: linear-gradient(160deg, #fff3e0 0%, #ffe0b2 45%, #ffcc80 100%);
  --grid-line-1: rgba(255, 255, 255, 0.22);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.35), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.72);
  --tool-hover: #ffe0b2;
  --tool-hover-border: rgba(230, 81, 0, 0.2);
  --editor-border: rgba(230, 81, 0, 0.08);
  --focus-ring: rgba(230, 81, 0, 0.25);
  --placeholder: rgba(133, 74, 0, 0.65);
  --blockquote-border: rgba(230, 81, 0, 0.38);
  --blockquote-text: #7a3800;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 250, 242, 0.97), rgba(255, 224, 178, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(230, 81, 0, 0.12);
  --verse-surface: rgba(255, 253, 248, 0.88);
  --verse-border: rgba(230, 81, 0, 0.08);
  --list-text: #7a3800;
  --input-surface: rgba(255, 255, 255, 0.94);
  --note-chip-surface: rgba(255, 255, 255, 0.76);
  --note-chip-active: #ffe0b2;
  --note-chip-border: rgba(230, 81, 0, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="autumn-harvest"][data-theme="dark"] {
  --surface: rgba(26, 9, 0, 0.92);
  --surface-strong: #1a0900;
  --surface-accent: #230e00;
  --text: #fff3e0;
  --muted: #ffa040;
  --border: rgba(255, 160, 64, 0.14);
  --accent: #ffa040;
  --accent-strong: #ffcc80;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(180, 70, 0, 0.3);
  --hero-glow-right: rgba(140, 50, 0, 0.2);
  --page-gradient: linear-gradient(160deg, #130600 0%, #1a0a00 45%, #221000 100%);
  --grid-line-1: rgba(255, 160, 64, 0.08);
  --grid-line-2: rgba(255, 160, 64, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(255, 160, 64, 0.06), transparent 20%);
  --ghost-surface: rgba(36, 14, 0, 0.82);
  --tool-hover: #2c1200;
  --tool-hover-border: rgba(255, 160, 64, 0.22);
  --editor-border: rgba(255, 160, 64, 0.1);
  --focus-ring: rgba(255, 160, 64, 0.3);
  --placeholder: rgba(255, 160, 64, 0.6);
  --blockquote-border: rgba(255, 160, 64, 0.42);
  --blockquote-text: #ffa040;
  --scripture-gradient: linear-gradient(180deg, rgba(28, 10, 0, 0.99), rgba(18, 6, 0, 0.99));
  --select-surface: rgba(28, 10, 0, 0.96);
  --select-border: rgba(255, 160, 64, 0.12);
  --verse-surface: rgba(22, 8, 0, 0.94);
  --verse-border: rgba(255, 160, 64, 0.08);
  --list-text: #ffa040;
  --input-surface: rgba(28, 10, 0, 0.96);
  --note-chip-surface: rgba(34, 12, 0, 0.9);
  --note-chip-active: #2c1200;
  --note-chip-border: rgba(255, 160, 64, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "autumn-harvest",
  name: "Autumn Harvest",
  supports: "both",
  swatches: ["#fffaf5", "#e65100", "#ffe0b2", "#1a0900"]
});
