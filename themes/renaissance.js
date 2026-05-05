window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="renaissance"] {
  --font-heading: "Cinzel", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(253, 247, 242, 0.94);
  --surface-strong: #fdf5f0;
  --surface-accent: #f0d8cc;
  --text: #1e0810;
  --muted: #7a3050;
  --border: rgba(139, 28, 58, 0.15);
  --accent: #8b1c3a;
  --accent-strong: #6a1028;
  --shadow: 0 24px 80px rgba(100, 20, 50, 0.15);
  --hero-glow-left: rgba(180, 60, 90, 0.28);
  --hero-glow-right: rgba(200, 160, 60, 0.18);
  --page-gradient: linear-gradient(160deg, #f5e8dc 0%, #edd0b8 45%, #e0b898 100%);
  --grid-line-1: rgba(255, 255, 255, 0.24);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.36), transparent 20%);
  --ghost-surface: rgba(253, 248, 244, 0.78);
  --tool-hover: #f0d8cc;
  --tool-hover-border: rgba(139, 28, 58, 0.2);
  --editor-border: rgba(139, 28, 58, 0.08);
  --focus-ring: rgba(139, 28, 58, 0.26);
  --placeholder: rgba(122, 48, 80, 0.62);
  --blockquote-border: rgba(139, 28, 58, 0.38);
  --blockquote-text: #6a1028;
  --scripture-gradient: linear-gradient(180deg, rgba(253, 247, 242, 0.97), rgba(240, 216, 204, 0.98));
  --select-surface: rgba(255, 250, 248, 0.92);
  --select-border: rgba(139, 28, 58, 0.12);
  --verse-surface: rgba(254, 250, 246, 0.88);
  --verse-border: rgba(139, 28, 58, 0.08);
  --list-text: #6a1028;
  --input-surface: rgba(255, 250, 248, 0.94);
  --note-chip-surface: rgba(255, 250, 248, 0.78);
  --note-chip-active: #f0d8cc;
  --note-chip-border: rgba(139, 28, 58, 0.1);
  --radius-xl: 4px;
  --radius-lg: 3px;
  --radius-md: 2px;
  color-scheme: light;
}
[data-color-theme="renaissance"][data-theme="dark"] {
  --surface: rgba(18, 4, 10, 0.94);
  --surface-strong: #12040a;
  --surface-accent: #28101e;
  --text: #f8e8dc;
  --muted: #d08878;
  --border: rgba(200, 120, 100, 0.16);
  --accent: #c8805a;
  --accent-strong: #e0a880;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.56);
  --hero-glow-left: rgba(120, 30, 60, 0.3);
  --hero-glow-right: rgba(180, 120, 40, 0.2);
  --page-gradient: linear-gradient(160deg, #0e0208 0%, #14060e 45%, #1a0a14 100%);
  --grid-line-1: rgba(200, 130, 100, 0.1);
  --grid-line-2: rgba(200, 130, 100, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(180, 120, 60, 0.08), transparent 20%);
  --ghost-surface: rgba(22, 8, 14, 0.84);
  --tool-hover: #28101e;
  --tool-hover-border: rgba(200, 130, 100, 0.22);
  --editor-border: rgba(200, 130, 100, 0.1);
  --focus-ring: rgba(200, 130, 100, 0.3);
  --placeholder: rgba(208, 136, 120, 0.58);
  --blockquote-border: rgba(200, 130, 100, 0.42);
  --blockquote-text: #d08878;
  --scripture-gradient: linear-gradient(180deg, rgba(18, 4, 10, 0.99), rgba(12, 2, 6, 0.99));
  --select-surface: rgba(18, 4, 10, 0.96);
  --select-border: rgba(200, 130, 100, 0.12);
  --verse-surface: rgba(15, 3, 8, 0.94);
  --verse-border: rgba(200, 130, 100, 0.08);
  --list-text: #d08878;
  --input-surface: rgba(20, 6, 12, 0.96);
  --note-chip-surface: rgba(24, 8, 16, 0.88);
  --note-chip-active: #28101e;
  --note-chip-border: rgba(200, 130, 100, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "renaissance",
  name: "Renaissance",
  supports: "both",
  swatches: ["#fdf5f0", "#8b1c3a", "#f0d8cc", "#1e0810"]
});
