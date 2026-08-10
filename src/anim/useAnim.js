import { useLayoutEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
  trigger,
  EASE,
  EASE_SOFT,
  DUR,
} from "./gsap";

/**
 * Scopes a set of GSAP animations to a container ref.
 *
 * `gsap.context()` records every tween/ScrollTrigger created inside the
 * callback so a single `ctx.revert()` cleans them all up. That matters here
 * for two reasons: React 19 StrictMode mounts effects twice in development,
 * and client-side routing swaps whole pages — without the revert, ScrollTriggers
 * from a previous page keep firing against detached nodes.
 *
 * useLayoutEffect (not useEffect) so the "from" state is applied before the
 * browser paints — otherwise elements flash at full opacity first.
 */
export function useGsap(setup, deps = []) {
  const scope = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context((self) => setup(self, scope.current), scope);

    // Product imagery settles late and shifts the layout under already-computed
    // trigger positions, which can strand an element mid-tween. Refresh once
    // the page has loaded and again after any late image decodes.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    const imgs = Array.from(scope.current?.querySelectorAll("img") || []);
    const pending = imgs.filter((img) => !img.complete);
    pending.forEach((img) => {
      img.addEventListener("load", refresh, { once: true });
      img.addEventListener("error", refresh, { once: true });
    });

    const settle = setTimeout(refresh, 400);

    /**
     * Fail-safe: nothing may stay invisible.
     *
     * A reveal can be stranded at opacity 0 if its trigger is skipped —
     * a jump-scroll past it, a refresh that moves the start point behind
     * the current position, or a tween killed mid-stagger. Content
     * silently vanishing is far worse than a missed animation, so any
     * still-hidden target that is already above the fold gets snapped to
     * its resting state.
     */
    const rescueStranded = () => {
      const root = scope.current;
      if (!root) return;
      const vh = window.innerHeight;
      root.querySelectorAll("*").forEach((el) => {
        if (parseFloat(window.getComputedStyle(el).opacity) > 0.01) return;
        // Only rescue what the user has already scrolled past; anything
        // still below the fold has a legitimate pending reveal.
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && (r.width > 0 || r.height > 0)) {
          gsap.set(el, { clearProps: "opacity,transform" });
        }
      });
    };

    // Runs after every refresh (late images, resize, orientation change) and
    // once on settle, so a stranded element is never permanent.
    ScrollTrigger.addEventListener("refresh", rescueStranded);
    const failSafe = setTimeout(rescueStranded, 2500);

    return () => {
      ScrollTrigger.removeEventListener("refresh", rescueStranded);
      clearTimeout(failSafe);
      clearTimeout(settle);
      window.removeEventListener("load", refresh);
      pending.forEach((img) => {
        img.removeEventListener("load", refresh);
        img.removeEventListener("error", refresh);
      });
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}

/* --------------------------------------------------------------- recipes */

/**
 * Fade + rise. The workhorse reveal for headings and copy blocks.
 *
 * Uses fromTo rather than from so the end state is stated explicitly. With
 * a plain `.from()`, a ScrollTrigger that never fires (or is killed
 * mid-flight) leaves the element parked at opacity 0 — content silently
 * disappears. fromTo always has a definite, reachable resting state.
 */
export const revealUp = (targets, opts = {}) => {
  if (!targets || (targets.length === 0 && !targets.nodeType)) return null;
  const { y = 28, delay = 0, duration = DUR.base, stagger = 0, scrollTrigger, ...rest } = opts;
  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: EASE,
      clearProps: "opacity,transform",
      scrollTrigger,
      ...rest,
    }
  );
};

/** Cards/grids: same reveal, staggered across the set. */
export const revealStagger = (targets, opts = {}) => {
  if (!targets || targets.length === 0) return null;
  const { each = 0.08, y = 32, from = "start", ...rest } = opts;
  return revealUp(targets, {
    y,
    stagger: { each, from },
    ...rest,
  });
};

/** Scroll-linked reveal for a group of elements inside a section. */
export const revealOnScroll = (targets, el, opts = {}) => {
  if (!targets || targets.length === 0) return null;
  const { each = 0.08, y = 32, start, ...rest } = opts;
  return revealUp(targets, {
    y,
    stagger: { each },
    scrollTrigger: trigger(el, start ? { start } : {}),
    ...rest,
  });
};

/** Slow parallax drift for background plates. */
export const parallax = (target, el, distance = 60) => {
  if (!target) return null;
  return gsap.fromTo(
    target,
    { yPercent: -distance / 12 },
    {
      yPercent: distance / 12,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
};

/** Counts a numeric stat up to its final value when scrolled into view. */
export const countUp = (el, opts = {}) => {
  if (!el) return null;
  const raw = el.textContent.trim();
  const match = raw.match(/^([^\d]*)(\d[\d,]*)(.*)$/s);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target)) return null;

  const box = { v: 0 };
  return gsap.to(box, {
    v: target,
    duration: opts.duration ?? 1.4,
    // No `delay` here. A delayed tween shows its "from" value for the whole
    // delay, which left the stat reading "0+" when the trigger fired at page
    // load. Stagger the group with the ScrollTrigger instead.
    ease: "power2.out",
    // Trigger on the surrounding block when given, so the count starts as the
    // group scrolls in rather than the instant the numeral itself is created.
    scrollTrigger: trigger(opts.triggerEl || el),
    onUpdate() {
      // Never paint a bare zero: until the tween has actually moved, leave
      // the authored figure in place so a stalled or delayed count can't
      // leave the stat reading "0+".
      if (box.v < 0.5) return;
      el.textContent = `${prefix}${Math.round(box.v).toLocaleString()}${suffix}`;
    },
    // Always restore the authored text, whether the tween finished or was
    // reverted mid-flight — otherwise the stat can be left reading "0+".
    onComplete() {
      el.textContent = raw;
    },
    onInterrupt() {
      el.textContent = raw;
    },
  });
};

/* ------------------------------------------------------- display motion */

/**
 * Splits a headline into per-word spans and sweeps them up behind a mask.
 * The poster face is the loudest thing on the page, so it gets the most
 * deliberate entrance.
 *
 * Splitting rewrites innerHTML, so the original markup is restored on
 * revert — otherwise a re-mount would split the already-split spans.
 */
export const splitWords = (el, opts = {}) => {
  if (!el || el.dataset.split === "done") return null;

  const original = el.innerHTML;
  const lines = Array.from(el.childNodes);

  // Rebuild each text node as masked word spans, leaving element children
  // (<span>, <em>, <br>) structurally intact.
  const wrapText = (node) => {
    const words = node.textContent.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    words.forEach((w) => {
      if (!w.trim()) {
        frag.appendChild(document.createTextNode(w));
        return;
      }
      const mask = document.createElement("span");
      mask.className = "a-mask";
      const inner = document.createElement("span");
      inner.className = "a-word";
      inner.textContent = w;
      mask.appendChild(inner);
      frag.appendChild(mask);
    });
    node.replaceWith(frag);
  };

  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        wrapText(child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };

  lines.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) wrapText(n);
    else if (n.nodeType === Node.ELEMENT_NODE) walk(n);
  });

  el.dataset.split = "done";

  const words = el.querySelectorAll(".a-word");
  if (!words.length) return null;

  gsap.fromTo(
    words,
    { yPercent: 118, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: opts.duration ?? 0.85,
      ease: "power4.out",
      stagger: opts.each ?? 0.055,
      delay: opts.delay ?? 0,
      scrollTrigger: opts.scrollTrigger,
    }
  );

  // Hand back a teardown that restores the original markup. Callers run
  // inside gsap.context(), which collects returned functions and invokes
  // them on revert — without this, a re-mount would split already-split
  // spans and nest masks on every StrictMode pass.
  return () => {
    el.innerHTML = original;
    delete el.dataset.split;
  };
};

/**
 * Reveals a headline word-by-word as it scrolls into view.
 * Returns splitWords' teardown so the caller can hand it to gsap.context().
 */
export const splitOnScroll = (el, opts = {}) =>
  splitWords(el, { ...opts, scrollTrigger: trigger(el, { start: "top 88%" }) });

/** Applies splitOnScroll to a list, returning one combined teardown. */
export const splitAll = (els, opts = {}) => {
  const undos = Array.from(els || [])
    .map((el) => splitOnScroll(el, opts))
    .filter(Boolean);
  return () => undos.forEach((fn) => fn());
};

/**
 * Pointer-follow lift. Buttons and cards drift a few pixels toward the
 * cursor, which makes the whole surface feel responsive rather than static.
 * Returns a cleanup function; gsap.context() collects it automatically.
 */
export const magnetic = (el, strength = 0.28) => {
  if (!el || window.matchMedia("(hover: none)").matches) return undefined;

  const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

  const move = (e) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    xTo(0);
    yTo(0);
  };

  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", leave);

  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", leave);
  };
};

/** Card lift + inner-image push on hover. */
export const hoverLift = (el, opts = {}) => {
  if (!el || window.matchMedia("(hover: none)").matches) return undefined;

  const img = el.querySelector("img");
  const enter = () => {
    gsap.to(el, { y: opts.y ?? -7, duration: 0.34, ease: "power3.out", overwrite: "auto" });
    if (img) gsap.to(img, { scale: opts.scale ?? 1.07, duration: 0.5, ease: "power3.out", overwrite: "auto" });
  };
  const leave = () => {
    gsap.to(el, { y: 0, duration: 0.42, ease: "power3.out", overwrite: "auto" });
    if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: "power3.out", overwrite: "auto" });
  };

  el.addEventListener("pointerenter", enter);
  el.addEventListener("pointerleave", leave);

  return () => {
    el.removeEventListener("pointerenter", enter);
    el.removeEventListener("pointerleave", leave);
  };
};

/**
 * Scrub-linked drift: the element tracks scroll position directly rather
 * than playing once. Used to float product shots against their sections.
 */
export const drift = (target, el, opts = {}) => {
  if (!target) return null;
  const { y = 60, rotate = 0, scaleFrom = 1 } = opts;
  return gsap.fromTo(
    target,
    { y: y / 2, rotate: -rotate, scale: scaleFrom },
    {
      y: -y / 2,
      rotate,
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      },
    }
  );
};

/** Draws a rule/underline out from its start edge as the section arrives. */
export const drawLine = (el, opts = {}) => {
  if (!el) return null;
  return gsap.fromTo(
    el,
    { scaleX: 0, transformOrigin: opts.origin ?? "left center" },
    {
      scaleX: 1,
      duration: opts.duration ?? 0.7,
      ease: "power3.inOut",
      scrollTrigger: trigger(el),
    }
  );
};

/**
 * Continuous equaliser bounce — a small nod to the product category. Runs
 * only while the element is on screen so it costs nothing off-screen.
 */
export const equaliser = (bars, el) => {
  if (!bars || !bars.length) return null;
  const tweens = Array.from(bars).map((bar, i) =>
    gsap.to(bar, {
      scaleY: gsap.utils.random(0.35, 1),
      duration: gsap.utils.random(0.34, 0.72),
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: i * 0.06,
      transformOrigin: "bottom center",
      paused: true,
    })
  );

  ScrollTrigger.create({
    trigger: el,
    start: "top bottom",
    end: "bottom top",
    onToggle: ({ isActive }) =>
      tweens.forEach((t) => (isActive ? t.play() : t.pause())),
  });

  return tweens;
};

/* --------------------------------------------------- scrub text effects */

/**
 * Scrub-linked word reveal: words brighten from dim to full as the block
 * travels through the viewport, so the copy "reads in" under the scroll
 * rather than playing a fixed-length animation.
 */
export const scrubWords = (el, opts = {}) => {
  if (!el) return undefined;
  const undo = splitWords(el, { duration: 0 });
  const words = el.querySelectorAll(".a-word");
  if (!words.length) return undo;

  // splitWords' own entrance tween is not wanted here — this is scrubbed.
  gsap.killTweensOf(words);
  gsap.set(words, { yPercent: 0, opacity: 1 });

  gsap.fromTo(
    words,
    { opacity: opts.from ?? 0.16 },
    {
      opacity: 1,
      ease: "none",
      stagger: 0.35,
      scrollTrigger: {
        trigger: el,
        start: opts.start ?? "top 82%",
        end: opts.end ?? "top 38%",
        scrub: opts.scrub ?? 0.5,
      },
    }
  );

  return undo;
};

/**
 * Horizontal marquee driven by scroll direction — a ticker of category
 * names that slides as the page moves.
 */
export const scrollMarquee = (track, el, distance = 220) => {
  if (!track) return null;
  return gsap.fromTo(
    track,
    { x: 0 },
    {
      x: -distance,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
      },
    }
  );
};

/**
 * Pins a block and wipes a gold scrim across it as the user scrolls,
 * revealing the statement underneath.
 */
export const scrimReveal = (el, scrim, opts = {}) => {
  if (!el || !scrim) return null;
  return gsap.fromTo(
    scrim,
    { xPercent: 0 },
    {
      xPercent: 101,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: opts.start ?? "top 78%",
        end: opts.end ?? "top 30%",
        scrub: 0.4,
      },
    }
  );
};

/** Letter-spacing that tightens as a headline scrolls in. */
export const trackIn = (el, opts = {}) => {
  if (!el) return null;
  return gsap.fromTo(
    el,
    { letterSpacing: opts.from ?? "0.22em", opacity: 0.35 },
    {
      letterSpacing: opts.to ?? "0.005em",
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "top 45%",
        scrub: 0.5,
      },
    }
  );
};

/** Section background tint that shifts as the section passes through. */
export const scrubFade = (target, el, from, to) => {
  if (!target) return null;
  return gsap.fromTo(
    target,
    { opacity: from },
    {
      opacity: to,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "top center", scrub: true },
    }
  );
};

export { gsap, ScrollTrigger, trigger, EASE, EASE_SOFT, DUR };
