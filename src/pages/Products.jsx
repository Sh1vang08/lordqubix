import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import { QubixMark, LordMark } from "../components/Logo";
import {
  PRODUCTS,
  PRODUCT_FILTERS,
  BG,
  whatsappLink,
} from "../data/site";
import { useGsap, revealOnScroll, parallax, gsap, trigger, EASE, DUR } from "../anim/useAnim";
import { prefersReducedMotion } from "../anim/gsap";
import "./Products.css";

const PER_PAGE = 12;
const BRANDS = ["All", "Qubix", "LORD"];

export default function Products() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");
  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (brand !== "All" && p.brand !== brand) return false;
      if (category && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    });
  }, [query, brand, category]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const from = filtered.length === 0 ? 0 : (current - 1) * PER_PAGE + 1;
  const to = Math.min(current * PER_PAGE, filtered.length);

  const scope = useGsap((self, root) => {
    const q = gsap.utils.selector(root);

    gsap
      .timeline({ defaults: { ease: EASE } })
      .from(q(".pbanner h1"), { opacity: 0, y: 30, duration: DUR.base })
      .from(q(".pbanner .crumbs"), { opacity: 0, y: 14, duration: DUR.fast }, "-=0.45")
      .from(q(".psearch"), { opacity: 0, y: 18, duration: DUR.fast }, "-=0.3")
      .from(q(".ptab"), { opacity: 0, y: 12, duration: DUR.fast, stagger: 0.06 }, "-=0.25");

    parallax(q(".pbanner__bg")[0], q(".pbanner")[0], 50);

    revealOnScroll(q(".pside"), q(".players")[0], { y: 26 });
    revealOnScroll(q(".phelp"), q(".phelp")[0], { y: 28 });
  }, []);

  // Re-animate the result grid whenever the filters change it, so the new
  // set reads as a deliberate transition rather than a hard swap.
  const gridRef = useRef(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (prefersReducedMotion() || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".pcard");
    if (!cards.length) return;

    if (firstRender.current) {
      firstRender.current = false;
      // Initial paint: reveal on scroll like every other grid.
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE,
          stagger: 0.05,
          clearProps: "opacity,transform",
          scrollTrigger: trigger(gridRef.current),
        }
      );
      return;
    }

    gsap.fromTo(
      cards,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: DUR.fast,
        ease: EASE,
        stagger: 0.035,
        overwrite: "auto",
        clearProps: "opacity,transform",
      }
    );
  }, [query, brand, category, current]);

  const reset = () => {
    setQuery("");
    setBrand("All");
    setCategory(null);
    setPage(1);
  };

  const change = (fn) => (value) => {
    fn(value);
    setPage(1);
  };

  return (
    <>
      <Header />

      <main className="products" ref={scope}>
        {/* --------------------------------------------------- page banner */}
        <section className="pbanner">
          <img className="pbanner__bg" src={BG.grid} alt="" aria-hidden="true" />
          <div className="shell pbanner__inner">
            <h1>Professional Audio Products</h1>
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <i>/</i>
              <span aria-current="page">Products</span>
            </nav>
          </div>
        </section>

        {/* ----------------------------------------------------- search bar */}
        <div className="shell">
          <div className="psearch">
            <Icon name="search" size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => change(setQuery)(e.target.value)}
              placeholder="Search by product or model"
              aria-label="Search by product or model"
            />
          </div>

          <div className="ptabs">
            <div className="ptabs__group" role="tablist" aria-label="Brand">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  role="tab"
                  aria-selected={brand === b}
                  className={`ptab ${brand === b ? "is-active" : ""}`}
                  onClick={() => change(setBrand)(b)}
                >
                  {b}
                </button>
              ))}
            </div>
            <p className="ptabs__count">
              Showing {from}–{to} of {filtered.length} products
            </p>
          </div>

          {/* ------------------------------------------- sidebar + results */}
          <div className="players">
            <aside className="pside" aria-label="Categories">
              <h2>Categories</h2>
              <ul>
                {PRODUCT_FILTERS.map((f) => (
                  <li key={f.slug}>
                    <button
                      className={`pside__item ${
                        category === f.slug ? "is-active" : ""
                      }`}
                      onClick={() =>
                        change(setCategory)(category === f.slug ? null : f.slug)
                      }
                      aria-pressed={category === f.slug}
                    >
                      <Icon name={f.icon} size={19} />
                      <span>{f.name}</span>
                      <em>{f.count}</em>
                    </button>
                  </li>
                ))}
              </ul>
              <button className="pside__reset" onClick={reset}>
                <Icon name="fan" size={15} />
                Reset Filters
              </button>
            </aside>

            <div className="pmain">
              {shown.length === 0 ? (
                <div className="pempty">
                  <Icon name="search" size={30} />
                  <h3>No products found</h3>
                  <p>Try a different search term or reset the filters.</p>
                  <button className="btn btn--outline btn--sm" onClick={reset}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="pgrid" ref={gridRef}>
                  {shown.map((p) => (
                    <article className="pcard" key={p.id}>
                      <div className="pcard__brand">
                        {p.brand === "LORD" ? (
                          <LordMark size={15} color="var(--ink-900)" />
                        ) : (
                          <QubixMark size={17} color="var(--blue-600)" />
                        )}
                      </div>

                      <div className="pcard__media">
                        <img src={p.image} alt={p.name} loading="lazy" />
                      </div>

                      <div className="pcard__body">
                        <h3>{p.name}</h3>
                        <p>{p.subtitle}</p>
                      </div>

                      <div className="pcard__foot">
                        <Link
                          className="btn btn--outline btn--sm pcard__view"
                          to={p.to || "/products/qx-series"}
                        >
                          View Details
                        </Link>
                        <a
                          className="pcard__wa"
                          href={whatsappLink(
                            `Hello Qubix, I would like details on the ${p.name}.`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Enquire about ${p.name} on WhatsApp`}
                        >
                          <Icon name="whatsapp" size={17} />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {pageCount > 1 && (
                <nav className="ppager" aria-label="Pagination">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={current === 1}
                    aria-label="Previous page"
                  >
                    <Icon name="chevron" size={14} style={{ rotate: "180deg" }} />
                  </button>

                  {Array.from({ length: pageCount }, (_, i) => i + 1)
                    .filter(
                      (n) =>
                        n === 1 ||
                        n === pageCount ||
                        Math.abs(n - current) <= 1
                    )
                    .map((n, i, arr) => (
                      <span key={n} className="ppager__slot">
                        {i > 0 && n - arr[i - 1] > 1 && <em>…</em>}
                        <button
                          className={n === current ? "is-active" : ""}
                          onClick={() => setPage(n)}
                          aria-current={n === current ? "page" : undefined}
                        >
                          {n}
                        </button>
                      </span>
                    ))}

                  <button
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    disabled={current === pageCount}
                    aria-label="Next page"
                  >
                    <Icon name="chevron" size={14} />
                  </button>
                </nav>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------- helper */}
          <section className="phelp">
            <img className="phelp__bg" src={BG.waveform} alt="" aria-hidden="true" />
            <span className="phelp__glyph">
              <Icon name="headset" size={30} />
            </span>
            <div className="phelp__text">
              <h2>Not sure what fits your setup?</h2>
              <p>
                Our audio experts are ready to help you choose the right
                products for your needs.
              </p>
            </div>
            <div className="phelp__action">
              <a
                className="btn btn--whatsapp btn--lg"
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={19} />
                Chat on WhatsApp
              </a>
              <small>Quick response • Expert advice</small>
            </div>
          </section>
        </div>
      </main>

      <Footer
        tone="products"
        blurb="Professional audio solutions engineered for performance, reliability and innovation."
      />
    </>
  );
}
