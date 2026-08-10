import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../anim/gsap";

/**
 * Thin progress rail pinned above the header. Scrubs directly against
 * document scroll, so it doubles as a readout of how far through a long
 * page the visitor is.
 */
export default function ScrollRail() {
  const fill = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !fill.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(fill.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.25,
          invalidateOnRefresh: true,
        },
      });
    });

    // Route changes swap page height; recompute so the rail stays accurate.
    // Deferred to the next frame after paint so the new page's images and
    // reveals have settled — refreshing mid-settle re-measures against a
    // height that is still changing and can shift the scroll position.
    const id = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      clearTimeout(id);
      ctx.revert();
    };
  }, []);

  return (
    <div className="scroll-rail" aria-hidden="true">
      <div className="scroll-rail__fill" ref={fill} />
    </div>
  );
}
