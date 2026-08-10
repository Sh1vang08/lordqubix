import { useEffect, useRef } from "react";

/**
 * Horizontal swipe / drag gestures on a container.
 *
 * Uses Pointer Events so touch, pen and mouse-drag all work from one code
 * path. A gesture only counts as a swipe once it clears `threshold` AND is
 * more horizontal than vertical — otherwise a normal vertical page scroll
 * that drifts sideways would fire a slide change.
 *
 * `touch-action: pan-y` on the element (see CSS) lets the browser keep
 * vertical scrolling native while we claim the horizontal axis.
 */
export default function useSwipe({ onLeft, onRight, threshold = 45 } = {}) {
  const ref = useRef(null);
  const state = useRef({ x: 0, y: 0, active: false, id: null });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const down = (e) => {
      // Ignore secondary buttons and gestures starting on a control.
      if (e.button != null && e.button !== 0) return;
      state.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
        id: e.pointerId,
      };
    };

    const up = (e) => {
      const s = state.current;
      if (!s.active || e.pointerId !== s.id) return;
      s.active = false;

      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;

      // Must be a decisive, mostly-horizontal movement.
      if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return;

      if (dx < 0) onLeft?.();
      else onRight?.();
    };

    const cancel = () => {
      state.current.active = false;
    };

    el.addEventListener("pointerdown", down, { passive: true });
    el.addEventListener("pointerup", up, { passive: true });
    el.addEventListener("pointercancel", cancel, { passive: true });
    el.addEventListener("pointerleave", cancel, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", cancel);
      el.removeEventListener("pointerleave", cancel);
    };
  }, [onLeft, onRight, threshold]);

  return ref;
}
