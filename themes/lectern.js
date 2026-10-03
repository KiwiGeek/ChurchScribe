window.colorThemes = window.colorThemes || [];

(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="lectern"] {
  --font-heading: "Fraunces", serif;
  --font-body: "Manrope", sans-serif;
  --surface: #ffffff;
  --surface-strong: #ffffff;
  --surface-accent: #f2f2f0;
  --text: #161616;
  --muted: #5a5a56;
  --border: rgba(0, 0, 0, 0.12);
  --accent: #3d4f3a;
  --accent-strong: #2a3728;
  --shadow: none;
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --page-gradient: #f4f4f1;
  --grid-line-1: transparent;
  --grid-line-2: transparent;
  --panel-highlight: none;
  --ghost-surface: #ffffff;
  --tool-hover: #ecece8;
  --tool-hover-border: rgba(0, 0, 0, 0.16);
  --editor-border: rgba(0, 0, 0, 0.07);
  --focus-ring: rgba(61, 79, 58, 0.28);
  --placeholder: rgba(90, 90, 86, 0.55);
  --blockquote-border: rgba(61, 79, 58, 0.4);
  --blockquote-text: #3a3a36;
  --scripture-gradient: #ffffff;
  --select-surface: #ffffff;
  --select-border: rgba(0, 0, 0, 0.14);
  --verse-surface: #fafaf8;
  --verse-border: rgba(0, 0, 0, 0.07);
  --list-text: #3a3a36;
  --input-surface: #ffffff;
  --note-chip-surface: #ffffff;
  --note-chip-active: #ecece8;
  --note-chip-border: rgba(0, 0, 0, 0.1);
  --radius-xl: 8px;
  --radius-lg: 6px;
  --radius-md: 4px;
  color-scheme: light;
}
[data-color-theme="lectern"][data-theme="dark"] {
  --surface: #141614;
  --surface-strong: #141614;
  --surface-accent: #1e221e;
  --text: #ecece6;
  --muted: #9a9e96;
  --border: rgba(255, 255, 255, 0.12);
  --accent: #a4b89a;
  --accent-strong: #c8d6c0;
  --shadow: none;
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --page-gradient: #0e100e;
  --grid-line-1: transparent;
  --grid-line-2: transparent;
  --panel-highlight: none;
  --ghost-surface: #141614;
  --tool-hover: #1e221e;
  --tool-hover-border: rgba(255, 255, 255, 0.16);
  --editor-border: rgba(255, 255, 255, 0.08);
  --focus-ring: rgba(164, 184, 154, 0.3);
  --placeholder: rgba(154, 158, 150, 0.55);
  --blockquote-border: rgba(164, 184, 154, 0.4);
  --blockquote-text: #b8bcb4;
  --scripture-gradient: #141614;
  --select-surface: #181b18;
  --select-border: rgba(255, 255, 255, 0.12);
  --verse-surface: #161916;
  --verse-border: rgba(255, 255, 255, 0.08);
  --list-text: #b8bcb4;
  --input-surface: #181b18;
  --note-chip-surface: #181b18;
  --note-chip-active: #1e221e;
  --note-chip-border: rgba(255, 255, 255, 0.1);
  color-scheme: dark;
}

[data-color-theme="lectern"] body::before {
  display: none;
}

[data-color-theme="lectern"] .panel {
  backdrop-filter: none;
  box-shadow: none;
}

[data-color-theme="lectern"] .panel::after {
  display: none;
}

[data-color-theme="lectern"] .theme-toggle:hover,
[data-color-theme="lectern"] .theme-toggle:focus-visible,
[data-color-theme="lectern"] .ghost-button:hover,
[data-color-theme="lectern"] .field select:hover {
  transform: none;
}

[data-color-theme="lectern"] .app-header h1 {
  font-size: 1.2rem;
}

[data-color-theme="lectern"] .app-shell {
  padding: 10px 12px 12px;
}

[data-color-theme="lectern"] .app-header {
  margin-bottom: 8px;
}

/* Presentation: larger scripture for reading aloud / scripture-only. */
[data-color-theme="lectern"] .chapter-verse {
  font-size: 1.18rem;
  line-height: 1.9;
}

[data-color-theme="lectern"] .verse-reference {
  font-size: 0.92rem;
}

[data-color-theme="lectern"] .verse-text {
  font-size: clamp(1.55rem, 2.4vw, 2.15rem);
  line-height: 1.5;
}
`;
  document.head.appendChild(style);
})();

window.colorThemes.push({
  id: "lectern",
  name: "Lectern",
  supports: "both",
  featured: true,
  tags: ["minimal", "bold"],
  swatches: ["#f4f4f1", "#3d4f3a", "#ffffff", "#0e100e"]
});
