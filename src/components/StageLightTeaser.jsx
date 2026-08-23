import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import "./StageLightTeaser.css";

const VIDEO = `${import.meta.env.BASE_URL}video/stage-light-teaser.mp4`;
const POSTER = `${import.meta.env.BASE_URL}video/stage-light-teaser-poster.jpg`;

/**
 * Full-width ambient video between the size shortcuts and the featured
 * products grid — plain autoplay-loop like a cinema screen, not a card the
 * visitor drives.
 *
 * Muted to start, matching every browser's autoplay policy and the same
 * pattern BehindTheCraft uses: playing with sound requires a tap. Paused
 * outside the viewport via IntersectionObserver so it isn't decoding when
 * scrolled away.
 */
export default function StageLightTeaser() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView]);

  const toggleMute = () => {
    const v = videoRef.current;
    setMuted((m) => {
      const next = !m;
      if (v) v.muted = next;
      return next;
    });
  };

  return (
    <section className="stage-teaser" ref={sectionRef}>
      <video
        ref={videoRef}
        src={inView ? VIDEO : undefined}
        poster={POSTER}
        loop
        muted={muted}
        playsInline
        preload="none"
      />
      <button
        type="button"
        className="stage-teaser__sound"
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
      >
        <Icon name={muted ? "mute" : "sound"} size={15} />
      </button>
    </section>
  );
}
