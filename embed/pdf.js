// PDF embed type.
// Detects direct/public PDF URLs and stores the loaded PDF as a base-64 data URL
// so the browser's PDF viewer can render it without cross-origin requests.

class PdfEmbed extends EmbedBase {
  static DEFAULT_WIDTH = 560;

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

  static isPdfFile(file) {
    return file?.type === "application/pdf" || /\.pdf$/i.test(file?.name ?? "");
  }

  static normalizeDataUrl(dataUrl) {
    if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
      return dataUrl;
    }

    if (/^data:application\/pdf[;,]/i.test(dataUrl)) {
      return dataUrl;
    }

    return dataUrl.replace(/^data:[^;,]*/i, "data:application/pdf");
  }

  static readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(PdfEmbed.normalizeDataUrl(event.target.result));
      reader.onerror = () => reject(reader.error ?? new Error("Unable to read PDF file."));
      reader.readAsDataURL(file);
    });
  }

  // Build the PDF embed element.
  // `pdfSource` is either a PDF data-URL or a direct/public PDF URL that will be
  // downloaded and converted into a data-URL.
  create(pdfSource, options = {}) {
    const width = options.width ?? PdfEmbed.DEFAULT_WIDTH;
    const sourceName = options.sourceName || this._getPdfNameFromSource(pdfSource);
    const isDataUrl = /^data:application\/pdf[;,]/i.test(pdfSource);

    const outerDiv = this._makeContainer("pdf-embed", "pdfEmbed", "true");
    outerDiv.dataset.pdfName = sourceName;
    const wrapper = this._makeWrapper("pdf-embed-wrapper", width);

    const iframe = document.createElement("iframe");
    iframe.className = "pdf-embed-frame";
    iframe.setAttribute("loading", "lazy");
    iframe.title = sourceName ? `Embedded PDF: ${sourceName}` : "Embedded PDF";

    const status = this._makeStatus(isDataUrl ? "" : "Downloading PDF…");

    const fallback = document.createElement("div");
    fallback.className = "pdf-embed-fallback";

    const openLink = document.createElement("a");
    openLink.className = "pdf-embed-open-link";
    openLink.href = pdfSource;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.textContent = "Open PDF";

    if (sourceName) {
      openLink.download = sourceName;
    }

    const deleteBtn = this._makeDeleteButton("pdf-embed-delete", "Remove PDF embed");
    const resizeHandle = this._makeResizeHandle("pdf-embed-resize-handle");

    fallback.appendChild(openLink);
    wrapper.appendChild(iframe);
    wrapper.appendChild(status);
    wrapper.appendChild(fallback);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(resizeHandle);
    outerDiv.appendChild(wrapper);

    if (isDataUrl) {
      this._setPdfSource(outerDiv, PdfEmbed.normalizeDataUrl(pdfSource));
    } else {
      outerDiv.dataset.pdfSourceUrl = pdfSource;
      this._downloadPdf(outerDiv, pdfSource);
    }

    return outerDiv;
  }

  getMediaElement(element) {
    return element.querySelector(".pdf-embed-frame");
  }

  _makeStatus(text) {
    const status = document.createElement("div");
    status.className = "pdf-embed-status";
    status.setAttribute("aria-live", "polite");
    status.hidden = !text;

    const label = document.createElement("span");
    label.className = "pdf-embed-status-text";
    label.textContent = text;

    const progress = document.createElement("progress");
    progress.className = "pdf-embed-progress";
    progress.max = 100;
    progress.value = 0;
    progress.hidden = true;

    status.append(label, progress);
    return status;
  }

  _getPdfNameFromSource(source) {
    try {
      const parsed = new URL(source);
      const lastSegment = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() ?? "");
      return lastSegment || "document.pdf";
    } catch {
      return "document.pdf";
    }
  }

  _setStatus(element, message, progressPercent = null) {
    const status = element.querySelector(".pdf-embed-status");
    const label = element.querySelector(".pdf-embed-status-text");
    const progress = element.querySelector(".pdf-embed-progress");

    if (!status || !label || !progress) {
      return;
    }

    status.hidden = !message;
    label.textContent = message || "";

    if (typeof progressPercent === "number") {
      progress.hidden = false;
      progress.value = Math.max(0, Math.min(100, progressPercent));
    } else {
      progress.hidden = true;
      progress.removeAttribute("value");
    }
  }

  _setPdfSource(element, dataUrl) {
    const normalizedDataUrl = PdfEmbed.normalizeDataUrl(dataUrl);
    const iframe = element.querySelector(".pdf-embed-frame");
    const openLink = element.querySelector(".pdf-embed-open-link");

    if (iframe) {
      iframe.src = normalizedDataUrl;
    }

    if (openLink) {
      openLink.href = normalizedDataUrl;
    }

    element.removeAttribute("data-pdf-source-url");
    this._setStatus(element, "");
  }

  async _downloadPdf(element, pdfUrl) {
    try {
      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error(`PDF download failed with status ${response.status}.`);
      }

      const contentLength = Number(response.headers.get("content-length"));
      let blob;

      if (response.body?.getReader) {
        const reader = response.body.getReader();
        const chunks = [];
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          chunks.push(value);
          received += value.length;

          if (contentLength > 0) {
            this._setStatus(element, `Downloading PDF… ${Math.round((received / contentLength) * 100)}%`, (received / contentLength) * 100);
          }
        }

        blob = new Blob(chunks, { type: "application/pdf" });
      } else {
        blob = await response.blob();
      }

      const dataUrl = await PdfEmbed.readFileAsDataUrl(blob);
      this._setPdfSource(element, dataUrl);
      element.dispatchEvent(new CustomEvent("scriptoria:embed-updated", { bubbles: true }));
    } catch (error) {
      this._setStatus(
        element,
        "Could not download this PDF. The host may block cross-origin downloads."
      );
      element.dispatchEvent(new CustomEvent("scriptoria:embed-updated", { bubbles: true }));
      console.warn("Unable to convert PDF embed to a data URL.", error);
    }
  }
}

EmbedBase.register(PdfEmbed);
window.PdfEmbed = PdfEmbed;
