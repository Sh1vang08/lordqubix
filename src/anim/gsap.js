import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Users who ask for reduced motion get the finished layout immediately —
 * every helper below no-ops rather than animating.
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Shared easing + timing so the whole site moves with one personality. */
export const EASE = "power3.out";
export const EASE_SOFT = "power2.out";

export const DUR = {
  fast: 0.45,
  base: 0.7,
  slow: 1.0,
};

/** Standard trigger point: start when the element is comfortably in view. */
export const START = "top 82%";

/**
 * ScrollTrigger defaults shared by every reveal. `once: true` keeps content
 * settled after the first pass — re-animating on every scroll-by is noisy on
 * a long marketing page.
 */
export const trigger = (el, extra = {}) => ({
  trigger: el,
  start: START,
  // `once` self-kills the trigger the first time it completes, so a later
  // refresh can never rewind the element to its "from" state.
  //
  // Deliberately NOT using invalidateOnRefresh here: on a refresh it re-reads
  // the "from" values and, combined with a stagger still in flight, strands
  // elements at opacity 0 permanently.
  once: true,
  ...extra,
});

export { gsap, ScrollTrigger };
