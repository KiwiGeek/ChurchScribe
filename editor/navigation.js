window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createEditorNavigation = (deps) => {
  const {
    noteEditor,
    embedSelector,
    ensureTrailingParagraph,
    saveActiveNote,
    findAutoLinkAtCaret,
    windowObject,
    documentObject
  } = deps;

  const getEditorBlock = (node) => {
    let el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;

    while (el && el.parentElement !== noteEditor) {
      el = el.parentElement;
    }

    return el;
  };

  const handleBackspaceDeleteAroundObjects = (event) => {
    if (!["Backspace", "Delete"].includes(event.key)) {
      return;
    }

    const selection = windowObject.getSelection();

    if (!selection || !selection.rangeCount || !selection.isCollapsed) {
      return;
    }

    const range = selection.getRangeAt(0);
    const block = getEditorBlock(range.startContainer);

    if (event.key === "Backspace") {
      if (block) {
        const prevSibling = block.previousElementSibling;

        if (prevSibling?.matches(embedSelector)) {
          const blockRange = document.createRange();
          blockRange.selectNodeContents(block);
          const atBlockStart = range.compareBoundaryPoints(Range.START_TO_START, blockRange) === 0;

          if (atBlockStart) {
            event.preventDefault();
            prevSibling.remove();
            ensureTrailingParagraph();
            saveActiveNote();
            return;
          }
        }
      }

      if (block) {
        const blockHtml = block.innerHTML?.trim() ?? "";
        const isEmptyBlock = !block.textContent.trim() && (!blockHtml || blockHtml === "<br>");

        if (isEmptyBlock && block.previousElementSibling) {
          const prevBlock = block.previousElementSibling;
          const autoLinks = prevBlock.querySelectorAll(
            "a[data-auto-url-link='true'], a[data-auto-scripture-link='true']"
          );

          if (autoLinks.length) {
            const lastLink = autoLinks[autoLinks.length - 1];
            let trailingNode = lastLink.nextSibling;
            let onlyTrivialTrailing = true;

            while (trailingNode) {
              if (trailingNode.nodeType === Node.TEXT_NODE && trailingNode.nodeValue.trim()) {
                onlyTrivialTrailing = false;
                break;
              }

              if (trailingNode.nodeType === Node.ELEMENT_NODE && trailingNode.tagName !== "BR") {
                onlyTrivialTrailing = false;
                break;
              }

              trailingNode = trailingNode.nextSibling;
            }

            if (onlyTrivialTrailing) {
              event.preventDefault();
              const r = document.createRange();
              r.setStartAfter(lastLink);
              r.collapse(true);
              selection.removeAllRanges();
              selection.addRange(r);
              return;
            }
          }
        }
      }

      const autoLink = findAutoLinkAtCaret();

      if (!autoLink) {
        return;
      }

      event.preventDefault();
      const textNode = document.createTextNode(autoLink.textContent);
      autoLink.replaceWith(textNode);

      const newRange = document.createRange();
      newRange.setStart(textNode, textNode.textContent.length);
      newRange.collapse(true);

      selection.removeAllRanges();
      selection.addRange(newRange);
      saveActiveNote();
      return;
    }

    if (block) {
      const nextSibling = block.nextElementSibling;

      if (nextSibling?.matches(embedSelector)) {
        const blockRange = document.createRange();
        blockRange.selectNodeContents(block);
        const atBlockEnd = range.compareBoundaryPoints(Range.START_TO_END, blockRange) === 0;

        if (atBlockEnd) {
          event.preventDefault();
          nextSibling.remove();
          ensureTrailingParagraph();
          saveActiveNote();
        }
      }
    }
  };

  const handleArrowGhostNavigation = (event) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      return;
    }

    const sel = windowObject.getSelection();

    if (!sel || !sel.rangeCount || !sel.isCollapsed) {
      return;
    }

    const range = sel.getRangeAt(0);
    const block = getEditorBlock(range.startContainer);

    if (!block) {
      return;
    }

    const isAtBlockEnd = () => {
      const blockRange = document.createRange();
      blockRange.selectNodeContents(block);
      return range.compareBoundaryPoints(Range.START_TO_END, blockRange) === 0;
    };

    const isAtBlockStart = () => {
      const blockRange = document.createRange();
      blockRange.selectNodeContents(block);
      return range.compareBoundaryPoints(Range.START_TO_START, blockRange) === 0;
    };

    const isOnFirstVisualLine = () => {
      if (!block.textContent) return true;

      const r = document.createRange();
      r.setStart(block, 0);
      r.setEnd(range.startContainer, range.startOffset);

      return r.getClientRects().length <= 1;
    };

    const isOnLastVisualLine = () => {
      if (!block.textContent) return true;

      const r = document.createRange();
      r.setStart(range.startContainer, range.startOffset);
      r.setEnd(block, block.childNodes.length);

      return r.getClientRects().length <= 1;
    };

    const insertGhostAndFocus = (insertFn) => {
      event.preventDefault();
      const ghost = document.createElement("p");
      ghost.innerHTML = "<br>";
      ghost.dataset.embedGhost = "true";
      insertFn(ghost);
      const r = document.createRange();
      r.setStart(ghost, 0);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
    };

    const isGhostBlock = block.dataset.embedGhost === "true";

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      const atEnd = event.key === "ArrowDown" ? isOnLastVisualLine() : isAtBlockEnd();

      if (!atEnd) {
        return;
      }

      const nextEmbed = block.nextElementSibling;

      if (!nextEmbed || !nextEmbed.matches(embedSelector)) {
        return;
      }

      if (!isGhostBlock) {
        const afterNextEmbed = nextEmbed.nextElementSibling;

        if (!afterNextEmbed) {
          insertGhostAndFocus((ghost) => noteEditor.appendChild(ghost));
        } else if (afterNextEmbed.matches(embedSelector)) {
          insertGhostAndFocus((ghost) => nextEmbed.after(ghost));
        }
      } else {
        const afterNextEmbed = nextEmbed.nextElementSibling;

        if (!afterNextEmbed) {
          insertGhostAndFocus((ghost) => noteEditor.appendChild(ghost));
        } else if (afterNextEmbed.matches(embedSelector)) {
          insertGhostAndFocus((ghost) => nextEmbed.after(ghost));
        }
      }
    } else {
      const atStart = event.key === "ArrowUp" ? isOnFirstVisualLine() : isAtBlockStart();

      if (!atStart) {
        return;
      }

      const prevEmbed = block.previousElementSibling;

      if (!prevEmbed || !prevEmbed.matches(embedSelector)) {
        return;
      }

      if (!isGhostBlock) {
        const beforePrevEmbed = prevEmbed.previousElementSibling;

        if (!beforePrevEmbed) {
          insertGhostAndFocus((ghost) => noteEditor.prepend(ghost));
        } else if (beforePrevEmbed.matches(embedSelector)) {
          insertGhostAndFocus((ghost) => prevEmbed.before(ghost));
        }
      } else {
        const beforePrevEmbed = prevEmbed.previousElementSibling;

        if (!beforePrevEmbed) {
          insertGhostAndFocus((ghost) => noteEditor.prepend(ghost));
        } else if (beforePrevEmbed.matches(embedSelector)) {
          insertGhostAndFocus((ghost) => prevEmbed.before(ghost));
        }
      }
    }
  };

  const cleanupGhostParagraphs = () => {
    const sel = windowObject.getSelection();
    const container = sel && sel.rangeCount ? sel.getRangeAt(0).startContainer : null;

    noteEditor.querySelectorAll("[data-embed-ghost]").forEach((ghost) => {
      if (ghost.contains(container)) {
        return;
      }

      const empty = !ghost.textContent && (!ghost.innerHTML || ghost.innerHTML === "<br>");

      if (empty) {
        ghost.remove();
      } else {
        ghost.removeAttribute("data-embed-ghost");
      }
    });
  };

  const attach = () => {
    noteEditor.addEventListener("keydown", handleBackspaceDeleteAroundObjects);
    noteEditor.addEventListener("keydown", handleArrowGhostNavigation);
    documentObject.addEventListener("selectionchange", cleanupGhostParagraphs);
  };

  return {
    attach
  };
};
