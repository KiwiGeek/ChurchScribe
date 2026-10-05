window.ScriptoriaModules = window.ScriptoriaModules || {};

// Stream-URL dictation. An HLS (.m3u8) or direct media URL plays in a small
// preview. Audio is tapped through Web Audio for Whisper and is silent unless
// the user turns Hear on. Pausing the preview pauses transcription.
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
    let capturePaused = false;
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

    const levelLabel = () => {
      if (capturePaused || video?.paused) {
        return "paused";
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

      if (signal === "paused") {
        audio = "Stream paused · transcription waiting";
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

      if (outcome && phase !== "transcribe" && signal !== "paused") {
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
      playButton.setAttribute("aria-label", paused ? "Play stream" : "Pause stream");
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
      if (!samples.length || ended || flushing || capturePaused) {
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

      playButton = documentObject.createElement("button");
      playButton.type = "button";
      playButton.className = "ghost-button stream-dictation-play";
      playButton.textContent = "Pause";

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

      toolbar.append(playButton, hearButton, closeButton);

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

      panel.append(toolbar, video, seekInput, statusLine);
      documentObject.body.append(panel);

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

      hearButton.addEventListener("click", () => {
        hearEnabled = !hearEnabled;
        syncHearButton();
      });

      closeButton.addEventListener("click", () => {
        if (!ended) {
          onEnded();
        }
      });

      video.addEventListener("play", () => {
        capturePaused = false;
        syncPlayButton();
        void audioContext?.resume?.();
        reportCapture(true);
      });

      video.addEventListener("pause", () => {
        capturePaused = true;
        syncPlayButton();
        reportCapture(true);
      });

      video.addEventListener("ended", () => {
        capturePaused = true;
        syncPlayButton();
        reportCapture(true);

        if (!ended && isActive()) {
          onEnded();
        }
      });

      video.addEventListener("seeking", () => {
        // Drop the half-filled slice so a scrub does not glue old audio onto
        // the new position.
        pieces.length = 0;
        buffered = 0;
        latestRms = 0;
        heldRms = 0;
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
    };

    const attachMedia = async () => {
      const nativeHls = Boolean(video.canPlayType("application/vnd.apple.mpegurl"));

      if (looksLikeHls(mediaUrl) && !nativeHls) {
        const Hls = await loadHlsConstructor();

        if (!Hls.isSupported()) {
          const error = new Error("This browser can't play HLS streams. Try Safari, or open the stream in another tab and use Tab audio.");
          error.name = "NotSupportedError";
          throw error;
        }

        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false
        });

        await new Promise((resolve, reject) => {
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
        });

        return;
      }

      await new Promise((resolve, reject) => {
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
      });
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
      await attachMedia();

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
      // this graph. Hear gain stays at 0 unless the user turns speakers on.
      source = audioContext.createMediaElementSource(video);
      processor = audioContext.createScriptProcessor(4096, 1, 1);
      hearGain = audioContext.createGain();
      hearGain.gain.value = 0;
      source.connect(processor);
      processor.connect(hearGain);
      hearGain.connect(audioContext.destination);
      syncHearButton();

      processor.onaudioprocess = (event) => {
        if (ended || flushing || capturePaused || video?.paused) {
          return;
        }

        const channel = event.inputBuffer.getChannelData(0);
        const copy = new Float32Array(channel.length);
        copy.set(channel);
        const level = rms(channel);
        latestRms = latestRms === 0 ? level : (latestRms * 0.65) + (level * 0.35);
        heldRms = Math.max(latestRms, heldRms * 0.97);
        receivedFrames += 1;
        pushSamples(resampleLinear(copy, audioContext.sampleRate, SAMPLE_RATE));
        reportCapture();
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
        capturePaused = true;
        syncPlayButton();
        onStatus("Press Play on the stream preview to start listening.");
        reportCapture(true);
        return;
      }

      // Unmute into the Web Audio graph so Whisper receives samples. Hear gain
      // stays at 0 unless the user turns speakers on.
      video.muted = false;
      video.defaultMuted = false;
      capturePaused = false;
      syncPlayButton();
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
        capturePaused = true;
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
