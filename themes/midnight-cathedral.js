window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="midnight-cathedral"] {
  --font-heading: "Cinzel", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(10, 21, 41, 0.92);
  --surface-strong: #0a1529;
  --surface-accent: #122040;
  --text: #f5f0e8;
  --muted: #c9b87a;
  --border: rgba(212, 175, 55, 0.18);
  --accent: #d4af37;
  --accent-strong: #f0d060;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.6);
  --hero-glow-left: rgba(60, 40, 180, 0.28);
  --hero-glow-right: rgba(212, 175, 55, 0.2);
  --page-gradient: linear-gradient(160deg, #050b1a 0%, #0d1628 45%, #0f1c30 100%);
  --grid-line-1: rgba(212, 175, 55, 0.08);
  --grid-line-2: rgba(212, 175, 55, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(212, 175, 55, 0.06), transparent 20%);
  --ghost-surface: rgba(12, 24, 46, 0.8);
  --tool-hover: #162038;
  --tool-hover-border: rgba(212, 175, 55, 0.25);
  --editor-border: rgba(212, 175, 55, 0.1);
  --focus-ring: rgba(212, 175, 55, 0.3);
  --placeholder: rgba(201, 184, 122, 0.65);
  --blockquote-border: rgba(212, 175, 55, 0.45);
  --blockquote-text: #c9b87a;
  --scripture-gradient: linear-gradient(180deg, rgba(12, 22, 42, 0.99), rgba(8, 14, 28, 0.99));
  --select-surface: rgba(10, 20, 40, 0.95);
  --select-border: rgba(212, 175, 55, 0.14);
  --verse-surface: rgba(8, 16, 32, 0.92);
  --verse-border: rgba(212, 175, 55, 0.08);
  --list-text: #c9b87a;
  --input-surface: rgba(10, 20, 40, 0.95);
  --note-chip-surface: rgba(14, 26, 50, 0.88);
  --note-chip-active: #162038;
  --note-chip-border: rgba(212, 175, 55, 0.15);
  --radius-xl: 8px;
  --radius-lg: 6px;
  --radius-md: 4px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "midnight-cathedral",
  name: "Midnight Cathedral",
  supports: "dark",
  swatches: ["#0a1529", "#d4af37", "#122040", "#f5f0e8"]
});
