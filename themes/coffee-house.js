window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="coffee-house"] {
  --font-heading: "Playfair Display", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(250, 248, 245, 0.93);
  --surface-strong: #faf8f5;
  --surface-accent: #ede0d4;
  --text: #1e0e06;
  --muted: #7a5544;
  --border: rgba(121, 85, 72, 0.15);
  --accent: #5d4037;
  --accent-strong: #3e2723;
  --shadow: 0 24px 80px rgba(80, 50, 30, 0.15);
  --hero-glow-left: rgba(160, 100, 70, 0.28);
  --hero-glow-right: rgba(140, 80, 50, 0.18);
  --page-gradient: linear-gradient(160deg, #efebe9 0%, #d7ccc8 45%, #bcaaa4 100%);
  --grid-line-1: rgba(255, 255, 255, 0.2);
  --grid-line-2: rgba(255, 255, 255, 0.12);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.68);
  --tool-hover: #ede0d4;
  --tool-hover-border: rgba(121, 85, 72, 0.2);
  --editor-border: rgba(121, 85, 72, 0.08);
  --focus-ring: rgba(93, 64, 55, 0.25);
  --placeholder: rgba(122, 85, 68, 0.65);
  --blockquote-border: rgba(93, 64, 55, 0.38);
  --blockquote-text: #4a2e20;
  --scripture-gradient: linear-gradient(180deg, rgba(248, 245, 242, 0.97), rgba(237, 224, 212, 0.98));
  --select-surface: rgba(255, 255, 255, 0.9);
  --select-border: rgba(121, 85, 72, 0.12);
  --verse-surface: rgba(252, 250, 248, 0.86);
  --verse-border: rgba(121, 85, 72, 0.08);
  --list-text: #4a2e20;
  --input-surface: rgba(255, 255, 255, 0.92);
  --note-chip-surface: rgba(255, 255, 255, 0.74);
  --note-chip-active: #ede0d4;
  --note-chip-border: rgba(121, 85, 72, 0.12);
  --radius-xl: 12px;
  --radius-lg: 9px;
  --radius-md: 6px;
  color-scheme: light;
}
[data-color-theme="coffee-house"][data-theme="dark"] {
  --surface: rgba(22, 14, 10, 0.92);
  --surface-strong: #160e0a;
  --surface-accent: #1e1410;
  --text: #efebe9;
  --muted: #bcaaa4;
  --border: rgba(188, 170, 164, 0.14);
  --accent: #bcaaa4;
  --accent-strong: #d7ccc8;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(100, 60, 40, 0.3);
  --hero-glow-right: rgba(80, 45, 28, 0.2);
  --page-gradient: linear-gradient(160deg, #100808 0%, #160c08 45%, #1e120c 100%);
  --grid-line-1: rgba(188, 170, 164, 0.08);
  --grid-line-2: rgba(188, 170, 164, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(188, 170, 164, 0.06), transparent 20%);
  --ghost-surface: rgba(30, 18, 12, 0.8);
  --tool-hover: #261810;
  --tool-hover-border: rgba(188, 170, 164, 0.2);
  --editor-border: rgba(188, 170, 164, 0.1);
  --focus-ring: rgba(188, 170, 164, 0.3);
  --placeholder: rgba(188, 170, 164, 0.6);
  --blockquote-border: rgba(188, 170, 164, 0.4);
  --blockquote-text: #bcaaa4;
  --scripture-gradient: linear-gradient(180deg, rgba(24, 15, 10, 0.99), rgba(16, 10, 6, 0.99));
  --select-surface: rgba(24, 15, 10, 0.95);
  --select-border: rgba(188, 170, 164, 0.12);
  --verse-surface: rgba(20, 12, 8, 0.92);
  --verse-border: rgba(188, 170, 164, 0.08);
  --list-text: #bcaaa4;
  --input-surface: rgba(24, 15, 10, 0.95);
  --note-chip-surface: rgba(30, 18, 12, 0.88);
  --note-chip-active: #261810;
  --note-chip-border: rgba(188, 170, 164, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "coffee-house",
  name: "Coffee House",
  supports: "both",
  swatches: ["#faf8f5", "#5d4037", "#ede0d4", "#1e0e06"]
});
