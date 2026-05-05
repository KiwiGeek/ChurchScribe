window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="storm-grey"] {
  --font-heading: "Cinzel", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(244, 246, 248, 0.96);
  --surface-strong: #f4f6f8;
  --surface-accent: #e0e6ea;
  --text: #1a2228;
  --muted: #526470;
  --border: rgba(96, 125, 139, 0.14);
  --accent: #607d8b;
  --accent-strong: #37474f;
  --shadow: 0 24px 80px rgba(50, 70, 80, 0.12);
  --hero-glow-left: rgba(96, 125, 139, 0.20);
  --hero-glow-right: rgba(144, 164, 174, 0.14);
  --page-gradient: linear-gradient(160deg, #eceff1 0%, #cfd8dc 45%, #b0bec5 100%);
  --grid-line-1: rgba(255, 255, 255, 0.26);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.36), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.74);
  --tool-hover: #e0e6ea;
  --tool-hover-border: rgba(96, 125, 139, 0.20);
  --editor-border: rgba(96, 125, 139, 0.07);
  --focus-ring: rgba(96, 125, 139, 0.22);
  --placeholder: rgba(82, 100, 112, 0.60);
  --blockquote-border: rgba(96, 125, 139, 0.34);
  --blockquote-text: #2e4050;
  --scripture-gradient: linear-gradient(180deg, rgba(244, 246, 248, 0.97), rgba(224, 230, 234, 0.98));
  --select-surface: rgba(255, 255, 255, 0.93);
  --select-border: rgba(96, 125, 139, 0.12);
  --verse-surface: rgba(248, 250, 252, 0.90);
  --verse-border: rgba(96, 125, 139, 0.08);
  --list-text: #2e4050;
  --input-surface: rgba(255, 255, 255, 0.96);
  --note-chip-surface: rgba(255, 255, 255, 0.78);
  --note-chip-active: #e0e6ea;
  --note-chip-border: rgba(96, 125, 139, 0.12);
  --radius-xl: 6px;
  --radius-lg: 5px;
  --radius-md: 4px;
  color-scheme: light;
}
[data-color-theme="storm-grey"][data-theme="dark"] {
  --surface: rgba(12, 16, 20, 0.94);
  --surface-strong: #0c1014;
  --surface-accent: #1a2228;
  --text: #eceff1;
  --muted: #90a4ae;
  --border: rgba(144, 164, 174, 0.15);
  --accent: #90a4ae;
  --accent-strong: #b0bec5;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(60, 80, 100, 0.26);
  --hero-glow-right: rgba(40, 55, 70, 0.18);
  --page-gradient: linear-gradient(160deg, #080c10 0%, #0c1014 45%, #121820 100%);
  --grid-line-1: rgba(144, 164, 174, 0.08);
  --grid-line-2: rgba(144, 164, 174, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(144, 164, 174, 0.06), transparent 20%);
  --ghost-surface: rgba(18, 24, 30, 0.82);
  --tool-hover: #1a2228;
  --tool-hover-border: rgba(144, 164, 174, 0.22);
  --editor-border: rgba(144, 164, 174, 0.10);
  --focus-ring: rgba(144, 164, 174, 0.30);
  --placeholder: rgba(144, 164, 174, 0.60);
  --blockquote-border: rgba(144, 164, 174, 0.42);
  --blockquote-text: #90a4ae;
  --scripture-gradient: linear-gradient(180deg, rgba(14, 18, 22, 0.99), rgba(8, 12, 16, 0.99));
  --select-surface: rgba(14, 18, 22, 0.96);
  --select-border: rgba(144, 164, 174, 0.12);
  --verse-surface: rgba(12, 16, 20, 0.94);
  --verse-border: rgba(144, 164, 174, 0.08);
  --list-text: #90a4ae;
  --input-surface: rgba(14, 18, 22, 0.96);
  --note-chip-surface: rgba(18, 24, 30, 0.88);
  --note-chip-active: #1a2228;
  --note-chip-border: rgba(144, 164, 174, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "storm-grey",
  name: "Storm Grey",
  supports: "both",
  swatches: ["#f4f6f8", "#607d8b", "#e0e6ea", "#1a2228"]
});
