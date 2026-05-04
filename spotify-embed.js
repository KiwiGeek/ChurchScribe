// Spotify embed type.
// Detects open.spotify.com URLs and spotify: URI scheme links and renders
// an official Spotify embed iframe.

const SPOTIFY_EMBED_TYPES = new Set(["track", "album", "playlist", "artist", "episode", "show"]);

class SpotifyEmbed extends EmbedBase {
  getSelector() { return "[data-spotify-embed]"; }
  get canResize() { return false; }

  // Returns { type, id } if `url` is a recognisable Spotify URL/URI, else null.
  matchUrl(url) {
    try {
      if (url.startsWith("spotify:")) {
        const parts = url.split(":");

        if (parts.length === 3 && SPOTIFY_EMBED_TYPES.has(parts[1])) {
          return { type: parts[1], id: parts[2] };
        }
      }

      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "");

      if (host === "open.spotify.com") {
        const parts = parsed.pathname.split("/").filter(Boolean);

        if (parts.length === 2 && SPOTIFY_EMBED_TYPES.has(parts[0])) {
          return { type: parts[0], id: parts[1] };
        }
      }
    } catch {
      // invalid URL — fall through
    }

    return null;
  }

  // Build the Spotify embed element.
  // `data` is { type, id } as returned by matchUrl().
  create({ type, id }, _options = {}) {
    const outerDiv = this._makeContainer("spotify-embed", "spotifyEmbed", `${type}:${id}`);

    const wrapper = this._makeWrapper("spotify-embed-wrapper", null);

    const iframe = document.createElement("iframe");
    iframe.className = "spotify-embed-frame";
    iframe.src = `https://open.spotify.com/embed/${encodeURIComponent(type)}/${encodeURIComponent(id)}?utm_source=generator`;
    iframe.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("loading", "lazy");
    iframe.title = "Spotify player";

    const deleteBtn = this._makeDeleteButton("spotify-embed-delete", "Remove Spotify embed");

    wrapper.appendChild(iframe);
    wrapper.appendChild(deleteBtn);
    outerDiv.appendChild(wrapper);

    return outerDiv;
  }
}

EmbedBase.register(SpotifyEmbed);
window.SpotifyEmbed = SpotifyEmbed;
