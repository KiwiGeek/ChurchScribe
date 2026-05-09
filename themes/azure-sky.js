window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="azure-sky"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(240, 247, 255, 0.94);
  --surface-strong: #f0f7ff;
  --surface-accent: #bbdefb;
  --text: #0a1e30;
  --muted: #2c6090;
  --border: rgba(30, 136, 229, 0.14);
  --accent: #1e88e5;
  --accent-strong: #1565c0;
  --shadow: 0 24px 80px rgba(20, 100, 180, 0.12);
  --hero-glow-left: rgba(30, 136, 229, 0.26);
  --hero-glow-right: rgba(100, 181, 246, 0.18);
  --page-gradient: linear-gradient(160deg, #e3f2fd 0%, #bbdefb 45%, #90caf9 100%);
  --grid-line-1: rgba(255, 255, 255, 0.22);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.34), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.70);
  --tool-hover: #bbdefb;
  --tool-hover-border: rgba(30, 136, 229, 0.20);
  --editor-border: rgba(30, 136, 229, 0.08);
  --focus-ring: rgba(30, 136, 229, 0.26);
  --placeholder: rgba(44, 96, 144, 0.62);
  --blockquote-border: rgba(30, 136, 229, 0.36);
  --blockquote-text: #164e78;
  --scripture-gradient: linear-gradient(180deg, rgba(240, 247, 255, 0.97), rgba(187, 222, 251, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(30, 136, 229, 0.12);
  --verse-surface: rgba(245, 250, 255, 0.88);
  --verse-border: rgba(30, 136, 229, 0.08);
  --list-text: #164e78;
  --input-surface: rgba(255, 255, 255, 0.94);
  --note-chip-surface: rgba(255, 255, 255, 0.76);
  --note-chip-active: #bbdefb;
  --note-chip-border: rgba(30, 136, 229, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="azure-sky"][data-theme="dark"] {
  --surface: rgba(4, 14, 28, 0.92);
  --surface-strong: #040e1c;
  --surface-accent: #0a1e36;
  --text: #e3f2fd;
  --muted: #64b0e8;
  --border: rgba(100, 176, 232, 0.15);
  --accent: #64b0e8;
  --accent-strong: #90caf9;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.50);
  --hero-glow-left: rgba(30, 100, 180, 0.28);
  --hero-glow-right: rgba(20, 70, 140, 0.20);
  --page-gradient: linear-gradient(160deg, #020a18 0%, #040e1c 45%, #071422 100%);
  --grid-line-1: rgba(100, 176, 232, 0.08);
  --grid-line-2: rgba(100, 176, 232, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(100, 176, 232, 0.06), transparent 20%);
  --ghost-surface: rgba(8, 20, 40, 0.80);
  --tool-hover: #0a1e36;
  --tool-hover-border: rgba(100, 176, 232, 0.22);
  --editor-border: rgba(100, 176, 232, 0.10);
  --focus-ring: rgba(100, 176, 232, 0.30);
  --placeholder: rgba(100, 176, 232, 0.60);
  --blockquote-border: rgba(100, 176, 232, 0.42);
  --blockquote-text: #64b0e8;
  --scripture-gradient: linear-gradient(180deg, rgba(6, 16, 30, 0.99), rgba(4, 10, 20, 0.99));
  --select-surface: rgba(6, 16, 30, 0.96);
  --select-border: rgba(100, 176, 232, 0.12);
  --verse-surface: rgba(4, 12, 24, 0.94);
  --verse-border: rgba(100, 176, 232, 0.08);
  --list-text: #64b0e8;
  --input-surface: rgba(6, 16, 30, 0.96);
  --note-chip-surface: rgba(8, 20, 38, 0.88);
  --note-chip-active: #0a1e36;
  --note-chip-border: rgba(100, 176, 232, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "azure-sky",
  name: "Azure Sky",
  supports: "both",
  swatches: ["#f0f7ff", "#1e88e5", "#bbdefb", "#0a1e30"]
});
