// Base class for all rich-media embed types (YouTube, Spotify, Image, …).
// Each embed type extends this class and calls EmbedBase.register(TheClass) at module level.
//
// Interface overview (override in subclass):
//   getSelector()            CSS selector identifying this embed's root element
//   matchUrl(url)            Return match-data if url belongs to this type, else null
//   create(data, options)    Build and return the root DOM element for a new embed
//   get canResize()          Whether this embed supports drag-resizing (default false)
//   get toolbarButton()      { id, label, ariaLabel } descriptor, or null
//   getWrapper(element)      Return the inner wrapper element (for resize width)
//   getMediaElement(element) Return the primary media element (iframe / img) inside
//
// Shared DOM helpers (available to subclasses via this.*):
//   _makeContainer(outerClass, dataAttr, dataValue)
//   _makeWrapper(wrapperClass, width)
//   _makeDeleteButton(btnClass, ariaLabel)
//   _makeResizeHandle(handleClass)

class EmbedBase {
  // Static registry — one instance per registered embed type.
  static _registry = [];

  // Register an embed class.  Call at the end of each embed file.
  static register(EmbedClass) {
    EmbedBase._registry.push(new EmbedClass());
  }

  // Combined CSS selector that matches any registered embed element.
  static get selector() {
    return EmbedBase._registry.map((e) => e.getSelector()).join(", ");
  }

  // Try every registered embed against `url`.
  // Returns { handler, data } on first match, or null if nothing matched.
  static matchUrl(url) {
    for (const handler of EmbedBase._registry) {
      const data = handler.matchUrl(url);

      if (data !== null) {
        return { handler, data };
      }
    }

    return null;
  }

  // Find the registered handler whose selector matches `element`.
  static findHandler(element) {
    return EmbedBase._registry.find((h) => element.matches(h.getSelector())) ?? null;
  }

  // ── Instance interface (override in subclass) ──────────────────────────────

  // CSS selector for this embed's root element.
  getSelector() { return ""; }

  // Whether drag-resize is supported.
  get canResize() { return false; }

  // Optional toolbar button descriptor ({ id, label, ariaLabel }), or null.
  get toolbarButton() { return null; }

  // Try to match `url`.  Return match data (any truthy value) or null.
  matchUrl(_url) { return null; }

  // Build the root DOM element.  `data` is whatever matchUrl() returned (or a
  // plain src string for image embeds).  `options` may include { width }.
  create(_data, _options) { return null; }

  // Return the resizable wrapper element inside `element`.
  getWrapper(element) {
    return (
      element.querySelector(".embed-wrapper") ??
      element.querySelector(".youtube-embed-wrapper") ??
      element.querySelector(".spotify-embed-wrapper") ??
      element.querySelector(".image-embed-wrapper") ??
      element.firstElementChild
    );
  }

  // Return the primary media element (iframe / img) inside `element`.
  getMediaElement(element) {
    return element.querySelector("iframe, img");
  }

  // ── Shared DOM helpers (used by subclasses) ────────────────────────────────

  // Create the outer container div.
  // Adds both the type-specific class (e.g. "youtube-embed") and the shared
  // "embed" class, plus a shared "data-embed" attribute for unified selection.
  _makeContainer(outerClass, dataAttr, dataValue) {
    const el = document.createElement("div");
    el.className = `${outerClass} embed`;
    el.dataset[dataAttr] = dataValue;
    el.dataset.embed = outerClass; // e.g. "youtube-embed"
    el.contentEditable = "false";
    el.setAttribute("tabindex", "-1");
    el.setAttribute("draggable", "true");

    return el;
  }

  // Create the inner wrapper div that constrains the embed width.
  _makeWrapper(wrapperClass, width) {
    const el = document.createElement("div");
    el.className = `${wrapperClass} embed-wrapper`;

    if (width) {
      el.style.width = `${width}px`;
    }

    return el;
  }

  // Create the ✕ delete button.
  _makeDeleteButton(btnClass, ariaLabel) {
    const btn = document.createElement("button");
    btn.className = `${btnClass} embed-delete`;
    btn.type = "button";
    btn.setAttribute("aria-label", ariaLabel);
    btn.textContent = "✕";

    return btn;
  }

  // Create the resize handle strip.
  _makeResizeHandle(handleClass) {
    const el = document.createElement("div");
    el.className = `${handleClass} embed-resize-handle`;
    el.setAttribute("aria-hidden", "true");

    return el;
  }
}

window.EmbedBase = EmbedBase;
