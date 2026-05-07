// PDF embed type.
// Detects direct/public PDF URLs and renders them in an iframe.

class PdfEmbed extends EmbedBase {
  static DEFAULT_WIDTH = 560;

  getSelector() { return "[data-pdf-embed]"; }
  get canResize() { return true; }

  // Returns the PDF URL when `url` is a recognisable direct PDF URL, else null.
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
    const wrapper = this._makeWrapper("pdf-embed-wrapper", width);

    const iframe = document.createElement("iframe");
    iframe.className = "pdf-embed-frame";
    iframe.src = pdfUrl;
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("sandbox", "allow-downloads");
    iframe.title = "Embedded PDF";

    const deleteBtn = this._makeDeleteButton("pdf-embed-delete", "Remove PDF embed");
    const resizeHandle = this._makeResizeHandle("pdf-embed-resize-handle");

    wrapper.appendChild(iframe);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(resizeHandle);
    outerDiv.appendChild(wrapper);

    return outerDiv;
  }

  getMediaElement(element) {
    return element.querySelector(".pdf-embed-frame");
  }
}

EmbedBase.register(PdfEmbed);
window.PdfEmbed = PdfEmbed;
