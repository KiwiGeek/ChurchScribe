window.ScriptoriaModules = window.ScriptoriaModules || {};

window.ScriptoriaModules.createEditorLinks = (deps) => {
  const {
    noteEditor,
    getExplicitPattern,
    getContextualPattern,
    parseScriptureReference,
    parseExplicitReferenceParts,
    parseContextualScriptureReference,
    formatResolvedReference,
    getReferenceContext,
    jumpToResolvedScripture,
    domainValidationCache,
    urlLinkifyPatterns,
    windowObject
  } = deps;

  const EMBED_SELECTOR = window.EmbedBase.selector;

  const getCaretTextOffset = (root) => {
    const selection = windowObject.getSelection();

    if (!selection.rangeCount) {
      return null;
    }

    const range = selection.getRangeAt(0);

    if (!root.contains(range.startContainer)) {
      return null;
    }

    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(root);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  };

  const restoreCaretTextOffset = (root, targetOffset) => {
    if (targetOffset === null) {
      return;
    }

    const selection = windowObject.getSelection();
    const range = document.createRange();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let currentOffset = 0;
    let currentNode;

    while ((currentNode = walker.nextNode())) {
      const nextOffset = currentOffset + currentNode.nodeValue.length;

      if (targetOffset <= nextOffset) {
        range.setStart(currentNode, targetOffset - currentOffset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }

      currentOffset = nextOffset;
    }

    range.selectNodeContents(root);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const getEditorBlockContaining = (node) => {
    if (!node) {
      return null;
    }

    let element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;

    while (element && element.parentElement && element.parentElement !== noteEditor) {
      element = element.parentElement;
    }

    if (!element || element === noteEditor || !noteEditor.contains(element)) {
      return null;
    }

    return element.parentElement === noteEditor ? element : null;
  };

  const getCaretBlock = () => {
    const selection = windowObject.getSelection();

    if (!selection || !selection.rangeCount) {
      return null;
    }

    const range = selection.getRangeAt(0);

    if (!noteEditor.contains(range.startContainer)) {
      return null;
    }

    return getEditorBlockContaining(range.startContainer);
  };

  const unwrapAutoScriptureLinks = (root = noteEditor) => {
    root.querySelectorAll("a[data-auto-scripture-link='true']").forEach((link) => {
      link.replaceWith(document.createTextNode(link.textContent));
    });

    root.normalize();
  };

  const findScriptureContextBefore = (scope) => {
    if (!scope) {
      return null;
    }

    const allLinks = noteEditor.querySelectorAll("a[data-scripture-ref]");

    for (let i = allLinks.length - 1; i >= 0; i -= 1) {
      const link = allLinks[i];
      const cmp = scope.compareDocumentPosition(link);

      if ((cmp & Node.DOCUMENT_POSITION_PRECEDING) && !(cmp & Node.DOCUMENT_POSITION_CONTAINED_BY)) {
        const parsed = parseScriptureReference(link.dataset.scriptureRef);
        if (parsed) {
          return getReferenceContext(parsed);
        }
      }
    }

    return null;
  };

  const linkifyScriptureReferences = ({ jumpToCaretReference = false, scope = null } = {}) => {
    const root = (scope && noteEditor.contains(scope)) ? scope : noteEditor;
    const caretOffset = getCaretTextOffset(root);
    unwrapAutoScriptureLinks(root);
    const explicitPattern = getExplicitPattern();
    const contextualPattern = getContextualPattern();
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue.trim()) {
            return NodeFilter.FILTER_REJECT;
          }

          if (node.parentElement?.closest("a")) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let currentNode;
    let currentContext = root === noteEditor ? null : findScriptureContextBefore(root);
    let traversedOffset = 0;
    let lastReferenceBeforeCaret = null;

    while ((currentNode = walker.nextNode())) {
      textNodes.push(currentNode);
    }

    textNodes.forEach((textNode) => {
      const sourceText = textNode.nodeValue;
      explicitPattern.lastIndex = 0;
      contextualPattern.lastIndex = 0;
      const explicitMatches = [...sourceText.matchAll(explicitPattern)];
      const contextualMatches = [...sourceText.matchAll(contextualPattern)];
      const matches = [...explicitMatches, ...contextualMatches]
        .sort((left, right) => left.index - right.index);

      if (!matches.length) {
        traversedOffset += sourceText.length;
        return;
      }

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let hadResolvedMatch = false;

      matches.forEach((match) => {
        const matchedText = match[0];
        const resolvedParts = match.length > 2
          ? parseExplicitReferenceParts(matchedText).map((part) => ({
              text: part.text,
              parsedReference: part.parsedReference
            }))
          : [{
              text: matchedText,
              parsedReference: parseContextualScriptureReference(matchedText, currentContext)
            }].filter((part) => part.parsedReference);

        if (!resolvedParts.length) {
          return;
        }

        if (match.index > lastIndex) {
          fragment.append(document.createTextNode(sourceText.slice(lastIndex, match.index)));
        }

        resolvedParts.forEach((part) => {
          const link = document.createElement("a");
          link.href = "#";
          link.className = "scripture-link";
          link.dataset.autoScriptureLink = "true";
          link.dataset.scriptureRef = formatResolvedReference(part.parsedReference);
          link.textContent = part.text;
          fragment.append(link);
          currentContext = getReferenceContext(part.parsedReference);
          hadResolvedMatch = true;
        });

        lastIndex = match.index + matchedText.length;

        if (caretOffset !== null && traversedOffset + lastIndex <= caretOffset) {
          lastReferenceBeforeCaret = resolvedParts[resolvedParts.length - 1].parsedReference;
        }
      });

      if (!hadResolvedMatch) {
        traversedOffset += sourceText.length;
        return;
      }

      if (lastIndex < sourceText.length) {
        fragment.append(document.createTextNode(sourceText.slice(lastIndex)));
      }

      textNode.parentNode.replaceChild(fragment, textNode);
      traversedOffset += sourceText.length;
    });

    restoreCaretTextOffset(root, caretOffset);

    if (jumpToCaretReference && lastReferenceBeforeCaret) {
      jumpToResolvedScripture(lastReferenceBeforeCaret);
    }
  };

  const unwrapAutoUrlLinks = (root = noteEditor) => {
    root.querySelectorAll("a[data-auto-url-link='true']").forEach((link) => {
      link.replaceWith(document.createTextNode(link.textContent));
    });

    root.normalize();
  };

  const ensureTrailingParagraph = () => {
    const last = noteEditor.lastElementChild;

    if (last && last.matches(EMBED_SELECTOR)) {
      const p = document.createElement("p");
      p.innerHTML = "<br>";
      noteEditor.appendChild(p);
    }
  };

  const ensureLeadingParagraph = () => {
    const first = noteEditor.firstElementChild;

    if (first && first.matches(EMBED_SELECTOR)) {
      const p = document.createElement("p");
      p.innerHTML = "<br>";
      noteEditor.prepend(p);
    }
  };

  const findLinkBlock = (link) => {
    const block = link.closest("p, div, h2, h3, h4, h5, h6, li, blockquote");
    return (block && block !== noteEditor) ? block : null;
  };

  const processUrlEmbeds = (scope = null) => {
    const root = (scope && noteEditor.contains(scope)) ? scope : noteEditor;

    root.querySelectorAll("a[data-auto-url-link='true']").forEach((link) => {
      const match = window.EmbedBase.matchUrl(link.href);

      if (!match) {
        return;
      }

      const block = findLinkBlock(link);

      if (!block) {
        return;
      }

      const cloned = block.cloneNode(true);
      cloned.querySelectorAll("a").forEach((anchor) => anchor.remove());
      const remainingText = cloned.textContent.trim();

      if (remainingText) {
        return;
      }

      const embed = match.handler.create(match.data);
      const emptyParagraph = document.createElement("p");
      emptyParagraph.innerHTML = "<br>";
      block.replaceWith(embed, emptyParagraph);
    });

    ensureTrailingParagraph();
  };

  const validateDomainWithDoh = async (domain) => {
    domainValidationCache.set(domain, "pending");

    try {
      const response = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`,
        { headers: { Accept: "application/dns-json" }, signal: AbortSignal.timeout(5000) }
      );
      const data = await response.json();
      const isValid = data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
      domainValidationCache.set(domain, isValid);

      if (isValid) {
        linkifyUrls();
        processUrlEmbeds();
      }
    } catch {
      domainValidationCache.set(domain, false);
    }
  };

  const linkifyUrls = ({ suppressAtCaret = false, scope = null } = {}) => {
    const root = (scope && noteEditor.contains(scope)) ? scope : noteEditor;
    const caretOffset = getCaretTextOffset(root);
    unwrapAutoUrlLinks(root);
    const globalOffsets = new Map();

    if (suppressAtCaret && caretOffset !== null) {
      const allTextWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let offset = 0;
      let n;

      while ((n = allTextWalker.nextNode())) {
        globalOffsets.set(n, offset);
        offset += n.nodeValue.length;
      }
    }

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue.trim()) {
            return NodeFilter.FILTER_REJECT;
          }

          if (node.parentElement?.closest("a")) {
            return NodeFilter.FILTER_REJECT;
          }

          if (node.parentElement?.closest(EMBED_SELECTOR)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let currentNode;

    while ((currentNode = walker.nextNode())) {
      textNodes.push(currentNode);
    }

    textNodes.forEach((textNode) => {
      const sourceText = textNode.nodeValue;
      const nodeGlobalStart = globalOffsets.get(textNode) ?? 0;
      const allMatches = [];

      for (const { regex, type } of urlLinkifyPatterns) {
        regex.lastIndex = 0;

        for (const match of sourceText.matchAll(regex)) {
          allMatches.push({ match, type });
        }
      }

      if (!allMatches.length) {
        return;
      }

      allMatches.sort((a, b) => a.match.index - b.match.index);

      const deduped = [];
      let lastEnd = 0;

      for (const item of allMatches) {
        if (item.match.index >= lastEnd) {
          deduped.push(item);
          lastEnd = item.match.index + item.match[0].length;
        }
      }

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let anyLinksAdded = false;

      for (const { match, type } of deduped) {
        const matchedText = match[0];
        let href;

        if (type === "bare") {
          const domain = matchedText.split("/")[0].split("?")[0].split("#")[0];
          const cacheEntry = domainValidationCache.get(domain);

          if (!cacheEntry) {
            validateDomainWithDoh(domain);
            continue;
          }

          if (cacheEntry !== true) {
            continue;
          }

          href = `https://${matchedText}`;
        } else if (type === "explicit") {
          const spotifyWebMatch = matchedText.match(/^https?:\/\/open\.spotify\.com\/([a-zA-Z]+)\/([a-zA-Z0-9]+)/);
          href = spotifyWebMatch ? `spotify:${spotifyWebMatch[1]}:${spotifyWebMatch[2]}` : matchedText;
        } else if (type === "gopher") {
          href = `https://gopherproxy.meulie.net/${match[1]}`;
        } else if (type === "www") {
          href = `https://${matchedText}`;
        } else if (type === "email") {
          href = `mailto:${matchedText}`;
        }

        if (suppressAtCaret && caretOffset !== null && caretOffset === nodeGlobalStart + match.index + match[0].length) {
          continue;
        }

        if (match.index > lastIndex) {
          fragment.append(document.createTextNode(sourceText.slice(lastIndex, match.index)));
        }

        const link = document.createElement("a");
        link.href = href;
        link.className = "url-link";
        link.dataset.autoUrlLink = "true";
        link.textContent = matchedText;

        if (type !== "email") {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }

        fragment.append(link);
        lastIndex = match.index + matchedText.length;
        anyLinksAdded = true;
      }

      if (!anyLinksAdded) {
        return;
      }

      if (lastIndex < sourceText.length) {
        fragment.append(document.createTextNode(sourceText.slice(lastIndex)));
      }

      textNode.parentNode.replaceChild(fragment, textNode);
    });

    restoreCaretTextOffset(root, caretOffset);
  };

  const getPreviousNodeFromCaret = (root, node) => {
    let current = node;

    while (current && current !== root) {
      if (current.previousSibling) {
        current = current.previousSibling;

        while (current.lastChild) {
          current = current.lastChild;
        }

        return current;
      }

      current = current.parentNode;
    }

    return null;
  };

  const findAutoLinkBeforeCaret = () => {
    const selection = windowObject.getSelection();

    if (!selection.rangeCount || !selection.isCollapsed) {
      return null;
    }

    const range = selection.getRangeAt(0);
    let candidate = null;

    if (range.startContainer.nodeType === Node.TEXT_NODE) {
      if (range.startOffset !== 0) {
        return null;
      }

      candidate = getPreviousNodeFromCaret(noteEditor, range.startContainer);
    } else if (range.startOffset > 0) {
      candidate = range.startContainer.childNodes[range.startOffset - 1];

      while (candidate?.lastChild) {
        candidate = candidate.lastChild;
      }
    }

    if (candidate?.nodeType === Node.TEXT_NODE) {
      candidate = candidate.parentElement;
    }

    return candidate?.matches?.("a[data-auto-scripture-link='true'], a[data-auto-url-link='true']") ? candidate : null;
  };

  const findAutoLinkAtCaret = () => {
    const selection = windowObject.getSelection();

    if (!selection.rangeCount || !selection.isCollapsed) {
      return null;
    }

    const range = selection.getRangeAt(0);

    if (range.startContainer.nodeType === Node.TEXT_NODE) {
      const parentLink = range.startContainer.parentElement?.closest("a[data-auto-scripture-link='true'], a[data-auto-url-link='true']");

      if (parentLink && range.startOffset === range.startContainer.nodeValue.length) {
        return parentLink;
      }
    }

    if (range.startContainer.nodeType === Node.ELEMENT_NODE && range.startOffset > 0) {
      const previousNode = range.startContainer.childNodes[range.startOffset - 1];
      const previousLink = previousNode?.nodeType === Node.ELEMENT_NODE
        ? previousNode.closest?.("a[data-auto-scripture-link='true'], a[data-auto-url-link='true']") ?? previousNode
        : previousNode?.parentElement?.closest("a[data-auto-scripture-link='true'], a[data-auto-url-link='true']");

      if (previousLink?.matches?.("a[data-auto-scripture-link='true'], a[data-auto-url-link='true']")) {
        return previousLink;
      }
    }

    return findAutoLinkBeforeCaret();
  };

  return {
    getCaretBlock,
    linkifyScriptureReferences,
    linkifyUrls,
    processUrlEmbeds,
    ensureTrailingParagraph,
    ensureLeadingParagraph,
    findAutoLinkAtCaret
  };
};
