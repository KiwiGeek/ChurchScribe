window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="candlelight"] {
  --font-heading: "Playfair Display", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(254, 253, 244, 0.96);
  --surface-strong: #fefdf4;
  --surface-accent: #fdf0cc;
  --text: #1a1000;
  --muted: #886610;
  --border: rgba(200, 130, 10, 0.15);
  --accent: #d4820a;
  --accent-strong: #a86000;
  --shadow: 0 24px 80px rgba(200, 140, 20, 0.14);
  --hero-glow-left: rgba(255, 200, 60, 0.32);
  --hero-glow-right: rgba(220, 160, 30, 0.2);
  --page-gradient: linear-gradient(160deg, #fef5d0 0%, #fde8a0 45%, #fcd870 100%);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.42), transparent 20%);
  --ghost-surface: rgba(254, 252, 238, 0.8);
  --tool-hover: #fdf0cc;
  --tool-hover-border: rgba(200, 130, 10, 0.18);
  --editor-border: rgba(200, 130, 10, 0.08);
  --focus-ring: rgba(212, 130, 10, 0.26);
  --placeholder: rgba(136, 102, 16, 0.58);
  --blockquote-border: rgba(212, 130, 10, 0.38);
  --blockquote-text: #8a6000;
  --scripture-gradient: linear-gradient(180deg, rgba(254, 253, 244, 0.97), rgba(253, 240, 204, 0.98));
  --select-surface: rgba(255, 254, 248, 0.94);
  --select-border: rgba(200, 130, 10, 0.12);
  --verse-surface: rgba(255, 253, 243, 0.9);
  --verse-border: rgba(200, 130, 10, 0.08);
  --list-text: #8a6000;
  --input-surface: rgba(255, 254, 248, 0.96);
  --note-chip-surface: rgba(255, 254, 248, 0.82);
  --note-chip-active: #fdf0cc;
  --note-chip-border: rgba(200, 130, 10, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="candlelight"][data-theme="dark"] {
  --surface: rgba(18, 12, 0, 0.94);
  --surface-strong: #120c00;
  --surface-accent: #241a00;
  --text: #fff8e0;
  --muted: #d4a840;
  --border: rgba(210, 168, 40, 0.16);
  --accent: #c09020;
  --accent-strong: #e0b840;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.54);
  --hero-glow-left: rgba(180, 130, 10, 0.28);
  --hero-glow-right: rgba(220, 160, 0, 0.18);
  --page-gradient: linear-gradient(160deg, #0e0800 0%, #140e00 45%, #1a1200 100%);
  --grid-line-1: rgba(210, 168, 40, 0.1);
  --grid-line-2: rgba(210, 168, 40, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(210, 168, 40, 0.08), transparent 20%);
  --ghost-surface: rgba(24, 16, 0, 0.84);
  --tool-hover: #241a00;
  --tool-hover-border: rgba(210, 168, 40, 0.2);
  --editor-border: rgba(210, 168, 40, 0.1);
  --focus-ring: rgba(210, 168, 40, 0.3);
  --placeholder: rgba(212, 168, 64, 0.56);
  --blockquote-border: rgba(210, 168, 40, 0.42);
  --blockquote-text: #d4a840;
  --scripture-gradient: linear-gradient(180deg, rgba(18, 12, 0, 0.99), rgba(12, 8, 0, 0.99));
  --select-surface: rgba(18, 12, 0, 0.96);
  --select-border: rgba(210, 168, 40, 0.12);
  --verse-surface: rgba(16, 10, 0, 0.94);
  --verse-border: rgba(210, 168, 40, 0.08);
  --list-text: #d4a840;
  --input-surface: rgba(20, 14, 0, 0.96);
  --note-chip-surface: rgba(26, 18, 0, 0.88);
  --note-chip-active: #241a00;
  --note-chip-border: rgba(210, 168, 40, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "candlelight",
  name: "Candlelight",
  supports: "both",
  swatches: ["#fefdf4", "#d4820a", "#fdf0cc", "#1a1000"]
});
