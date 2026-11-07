import Script from "next/script";

/**
 * Many listing logos/banners are scraped links that no longer work. Instead of
 * showing the browser's broken-image icon + alt text, hide failed images so the
 * placeholder background behind them shows. Catches errors that happened before
 * hydration too.
 */
export default function BrokenImageGuard() {
  return (
    <Script id="broken-image-guard" strategy="afterInteractive">
      {`(function(){
  function hide(img){ if(img && img.tagName==="IMG"){ img.classList.add("img-broken"); } }
  window.addEventListener("error", function(e){ hide(e.target); }, true);
  for (var i=0;i<document.images.length;i++){ var im=document.images[i]; if(im.complete && im.naturalWidth===0 && im.src){ hide(im); } }
})();`}
    </Script>
  );
}
