import { useMemo, useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import { BG, whatsappLink } from "../data/site";
import { PRODUCTS, CATEGORIES, productThumb } from "../data/products";
import { useGsap, parallax, gsap, trigger, EASE, DUR } from "../anim/useAnim";
import { prefersReducedMotion } from "../anim/gsap";
import "./Products.css";

const BRANDS = ["All", "Lord", "Qubix"];

/**
 * Orders model names the way the range is actually numbered.
 *
 * A plain string sort compares digit by digit, so QX-10000 lands before
 * QX-2000 ("1" < "2") and a series reads out of order. Numeric collation
 * compares runs of digits as numbers: QX-2000 → QX-3500 → … → QX-16000.
 */
const byModel = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

/**
 * All 169 models on one page.
 *
 * Deliberately simple: a search box, a brand switch and A–Z sorting — the same
 * three controls the live site uses. Everything is on one page, so a visitor
 * scrolls rather than paging, and nothing is hidden behind a filter they have
 * to discover first.
 */
export default function Products() {
  // Links elsewhere on the site can pre-seed the view — "?q=QX" from a series
  // card, or "?brand=/?category=" from the home page collections — so the
  // visitor lands on exactly the range they asked for.
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [brand, setBrand] = useState(params.get("brand") || "All");
  const [category, setCategory] = useState(params.get("category") || null);
  const [sort, setSort] = useState("az");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = PRODUCTS.filter((p) => {
      if (brand !== "All" && p.brand !== brand) return false;
      if (category && p.categorySlug !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    });
    if (sort === "az") out.sort((a, b) => byModel(a.name, b.name));
    if (sort === "za") out.sort((a, b) => byModel(b.name, a.name));
    return out;
  }, [query, brand, category, sort]);

  const activeCategory = CATEGORIES.find((c) => c.slug === category);

  const scope = useGsap(() => {
    const q = gsap.utils.selector(scope.current);
    gsap
      .timeline({ defaults: { ease: EASE } })
      .from(q(".pbanner h1"), { opacity: 0, y: 30, duration: DUR.base })
      .from(q(".pbanner .crumbs"), { opacity: 0, y: 14, duration: DUR.fast }, "-=0.45")
      .from(q(".psearch"), { opacity: 0, y: 18, duration: DUR.fast }, "-=0.3");

    parallax(q(".pbanner__bg")[0], q(".pbanner")[0], 50);
  }, []);

  // Re-animate the grid when the result set changes.
  const gridRef = useRef(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (prefersReducedMotion() || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".pcard");
    if (!cards.length) return;

    if (firstRender.current) {
      firstRender.current = false;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE,
          stagger: 0.02,
          clearProps: "opacity,transform",
          scrollTrigger: trigger(gridRef.current),
        }
      );
      return;
    }

    gsap.fromTo(
      cards,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: DUR.fast,
        ease: EASE,
        stagger: 0.015,
        overwrite: "auto",
        clearProps: "opacity,transform",
      }
    );
  }, [query, brand, category, sort]);

  const reset = () => {
    setQuery("");
    setBrand("All");
    setCategory(null);
  };

  return (
    <>
      <Header />

      <main className="products" ref={scope}>
        <section className="pbanner">
          <img className="pbanner__bg" src={BG.grid} alt="" aria-hidden="true" />
          <div className="shell pbanner__inner">
            <h1>All Products</h1>
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <i>/</i>
              <span aria-current="page">Products</span>
            </nav>
            <p className="pbanner__lead">
              {PRODUCTS.length} models across Qubix and LORD — amplifiers,
              consoles, speakers, drivers and wireless systems.
            </p>
          </div>
        </section>

        <div className="shell">
          <div className="psearch">
            <Icon name="search" size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by model name, e.g. QX-4500"
              aria-label="Search products by model name"
            />
            {query && (
              <button
                className="psearch__clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="ptabs">
            <div className="ptabs__group" role="tablist" aria-label="Brand">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  role="tab"
                  aria-selected={brand === b}
                  className={`ptab ${brand === b ? "is-active" : ""}`}
                  onClick={() => setBrand(b)}
                >
                  {b}
                  <em>
                    {b === "All"
                      ? PRODUCTS.length
                      : PRODUCTS.filter((p) => p.brand === b).length}
                  </em>
                </button>
              ))}
            </div>

            <div className="psort">
              <span>Sort</span>
              <button
                className={sort === "az" ? "is-active" : ""}
                onClick={() => setSort("az")}
              >
                A–Z
              </button>
              <button
                className={sort === "za" ? "is-active" : ""}
                onClick={() => setSort("za")}
              >
                Z–A
              </button>
            </div>
          </div>

          <p className="pcount">
            Showing <strong>{filtered.length}</strong> products
            {activeCategory && (
              <button
                className="pchip"
                onClick={() => setCategory(null)}
                aria-label={`Remove ${activeCategory.label} filter`}
              >
                {activeCategory.label} ✕
              </button>
            )}
          </p>

          {filtered.length === 0 ? (
            <div className="pempty">
              <Icon name="search" size={30} />
              <h3>No products found</h3>
              <p>Try a different model name.</p>
              <button className="btn btn--outline btn--sm" onClick={reset}>
                Show All Products
              </button>
            </div>
          ) : (
            <div className="pgrid" ref={gridRef}>
              {filtered.map((p) => (
                <Link
                  className="pcard"
                  key={p.slug}
                  to={`/products/${p.slug}`}
                  aria-label={`${p.name} — ${p.summary}`}
                >
                  <div className="pcard__media">
                    <img
                      src={productThumb(p.slug)}
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
          )}

          <section className="phelp">
            <img className="phelp__bg" src={BG.waveform} alt="" aria-hidden="true" />
            <span className="phelp__glyph">
              <Icon name="headset" size={30} />
            </span>
            <div className="phelp__text">
              <h2>Not sure what fits your setup?</h2>
              <p>
                Tell us your requirement and we will recommend the right model
                from the range.
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
