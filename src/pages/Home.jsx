import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import WhatsAppCta from "../components/WhatsAppCta";
import BehindTheCraft from "../components/BehindTheCraft";
import { QubixMark, LordMark } from "../components/Logo";
import {
  HERO_SLIDES,
  STATS,
  CATEGORIES,
  FEATURED,
  SOLUTIONS,
  WHY_QUBIX,
  BG,
  whatsappLink,
} from "../data/site";
import { url as catUrl } from "../data/catalogue";
import {
  useGsap,
  revealOnScroll,
  parallax,
  countUp,
  splitAll,
  scrubWords,
  scrimReveal,
  trackIn,
  scrollMarquee,
  magnetic,
  hoverLift,
  drift,
  drawLine,
  equaliser,
  gsap,
  trigger,
  EASE,
  DUR,
} from "../anim/useAnim";
import { prefersReducedMotion } from "../anim/gsap";
import useSwipe from "../anim/useSwipe";
import "./Home.css";

const SLIDE_MS = 6000;

export default function Home() {
  const [slide, setSlide] = useState(0);

  const next = useCallback(
    () => setSlide((s) => (s + 1) % HERO_SLIDES.length),
    []
  );
  const prev = useCallback(
    () => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length),
    []
  );

  // Swipe left → next slide, swipe right → previous.
  const swipeRef = useSwipe({ onLeft: next, onRight: prev });

  const scope = useGsap((self, root) => {
    const q = gsap.utils.selector(root);

    // Hero: staged entrance. The product art rises last so the eye lands on
    // the headline first.
    gsap
      .timeline({ defaults: { ease: EASE } })
      .from(q(".hero__copy h1 span, .hero__copy h1 em"), {
        opacity: 0,
        y: 34,
        duration: DUR.base,
        stagger: 0.1,
      })
      .from(q(".hero__copy p"), { opacity: 0, y: 20, duration: DUR.base }, "-=0.42")
      .from(q(".hero__actions .btn"), {
        opacity: 0,
        y: 18,
        duration: DUR.fast,
        stagger: 0.09,
      }, "-=0.4")
      .from(q(".hero__product.is-active"), {
        opacity: 0,
        y: 40,
        scale: 0.94,
        duration: DUR.slow,
      }, "-=0.75")
      .from(q(".hero__dots button"), {
        opacity: 0,
        scaleX: 0.3,
        duration: DUR.fast,
        stagger: 0.06,
      }, "-=0.5");

    // Background plate drifts slower than the page; the amplifier floats
    // against it as you scroll away from the fold.
    parallax(q(".hero__bg")[0], q(".hero")[0], 70);
    drift(q(".hero__art")[0], q(".hero")[0], { y: 90, rotate: 0 });

    // Equaliser bars in the hero badge run while the fold is on screen.
    equaliser(q(".hero__eq span"), q(".hero")[0]);

    // Section headings sweep in word by word. The craft reel manages its own
    // heading (its italic accent word must not be re-wrapped by the splitter).
    self.add(() => splitAll(q("section h2:not(.craft__title)")));

    // Lead paragraphs read in under the scroll, word by word.
    q(".section-head + * p, .why-card p, .cat-card__body p").forEach((el) =>
      self.add(() => scrubWords(el, { from: 0.2 }))
    );

    // Eyebrows tighten their tracking as they arrive.
    q(".eyebrow").forEach((el) => trackIn(el));

    // Gold scrim wipes off each section heading. The scrim node is injected
    // here and removed on revert, so remounts never stack duplicates.
    q(".section-head h2:not(.craft__title), .rule-title h2").forEach((title) => {
      self.add(() => {
        // Wrap the title itself so the scrim is clipped to the text block
        // rather than spilling across the full-width section header.
        if (title.querySelector(".a-scrim")) return undefined;
        title.classList.add("a-scrim-host");
        const scrim = document.createElement("span");
        scrim.className = "a-scrim";
        title.appendChild(scrim);
        scrimReveal(title, scrim);
        return () => {
          scrim.remove();
          title.classList.remove("a-scrim-host");
        };
      });
    });

    // Underline rules draw out from their left edge.
    q(".rule-title").forEach((t) => drawLine(t, { origin: "center" }));

    // Cursor-reactive primary CTAs and lifting cards.
    q(".hero__actions .btn, .why__cta .btn").forEach((b) => self.add(() => magnetic(b, 0.22)));
    q(".cat-card, .feat-card, .sol-card").forEach((c) => self.add(() => hoverLift(c)));

    // Stats bar: reveal, then run the numerals up behind the reveal.
    const statsBar = q(".stats")[0];
    revealOnScroll(q(".stat"), statsBar, { each: 0.09, y: 22 });
    q(".stat strong").forEach((el, i) =>
      countUp(el, { triggerEl: statsBar, delay: 0.15 + i * 0.09 })
    );

    // Section headers and card grids.
    q("section").forEach((section) => {
      const head = section.querySelectorAll(".section-head, .rule-title, .eyebrow");
      if (head.length) revealOnScroll(head, section, { each: 0.07, y: 22 });
    });

    revealOnScroll(q(".cat-card"), q(".cat-grid")[0], { each: 0.07, y: 36 });
    revealOnScroll(q(".feat-card"), q(".feat-grid")[0], { each: 0.07, y: 36 });
    revealOnScroll(q(".sol-card"), q(".sol-grid")[0], { each: 0.08, y: 34 });
    revealOnScroll(q(".why-card"), q(".why-grid")[0], { each: 0.08, y: 26 });

    // Brand split: the two halves slide in from their own edges.
    q(".brands__half").forEach((half, i) => {
      gsap.from(half.querySelector(".brands__copy"), {
        opacity: 0,
        x: i === 0 ? -40 : 40,
        duration: DUR.base,
        ease: EASE,
        scrollTrigger: trigger(half),
      });
      gsap.from(half.querySelectorAll(".brands__art img"), {
        opacity: 0,
        y: 30,
        scale: 0.92,
        duration: DUR.base,
        ease: EASE,
        stagger: 0.08,
        scrollTrigger: trigger(half),
      });
    });

    revealOnScroll(q(".wacta"), q(".why__cta")[0], { y: 30 });
  }, []);

  const go = useCallback(
    (n) => setSlide(((n % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length),
    []
  );

  // Auto-advance. Keyed on `slide` so any manual change (swipe, dot, arrow)
  // restarts the countdown instead of cutting the new slide short.
  useEffect(() => {
    const id = setTimeout(next, SLIDE_MS);
    return () => clearTimeout(id);
  }, [slide, next]);

  // Cross-fade the headline/copy whenever the slide rotates. Skipped on the
  // first render so it doesn't fight the intro timeline above.
  const firstSlide = useRef(true);
  useEffect(() => {
    if (firstSlide.current) {
      firstSlide.current = false;
      return;
    }
    if (prefersReducedMotion() || !scope.current) return;
    const copy = scope.current.querySelectorAll(
      ".hero__copy h1 span, .hero__copy h1 em, .hero__copy p"
    );
    gsap.fromTo(
      copy,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: DUR.base, ease: EASE, stagger: 0.07, overwrite: "auto" }
    );
  }, [slide, scope]);

  const active = HERO_SLIDES[slide];

  // Hand-picked catalogue shots — all transparent cut-outs that read
  // cleanly on the coloured brand panels.
  const qubixStrip = [
    catUrl(5, 1), // QX-4800 amplifier
    catUrl(12, 1), // large mixing console
    catUrl(16, 2), // KMC9 wireless system
    catUrl(19, 1), // speaker driver
  ];
  const lordStrip = [
    catUrl(34, 1), // LORD handheld microphone
    catUrl(33, 8), // LORD PA column speakers
    catUrl(28, 6), // LORD DPA-110 mixer amplifier
    catUrl(23, 1), // crossover network
  ];

  return (
    <>
      <Header />

      <main ref={scope}>
        {/* ----------------------------------------------------------- hero */}
        <section className="hero" ref={swipeRef}>
          <img className="hero__bg" src={BG.hero} alt="" aria-hidden="true" />
          <div className="hero__veil" />
          <div className="hero__grain" aria-hidden="true" />

          <div className="shell hero__inner">
            <div className="hero__copy">
              <h1>
                <span>{active.titleTop}</span>
                <em>{active.titleAccent}</em>
              </h1>
              <p>{active.copy}</p>
              <div className="hero__actions">
                <Link className="btn btn--primary btn--lg" to="/products">
                  Explore Products
                  <Icon name="chevron" size={14} />
                </Link>
                <a
                  className="btn btn--ghost-dark btn--lg"
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="whatsapp" size={17} />
                  WhatsApp Enquiry
                </a>
              </div>
            </div>

            <div className="hero__art">
              {/* Warm plate behind the product so a dark rack unit still
                  separates from the near-black stage behind it. */}
              <span className="hero__halo" aria-hidden="true" />
              {HERO_SLIDES.map((s, i) => (
                <img
                  key={s.titleAccent}
                  src={s.image}
                  alt={i === slide ? `${s.titleTop} ${s.titleAccent}` : ""}
                  className={`hero__product ${i === slide ? "is-active" : ""}`}
                  aria-hidden={i !== slide}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ))}
            </div>
          </div>

          <p className="hero__swipe" aria-hidden="true">
            <Icon name="arrow" size={13} style={{ rotate: "180deg" }} />
            Swipe
            <Icon name="arrow" size={13} />
          </p>

          <div className="hero__dots" role="tablist" aria-label="Hero slides">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.titleAccent}
                role="tab"
                aria-selected={i === slide}
                aria-label={`Slide ${i + 1}`}
                className={i === slide ? "is-active" : ""}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- stats */}
        <section className="stats">
          <div className="shell stats__inner">
            {STATS.map((s) => (
              <div className="stat" key={s.value}>
                <Icon name={s.icon} size={30} stroke={1.5} />
                <div>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------- categories */}
        <section className="section section--dark" id="products">
          <div className="shell">
            <div className="section-head">
              <div>
                <p className="eyebrow">Browse by Category</p>
                <h2>Complete Professional Audio Range</h2>
              </div>
              <Link className="section-link" to="/products">
                View All Products <Icon name="chevron" size={13} />
              </Link>
            </div>

            <div className="cat-grid">
              {CATEGORIES.map((c) => (
                <Link
                  className="cat-card"
                  key={c.slug}
                  to={
                    c.slug === "power-amplifiers"
                      ? "/products/power-amplifiers"
                      : "/products"
                  }
                >
                  <div className="cat-card__media">
                    <img src={c.image} alt={c.name} loading="lazy" />
                  </div>
                  <div className="cat-card__body">
                    <div>
                      <h3>{c.name}</h3>
                      <p>{c.blurb}</p>
                    </div>
                    <span className="cat-card__go" aria-hidden="true">
                      <Icon name="arrow" size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- featured */}
        <section className="section section--deep">
          <div className="shell">
            <div className="section-head">
              <div>
                <p className="eyebrow">Featured Products</p>
                <h2>Engineered for Professionals</h2>
              </div>
              <Link className="section-link" to="/products">
                View All Products <Icon name="chevron" size={13} />
              </Link>
            </div>

            <div className="feat-grid">
              {FEATURED.map((f) => (
                <article className="feat-card" key={f.name}>
                  <div className="feat-card__media">
                    <img src={f.image} alt={f.name} loading="lazy" />
                  </div>
                  <p className="feat-card__series">{f.series}</p>
                  <h3>{f.name}</h3>
                  <p className="feat-card__sub">{f.subtitle}</p>
                  <p className="feat-card__copy">{f.copy}</p>
                  <Link className="btn btn--primary btn--sm btn--block" to={f.to}>
                    View Details
                    <Icon name="arrow" size={14} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ solutions */}
        <section className="section section--dark" id="solutions">
          <div className="shell">
            <p className="eyebrow">Solutions for Every Application</p>
            <div className="sol-grid">
              {SOLUTIONS.map((s) => (
                <article className={`sol-card sol-card--${s.tone}`} key={s.title}>
                  <span className="sol-card__icon">
                    <Icon name={s.icon} size={22} />
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------- behind the craft */}
        <BehindTheCraft />

        {/* ---------------------------------------------------- brand split */}
        <section className="brands">
          <div className="brands__half brands__half--qubix">
            <div className="brands__copy">
              <QubixMark size={44} />
              <p>
                Qubix delivers a complete range of professional audio products
                designed for performance, reliability and innovation.
              </p>
              <Link className="btn btn--primary" to="/products">
                Explore Qubix
                <Icon name="chevron" size={13} />
              </Link>
            </div>
            <div className="brands__art">
              {qubixStrip.map((src) => (
                <img key={src} src={src} alt="" loading="lazy" />
              ))}
            </div>
          </div>

          <div className="brands__half brands__half--lord">
            <div className="brands__copy">
              <LordMark size={34} />
              <p>
                LORD by Qubix brings quality accessories and system products
                that complete your audio solution.
              </p>
              <Link className="btn btn--magenta" to="/products">
                Explore LORD
                <Icon name="chevron" size={13} />
              </Link>
            </div>
            <div className="brands__art">
              {lordStrip.map((src) => (
                <img key={src} src={src} alt="" loading="lazy" />
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ why */}
        <section className="section section--dark why">
          <div className="shell">
            <div className="rule-title rule-title--blue why__title">
              <p className="eyebrow">Why Choose Qubix</p>
              <h2>Built on Quality. Driven by Performance.</h2>
            </div>

            <div className="why-grid">
              {WHY_QUBIX.map((w) => (
                <article className="why-card" key={w.title}>
                  <Icon name={w.icon} size={26} />
                  <div>
                    <h3>{w.title}</h3>
                    <p>{w.copy}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="why__cta">
              <WhatsAppCta tone="dark" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
