window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="neon-tokyo"] {
  --font-heading: "Orbitron", sans-serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(6, 8, 18, 0.96);
  --surface-strong: #060812;
  --surface-accent: #0c1028;
  --text: #eeffcc;
  --muted: #aad000;
  --border: rgba(212, 255, 0, 0.2);
  --accent: #d4ff00;
  --accent-strong: #eeff44;
  --shadow: 0 0 60px rgba(200, 255, 0, 0.14);
  --hero-glow-left: rgba(180, 255, 0, 0.2);
  --hero-glow-right: rgba(0, 200, 255, 0.12);
  --page-gradient: linear-gradient(160deg, #04060e 0%, #060810 45%, #080c14 100%);
  --grid-line-1: rgba(212, 255, 0, 0.1);
  --grid-line-2: rgba(212, 255, 0, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(212, 255, 0, 0.07), transparent 20%);
  --ghost-surface: rgba(10, 14, 28, 0.84);
  --tool-hover: #0c1028;
  --tool-hover-border: rgba(212, 255, 0, 0.24);
  --editor-border: rgba(212, 255, 0, 0.1);
  --focus-ring: rgba(212, 255, 0, 0.32);
  --placeholder: rgba(170, 208, 0, 0.55);
  --blockquote-border: rgba(212, 255, 0, 0.44);
  --blockquote-text: #aad000;
  --scripture-gradient: linear-gradient(180deg, rgba(6, 8, 18, 0.99), rgba(4, 6, 14, 0.99));
  --select-surface: rgba(8, 10, 22, 0.96);
  --select-border: rgba(212, 255, 0, 0.12);
  --verse-surface: rgba(6, 8, 16, 0.94);
  --verse-border: rgba(212, 255, 0, 0.08);
  --list-text: #aad000;
  --input-surface: rgba(8, 10, 22, 0.96);
  --note-chip-surface: rgba(10, 12, 26, 0.88);
  --note-chip-active: #0c1028;
  --note-chip-border: rgba(212, 255, 0, 0.16);
  --radius-xl: 0px;
  --radius-lg: 0px;
  --radius-md: 0px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "neon-tokyo",
  name: "Neon Tokyo",
  supports: "dark",
  swatches: ["#060810", "#d4ff00", "#0a0e20", "#eeffcc"]
});
