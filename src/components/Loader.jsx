import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BrandLogo } from "./Logo";
import "./Loader.css";

/**
 * Branded loading screen, shown on first arrival and on every page change.
 *
 * It lifts as soon as the page is ready rather than sitting for a set time —
 * a brief cover for the assembling page, not a pause in front of it. The
 * short floor below only stops it flashing on and off within a frame or two
 * on a fast connection.
 */
const MIN_MS = 450;
const FADE_MS = 400;

const wantsReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Loader() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(() => !wantsReducedMotion());
  const [leaving, setLeaving] = useState(false);

  // Re-arm on every navigation. Keyed on pathname, so a route change puts the
  // loader back up while the next page mounts.
  useEffect(() => {
    if (wantsReducedMotion()) {
      setVisible(false);
      return undefined;
    }

    setLeaving(false);
    setVisible(true);

    // Fade out rather than cutting, so the page is revealed instead of
    // appearing abruptly.
    const startFade = setTimeout(() => setLeaving(true), MIN_MS);
    const hide = setTimeout(() => setVisible(false), MIN_MS + FADE_MS);

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
