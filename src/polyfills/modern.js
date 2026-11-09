// Replaces Next's built-in polyfill-module (see next.config.ts turbopack.resolveAlias).
// Next's default browser targets (Chrome/Edge/Firefox 111+, Safari 16.4+) already
// support everything that module patches except URL.canParse (Safari 17+), which
// Next's runtime uses, so that is the only one kept.
if (typeof URL !== "undefined" && !("canParse" in URL)) {
  URL.canParse = function (url, base) {
    try {
      new URL(url, base);
      return true;
    } catch {
      return false;
    }
  };
}
