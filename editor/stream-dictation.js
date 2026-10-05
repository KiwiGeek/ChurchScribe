window.ScriptoriaModules = window.ScriptoriaModules || {};

// Stream-URL dictation. An HLS (.m3u8) or direct media URL plays in a small
// preview. Audio is tapped through Web Audio for Whisper and is silent unless
// the user turns Hear on. Pause writing stops transcription while playback
// continues; the preview can be dragged.
window.ScriptoriaModules.createStreamDictation = (deps) => {
  const {
    windowObject,
    documentObject,
    loadTranscriber
  } = deps;

  const SAMPLE_RATE = 16000;
  const CHUNK_SAMPLES = SAMPLE_RATE * 20;
  const FLUSH_SAMPLES = Math.floor(SAMPLE_RATE * 0.8);
  const METER_FULL_SCALE = 0.05;
  const SILENCE_RMS = METER_FULL_SCALE * 0.02;
  const SPEECH_FRAME = 800;
  const MIN_SPEECH_FRAMES = 20;
  const HLS_SCRIPT = "https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js";
  const LAST_URL_KEY = "service-notes-stream-dictation-url";
  const PANEL_POS_KEY = "service-notes-stream-panel-pos";
  const PANEL_SIZE_KEY = "service-notes-stream-panel-size";
  // Slow VOD hosts often need well beyond hls.js's 10s defaults.
  const STREAM_OPEN_TIMEOUT_MS = 90000;
  const HLS_MANIFEST_TIMEOUT_MS = 60000;
  const HLS_LEVEL_TIMEOUT_MS = 60000;
  const HLS_FRAG_TIMEOUT_MS = 45000;
  const PANEL_MIN_WIDTH = 240;
  const PANEL_MIN_HEIGHT = 180;

  let hlsLoader = null;

  const whisperLanguage = () => {
    const code = (windowObject.navigator?.language || "en").slice(0, 2).toLowerCase();
    const names = {
      en: "english",
      es: "spanish",
      fr: "french",
      de: "german",
      pt: "portuguese"
    };

    return names[code] || "english";
  };

  const rms = (samples) => {
    if (!samples.length) {
      return 0;
    }

    let sum = 0;

    for (let index = 0; index < samples.length; index += 1) {
      const value = samples[index];
      sum += value * value;
    }

    return Math.sqrt(sum / samples.length);
  };

  const meterPercent = (value) => Math.min(100, Math.round((value / METER_FULL_SCALE) * 100));

  const hasSpeech = (samples) => {
    let speechFrames = 0;

    for (let offset = 0; offset + SPEECH_FRAME <= samples.length; offset += SPEECH_FRAME) {
      let sum = 0;

      for (let index = 0; index < SPEECH_FRAME; index += 1) {
        const value = samples[offset + index];
        sum += value * value;
      }

      if (Math.sqrt(sum / SPEECH_FRAME) >= SILENCE_RMS) {
        speechFrames += 1;

        if (speechFrames >= MIN_SPEECH_FRAMES) {
          return true;
        }
      }
    }

    return false;
  };

  const resampleLinear = (input, fromRate, toRate) => {
    if (!input.length || fromRate === toRate) {
      return input;
    }

    const ratio = fromRate / toRate;
    const length = Math.max(1, Math.floor(input.length / ratio));
    const output = new Float32Array(length);

    for (let index = 0; index < length; index += 1) {
      const position = index * ratio;
      const left = Math.floor(position);
      const right = Math.min(left + 1, input.length - 1);
      const mix = position - left;
      output[index] = (input[left] * (1 - mix)) + (input[right] * mix);
    }

    return output;
  };

  const normalizedUrl = (value) => {
    const text = String(value || "").trim();

    if (!text) {
      return "";
    }

    try {
      const parsed = new windowObject.URL(text);

      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return "";
      }

      return parsed.href;
    } catch {
      return "";
    }
  };

  const readLastUrl = () => {
    try {
      return windowObject.localStorage?.getItem(LAST_URL_KEY) || "";
    } catch {
      return "";
    }
  };

  const writeLastUrl = (url) => {
    try {
      if (url) {
        windowObject.localStorage?.setItem(LAST_URL_KEY, url);
      }
    } catch {
      // Optional convenience only.
    }
  };

  const readPanelPos = () => {
    try {
      const raw = windowObject.localStorage?.getItem(PANEL_POS_KEY);

      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      const left = Number(parsed?.left);
      const top = Number(parsed?.top);

      if (!Number.isFinite(left) || !Number.isFinite(top)) {
        return null;
      }

      return { left, top };
    } catch {
      return null;
    }
  };

  const writePanelPos = (left, top) => {
    try {
      windowObject.localStorage?.setItem(PANEL_POS_KEY, JSON.stringify({ left, top }));
    } catch {
      // Optional convenience only.
    }
  };

  const clampPanelPos = (left, top, width, height) => {
    const margin = 8;
    const maxLeft = Math.max(margin, windowObject.innerWidth - width - margin);
    const maxTop = Math.max(margin, windowObject.innerHeight - height - margin);

    return {
      left: Math.min(maxLeft, Math.max(margin, left)),
      top: Math.min(maxTop, Math.max(margin, top))
    };
  };

  const readPanelSize = () => {
    try {
      const raw = windowObject.localStorage?.getItem(PANEL_SIZE_KEY);

      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      const width = Number(parsed?.width);
      const height = Number(parsed?.height);

      if (!Number.isFinite(width) || !Number.isFinite(height)) {
        return null;
      }

      return { width, height };
    } catch {
      return null;
    }
  };

  const writePanelSize = (width, height) => {
    try {
      windowObject.localStorage?.setItem(PANEL_SIZE_KEY, JSON.stringify({ width, height }));
    } catch {
      // Optional convenience only.
    }
  };

  const clampPanelSize = (width, height) => {
    const margin = 16;
    const maxWidth = Math.max(PANEL_MIN_WIDTH, windowObject.innerWidth - margin);
    const maxHeight = Math.max(PANEL_MIN_HEIGHT, windowObject.innerHeight - margin);

    return {
      width: Math.min(maxWidth, Math.max(PANEL_MIN_WIDTH, width)),
      height: Math.min(maxHeight, Math.max(PANEL_MIN_HEIGHT, height))
    };
  };

  const withTimeout = (promise, ms, message) => new Promise((resolve, reject) => {
    const timer = windowObject.setTimeout(() => {
      const error = new Error(message);
      error.name = "StreamTimeout";
      reject(error);
    }, ms);

    promise.then(
      (value) => {
        windowObject.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        windowObject.clearTimeout(timer);
        reject(error);
      }
    );
  });

  const loadHlsConstructor = () => {
    if (windowObject.Hls) {
      return Promise.resolve(windowObject.Hls);
    }

    if (hlsLoader) {
      return hlsLoader;
    }

    hlsLoader = new Promise((resolve, reject) => {
      const existing = documentObject.querySelector(`script[src="${HLS_SCRIPT}"]`);

      if (existing) {
        existing.addEventListener("load", () => {
          if (windowObject.Hls) {
            resolve(windowObject.Hls);
          } else {
            reject(new Error("HLS playback couldn't load."));
          }
        }, { once: true });
        existing.addEventListener("error", () => {
          hlsLoader = null;
          reject(new Error("HLS playback couldn't load."));
        }, { once: true });
        return;
      }

      const script = documentObject.createElement("script");
      script.src = HLS_SCRIPT;
      script.async = true;
      script.onload = () => {
        if (windowObject.Hls) {
          resolve(windowObject.Hls);
        } else {
          hlsLoader = null;
          reject(new Error("HLS playback couldn't load."));
        }
      };
      script.onerror = () => {
        hlsLoader = null;
        reject(new Error("HLS playback couldn't load."));
      };
      documentObject.body.append(script);
    });

    return hlsLoader;
  };

  const looksLikeHls = (url) => /\.m3u8(\?|#|$)/i.test(url);

  const start = ({
    url,
    isActive,
    onPhrase,
    onStatus,
    onEnded,
    modelKey = "small"
  }) => {
    const mediaUrl = normalizedUrl(url);
    let panel = null;
    let video = null;
    let playButton = null;
    let writeButton = null;
    let hearButton = null;
    let seekInput = null;
    let statusLine = null;
    let hls = null;
    let seekDragging = false;
    let audioContext = null;
    let processor = null;
    let source = null;
    let hearGain = null;
    let ended = false;
    let flushing = false;
    // Independent of video play/pause: stream can keep playing while writing stops.
    let writingPaused = false;
    let hearEnabled = false;
    const pieces = [];
    let buffered = 0;

    const take = (count) => {
      const output = new Float32Array(count);
      let offset = 0;

      while (offset < count && pieces.length) {
        const head = pieces[0];
        const need = count - offset;

        if (head.length <= need) {
          output.set(head, offset);
          offset += head.length;
          pieces.shift();
        } else {
          output.set(head.subarray(0, need), offset);
          pieces[0] = head.subarray(need);
          offset = count;
        }
      }

      buffered -= count;
      return output;
    };

    const teardownMedia = () => {
      if (hls) {
        try {
          hls.destroy();
        } catch {
          // Already torn down.
        }

        hls = null;
      }

      if (video) {
        video.removeAttribute("src");
        video.load();
      }
    };

    const teardown = () => {
      ended = true;
      processor?.disconnect();
      source?.disconnect();
      hearGain?.disconnect();
      processor = null;
      source = null;
      hearGain = null;
      teardownMedia();
      panel?.remove();
      panel = null;
      video = null;
      playButton = null;
      writeButton = null;
      hearButton = null;
      seekInput = null;
      statusLine = null;

      if (audioContext && audioContext.state !== "closed") {
        void audioContext.close();
      }

      audioContext = null;
    };

    let latestRms = 0;
    let heldRms = 0;
    let receivedFrames = 0;
    let lastReport = 0;
    let phase = "capture";
    let outcome = "";
    let modelStatus = "";

    const clearCaptureBuffer = () => {
      pieces.length = 0;
      buffered = 0;
      latestRms = 0;
      heldRms = 0;
    };

    const levelLabel = () => {
      if (video?.paused) {
        return "stream paused";
      }

      if (writingPaused) {
        return "writing paused";
      }

      if (audioContext && audioContext.state !== "running") {
        return "audio paused";
      }

      if (heldRms < SILENCE_RMS) {
        return "silent";
      }

      return `level ${meterPercent(heldRms)}%`;
    };

    const reportCapture = (force = false) => {
      if (!isActive() || ended) {
        return;
      }

      const now = windowObject.performance.now();

      if (!force && now - lastReport < 500) {
        return;
      }

      lastReport = now;
      const seconds = Math.min(20, Math.floor(buffered / SAMPLE_RATE));
      const signal = levelLabel();
      let audio;

      if (signal === "writing paused") {
        audio = "Writing paused · stream still playing";
      } else if (signal === "stream paused") {
        audio = writingPaused
          ? "Stream paused · writing paused"
          : "Stream paused · transcription waiting";
      } else if (!receivedFrames) {
        audio = "Waiting for audio from the stream";
      } else if (phase === "transcribe") {
        const waiting = Math.floor(buffered / SAMPLE_RATE);
        audio = `Transcribing the last slice · still receiving audio (${signal}) · ${waiting}s waiting`;
      } else if (signal === "silent" || signal === "audio paused") {
        audio = `No speech coming through (${signal}) · ${seconds}s of 20s`;
      } else {
        audio = `Hearing the stream (${signal}) · ${seconds}s of 20s`;
      }

      const parts = [];

      if (
        outcome
        && phase !== "transcribe"
        && signal !== "writing paused"
        && signal !== "stream paused"
      ) {
        parts.push(outcome);
      }

      parts.push(audio);

      if (modelStatus) {
        parts.push(modelStatus);
      }

      const message = parts.join(" · ");
      onStatus(message);

      if (statusLine) {
        statusLine.textContent = message;
      }
    };

    const onModelStatus = (message) => {
      modelStatus = message;
      reportCapture(true);
    };

    const syncPlayButton = () => {
      if (!playButton || !video) {
        return;
      }

      const paused = video.paused || video.ended;
      playButton.textContent = paused ? "Play" : "Pause";
      playButton.title = paused ? "Play the stream" : "Pause the stream";
      playButton.setAttribute("aria-label", paused ? "Play stream" : "Pause stream");
    };

    const syncWriteButton = () => {
      if (!writeButton) {
        return;
      }

      writeButton.setAttribute("aria-pressed", writingPaused ? "false" : "true");
      writeButton.textContent = writingPaused ? "Resume writing" : "Pause writing";
      writeButton.title = writingPaused
        ? "Start writing from the stream again (playback keeps going either way)"
        : "Stop writing into the note while the stream keeps playing";
    };

    const syncHearButton = () => {
      if (!hearButton || !hearGain) {
        return;
      }

      hearButton.setAttribute("aria-pressed", hearEnabled ? "true" : "false");
      hearButton.textContent = hearEnabled ? "Mute" : "Hear";
      hearButton.title = hearEnabled
        ? "Mute stream speakers (transcription keeps going)"
        : "Play stream audio through the speakers";
      hearGain.gain.value = hearEnabled ? 1 : 0;

      if (hearEnabled && audioContext?.state === "suspended") {
        void audioContext.resume().catch(() => {});
      }
    };

    const transcribeSlice = async (samples) => {
      if (!hasSpeech(samples)) {
        outcome = `Last slice was silence (average level ${meterPercent(rms(samples))}%)`;
        phase = "capture";
        reportCapture(true);
        return;
      }

      phase = "transcribe";
      reportCapture(true);

      try {
        const transcriber = await loadTranscriber(modelKey, onModelStatus);

        if (!isActive() || ended) {
          phase = "capture";
          return;
        }

        modelStatus = "";
        const result = await transcriber(samples, {
          sampling_rate: SAMPLE_RATE,
          language: whisperLanguage(),
          task: "transcribe",
          return_timestamps: false,
          chunk_length_s: 20,
          stride_length_s: 5
        });
        const text = typeof result?.text === "string" ? result.text : "";
        phase = "capture";

        if (!isActive() || ended) {
          return;
        }

        if (text.trim()) {
          onPhrase(text);
          outcome = "Wrote a line";
        } else {
          outcome = "No words recognized";
        }

        reportCapture(true);
      } catch (error) {
        phase = "capture";
        throw error;
      }
    };

    let pumpChain = Promise.resolve();

    const pumpAll = async () => {
      while (!ended) {
        const minimum = flushing ? FLUSH_SAMPLES : CHUNK_SAMPLES;

        if (buffered < minimum) {
          return;
        }

        const count = flushing
          ? Math.min(buffered, SAMPLE_RATE * 30)
          : CHUNK_SAMPLES;
        const samples = take(count);

        try {
          await transcribeSlice(samples);
        } catch (error) {
          if (isActive() && !ended) {
            onStatus(error?.message || "Transcription failed.");
          }
        }
      }
    };

    const requestPump = () => {
      pumpChain = pumpChain.then(pumpAll, pumpAll);
      return pumpChain;
    };

    const pushSamples = (samples) => {
      if (!samples.length || ended || flushing || writingPaused || video?.paused) {
        return;
      }

      pieces.push(samples);
      buffered += samples.length;
      void requestPump();
    };

    const buildPanel = () => {
      panel = documentObject.createElement("div");
      panel.className = "stream-dictation-panel";
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-label", "Stream preview");

      const toolbar = documentObject.createElement("div");
      toolbar.className = "stream-dictation-toolbar";

      const dragHandle = documentObject.createElement("span");
      dragHandle.className = "stream-dictation-drag";
      dragHandle.title = "Drag to move";
      dragHandle.setAttribute("aria-hidden", "true");
      dragHandle.textContent = "⠿";

      const actions = documentObject.createElement("div");
      actions.className = "stream-dictation-actions";

      playButton = documentObject.createElement("button");
      playButton.type = "button";
      playButton.className = "ghost-button stream-dictation-play";
      playButton.textContent = "Pause";

      writeButton = documentObject.createElement("button");
      writeButton.type = "button";
      writeButton.className = "ghost-button stream-dictation-write";
      writeButton.textContent = "Pause writing";
      writeButton.setAttribute("aria-pressed", "true");

      hearButton = documentObject.createElement("button");
      hearButton.type = "button";
      hearButton.className = "ghost-button stream-dictation-hear";
      hearButton.textContent = "Hear";
      hearButton.setAttribute("aria-pressed", "false");

      const closeButton = documentObject.createElement("button");
      closeButton.type = "button";
      closeButton.className = "ghost-button stream-dictation-close";
      closeButton.setAttribute("aria-label", "Stop listening to stream");
      closeButton.title = "Stop listening";
      closeButton.textContent = "Stop";

      actions.append(playButton, writeButton, hearButton);
      toolbar.append(dragHandle, actions, closeButton);

      video = documentObject.createElement("video");
      video.className = "stream-dictation-video";
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.controls = false;
      video.preload = "auto";
      // Required before load so Web Audio can read cross-origin stream audio.
      video.crossOrigin = "anonymous";
      // Start muted so autoplay is allowed after the URL dialog. Once the
      // MediaElementSource graph is attached, speakers follow Hear gain only.
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 1;

      seekInput = documentObject.createElement("input");
      seekInput.type = "range";
      seekInput.className = "stream-dictation-seek";
      seekInput.min = "0";
      seekInput.max = "1000";
      seekInput.value = "0";
      seekInput.step = "1";
      seekInput.setAttribute("aria-label", "Seek in stream");
      seekInput.hidden = true;

      statusLine = documentObject.createElement("p");
      statusLine.className = "stream-dictation-status";
      statusLine.textContent = "Opening stream…";

      const resizeHandle = documentObject.createElement("span");
      resizeHandle.className = "stream-dictation-resize";
      resizeHandle.title = "Drag to resize";
      resizeHandle.setAttribute("aria-hidden", "true");

      panel.append(toolbar, video, seekInput, statusLine, resizeHandle);
      documentObject.body.append(panel);

      const applyPanelSize = (width, height) => {
        const next = clampPanelSize(width, height);
        panel.style.width = `${next.width}px`;
        panel.style.height = `${next.height}px`;
        return next;
      };

      const applyPanelPos = (left, top) => {
        const box = panel.getBoundingClientRect();
        const next = clampPanelPos(left, top, box.width, box.height);
        panel.style.left = `${next.left}px`;
        panel.style.top = `${next.top}px`;
        panel.style.right = "auto";
        panel.style.bottom = "auto";
        return next;
      };

      const savedSize = readPanelSize();

      if (savedSize) {
        applyPanelSize(savedSize.width, savedSize.height);
      }

      const savedPos = readPanelPos();

      if (savedPos) {
        applyPanelPos(savedPos.left, savedPos.top);
      }

      let dragState = null;

      const onDragMove = (event) => {
        if (!dragState || !panel) {
          return;
        }

        applyPanelPos(
          event.clientX - dragState.offsetX,
          event.clientY - dragState.offsetY
        );
      };

      const onDragEnd = (event) => {
        if (!dragState || !panel) {
          return;
        }

        const next = applyPanelPos(
          event.clientX - dragState.offsetX,
          event.clientY - dragState.offsetY
        );
        writePanelPos(next.left, next.top);
        panel.classList.remove("is-dragging");
        dragState = null;
        documentObject.removeEventListener("pointermove", onDragMove);
        documentObject.removeEventListener("pointerup", onDragEnd);
        documentObject.removeEventListener("pointercancel", onDragEnd);
      };

      const beginDrag = (event) => {
        if (event.button !== 0 || !panel) {
          return;
        }

        if (event.target.closest("button, input, video, a, .stream-dictation-resize")) {
          return;
        }

        const box = panel.getBoundingClientRect();
        dragState = {
          offsetX: event.clientX - box.left,
          offsetY: event.clientY - box.top
        };
        panel.classList.add("is-dragging");
        // Switch from right/bottom anchoring to left/top before the first move.
        applyPanelPos(box.left, box.top);
        documentObject.addEventListener("pointermove", onDragMove);
        documentObject.addEventListener("pointerup", onDragEnd);
        documentObject.addEventListener("pointercancel", onDragEnd);
        event.preventDefault();
      };

      toolbar.addEventListener("pointerdown", beginDrag);
      statusLine.addEventListener("pointerdown", beginDrag);

      let resizeState = null;

      const onResizeMove = (event) => {
        if (!resizeState || !panel) {
          return;
        }

        const next = applyPanelSize(
          event.clientX - resizeState.startX + resizeState.startWidth,
          event.clientY - resizeState.startY + resizeState.startHeight
        );
        applyPanelPos(resizeState.left, resizeState.top);
        resizeState.latest = next;
      };

      const onResizeEnd = () => {
        if (!resizeState || !panel) {
          return;
        }

        if (resizeState.latest) {
          writePanelSize(resizeState.latest.width, resizeState.latest.height);
        }

        const box = panel.getBoundingClientRect();
        writePanelPos(box.left, box.top);
        panel.classList.remove("is-resizing");
        resizeState = null;
        documentObject.removeEventListener("pointermove", onResizeMove);
        documentObject.removeEventListener("pointerup", onResizeEnd);
        documentObject.removeEventListener("pointercancel", onResizeEnd);
      };

      resizeHandle.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 || !panel) {
          return;
        }

        const box = panel.getBoundingClientRect();
        applyPanelPos(box.left, box.top);
        resizeState = {
          startX: event.clientX,
          startY: event.clientY,
          startWidth: box.width,
          startHeight: box.height,
          left: box.left,
          top: box.top,
          latest: { width: box.width, height: box.height }
        };
        panel.classList.add("is-resizing");
        documentObject.addEventListener("pointermove", onResizeMove);
        documentObject.addEventListener("pointerup", onResizeEnd);
        documentObject.addEventListener("pointercancel", onResizeEnd);
        event.preventDefault();
        event.stopPropagation();
      });

      windowObject.addEventListener("resize", () => {
        if (!panel) {
          return;
        }

        const box = panel.getBoundingClientRect();
        const size = applyPanelSize(box.width, box.height);
        writePanelSize(size.width, size.height);
        const next = applyPanelPos(box.left, box.top);
        writePanelPos(next.left, next.top);
      });

      playButton.addEventListener("click", () => {
        if (!video) {
          return;
        }

        if (video.paused || video.ended) {
          void video.play().then(() => {
            video.muted = false;
            video.defaultMuted = false;
          }).catch(() => {});
        } else {
          video.pause();
        }
      });

      writeButton.addEventListener("click", () => {
        writingPaused = !writingPaused;

        if (writingPaused) {
          // Drop the open slice so a later resume does not write skipped audio.
          clearCaptureBuffer();
          outcome = "Writing paused";
        } else {
          outcome = "Writing resumed";
        }

        syncWriteButton();
        reportCapture(true);
      });

      hearButton.addEventListener("click", () => {
        hearEnabled = !hearEnabled;

        if (hearEnabled && video) {
          // MediaElementSource still needs the element unmuted for samples.
          video.muted = false;
          video.defaultMuted = false;
        }

        syncHearButton();
      });

      closeButton.addEventListener("click", () => {
        if (!ended) {
          onEnded();
        }
      });

      video.addEventListener("play", () => {
        syncPlayButton();
        void audioContext?.resume?.();
        reportCapture(true);
      });

      video.addEventListener("pause", () => {
        syncPlayButton();
        reportCapture(true);
      });

      video.addEventListener("ended", () => {
        syncPlayButton();
        reportCapture(true);

        if (!ended && isActive()) {
          onEnded();
        }
      });

      video.addEventListener("seeking", () => {
        // Drop the half-filled slice so a scrub does not glue old audio onto
        // the new position.
        clearCaptureBuffer();
      });

      const syncSeek = () => {
        if (!seekInput || !video || seekDragging) {
          return;
        }

        const duration = video.duration;

        if (!Number.isFinite(duration) || duration <= 0) {
          seekInput.hidden = true;
          return;
        }

        seekInput.hidden = false;
        seekInput.value = String(Math.round((video.currentTime / duration) * 1000));
      };

      video.addEventListener("timeupdate", syncSeek);
      video.addEventListener("loadedmetadata", syncSeek);
      video.addEventListener("durationchange", syncSeek);

      seekInput.addEventListener("pointerdown", () => {
        seekDragging = true;
      });
      seekInput.addEventListener("pointerup", () => {
        seekDragging = false;
      });
      seekInput.addEventListener("input", () => {
        if (!video) {
          return;
        }

        const duration = video.duration;

        if (!Number.isFinite(duration) || duration <= 0) {
          return;
        }

        video.currentTime = (Number(seekInput.value) / 1000) * duration;
      });

      syncPlayButton();
      syncWriteButton();
    };

    const attachMedia = async () => {
      const nativeHls = Boolean(video.canPlayType("application/vnd.apple.mpegurl"));
      const slowMessage = "The stream took too long to open. Check the URL, or try again if the host is slow.";

      if (looksLikeHls(mediaUrl) && !nativeHls) {
        const Hls = await loadHlsConstructor();

        if (!Hls.isSupported()) {
          const error = new Error("This browser can't play HLS streams. Try Safari, or open the stream in another tab and use Tab audio.");
          error.name = "NotSupportedError";
          throw error;
        }

        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          manifestLoadingTimeOut: HLS_MANIFEST_TIMEOUT_MS,
          manifestLoadingMaxRetry: 4,
          levelLoadingTimeOut: HLS_LEVEL_TIMEOUT_MS,
          levelLoadingMaxRetry: 4,
          fragLoadingTimeOut: HLS_FRAG_TIMEOUT_MS,
          fragLoadingMaxRetry: 6
        });

        await withTimeout(new Promise((resolve, reject) => {
          const onManifest = () => {
            cleanup();
            resolve();
          };
          const onError = (_event, data) => {
            if (data?.fatal) {
              cleanup();
              const error = new Error(
                data.type === Hls.ErrorTypes.NETWORK_ERROR
                  ? "The stream couldn't be loaded. Check the URL, or try Tab audio if the host blocks in-page playback."
                  : "The stream couldn't be played."
              );
              error.name = "StreamLoadError";
              reject(error);
            }
          };
          const cleanup = () => {
            hls.off(Hls.Events.MANIFEST_PARSED, onManifest);
            hls.off(Hls.Events.ERROR, onError);
          };

          hls.on(Hls.Events.MANIFEST_PARSED, onManifest);
          hls.on(Hls.Events.ERROR, onError);
          hls.loadSource(mediaUrl);
          hls.attachMedia(video);
        }), STREAM_OPEN_TIMEOUT_MS, slowMessage);

        return;
      }

      await withTimeout(new Promise((resolve, reject) => {
        const onReady = () => {
          cleanup();
          resolve();
        };
        const onError = () => {
          cleanup();
          const error = new Error("The stream couldn't be loaded. Check the URL.");
          error.name = "StreamLoadError";
          reject(error);
        };
        const cleanup = () => {
          video.removeEventListener("loadedmetadata", onReady);
          video.removeEventListener("error", onError);
        };

        video.addEventListener("loadedmetadata", onReady, { once: true });
        video.addEventListener("error", onError, { once: true });
        video.src = mediaUrl;
        video.load();
      }), STREAM_OPEN_TIMEOUT_MS, slowMessage);
    };

    const ready = (async () => {
      if (!mediaUrl) {
        const error = new Error("Enter a stream URL to listen.");
        error.name = "InvalidUrl";
        throw error;
      }

      writeLastUrl(mediaUrl);
      onStatus("Opening stream…");
      buildPanel();

      const openStarted = windowObject.performance.now();
      const openNudge = windowObject.setInterval(() => {
        if (!isActive() || ended) {
          return;
        }

        const waited = Math.round((windowObject.performance.now() - openStarted) / 1000);
        onStatus(`Opening stream… still waiting (${waited}s)`);

        if (statusLine) {
          statusLine.textContent = `Opening stream… still waiting (${waited}s)`;
        }
      }, 5000);

      try {
        await attachMedia();
      } finally {
        windowObject.clearInterval(openNudge);
      }

      if (!isActive()) {
        teardown();
        return;
      }

      audioContext = new windowObject.AudioContext();
      audioContext.addEventListener("statechange", () => {
        if (!ended && audioContext?.state === "suspended") {
          void audioContext.resume().catch(() => {});
        }
      });
      await audioContext.resume();

      if (!isActive()) {
        teardown();
        return;
      }

      // Once MediaElementSource is created, element audio only flows through
      // this graph. Analysis goes through the processor; speakers use a
      // separate hear gain so ScriptProcessor silence does not mute Hear.
      source = audioContext.createMediaElementSource(video);
      processor = audioContext.createScriptProcessor(4096, 1, 1);
      const pullGain = audioContext.createGain();
      pullGain.gain.value = 0;
      hearGain = audioContext.createGain();
      hearGain.gain.value = 0;
      source.connect(processor);
      processor.connect(pullGain);
      pullGain.connect(audioContext.destination);
      source.connect(hearGain);
      hearGain.connect(audioContext.destination);
      syncHearButton();

      processor.onaudioprocess = (event) => {
        if (ended || flushing || video?.paused) {
          return;
        }

        const channel = event.inputBuffer.getChannelData(0);
        const level = rms(channel);
        latestRms = latestRms === 0 ? level : (latestRms * 0.65) + (level * 0.35);
        heldRms = Math.max(latestRms, heldRms * 0.97);
        receivedFrames += 1;
        reportCapture();

        if (writingPaused) {
          return;
        }

        const copy = new Float32Array(channel.length);
        copy.set(channel);
        pushSamples(resampleLinear(copy, audioContext.sampleRate, SAMPLE_RATE));
      };

      void loadTranscriber(modelKey, onModelStatus).then(() => {
        modelStatus = "";
        reportCapture(true);
      }).catch((error) => {
        const message = error?.message || "The speech model couldn't load.";
        modelStatus = message;

        if (isActive() && !ended) {
          reportCapture(true);
        }
      });

      try {
        await video.play();
      } catch {
        syncPlayButton();
        onStatus("Press Play on the stream preview to start listening.");
        reportCapture(true);
        return;
      }

      // Unmute into the Web Audio graph so Whisper receives samples. Hear gain
      // stays at 0 unless the user turns speakers on.
      video.muted = false;
      video.defaultMuted = false;
      syncPlayButton();
      syncWriteButton();
      reportCapture(true);
    })();

    return {
      ready,
      resume: () => {
        if (audioContext?.state === "suspended") {
          return audioContext.resume();
        }

        return Promise.resolve();
      },
      finish: async () => {
        flushing = true;
        writingPaused = true;
        video?.pause?.();
        await ready.catch(() => {});
        await requestPump();
        teardown();
      },
      cancel: () => {
        teardown();
      }
    };
  };

  return {
    start,
    normalizedUrl,
    readLastUrl,
    writeLastUrl
  };
};
