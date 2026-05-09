window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="desert-bloom"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(253, 247, 242, 0.94);
  --surface-strong: #fdf5f2;
  --surface-accent: #f8ddd4;
  --text: #1e0c06;
  --muted: #9a4828;
  --border: rgba(194, 96, 58, 0.15);
  --accent: #c2603a;
  --accent-strong: #9e4422;
  --shadow: 0 24px 80px rgba(180, 80, 50, 0.14);
  --hero-glow-left: rgba(220, 120, 80, 0.28);
  --hero-glow-right: rgba(200, 160, 120, 0.2);
  --page-gradient: linear-gradient(160deg, #fce8e0 0%, #f8d0c0 45%, #f0baa8 100%);
  --grid-line-1: rgba(255, 255, 255, 0.26);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.38), transparent 20%);
  --ghost-surface: rgba(253, 248, 244, 0.78);
  --tool-hover: #f8ddd4;
  --tool-hover-border: rgba(194, 96, 58, 0.2);
  --editor-border: rgba(194, 96, 58, 0.08);
  --focus-ring: rgba(194, 96, 58, 0.26);
  --placeholder: rgba(154, 72, 40, 0.62);
  --blockquote-border: rgba(194, 96, 58, 0.38);
  --blockquote-text: #8a3818;
  --scripture-gradient: linear-gradient(180deg, rgba(253, 247, 242, 0.97), rgba(248, 221, 212, 0.98));
  --select-surface: rgba(255, 250, 248, 0.92);
  --select-border: rgba(194, 96, 58, 0.12);
  --verse-surface: rgba(254, 250, 247, 0.88);
  --verse-border: rgba(194, 96, 58, 0.08);
  --list-text: #8a3818;
  --input-surface: rgba(255, 250, 248, 0.94);
  --note-chip-surface: rgba(255, 250, 248, 0.78);
  --note-chip-active: #f8ddd4;
  --note-chip-border: rgba(194, 96, 58, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="desert-bloom"][data-theme="dark"] {
  --surface: rgba(20, 8, 4, 0.93);
  --surface-strong: #140804;
  --surface-accent: #281408;
  --text: #fde8e0;
  --muted: #e09080;
  --border: rgba(220, 130, 100, 0.16);
  --accent: #d88060;
  --accent-strong: #f0a890;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.52);
  --hero-glow-left: rgba(180, 80, 50, 0.28);
  --hero-glow-right: rgba(200, 120, 80, 0.2);
  --page-gradient: linear-gradient(160deg, #100400 0%, #180800 45%, #1e0c06 100%);
  --grid-line-1: rgba(220, 130, 100, 0.1);
  --grid-line-2: rgba(220, 130, 100, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(220, 130, 100, 0.07), transparent 20%);
  --ghost-surface: rgba(24, 10, 6, 0.82);
  --tool-hover: #281408;
  --tool-hover-border: rgba(220, 130, 100, 0.22);
  --editor-border: rgba(220, 130, 100, 0.1);
  --focus-ring: rgba(220, 130, 100, 0.3);
  --placeholder: rgba(224, 144, 128, 0.58);
  --blockquote-border: rgba(220, 130, 100, 0.42);
  --blockquote-text: #e09080;
  --scripture-gradient: linear-gradient(180deg, rgba(20, 8, 4, 0.99), rgba(14, 4, 0, 0.99));
  --select-surface: rgba(20, 8, 4, 0.96);
  --select-border: rgba(220, 130, 100, 0.12);
  --verse-surface: rgba(18, 6, 2, 0.94);
  --verse-border: rgba(220, 130, 100, 0.08);
  --list-text: #e09080;
  --input-surface: rgba(22, 10, 6, 0.96);
  --note-chip-surface: rgba(26, 12, 8, 0.88);
  --note-chip-active: #281408;
  --note-chip-border: rgba(220, 130, 100, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "desert-bloom",
  name: "Desert Bloom",
  supports: "both",
  swatches: ["#fdf5f2", "#c2603a", "#f8ddd4", "#1e0c06"]
});
