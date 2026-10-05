window.ScriptoriaModules = window.ScriptoriaModules || {};

// Tab-audio dictation. The audio is the tab's own output, tapped inside the
// browser, not a loopback of the speakers. Master volume mute happens later,
// so this stream still carries the tab's audio when the speakers are muted.
// Muting that tab itself silences the tap. SpeechRecognition cannot
// accept this stream, so each slice is transcribed in the browser.
window.ScriptoriaModules.createTabDictation = (deps) => {
  const {
    windowObject,
    documentObject,
    navigatorObject
  } = deps;

  const SAMPLE_RATE = 16000;
  // Whisper was trained on 30-second windows. Short slices are a big part of
  // why the tiny model sounded worse than the microphone recognizer.
  const CHUNK_SAMPLES = SAMPLE_RATE * 20;
  const FLUSH_SAMPLES = Math.floor(SAMPLE_RATE * 0.8);
  // The level meter treats this RMS as 100%. A quiet webcast often sits near 10%.
  const METER_FULL_SCALE = 0.05;
  // Skip a slice only when almost none of it rises above about 2% on that meter.
  // The previous cutoff was 0.008, about 16%, so a 10% webcast was discarded.
  const SILENCE_RMS = METER_FULL_SCALE * 0.02;
  const SPEECH_FRAME = 800;
  const MIN_SPEECH_FRAMES = 20;
  const TRANSFORMERS_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm";
  const WHISPER_MODELS = {
    tiny: "onnx-community/whisper-tiny",
    base: "onnx-community/whisper-base",
    small: "onnx-community/whisper-small",
    medium: "onnx-community/whisper-medium",
    turbo: "onnx-community/whisper-large-v3-turbo"
  };

  let transcriberPromise = null;
  let loadedTranscriber = null;
  let loadedModelKey = null;

  const whisperLanguage = () => {
    const code = (navigatorObject.language || "en").slice(0, 2).toLowerCase();
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

  // Pauses in a 20-second window pull the average down. Count short frames that
  // clear the floor instead, so quiet speech separated by silence still counts.
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

  const canUseWebGpu = async () => {
    if (!navigatorObject.gpu?.requestAdapter) {
      return false;
    }

    try {
      const adapter = await navigatorObject.gpu.requestAdapter();
      return Boolean(adapter);
    } catch {
      // Chrome may expose navigator.gpu before WebGPU is actually usable
      // (for example when the unsafe-webgpu flag is still off).
      return false;
    }
  };

  const friendlyLoadError = (error) => {
    const raw = String(error?.message || error || "");
    const lower = raw.toLowerCase();

    if (lower.includes("unsafe") || lower.includes("webgpu") || lower.includes("gpu")) {
      return "The speech model couldn't use the GPU in this browser. Try again, or pick a smaller model.";
    }

    if (raw && raw.length < 160 && !lower.includes("chrome://")) {
      return raw;
    }

    return "The speech model couldn't load.";
  };

  const loadTranscriber = (modelKey, onStatus) => {
    const key = WHISPER_MODELS[modelKey] ? modelKey : "small";

    if (loadedTranscriber && loadedModelKey === key) {
      return Promise.resolve(loadedTranscriber);
    }

    if (transcriberPromise && loadedModelKey === key) {
      return transcriberPromise;
    }

    loadedTranscriber = null;
    loadedModelKey = key;
    const modelId = WHISPER_MODELS[key];
    const generation = (loadTranscriber.generation || 0) + 1;
    loadTranscriber.generation = generation;

    transcriberPromise = (async () => {
      const transformers = await import(TRANSFORMERS_URL);
      const { pipeline, env } = transformers;
      env.allowLocalModels = false;
      env.useBrowserCache = true;
      env.cacheName = "transformers-cache";

      let modelIsCached = false;

      try {
        const cache = await windowObject.caches?.open("transformers-cache");
        const keys = cache ? await cache.keys() : [];
        modelIsCached = keys.some((request) => request.url.includes(modelId));
      } catch {
        modelIsCached = false;
      }

      let downloadComplete = false;

      const progressCallback = (info) => {
        if (info?.status === "progress" && Number.isFinite(info.progress)) {
          const percent = Math.round(info.progress);
          const verb = modelIsCached ? "Loading saved speech model" : "Downloading speech model";
          onStatus(`${verb} ${percent}%`);

          if (percent >= 100) {
            downloadComplete = true;
          }

          return;
        }

        if (downloadComplete || info?.status === "done" || info?.status === "ready") {
          onStatus("Starting the speech model…");
        }
      };
      const dtypeFor = (device) => {
        const large = key === "turbo";

        if (device === "webgpu") {
          return {
            encoder_model: large ? "fp16" : "fp32",
            decoder_model_merged: "q4"
          };
        }

        return {
          encoder_model: large ? "q8" : "fp32",
          decoder_model_merged: "q8"
        };
      };
      // Only try WebGPU when an adapter is really available. navigator.gpu can
      // exist while Chrome still needs a flag, and that failure used to flash
      // an "enable unsafe" message before the CPU fallback continued.
      const attempts = [];

      if (await canUseWebGpu()) {
        attempts.push({ device: "webgpu", dtype: dtypeFor("webgpu") });
      }

      attempts.push({ device: "wasm", dtype: dtypeFor("wasm") });
      let lastError = null;

      for (let index = 0; index < attempts.length; index += 1) {
        const options = attempts[index];

        try {
          downloadComplete = false;
          onStatus(options.device === "webgpu"
            ? "Loading the speech model on the GPU…"
            : "Loading the speech model…");
          const transcriber = await pipeline("automatic-speech-recognition", modelId, {
            ...options,
            progress_callback: progressCallback
          });

          if (generation !== loadTranscriber.generation) {
            return transcriber;
          }

          loadedTranscriber = transcriber;
          return transcriber;
        } catch (error) {
          lastError = error;

          if (index < attempts.length - 1) {
            onStatus("GPU unavailable here — loading the CPU model…");
          }
        }
      }

      throw new Error(friendlyLoadError(lastError));
    })().catch((error) => {
      if (generation === loadTranscriber.generation) {
        transcriberPromise = null;
        loadedModelKey = null;
      }

      throw error;
    });

    return transcriberPromise;
  };

  const captureConstraints = [
    {
      video: { displaySurface: "browser" },
      audio: {
        suppressLocalAudioPlayback: true,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      },
      preferCurrentTab: false,
      selfBrowserSurface: "exclude",
      systemAudio: "exclude",
      monitorTypeSurfaces: "exclude"
    },
    {
      video: true,
      audio: { suppressLocalAudioPlayback: true },
      selfBrowserSurface: "exclude",
      monitorTypeSurfaces: "exclude"
    },
    {
      video: true,
      audio: true
    }
  ];

  const openTabStream = async () => {
    const mediaDevices = navigatorObject.mediaDevices;

    if (!mediaDevices?.getDisplayMedia) {
      const error = new Error("Tab audio isn't available in this browser.");
      error.name = "NotSupportedError";
      throw error;
    }

    let lastError = null;

    for (const constraints of captureConstraints) {
      try {
        return await mediaDevices.getDisplayMedia(constraints);
      } catch (error) {
        if (error?.name === "NotAllowedError" || error?.name === "AbortError") {
          throw error;
        }

        lastError = error;
      }
    }

    throw lastError || new Error("Tab audio couldn't start.");
  };

  const start = ({ isActive, onPhrase, onStatus, onEnded, modelKey = "small" }) => {
    let stream = null;
    let preview = null;
    let audioContext = null;
    let processor = null;
    let source = null;
    let silent = null;
    let ended = false;
    let flushing = false;
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

    const teardown = () => {
      ended = true;
      processor?.disconnect();
      source?.disconnect();
      silent?.disconnect();
      processor = null;
      source = null;
      silent = null;

      if (preview) {
        preview.pause();
        preview.srcObject = null;
        preview.remove();
        preview = null;
      }

      stream?.getTracks().forEach((track) => track.stop());
      stream = null;

      if (audioContext && audioContext.state !== "closed") {
        void audioContext.close();
      }

      audioContext = null;
    };

    let audioTrack = null;
    let latestRms = 0;
    let heldRms = 0;
    let receivedFrames = 0;
    let lastReport = 0;
    let phase = "capture";
    let outcome = "";
    let modelStatus = "";

    const levelLabel = () => {
      if (audioTrack?.muted || audioTrack?.enabled === false) {
        return "tab track muted";
      }

      if (audioContext && audioContext.state !== "running") {
        return "audio paused";
      }

      if (heldRms < SILENCE_RMS) {
        return "silent";
      }

      const level = meterPercent(heldRms);
      return `level ${level}%`;
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

      if (!receivedFrames) {
        audio = "Waiting for audio frames from the tab";
      } else if (phase === "transcribe") {
        const waiting = Math.floor(buffered / SAMPLE_RATE);
        audio = `Transcribing the last slice · still receiving audio (${signal}) · ${waiting}s waiting`;
      } else if (signal === "silent" || signal === "tab track muted" || signal === "audio paused") {
        audio = `No speech coming through (${signal}) · ${seconds}s of 20s`;
      } else {
        audio = `Hearing the tab (${signal}) · ${seconds}s of 20s`;
      }

      const parts = [];

      if (outcome && phase !== "transcribe") {
        parts.push(outcome);
      }

      parts.push(audio);

      if (modelStatus) {
        parts.push(modelStatus);
      }

      onStatus(parts.join(" · "));
    };

    const onModelStatus = (message) => {
      modelStatus = message;
      reportCapture(true);
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
      if (!samples.length || ended || flushing) {
        return;
      }

      pieces.push(samples);
      buffered += samples.length;
      void requestPump();
    };

    const ready = (async () => {
      onStatus("Choose a tab and turn on Share tab audio.");
      stream = await openTabStream();

      if (!isActive()) {
        teardown();
        return;
      }

      const audioTracks = stream.getAudioTracks();
      audioTrack = audioTracks[0] || null;

      if (!audioTracks.length) {
        teardown();
        const error = new Error("Turn on Share tab audio. This still works when your speakers are muted. Mute that tab itself and the audio stops.");
        error.name = "NoAudioTrack";
        throw error;
      }

      // Keep the video track alive. Stopping it can end the whole capture,
      // including the audio, on some browsers. The preview stays muted so
      // Scriptoria does not play the captured tab on top of the original tab.
      preview = documentObject.createElement("video");
      preview.muted = true;
      preview.defaultMuted = true;
      preview.playsInline = true;
      preview.setAttribute("aria-hidden", "true");
      preview.tabIndex = -1;
      preview.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none";
      documentObject.body.append(preview);
      preview.srcObject = stream;
      void preview.play().catch(() => {});

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

      const audioStream = new windowObject.MediaStream(audioTracks);
      source = audioContext.createMediaStreamSource(audioStream);
      processor = audioContext.createScriptProcessor(4096, 1, 1);
      silent = audioContext.createGain();
      silent.gain.value = 0;
      source.connect(processor);
      // The graph has to stay pulled, but the samples written onward are
      // silence. The captured tab is not routed to the speakers from here.
      processor.connect(silent);
      silent.connect(audioContext.destination);

      processor.onaudioprocess = (event) => {
        if (ended || flushing) {
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

      audioTracks[0].addEventListener("ended", () => {
        if (!ended) {
          onEnded();
        }
      });

      // Warm the model while the first slice of audio arrives.
      void loadTranscriber(modelKey, onModelStatus).then(() => {
        modelStatus = "";
        reportCapture(true);
      }).catch((error) => {
        modelStatus = error?.message || "The speech model couldn't load.";

        if (isActive() && !ended) {
          reportCapture(true);
        }
      });
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
        await ready.catch(() => {});
        await requestPump();
        teardown();
      },
      cancel: () => {
        teardown();
      }
    };
  };

  return { start, loadTranscriber };
};
