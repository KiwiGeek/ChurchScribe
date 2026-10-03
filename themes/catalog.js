window.ScriptoriaModules = window.ScriptoriaModules || {};

// Enrich color themes with featured flags and mood tags for the Display
// settings picker. Themes may declare `featured` / `tags` themselves; this
// catalog fills gaps for the rest so filters work without editing every file.
(function () {
  const FEATURED_THEME_IDS = [
    "default",
    "clean-paper",
    "lectern",
    "plainsong",
    "quarry-stone",
    "inkwood",
    "sapphire-lectionary",
    "void-scripture",
    "monochrome",
    "cyberpunk"
  ];

  const THEME_TAG_OVERRIDES = {
    default: ["warm"],
    "amber-warmth": ["warm"],
    "autumn-harvest": ["warm"],
    "blood-moon": ["warm", "bold"],
    candlelight: ["warm"],
    "cherry-noir": ["warm", "bold"],
    "coffee-house": ["warm"],
    "copper-craft": ["warm"],
    "coral-reef": ["warm"],
    "crimson-faith": ["warm", "bold"],
    "desert-bloom": ["warm"],
    "ember-glow": ["warm"],
    "golden-hour": ["warm"],
    marigold: ["warm"],
    "papyrus-script": ["warm"],
    "peach-blossom": ["warm"],
    renaissance: ["warm"],
    "saffron-spice": ["warm"],
    "sand-dune": ["warm"],
    "sepia-memoir": ["warm"],
    "solar-flare": ["warm", "bold"],
    "tangerine-dream": ["warm"],
    "terracotta-sun": ["warm"],
    "volcanic-rock": ["warm", "bold"],
    "arctic-frost": ["cool"],
    "aurora-borealis": ["cool"],
    "azure-sky": ["cool"],
    "coastal-breeze": ["cool"],
    evensong: ["cool", "minimal"],
    "linen-sunlit": ["cool", "minimal"],
    "mint-fresh": ["cool"],
    "morning-mist": ["cool", "minimal"],
    "ocean-executive": ["cool"],
    "teal-modern": ["cool"],
    "twilight-prayer": ["cool"],
    "forest-vespers": ["cool"],
    "pine-grove": ["cool"],
    "sage-chapel": ["cool", "minimal"],
    "spring-meadow": ["cool"],
    "olive-grove": ["cool"],
    inkwood: ["cool", "minimal"],
    "quarry-stone": ["cool", "minimal"],
    "sapphire-lectionary": ["cool", "bold"],
    "deep-space": ["cool", "bold"],
    "indigo-depths": ["cool", "bold"],
    "lavender-grace": ["cool"],
    "royal-purple": ["cool", "bold"],
    "velvet-night": ["cool", "bold"],
    "plum-twilight": ["cool"],
    "cherry-blossom": ["warm"],
    "fuchsia-faith": ["bold"],
    "hot-pink": ["bold"],
    "rose-garden": ["warm"],
    "sunset-revival": ["warm", "bold"],
    graphite: ["minimal"],
    monochrome: ["minimal", "bold"],
    "slate-clean": ["minimal", "cool"],
    "steel-resolve": ["minimal", "cool"],
    "storm-grey": ["minimal", "cool"],
    plainsong: ["minimal", "cool"],
    "void-scripture": ["minimal", "bold"],
    "clean-paper": ["minimal", "bold"],
    lectern: ["minimal", "bold"],
    cyberpunk: ["bold"],
    "neon-sermon": ["bold"],
    "neon-tokyo": ["bold"],
    "retro-arcade": ["bold"],
    "northern-lights": ["cool", "bold"],
    "midnight-cathedral": ["bold", "cool"]
  };

  const inferTags = (theme) => {
    const haystack = `${theme.id} ${theme.name}`.toLowerCase();
    const tags = new Set();

    if (/neon|arcade|cyber|tokyo|flare|volcanic|blood|hot-pink|fuchsia|royal|void/.test(haystack)) {
      tags.add("bold");
    }

    if (/mono|slate|steel|storm|graphite|plain|paper|lectern|mist|linen|void|quarry/.test(haystack)) {
      tags.add("minimal");
    }

    if (/amber|autumn|candle|coffee|copper|coral|crimson|desert|ember|golden|marigold|papyrus|peach|saffron|sand|sepia|solar|tangerine|terracotta|warm|rose|cherry|sunset|parchment/.test(haystack)) {
      tags.add("warm");
    }

    if (/arctic|azure|coastal|ocean|teal|mint|mist|pine|forest|sage|olive|indigo|lavender|purple|plum|twilight|sapphire|stone|slate|steel|storm|inkwood|northern|deep-space|evensong/.test(haystack)) {
      tags.add("cool");
    }

    if (tags.size === 0) {
      tags.add(theme.supports === "dark" ? "cool" : "warm");
    }

    return [...tags];
  };

  const enrichColorThemes = (themes = window.colorThemes || []) => {
    const featuredOrder = new Map(FEATURED_THEME_IDS.map((id, index) => [id, index]));

    themes.forEach((theme) => {
      if (!Array.isArray(theme.tags) || theme.tags.length === 0) {
        theme.tags = THEME_TAG_OVERRIDES[theme.id] || inferTags(theme);
      }

      if (typeof theme.featured !== "boolean") {
        theme.featured = featuredOrder.has(theme.id);
      }
    });

    return themes;
  };

  const getFeaturedThemes = (themes = window.colorThemes || []) => {
    enrichColorThemes(themes);
    const order = new Map(FEATURED_THEME_IDS.map((id, index) => [id, index]));

    return themes
      .filter((theme) => theme.featured)
      .sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
  };

  const filterColorThemes = (themes, { support = "all", mood = "all" } = {}) => {
    enrichColorThemes(themes);

    return themes.filter((theme) => {
      const supports = theme.supports === "light" || theme.supports === "dark" ? theme.supports : "both";
      const supportOk = support === "all"
        || (support === "both" && supports === "both")
        || (support === "light" && (supports === "light" || supports === "both"))
        || (support === "dark" && (supports === "dark" || supports === "both"));
      const moodOk = mood === "all" || (theme.tags || []).includes(mood);
      return supportOk && moodOk;
    });
  };

  window.ScriptoriaModules.enrichColorThemes = enrichColorThemes;
  window.ScriptoriaModules.getFeaturedThemes = getFeaturedThemes;
  window.ScriptoriaModules.filterColorThemes = filterColorThemes;

  // Apply once scripts have pushed their theme definitions.
  enrichColorThemes(window.colorThemes || []);
})();
