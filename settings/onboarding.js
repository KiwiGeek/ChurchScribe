window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createOnboarding = (deps) => {
  const {
    onboardingDialog,
    onboardingStepKicker,
    onboardingStepTitle,
    onboardingStepCopy,
    onboardingStepPoints,
    onboardingStepCallout,
    onboardingStepCounter,
    onboardingStepDots,
    onboardingProgress,
    onboardingBackButton,
    onboardingNextButton,
    onboardingFinishButton,
    openDialog,
    writeStoredValue,
    onboardingStorageKey
  } = deps;

  const onboardingSteps = [
    {
      kicker: "Welcome",
      title: "Scriptoria keeps your entries on your device",
      copy: "Scriptoria is designed to feel lightweight and private. Your entries live in your browser on your own computer unless you explicitly connect a sync & backup provider.",
      points: [
        "Nothing is automatically sent to a server run by Scriptoria.",
        "You stay in control of when and where any backups or sync copies are created.",
        "You can clear or export your library later from Settings if you ever need to."
      ],
      callout: "Good to know: the default experience is local-first and privacy-friendly."
    },
    {
      kicker: "Taking Notes",
      title: "The note editor works like a focused writing surface",
      copy: "Each entry is its own editable document. Use the toolbar for quick formatting, lists, headings, quotes, images, and tables while you capture sermon points, study entries, or prayer requests.",
      points: [
        "The main entry area saves locally as you type.",
        "Use the library to jump between entries when your library grows.",
        "Formatting is intentionally simple so you can stay in the flow during live note-taking."
      ],
      callout: "Tip: the app is optimized for desktop and tablet use, especially during active note-taking."
    },
    {
      kicker: "Scripture Linking",
      title: "Verse references are matched automatically",
      copy: "When you type a Bible reference in your entries, Scriptoria tries to recognize it and turn it into a clickable scripture link automatically.",
      points: [
        "Matched references can jump you straight to the passage in the Scripture Panel.",
        "Common abbreviations are supported, and you can fine-tune them in Settings.",
        "Copying verses from the Scripture Panel keeps useful formatting like emphasis where possible."
      ],
      callout: "If a book abbreviation is unusual in your church context, check the Scripture Abbreviations section in Settings."
    },
    {
      kicker: "Entry Types",
      title: "Entry types shape the details attached to each entry",
      copy: "Scriptoria lets you define entry types such as sermon notes, Bible studies, Sabbath School, or anything else you need. Each type can have its own detail fields.",
      points: [
        "Use Settings → Entry Types to add, rename, or adjust entry types.",
        "Detail fields can be customized to match the information you track most often.",
        "The entry details dialog lets you switch an entry to a different type when that actually matters."
      ],
      callout: "This is one of the app’s best customization points: shape the library around your ministry context."
    },
    {
      kicker: "Make It Yours",
      title: "Explore themes and optional cloud sync next",
      copy: "Once the basics feel comfortable, check out the color themes and display settings, then consider connecting sync & backup if you want another copy of your entries outside this device.",
      points: [
        "Themes and layout settings can make the app feel much more personal.",
        "Sync & Backup is optional, but useful if you want backup or cross-device workflows.",
        "You can reopen this tutorial any time from Settings → About."
      ],
      callout: "Recommended next steps: try a different theme, review your entry types, and then decide whether cloud sync is worth setting up."
    }
  ];

  let activeOnboardingStepIndex = 0;

  const renderOnboardingStep = () => {
    const step = onboardingSteps[activeOnboardingStepIndex];

    onboardingStepKicker.textContent = step.kicker;
    onboardingStepTitle.textContent = step.title;
    onboardingStepCopy.textContent = step.copy;
    onboardingStepCallout.textContent = step.callout;
    onboardingStepCounter.textContent = `Step ${activeOnboardingStepIndex + 1}`;
    onboardingStepPoints.innerHTML = "";
    onboardingStepDots.innerHTML = "";

    step.points.forEach((point, index) => {
      const item = document.createElement("li");
      const badge = document.createElement("span");
      badge.className = "onboarding-point-badge";
      badge.textContent = `${index + 1}`;

      const text = document.createElement("span");
      text.className = "onboarding-point-text";
      text.textContent = point;

      item.append(badge, text);
      onboardingStepPoints.append(item);
    });

    onboardingSteps.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.className = "onboarding-step-dot";
      dot.classList.toggle("is-active", index === activeOnboardingStepIndex);
      dot.classList.toggle("is-complete", index < activeOnboardingStepIndex);
      onboardingStepDots.append(dot);
    });

    onboardingProgress.textContent = `${activeOnboardingStepIndex + 1} of ${onboardingSteps.length}`;
    onboardingBackButton.disabled = activeOnboardingStepIndex === 0;
    onboardingNextButton.classList.toggle("is-hidden", activeOnboardingStepIndex === onboardingSteps.length - 1);
    onboardingFinishButton.classList.toggle("is-hidden", activeOnboardingStepIndex !== onboardingSteps.length - 1);
  };

  const openOnboarding = ({ markSeen = false, startAt = 0 } = {}) => {
    activeOnboardingStepIndex = Math.max(0, Math.min(startAt, onboardingSteps.length - 1));
    renderOnboardingStep();
    openDialog(onboardingDialog);

    if (markSeen) {
      void writeStoredValue(onboardingStorageKey, true);
    }
  };

  const goToPreviousOnboardingStep = () => {
    if (activeOnboardingStepIndex === 0) {
      return;
    }

    activeOnboardingStepIndex -= 1;
    renderOnboardingStep();
  };

  const goToNextOnboardingStep = () => {
    if (activeOnboardingStepIndex >= onboardingSteps.length - 1) {
      return;
    }

    activeOnboardingStepIndex += 1;
    renderOnboardingStep();
  };

  const finishOnboarding = () => {
    onboardingDialog.close();
    void writeStoredValue(onboardingStorageKey, true);
  };

  return {
    openOnboarding,
    goToPreviousOnboardingStep,
    goToNextOnboardingStep,
    finishOnboarding
  };
};
