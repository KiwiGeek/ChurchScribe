window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="slate-clean"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(250, 250, 250, 0.95);
  --surface-strong: #fafafa;
  --surface-accent: #eceff1;
  --text: #1a1f22;
  --muted: #546e7a;
  --border: rgba(69, 90, 100, 0.14);
  --accent: #455a64;
  --accent-strong: #263238;
  --shadow: 0 24px 80px rgba(30, 45, 55, 0.1);
  --hero-glow-left: rgba(84, 110, 122, 0.2);
  --hero-glow-right: rgba(69, 90, 100, 0.14);
  --page-gradient: linear-gradient(160deg, #f5f5f5 0%, #eceff1 45%, #cfd8dc 100%);
  --grid-line-1: rgba(0, 0, 0, 0.05);
  --grid-line-2: rgba(0, 0, 0, 0.03);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.45), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.8);
  --tool-hover: #eceff1;
  --tool-hover-border: rgba(69, 90, 100, 0.18);
  --editor-border: rgba(69, 90, 100, 0.07);
  --focus-ring: rgba(69, 90, 100, 0.2);
  --placeholder: rgba(84, 110, 122, 0.6);
  --blockquote-border: rgba(69, 90, 100, 0.3);
  --blockquote-text: #37474f;
  --scripture-gradient: linear-gradient(180deg, rgba(250, 250, 250, 0.98), rgba(236, 239, 241, 0.98));
  --select-surface: rgba(255, 255, 255, 0.94);
  --select-border: rgba(69, 90, 100, 0.1);
  --verse-surface: rgba(252, 252, 252, 0.9);
  --verse-border: rgba(69, 90, 100, 0.07);
  --list-text: #37474f;
  --input-surface: rgba(255, 255, 255, 0.97);
  --note-chip-surface: rgba(255, 255, 255, 0.82);
  --note-chip-active: #eceff1;
  --note-chip-border: rgba(69, 90, 100, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="slate-clean"][data-theme="dark"] {
  --surface: rgba(16, 20, 24, 0.92);
  --surface-strong: #101418;
  --surface-accent: #1c2228;
  --text: #eceff1;
  --muted: #90a4ae;
  --border: rgba(144, 164, 174, 0.14);
  --accent: #90a4ae;
  --accent-strong: #b0bec5;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(50, 70, 80, 0.28);
  --hero-glow-right: rgba(40, 55, 65, 0.18);
  --page-gradient: linear-gradient(160deg, #0a0d10 0%, #101418 45%, #161c22 100%);
  --grid-line-1: rgba(144, 164, 174, 0.08);
  --grid-line-2: rgba(144, 164, 174, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(144, 164, 174, 0.06), transparent 20%);
  --ghost-surface: rgba(24, 30, 36, 0.8);
  --tool-hover: #202830;
  --tool-hover-border: rgba(144, 164, 174, 0.2);
  --editor-border: rgba(144, 164, 174, 0.1);
  --focus-ring: rgba(144, 164, 174, 0.3);
  --placeholder: rgba(144, 164, 174, 0.6);
  --blockquote-border: rgba(144, 164, 174, 0.4);
  --blockquote-text: #90a4ae;
  --scripture-gradient: linear-gradient(180deg, rgba(18, 22, 28, 0.99), rgba(12, 15, 19, 0.99));
  --select-surface: rgba(18, 22, 28, 0.96);
  --select-border: rgba(144, 164, 174, 0.12);
  --verse-surface: rgba(14, 18, 22, 0.94);
  --verse-border: rgba(144, 164, 174, 0.08);
  --list-text: #90a4ae;
  --input-surface: rgba(18, 22, 28, 0.96);
  --note-chip-surface: rgba(22, 28, 34, 0.9);
  --note-chip-active: #202830;
  --note-chip-border: rgba(144, 164, 174, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "slate-clean",
  name: "Slate Clean",
  supports: "both",
  swatches: ["#fafafa", "#455a64", "#eceff1", "#1a1f22"]
});
