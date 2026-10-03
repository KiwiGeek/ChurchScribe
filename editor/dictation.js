window.ScriptoriaModules = window.ScriptoriaModules || {};

// Opt-in live dictation. The browser speech recognizer writes into the open
// note: the phrase being heard sits in a temporary line, and each finalized
// phrase is appended as a normal paragraph. That temporary line is left out of
// saved HTML so a re-render cannot store it and then append it again.
window.ScriptoriaModules.createDictation = (deps) => {
  const {
    noteEditor,
    dictateMenuButton,
    dictateMenu,
    dictateButton,
    dictateSource,
    dictateModel,
    dictateModelField,
    linkifyScriptureReferences,
    parseScriptureReference,
    jumpToResolvedScripture,
    saveActiveNote,
    updateNoteEditorPlaceholderState,
    showToast,
    windowObject,
    documentObject,
    navigatorObject
  } = deps;

  const INTERIM_SELECTOR = "[data-dictation-interim]";
  let runId = 0;
  let listening = false;
  let starting = false;
  let finishing = false;
  let activeSource = "microphone";
  let recognition = null;
  let tabSession = null;
  let restartTimer = null;
  let wakeLock = null;
  let preferLocal = true;
  let pendingInterim = "";
  let activityMessage = "";
  let consumePhrase = null;
  let onSessionStart = null;
  let onParagraph = null;
  let onSessionEnd = null;

  const recognitionCtor = () =>
    windowObject.SpeechRecognition || windowObject.webkitSpeechRecognition || null;

  const normalized = (text) => text.replace(/\s+/g, " ").trim();

  const setStatus = () => {};

  const renderButton = () => {
    const active = listening || starting || finishing;
    const label = active
      ? "Stop dictation"
      : dictateSource?.value === "tab"
        ? "Listen to tab audio"
        : "Listen and write what is spoken";

    if (dictateButton) {
      dictateButton.classList.toggle("is-listening", active);
      dictateButton.setAttribute("aria-pressed", active ? "true" : "false");
      dictateButton.textContent = active ? "Stop" : "Listen";
      dictateButton.title = label;
      dictateButton.setAttribute("aria-label", label);
    }

    if (dictateMenuButton) {
      dictateMenuButton.classList.toggle("is-listening", active);
      dictateMenuButton.textContent = active ? "Stop" : "Listen";
      dictateMenuButton.title = active ? "Stop dictation" : "Dictation";
    }

    if (dictateSource) {
      dictateSource.disabled = active;
    }

    if (dictateModelField) {
      dictateModelField.hidden = dictateSource?.value !== "tab";
    }

    if (dictateModel) {
      dictateModel.disabled = active;
    }
  };

  const setMenuOpen = (open) => {
    if (!dictateMenu || !dictateMenuButton) {
      return;
    }

    dictateMenu.hidden = !open;
    dictateMenuButton.setAttribute("aria-expanded", open ? "true" : "false");
  };

  const describeMicError = (error) => {
    const name = error?.name || error?.error || "";

    if (name === "NotAllowedError" || name === "not-allowed" || name === "SecurityError") {
      return "Allow microphone access to dictate.";
    }

    if (name === "NotFoundError" || name === "audio-capture") {
      return "No microphone was found.";
    }

    return "Dictation couldn't start.";
  };

  const releaseWakeLock = () => {
    const current = wakeLock;
    wakeLock = null;
    current?.release?.().catch(() => {});
  };

  const acquireWakeLock = async () => {
    if (!navigatorObject.wakeLock?.request) {
      return;
    }

    try {
      wakeLock = await navigatorObject.wakeLock.request("screen");
    } catch {
      // The screen lock is optional. Dictation still works without it.
    }
  };

  const preserveSelection = (mutate) => {
    const selection = windowObject.getSelection();
    const range = selection && selection.rangeCount ? selection.getRangeAt(0) : null;
    const container = range ? range.startContainer : null;
    const offset = range ? range.startOffset : 0;
    mutate();

    if (!container || !noteEditor.contains(container)) {
      return;
    }

    const maxOffset = container.nodeType === Node.TEXT_NODE
      ? container.nodeValue.length
      : container.childNodes.length;

    try {
      const restored = documentObject.createRange();
      restored.setStart(container, Math.min(offset, maxOffset));
      restored.collapse(true);
      selection.removeAllRanges();
      selection.addRange(restored);
    } catch {
      // The caret can stay wherever the browser left it.
    }
  };

  // Keep the latest line in view only while the user has the editor at the end.
  // Scrolling away to read earlier text stays put until they return there.
  const END_SLACK_PX = 16;
  let followEnd = true;
  let programmaticTop = null;
  let lastScrollTop = 0;
  let lastTouchY = 0;

  const isPinnedToEnd = () =>
    noteEditor.scrollHeight - noteEditor.clientHeight - noteEditor.scrollTop <= END_SLACK_PX;

  const syncFollowEnd = () => {
    lastScrollTop = noteEditor.scrollTop;
    followEnd = isPinnedToEnd();
  };

  const revealDictationLine = (paragraph) => {
    if (!paragraph || !followEnd) {
      return;
    }

    const line = paragraph.getBoundingClientRect();
    const editor = noteEditor.getBoundingClientRect();
    let delta = 0;

    if (line.bottom > editor.bottom - 12) {
      delta = line.bottom - editor.bottom + 24;
    } else if (line.top < editor.top) {
      delta = -(editor.top - line.top + 12);
    }

    if (!delta) {
      return;
    }

    programmaticTop = noteEditor.scrollTop + delta;
    noteEditor.scrollTop += delta;
    lastScrollTop = noteEditor.scrollTop;
  };

  const onEditorScroll = () => {
    const next = noteEditor.scrollTop;
    const delta = next - lastScrollTop;
    lastScrollTop = next;

    if (programmaticTop !== null && Math.abs(next - programmaticTop) <= 1) {
      programmaticTop = null;
      return;
    }

    programmaticTop = null;
    const pinned = isPinnedToEnd();

    // A shorter status line clamps scrollTop down while the view is still at
    // the end. That is not the user scrolling away.
    if (delta < -1 && !pinned) {
      followEnd = false;
      return;
    }

    if (pinned && delta >= -1) {
      followEnd = true;
    }
  };

  const ensureInterimParagraph = () => {
    const hasEditableBlock = [...noteEditor.children].some(
      (child) => !child.matches(INTERIM_SELECTOR)
    );

    if (!hasEditableBlock) {
      const editable = documentObject.createElement("p");
      editable.innerHTML = "<br>";
      noteEditor.append(editable);
    }

    let paragraph = noteEditor.querySelector(INTERIM_SELECTOR);

    if (!paragraph) {
      paragraph = documentObject.createElement("p");
      paragraph.dataset.dictationInterim = "true";
      paragraph.className = "dictation-interim";
      paragraph.setAttribute("contenteditable", "false");
      noteEditor.append(paragraph);
    } else if (paragraph !== noteEditor.lastElementChild) {
      noteEditor.append(paragraph);
    }

    updateNoteEditorPlaceholderState();
    return paragraph;
  };

  const showTabActivity = (message) => {
    activityMessage = message;
    preserveSelection(() => {
      const paragraph = ensureInterimParagraph();
      paragraph.dataset.dictationStatus = "true";
      paragraph.textContent = message;
    });
    revealDictationLine(noteEditor.querySelector(INTERIM_SELECTOR));
  };

  const setInterim = (text) => {
    pendingInterim = normalized(text);
    preserveSelection(() => {
      const paragraph = ensureInterimParagraph();
      paragraph.textContent = pendingInterim;
    });
    revealDictationLine(noteEditor.querySelector(INTERIM_SELECTOR));
  };

  const jumpToLastReference = (paragraph) => {
    const links = paragraph.querySelectorAll("a[data-scripture-ref]");
    const last = links[links.length - 1];

    if (!last?.dataset.scriptureRef) {
      return;
    }

    try {
      const parsed = parseScriptureReference(last.dataset.scriptureRef);

      if (parsed) {
        jumpToResolvedScripture(parsed);
      }
    } catch {
      // The link is already in the note if navigation cannot load the passage.
    }
  };

  const finalizeParagraph = (paragraph) => {
    paragraph.removeAttribute("data-dictation-interim");
    paragraph.removeAttribute("data-dictation-status");
    paragraph.removeAttribute("contenteditable");
    paragraph.classList.remove("dictation-interim");
    linkifyScriptureReferences({ jumpToCaretReference: false, scope: paragraph });
    jumpToLastReference(paragraph);
    updateNoteEditorPlaceholderState();
    saveActiveNote();
    revealDictationLine(paragraph);
    onParagraph?.(paragraph);
    return true;
  };

  const commitInterimPhrase = () => {
    const paragraph = noteEditor.querySelector(INTERIM_SELECTOR);
    pendingInterim = "";

    if (!paragraph || paragraph.dataset.dictationStatus === "true") {
      paragraph?.remove();
      updateNoteEditorPlaceholderState();
      return false;
    }

    const phrase = normalized(paragraph.textContent);

    if (!phrase) {
      paragraph.remove();
      updateNoteEditorPlaceholderState();
      return false;
    }

    if (consumePhrase?.(phrase)) {
      paragraph.remove();
      updateNoteEditorPlaceholderState();
      return true;
    }

    paragraph.textContent = phrase;
    return finalizeParagraph(paragraph);
  };

  const commitPhrase = (text) => {
    const phrase = normalized(text);

    if (!phrase || !listening) {
      return false;
    }

    pendingInterim = "";

    if (consumePhrase?.(phrase)) {
      return true;
    }

    const paragraph = ensureInterimParagraph();
    paragraph.textContent = phrase;
    return finalizeParagraph(paragraph);
  };

  const clearRestartTimer = () => {
    if (restartTimer) {
      windowObject.clearTimeout(restartTimer);
      restartTimer = null;
    }
  };

  const detachRecognition = (source) => {
    if (!source) {
      return;
    }

    source.onresult = null;
    source.onerror = null;
    source.onend = null;

    try {
      source.abort();
    } catch {
      // Already stopped.
    }
  };

  const endSession = ({ status = "", keepRaw = false } = {}) => {
    runId += 1;
    listening = false;
    starting = false;
    finishing = false;
    activityMessage = "";
    clearRestartTimer();
    detachRecognition(recognition);
    recognition = null;
    tabSession?.cancel();
    tabSession = null;
    releaseWakeLock();
    commitInterimPhrase();
    const notify = onSessionEnd;
    renderButton();
    setStatus(status);
    notify?.({ keepRaw });
  };

  const stop = ({ status = "", flushTab = false, keepRaw = false } = {}) => {
    if (flushTab && tabSession && listening && !finishing) {
      finishing = true;
      const session = tabSession;
      const capturedRun = runId;
      renderButton();
      showTabActivity("Finishing…");
      void session.finish().finally(() => {
        if (capturedRun !== runId) {
          return;
        }

        endSession({ keepRaw });
      });
      return;
    }

    endSession({ status, keepRaw });
  };

  const fail = (message) => {
    stop({ status: message });
    showToast(message, { durationMs: 4200 });
  };

  const tabDictation = windowObject.ScriptoriaModules.createTabDictation({
    windowObject,
    documentObject,
    navigatorObject
  });

  const describeTabError = (error) => {
    if (error?.name === "NoAudioTrack") {
      return error.message;
    }

    if (error?.name === "NotAllowedError" || error?.name === "AbortError") {
      return "Tab sharing was canceled.";
    }

    if (error?.name === "NotSupportedError") {
      return "Tab audio isn't available in this browser. Try Chrome or Edge.";
    }

    return "Tab audio couldn't start.";
  };

  const startTab = async () => {
    if (listening || starting || finishing) {
      return;
    }

    if (!windowObject.isSecureContext) {
      const message = "Dictation needs a secure connection.";
      setStatus(message);
      showToast(message, { durationMs: 4200 });
      return;
    }

    const capturedRun = runId;
    activeSource = "tab";
    starting = true;
    renderButton();

    const session = tabDictation.start({
      isActive: () => capturedRun === runId && (starting || listening || finishing),
      modelKey: dictateModel?.value || "small",
      onPhrase: (text) => {
        if (capturedRun !== runId) {
          return;
        }

        commitPhrase(text);
      },
      onStatus: (message) => {
        if (capturedRun !== runId) {
          return;
        }

        setStatus(message);

        if (starting || listening) {
          showTabActivity(message);
        }
      },
      onEnded: () => {
        if (capturedRun === runId && listening && !finishing) {
          stop({ flushTab: true });
        }
      }
    });
    tabSession = session;

    try {
      await session.ready;
    } catch (error) {
      if (capturedRun !== runId) {
        return;
      }

      endSession();
      const message = describeTabError(error);
      setStatus(message);
      showToast(message, { durationMs: 5200 });
      return;
    }

    if (capturedRun !== runId) {
      return;
    }

    starting = false;
    listening = true;
    pendingInterim = "";
    renderButton();
    void acquireWakeLock();
    onSessionStart?.();
  };

  const createRecognition = (useLocal) => {
    const Recognition = recognitionCtor();
    const next = new Recognition();
    next.continuous = true;
    next.interimResults = true;

    if (navigatorObject.language) {
      next.lang = navigatorObject.language;
    }

    if (useLocal && "processLocally" in next) {
      try {
        next.processLocally = true;
      } catch {
        preferLocal = false;
      }
    }

    return next;
  };

  const beginRecognition = (capturedRun, useLocal) => {
    if (!listening || capturedRun !== runId) {
      return;
    }

    let next;

    try {
      next = createRecognition(useLocal);
    } catch {
      fail("Dictation couldn't start.");
      return;
    }

    recognition = next;
    let heardFinals = 0;

    // A restarted session begins a new result list at index 0. Track finals
    // per session so a browser that replays an earlier result cannot append it twice.
    next.onstart = () => {
      heardFinals = 0;
    };

    next.onresult = (event) => {
      if (!listening || capturedRun !== runId) {
        return;
      }

      let interim = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript ?? "";

        if (result.isFinal) {
          if (index >= heardFinals) {
            commitPhrase(transcript);
            heardFinals = index + 1;
          }
        } else if (index >= heardFinals) {
          interim += transcript;
        }
      }

      if (listening && capturedRun === runId) {
        setInterim(interim);
      }
    };

    next.onerror = (event) => {
      if (capturedRun !== runId) {
        return;
      }

      const code = event.error;

      if (
        useLocal
        && preferLocal
        && (code === "language-not-supported" || code === "service-not-allowed")
      ) {
        preferLocal = false;
        detachRecognition(next);

        if (recognition === next) {
          recognition = null;
        }

        beginRecognition(capturedRun, false);
        return;
      }

      if (code === "not-allowed" || code === "audio-capture") {
        fail(describeMicError({ name: code }));
        return;
      }

      if (code === "network") {
        setStatus("Reconnecting…");
      }
    };

    next.onend = () => {
      if (!listening || capturedRun !== runId || recognition !== next) {
        return;
      }

      restartTimer = windowObject.setTimeout(() => {
        if (!listening || capturedRun !== runId || recognition !== next) {
          return;
        }

        try {
          next.start();
        } catch {
          // InvalidStateError means this session is already running.
        }
      }, 250);
    };

    try {
      next.start();
    } catch {
      if (useLocal && preferLocal) {
        preferLocal = false;
        detachRecognition(next);
        recognition = null;
        beginRecognition(capturedRun, false);
        return;
      }

      fail("Dictation couldn't start.");
    }
  };

  const start = async () => {
    if (listening || starting || finishing) {
      return;
    }

    syncFollowEnd();

    if (dictateSource?.value === "tab") {
      await startTab();
      return;
    }

    activeSource = "microphone";

    if (!recognitionCtor()) {
      const message = "Dictation isn't available in this browser. Try Chrome, Edge, or Safari.";
      setStatus(message);
      showToast(message, { durationMs: 4200 });
      return;
    }

    if (!windowObject.isSecureContext) {
      const message = "Dictation needs a secure connection.";
      setStatus(message);
      showToast(message, { durationMs: 4200 });
      return;
    }

    const capturedRun = runId;
    starting = true;
    renderButton();
    setStatus("Starting…");

    try {
      if (navigatorObject.mediaDevices?.getUserMedia) {
        const stream = await navigatorObject.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (error) {
      if (capturedRun !== runId) {
        return;
      }

      starting = false;
      renderButton();
      const message = describeMicError(error);
      setStatus(message);
      showToast(message, { durationMs: 4200 });
      return;
    }

    if (capturedRun !== runId) {
      return;
    }

    starting = false;
    listening = true;
    pendingInterim = "";
    renderButton();
    setStatus("Listening");
    setInterim("");
    void acquireWakeLock();
    onSessionStart?.();
    beginRecognition(capturedRun, preferLocal);
  };

  const captureDictationInterim = () => {
    if (!listening) {
      return;
    }

    const paragraph = noteEditor.querySelector(INTERIM_SELECTOR);

    if (!paragraph || paragraph.dataset.dictationStatus === "true") {
      return;
    }

    pendingInterim = normalized(paragraph.textContent);
  };

  const restoreListeningLine = () => {
    if (!listening) {
      return;
    }

    if (activeSource === "tab") {
      if (activityMessage) {
        setStatus(activityMessage);
        showTabActivity(activityMessage);
      }

      return;
    }

    setInterim(pendingInterim);
    setStatus("Listening");
  };

  const attach = () => {
    noteEditor.addEventListener("scroll", onEditorScroll, { passive: true });
    noteEditor.addEventListener("wheel", (event) => {
      if (event.deltaY < 0 && noteEditor.scrollTop > 0) {
        followEnd = false;
      }
    }, { passive: true });
    noteEditor.addEventListener("touchstart", (event) => {
      const y = event.touches[0]?.clientY;

      if (y !== undefined) {
        lastTouchY = y;
      }
    }, { passive: true });
    noteEditor.addEventListener("touchmove", (event) => {
      const y = event.touches[0]?.clientY;

      if (y === undefined) {
        return;
      }

      if (y > lastTouchY + 2 && noteEditor.scrollTop > 0) {
        followEnd = false;
      }

      lastTouchY = y;
    }, { passive: true });
    syncFollowEnd();

    if (!dictateButton || !dictateMenuButton) {
      return;
    }

    dictateMenuButton.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });

    dictateMenuButton.addEventListener("click", () => {
      if (finishing) {
        endSession();
        setMenuOpen(false);
        return;
      }

      if (listening || starting) {
        stop({ flushTab: activeSource === "tab" && listening });
        setMenuOpen(false);
        return;
      }

      setMenuOpen(dictateMenu.hidden);
    });

    dictateButton.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });

    dictateButton.addEventListener("click", () => {
      if (finishing) {
        endSession();
        setMenuOpen(false);
        return;
      }

      if (listening || starting) {
        stop({ flushTab: activeSource === "tab" && listening });
        setMenuOpen(false);
        return;
      }

      setMenuOpen(false);
      void start();
    });

    dictateSource?.addEventListener("change", () => {
      renderButton();
    });

    if (dictateModel) {
      const savedModel = windowObject.localStorage?.getItem("service-notes-whisper-model");

      if (savedModel && [...dictateModel.options].some((option) => option.value === savedModel)) {
        dictateModel.value = savedModel;
      }

      dictateModel.addEventListener("change", () => {
        windowObject.localStorage?.setItem("service-notes-whisper-model", dictateModel.value);
      });
    }

    documentObject.addEventListener("click", (event) => {
      if (!dictateMenuButton.closest(".dictate-control")?.contains(event.target)) {
        setMenuOpen(false);
      }
    });

    documentObject.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    });

    renderButton();

    documentObject.addEventListener("visibilitychange", () => {
      if (documentObject.visibilityState !== "visible" || !listening) {
        return;
      }

      void acquireWakeLock();

      if (activeSource === "tab") {
        void tabSession?.resume();
        return;
      }

      if (!recognition) {
        beginRecognition(runId, preferLocal);
        return;
      }

      try {
        recognition.start();
      } catch {
        // Already running after the page became visible again.
      }
    });

    renderButton();
  };

  return {
    attach,
    prepareForNoteChange: () => {
      if (!listening && !starting) {
        onSessionEnd?.({ keepRaw: true });
        return;
      }

      stop({ keepRaw: true });
    },
    setPhraseConsumer: (consumer) => {
      consumePhrase = typeof consumer === "function" ? consumer : null;
    },
    setSessionStartListener: (listener) => {
      onSessionStart = typeof listener === "function" ? listener : null;
    },
    setParagraphListener: (listener) => {
      onParagraph = typeof listener === "function" ? listener : null;
    },
    setSessionEndListener: (listener) => {
      onSessionEnd = typeof listener === "function" ? listener : null;
    },
    captureDictationInterim,
    restoreListeningLine
  };
};
