import { useEffect, useState } from "react";
import { BrandLogo } from "./Logo";
import "./Loader.css";

/**
 * First-paint loading screen.
 *
 * The home page pulls in hero artwork and the catalogue chunk, so there is a
 * moment where the shell is up but the fold is still assembling. This covers
 * that with the brand mark rather than a half-drawn page.
 *
 * Shown once per session: a visitor moving between pages has already seen it,
 * and repeating it on every navigation would make the site feel slower, not
 * faster. It also self-dismisses on a timer so a stalled asset can never
 * leave someone staring at a splash screen.
 */
const SEEN_KEY = "qubix:loaded";
const MIN_MS = 650; // long enough to read the mark, short enough not to annoy
const MAX_MS = 3500; // hard ceiling — never trap the visitor behind the splash

export default function Loader() {
  const [done, setDone] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Private browsing can throw on storage access; showing the loader once
      // is a better failure than crashing the page.
      return false;
    }
  });

  useEffect(() => {
    if (done) return undefined;

    const finish = () => {
      setDone(true);
      try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* storage unavailable — the loader simply shows again next time */
      }
    };

    const started = performance.now();
    const settle = () => {
      const waited = performance.now() - started;
      const id = setTimeout(finish, Math.max(0, MIN_MS - waited));
      return () => clearTimeout(id);
    };

    // Dismiss once the page has actually finished loading…
    let cancelSettle;
    const onLoad = () => {
      cancelSettle = settle();
    };

    if (document.readyState === "complete") {
      cancelSettle = settle();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    // …and regardless, after the ceiling.
    const hard = setTimeout(finish, MAX_MS);

    return () => {
      clearTimeout(hard);
      window.removeEventListener("load", onLoad);
      if (cancelSettle) cancelSettle();
    };
  }, [done]);

  if (done) return null;

  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__mark">
        <BrandLogo height={44} />
        <span className="loader__sheen" aria-hidden="true" />
      </div>

      <div className="loader__bar" aria-hidden="true">
        <span />
      </div>

      <p className="loader__text">Professional Audio</p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
