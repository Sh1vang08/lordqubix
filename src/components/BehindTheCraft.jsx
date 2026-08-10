import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { gsap, prefersReducedMotion } from "../anim/gsap";
import { url as catUrl } from "../data/catalogue";
import "./BehindTheCraft.css";

const SLIDE_MS = 4200;

// Served from /public rather than imported: these clips total ~60 MB and
// should stream on demand, not be inlined into the bundle graph.
const reel = (n) => `${import.meta.env.BASE_URL}reel/reel${n}.mp4`;

/**
 * "Behind the Craft" — an auto-advancing video reel. The active card is
 * enlarged, unmuted-capable and playing; the rest sit back dimmed and
 * paused so only one video decodes at a time.
 */
const SLIDES = [
  { n: "01", title: "The Art of Excellence", video: reel(1), poster: catUrl(20, 2) },
  { n: "02", title: "Timeless Precision", video: reel(2), poster: catUrl(11, 3) },
  { n: "03", title: "Refined Moments", video: reel(3), poster: catUrl(16, 2) },
  { n: "04", title: "Pure Mastery", video: reel(4), poster: catUrl(5, 1) },
  { n: "05", title: "Elegance Defined", video: reel(5), poster: catUrl(33, 8) },
];

export default function BehindTheCraft() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const scope = useRef(null);
  const barRef = useRef(null);
  const videoRefs = useRef([]);

  // Play only the active clip; everything else rewinds and pauses so a
  // single decode is in flight at a time.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && !paused) {
        // Autoplay can reject (e.g. unmuted without a gesture) — ignore it
        // and leave the poster showing rather than throwing.
        v.play().catch(() => {});
      } else {
        v.pause();
        if (i !== active) v.currentTime = 0;
      }
    });
  }, [active, paused]);

  const go = useCallback(
    (i) => setActive(((i % SLIDES.length) + SLIDES.length) % SLIDES.length),
    []
  );

  // Auto-advance, suspended while the pointer rests on the reel.
  useEffect(() => {
    if (paused) return undefined;
    const id = setTimeout(() => go(active + 1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [active, paused, go]);

  // Progress bar tracks the same interval as the auto-advance.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar || prefersReducedMotion()) return undefined;
    const tween = gsap.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, duration: SLIDE_MS / 1000, ease: "none" }
    );
    if (paused) tween.pause();
    return () => tween.kill();
  }, [active, paused]);

  return (
    <section className="craft" ref={scope} aria-labelledby="craft-title">
      <div className="shell craft__head">
        <p className="craft__eyebrow">Visual Collection</p>
        <h2 id="craft-title" className="craft__title">
          Behind the <em>Craft</em>
        </h2>
        <span className="craft__rule" />
        <p className="craft__status">
          <i className={paused ? "" : "is-live"} />
          {paused ? "Paused" : "Auto Playing"}
        </p>
      </div>

      <div
        className="craft__reel"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <ul className="craft__track">
          {SLIDES.map((s, i) => {
            const state =
              i === active ? "is-active" : Math.abs(i - active) === 1 ? "is-adj" : "";
            return (
              <li key={s.n} className={`craft-card ${state}`}>
                <button
                  className="craft-card__hit"
                  onClick={() => go(i)}
                  aria-label={`Show ${s.title}`}
                  aria-current={i === active}
                >
                  <span className="craft-card__corner craft-card__corner--tl" />
                  <span className="craft-card__corner craft-card__corner--br" />

                  <video
                    ref={(node) => {
                      videoRefs.current[i] = node;
                    }}
                    src={s.video}
                    poster={s.poster}
                    loop
                    muted={muted}
                    playsInline
                    // Only the active clip is worth fetching eagerly; the
                    // rest stay on their poster until selected.
                    preload={i === active ? "auto" : "none"}
                  />
                  <span className="craft-card__veil" />

                  {i === active && (
                    <>
                      <span
                        className="craft-card__sound"
                        role="button"
                        tabIndex={0}
                        aria-label={muted ? "Unmute video" : "Mute video"}
                        aria-pressed={!muted}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMuted((m) => !m);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            setMuted((m) => !m);
                          }
                        }}
                      >
                        <Icon name={muted ? "mute" : "sound"} size={15} />
                      </span>

                      <span className="craft-card__prog">
                        <span className="craft-card__prog-fill" ref={barRef} />
                      </span>
                    </>
                  )}

                  <span className="craft-card__info">
                    <em>
                      {s.n} / Collection
                    </em>
                    <strong>{s.title}</strong>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="craft__nav">
          <button onClick={() => go(active - 1)} aria-label="Previous">
            <Icon name="chevron" size={15} style={{ rotate: "180deg" }} />
          </button>

          <div className="craft__dots" role="tablist" aria-label="Reel slides">
            {SLIDES.map((s, i) => (
              <button
                key={s.n}
                role="tab"
                aria-selected={i === active}
                aria-label={s.title}
                className={i === active ? "is-active" : ""}
                onClick={() => go(i)}
              />
            ))}
          </div>

          <button onClick={() => go(active + 1)} aria-label="Next">
            <Icon name="chevron" size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
