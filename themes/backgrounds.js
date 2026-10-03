window.colorThemes = window.colorThemes || [];

// Distinct page backgrounds layered on top of each theme's base tokens.
// Loaded after individual theme files so these overrides win without editing
// every theme module. Families: warm, azure, verdant, jewel, neon, minimal.
(function () {
  var style = document.createElement("style");
  style.textContent = `
[data-color-theme="amber-warmth"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(240, 144, 0, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fffbf1 0%, #fdeed3 48%, #fce6c0 100%);
  --hero-glow-left: rgba(240, 144, 0, 0.24);
  --hero-glow-right: rgba(192, 119, 12, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="amber-warmth"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(241, 151, 15, 0.26) 0%, transparent 50%), linear-gradient(155deg, #180d00 0%, #412703 50%, #2b1901 100%);
  --hero-glow-left: rgba(241, 151, 15, 0.28);
  --hero-glow-right: rgba(193, 124, 23, 0.16);
  --grid-line-1: rgba(247, 193, 111, 0.075);
  --grid-line-2: rgba(247, 193, 111, 0.03);
}

[data-color-theme="arctic-frost"] {
  --page-gradient: linear-gradient(185deg, #f6fbff 0%, #d8ebf7 40%, #c0def0 78%, #e2f0fa 100%);
  --hero-glow-left: rgba(2, 119, 189, 0.2);
  --hero-glow-right: rgba(48, 143, 201, 0.12);
  --grid-line-1: rgba(2, 119, 189, 0.11);
  --grid-line-2: rgba(2, 119, 189, 0.055);
}

[data-color-theme="arctic-frost"][data-theme="dark"] {
  --page-gradient: linear-gradient(190deg, #031f38 0%, #083355 38%, #0b3f65 72%, #052b4b 100%);
  --hero-glow-left: rgba(32, 135, 197, 0.3);
  --hero-glow-right: rgba(72, 157, 207, 0.16);
  --grid-line-1: rgba(32, 135, 197, 0.09);
  --grid-line-2: rgba(32, 135, 197, 0.04);
}

[data-color-theme="aurora-borealis"] {
  --page-gradient: linear-gradient(190deg, #020c10 0%, #073130 38%, #0a4c47 72%, #042021 100%);
  --hero-glow-left: rgba(31, 235, 207, 0.3);
  --hero-glow-right: rgba(71, 239, 216, 0.16);
  --grid-line-1: rgba(31, 235, 207, 0.09);
  --grid-line-2: rgba(31, 235, 207, 0.04);
}

[data-color-theme="autumn-harvest"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(230, 81, 0, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fffaf6 0%, #fce6d8 48%, #fad8c4 100%);
  --hero-glow-left: rgba(230, 81, 0, 0.24);
  --hero-glow-right: rgba(185, 75, 12, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="autumn-harvest"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(232, 91, 15, 0.26) 0%, transparent 50%), linear-gradient(155deg, #180800 0%, #3f1803 50%, #2a1001 100%);
  --hero-glow-left: rgba(232, 91, 15, 0.28);
  --hero-glow-right: rgba(186, 82, 23, 0.16);
  --grid-line-1: rgba(241, 157, 111, 0.075);
  --grid-line-2: rgba(241, 157, 111, 0.03);
}

[data-color-theme="azure-sky"] {
  --page-gradient: linear-gradient(185deg, #f2f8ff 0%, #d7eafc 40%, #c2dff9 78%, #dfeefd 100%);
  --hero-glow-left: rgba(30, 136, 229, 0.2);
  --hero-glow-right: rgba(71, 157, 234, 0.12);
  --grid-line-1: rgba(30, 136, 229, 0.11);
  --grid-line-2: rgba(30, 136, 229, 0.055);
}

[data-color-theme="azure-sky"][data-theme="dark"] {
  --page-gradient: linear-gradient(190deg, #091a2a 0%, #12314d 38%, #174064 72%, #0e283f 100%);
  --hero-glow-left: rgba(57, 150, 232, 0.3);
  --hero-glow-right: rgba(93, 169, 236, 0.16);
  --grid-line-1: rgba(57, 150, 232, 0.09);
  --grid-line-2: rgba(57, 150, 232, 0.04);
}

[data-color-theme="blood-moon"] {
  --page-gradient: radial-gradient(ellipse 80% 60% at 15% 0%, rgba(255, 61, 0, 0.42) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(255, 84, 31, 0.26) 0%, transparent 50%), linear-gradient(200deg, #190000 0%, #390900 48%, #160000 100%);
  --hero-glow-left: rgba(255, 61, 0, 0.4);
  --hero-glow-right: rgba(255, 84, 31, 0.28);
  --grid-line-1: rgba(255, 61, 0, 0.14);
  --grid-line-2: rgba(255, 84, 31, 0.08);
}

[data-color-theme="candlelight"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(212, 130, 10, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fefdf5 0%, #f9eed8 48%, #f6e4c5 100%);
  --hero-glow-left: rgba(212, 130, 10, 0.24);
  --hero-glow-right: rgba(172, 109, 19, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="candlelight"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(215, 138, 25, 0.26) 0%, transparent 50%), linear-gradient(155deg, #180f00 0%, #3c2605 50%, #291a02 100%);
  --hero-glow-left: rgba(215, 138, 25, 0.28);
  --hero-glow-right: rgba(175, 115, 30, 0.16);
  --grid-line-1: rgba(231, 185, 117, 0.075);
  --grid-line-2: rgba(231, 185, 117, 0.03);
}

[data-color-theme="cherry-blossom"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(194, 24, 91, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fff6f8 0%, #f8dae5 48%, #f3c9d9 100%);
  --hero-glow-left: rgba(194, 24, 91, 0.24);
  --hero-glow-right: rgba(160, 35, 76, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="cherry-noir"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(233, 75, 115, 0.26) 0%, transparent 50%), linear-gradient(155deg, #110007 0%, #390e1b 50%, #230611 100%);
  --hero-glow-left: rgba(233, 75, 115, 0.28);
  --hero-glow-right: rgba(187, 71, 93, 0.16);
  --grid-line-1: rgba(242, 147, 171, 0.075);
  --grid-line-2: rgba(242, 147, 171, 0.03);
}

[data-color-theme="coastal-breeze"] {
  --page-gradient: linear-gradient(185deg, #f2fcff 0%, #d3f0f4 40%, #bbe6ec 78%, #ddf4f8 100%);
  --hero-glow-left: rgba(0, 151, 167, 0.2);
  --hero-glow-right: rgba(46, 170, 183, 0.12);
  --grid-line-1: rgba(0, 151, 167, 0.11);
  --grid-line-2: rgba(0, 151, 167, 0.055);
}

[data-color-theme="coffee-house"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(93, 64, 55, 0.2) 0%, transparent 52%), linear-gradient(155deg, #faf8f6 0%, #e7e2de 48%, #dbd3cf 100%);
  --hero-glow-left: rgba(93, 64, 55, 0.24);
  --hero-glow-right: rgba(89, 63, 51, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="coffee-house"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(103, 75, 67, 0.26) 0%, transparent 50%), linear-gradient(155deg, #1c0d06 0%, #2b1911 50%, #24130b 100%);
  --hero-glow-left: rgba(103, 75, 67, 0.28);
  --hero-glow-right: rgba(96, 71, 59, 0.16);
  --grid-line-1: rgba(164, 147, 142, 0.075);
  --grid-line-2: rgba(164, 147, 142, 0.03);
}

[data-color-theme="copper-craft"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(184, 115, 51, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fff8f3 0%, #f6e8db 48%, #f1ddcc 100%);
  --hero-glow-left: rgba(184, 115, 51, 0.24);
  --hero-glow-right: rgba(153, 99, 48, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="copper-craft"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(188, 123, 63, 0.26) 0%, transparent 50%), linear-gradient(155deg, #1c0b00 0%, #3a200b 50%, #2b1505 100%);
  --hero-glow-left: rgba(188, 123, 63, 0.28);
  --hero-glow-right: rgba(156, 104, 56, 0.16);
  --grid-line-1: rgba(215, 176, 140, 0.075);
  --grid-line-2: rgba(215, 176, 140, 0.03);
}

[data-color-theme="coral-reef"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(230, 74, 25, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fff7f5 0%, #fce1da 48%, #fad4c8 100%);
  --hero-glow-left: rgba(230, 74, 25, 0.24);
  --hero-glow-right: rgba(185, 70, 30, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="coral-reef"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(232, 85, 39, 0.26) 0%, transparent 50%), linear-gradient(155deg, #180700 0%, #3f1607 50%, #2a0e03 100%);
  --hero-glow-left: rgba(232, 85, 39, 0.28);
  --hero-glow-right: rgba(186, 78, 39, 0.16);
  --grid-line-1: rgba(241, 153, 125, 0.075);
  --grid-line-2: rgba(241, 153, 125, 0.03);
}

[data-color-theme="crimson-faith"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(198, 40, 40, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fff6f6 0%, #f8dcdc 48%, #f4cccc 100%);
  --hero-glow-left: rgba(198, 40, 40, 0.24);
  --hero-glow-right: rgba(163, 46, 40, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="crimson-faith"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(201, 53, 53, 0.26) 0%, transparent 50%), linear-gradient(155deg, #180404 0%, #3a0d0d 50%, #280808 100%);
  --hero-glow-left: rgba(201, 53, 53, 0.28);
  --hero-glow-right: rgba(165, 55, 49, 0.16);
  --grid-line-1: rgba(223, 134, 134, 0.075);
  --grid-line-2: rgba(223, 134, 134, 0.03);
}

[data-color-theme="cyberpunk"] {
  --page-gradient: radial-gradient(ellipse 80% 60% at 15% 0%, rgba(0, 255, 255, 0.42) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(31, 255, 255, 0.26) 0%, transparent 50%), linear-gradient(200deg, #050513 0%, #042834 48%, #040411 100%);
  --hero-glow-left: rgba(0, 255, 255, 0.4);
  --hero-glow-right: rgba(31, 255, 255, 0.28);
  --grid-line-1: rgba(0, 255, 255, 0.14);
  --grid-line-2: rgba(31, 255, 255, 0.08);
}

[data-color-theme="deep-space"] {
  --page-gradient: linear-gradient(190deg, #070212 0%, #1d113a 38%, #2d1d56 72%, #130a27 100%);
  --hero-glow-left: rgba(140, 98, 255, 0.3);
  --hero-glow-right: rgba(161, 126, 255, 0.16);
  --grid-line-1: rgba(140, 98, 255, 0.09);
  --grid-line-2: rgba(140, 98, 255, 0.04);
}

[data-color-theme="default"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(140, 75, 47, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fffaf2 0%, #f1e5da 48%, #e8d7ca 100%);
  --hero-glow-left: rgba(140, 75, 47, 0.24);
  --hero-glow-right: rgba(122, 71, 45, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="default"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(147, 86, 59, 0.26) 0%, transparent 50%), linear-gradient(155deg, #271e16 0%, #3d2b1e 50%, #32251b 100%);
  --hero-glow-left: rgba(147, 86, 59, 0.28);
  --hero-glow-right: rgba(127, 78, 53, 0.16);
  --grid-line-1: rgba(190, 154, 137, 0.075);
  --grid-line-2: rgba(190, 154, 137, 0.03);
}

[data-color-theme="desert-bloom"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(194, 96, 58, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fdf6f3 0%, #f6e3dc 48%, #f1d7cd 100%);
  --hero-glow-left: rgba(194, 96, 58, 0.24);
  --hero-glow-right: rgba(160, 85, 53, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="desert-bloom"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(198, 106, 70, 0.26) 0%, transparent 50%), linear-gradient(155deg, #1c0b06 0%, #3c1d12 50%, #2b140b 100%);
  --hero-glow-left: rgba(198, 106, 70, 0.28);
  --hero-glow-right: rgba(163, 92, 61, 0.16);
  --grid-line-1: rgba(221, 166, 144, 0.075);
  --grid-line-2: rgba(221, 166, 144, 0.03);
}

[data-color-theme="ember-glow"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(241, 151, 45, 0.26) 0%, transparent 50%), linear-gradient(155deg, #110704 0%, #3a220b 50%, #241307 100%);
  --hero-glow-left: rgba(241, 151, 45, 0.28);
  --hero-glow-right: rgba(193, 124, 44, 0.16);
  --grid-line-1: rgba(247, 193, 129, 0.075);
  --grid-line-2: rgba(247, 193, 129, 0.03);
}

[data-color-theme="forest-vespers"] {
  --page-gradient: radial-gradient(ellipse 120% 90% at 50% 110%, rgba(120, 195, 124, 0.38) 0%, transparent 58%), radial-gradient(ellipse 70% 50% at 10% 0%, rgba(120, 195, 124, 0.18) 0%, transparent 50%), linear-gradient(150deg, #061109 0%, #142718 42%, #26442a 100%);
  --hero-glow-left: rgba(120, 195, 124, 0.36);
  --hero-glow-right: rgba(102, 166, 105, 0.22);
  --grid-line-1: rgba(120, 195, 124, 0.14);
  --grid-line-2: rgba(120, 195, 124, 0.06);
}

[data-color-theme="fuchsia-faith"] {
  --page-gradient: radial-gradient(ellipse 90% 70% at 10% -10%, rgba(204, 0, 160, 0.26) 0%, transparent 55%), radial-gradient(ellipse 70% 55% at 100% 0%, rgba(219, 77, 189, 0.18) 0%, transparent 50%), linear-gradient(195deg, #fff1fc 0%, #fbddf5 50%, #f7caed 100%);
  --hero-glow-left: rgba(204, 0, 160, 0.26);
  --hero-glow-right: rgba(219, 77, 189, 0.16);
  --grid-line-1: rgba(204, 0, 160, 0.1);
  --grid-line-2: rgba(219, 77, 189, 0.05);
}

[data-color-theme="fuchsia-faith"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 80% 60% at 15% 0%, rgba(204, 0, 160, 0.42) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(210, 31, 171, 0.26) 0%, transparent 50%), linear-gradient(200deg, #1d0017 0%, #36002a 48%, #1a0014 100%);
  --hero-glow-left: rgba(204, 0, 160, 0.4);
  --hero-glow-right: rgba(210, 31, 171, 0.28);
  --grid-line-1: rgba(204, 0, 160, 0.14);
  --grid-line-2: rgba(210, 31, 171, 0.08);
}

[data-color-theme="golden-hour"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(245, 159, 0, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fffdf1 0%, #fef2d3 48%, #fdeac0 100%);
  --hero-glow-left: rgba(245, 159, 0, 0.24);
  --hero-glow-right: rgba(196, 129, 12, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="golden-hour"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(246, 165, 15, 0.26) 0%, transparent 50%), linear-gradient(155deg, #181100 0%, #422c03 50%, #2c1e01 100%);
  --hero-glow-left: rgba(246, 165, 15, 0.28);
  --hero-glow-right: rgba(196, 134, 23, 0.16);
  --grid-line-1: rgba(250, 201, 111, 0.075);
  --grid-line-2: rgba(250, 201, 111, 0.03);
}

[data-color-theme="graphite"] {
  --page-gradient: linear-gradient(180deg, #f5f5f7 0%, #eeeef0 58%, #e4e4e6 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(74, 78, 88, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="graphite"][data-theme="dark"] {
  --page-gradient: linear-gradient(180deg, #181a1f 0%, #24252a 58%, #2f3135 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(155, 158, 163, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="hot-pink"] {
  --page-gradient: radial-gradient(ellipse 90% 70% at 10% -10%, rgba(233, 30, 140, 0.26) 0%, transparent 55%), radial-gradient(ellipse 70% 55% at 100% 0%, rgba(240, 98, 175, 0.18) 0%, transparent 50%), linear-gradient(195deg, #fff6fa 0%, #fde4f1 50%, #fbd3e8 100%);
  --hero-glow-left: rgba(233, 30, 140, 0.26);
  --hero-glow-right: rgba(240, 98, 175, 0.16);
  --grid-line-1: rgba(233, 30, 140, 0.1);
  --grid-line-2: rgba(240, 98, 175, 0.05);
}

[data-color-theme="hot-pink"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 80% 60% at 15% 0%, rgba(233, 30, 140, 0.42) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(236, 57, 154, 0.26) 0%, transparent 50%), linear-gradient(200deg, #190010 0%, #360421 48%, #16000e 100%);
  --hero-glow-left: rgba(233, 30, 140, 0.4);
  --hero-glow-right: rgba(236, 57, 154, 0.28);
  --grid-line-1: rgba(233, 30, 140, 0.14);
  --grid-line-2: rgba(236, 57, 154, 0.08);
}

[data-color-theme="indigo-depths"] {
  --page-gradient: linear-gradient(185deg, #f2f2ff 0%, #dad9f4 40%, #c7c6eb 78%, #e1e1f8 100%);
  --hero-glow-left: rgba(55, 48, 163, 0.2);
  --hero-glow-right: rgba(91, 85, 180, 0.12);
  --grid-line-1: rgba(55, 48, 163, 0.11);
  --grid-line-2: rgba(55, 48, 163, 0.055);
}

[data-color-theme="indigo-depths"][data-theme="dark"] {
  --page-gradient: linear-gradient(190deg, #0c0b28 0%, #181642 38%, #201d52 72%, #131138 100%);
  --hero-glow-left: rgba(79, 73, 174, 0.3);
  --hero-glow-right: rgba(111, 106, 189, 0.16);
  --grid-line-1: rgba(79, 73, 174, 0.09);
  --grid-line-2: rgba(79, 73, 174, 0.04);
}

[data-color-theme="inkwood"] {
  --page-gradient: radial-gradient(ellipse 120% 90% at 50% 110%, rgba(141, 167, 131, 0.38) 0%, transparent 58%), radial-gradient(ellipse 70% 50% at 10% 0%, rgba(141, 167, 131, 0.18) 0%, transparent 50%), linear-gradient(150deg, #070d09 0%, #182019 42%, #2d392c 100%);
  --hero-glow-left: rgba(141, 167, 131, 0.36);
  --hero-glow-right: rgba(120, 142, 111, 0.22);
  --grid-line-1: rgba(141, 167, 131, 0.14);
  --grid-line-2: rgba(141, 167, 131, 0.06);
}

[data-color-theme="ivory-grace"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(160, 120, 80, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fffcf6 0%, #f4ece1 48%, #ece2d4 100%);
  --hero-glow-left: rgba(160, 120, 80, 0.24);
  --hero-glow-right: rgba(136, 102, 68, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="lavender-grace"] {
  --page-gradient: radial-gradient(circle at 15% 0%, rgba(126, 87, 194, 0.2) 0%, transparent 45%), radial-gradient(circle at 95% 20%, rgba(154, 124, 207, 0.14) 0%, transparent 42%), linear-gradient(205deg, #f9f5fe 0%, #e9e1f7 55%, #f1ebfa 100%);
  --hero-glow-left: rgba(126, 87, 194, 0.22);
  --hero-glow-right: rgba(154, 124, 207, 0.12);
  --grid-line-1: rgba(126, 87, 194, 0.085);
  --grid-line-2: rgba(126, 87, 194, 0.045);
}

[data-color-theme="lavender-grace"][data-theme="dark"] {
  --page-gradient: radial-gradient(circle at 20% 0%, rgba(139, 104, 200, 0.32) 0%, transparent 42%), radial-gradient(circle at 100% 30%, rgba(160, 131, 210, 0.16) 0%, transparent 40%), linear-gradient(210deg, #17092b 0%, #331f51 55%, #1a0a30 100%);
  --hero-glow-left: rgba(139, 104, 200, 0.32);
  --hero-glow-right: rgba(165, 137, 212, 0.18);
  --grid-line-1: rgba(139, 104, 200, 0.1);
  --grid-line-2: rgba(139, 104, 200, 0.04);
}

[data-color-theme="linen-sunlit"] {
  --page-gradient: linear-gradient(180deg, #ffffff 0%, #f7f7f7 58%, #ededed 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(69, 90, 100, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="marigold"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(245, 168, 0, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fffde9 0%, #fef3cc 48%, #fdecba 100%);
  --hero-glow-left: rgba(245, 168, 0, 0.24);
  --hero-glow-right: rgba(196, 136, 12, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="midnight-cathedral"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(215, 180, 67, 0.26) 0%, transparent 50%), linear-gradient(155deg, #091326 0%, #2f322e 50%, #1a222b 100%);
  --hero-glow-left: rgba(215, 180, 67, 0.28);
  --hero-glow-right: rgba(175, 144, 59, 0.16);
  --grid-line-1: rgba(231, 210, 142, 0.075);
  --grid-line-2: rgba(231, 210, 142, 0.03);
}

[data-color-theme="mint-fresh"] {
  --page-gradient: radial-gradient(ellipse 90% 70% at 80% 100%, rgba(0, 176, 155, 0.18) 0%, transparent 55%), linear-gradient(145deg, #f1fff9 0%, #d8f7ef 46%, #bbeee4 100%);
  --hero-glow-left: rgba(0, 176, 155, 0.2);
  --hero-glow-right: rgba(0, 150, 132, 0.12);
  --grid-line-1: rgba(0, 176, 155, 0.1);
  --grid-line-2: rgba(0, 176, 155, 0.05);
}

[data-color-theme="mint-fresh"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 120% 90% at 50% 110%, rgba(31, 185, 167, 0.38) 0%, transparent 58%), radial-gradient(ellipse 70% 50% at 10% 0%, rgba(31, 185, 167, 0.18) 0%, transparent 50%), linear-gradient(150deg, #001c16 0%, #043129 42%, #094940 100%);
  --hero-glow-left: rgba(31, 185, 167, 0.36);
  --hero-glow-right: rgba(26, 157, 142, 0.22);
  --grid-line-1: rgba(31, 185, 167, 0.14);
  --grid-line-2: rgba(31, 185, 167, 0.06);
}

[data-color-theme="monochrome"] {
  --page-gradient: linear-gradient(180deg, #ffffff 0%, #f7f7f7 58%, #ededed 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(34, 34, 34, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="monochrome"][data-theme="dark"] {
  --page-gradient: linear-gradient(180deg, #101010 0%, #1c1c1c 58%, #282828 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(133, 133, 133, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="morning-mist"] {
  --page-gradient: linear-gradient(180deg, #f8fbff 0%, #f1f3f7 58%, #e7e9ed 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(107, 143, 168, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="neon-sermon"] {
  --page-gradient: radial-gradient(ellipse 80% 60% at 15% 0%, rgba(224, 64, 251, 0.42) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(228, 87, 251, 0.26) 0%, transparent 50%), linear-gradient(200deg, #0a000f 0%, #280930 48%, #09000d 100%);
  --hero-glow-left: rgba(224, 64, 251, 0.4);
  --hero-glow-right: rgba(228, 87, 251, 0.28);
  --grid-line-1: rgba(224, 64, 251, 0.14);
  --grid-line-2: rgba(228, 87, 251, 0.08);
}

[data-color-theme="neon-tokyo"] {
  --page-gradient: radial-gradient(ellipse 80% 60% at 15% 0%, rgba(212, 255, 0, 0.42) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(217, 255, 31, 0.26) 0%, transparent 50%), linear-gradient(200deg, #06080f 0%, #232b0d 48%, #05070d 100%);
  --hero-glow-left: rgba(212, 255, 0, 0.4);
  --hero-glow-right: rgba(217, 255, 31, 0.28);
  --grid-line-1: rgba(212, 255, 0, 0.14);
  --grid-line-2: rgba(217, 255, 31, 0.08);
}

[data-color-theme="northern-lights"] {
  --page-gradient: linear-gradient(190deg, #04070c 0%, #082b27 38%, #0c443a 72%, #06191b 100%);
  --hero-glow-left: rgba(31, 224, 171, 0.3);
  --hero-glow-right: rgba(71, 230, 186, 0.16);
  --grid-line-1: rgba(31, 224, 171, 0.09);
  --grid-line-2: rgba(31, 224, 171, 0.04);
}

[data-color-theme="ocean-executive"] {
  --page-gradient: linear-gradient(185deg, #f4faff 0%, #d8e7f7 40%, #c2d8f1 78%, #e1edfa 100%);
  --hero-glow-left: rgba(21, 101, 192, 0.2);
  --hero-glow-right: rgba(63, 129, 203, 0.12);
  --grid-line-1: rgba(21, 101, 192, 0.11);
  --grid-line-2: rgba(21, 101, 192, 0.055);
}

[data-color-theme="ocean-executive"][data-theme="dark"] {
  --page-gradient: linear-gradient(190deg, #0b1b35 0%, #132d52 38%, #173863 72%, #102647 100%);
  --hero-glow-left: rgba(49, 119, 200, 0.3);
  --hero-glow-right: rgba(86, 143, 210, 0.16);
  --grid-line-1: rgba(49, 119, 200, 0.09);
  --grid-line-2: rgba(49, 119, 200, 0.04);
}

[data-color-theme="olive-grove"] {
  --page-gradient: radial-gradient(ellipse 90% 70% at 80% 100%, rgba(123, 140, 74, 0.18) 0%, transparent 55%), linear-gradient(145deg, #f9f9f1 0%, #eceddf 46%, #dde0cb 100%);
  --hero-glow-left: rgba(123, 140, 74, 0.2);
  --hero-glow-right: rgba(105, 119, 63, 0.12);
  --grid-line-1: rgba(123, 140, 74, 0.1);
  --grid-line-2: rgba(123, 140, 74, 0.05);
}

[data-color-theme="olive-grove"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 120% 90% at 50% 110%, rgba(139, 154, 96, 0.38) 0%, transparent 58%), radial-gradient(ellipse 70% 50% at 10% 0%, rgba(139, 154, 96, 0.18) 0%, transparent 50%), linear-gradient(150deg, #181a07 0%, #282b13 42%, #3a3f21 100%);
  --hero-glow-left: rgba(139, 154, 96, 0.36);
  --hero-glow-right: rgba(118, 131, 82, 0.22);
  --grid-line-1: rgba(139, 154, 96, 0.14);
  --grid-line-2: rgba(139, 154, 96, 0.06);
}

[data-color-theme="papyrus-script"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(74, 56, 32, 0.2) 0%, transparent 52%), linear-gradient(155deg, #f6efde 0%, #e0d8c5 48%, #d3cab6 100%);
  --hero-glow-left: rgba(74, 56, 32, 0.24);
  --hero-glow-right: rgba(76, 57, 34, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="peach-blossom"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(224, 112, 48, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fffaf6 0%, #fbe9dd 48%, #f9dece 100%);
  --hero-glow-left: rgba(224, 112, 48, 0.24);
  --hero-glow-right: rgba(181, 96, 46, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="pine-grove"] {
  --page-gradient: radial-gradient(ellipse 90% 70% at 80% 100%, rgba(46, 108, 62, 0.18) 0%, transparent 55%), linear-gradient(145deg, #f3f9f5 0%, #deeae2 46%, #c7d9cc 100%);
  --hero-glow-left: rgba(46, 108, 62, 0.2);
  --hero-glow-right: rgba(39, 92, 53, 0.12);
  --grid-line-1: rgba(46, 108, 62, 0.1);
  --grid-line-2: rgba(46, 108, 62, 0.05);
}

[data-color-theme="pine-grove"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 120% 90% at 50% 110%, rgba(71, 126, 85, 0.38) 0%, transparent 58%), radial-gradient(ellipse 70% 50% at 10% 0%, rgba(71, 126, 85, 0.18) 0%, transparent 50%), linear-gradient(150deg, #091a0f 0%, #112818 42%, #1b3723 100%);
  --hero-glow-left: rgba(71, 126, 85, 0.36);
  --hero-glow-right: rgba(60, 107, 72, 0.22);
  --grid-line-1: rgba(71, 126, 85, 0.14);
  --grid-line-2: rgba(71, 126, 85, 0.06);
}

[data-color-theme="plum-twilight"] {
  --page-gradient: linear-gradient(185deg, #f9f3fc 0%, #ebddf3 40%, #e1cceb 78%, #f0e4f6 100%);
  --hero-glow-left: rgba(142, 68, 173, 0.2);
  --hero-glow-right: rgba(162, 102, 188, 0.12);
  --grid-line-1: rgba(142, 68, 173, 0.11);
  --grid-line-2: rgba(142, 68, 173, 0.055);
}

[data-color-theme="plum-twilight"][data-theme="dark"] {
  --page-gradient: linear-gradient(190deg, #13071c 0%, #2b1538 38%, #3c1f4a 72%, #210f2c 100%);
  --hero-glow-left: rgba(156, 90, 183, 0.3);
  --hero-glow-right: rgba(174, 120, 196, 0.16);
  --grid-line-1: rgba(156, 90, 183, 0.09);
  --grid-line-2: rgba(156, 90, 183, 0.04);
}

[data-color-theme="quarry-stone"] {
  --page-gradient: linear-gradient(180deg, #f4f5f7 0%, #edeef0 58%, #e3e4e6 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(91, 103, 122, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="quarry-stone"][data-theme="dark"] {
  --page-gradient: linear-gradient(180deg, #1d212c 0%, #282c37 58%, #343741 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(165, 171, 182, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="renaissance"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(139, 28, 58, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fdf6f1 0%, #efdbda 48%, #e6cacc 100%);
  --hero-glow-left: rgba(139, 28, 58, 0.24);
  --hero-glow-right: rgba(121, 38, 53, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="renaissance"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(146, 42, 70, 0.26) 0%, transparent 50%), linear-gradient(155deg, #1c070f 0%, #330e1a 50%, #270b14 100%);
  --hero-glow-left: rgba(146, 42, 70, 0.28);
  --hero-glow-right: rgba(126, 47, 61, 0.16);
  --grid-line-1: rgba(190, 127, 144, 0.075);
  --grid-line-2: rgba(190, 127, 144, 0.03);
}

[data-color-theme="retro-arcade"] {
  --page-gradient: radial-gradient(ellipse 80% 60% at 15% 0%, rgba(57, 255, 20, 0.42) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(81, 255, 48, 0.26) 0%, transparent 50%), linear-gradient(200deg, #0b051f 0%, #11281d 48%, #0a041b 100%);
  --hero-glow-left: rgba(57, 255, 20, 0.4);
  --hero-glow-right: rgba(81, 255, 48, 0.28);
  --grid-line-1: rgba(57, 255, 20, 0.14);
  --grid-line-2: rgba(81, 255, 48, 0.08);
}

[data-color-theme="rose-garden"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(232, 96, 138, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fff5f7 0%, #fce2e9 48%, #fad6e0 100%);
  --hero-glow-left: rgba(232, 96, 138, 0.24);
  --hero-glow-right: rgba(186, 85, 109, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="rose-garden"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(233, 106, 145, 0.26) 0%, transparent 50%), linear-gradient(155deg, #18070f 0%, #3f1a27 50%, #2b101a 100%);
  --hero-glow-left: rgba(233, 106, 145, 0.28);
  --hero-glow-right: rgba(187, 92, 114, 0.16);
  --grid-line-1: rgba(242, 166, 189, 0.075);
  --grid-line-2: rgba(242, 166, 189, 0.03);
}

[data-color-theme="royal-purple"] {
  --page-gradient: radial-gradient(circle at 15% 0%, rgba(106, 27, 154, 0.2) 0%, transparent 45%), radial-gradient(circle at 95% 20%, rgba(139, 77, 176, 0.14) 0%, transparent 42%), linear-gradient(205deg, #faf3fe 0%, #e9d8f2 55%, #f1e5f8 100%);
  --hero-glow-left: rgba(106, 27, 154, 0.22);
  --hero-glow-right: rgba(139, 77, 176, 0.12);
  --grid-line-1: rgba(106, 27, 154, 0.085);
  --grid-line-2: rgba(106, 27, 154, 0.045);
}

[data-color-theme="royal-purple"][data-theme="dark"] {
  --page-gradient: radial-gradient(circle at 20% 0%, rgba(121, 50, 164, 0.32) 0%, transparent 42%), radial-gradient(circle at 100% 30%, rgba(145, 87, 180, 0.16) 0%, transparent 40%), linear-gradient(210deg, #170731 0%, #2f114e 55%, #1a0836 100%);
  --hero-glow-left: rgba(121, 50, 164, 0.32);
  --hero-glow-right: rgba(150, 95, 184, 0.18);
  --grid-line-1: rgba(121, 50, 164, 0.1);
  --grid-line-2: rgba(121, 50, 164, 0.04);
}

[data-color-theme="saffron-spice"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(212, 140, 0, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fefae9 0%, #f9edcc 48%, #f6e4ba 100%);
  --hero-glow-left: rgba(212, 140, 0, 0.24);
  --hero-glow-right: rgba(172, 116, 12, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="saffron-spice"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(215, 147, 15, 0.26) 0%, transparent 50%), linear-gradient(155deg, #181100 0%, #3c2903 50%, #291c01 100%);
  --hero-glow-left: rgba(215, 147, 15, 0.28);
  --hero-glow-right: rgba(175, 121, 23, 0.16);
  --grid-line-1: rgba(231, 190, 111, 0.075);
  --grid-line-2: rgba(231, 190, 111, 0.03);
}

[data-color-theme="sage-chapel"] {
  --page-gradient: radial-gradient(ellipse 90% 70% at 80% 100%, rgba(58, 110, 66, 0.18) 0%, transparent 55%), linear-gradient(145deg, #f3f9f3 0%, #e0eae0 46%, #cadacb 100%);
  --hero-glow-left: rgba(58, 110, 66, 0.2);
  --hero-glow-right: rgba(49, 94, 56, 0.12);
  --grid-line-1: rgba(58, 110, 66, 0.1);
  --grid-line-2: rgba(58, 110, 66, 0.05);
}

[data-color-theme="sage-chapel"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 120% 90% at 50% 110%, rgba(82, 127, 89, 0.38) 0%, transparent 58%), radial-gradient(ellipse 70% 50% at 10% 0%, rgba(82, 127, 89, 0.18) 0%, transparent 50%), linear-gradient(150deg, #192a1b 0%, #223824 42%, #2a452e 100%);
  --hero-glow-left: rgba(82, 127, 89, 0.36);
  --hero-glow-right: rgba(70, 108, 76, 0.22);
  --grid-line-1: rgba(82, 127, 89, 0.14);
  --grid-line-2: rgba(82, 127, 89, 0.06);
}

[data-color-theme="sand-dune"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(196, 148, 90, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fffbf5 0%, #f8efe2 48%, #f3e6d5 100%);
  --hero-glow-left: rgba(196, 148, 90, 0.24);
  --hero-glow-right: rgba(161, 122, 75, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="sand-dune"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(200, 154, 100, 0.26) 0%, transparent 50%), linear-gradient(155deg, #180f00 0%, #392912 50%, #281b08 100%);
  --hero-glow-left: rgba(200, 154, 100, 0.28);
  --hero-glow-right: rgba(164, 126, 82, 0.16);
  --grid-line-1: rgba(222, 194, 162, 0.075);
  --grid-line-2: rgba(222, 194, 162, 0.03);
}

[data-color-theme="sapphire-lectionary"] {
  --page-gradient: linear-gradient(185deg, #f5f8fc 0%, #dae2ef 40%, #c5d1e3 78%, #e3e9f3 100%);
  --hero-glow-left: rgba(30, 74, 140, 0.2);
  --hero-glow-right: rgba(71, 107, 161, 0.12);
  --grid-line-1: rgba(30, 74, 140, 0.11);
  --grid-line-2: rgba(30, 74, 140, 0.055);
}

[data-color-theme="sapphire-lectionary"][data-theme="dark"] {
  --page-gradient: linear-gradient(190deg, #121d36 0%, #1a2b4c 38%, #1e3357 72%, #172644 100%);
  --hero-glow-left: rgba(57, 96, 154, 0.3);
  --hero-glow-right: rgba(93, 125, 172, 0.16);
  --grid-line-1: rgba(57, 96, 154, 0.09);
  --grid-line-2: rgba(57, 96, 154, 0.04);
}

[data-color-theme="sepia-memoir"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(107, 76, 42, 0.2) 0%, transparent 52%), linear-gradient(155deg, #f8f1e2 0%, #e7dcca 48%, #dccfbc 100%);
  --hero-glow-left: rgba(107, 76, 42, 0.24);
  --hero-glow-right: rgba(99, 71, 41, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="slate-clean"] {
  --page-gradient: linear-gradient(180deg, #fafafa 0%, #f3f3f3 58%, #e9e9e9 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(69, 90, 100, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="slate-clean"][data-theme="dark"] {
  --page-gradient: linear-gradient(180deg, #181d1f 0%, #24282a 58%, #2f3435 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(153, 164, 170, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="solar-flare"] {
  --page-gradient: radial-gradient(ellipse 90% 70% at 10% -10%, rgba(232, 93, 4, 0.26) 0%, transparent 55%), radial-gradient(ellipse 70% 55% at 100% 0%, rgba(239, 142, 79, 0.18) 0%, transparent 50%), linear-gradient(195deg, #fff9f1 0%, #fdeddd 50%, #fbe0ca 100%);
  --hero-glow-left: rgba(232, 93, 4, 0.26);
  --hero-glow-right: rgba(239, 142, 79, 0.16);
  --grid-line-1: rgba(232, 93, 4, 0.1);
  --grid-line-2: rgba(239, 142, 79, 0.05);
}

[data-color-theme="solar-flare"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 80% 60% at 15% 0%, rgba(232, 93, 4, 0.42) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(235, 112, 34, 0.26) 0%, transparent 50%), linear-gradient(200deg, #190800 0%, #361401 48%, #160700 100%);
  --hero-glow-left: rgba(232, 93, 4, 0.4);
  --hero-glow-right: rgba(235, 112, 34, 0.28);
  --grid-line-1: rgba(232, 93, 4, 0.14);
  --grid-line-2: rgba(235, 112, 34, 0.08);
}

[data-color-theme="spring-meadow"] {
  --page-gradient: radial-gradient(ellipse 90% 70% at 80% 100%, rgba(122, 173, 58, 0.18) 0%, transparent 55%), linear-gradient(145deg, #fafff3 0%, #edf7e0 46%, #deedca 100%);
  --hero-glow-left: rgba(122, 173, 58, 0.2);
  --hero-glow-right: rgba(104, 147, 49, 0.12);
  --grid-line-1: rgba(122, 173, 58, 0.1);
  --grid-line-2: rgba(122, 173, 58, 0.05);
}

[data-color-theme="steel-resolve"] {
  --page-gradient: linear-gradient(180deg, #f2f4f6 0%, #ebedef 58%, #e1e3e5 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(61, 81, 102, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="steel-resolve"][data-theme="dark"] {
  --page-gradient: linear-gradient(180deg, #0d161d 0%, #192228 58%, #252d34 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(148, 159, 171, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="storm-grey"] {
  --page-gradient: linear-gradient(180deg, #f4f6f8 0%, #edeff1 58%, #e3e5e7 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(96, 125, 139, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="storm-grey"][data-theme="dark"] {
  --page-gradient: linear-gradient(180deg, #181f25 0%, #242a30 58%, #2f353b 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(168, 184, 191, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="sunset-revival"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(233, 30, 99, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fff8f7 0%, #fcdee4 48%, #fbccd9 100%);
  --hero-glow-left: rgba(233, 30, 99, 0.24);
  --hero-glow-right: rgba(187, 39, 81, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="sunset-revival"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(234, 44, 108, 0.26) 0%, transparent 50%), linear-gradient(155deg, #180507 0%, #3f0c1a 50%, #2b0810 100%);
  --hero-glow-left: rgba(234, 44, 108, 0.28);
  --hero-glow-right: rgba(188, 49, 88, 0.16);
  --grid-line-1: rgba(242, 128, 167, 0.075);
  --grid-line-2: rgba(242, 128, 167, 0.03);
}

[data-color-theme="tangerine-dream"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(240, 96, 16, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fff8f1 0%, #fde6d5 48%, #fcdac3 100%);
  --hero-glow-left: rgba(240, 96, 16, 0.24);
  --hero-glow-right: rgba(192, 85, 23, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="teal-modern"] {
  --page-gradient: linear-gradient(185deg, #f2fbfb 0%, #d3edeb 40%, #bbe2de 78%, #ddf2f0 100%);
  --hero-glow-left: rgba(0, 137, 123, 0.2);
  --hero-glow-right: rgba(46, 158, 147, 0.12);
  --grid-line-1: rgba(0, 137, 123, 0.11);
  --grid-line-2: rgba(0, 137, 123, 0.055);
}

[data-color-theme="teal-modern"][data-theme="dark"] {
  --page-gradient: linear-gradient(190deg, #00201c 0%, #053631 38%, #09443e 72%, #022d29 100%);
  --hero-glow-left: rgba(31, 151, 139, 0.3);
  --hero-glow-right: rgba(71, 170, 160, 0.16);
  --grid-line-1: rgba(31, 151, 139, 0.09);
  --grid-line-2: rgba(31, 151, 139, 0.04);
}

[data-color-theme="terracotta-sun"] {
  --page-gradient: radial-gradient(ellipse 90% 60% at 0% 0%, rgba(196, 94, 42, 0.2) 0%, transparent 52%), linear-gradient(155deg, #fdf5ef 0%, #f6e2d6 48%, #f2d6c7 100%);
  --hero-glow-left: rgba(196, 94, 42, 0.24);
  --hero-glow-right: rgba(161, 84, 41, 0.12);
  --grid-line-1: rgba(255, 255, 255, 0.28);
  --grid-line-2: rgba(255, 255, 255, 0.14);
}

[data-color-theme="terracotta-sun"][data-theme="dark"] {
  --page-gradient: radial-gradient(ellipse 85% 55% at 0% 0%, rgba(200, 104, 55, 0.26) 0%, transparent 50%), linear-gradient(155deg, #270f06 0%, #46200f 50%, #37170a 100%);
  --hero-glow-left: rgba(200, 104, 55, 0.28);
  --hero-glow-right: rgba(164, 91, 51, 0.16);
  --grid-line-1: rgba(222, 164, 135, 0.075);
  --grid-line-2: rgba(222, 164, 135, 0.03);
}

[data-color-theme="twilight-prayer"] {
  --page-gradient: linear-gradient(190deg, #070513 0%, #1b1e36 38%, #2a304e 72%, #121226 100%);
  --hero-glow-left: rgba(129, 157, 221, 0.3);
  --hero-glow-right: rgba(152, 175, 227, 0.16);
  --grid-line-1: rgba(129, 157, 221, 0.09);
  --grid-line-2: rgba(129, 157, 221, 0.04);
}

[data-color-theme="velvet-night"] {
  --page-gradient: radial-gradient(circle at 20% 0%, rgba(184, 117, 234, 0.32) 0%, transparent 42%), radial-gradient(circle at 100% 30%, rgba(197, 142, 238, 0.16) 0%, transparent 40%), linear-gradient(210deg, #0d0716 0%, #332046 55%, #0e0818 100%);
  --hero-glow-left: rgba(184, 117, 234, 0.32);
  --hero-glow-right: rgba(200, 147, 239, 0.18);
  --grid-line-1: rgba(184, 117, 234, 0.1);
  --grid-line-2: rgba(184, 117, 234, 0.04);
}

[data-color-theme="void-scripture"] {
  --page-gradient: linear-gradient(180deg, #060606 0%, #121212 58%, #1f1f1f 100%);
  --hero-glow-left: transparent;
  --hero-glow-right: transparent;
  --grid-line-1: rgba(225, 216, 199, 0.045);
  --grid-line-2: transparent;
}

[data-color-theme="volcanic-rock"] {
  --page-gradient: radial-gradient(ellipse 80% 60% at 15% 0%, rgba(255, 87, 34, 0.42) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(255, 107, 61, 0.26) 0%, transparent 50%), linear-gradient(200deg, #191513 0%, #391e15 48%, #161211 100%);
  --hero-glow-left: rgba(255, 87, 34, 0.4);
  --hero-glow-right: rgba(255, 107, 61, 0.28);
  --grid-line-1: rgba(255, 87, 34, 0.14);
  --grid-line-2: rgba(255, 107, 61, 0.08);
}

[data-color-theme="arctic-frost"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="arctic-frost"][data-theme="dark"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="aurora-borealis"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="azure-sky"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="azure-sky"][data-theme="dark"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="blood-moon"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="coastal-breeze"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="cyberpunk"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="deep-space"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="forest-vespers"] body::before {
  background-image: radial-gradient(var(--grid-line-1) 1.35px, transparent 1.35px);
  background-size: 20px 20px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 88%);
}

[data-color-theme="fuchsia-faith"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="fuchsia-faith"][data-theme="dark"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="graphite"] body::before { display: none; }

[data-color-theme="graphite"][data-theme="dark"] body::before { display: none; }

[data-color-theme="hot-pink"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="hot-pink"][data-theme="dark"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="indigo-depths"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="indigo-depths"][data-theme="dark"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="inkwood"] body::before {
  background-image: radial-gradient(var(--grid-line-1) 1.35px, transparent 1.35px);
  background-size: 20px 20px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 88%);
}

[data-color-theme="lavender-grace"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="lavender-grace"][data-theme="dark"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="linen-sunlit"] body::before { display: none; }

[data-color-theme="mint-fresh"] body::before {
  background-image: radial-gradient(var(--grid-line-1) 1.35px, transparent 1.35px);
  background-size: 20px 20px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 88%);
}

[data-color-theme="mint-fresh"][data-theme="dark"] body::before {
  background-image: radial-gradient(var(--grid-line-1) 1.35px, transparent 1.35px);
  background-size: 20px 20px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 88%);
}

[data-color-theme="monochrome"] body::before { display: none; }

[data-color-theme="monochrome"][data-theme="dark"] body::before { display: none; }

[data-color-theme="morning-mist"] body::before { display: none; }

[data-color-theme="neon-sermon"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="neon-tokyo"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="northern-lights"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="ocean-executive"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="ocean-executive"][data-theme="dark"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="olive-grove"] body::before {
  background-image: radial-gradient(var(--grid-line-1) 1.35px, transparent 1.35px);
  background-size: 20px 20px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 88%);
}

[data-color-theme="olive-grove"][data-theme="dark"] body::before {
  background-image: radial-gradient(var(--grid-line-1) 1.35px, transparent 1.35px);
  background-size: 20px 20px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 88%);
}

[data-color-theme="pine-grove"] body::before {
  background-image: radial-gradient(var(--grid-line-1) 1.35px, transparent 1.35px);
  background-size: 20px 20px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 88%);
}

[data-color-theme="pine-grove"][data-theme="dark"] body::before {
  background-image: radial-gradient(var(--grid-line-1) 1.35px, transparent 1.35px);
  background-size: 20px 20px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 88%);
}

[data-color-theme="plum-twilight"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="plum-twilight"][data-theme="dark"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="quarry-stone"] body::before { display: none; }

[data-color-theme="quarry-stone"][data-theme="dark"] body::before { display: none; }

[data-color-theme="retro-arcade"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="royal-purple"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="royal-purple"][data-theme="dark"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="sage-chapel"] body::before {
  background-image: radial-gradient(var(--grid-line-1) 1.35px, transparent 1.35px);
  background-size: 20px 20px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 88%);
}

[data-color-theme="sage-chapel"][data-theme="dark"] body::before {
  background-image: radial-gradient(var(--grid-line-1) 1.35px, transparent 1.35px);
  background-size: 20px 20px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 88%);
}

[data-color-theme="sapphire-lectionary"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="sapphire-lectionary"][data-theme="dark"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="slate-clean"] body::before { display: none; }

[data-color-theme="slate-clean"][data-theme="dark"] body::before { display: none; }

[data-color-theme="solar-flare"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="solar-flare"][data-theme="dark"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="spring-meadow"] body::before {
  background-image: radial-gradient(var(--grid-line-1) 1.35px, transparent 1.35px);
  background-size: 20px 20px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 88%);
}

[data-color-theme="steel-resolve"] body::before { display: none; }

[data-color-theme="steel-resolve"][data-theme="dark"] body::before { display: none; }

[data-color-theme="storm-grey"] body::before { display: none; }

[data-color-theme="storm-grey"][data-theme="dark"] body::before { display: none; }

[data-color-theme="teal-modern"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="teal-modern"][data-theme="dark"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="twilight-prayer"] body::before {
  background-image:
    linear-gradient(var(--grid-line-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-2) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 90%);
}

[data-color-theme="velvet-night"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}

[data-color-theme="void-scripture"] body::before { display: none; }

[data-color-theme="volcanic-rock"] body::before {
  background-image:
    repeating-linear-gradient(-32deg, var(--grid-line-1) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(32deg, var(--grid-line-2) 0 1px, transparent 1px 18px);
  background-size: auto;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 80%);
}
`;
  document.head.appendChild(style);
})();
