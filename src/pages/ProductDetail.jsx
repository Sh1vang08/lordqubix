import { Link, useParams, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import { whatsappLink } from "../data/site";
import {
  PRODUCTS,
  CATEGORIES,
  productBySlug,
  productImage,
  productThumb,
} from "../data/products";
import { useGsap, revealOnScroll, gsap, EASE, DUR } from "../anim/useAnim";
import "./ProductDetail.css";

/**
 * Product detail, driven entirely by the catalogue entry for :slug.
 *
 * Specifications are printed exactly as the manufacturer publishes them. Where
 * a model has no published table the spec block is omitted rather than padded
 * with plausible-looking figures — a wrong spec on a spec sheet is worse than
 * an absent one.
 */
export default function ProductDetail() {
  const { slug } = useParams();
  const p = productBySlug(slug);

  const scope = useGsap(() => {
    if (!scope.current) return;
    const q = gsap.utils.selector(scope.current);

    gsap
      .timeline({ defaults: { ease: EASE } })
      .from(q(".pd__crumbs"), { opacity: 0, y: 12, duration: DUR.fast })
      .from(q(".pd__stage"), { opacity: 0, x: -30, duration: DUR.base }, "-=0.2")
      .from(q(".pd__info > *"), {
        opacity: 0,
        y: 20,
        duration: DUR.fast,
        stagger: 0.07,
      }, "-=0.6");

    revealOnScroll(q(".pd__table tbody tr"), q(".pd__specs")[0], {
      each: 0.03,
      y: 12,
      duration: DUR.fast,
    });
    revealOnScroll(q(".pd__related article"), q(".pd__related")[0], {
      each: 0.06,
      y: 26,
    });
  }, [slug]);

  // Unknown model: send the visitor to the catalogue rather than a dead end.
  if (!p) return <Navigate to="/products" replace />;

  const category = CATEGORIES.find((c) => c.slug === p.categorySlug);

  // Sibling models from the same category read as the most useful "next step".
  const related = PRODUCTS.filter(
    (x) => x.categorySlug === p.categorySlug && x.slug !== p.slug
  ).slice(0, 8);

  const enquiry = whatsappLink(
    `Hello Qubix, I would like details and pricing for the ${p.name} (${p.summary}).`
  );

  return (
    <>
      <Header />

      <main className="pd" ref={scope}>
        <div className="shell">
          <nav className="crumbs crumbs--light pd__crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <i>/</i>
            <Link to="/products">Products</Link>
            <i>/</i>
            <Link to={`/products?brand=${p.brand}`}>{p.brand}</Link>
            {category && (
              <>
                <i>/</i>
                <Link to={`/products?category=${category.slug}`}>
                  {category.label}
                </Link>
              </>
            )}
            <i>/</i>
            <span aria-current="page">{p.name}</span>
          </nav>

          <div className="pd__top">
            <div className="pd__stage">
              <img
                src={productImage(p.slug)}
                alt={p.name}
                width="900"
                height="900"
              />
            </div>

            <div className="pd__info">
              <span className="pd__stock">
                <i /> In Stock
              </span>
              <span className="pd__brand">{p.brand}</span>
              <h1>{p.name}</h1>
              <p className="pd__tagline">{p.tagline}</p>

              {p.features.length > 0 && (
                <ul className="pd__feats">
                  {p.features.map((f) => (
                    <li key={f}>
                      <Icon name="check" size={15} />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <div className="pd__actions">
                <a
                  className="btn btn--whatsapp btn--lg"
                  href={enquiry}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="whatsapp" size={18} />
                  Order via WhatsApp
                </a>
                <Link className="btn btn--outline btn--lg" to="/contact">
                  Request a Quote
                </Link>
              </div>

              <p className="pd__trust">
                Authentic Brand <span>◆</span> Quick Response <span>◆</span> Pan
                India Delivery
              </p>
            </div>
          </div>

          {/* Specifications — printed only when the manufacturer publishes them. */}
          {p.specs.length > 0 && (
            <section className="pd__specs">
              <div className="pd__specs-head">
                <p className="eyebrow">Details</p>
                <h2>
                  Technical <em>Specifications</em>
                </h2>
              </div>
              <table className="pd__table">
                <tbody>
                  {p.specs.map(([k, v]) => (
                    <tr key={k}>
                      <th scope="row">{k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {p.specs.length === 0 && (
            <section className="pd__nospec">
              <h2>Specifications</h2>
              <p>
                Detailed specifications for the {p.name} are available on
                request — message us and we will send the full datasheet.
              </p>
              <a
                className="btn btn--whatsapp"
                href={whatsappLink(
                  `Hello Qubix, please send the specification sheet for the ${p.name}.`
                )}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={17} />
                Request Datasheet
              </a>
            </section>
          )}

          {related.length > 0 && (
            <section className="pd__related">
              <div className="pd__related-head">
                <h2>
                  More from <em>{category ? category.label : p.brand}</em>
                </h2>
                <Link
                  to={`/products?category=${p.categorySlug}`}
                  className="pd__related-all"
                >
                  View all <Icon name="chevron" size={13} />
                </Link>
              </div>

              <div className="pd__related-grid">
                {related.map((r) => (
                  <article key={r.slug}>
                    <Link to={`/products/${r.slug}`}>
                      <div className="pd__related-media">
                        <img
                          src={productThumb(r.slug)}
                          alt={r.name}
                          loading="lazy"
                          width="900"
                          height="900"
                        />
                      </div>
                      <span className="pd__related-cat">{r.category}</span>
                      <h3>{r.name}</h3>
                      <p>{r.summary}</p>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer tone="products" />
    </>
  );
}
