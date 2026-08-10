import { useEffect, useRef, useState } from "react";
import "./MusicBar.css";

const TRACK = `${import.meta.env.BASE_URL}mus/music1.mp3`;
const BARS = 6;

/**
 * Sticky ambient-audio toggle, pinned bottom-right.
 *
 * Browsers block autoplay with sound until the user interacts, so the bar
 * starts paused and advertises "Tap to Unmute". The equaliser bars animate
 * only while audio is actually playing.
 */
export default function MusicBar() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    try {
      el.volume = 0.55;
      await el.play();
      setPlaying(true);
    } catch {
      // Autoplay rejected (no gesture yet, or the file is unavailable) —
      // stay paused rather than showing a playing state that is a lie.
      setPlaying(false);
    }
  };

  // Keep React state honest if playback stops for any external reason.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return undefined;
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    el.addEventListener("pause", onPause);
    el.addEventListener("play", onPlay);
    return () => {
      el.removeEventListener("pause", onPause);
      el.removeEventListener("play", onPlay);
    };
  }, []);

  return (
    <div
      className={`musicbar ${playing ? "is-playing" : ""}`}
      onClick={toggle}
      role="button"
      tabIndex={0}
      aria-pressed={playing}
      aria-label={playing ? "Pause background music" : "Play background music"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <span className="musicbar__shimmer" aria-hidden="true" />

      <span className="musicbar__play" aria-hidden="true">
        {playing ? (
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </span>

      <span className="musicbar__bars" aria-hidden="true">
        {Array.from({ length: BARS }, (_, i) => (
          <i key={i} style={{ animationDelay: `${i * 0.11}s` }} />
        ))}
      </span>

      <span className="musicbar__hint">
        {playing ? "Now Playing" : "Tap to Unmute"}
      </span>

      <audio ref={audioRef} src={TRACK} loop preload="none" />
    </div>
  );
}
