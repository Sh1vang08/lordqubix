import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import {
  AMP_SERIES,
  AMP_HERO_BADGES,
  AMP_STATS,
  AMP_APPLICATIONS,
  HOW_TO_CHOOSE,
  BG,
  IMG,
  whatsappLink,
} from "../data/site";
import {
  useGsap,
  revealOnScroll,
  parallax,
  countUp,
  gsap,
  trigger,
  EASE,
  DUR,
} from "../anim/useAnim";
import { PRODUCTS, productImage } from "../data/products";
import "./CategoryAmplifiers.css";

const RELATED = [
  { label: "Mixers", icon: "mixer" },
  { label: "Speakers", icon: "speaker" },
  { label: "Processors", icon: "wave" },
  { label: "Cables & Connectors", icon: "connector" },
  { label: "Accessories", icon: "box" },
];

/** Every amplifier in the catalogue, across both brands. */
const AMPLIFIERS = PRODUCTS.filter((p) =>
  /amplifier/i.test(p.category) || /amplifier/i.test(p.summary)
).sort((a, b) => a.name.localeCompare(b.name));

/**
 * Models belonging to a series tab. The AMP_SERIES keys ("qx", "ca", …) are
 * the model-name prefixes, so a series is everything whose name starts with
 * that prefix — QX-4500 and QX-12000 both belong to "qx".
 */
const inSeries = (p, key) =>
  key === "all" || p.name.toLowerCase().startsWith(`${key}-`);

const countFor = (key) => AMPLIFIERS.filter((p) => inSeries(p, key)).length;

export default function CategoryAmplifiers() {
  const [activeSeries, setActiveSeries] = useState("all");

  const shown = AMPLIFIERS.filter((p) => inSeries(p, activeSeries));

  /** Select a series and bring the results into view, so a tap on a phone
   *  visibly does something rather than only changing a highlight. */
  const selectSeries = (key) => {
    setActiveSeries(key);
    const grid = document.getElementById("amp-models");
    if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scope = useGsap((self, root) => {
    const q = gsap.utils.selector(root);

    // Hero: copy first, then the amplifier stack racks in from the right.
    gsap
      .timeline({ defaults: { ease: EASE } })
      .from(q(".cat-hero__crumbs"), { opacity: 0, y: 12, duration: DUR.fast })
      .from(q(".cat-hero__copy h1"), { opacity: 0, y: 32, duration: DUR.base }, "-=0.25")
      .from(q(".cat-hero__lede"), { opacity: 0, y: 18, duration: DUR.fast }, "-=0.45")
      .from(q(".cat-hero__badges li"), {
        opacity: 0,
        y: 20,
        duration: DUR.fast,
        stagger: 0.09,
      }, "-=0.3")
      .from(q(".cat-hero__stack img"), {
        opacity: 0,
        x: 60,
        duration: DUR.slow,
        stagger: 0.12,
      }, "-=0.85");

    parallax(q(".cat-hero__bg")[0], q(".cat-hero")[0], 60);

    revealOnScroll(q(".cat-tab"), q(".cat-select")[0], { each: 0.07, y: 18 });
    revealOnScroll(q(".cat-intro h2, .cat-intro p"), q(".cat-intro")[0], { each: 0.09, y: 24 });

    // Stat block counts up as it arrives.
    const statBox = q(".cat-stats")[0];
    if (statBox) {
      revealOnScroll(q(".cat-stat"), statBox, { each: 0.09, y: 22 });
      q(".cat-stat strong").forEach((el, i) =>
        countUp(el, { triggerEl: statBox, delay: 0.15 + i * 0.09 })
      );
    }

    revealOnScroll(q(".series-card"), q(".cat-series__grid")[0], { each: 0.08, y: 34 });
    revealOnScroll(q(".app-card"), q(".cat-apps__grid")[0], { each: 0.09, y: 34 });
    revealOnScroll(q(".cat-how__steps li"), q(".cat-how__steps")[0], { each: 0.1, y: 26 });
    revealOnScroll(q(".cat-related__item"), q(".cat-related")[0], { each: 0.06, y: 18 });
    revealOnScroll(q(".cat-cta__inner > *"), q(".cat-cta")[0], { each: 0.09, y: 22 });

    q(".rule-title").forEach((t) => revealOnScroll([t], t, { y: 22 }));
  }, []);

  return (
    <>
      <Header />

      <main className="cat" ref={scope}>
        {/* ------------------------------------------------------ hero */}
        <section className="cat-hero">
          <img className="cat-hero__bg" src={BG.hero} alt="" aria-hidden="true" />
          <div className="cat-hero__veil" />

          <div className="shell">
            <nav className="crumbs cat-hero__crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <i>
                <Icon name="chevron" size={11} />
              </i>
              <Link to="/products">Products</Link>
              <i>
                <Icon name="chevron" size={11} />
              </i>
              <span aria-current="page">Power Amplifiers</span>
            </nav>

            <div className="cat-hero__inner">
              <div className="cat-hero__copy">
                <h1>Power Amplifiers</h1>
                <p className="cat-hero__lede">
                  Clean power. Reliable performance.
                </p>

                <ul className="cat-hero__badges">
                  {AMP_HERO_BADGES.map((b) => (
                    <li key={b.title}>
                      <span>
                        <Icon name={b.icon} size={19} />
                      </span>
                      <strong>{b.title}</strong>
                      <small>{b.copy}</small>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cat-hero__stack">
                {[IMG.qx2000, IMG.qx4800, IMG.qx4500].map((src, i) => (
                  <img key={i} src={src} alt="" loading={i === 0 ? "eager" : "lazy"} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- series selector */}
        <section className="cat-select">
          <div className="shell cat-select__inner">
            <p className="cat-select__label">
              Explore Series
              <i />
            </p>
            {/* Tapping a series filters the model grid below and scrolls to
                it. Previously these only set state nothing read, so they
                highlighted but did nothing — on a phone that reads as a
                broken page. */}
            <div className="cat-select__tabs" role="tablist">
              <button
                role="tab"
                aria-selected={activeSeries === "all"}
                className={`cat-tab ${activeSeries === "all" ? "is-active" : ""}`}
                onClick={() => selectSeries("all")}
              >
                <strong>All</strong>
                <small>{AMPLIFIERS.length} models</small>
              </button>
              {AMP_SERIES.map((s) => (
                <button
                  key={s.key}
                  role="tab"
                  aria-selected={activeSeries === s.key}
                  className={`cat-tab ${activeSeries === s.key ? "is-active" : ""}`}
                  onClick={() => selectSeries(s.key)}
                >
                  <img src={s.thumb} alt="" />
                  <strong>{s.name}</strong>
                  <small>{countFor(s.key)} models</small>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ intro + stats */}
        <section className="section section--paper cat-intro">
          <div className="shell cat-intro__inner">
            <div>
              <h2>
                Engineered for Power.
                <br />
                Built for Performance.
              </h2>
              <p>
                Qubix power amplifiers deliver clean, stable and powerful output
                for every professional audio need. Designed with advanced
                protection, intelligent cooling and rugged reliability—ready for
                any challenge.
              </p>
            </div>

            <div className="cat-stats">
              {AMP_STATS.map((s) => (
                <div className="cat-stat" key={s.label}>
                  <Icon name={s.icon} size={30} stroke={1.5} />
                  <strong className={s.wide ? "is-wide" : ""}>{s.value}</strong>
                  <span>{s.label}</span>
                  <small>{s.sub}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------- amplifier models */}
        {/* One card per model, matching the rest of the catalogue. Stacking
            a whole series inside a single card made individual models hard to
            scan and gave each one nowhere to link to. */}
        <section className="section section--paper-alt cat-series" id="amp-models">
          <div className="shell">
            <div className="rule-title">
              <h2>
                {activeSeries === "all"
                  ? "Power Amplifiers"
                  : AMP_SERIES.find((s) => s.key === activeSeries)?.name ||
                    "Power Amplifiers"}
              </h2>
            </div>

            <p className="ampgrid__count">
              Showing <strong>{shown.length}</strong>{" "}
              {shown.length === 1 ? "model" : "models"}
              {activeSeries !== "all" && (
                <button className="ampgrid__clear" onClick={() => selectSeries("all")}>
                  Show all
                </button>
              )}
            </p>

            <div className="ampgrid">
              {shown.map((p) => (
                <Link className="pcard" key={p.slug} to={`/products/${p.slug}`}>
                  <div className="pcard__media">
                    <img
                      src={productImage(p.slug)}
                      alt={p.name}
                      loading="lazy"
                      width="900"
                      height="900"
                    />
                  </div>
                  <div className="pcard__body">
                    <span className="pcard__cat">{p.brand}</span>
                    <h3>{p.name}</h3>
                    <p>{p.summary}</p>
                  </div>
                  <span className="pcard__view">
                    View details
                    <Icon name="chevron" size={13} />
                  </span>
                </Link>
              ))}
            </div>

            <div className="ampgrid__more">
              <Link className="btn btn--outline btn--lg" to="/products">
                Browse all {PRODUCTS.length} products
              </Link>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- applications */}
        <section className="section cat-apps">
          <div className="shell">
            <div className="rule-title">
              <h2>Choose the Right Amplifier</h2>
            </div>

            <div className="cat-apps__grid">
              {AMP_APPLICATIONS.map((a) => (
                <article className="app-card" key={a.title}>
                  <div className={`app-card__media app-card__media--${a.tone}`}>
                    <span className="app-card__icon">
                      <Icon name={a.icon} size={20} />
                    </span>
                  </div>
                  <div className="app-card__body">
                    <h3>{a.title}</h3>
                    <p>{a.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- how to choose */}
        <section className="section section--paper cat-how">
          <div className="shell">
            <div className="rule-title">
              <h2>How to Choose</h2>
            </div>

            <ol className="cat-how__steps">
              {HOW_TO_CHOOSE.map((s, i) => (
                <li key={s.n}>
                  <span className="cat-how__n">{s.n}</span>
                  <span className="cat-how__icon">
                    <Icon name={s.icon} size={22} />
                  </span>
                  <strong>{s.title}</strong>
                  <small>{s.copy}</small>
                  {i < HOW_TO_CHOOSE.length - 1 && (
                    <i className="cat-how__arrow" aria-hidden="true">
                      <Icon name="arrow" size={18} />
                    </i>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ----------------------------------------------------- related */}
        <section className="section section--tight section--paper-alt">
          <div className="shell">
            <p className="cat-related__title">Explore Related Categories</p>
            <div className="cat-related">
              {RELATED.map((r) => (
                <Link className="cat-related__item" to="/products" key={r.label}>
                  <Icon name={r.icon} size={17} />
                  <span>{r.label}</span>
                  <Icon name="chevron" size={13} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- cta */}
        <section className="cat-cta">
          <div className="shell cat-cta__inner">
            <span className="cat-cta__glyph">
              <Icon name="whatsapp" size={32} />
            </span>
            <div>
              <h2>Need Help Choosing the Right Amplifier?</h2>
              <p>
                Chat with our experts on WhatsApp for quick advice and
                recommendations.
              </p>
            </div>
            <div className="cat-cta__action">
              <a
                className="btn btn--whatsapp btn--lg"
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={19} />
                WhatsApp Us Now
              </a>
              <small>Quick response. Expert support.</small>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
