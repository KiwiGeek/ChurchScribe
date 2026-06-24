// PDF embed type.
// Renders PDFs via Mozilla pdf.js (canvas-based) to avoid X-Frame-Options
// restrictions that cause cross-origin iframe embeds to be blocked by browsers.
// Falls back to an "Open in new tab" link if the PDF can't be fetched (CORS).

class PdfEmbed extends EmbedBase {
  static DEFAULT_WIDTH = 560;
  static _PDFJS_SRC    = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  static _PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  static _loadPromise  = null;

  getSelector() { return "[data-pdf-embed]"; }
  get canResize() { return true; }

  // Returns the PDF URL when `url` is a recognisable direct PDF URL, else null.
  // This matcher intentionally uses extension-based detection (.pdf path suffix).
  matchUrl(url) {
    try {
      const parsed = new URL(url);
      const isHttp = parsed.protocol === "http:" || parsed.protocol === "https:";

      if (!isHttp) {
        return null;
      }

      return parsed.pathname.toLowerCase().endsWith(".pdf") ? parsed.href : null;
    } catch {
      // invalid URL — fall through
    }

    return null;
  }

  // Build the PDF embed element.
  // `pdfUrl` is the direct/public PDF URL; `options.width` overrides default width.
  create(pdfUrl, options = {}) {
    const width = options.width ?? PdfEmbed.DEFAULT_WIDTH;

    const outerDiv = this._makeContainer("pdf-embed", "pdfEmbed", pdfUrl);
    const wrapper  = this._makeWrapper("pdf-embed-wrapper", width);

    // Scrollable area that shows loading → rendered pages (or error message).
    const pagesDiv = document.createElement("div");
    pagesDiv.className = "pdf-embed-pages";

    const loadingDiv = document.createElement("div");
    loadingDiv.className = "pdf-embed-loading";
    loadingDiv.textContent = "Loading PDF…";
    pagesDiv.appendChild(loadingDiv);

    // Always-visible footer with fallback link.
    const fallback = document.createElement("div");
    fallback.className = "pdf-embed-fallback";

    const openLink = document.createElement("a");
    openLink.className = "pdf-embed-open-link";
    openLink.href = pdfUrl;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.textContent = "Open PDF in new tab";
    fallback.appendChild(openLink);

    const deleteBtn    = this._makeDeleteButton("pdf-embed-delete", "Remove PDF embed");
    const resizeHandle = this._makeResizeHandle("pdf-embed-resize-handle");

    wrapper.appendChild(pagesDiv);
    wrapper.appendChild(fallback);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(resizeHandle);
    outerDiv.appendChild(wrapper);

    this._render(pdfUrl, pagesDiv, width);

    return outerDiv;
  }

  // Lazy-load pdf.js (once), then render all pages into pagesDiv.
  // If pdf.js can't fetch the PDF (e.g. CORS), falls back to an iframe so that
  // hosts without X-Frame-Options still render correctly.
  async _render(url, pagesDiv, width) {
    try {
      const lib = await this._ensurePdfJs();
      const pdf = await lib.getDocument({ url, withCredentials: false }).promise;

      pagesDiv.innerHTML = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page         = await pdf.getPage(i);
        const baseViewport = page.getViewport({ scale: 1 });

        // Scale to wrapper width; multiply by dpr for crisp rendering on HiDPI.
        const scale    = (width / baseViewport.width) * (window.devicePixelRatio || 1);
        const viewport = page.getViewport({ scale });

        const canvas   = document.createElement("canvas");
        canvas.className    = "pdf-embed-page";
        canvas.width        = viewport.width;
        canvas.height       = viewport.height;
        canvas.style.width  = "100%"; // CSS controls visual width; canvas px = dpr-scaled

        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
        pagesDiv.appendChild(canvas);
      }
    } catch (err) {
      // pdf.js failed — most likely a CORS-blocked fetch. Fall back to an iframe
      // so hosts that allow framing (but not cross-origin fetch) still work.
      console.warn("[PdfEmbed] pdf.js render failed, falling back to iframe:", err);
      pagesDiv.innerHTML = "";

      const iframe = document.createElement("iframe");
      iframe.className = "pdf-embed-frame";
      iframe.src = url;
      iframe.setAttribute("loading", "lazy");
      iframe.title = "Embedded PDF";
      pagesDiv.appendChild(iframe);
    }
  }

  // Returns a promise that resolves to the pdfjsLib global.
  // Injects the script tag only once; subsequent calls reuse the same promise.
  _ensurePdfJs() {
    if (PdfEmbed._loadPromise) return PdfEmbed._loadPromise;

    PdfEmbed._loadPromise = new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        this._initWorker();
        return resolve(window.pdfjsLib);
      }

      const script   = document.createElement("script");
      script.src     = PdfEmbed._PDFJS_SRC;
      script.onload  = () => { this._initWorker(); resolve(window.pdfjsLib); };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return PdfEmbed._loadPromise;
  }

  _initWorker() {
    if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PdfEmbed._PDFJS_WORKER;
    }
  }

  getMediaElement(element) {
    return element.querySelector(".pdf-embed-page");
  }
}

EmbedBase.register(PdfEmbed);
window.PdfEmbed = PdfEmbed;
