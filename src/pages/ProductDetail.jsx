import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import { QubixMark } from "../components/Logo";
import { QX_PRODUCT, whatsappLink } from "../data/site";
import { useGsap, revealOnScroll, gsap, EASE, DUR } from "../anim/useAnim";
import { prefersReducedMotion } from "../anim/gsap";
import "./ProductDetail.css";

export default function ProductDetail() {
  const p = QX_PRODUCT;
  const [model, setModel] = useState(p.models[2]);
  const [shot, setShot] = useState(0);

  const step = (dir) =>
    setShot((s) => (s + dir + p.gallery.length) % p.gallery.length);

  const scope = useGsap((self, root) => {
    const q = gsap.utils.selector(root);

    gsap
      .timeline({ defaults: { ease: EASE } })
      .from(q(".pd__crumbs"), { opacity: 0, y: 12, duration: DUR.fast })
      .from(q(".pd__stage"), { opacity: 0, x: -34, duration: DUR.base }, "-=0.2")
      .from(q(".pd__thumbs"), { opacity: 0, y: 16, duration: DUR.fast }, "-=0.4")
      .from(q(".pd__info > *"), {
        opacity: 0,
        y: 22,
        duration: DUR.fast,
        stagger: 0.07,
      }, "-=0.65");

    revealOnScroll(q(".pd__pillars-grid article"), q(".pd__pillars")[0], { each: 0.09, y: 26 });
    revealOnScroll(
      q(".pd__design-inner > div:first-child > *"),
      q(".pd__design")[0],
      { each: 0.07, y: 24 }
    );
    revealOnScroll(q(".pd__design-shot"), q(".pd__design")[0], { y: 30, delay: 0.15 });

    // Spec table rows cascade in.
    revealOnScroll(q(".pd__specs-title"), q(".pd__specs")[0], { y: 18 });
    revealOnScroll(q(".pd__table tbody tr"), q(".pd__table")[0], {
      each: 0.035,
      y: 12,
      duration: DUR.fast,
    });

    revealOnScroll(q(".pd__apps article"), q(".pd__apps")[0], { each: 0.08, y: 28 });
    revealOnScroll(q(".pd__related article"), q(".pd__related")[0], { each: 0.08, y: 28 });
    revealOnScroll(q(".pd__cta-inner > *"), q(".pd__cta")[0], { each: 0.09, y: 22 });
  }, []);

  // Cross-fade the main gallery image when the thumbnail selection changes.
  const firstShot = useRef(true);
  useEffect(() => {
    if (firstShot.current) {
      firstShot.current = false;
      return;
    }
    if (prefersReducedMotion() || !scope.current) return;
    const img = scope.current.querySelector(".pd__stage img");
    if (!img) return;
    gsap.fromTo(
      img,
      { opacity: 0, scale: 1.04 },
      { opacity: 1, scale: 1, duration: DUR.fast, ease: EASE, overwrite: "auto" }
    );
  }, [shot, scope]);

  return (
    <>
      <Header />

      <main className="pd" ref={scope}>
        <div className="shell">
          <nav className="crumbs crumbs--light pd__crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <i>/</i>
            <Link to="/products/power-amplifiers">Power Amplifiers</Link>
            <i>/</i>
            <span aria-current="page">QX Series</span>
          </nav>

          {/* --------------------------------------------------- top block */}
          <section className="pd__top">
            <div className="pd__gallery">
              <div className="pd__stage">
                <img
                  src={p.gallery[shot]}
                  alt={`${p.title} — view ${shot + 1}`}
                />
              </div>

              <div className="pd__thumbs">
                <button
                  className="pd__arrow"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                >
                  <Icon name="chevron" size={15} style={{ rotate: "180deg" }} />
                </button>

                <ul>
                  {p.gallery.map((g, i) => (
                    <li key={g}>
                      <button
                        className={i === shot ? "is-active" : ""}
                        onClick={() => setShot(i)}
                        aria-label={`View image ${i + 1}`}
                        aria-current={i === shot}
                      >
                        <img src={g} alt="" />
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  className="pd__arrow"
                  onClick={() => step(1)}
                  aria-label="Next image"
                >
                  <Icon name="chevron" size={15} />
                </button>
              </div>
            </div>

            <div className="pd__info">
              <QubixMark size={22} color="var(--blue-600)" />
              <h1>{p.title}</h1>
              <p className="pd__intro">{p.intro}</p>

              <div className="pd__models">
                <p className="pd__label">Choose Model</p>
                <div className="pd__model-row" role="group" aria-label="Model">
                  {p.models.map((m) => (
                    <button
                      key={m}
                      className={`pd__model ${m === model ? "is-active" : ""}`}
                      onClick={() => setModel(m)}
                      aria-pressed={m === model}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <ul className="pd__highlights">
                {p.highlights.map((h) => (
                  <li key={h}>
                    <Icon name="check-shield" size={16} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="pd__actions">
                <a
                  className="btn btn--whatsapp btn--block btn--lg"
                  href={whatsappLink(
                    `Hello Qubix, I would like a quotation for the ${model}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="whatsapp" size={18} />
                  Enquire on WhatsApp
                </a>
                <button className="btn btn--outline btn--block btn--lg">
                  <Icon name="doc" size={17} />
                  Download Catalogue
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ------------------------------------------------------ pillars */}
        <section className="pd__pillars">
          <div className="shell pd__pillars-grid">
            {p.pillars.map((b) => (
              <article key={b.title}>
                <Icon name={b.icon} size={28} stroke={1.5} />
                <h3>{b.title}</h3>
                <p>{b.copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- design */}
        <section className="section section--paper pd__design">
          <div className="shell pd__design-inner">
            <div>
              <p className="eyebrow">Engineered for Reliable Performance</p>
              <h2>Precision Design. Professional Results.</h2>
              <p className="pd__design-copy">{p.designCopy}</p>
              <ul className="pd__checks">
                {p.designPoints.map((d) => (
                  <li key={d}>
                    <Icon name="check-shield" size={16} />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pd__design-shot">
              <img src={p.designImage} alt="QX Series rear panel" loading="lazy" />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- specs */}
        <section className="section section--tight section--paper pd__specs">
          <div className="shell">
            <p className="pd__specs-title">Specifications</p>

            <div className="pd__table-wrap">
              <table className="pd__table">
                <thead>
                  <tr>
                    <th scope="col">Specification</th>
                    {p.specs.columns.map((c) => (
                      <th
                        scope="col"
                        key={c}
                        className={c === model ? "is-active" : ""}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.specs.rows.map((r) => (
                    <tr key={r.label}>
                      <th scope="row">{r.label}</th>
                      {r.span ? (
                        <td colSpan={p.specs.columns.length} className="is-span">
                          {r.span}
                        </td>
                      ) : (
                        r.values.map((v, i) => (
                          <td
                            key={i}
                            className={
                              p.specs.columns[i] === model ? "is-active" : ""
                            }
                          >
                            {v}
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- applications */}
        <section className="section section--tight section--paper">
          <div className="shell">
            <p className="eyebrow">Ideal Applications</p>
            <div className="pd__apps">
              {p.applications.map((a) => (
                <article key={a.title}>
                  <Icon name={a.icon} size={30} stroke={1.4} />
                  <h3>{a.title}</h3>
                  <p>{a.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ related */}
        <section className="section section--tight section--paper">
          <div className="shell">
            <p className="eyebrow">Explore More</p>
            <h2 className="pd__related-title">Related Products</h2>

            <div className="pd__related">
              {p.related.map((r, i) => (
                <article key={i}>
                  <div className="pd__related-shot">
                    <img src={r.image} alt={r.name} loading="lazy" />
                  </div>
                  <h3>{r.name}</h3>
                  <p>{r.sub}</p>
                  <Link to="/products" className="pd__related-link">
                    Explore <Icon name="arrow" size={14} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- cta */}
        <section className="pd__cta">
          <div className="shell pd__cta-inner">
            <span className="pd__cta-glyph">
              <Icon name="headset" size={28} />
            </span>
            <div>
              <h2>Need Expert Advice?</h2>
              <p>
                Our team is ready to help you choose the right solution for your
                project. Get in touch for product details and support.
              </p>
            </div>
            <Link className="btn pd__cta-btn btn--lg" to="/contact">
              Get a Consultation
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
