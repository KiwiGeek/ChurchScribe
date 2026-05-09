window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="coral-reef"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 246, 244, 0.93);
  --surface-strong: #fff6f4;
  --surface-accent: #ffdad5;
  --text: #1a0800;
  --muted: #9a3820;
  --border: rgba(230, 74, 25, 0.15);
  --accent: #e64a19;
  --accent-strong: #bf360c;
  --shadow: 0 24px 80px rgba(180, 50, 20, 0.14);
  --hero-glow-left: rgba(255, 112, 67, 0.3);
  --hero-glow-right: rgba(230, 74, 25, 0.18);
  --page-gradient: linear-gradient(160deg, #fbe9e7 0%, #ffccbc 45%, #ffab91 100%);
  --grid-line-1: rgba(255, 255, 255, 0.2);
  --grid-line-2: rgba(255, 255, 255, 0.12);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.32), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.7);
  --tool-hover: #ffdad5;
  --tool-hover-border: rgba(230, 74, 25, 0.2);
  --editor-border: rgba(230, 74, 25, 0.08);
  --focus-ring: rgba(230, 74, 25, 0.25);
  --placeholder: rgba(154, 56, 32, 0.62);
  --blockquote-border: rgba(230, 74, 25, 0.38);
  --blockquote-text: #7a2510;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 248, 246, 0.97), rgba(255, 218, 213, 0.98));
  --select-surface: rgba(255, 255, 255, 0.92);
  --select-border: rgba(230, 74, 25, 0.12);
  --verse-surface: rgba(255, 250, 248, 0.88);
  --verse-border: rgba(230, 74, 25, 0.08);
  --list-text: #7a2510;
  --input-surface: rgba(255, 255, 255, 0.94);
  --note-chip-surface: rgba(255, 255, 255, 0.76);
  --note-chip-active: #ffdad5;
  --note-chip-border: rgba(230, 74, 25, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="coral-reef"][data-theme="dark"] {
  --surface: rgba(26, 8, 2, 0.92);
  --surface-strong: #1a0802;
  --surface-accent: #260c05;
  --text: #fbe9e7;
  --muted: #ff8a65;
  --border: rgba(255, 112, 67, 0.15);
  --accent: #ff7043;
  --accent-strong: #ffab91;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(200, 60, 20, 0.28);
  --hero-glow-right: rgba(160, 40, 10, 0.18);
  --page-gradient: linear-gradient(160deg, #120401 0%, #1a0802 45%, #220e06 100%);
  --grid-line-1: rgba(255, 112, 67, 0.08);
  --grid-line-2: rgba(255, 112, 67, 0.04);
  --panel-highlight: linear-gradient(180deg, rgba(255, 112, 67, 0.06), transparent 20%);
  --ghost-surface: rgba(36, 10, 4, 0.82);
  --tool-hover: #2a0e06;
  --tool-hover-border: rgba(255, 112, 67, 0.22);
  --editor-border: rgba(255, 112, 67, 0.1);
  --focus-ring: rgba(255, 112, 67, 0.3);
  --placeholder: rgba(255, 138, 101, 0.6);
  --blockquote-border: rgba(255, 112, 67, 0.42);
  --blockquote-text: #ff8a65;
  --scripture-gradient: linear-gradient(180deg, rgba(28, 9, 3, 0.99), rgba(18, 5, 1, 0.99));
  --select-surface: rgba(28, 9, 3, 0.96);
  --select-border: rgba(255, 112, 67, 0.12);
  --verse-surface: rgba(22, 7, 2, 0.94);
  --verse-border: rgba(255, 112, 67, 0.08);
  --list-text: #ff8a65;
  --input-surface: rgba(28, 9, 3, 0.96);
  --note-chip-surface: rgba(34, 11, 4, 0.9);
  --note-chip-active: #2a0e06;
  --note-chip-border: rgba(255, 112, 67, 0.12);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "coral-reef",
  name: "Coral Reef",
  supports: "both",
  swatches: ["#fff6f4", "#e64a19", "#ffdad5", "#1a0800"]
});
