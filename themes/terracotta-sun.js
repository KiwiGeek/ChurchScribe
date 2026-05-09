window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="terracotta-sun"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(253, 246, 238, 0.94);
  --surface-strong: #fdf4ee;
  --surface-accent: #f0d0b8;
  --text: #2a1006;
  --muted: #8a4a28;
  --border: rgba(196, 94, 42, 0.15);
  --accent: #c45e2a;
  --accent-strong: #9e3c14;
  --shadow: 0 24px 80px rgba(180, 80, 30, 0.15);
  --hero-glow-left: rgba(220, 120, 60, 0.28);
  --hero-glow-right: rgba(196, 94, 42, 0.18);
  --page-gradient: linear-gradient(160deg, #fbe8d8 0%, #f5cfa8 45%, #edba88 100%);
  --grid-line-1: rgba(255, 255, 255, 0.24);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.36), transparent 20%);
  --ghost-surface: rgba(255, 248, 240, 0.76);
  --tool-hover: #f0d0b8;
  --tool-hover-border: rgba(196, 94, 42, 0.2);
  --editor-border: rgba(196, 94, 42, 0.08);
  --focus-ring: rgba(196, 94, 42, 0.26);
  --placeholder: rgba(138, 74, 40, 0.62);
  --blockquote-border: rgba(196, 94, 42, 0.38);
  --blockquote-text: #8a3a14;
  --scripture-gradient: linear-gradient(180deg, rgba(253, 246, 238, 0.97), rgba(240, 208, 184, 0.98));
  --select-surface: rgba(255, 252, 248, 0.92);
  --select-border: rgba(196, 94, 42, 0.12);
  --verse-surface: rgba(254, 249, 244, 0.88);
  --verse-border: rgba(196, 94, 42, 0.08);
  --list-text: #8a3a14;
  --input-surface: rgba(255, 252, 248, 0.94);
  --note-chip-surface: rgba(255, 252, 248, 0.78);
  --note-chip-active: #f0d0b8;
  --note-chip-border: rgba(196, 94, 42, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="terracotta-sun"][data-theme="dark"] {
  --surface: rgba(20, 8, 2, 0.93);
  --surface-strong: #140802;
  --surface-accent: #281408;
  --text: #fde8d8;
  --muted: #e08860;
  --border: rgba(220, 130, 80, 0.16);
  --accent: #e07840;
  --accent-strong: #f0a870;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.52);
  --hero-glow-left: rgba(180, 80, 30, 0.28);
  --hero-glow-right: rgba(140, 60, 20, 0.2);
  --page-gradient: linear-gradient(160deg, #100600 0%, #180800 45%, #1e0c04 100%);
  --grid-line-1: rgba(220, 130, 80, 0.1);
  --grid-line-2: rgba(220, 130, 80, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(220, 130, 80, 0.07), transparent 20%);
  --ghost-surface: rgba(24, 10, 4, 0.82);
  --tool-hover: #281408;
  --tool-hover-border: rgba(220, 130, 80, 0.22);
  --editor-border: rgba(220, 130, 80, 0.1);
  --focus-ring: rgba(220, 130, 80, 0.3);
  --placeholder: rgba(224, 136, 96, 0.58);
  --blockquote-border: rgba(220, 130, 80, 0.42);
  --blockquote-text: #e08860;
  --scripture-gradient: linear-gradient(180deg, rgba(20, 8, 2, 0.99), rgba(14, 4, 0, 0.99));
  --select-surface: rgba(20, 8, 2, 0.96);
  --select-border: rgba(220, 130, 80, 0.12);
  --verse-surface: rgba(18, 6, 2, 0.94);
  --verse-border: rgba(220, 130, 80, 0.08);
  --list-text: #e08860;
  --input-surface: rgba(22, 10, 4, 0.96);
  --note-chip-surface: rgba(26, 12, 6, 0.88);
  --note-chip-active: #281408;
  --note-chip-border: rgba(220, 130, 80, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "terracotta-sun",
  name: "Terracotta Sun",
  supports: "both",
  swatches: ["#fdf4ee", "#c45e2a", "#f0d0b8", "#2a1006"]
});
