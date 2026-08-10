import logoSrc from "../assets/logo.png";

/**
 * The supplied brand lockup: gold "Qubix" wordmark with the
 * "Engineered in Italy" line and the India/Italy flags. Used as-is.
 */
export function BrandLogo({ height = 34, className = "" }) {
  return (
    <img
      src={logoSrc}
      alt="Qubix — Engineered in Italy"
      className={`brand-logo ${className}`}
      style={{ height }}
      width="3289"
      height="638"
    />
  );
}

// The type-drawn wordmarks below remain for places that need a single-colour
// mark (footer columns, product cards) where the full lockup is too wide.

export function QubixMark({ size = 26, showR = true, color = "#fff" }) {
  return (
    <span
      className="wordmark wordmark--qubix"
      style={{ fontSize: size, color }}
    >
      Qubix
      {showR && <sup>®</sup>}
    </span>
  );
}

export function LordMark({ size = 20, color = "#fff" }) {
  return (
    <span className="wordmark wordmark--lord" style={{ fontSize: size, color }}>
      <span className="wordmark__lord-inner">LORD</span>
      <sup>®</sup>
    </span>
  );
}

/** Stacked Qubix over LORD — the header/footer lockup on the dark pages. */
export function StackedLogo({ scale = 1 }) {
  return (
    <span className="logo-stack" style={{ "--s": scale }}>
      <QubixMark size={22 * scale} />
      <LordMark size={16 * scale} />
    </span>
  );
}

/** Side-by-side lockup used on the products page header. */
export function InlineLogo({ scale = 1, divider = false }) {
  return (
    <span className="logo-inline" style={{ "--s": scale }}>
      <QubixMark size={23 * scale} />
      {divider && <i className="logo-inline__bar" />}
      <LordMark size={17 * scale} />
    </span>
  );
}

/** Qubix with the "PROFESSIONAL AUDIO" sub-line (contact page header). */
export function QubixProLogo({ scale = 1 }) {
  return (
    <span className="logo-pro" style={{ "--s": scale }}>
      <QubixMark size={23 * scale} />
      <em>PROFESSIONAL AUDIO</em>
    </span>
  );
}

/** Qubix | LORD with the red LORD + tagline (category page header). */
export function QubixLordTagline({ scale = 1 }) {
  return (
    <span className="logo-tagline" style={{ "--s": scale }}>
      <QubixMark size={23 * scale} />
      <i className="logo-tagline__bar" />
      <span className="logo-tagline__lord">
        <LordMark size={16 * scale} color="var(--red-500)" />
        <em>PERFECTING SOUND</em>
      </span>
    </span>
  );
}
