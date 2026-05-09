window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="hot-pink"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 249, 252, 0.93);
  --surface-strong: #fff5fa;
  --surface-accent: #fce4f0;
  --text: #1a0011;
  --muted: #8a3a60;
  --border: rgba(233, 30, 140, 0.15);
  --accent: #e91e8c;
  --accent-strong: #c2185b;
  --shadow: 0 24px 80px rgba(200, 20, 100, 0.16);
  --hero-glow-left: rgba(233, 30, 140, 0.25);
  --hero-glow-right: rgba(180, 0, 120, 0.15);
  --page-gradient: linear-gradient(160deg, #fce4ec 0%, #f8bbd0 45%, #f48fb1 100%);
  --grid-line-1: rgba(255, 255, 255, 0.2);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.32), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.68);
  --tool-hover: #fce4ee;
  --tool-hover-border: rgba(200, 20, 100, 0.22);
  --editor-border: rgba(200, 20, 100, 0.08);
  --focus-ring: rgba(233, 30, 140, 0.25);
  --placeholder: rgba(138, 58, 96, 0.65);
  --blockquote-border: rgba(233, 30, 140, 0.4);
  --blockquote-text: #7a2355;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 245, 250, 0.97), rgba(252, 228, 240, 0.98));
  --select-surface: rgba(255, 255, 255, 0.9);
  --select-border: rgba(200, 20, 100, 0.12);
  --verse-surface: rgba(255, 250, 253, 0.86);
  --verse-border: rgba(200, 20, 100, 0.08);
  --list-text: #7a2355;
  --input-surface: rgba(255, 255, 255, 0.92);
  --note-chip-surface: rgba(255, 255, 255, 0.74);
  --note-chip-active: #fce4ee;
  --note-chip-border: rgba(200, 20, 100, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="hot-pink"][data-theme="dark"] {
  --surface: rgba(20, 5, 15, 0.92);
  --surface-strong: #180510;
  --surface-accent: #2a0820;
  --text: #fce4ec;
  --muted: #f48fb1;
  --border: rgba(255, 79, 195, 0.16);
  --accent: #ff4fc3;
  --accent-strong: #ff80d5;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.5);
  --hero-glow-left: rgba(220, 40, 130, 0.28);
  --hero-glow-right: rgba(180, 0, 120, 0.2);
  --page-gradient: linear-gradient(160deg, #0f0009 0%, #180010 45%, #20051a 100%);
  --grid-line-1: rgba(255, 79, 195, 0.1);
  --grid-line-2: rgba(255, 79, 195, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(255, 79, 195, 0.07), transparent 20%);
  --ghost-surface: rgba(30, 5, 22, 0.78);
  --tool-hover: #280820;
  --tool-hover-border: rgba(255, 128, 213, 0.22);
  --editor-border: rgba(255, 79, 195, 0.1);
  --focus-ring: rgba(255, 79, 195, 0.32);
  --placeholder: rgba(244, 143, 177, 0.65);
  --blockquote-border: rgba(255, 79, 195, 0.45);
  --blockquote-text: #f48fb1;
  --scripture-gradient: linear-gradient(180deg, rgba(22, 5, 16, 0.99), rgba(15, 2, 10, 0.99));
  --select-surface: rgba(22, 5, 16, 0.95);
  --select-border: rgba(255, 79, 195, 0.14);
  --verse-surface: rgba(18, 3, 13, 0.92);
  --verse-border: rgba(255, 79, 195, 0.08);
  --list-text: #f48fb1;
  --input-surface: rgba(22, 5, 16, 0.95);
  --note-chip-surface: rgba(28, 6, 20, 0.88);
  --note-chip-active: #280820;
  --note-chip-border: rgba(255, 79, 195, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "hot-pink",
  name: "Hot Pink",
  supports: "both",
  swatches: ["#fff5fa", "#e91e8c", "#fce4f0", "#1a0011"]
});
