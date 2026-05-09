window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="fuchsia-faith"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 243, 252, 0.94);
  --surface-strong: #fff0fc;
  --surface-accent: #f8c8f0;
  --text: #1e0018;
  --muted: #902880;
  --border: rgba(204, 0, 160, 0.15);
  --accent: #cc00a0;
  --accent-strong: #a00080;
  --shadow: 0 24px 80px rgba(200, 0, 160, 0.16);
  --hero-glow-left: rgba(240, 0, 200, 0.28);
  --hero-glow-right: rgba(200, 0, 160, 0.18);
  --page-gradient: linear-gradient(160deg, #fce0f8 0%, #f8c0f0 45%, #f0a0e8 100%);
  --grid-line-1: rgba(255, 255, 255, 0.26);
  --grid-line-2: rgba(255, 255, 255, 0.16);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.38), transparent 20%);
  --ghost-surface: rgba(255, 246, 254, 0.78);
  --tool-hover: #f8c8f0;
  --tool-hover-border: rgba(204, 0, 160, 0.2);
  --editor-border: rgba(204, 0, 160, 0.08);
  --focus-ring: rgba(204, 0, 160, 0.26);
  --placeholder: rgba(144, 40, 128, 0.6);
  --blockquote-border: rgba(204, 0, 160, 0.38);
  --blockquote-text: #900070;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 243, 252, 0.97), rgba(248, 200, 240, 0.98));
  --select-surface: rgba(255, 248, 254, 0.94);
  --select-border: rgba(204, 0, 160, 0.12);
  --verse-surface: rgba(255, 248, 253, 0.9);
  --verse-border: rgba(204, 0, 160, 0.08);
  --list-text: #900070;
  --input-surface: rgba(255, 248, 254, 0.96);
  --note-chip-surface: rgba(255, 248, 254, 0.8);
  --note-chip-active: #f8c8f0;
  --note-chip-border: rgba(204, 0, 160, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="fuchsia-faith"][data-theme="dark"] {
  --surface: rgba(16, 0, 14, 0.95);
  --surface-strong: #10000e;
  --surface-accent: #22001e;
  --text: #ffe8fc;
  --muted: #e060c8;
  --border: rgba(230, 0, 180, 0.16);
  --accent: #e000c0;
  --accent-strong: #ff40e0;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.56);
  --hero-glow-left: rgba(180, 0, 150, 0.3);
  --hero-glow-right: rgba(220, 0, 180, 0.18);
  --page-gradient: linear-gradient(160deg, #0c0009 0%, #120010 45%, #180015 100%);
  --grid-line-1: rgba(230, 0, 180, 0.1);
  --grid-line-2: rgba(230, 0, 180, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(230, 0, 180, 0.08), transparent 20%);
  --ghost-surface: rgba(22, 2, 20, 0.86);
  --tool-hover: #22001e;
  --tool-hover-border: rgba(230, 0, 180, 0.22);
  --editor-border: rgba(230, 0, 180, 0.1);
  --focus-ring: rgba(230, 0, 180, 0.32);
  --placeholder: rgba(224, 96, 200, 0.56);
  --blockquote-border: rgba(230, 0, 180, 0.44);
  --blockquote-text: #e060c8;
  --scripture-gradient: linear-gradient(180deg, rgba(16, 0, 14, 0.99), rgba(10, 0, 9, 0.99));
  --select-surface: rgba(16, 0, 14, 0.96);
  --select-border: rgba(230, 0, 180, 0.12);
  --verse-surface: rgba(14, 0, 12, 0.94);
  --verse-border: rgba(230, 0, 180, 0.08);
  --list-text: #e060c8;
  --input-surface: rgba(18, 2, 16, 0.96);
  --note-chip-surface: rgba(22, 2, 20, 0.88);
  --note-chip-active: #22001e;
  --note-chip-border: rgba(230, 0, 180, 0.16);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "fuchsia-faith",
  name: "Fuchsia Faith",
  supports: "both",
  swatches: ["#fff0fc", "#cc00a0", "#f8c8f0", "#1e0018"]
});
