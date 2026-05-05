// Image embed type.
// Images are inserted from the clipboard or the file picker (no URL auto-detection).
// The embed stores the image as a base-64 data-URL in the src attribute.

class ImageEmbed extends EmbedBase {
  static DEFAULT_WIDTH = 400;

  getSelector() { return "[data-image-embed]"; }
  get canResize() { return true; }

  // No URL auto-detection for images.
  matchUrl(_url) { return null; }

  // Toolbar button descriptor — this is the only embed type that adds a
  // button to the main toolbar (the "Image" button).
  get toolbarButton() {
    return { id: "insert-image-button", label: "Image", ariaLabel: "Insert image" };
  }

  // Build the image embed element.
  // `src` is the image data-URL (or any valid img src); `options.width` overrides the default.
  create(src, options = {}) {
    const width = options.width ?? ImageEmbed.DEFAULT_WIDTH;

    const outerDiv = this._makeContainer("image-embed", "imageEmbed", "true");

    const wrapper = this._makeWrapper("image-embed-wrapper", width);

    const img = document.createElement("img");
    img.className = "image-embed-img";
    img.src = src;
    img.alt = "Embedded image";

    const deleteBtn = this._makeDeleteButton("image-embed-delete", "Remove image");
    const resizeHandle = this._makeResizeHandle("image-embed-resize-handle");

    wrapper.appendChild(img);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(resizeHandle);
    outerDiv.appendChild(wrapper);

    return outerDiv;
  }

  getMediaElement(element) {
    return element.querySelector(".image-embed-img");
  }
}

EmbedBase.register(ImageEmbed);
window.ImageEmbed = ImageEmbed;
