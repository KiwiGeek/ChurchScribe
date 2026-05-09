window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="solar-flare"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: rgba(255, 252, 245, 0.93);
  --surface-strong: #fff9f0;
  --surface-accent: #ffe0b2;
  --text: #1a0800;
  --muted: #904010;
  --border: rgba(232, 93, 4, 0.15);
  --accent: #e85d04;
  --accent-strong: #bf360c;
  --shadow: 0 24px 80px rgba(232, 93, 4, 0.16);
  --hero-glow-left: rgba(255, 160, 0, 0.35);
  --hero-glow-right: rgba(232, 93, 4, 0.22);
  --page-gradient: linear-gradient(160deg, #fff3e0 0%, #ffe0b2 45%, #ffcc80 100%);
  --grid-line-1: rgba(255, 255, 255, 0.22);
  --grid-line-2: rgba(255, 255, 255, 0.14);
  --panel-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.34), transparent 20%);
  --ghost-surface: rgba(255, 255, 255, 0.72);
  --tool-hover: #ffe0b2;
  --tool-hover-border: rgba(232, 93, 4, 0.2);
  --editor-border: rgba(232, 93, 4, 0.08);
  --focus-ring: rgba(232, 93, 4, 0.25);
  --placeholder: rgba(144, 64, 16, 0.65);
  --blockquote-border: rgba(232, 93, 4, 0.38);
  --blockquote-text: #bf360c;
  --scripture-gradient: linear-gradient(180deg, rgba(255, 249, 240, 0.97), rgba(255, 224, 178, 0.98));
  --select-surface: rgba(255, 255, 255, 0.9);
  --select-border: rgba(232, 93, 4, 0.12);
  --verse-surface: rgba(255, 252, 245, 0.86);
  --verse-border: rgba(232, 93, 4, 0.08);
  --list-text: #bf360c;
  --input-surface: rgba(255, 255, 255, 0.92);
  --note-chip-surface: rgba(255, 255, 255, 0.74);
  --note-chip-active: #ffe0b2;
  --note-chip-border: rgba(232, 93, 4, 0.1);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  color-scheme: light;
}
[data-color-theme="solar-flare"][data-theme="dark"] {
  --surface: rgba(26, 10, 0, 0.92);
  --surface-strong: #1a0800;
  --surface-accent: #2e1200;
  --text: #fff3e0;
  --muted: #ffb74d;
  --border: rgba(255, 167, 38, 0.16);
  --accent: #ffa726;
  --accent-strong: #ffcc02;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  --hero-glow-left: rgba(232, 93, 4, 0.3);
  --hero-glow-right: rgba(255, 160, 0, 0.2);
  --page-gradient: linear-gradient(160deg, #100500 0%, #1a0800 45%, #200a00 100%);
  --grid-line-1: rgba(255, 167, 38, 0.1);
  --grid-line-2: rgba(255, 167, 38, 0.05);
  --panel-highlight: linear-gradient(180deg, rgba(255, 167, 38, 0.08), transparent 20%);
  --ghost-surface: rgba(30, 12, 0, 0.78);
  --tool-hover: #2e1200;
  --tool-hover-border: rgba(255, 167, 38, 0.22);
  --editor-border: rgba(255, 167, 38, 0.1);
  --focus-ring: rgba(255, 167, 38, 0.3);
  --placeholder: rgba(255, 183, 77, 0.6);
  --blockquote-border: rgba(255, 167, 38, 0.42);
  --blockquote-text: #ffb74d;
  --scripture-gradient: linear-gradient(180deg, rgba(26, 10, 0, 0.99), rgba(18, 6, 0, 0.99));
  --select-surface: rgba(26, 10, 0, 0.94);
  --select-border: rgba(255, 167, 38, 0.12);
  --verse-surface: rgba(22, 8, 0, 0.92);
  --verse-border: rgba(255, 167, 38, 0.08);
  --list-text: #ffb74d;
  --input-surface: rgba(28, 12, 0, 0.95);
  --note-chip-surface: rgba(34, 14, 0, 0.86);
  --note-chip-active: #2e1200;
  --note-chip-border: rgba(255, 167, 38, 0.14);
  color-scheme: dark;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "solar-flare",
  name: "Solar Flare",
  supports: "both",
  swatches: ["#fff9f0", "#e85d04", "#ffe0b2", "#1a0800"]
});
