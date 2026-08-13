import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BrandLogo } from "./Logo";
import "./Loader.css";

/**
 * Branded loading screen, shown on first arrival and on every page change.
 *
 * It holds for a fixed HOLD_MS whether or not the page is ready, so the mark
 * is always on screen long enough to read. Page assets keep loading behind
 * it, so the wait is not wasted: by the time it lifts, most pages have
 * finished assembling anyway.
 *
 * Visitors who ask for reduced motion skip it — for some people a forced
 * full-screen delay with moving parts is not a nicety.
 */
const HOLD_MS = 4000;

const wantsReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const FADE_MS = 400;

export default function Loader() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(() => !wantsReducedMotion());
  const [leaving, setLeaving] = useState(false);

  // Re-arm on every navigation. Keyed on pathname, so a route change puts the
  // loader back up and starts the hold again.
  useEffect(() => {
    if (wantsReducedMotion()) {
      setVisible(false);
      return undefined;
    }

    setLeaving(false);
    setVisible(true);

    // Fade out at the end of the hold rather than cutting, so the page is
    // revealed instead of appearing abruptly.
    const startFade = setTimeout(() => setLeaving(true), HOLD_MS - FADE_MS);
    const hide = setTimeout(() => setVisible(false), HOLD_MS);

    return () => {
      clearTimeout(startFade);
      clearTimeout(hide);
    };
  }, [pathname]);

  // While the loader covers the page, stop the body scrolling underneath —
  // otherwise a visitor can scroll a page they cannot see.
  useEffect(() => {
    if (!visible) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`loader ${leaving ? "is-leaving" : ""}`}
      role="status"
      aria-live="polite"
    >
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
