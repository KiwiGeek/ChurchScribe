(function (root) {
  // The transcript stays in the note while listening. Make notes sends only
  // the selected passage, and listening can keep going. Scripture is a
  // reference, not a quotation.
  const SYSTEM_PROMPT = [
    "You turn one recorded sermon message into notes. The transcript is automatic speech recognition: expect filler, repeated readings, and misheard words. A church service can contain several messages. You are given only the passage the user selected, not the other messages. Reply with JSON only, no markdown:",
    "",
    "{\"sermonTitle\":\"Faithful Waiters\",\"blocks\":[{\"type\":\"paragraph\",\"text\":\"...\"},{\"type\":\"list\",\"items\":[\"...\",\"...\"]}]}",
    "",
    "sermonTitle is required. If the speaker states the name of the sermon or sermonette, copy that name. If they never state one, suggest a short title from what the message is about. Put that name only in sermonTitle so the app can parse it. Do not leave sermonTitle empty.",
    "",
    "Do not copy verse text into the notes. Write scripture as a reference, such as Luke 2:29-32, because the app opens the passage from that reference. Include the wording of a verse only when the speaker's point depends on a specific phrase, and then quote only that short phrase.",
    "",
    "How the notes should read:",
    "Write short notes. Not an essay, and not a bullet for every line. One idea gets one short paragraph: usually a single sentence, or two when the second sentence is the reference or the phrase the point turns on. Do not merge several ideas into a long paragraph, and do not add words just so it sounds like prose.",
    "Use a list only when the speaker is actually enumerating, such as a run of passages to hear or a set of parallel lessons. Each list item is a few words. Two or three items can stay in one sentence instead.",
    "",
    "Say the idea once. Name an illustration without retelling the story. For an application, say what the speaker asked the listener to do or remember. Put the scripture reference in that sentence, or on the next short line if that is clearer. A line that is only the reference can be its own paragraph. You may set kind to \"scripture\" on that line, \"illustration\" when the paragraph is a story, or \"application\" when it is a charge to the listener. Otherwise omit kind. Do not also type those labels in the text.",
    "",
    "Scripture references:",
    "The speaker may cite the wrong passage. If the words they read or the point they make belong to a different verse, write the reference that matches what they actually said.",
    "The speaker may give only part of a reference, such as the book and chapter but not the verse. Fill in the missing verse or verses when the passage they are discussing identifies them. If you cannot tell which verse they mean, keep the partial reference they gave.",
    "Do not leave out a scripture the speaker referred to. A run of passages they tell people to hear still belongs in the notes, each reference included, without the verse text. Put a short run in a sentence. Use a list when there are enough of them that a sentence would be hard to read.",
    "Write references as Book chapter:verse, for example John 1:14 or Hebrews 10:35-39.",
    "",
    "How long the notes should be:",
    "Summarize. Do not retell the transcript, and do not write a second sentence that only repeats the first.",
    "A long selection is still a short set of notes. Fold a stretch of related names, dates, and places into one or two sentences. Keep each turning point, scripture, illustration, and application. Do not make a separate line for every person, year, or place.",
    "Do not drop a turning point, illustration, application, or scripture just to make the notes shorter. Keep it, and say it briefly.",
    "",
    "Also:",
    "Skip greetings, thanks for music, head counts, travel talk, and other housekeeping unless the speaker makes it part of the sermon.",
    "Repair an obvious mishearing when the sentence makes the word clear. Do not correct the speaker's theology, and do not drop a caveat such as \"we cannot be sure.\"",
    "Do not add a passage the speaker never brought up, and do not write the later sermon they postpone.",
    "",
    "Example:",
    "Transcript: \"The title of the sermon is Faithful Waiters. I do not mean table waiters. Let's read Luke 2:29-32. In John 1:14 the word for dwelt was tabernacled. He left us with three lessons: wait, watch, and worship.\"",
    "{\"sermonTitle\":\"Faithful Waiters\",\"blocks\":[{\"type\":\"paragraph\",\"text\":\"Faithful waiting, not serving tables.\"},{\"type\":\"paragraph\",\"text\":\"Simeon's song is Luke 2:29-32.\"},{\"type\":\"paragraph\",\"text\":\"In John 1:14, \\\"dwelt\\\" means tabernacled.\"},{\"type\":\"list\",\"items\":[\"Wait.\",\"Watch.\",\"Worship.\"]}]}",
    "",
    "Transcript with no spoken title: \"Simeon and Anna waited in the temple and saw the child.\"",
    "{\"sermonTitle\":\"Simeon and Anna Waited\",\"blocks\":[{\"type\":\"paragraph\",\"text\":\"Simeon and Anna waited in the temple and saw the child.\"}]}"
  ].join("\n");

  const KINDS = new Set(["point", "subpoint", "scripture", "illustration", "application"]);
  const LABELS = {
    illustration: "Illustration: ",
    application: "Application: "
  };

  const normalized = (text) => String(text || "").replace(/\s+/g, " ").trim();

  const wordCount = (text) => normalized(text).split(" ").filter(Boolean).length;

  const tightenScripture = (text) => {
    const sentences = text.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter(Boolean);
    const kept = sentences.filter((sentence) => /\d+:\d+/.test(sentence) || wordCount(sentence) <= 8);
    const keptText = normalized(kept.join(" "));

    if (keptText && wordCount(keptText) <= 45 && /\d+:\d+/.test(keptText)) {
      return keptText;
    }

    if (/\d+:\d+/.test(text)) {
      const refs = text.match(/[1-3]?\s?[A-Za-z][A-Za-z.]+(?:\s+[A-Za-z][A-Za-z.]+){0,3}\s+\d+:\d+(?:\s*[-–]\s*\d+)?/g);
      if (refs?.length) {
        return [...new Set(refs.map((ref) => ref.replace(/\s+/g, " ").trim()))].join("; ");
      }
    }

    const mentionsPassage = /\b(?:[1-3]\s)?[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+(?:chapter\s+)?\d+\b/.test(text);

    if (!mentionsPassage && wordCount(text) > 18) {
      return "";
    }

    return keptText || text;
  };

  const parseSermonNoteReply = (raw) => {
    const source = String(raw || "").trim();
    const fenced = source.match(/```(?:json)?\s*([\s\S]*?)```/);
    const body = fenced ? fenced[1] : source;
    const start = body.indexOf("{");
    const end = body.lastIndexOf("}");

    if (start < 0 || end <= start) {
      throw new Error("Notes reply was not JSON.");
    }

    const parsed = parseNotesJson(body.slice(start));
    const sermonTitle = normalized(parsed.sermonTitle);

    const paragraphFrom = (text, kind) => {
      const resolvedKind = KINDS.has(kind) ? kind : "point";
      let cleaned = normalized(text);

      if (!cleaned || resolvedKind === "title") {
        return null;
      }

      if (resolvedKind === "scripture") {
        cleaned = tightenScripture(cleaned);
      }

      return cleaned ? { type: "paragraph", kind: resolvedKind, text: cleaned } : null;
    };

    const blocks = Array.isArray(parsed.blocks)
      ? parsed.blocks.flatMap((block) => {
        if (block?.type === "list") {
          const items = (Array.isArray(block.items) ? block.items : []).map((item) => {
            const text = normalized(typeof item === "string" ? item : item?.text);

            if (!text) {
              return null;
            }

            return /\d+:\d+/.test(text) && wordCount(text) > 25 ? tightenScripture(text) : text;
          }).filter(Boolean);

          return items.length ? [{ type: "list", items }] : [];
        }

        const paragraph = paragraphFrom(block?.text, block?.kind);
        return paragraph ? [paragraph] : [];
      })
      : (Array.isArray(parsed.bullets) ? parsed.bullets : [])
        .map((item) => paragraphFrom(item?.text, item?.kind))
        .filter(Boolean);

    return { sermonTitle, blocks, truncated: Boolean(parsed.truncated) };
  };

  const lastBraceOutsideString = (text) => {
    let inString = false;
    let escape = false;
    let last = -1;

    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];

      if (inString) {
        if (escape) {
          escape = false;
          continue;
        }

        if (character === "\\") {
          escape = true;
          continue;
        }

        if (character === "\"") {
          inString = false;
        }

        continue;
      }

      if (character === "\"") {
        inString = true;
        continue;
      }

      if (character === "}") {
        last = index;
      }
    }

    return last;
  };

  const closersFor = (text) => {
    let inString = false;
    let escape = false;
    const stack = [];

    for (const character of text) {
      if (inString) {
        if (escape) {
          escape = false;
          continue;
        }

        if (character === "\\") {
          escape = true;
          continue;
        }

        if (character === "\"") {
          inString = false;
        }

        continue;
      }

      if (character === "\"") {
        inString = true;
        continue;
      }

      if (character === "{" || character === "[") {
        stack.push(character);
      } else if ((character === "}" || character === "]") && stack.length) {
        stack.pop();
      }
    }

    return stack.reverse().map((opener) => (opener === "{" ? "}" : "]")).join("");
  };

  const parseNotesJson = (jsonText) => {
    try {
      return JSON.parse(jsonText);
    } catch {
      const end = lastBraceOutsideString(jsonText);

      if (end < 0) {
        throw new Error("Notes reply was not JSON.");
      }

      const closed = jsonText.slice(0, end + 1).replace(/,\s*$/, "") + closersFor(jsonText.slice(0, end + 1));
      const parsed = JSON.parse(closed);
      parsed.truncated = true;
      return parsed;
    }
  };

  const describeApiEvent = (payload, characters) => {
    const type = payload?.type || "event";

    if (type === "message_start") {
      return "Anthropic: message_start — started a reply.";
    }

    if (type === "content_block_start") {
      return "Anthropic: content_block_start — sending the notes.";
    }

    if (type === "content_block_delta") {
      return `Anthropic: content_block_delta — ${characters} characters.`;
    }

    if (type === "message_delta") {
      const reason = payload.delta?.stop_reason;
      return reason
        ? `Anthropic: message_delta — finishing (${reason}).`
        : "Anthropic: message_delta — finishing.";
    }

    if (type === "message_stop") {
      return "Anthropic: message_stop — finished sending.";
    }

    if (type === "ping") {
      return "Anthropic: ping — still connected.";
    }

    if (type === "error") {
      return `Anthropic: error — ${payload.error?.message || "the request failed."}`;
    }

    return `Anthropic: ${type}.`;
  };

  const createSermonNotes = (deps) => {
    const {
      noteEditor,
      linkifyScriptureReferences,
      saveActiveNote,
      updateNoteEditorPlaceholderState,
      showToast,
      readApiKey,
      getActiveNoteId,
      chooseSermonTitleField,
      dictateNotesButton,
      dictateMenu,
      dictateMenuButton,
      windowObject,
      documentObject
    } = deps;

    let dictation = null;
    let active = false;
    let notesButtonBound = false;
    const requests = new Set();

    const toast = (message) => {
      showToast(message, { durationMs: 5200 });
    };

    const reveal = (element) => {
      if (!element) {
        return;
      }

      const line = element.getBoundingClientRect();
      const editor = noteEditor.getBoundingClientRect();

      if (line.bottom > editor.bottom - 12) {
        noteEditor.scrollTop += line.bottom - editor.bottom + 24;
      } else if (line.top < editor.top) {
        noteEditor.scrollTop -= editor.top - line.top + 12;
      }
    };

    const statusLine = () => noteEditor.querySelector("[data-sermon-notes-status]");

    const showStatus = (message, anchor) => {
      let line = statusLine();

      if (!line) {
        line = documentObject.createElement("p");
        line.dataset.sermonNotesStatus = "true";
        line.className = "sermon-notes-status";
        line.setAttribute("contenteditable", "false");
      }

      line.textContent = message;

      if (!line.parentNode) {
        if (anchor?.parentNode === noteEditor) {
          anchor.after(line);
        } else {
          noteEditor.append(line);
        }
      }

      reveal(line);
      return line;
    };

    const clearStatus = () => {
      statusLine()?.remove();
    };

    const watchQuiet = (state) => {
      state.timer = windowObject.setInterval(() => {
        const quietFor = Math.round((Date.now() - state.lastEventAt) / 1000);

        if (quietFor < 10) {
          return;
        }

        showStatus(
          `Anthropic has been quiet for ${quietFor}s. Last: ${state.lastLabel}`,
          state.anchor
        );
      }, 2000);
    };

    const appendNotes = (sermonTitle, blocks, anchor) => {
      if (!sermonTitle && !blocks.length) {
        return null;
      }

      const notesRoot = documentObject.createElement("div");
      notesRoot.dataset.sermonNotes = "true";
      notesRoot.className = "sermon-notes";
      const status = statusLine();

      if (status) {
        noteEditor.insertBefore(notesRoot, status);
      } else if (anchor?.parentNode === noteEditor) {
        anchor.after(notesRoot);
      } else {
        noteEditor.append(notesRoot);
      }

      let lastInserted = null;

      if (sermonTitle) {
        const title = documentObject.createElement("p");
        title.className = "sermon-notes-title";
        title.textContent = sermonTitle;
        notesRoot.append(title);
        lastInserted = title;
      }

      blocks.forEach((block) => {
        if (block.type === "list") {
          const list = documentObject.createElement("ul");
          notesRoot.append(list);

          block.items.forEach((text) => {
            const item = documentObject.createElement("li");
            item.dataset.sermonNote = "list";
            item.textContent = text;
            list.append(item);
            linkifyScriptureReferences({ jumpToCaretReference: false, scope: item });
            lastInserted = item;
          });

          return;
        }

        const paragraph = documentObject.createElement("p");
        paragraph.dataset.sermonNote = block.kind || "point";
        const label = LABELS[block.kind];

        if (label) {
          const marker = documentObject.createElement("span");
          marker.className = "sermon-note-label";
          marker.textContent = label;
          paragraph.append(marker);
        }

        paragraph.append(documentObject.createTextNode(block.text));
        notesRoot.append(paragraph);
        linkifyScriptureReferences({ jumpToCaretReference: false, scope: paragraph });
        lastInserted = paragraph;
      });

      updateNoteEditorPlaceholderState();
      saveActiveNote();
      reveal(lastInserted || notesRoot);
      return notesRoot;
    };

    const readEvents = async (response, onEvent) => {
      const reader = response.body?.getReader?.();

      if (!reader) {
        throw new Error("Anthropic did not stream a reply.");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let text = "";
      let stopReason = null;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split(/\r?\n\r?\n/);
        buffer = parts.pop() || "";

        parts.forEach((part) => {
          const data = part
            .split(/\r?\n/)
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trim())
            .join("\n");

          if (!data || data === "[DONE]") {
            return;
          }

          const payload = JSON.parse(data);
          onEvent(payload);

          if (payload.type === "content_block_delta" && payload.delta?.type === "text_delta") {
            text += payload.delta.text || "";
          }

          if (payload.type === "message_delta" && payload.delta?.stop_reason) {
            stopReason = payload.delta.stop_reason;
          }

          if (payload.type === "error") {
            throw new Error(payload.error?.message || "Anthropic returned an error.");
          }
        });
      }

      return { text, stopReason };
    };

    const notesUserMessage = (transcript, extraLines) => [
      "This is one selected passage from a message. Write notes only for this selection.",
      "sermonTitle is required. Use the name the speaker gives this sermon or sermonette. If they never name it, suggest a short title.",
      "Keep every scripture they refer to. Correct a wrong reference, and fill in a missing verse when the passage is clear. Do not quote the verse unless one short phrase is the point.",
      transcript.length > 6000
        ? "This selection is long. Group related names, dates, and places into a few short lines. Keep each turning point and every scripture. Do not give every person, year, or place its own line."
        : "Keep each note short: one idea, in one or two sentences. Do not drop a worthwhile point just to be shorter, and do not write a long paragraph.",
      "Use a list only when the speaker is actually enumerating.",
      ...extraLines,
      "",
      transcript
    ].join("\n");

    const readNotes = (text) => {
      try {
        return parseSermonNoteReply(text);
      } catch {
        return null;
      }
    };

    const requestNotes = async (transcript, noteId, anchor) => {
      const key = normalized(readApiKey?.() || "");

      if (!key) {
        showStatus("Add an Anthropic API key in Settings, under Beta, to write concise notes.", anchor);
        toast("Add an Anthropic API key in Settings, under Beta, to write concise notes.");
        return;
      }

      const state = {
        anchor,
        characters: 0,
        lastEventAt: Date.now(),
        lastLabel: "request sent"
      };
      const controller = new AbortController();
      requests.add(controller);
      showStatus("Sending this recording to Anthropic…", anchor);
      watchQuiet(state);

      try {
        const response = await windowObject.fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "content-type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 8192,
            temperature: 0.2,
            stream: true,
            system: SYSTEM_PROMPT,
            messages: [{
              role: "user",
              content: notesUserMessage(transcript, [])
            }]
          })
        });

        state.lastEventAt = Date.now();

        if (!response.ok) {
          let detail = "";

          try {
            const failure = await response.json();
            detail = failure?.error?.message || "";
          } catch {
            detail = "";
          }

          const message = response.status === 401 || response.status === 403
            ? "Anthropic rejected the API key. The transcript is still in the note."
            : `Anthropic returned ${response.status}${detail ? `: ${detail}` : ""}. The transcript is still in the note.`;
          showStatus(message, anchor);
          toast(message);
          return;
        }

        state.lastLabel = `HTTP ${response.status}`;
        showStatus(`Anthropic accepted the request (HTTP ${response.status}).`, anchor);

        const firstReply = await readEvents(response, (payload) => {
          if (payload.type === "content_block_delta" && payload.delta?.type === "text_delta") {
            state.characters += (payload.delta.text || "").length;
          }

          state.lastEventAt = Date.now();
          state.lastLabel = describeApiEvent(payload, state.characters);
          showStatus(state.lastLabel, anchor);
        });

        if (controller.signal.aborted || getActiveNoteId?.() !== noteId) {
          return;
        }

        let notes = readNotes(firstReply.text);

        if (firstReply.stopReason === "max_tokens" || !notes) {
          showStatus(
            firstReply.stopReason === "max_tokens"
              ? "That reply was cut off. Asking for a shorter set of notes…"
              : "That reply could not be read. Asking again for a shorter set of notes…",
            anchor
          );
          const retry = await windowObject.fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            signal: controller.signal,
            headers: {
              "content-type": "application/json",
              "x-api-key": key,
              "anthropic-version": "2023-06-01",
              "anthropic-dangerous-direct-browser-access": "true"
            },
            body: JSON.stringify({
              model: "claude-haiku-4-5-20251001",
              max_tokens: 8192,
              temperature: 0.2,
              stream: true,
              system: SYSTEM_PROMPT,
              messages: [{
                role: "user",
                content: notesUserMessage(transcript, [
                  "The previous reply was cut off because it was too long. Write at most 40 short lines. Group the history. Keep every scripture reference."
                ])
              }]
            })
          });

          if (controller.signal.aborted || getActiveNoteId?.() !== noteId) {
            return;
          }

          if (!retry.ok) {
            if (!notes) {
              throw new Error(`Anthropic returned ${retry.status}.`);
            }
          } else {
            try {
              state.characters = 0;
              const secondReply = await readEvents(retry, (payload) => {
                if (payload.type === "content_block_delta" && payload.delta?.type === "text_delta") {
                  state.characters += (payload.delta.text || "").length;
                }

                state.lastEventAt = Date.now();
                state.lastLabel = describeApiEvent(payload, state.characters);
                showStatus(state.lastLabel, anchor);
              });
              notes = readNotes(secondReply.text) || notes;
            } catch (retryError) {
              if (!notes) {
                throw retryError;
              }
            }
          }
        }

        if (!notes) {
          throw new Error("Notes reply was not JSON.");
        }
        showStatus("Writing the notes into the entry…", anchor);
        appendNotes(notes.sermonTitle, notes.blocks, anchor);
        clearStatus();

        if (notes.truncated) {
          toast("Part of the reply was cut off. The notes above are what arrived.");
        }

        if (notes.sermonTitle && getActiveNoteId?.() === noteId) {
          await chooseSermonTitleField?.(notes.sermonTitle);
        }
      } catch (error) {
        if (error?.name === "AbortError" || controller.signal.aborted) {
          return;
        }

        const message = String(error?.message || "");
        const visible = message === "Notes reply was not JSON." || error instanceof SyntaxError
          ? "Anthropic's reply could not be read. The transcript is still in the note."
          : message
            ? `${message.startsWith("Anthropic") ? message : `Anthropic: ${message}`} The transcript is still in the note.`
            : "Anthropic didn't finish. The transcript is still in the note.";
        showStatus(visible, anchor);
        toast(visible);
      } finally {
        if (state.timer) {
          windowObject.clearInterval(state.timer);
        }

        requests.delete(controller);
      }
    };

    const selectionBlock = (node) => {
      let current = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;

      while (current && current.parentElement !== noteEditor) {
        current = current.parentElement;
      }

      return current?.parentElement === noteEditor ? current : null;
    };

    const summarizeSelection = () => {
      if (dictateMenu) {
        dictateMenu.hidden = true;
      }

      dictateMenuButton?.setAttribute("aria-expanded", "false");

      const selection = windowObject.getSelection?.();
      const range = selection && selection.rangeCount ? selection.getRangeAt(0) : null;
      const insideEditor = range && noteEditor.contains(range.commonAncestorContainer);

      if (!range || range.collapsed || !insideEditor) {
        toast("Select the passage to turn into notes.");
        return;
      }

      const transcript = normalized(selection.toString());

      if (!transcript) {
        toast("Select the passage to turn into notes.");
        return;
      }

      const anchor = selectionBlock(range.endContainer) || selectionBlock(range.startContainer);
      void requestNotes(transcript, getActiveNoteId?.() ?? null, anchor);
    };

    const bindNotesButton = () => {
      if (!dictateNotesButton || notesButtonBound) {
        return;
      }

      notesButtonBound = true;
      dictateNotesButton.addEventListener("mousedown", (event) => {
        event.preventDefault();
      });
      dictateNotesButton.addEventListener("click", () => {
        if (!active) {
          return;
        }

        summarizeSelection();
      });
    };

    const enable = () => {
      active = true;
      bindNotesButton();

      if (dictateNotesButton) {
        dictateNotesButton.hidden = false;
      }

      dictation?.setPhraseConsumer(null);
      dictation?.setSessionStartListener(null);
      dictation?.setSessionEndListener(null);
      dictation?.setParagraphListener(null);
    };

    const disable = () => {
      active = false;

      if (dictateNotesButton) {
        dictateNotesButton.hidden = true;
      }

      requests.forEach((controller) => controller.abort());
      clearStatus();
      dictation?.setPhraseConsumer(null);
      dictation?.setSessionStartListener(null);
      dictation?.setParagraphListener(null);
      dictation?.setSessionEndListener(null);
    };

    return {
      attach(dictationApi) {
        dictation = dictationApi;
      },
      enable,
      disable
    };
  };

  root.ScriptoriaModules = root.ScriptoriaModules || {};
  root.ScriptoriaModules.createSermonNotes = createSermonNotes;
  root.ScriptoriaModules.sermonNoteInstructions = SYSTEM_PROMPT;
  root.ScriptoriaModules.parseSermonNoteReply = parseSermonNoteReply;
})(typeof window === "undefined" ? globalThis : window);
