window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="royal-purple"] {
  --font-heading: "Cinzel", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(250, 242, 254, 0.93);
  --surface-strong: #faf2fe;
  --surface-accent: #ede7f6;
  --text: #1a0836;
  --muted: #5e34a4;
  --border: rgba(106, 27, 154, 0.15);
  --accent: #6a1b9a;
  --accent-strong: #4a148c;
  --shadow: 0 24px 80px rgba(74, 20, 140, 0.15);
  --hero-glow-left: rgba(156, 39, 176, 0.28);
  --hero-glow-right: rgba(123, 31, 162, 0.18);
  --page-gradient: linear-gradient(160deg, #f3e5f5 0%, #e1bee7 45%, #ce93d8 100%);
  --grid-line-1: rgba(255, 255, 255, 0.2);
  --grid-line-2: rgba(255, 255, 255, 0.12);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.68);
  --tool-hover: #ede7f6;
  --tool-hover-border: rgba(106, 27, 154, 0.2);
  --editor-border: rgba(106, 27, 154, 0.08);
  --focus-ring: rgba(106, 27, 154, 0.25);
  --placeholder: rgba(94, 52, 164, 0.65);
  --blockquote-border: rgba(106, 27, 154, 0.38);
  --blockquote-text: #4a2472;
  --scripture-gradient: linear-gradient(180deg, rgba(248, 240, 254, 0.97), rgba(237, 231, 246, 0.98));
  --select-surface: rgba(255, 255, 255, 0.9);
  --select-border: rgba(106, 27, 154, 0.12);
  --verse-surface: rgba(252, 247, 255, 0.86);
  --verse-border: rgba(106, 27, 154, 0.08);
  --list-text: #4a2472;
  --input-surface: rgba(255, 255, 255, 0.92);
  --note-chip-surface: rgba(255, 255, 255, 0.74);
  --note-chip-active: #ede7f6;
  --note-chip-border: rgba(106, 27, 154, 0.12);
  --radius-xl: 6px;
  --radius-lg: 5px;
  --radius-md: 4px;
  color-scheme: light;
}
[data-color-theme="royal-purple"][data-theme="dark"] {
  --surface: rgba(15, 5, 32, 0.92);
  --surface-strong: #0f0520;
  --surface-accent: #1e0d38;
  --text: #f3e5f5;
  --muted: #ce93d8;
  --border: rgba(206, 147, 216, 0.16);
  --accent: #ce93d8;
  --accent-strong: #e1bee7;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(120, 40, 160, 0.3);
  --hero-glow-right: rgba(80, 20, 120, 0.2);
  --page-gradient: linear-gradient(160deg, #0a0318 0%, #110524 45%, #180830 100%);
  --grid-line-1: rgba(206, 147, 216, 0.08);
  --grid-line-2: rgba(206, 147, 216, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(206, 147, 216, 0.07), transparent 20%);
  --ghost-surface: rgba(22, 8, 45, 0.8);
  --tool-hover: #220a40;
  --tool-hover-border: rgba(206, 147, 216, 0.22);
  --editor-border: rgba(206, 147, 216, 0.1);
  --focus-ring: rgba(206, 147, 216, 0.32);
  --placeholder: rgba(206, 147, 216, 0.6);
  --blockquote-border: rgba(206, 147, 216, 0.45);
  --blockquote-text: #ce93d8;
  --scripture-gradient: linear-gradient(180deg, rgba(16, 6, 34, 0.99), rgba(10, 3, 22, 0.99));
  --select-surface: rgba(16, 6, 34, 0.95);
  --select-border: rgba(206, 147, 216, 0.14);
  --verse-surface: rgba(12, 4, 26, 0.92);
  --verse-border: rgba(206, 147, 216, 0.08);
  --list-text: #ce93d8;
  --input-surface: rgba(16, 6, 34, 0.95);
  --note-chip-surface: rgba(20, 8, 42, 0.88);
  --note-chip-active: #220a40;
  --note-chip-border: rgba(206, 147, 216, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "royal-purple",
  name: "Royal Purple",
  supports: "both",
  swatches: ["#faf2fe", "#6a1b9a", "#ede7f6", "#1a0836"]
});
