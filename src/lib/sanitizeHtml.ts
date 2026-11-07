import sanitize from "sanitize-html";

/**
 * Sanitizes WordPress post HTML before rendering. Uses sanitize-html (pure JS)
 * instead of isomorphic-dompurify, whose jsdom dependency crashed every blog
 * post page with a 500 on Vercel's serverless runtime.
 */
export function sanitizePostHtml(html: string): string {
  return sanitize(html, {
    allowedTags: [
      ...sanitize.defaults.allowedTags,
      "img", "figure", "figcaption", "picture", "source", "video", "audio", "iframe",
      "h1", "h2", "span", "del", "ins", "sup", "sub",
    ],
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      "*": ["class", "id", "style", "title", "aria-label", "aria-hidden", "role"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding"],
      source: ["src", "srcset", "type", "media", "sizes"],
      video: ["src", "controls", "poster", "width", "height", "muted", "loop", "playsinline"],
      audio: ["src", "controls"],
      iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder", "title", "loading"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    // Embedded media only from well-known providers.
    allowedIframeHostnames: ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
      }),
    },
  });
}
