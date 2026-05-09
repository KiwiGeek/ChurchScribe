window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="volcanic-rock"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(26, 22, 20, 0.94);
  --surface-strong: #1a1614;
  --surface-accent: #252020;
  --text: #f5f0ed;
  --muted: #c4a89a;
  --border: rgba(255, 87, 34, 0.18);
  --accent: #ff5722;
  --accent-strong: #ff8a65;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.65);
  --hero-glow-left: rgba(200, 60, 20, 0.3);
  --hero-glow-right: rgba(150, 40, 10, 0.2);
  --page-gradient: linear-gradient(160deg, #100c0a 0%, #181410 45%, #201a16 100%);
  --grid-line-1: rgba(255, 87, 34, 0.08);
  --grid-line-2: rgba(255, 87, 34, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(255, 87, 34, 0.06), transparent 20%);
  --ghost-surface: rgba(34, 28, 24, 0.82);
  --tool-hover: #2e2620;
  --tool-hover-border: rgba(255, 87, 34, 0.25);
  --editor-border: rgba(255, 87, 34, 0.1);
  --focus-ring: rgba(255, 87, 34, 0.32);
  --placeholder: rgba(196, 168, 154, 0.6);
  --blockquote-border: rgba(255, 87, 34, 0.45);
  --blockquote-text: #c4a89a;
  --scripture-gradient: linear-gradient(180deg, rgba(28, 24, 20, 0.99), rgba(18, 15, 12, 0.99));
  --select-surface: rgba(28, 24, 20, 0.96);
  --select-border: rgba(255, 87, 34, 0.14);
  --verse-surface: rgba(22, 18, 15, 0.94);
  --verse-border: rgba(255, 87, 34, 0.08);
  --list-text: #c4a89a;
  --input-surface: rgba(28, 24, 20, 0.96);
  --note-chip-surface: rgba(32, 26, 22, 0.9);
  --note-chip-active: #2e2620;
  --note-chip-border: rgba(255, 87, 34, 0.15);
  --radius-xl: 4px;
  --radius-lg: 3px;
  --radius-md: 2px;
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "volcanic-rock",
  name: "Volcanic Rock",
  supports: "dark",
  swatches: ["#1a1614", "#ff5722", "#252020", "#f5f0ed"]
});
