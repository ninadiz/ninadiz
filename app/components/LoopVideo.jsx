import { useEffect, useRef } from "react";

// Muted looping video with a still placeholder (poster).
// The poster is shown while the video loads. On a very slow connection
// (2G) or with data saver on, the video is not loaded at all and only the
// poster is shown. Browsers without the Network Information API (Safari,
// Firefox) always get the video, with the poster shown until it is ready.
function isSlowConnection() {
  const connection = typeof navigator !== "undefined" ? navigator.connection : null;
  if (!connection) return false;
  return Boolean(connection.saveData) || /(^|-)2g$/.test(connection.effectiveType ?? "");
}

// Safari, and every browser on iOS, runs on WebKit, which plays WebM without
// its alpha channel (a black background). For a transparent video WebKit gets
// the HEVC-with-alpha copy instead (hevcSrc), other browsers the WebM.
function isWebKit() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua);
}

// hold keeps the video on its first frame; it starts playing as soon as hold
// turns false (the home page holds case videos until its headline is shown).
// onReady is called once there is something to show: the poster or the
// video's first frame, whichever loads first (a loading skeleton can be
// shown until then).
export default function LoopVideo({ src, hevcSrc, poster, className, alt, hold, onReady }) {
  const ref = useRef(null);
  const slow = poster && isSlowConnection();
  const controlled = hold !== undefined;

  useEffect(() => {
    if (slow || !controlled || hold) return;
    ref.current?.play().catch(() => {});
  }, [slow, controlled, hold]);

  useEffect(() => {
    if (!onReady) return;
    let done = false;
    const ready = () => {
      if (!done) {
        done = true;
        onReady();
      }
    };
    const el = ref.current;
    if (el instanceof HTMLImageElement) {
      if (el.complete && el.naturalWidth) ready();
      else el.addEventListener("load", ready);
      return () => el.removeEventListener("load", ready);
    }
    let still;
    if (poster) {
      still = new Image();
      still.onload = ready;
      still.src = poster;
    }
    if (el && el.readyState >= 2) ready();
    else el?.addEventListener("loadeddata", ready);
    return () => {
      done = true;
      if (still) still.onload = null;
      el?.removeEventListener("loadeddata", ready);
    };
  }, [onReady, poster, slow]);

  if (slow) {
    return <img ref={ref} className={className} src={poster} alt={alt ?? ""} />;
  }

  return (
    <video
      ref={ref}
      className={className}
      src={hevcSrc && isWebKit() ? hevcSrc : src}
      poster={poster}
      autoPlay={!controlled}
      muted
      loop
      playsInline
      preload="auto"
    />
  );
}
