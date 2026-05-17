window.ScriptoriaModules = window.ScriptoriaModules || {};

// Layout constants for embedded media.  MIN_EMBED_WIDTH is the lower bound for
// resizing an embed (anything narrower stops behaving like a block-level
// figure); EDITOR_HORIZONTAL_PADDING is the inset between the editor's content
// box and its inner padding edge, used when computing how wide an embed can
// grow before bumping the edge.  Both are consumed only by this module.
const MIN_EMBED_WIDTH = 240;
const EDITOR_HORIZONTAL_PADDING = 40;

window.ScriptoriaModules.createEditorMedia = (deps) => {
  const {
    noteEditor,
    insertImageButton,
    insertImageFile,
    ensureTrailingParagraph,
    saveActiveNote,
    saveEditorSelection,
    restoreEditorSelection,
    closeTableContextMenu,
    focusTableCell,
    openTableContextMenu,
    refreshTableUi,
    jumpToScripture,
    imageEmbedClass,
    pdfEmbedClass,
    embedBaseClass,
    windowObject,
    documentObject
  } = deps;

  // Embed CSS selector is derived from the embedBaseClass dep (which is the
  // EmbedBase constructor exposed by embed/base.js) so we don't duplicate the
  // selector string anywhere.
  const embedSelector = embedBaseClass.selector;

  let savedSelectionForImageInsert = null;

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });

  const getTopLevelEditorBlock = (node) => {
    let block = node;

    while (block && block.parentNode !== noteEditor) {
      block = block.parentNode;
    }

    return block && block !== noteEditor ? block : null;
  };

  const insertEmbedAtCaret = (embed) => {
    noteEditor.focus();
    const emptyParagraph = documentObject.createElement("p");
    emptyParagraph.innerHTML = "<br>";

    const selection = windowObject.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      if (noteEditor.contains(range.commonAncestorContainer)) {
        const block = getTopLevelEditorBlock(range.startContainer);

        if (block) {
          const blockText = block.textContent.trim();
          const blockHtml = block.innerHTML?.trim() ?? "";

          if (!blockText && (!blockHtml || blockHtml === "<br>")) {
            block.replaceWith(embed, emptyParagraph);
          } else {
            block.after(embed, emptyParagraph);
          }
        } else {
          noteEditor.append(embed, emptyParagraph);
        }
      } else {
        noteEditor.append(embed, emptyParagraph);
      }
    } else {
      noteEditor.append(embed, emptyParagraph);
    }

    const newRange = documentObject.createRange();
    newRange.setStart(emptyParagraph, 0);
    newRange.collapse(true);
    const selectionAfterInsert = windowObject.getSelection();
    selectionAfterInsert.removeAllRanges();
    selectionAfterInsert.addRange(newRange);

    saveActiveNote();
  };

  const insertImageAtCaret = (src, width = imageEmbedClass.DEFAULT_WIDTH) => {
    insertEmbedAtCaret(new imageEmbedClass().create(src, { width }));
  };

  const insertPdfAtCaret = (src, options = {}) => {
    const dataUrl = pdfEmbedClass.normalizeDataUrl(src);
    insertEmbedAtCaret(new pdfEmbedClass().create(dataUrl, options));
  };

  const processImageFiles = (files) => {
    [...files].forEach((file) => {
      if (!file.type.startsWith("image/")) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        insertImageAtCaret(event.target.result);
      };

      reader.readAsDataURL(file);
    });
  };

  const processPdfFiles = (files) => {
    [...files].forEach((file) => {
      if (!pdfEmbedClass.isPdfFile(file)) {
        return;
      }

      readFileAsDataUrl(file)
        .then((dataUrl) => {
          insertPdfAtCaret(dataUrl, { sourceName: file.name });
        })
        .catch((error) => {
          console.warn("Unable to insert dropped PDF.", error);
        });
    });
  };

  const sanitizePastedHtml = (html) => {
    const temp = documentObject.createElement("div");
    temp.innerHTML = html;

    const BLOCK_PASS = new Set(["p", "ul", "ol", "li", "blockquote"]);
    const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
    const INLINE_PASS = new Set(["b", "strong", "i", "em", "u"]);
    const DROP_SUBTREE = new Set([
      "script",
      "style",
      "noscript",
      "svg",
      "video",
      "audio",
      "canvas",
      "iframe",
      "object",
      "embed",
      "picture"
    ]);
    const TABLE_CELL = new Set(["td", "th"]);
    const TABLE_STRUCT = new Set([
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "colgroup",
      "col",
      "caption"
    ]);
    const BLOCK_UNWRAP = new Set([
      "div",
      "section",
      "article",
      "main",
      "header",
      "footer",
      "nav",
      "aside",
      "figure",
      "figcaption",
      "form",
      "fieldset",
      "details",
      "summary",
      "html",
      "body"
    ]);
    const CELL_ATTRS = new Set(["colspan", "rowspan"]);

    const getFgColor = (el) => el.style?.color || null;

    const processChildren = (node) => {
      const out = [];
      for (const child of node.childNodes) {
        out.push(...processNode(child));
      }
      return out;
    };

    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return [node.cloneNode()];
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return [];
      }

      const tag = node.tagName.toLowerCase();

      if (DROP_SUBTREE.has(tag)) {
        return [];
      }

      const children = processChildren(node);

      if (tag === "br") {
        return [documentObject.createElement("br")];
      }

      if (HEADING_TAGS.has(tag)) {
        const el = documentObject.createElement("h2");
        const color = getFgColor(node);
        if (color) el.style.color = color;
        children.forEach((ch) => el.appendChild(ch));
        return [el];
      }

      if (BLOCK_PASS.has(tag)) {
        const el = documentObject.createElement(tag);
        const color = getFgColor(node);
        if (color) el.style.color = color;
        children.forEach((ch) => el.appendChild(ch));
        return [el];
      }

      if (INLINE_PASS.has(tag)) {
        const el = documentObject.createElement(tag);
        const color = getFgColor(node);
        if (color) el.style.color = color;
        children.forEach((ch) => el.appendChild(ch));
        return [el];
      }

      if (tag === "span" || tag === "font" || tag === "mark") {
        const color = getFgColor(node);
        if (color) {
          const el = documentObject.createElement("span");
          el.style.color = color;
          children.forEach((ch) => el.appendChild(ch));
          return [el];
        }
        return children;
      }

      if (tag === "a") {
        const el = documentObject.createElement("a");
        const href = node.getAttribute("href");
        const target = node.getAttribute("target");
        if (href) el.setAttribute("href", href);
        if (target) el.setAttribute("target", target);
        const color = getFgColor(node);
        if (color) el.style.color = color;
        children.forEach((ch) => el.appendChild(ch));
        return [el];
      }

      if (TABLE_CELL.has(tag)) {
        const el = documentObject.createElement(tag);
        CELL_ATTRS.forEach((attr) => {
          const value = node.getAttribute(attr);
          if (value) el.setAttribute(attr, value);
        });
        const color = getFgColor(node);
        if (color) el.style.color = color;
        children.forEach((ch) => el.appendChild(ch));
        return [el];
      }

      if (TABLE_STRUCT.has(tag)) {
        const el = documentObject.createElement(tag);
        children.forEach((ch) => el.appendChild(ch));
        return [el];
      }

      if (BLOCK_UNWRAP.has(tag)) {
        const hasBlockChild = children.some(
          (child) =>
            child.nodeType === Node.ELEMENT_NODE &&
            (BLOCK_PASS.has(child.tagName.toLowerCase()) ||
              HEADING_TAGS.has(child.tagName.toLowerCase()) ||
              BLOCK_UNWRAP.has(child.tagName.toLowerCase()))
        );

        if (hasBlockChild || !children.length) {
          return children;
        }

        const el = documentObject.createElement("p");
        children.forEach((child) => el.appendChild(child));
        return [el];
      }

      return children;
    };

    const result = documentObject.createElement("div");
    processChildren(temp).forEach((node) => result.appendChild(node));
    return result.innerHTML;
  };

  const getDropRange = (event) => {
    if (documentObject.caretRangeFromPoint) {
      return documentObject.caretRangeFromPoint(event.clientX, event.clientY);
    }

    if (documentObject.caretPositionFromPoint) {
      const position = documentObject.caretPositionFromPoint(event.clientX, event.clientY);

      if (position) {
        const range = documentObject.createRange();
        range.setStart(position.offsetNode, position.offset);
        range.collapse(true);
        return range;
      }
    }

    return null;
  };

  const handleImagePickerClick = () => {
    savedSelectionForImageInsert = saveEditorSelection();
    insertImageFile.value = "";
    insertImageFile.click();
  };

  const handleImagePickerChange = () => {
    const files = [...insertImageFile.files];

    if (!files.length) {
      return;
    }

    noteEditor.focus();
    restoreEditorSelection(savedSelectionForImageInsert);
    savedSelectionForImageInsert = null;
    processImageFiles(files);
  };

  const handlePaste = (event) => {
    const imageItems = [...event.clipboardData.items].filter((item) => item.type.startsWith("image/"));

    if (imageItems.length) {
      event.preventDefault();
      imageItems.forEach((item) => {
        const file = item.getAsFile();
        if (!file) {
          return;
        }
        const reader = new FileReader();
        reader.onload = (loadEvent) => insertImageAtCaret(loadEvent.target.result);
        reader.readAsDataURL(file);
      });
      return;
    }

    const htmlData = event.clipboardData.getData("text/html");

    if (!htmlData) {
      return;
    }

    event.preventDefault();
    documentObject.execCommand("insertHTML", false, sanitizePastedHtml(htmlData));
  };

  const handleDragStart = (event) => {
    const embed = event.target.closest(embedSelector);

    if (!embed || !noteEditor.contains(embed)) {
      return;
    }

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", embed.outerHTML);
    event.dataTransfer.setData("application/x-scriptoria-embed", "true");
    embed.dataset.embedDragging = "true";
  };

  const handleDragEnd = () => {
    noteEditor.querySelectorAll("[data-embed-dragging]").forEach((el) => {
      el.removeAttribute("data-embed-dragging");
    });
  };

  const handleDragOver = (event) => {
    const types = [...event.dataTransfer.types];
    const isEmbedDrag = types.includes("application/x-scriptoria-embed")
      || types.includes("application/x-churchscribe-embed");

    if (types.includes("Files") || isEmbedDrag) {
      event.preventDefault();
      event.dataTransfer.dropEffect = types.includes("Files") ? "copy" : "move";
    }
  };

  const handleDrop = (event) => {
    const types = [...event.dataTransfer.types];

    if (types.includes("application/x-scriptoria-embed")
      || types.includes("application/x-churchscribe-embed")) {
      event.preventDefault();

      const embedHtml = event.dataTransfer.getData("text/html");
      const draggedEmbed = noteEditor.querySelector("[data-embed-dragging]");

      if (!embedHtml) {
        if (draggedEmbed) {
          draggedEmbed.removeAttribute("data-embed-dragging");
        }
        return;
      }

      const temp = documentObject.createElement("div");
      temp.innerHTML = embedHtml;
      const newEmbed = temp.firstElementChild;

      if (!newEmbed) {
        return;
      }

      newEmbed.removeAttribute("data-embed-dragging");

      const dropRange = getDropRange(event);
      let targetBlock = null;

      if (dropRange && noteEditor.contains(dropRange.commonAncestorContainer)) {
        let el = dropRange.startContainer;
        el = el.nodeType === Node.TEXT_NODE ? el.parentElement : el;

        while (el && el.parentElement !== noteEditor) {
          el = el.parentElement;
        }

        targetBlock = el && el !== noteEditor ? el : null;
      }

      if (draggedEmbed) {
        draggedEmbed.remove();
      }

      if (targetBlock) {
        targetBlock.before(newEmbed);
      } else {
        noteEditor.appendChild(newEmbed);
      }

      ensureTrailingParagraph();
      saveActiveNote();
      return;
    }

    const droppedFiles = [...event.dataTransfer.files];
    const mediaFiles = droppedFiles.filter((file) => file.type.startsWith("image/") || pdfEmbedClass.isPdfFile(file));

    if (!mediaFiles.length) {
      return;
    }

    event.preventDefault();

    const dropRange = getDropRange(event);

    if (dropRange && noteEditor.contains(dropRange.commonAncestorContainer)) {
      const selection = windowObject.getSelection();
      selection.removeAllRanges();
      selection.addRange(dropRange);
    }

    mediaFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        processImageFiles([file]);
      } else if (pdfEmbedClass.isPdfFile(file)) {
        processPdfFiles([file]);
      }
    });
  };

  const handleClick = (event) => {
    closeTableContextMenu();

    const deleteBtn = event.target.closest(
      ".embed-delete, .youtube-embed-delete, .spotify-embed-delete, .image-embed-delete"
    );

    if (deleteBtn) {
      event.preventDefault();
      const embed = deleteBtn.closest(embedSelector);

      if (embed) {
        embed.remove();
        ensureTrailingParagraph();
        saveActiveNote();
      }

      return;
    }

    const urlLink = event.target.closest("a[data-auto-url-link='true']");

    if (urlLink) {
      event.preventDefault();

      const osHandledSchemes = ["mailto:", "ftp:", "spotify:"];

      if (osHandledSchemes.some((scheme) => urlLink.href.startsWith(scheme))) {
        const tempLink = documentObject.createElement("a");
        tempLink.href = urlLink.href;
        tempLink.click();
      } else {
        windowObject.open(urlLink.href, "_blank", "noopener,noreferrer");
      }

      return;
    }

    const link = event.target.closest("a[data-auto-scripture-link='true']");

    if (!link) {
      return;
    }

    event.preventDefault();
    jumpToScripture(link.dataset.scriptureRef);
  };

  const handleContextMenu = (event) => {
    const cell = event.target.closest("td, th");

    if (!cell || !noteEditor.contains(cell)) {
      closeTableContextMenu();
      refreshTableUi();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    focusTableCell(cell);
    openTableContextMenu(cell, event.clientX, event.clientY);
    refreshTableUi();
  };

  const handleResizeMouseDown = (event) => {
    const handle = event.target.closest(
      ".embed-resize-handle, .youtube-embed-resize-handle, .image-embed-resize-handle"
    );

    if (!handle) {
      return;
    }

    event.preventDefault();

    const embedEl = handle.closest(embedSelector);

    if (!embedEl) {
      return;
    }

    const handler = embedBaseClass.findHandler(embedEl);
    const wrapper = handler ? handler.getWrapper(embedEl) : embedEl.firstElementChild;
    const mediaEl = handler ? handler.getMediaElement(embedEl) : embedEl.querySelector("iframe, img");

    if (!wrapper) {
      return;
    }

    const startX = event.clientX;
    const startWidth = wrapper.offsetWidth;
    const maxWidth = noteEditor.clientWidth - EDITOR_HORIZONTAL_PADDING;

    if (mediaEl) {
      mediaEl.style.pointerEvents = "none";
    }

    documentObject.body.style.cursor = "ew-resize";

    const onMouseMove = (moveEvent) => {
      const newWidth = Math.min(
        maxWidth,
        Math.max(MIN_EMBED_WIDTH, startWidth + (moveEvent.clientX - startX))
      );
      wrapper.style.width = `${newWidth}px`;
    };

    const onMouseUp = () => {
      if (mediaEl) {
        mediaEl.style.pointerEvents = "";
      }

      documentObject.body.style.cursor = "";
      documentObject.removeEventListener("mousemove", onMouseMove);
      documentObject.removeEventListener("mouseup", onMouseUp);
      saveActiveNote();
    };

    documentObject.addEventListener("mousemove", onMouseMove);
    documentObject.addEventListener("mouseup", onMouseUp);
  };

  const attach = () => {
    insertImageButton.addEventListener("click", handleImagePickerClick);
    insertImageFile.addEventListener("change", handleImagePickerChange);
    noteEditor.addEventListener("paste", handlePaste);
    noteEditor.addEventListener("dragstart", handleDragStart);
    noteEditor.addEventListener("dragend", handleDragEnd);
    noteEditor.addEventListener("dragover", handleDragOver);
    noteEditor.addEventListener("drop", handleDrop);
    noteEditor.addEventListener("click", handleClick);
    noteEditor.addEventListener("contextmenu", handleContextMenu);
    noteEditor.addEventListener("mousedown", handleResizeMouseDown);
    noteEditor.addEventListener("scriptoria:embed-updated", saveActiveNote);
  };

  return {
    insertImageAtCaret,
    insertPdfAtCaret,
    processImageFiles,
    processPdfFiles,
    sanitizePastedHtml,
    attach
  };
};
