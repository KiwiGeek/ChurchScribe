window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="saffron-spice"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(254, 251, 232, 0.95);
  --surface-strong: #fefae8;
  --surface-accent: #fef0b0;
  --text: #1a1200;
  --muted: #9a6800;
  --border: rgba(212, 140, 0, 0.15);
  --accent: #d48c00;
  --accent-strong: #a86a00;
  --shadow: 0 24px 80px rgba(200, 140, 0, 0.15);
  --hero-glow-left: rgba(255, 200, 40, 0.3);
  --hero-glow-right: rgba(230, 160, 0, 0.2);
  --page-gradient: linear-gradient(160deg, #fef5c0 0%, #fee880 45%, #fddc50 100%);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent 20%);
  --ghost-surface: rgba(254, 251, 230, 0.8);
  --tool-hover: #fef0b0;
  --tool-hover-border: rgba(212, 140, 0, 0.18);
  --editor-border: rgba(212, 140, 0, 0.08);
  --focus-ring: rgba(212, 140, 0, 0.26);
  --placeholder: rgba(154, 104, 0, 0.58);
  --blockquote-border: rgba(212, 140, 0, 0.38);
  --blockquote-text: #8a5a00;
  --scripture-gradient: linear-gradient(180deg, rgba(254, 251, 232, 0.97), rgba(254, 240, 176, 0.98));
  --select-surface: rgba(255, 253, 242, 0.94);
  --select-border: rgba(212, 140, 0, 0.12);
  --verse-surface: rgba(255, 253, 238, 0.9);
  --verse-border: rgba(212, 140, 0, 0.08);
  --list-text: #8a5a00;
  --input-surface: rgba(255, 253, 242, 0.96);
  --note-chip-surface: rgba(255, 253, 242, 0.82);
  --note-chip-active: #fef0b0;
  --note-chip-border: rgba(212, 140, 0, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="saffron-spice"][data-theme="dark"] {
  --surface: rgba(16, 12, 0, 0.94);
  --surface-strong: #100c00;
  --surface-accent: #201a00;
  --text: #fff8d0;
  --muted: #d0a820;
  --border: rgba(210, 168, 20, 0.16);
  --accent: #c09000;
  --accent-strong: #e0b800;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.54);
  --hero-glow-left: rgba(180, 130, 0, 0.28);
  --hero-glow-right: rgba(210, 160, 0, 0.18);
  --page-gradient: linear-gradient(160deg, #0c0800 0%, #120e00 45%, #181400 100%);
  --grid-line-1: rgba(210, 168, 20, 0.1);
  --grid-line-2: rgba(210, 168, 20, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(210, 168, 20, 0.08), transparent 20%);
  --ghost-surface: rgba(22, 16, 0, 0.84);
  --tool-hover: #201a00;
  --tool-hover-border: rgba(210, 168, 20, 0.2);
  --editor-border: rgba(210, 168, 20, 0.1);
  --focus-ring: rgba(210, 168, 20, 0.3);
  --placeholder: rgba(208, 168, 32, 0.56);
  --blockquote-border: rgba(210, 168, 20, 0.42);
  --blockquote-text: #d0a820;
  --scripture-gradient: linear-gradient(180deg, rgba(16, 12, 0, 0.99), rgba(10, 8, 0, 0.99));
  --select-surface: rgba(16, 12, 0, 0.96);
  --select-border: rgba(210, 168, 20, 0.12);
  --verse-surface: rgba(14, 10, 0, 0.94);
  --verse-border: rgba(210, 168, 20, 0.08);
  --list-text: #d0a820;
  --input-surface: rgba(18, 14, 0, 0.96);
  --note-chip-surface: rgba(24, 18, 0, 0.88);
  --note-chip-active: #201a00;
  --note-chip-border: rgba(210, 168, 20, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "saffron-spice",
  name: "Saffron Spice",
  supports: "both",
  swatches: ["#fefae8", "#d48c00", "#fef0b0", "#1a1200"]
});
