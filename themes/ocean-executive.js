window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="ocean-executive"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(243, 249, 255, 0.93);
  --surface-strong: #f3f9ff;
  --surface-accent: #dbeafe;
  --text: #0d1f3c;
  --muted: #2c4a7c;
  --border: rgba(21, 101, 192, 0.15);
  --accent: #1565c0;
  --accent-strong: #0d47a1;
  --shadow: 0 24px 80px rgba(13, 31, 60, 0.14);
  --hero-glow-left: rgba(66, 165, 245, 0.28);
  --hero-glow-right: rgba(25, 118, 210, 0.18);
  --page-gradient: linear-gradient(160deg, #e3f2fd 0%, #bbdefb 45%, #90caf9 100%);
  --grid-line-1: rgba(255, 255, 255, 0.2);
  --grid-line-2: rgba(255, 255, 255, 0.12);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.68);
  --tool-hover: #dbeafe;
  --tool-hover-border: rgba(21, 101, 192, 0.2);
  --editor-border: rgba(21, 101, 192, 0.08);
  --focus-ring: rgba(21, 101, 192, 0.25);
  --placeholder: rgba(44, 74, 124, 0.65);
  --blockquote-border: rgba(21, 101, 192, 0.38);
  --blockquote-text: #1e3a5f;
  --scripture-gradient: linear-gradient(180deg, rgba(243, 249, 255, 0.97), rgba(219, 234, 254, 0.98));
  --select-surface: rgba(255, 255, 255, 0.9);
  --select-border: rgba(21, 101, 192, 0.12);
  --verse-surface: rgba(246, 251, 255, 0.86);
  --verse-border: rgba(21, 101, 192, 0.08);
  --list-text: #1e3a5f;
  --input-surface: rgba(255, 255, 255, 0.92);
  --note-chip-surface: rgba(255, 255, 255, 0.74);
  --note-chip-active: #dbeafe;
  --note-chip-border: rgba(21, 101, 192, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="ocean-executive"][data-theme="dark"] {
  --surface: rgba(4, 15, 31, 0.92);
  --surface-strong: #040f1f;
  --surface-accent: #0a1929;
  --text: #e3f2fd;
  --muted: #82b1d4;
  --border: rgba(79, 195, 247, 0.14);
  --accent: #4fc3f7;
  --accent-strong: #81d4fa;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.5);
  --hero-glow-left: rgba(30, 90, 160, 0.25);
  --hero-glow-right: rgba(25, 118, 210, 0.18);
  --page-gradient: linear-gradient(160deg, #020a18 0%, #040f22 45%, #06152c 100%);
  --grid-line-1: rgba(79, 195, 247, 0.08);
  --grid-line-2: rgba(79, 195, 247, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(79, 195, 247, 0.06), transparent 20%);
  --ghost-surface: rgba(6, 18, 36, 0.78);
  --tool-hover: #0a1e38;
  --tool-hover-border: rgba(79, 195, 247, 0.2);
  --editor-border: rgba(79, 195, 247, 0.1);
  --focus-ring: rgba(79, 195, 247, 0.3);
  --placeholder: rgba(130, 177, 212, 0.65);
  --blockquote-border: rgba(79, 195, 247, 0.42);
  --blockquote-text: #82b1d4;
  --scripture-gradient: linear-gradient(180deg, rgba(5, 16, 33, 0.99), rgba(3, 10, 22, 0.99));
  --select-surface: rgba(5, 16, 33, 0.95);
  --select-border: rgba(79, 195, 247, 0.12);
  --verse-surface: rgba(4, 12, 26, 0.92);
  --verse-border: rgba(79, 195, 247, 0.08);
  --list-text: #82b1d4;
  --input-surface: rgba(5, 16, 33, 0.95);
  --note-chip-surface: rgba(8, 20, 40, 0.88);
  --note-chip-active: #0a1e38;
  --note-chip-border: rgba(79, 195, 247, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "ocean-executive",
  name: "Ocean Executive",
  supports: "both",
  swatches: ["#f3f9ff", "#1565c0", "#dbeafe", "#0d1f3c"]
});
