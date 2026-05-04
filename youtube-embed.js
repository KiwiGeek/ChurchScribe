// YouTube embed type.
// Detects YouTube watch / shorts / youtu.be URLs and renders an iframe embed.

class YouTubeEmbed extends EmbedBase {
  static DEFAULT_WIDTH = 560;

  getSelector() { return "[data-youtube-embed]"; }
  get canResize() { return true; }

  // Returns the videoId string if `url` is a recognisable YouTube URL, else null.
  matchUrl(url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");

      if (host === "youtu.be") {
        const id = parsed.pathname.slice(1).split("/")[0];

        return id || null;
      }

      if (host === "youtube.com") {
        if (parsed.pathname === "/watch") {
          return parsed.searchParams.get("v") || null;
        }

        if (parsed.pathname.startsWith("/shorts/")) {
          return parsed.pathname.slice(8).split("/")[0] || null;
        }

        if (parsed.pathname.startsWith("/embed/")) {
          return parsed.pathname.slice(7).split("/")[0] || null;
        }
      }
    } catch {
      // invalid URL — fall through
    }

    return null;
  }

  // Build the YouTube embed element.
  // `videoId` is the video ID string; `options.width` overrides the default width.
  create(videoId, options = {}) {
    const width = options.width ?? YouTubeEmbed.DEFAULT_WIDTH;

    const outerDiv = this._makeContainer("youtube-embed", "youtubeEmbed", videoId);

    const wrapper = this._makeWrapper("youtube-embed-wrapper", width);

    const iframe = document.createElement("iframe");
    iframe.className = "youtube-embed-frame";
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    iframe.setAttribute("allowfullscreen", "");
    iframe.title = "YouTube video";

    const deleteBtn = this._makeDeleteButton("youtube-embed-delete", "Remove video embed");
    const resizeHandle = this._makeResizeHandle("youtube-embed-resize-handle");

    wrapper.appendChild(iframe);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(resizeHandle);
    outerDiv.appendChild(wrapper);

    return outerDiv;
  }

  getMediaElement(element) {
    return element.querySelector(".youtube-embed-frame");
  }
}

EmbedBase.register(YouTubeEmbed);
window.YouTubeEmbed = YouTubeEmbed;
