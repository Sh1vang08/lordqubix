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
  SOLUTIONS,
  WHY_QUBIX,
  USPS,
  BG,
  whatsappLink,
  SOCIAL,
} from "../data/site";
import { url as catUrl } from "../data/catalogue";
import {
  PRODUCTS as ALL_PRODUCTS,
  FAMILIES,
  sizeInches,
  sizesIn,
  productThumb,
  productEnquiry,
  heroImage,
} from "../data/products";

/** Drivers, and the sizes actually stocked, for the shop-by-size shortcuts. */
const SPEAKERS = ALL_PRODUCTS.filter((p) => /speaker/i.test(p.category));
const SPEAKER_SIZES = sizesIn(SPEAKERS);

/** The models the live site leads with, in the same order. */
const TOP_PICK_SLUGS = ["qx-4500", "qx-3500", "qx-2000", "qx-4800"];
const TOP_PICKS = TOP_PICK_SLUGS.map((s) =>
  ALL_PRODUCTS.find((p) => p.slug === s)
).filter(Boolean);
import {
  useGsap,
  revealOnScroll,
  parallax,
  countUp,
  splitAll,
  scrubWords,
  scrimReveal,
  trackIn,
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
      // The hero artwork animates itself in CSS (see .hero__product), since
      // it is remounted on every slide change and a GSAP tween would leave
      // inline styles on a node the next slide replaces.
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

    // USP cards: stagger in, draw their rule, and run the figure up.
    const uspGrid = q(".usp__grid")[0];
    if (uspGrid) {
      revealOnScroll(q(".usp-card"), uspGrid, { each: 0.1, y: 40 });
      q(".usp-card__line").forEach((el) => drawLine(el, { origin: "left center" }));
      q(".usp-card__stat strong").forEach((el, i) =>
        countUp(el, { triggerEl: uspGrid, delay: 0.2 + i * 0.1 })
      );
      q(".usp-card").forEach((c) => self.add(() => hoverLift(c, { y: -6 })));
    }

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

  // The hero features a real model, so its enquiry carries that product's
  // name, specs and link rather than the generic "I want information" text.
  // A slide without a model falls back to the plain enquiry.
  const activeProduct = active.product
    ? ALL_PRODUCTS.find((p) => p.slug === active.product)
    : null;
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const heroEnquiry = activeProduct
    ? whatsappLink(productEnquiry(activeProduct, origin))
    : whatsappLink();

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

              {/* Headline figures for a slide that features a real model. */}
              {active.badges && (
                <ul className="hero__specs">
                  {active.badges.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}

              <div className="hero__actions">
                <Link
                  className="btn btn--primary btn--lg"
                  to={active.product ? `/products/${active.product}` : "/products"}
                >
                  {active.product ? "View This Model" : "Explore Products"}
                  <Icon name="chevron" size={14} />
                </Link>
                <a
                  className="btn btn--ghost-dark btn--lg"
                  href={heroEnquiry}
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
              {/* Only the current slide's artwork is in the DOM. Stacking all
                  three in one grid cell and hiding the inactive ones let a
                  previous product ghost through behind the current one — two
                  overlapping chassis read as a blurred, broken image. */}
              <img
                key={active.titleAccent}
                src={active.product ? heroImage(active.product) : active.image}
                alt={`${active.titleTop} ${active.titleAccent}`}
                className={`hero__product is-active ${
                  active.product ? "hero__product--plate" : ""
                }`}
                fetchPriority="high"
              />

              {/* Warm the other slides' artwork so the swap is instant. Kept
                  out of the layout entirely rather than hidden in place. */}
              <div className="hero__preload" aria-hidden="true">
                {HERO_SLIDES.map((s, i) =>
                  i === slide ? null : (
                    <img
                      key={s.titleAccent}
                      src={s.product ? heroImage(s.product) : s.image}
                      alt=""
                      loading="lazy"
                    />
                  )
                )}
              </div>
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

            {/* Six families rather than 24 categories: a visitor picks the
                kind of product first, which is how anyone actually shops for
                audio gear. Each card is led by a real model from that family
                so the section scans visually rather than reading as a list. */}
            <div className="ccards">
              {FAMILIES.map((f) => {
                const items = ALL_PRODUCTS.filter((p) =>
                  f.categories.includes(p.category)
                );
                if (!items.length) return null;
                const sample = items[0];
                return (
                  <Link
                    className="ccard"
                    key={f.slug}
                    to={`/products?family=${f.slug}`}
                  >
                    <div className="ccard__media">
                      <img
                        src={productThumb(sample.slug)}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                    <div className="ccard__body">
                      <h4>{f.label}</h4>
                      <p>{f.blurb}</p>
                      <span className="ccard__count">
                        {items.length} models
                      </span>
                    </div>
                    <span className="ccard__go" aria-hidden="true">
                      <Icon name="arrow" size={15} />
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Speakers are the range people search by size, and "which inch
                do I need" is the question the old navigation could not answer.
                Each size shows a real driver from that size, so the choice is
                visual rather than a row of numbers. */}
            <div className="sizejump">
              <div className="sizejump__head">
                <p className="sizejump__label">Shop speakers by size</p>
                <Link className="sizejump__all" to="/products?family=speakers">
                  All speakers <Icon name="chevron" size={12} />
                </Link>
              </div>

              <div className="sizejump__row">
                {SPEAKER_SIZES.map((n) => {
                  const items = SPEAKERS.filter((p) => sizeInches(p) === n);
                  const sample = items[0];
                  return (
                    <Link
                      key={n}
                      className="sizecard"
                      to={`/products?family=speakers&size=${n}`}
                    >
                      <div className="sizecard__media">
                        {sample && (
                          <img
                            src={productThumb(sample.slug)}
                            alt=""
                            loading="lazy"
                          />
                        )}
                      </div>
                      <strong>{n}&quot;</strong>
                      <span>
                        {items.length} {items.length === 1 ? "model" : "models"}
                      </span>
                    </Link>
                  );
                })}
              </div>
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

            {/* Real catalogue models, so every card leads to a real page with
                the manufacturer's own specifications. */}
            <div className="feat-grid">
              {TOP_PICKS.map((f) => (
                <article className="feat-card" key={f.slug}>
                  <div className="feat-card__media feat-card__media--plate">
                    <img
                      src={productThumb(f.slug)}
                      alt={f.name}
                      loading="lazy"
                      width="900"
                      height="900"
                    />
                  </div>
                  <p className="feat-card__series">{f.category}</p>
                  <h3>{f.name}</h3>
                  <p className="feat-card__sub">{f.summary}</p>
                  <p className="feat-card__copy">{f.tagline}</p>
                  <Link
                    className="btn btn--primary btn--sm btn--block"
                    to={`/products/${f.slug}`}
                  >
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
                  <img
                    className="sol-card__bg"
                    src={s.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                  />
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

        {/* --------------------------------------------------------- usps */}
        <section className="usp">
          <span className="usp__glow" aria-hidden="true" />
          <div className="shell">
            <div className="section-head">
              <div>
                <p className="eyebrow">Why Qubix &amp; LORD</p>
                <h2>
                  Built to be <em>relied on</em>
                </h2>
              </div>
            </div>

            <div className="usp__grid">
              {USPS.map((u) => (
                <article className="usp-card" key={u.n}>
                  <span className="usp-card__n" aria-hidden="true">
                    {u.n}
                  </span>

                  <span className="usp-card__icon" aria-hidden="true">
                    <Icon name={u.icon} size={22} />
                  </span>

                  <h3>{u.title}</h3>
                  <p>{u.copy}</p>

                  <p className="usp-card__stat">
                    <strong>{u.stat}</strong>
                    <span>{u.statLabel}</span>
                  </p>

                  <span className="usp-card__line" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------- behind the craft */}
        <BehindTheCraft />

        {/* ------------------------------------------------------ instagram */}
        <section className="insta">
          <div className="shell insta__inner">
            <span className="insta__glyph" aria-hidden="true">
              <Icon name="instagram" size={30} />
            </span>

            <div className="insta__copy">
              <p className="eyebrow">Follow the Build</p>
              <h2>
                See every rig we ship on <em>Instagram</em>
              </h2>
              <p className="insta__lede">
                Install shots from stages, studios and halls across India —
                plus new arrivals and behind-the-bench looks at how each unit
                is tested before it leaves us.
              </p>
            </div>

            <div className="insta__action">
              <a
                className="btn btn--primary btn--lg"
                href={SOCIAL.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="instagram" size={18} />
                Follow {SOCIAL.instagramHandle}
              </a>
              <small>New builds posted every week</small>
            </div>
          </div>
        </section>

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
