window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="sand-dune"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 251, 244, 0.96);
  --surface-strong: #fffbf4;
  --surface-accent: #eedcc4;
  --text: #1a1000;
  --muted: #8c6830;
  --border: rgba(196, 148, 90, 0.14);
  --accent: #c4945a;
  --accent-strong: #9a6830;
  --shadow: 0 24px 80px rgba(160, 110, 40, 0.12);
  --hero-glow-left: rgba(196, 148, 90, 0.24);
  --hero-glow-right: rgba(230, 190, 120, 0.16);
  --page-gradient: linear-gradient(160deg, #fdf5e0 0%, #f0dbb8 45%, #e0c890 100%);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.40), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.76);
  --tool-hover: #eedcc4;
  --tool-hover-border: rgba(196, 148, 90, 0.22);
  --editor-border: rgba(196, 148, 90, 0.07);
  --focus-ring: rgba(196, 148, 90, 0.24);
  --placeholder: rgba(140, 104, 48, 0.60);
  --blockquote-border: rgba(196, 148, 90, 0.36);
  --blockquote-text: #6a4410;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 251, 244, 0.97), rgba(238, 220, 196, 0.98));
  --select-surface: rgba(255, 255, 255, 0.93);
  --select-border: rgba(196, 148, 90, 0.12);
  --verse-surface: rgba(255, 253, 248, 0.90);
  --verse-border: rgba(196, 148, 90, 0.08);
  --list-text: #6a4410;
  --input-surface: rgba(255, 255, 255, 0.96);
  --note-chip-surface: rgba(255, 255, 255, 0.80);
  --note-chip-active: #eedcc4;
  --note-chip-border: rgba(196, 148, 90, 0.12);
  --radius-xl: 20px;
  --radius-lg: 14px;
  --radius-md: 10px;
  color-scheme: light;
}
[data-color-theme="sand-dune"][data-theme="dark"] {
  --surface: rgba(18, 12, 2, 0.94);
  --surface-strong: #120c02;
  --surface-accent: #221a06;
  --text: #f8ecd4;
  --muted: #c09050;
  --border: rgba(192, 144, 80, 0.15);
  --accent: #c09050;
  --accent-strong: #d8b070;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.52);
  --hero-glow-left: rgba(160, 110, 30, 0.26);
  --hero-glow-right: rgba(100, 70, 10, 0.18);
  --page-gradient: linear-gradient(160deg, #0c0800 0%, #120c02 45%, #1a1204 100%);
  --grid-line-1: rgba(192, 144, 80, 0.08);
  --grid-line-2: rgba(192, 144, 80, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(192, 144, 80, 0.06), transparent 20%);
  --ghost-surface: rgba(26, 18, 4, 0.82);
  --tool-hover: #221a06;
  --tool-hover-border: rgba(192, 144, 80, 0.22);
  --editor-border: rgba(192, 144, 80, 0.10);
  --focus-ring: rgba(192, 144, 80, 0.30);
  --placeholder: rgba(192, 144, 80, 0.60);
  --blockquote-border: rgba(192, 144, 80, 0.42);
  --blockquote-text: #c09050;
  --scripture-gradient: linear-gradient(180deg, rgba(20, 14, 2, 0.99), rgba(12, 8, 0, 0.99));
  --select-surface: rgba(20, 14, 2, 0.96);
  --select-border: rgba(192, 144, 80, 0.12);
  --verse-surface: rgba(16, 10, 2, 0.94);
  --verse-border: rgba(192, 144, 80, 0.08);
  --list-text: #c09050;
  --input-surface: rgba(20, 14, 2, 0.96);
  --note-chip-surface: rgba(26, 18, 4, 0.88);
  --note-chip-active: #221a06;
  --note-chip-border: rgba(192, 144, 80, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "sand-dune",
  name: "Sand Dune",
  supports: "both",
  swatches: ["#fffbf4", "#c4945a", "#eedcc4", "#1a1000"]
});
