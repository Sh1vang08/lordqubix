import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import { QubixMark, LordMark } from "../components/Logo";
import {
  JOURNEY,
  VALUES,
  ECOSYSTEM,
  ABOUT_STATS,
  BG,
  IMG,
  whatsappLink,
} from "../data/site";
import { url as catUrl } from "../data/catalogue";
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
import "./About.css";

const QUBIX_TAGS = [
  { label: "Power Amplifiers", icon: "amp" },
  { label: "Mixers", icon: "mixer" },
  { label: "Wireless Systems", icon: "wireless" },
  { label: "Speakers", icon: "speaker" },
];

const LORD_TAGS = [
  { label: "PA Systems", icon: "pa" },
  { label: "Consoles", icon: "mixer" },
  { label: "Microphones", icon: "mic" },
  { label: "Components", icon: "connector" },
];

export default function About() {
  // Hand-picked transparent cut-outs, matched to the four tags below each
  // brand panel so the imagery and labels line up.
  const qubixShots = [
    catUrl(5, 1), // QX-4800 power amplifier
    catUrl(12, 1), // mixing console
    catUrl(16, 2), // KMC9 wireless system
    catUrl(33, 8), // column speakers
  ];

  const lordShots = [
    catUrl(28, 6), // LORD DPA-110 PA amplifier
    catUrl(11, 3), // console
    catUrl(34, 1), // LORD microphone
    catUrl(23, 1), // crossover components
  ];

  const scope = useGsap((self, root) => {
    const q = gsap.utils.selector(root);

    gsap
      .timeline({ defaults: { ease: EASE } })
      .from(q(".ab-hero__copy h1 span, .ab-hero__copy h1 em"), {
        opacity: 0,
        y: 32,
        duration: DUR.base,
        stagger: 0.1,
      })
      .from(q(".ab-hero__copy p"), { opacity: 0, y: 20, duration: DUR.base }, "-=0.45")
      .from(q(".ab-hero__art img"), {
        opacity: 0,
        y: 36,
        scale: 0.95,
        duration: DUR.slow,
      }, "-=0.8");

    parallax(q(".ab-hero__bg")[0], q(".ab-hero")[0], 60);
    parallax(q(".ab-partner__bg")[0], q(".ab-partner")[0], 40);

    revealOnScroll(q(".ab-legacy__inner > div > *"), q(".ab-legacy")[0], { each: 0.08, y: 24 });
    revealOnScroll(q(".ab-legacy__tile"), q(".ab-legacy__collage")[0], { each: 0.1, y: 28 });

    // Journey timeline: milestones light up left to right.
    revealOnScroll(q(".ab-journey__line li"), q(".ab-journey__line")[0], { each: 0.12, y: 26 });

    revealOnScroll(q(".ab-brand"), q(".ab-brands__grid")[0], { each: 0.12, y: 32 });
    revealOnScroll(q(".ab-values__grid article"), q(".ab-values__grid")[0], { each: 0.08, y: 30 });
    revealOnScroll(q(".ab-eco__grid article"), q(".ab-eco__grid")[0], { each: 0.05, y: 24 });
    revealOnScroll(q(".ab-quality__inner > div > *"), q(".ab-quality")[0], { each: 0.08, y: 24 });
    revealOnScroll(q(".ab-quality__shots > div"), q(".ab-quality__shots")[0], { each: 0.1, y: 26 });

    // Headline stats count up.
    const statBar = q(".ab-stats")[0];
    if (statBar) {
      revealOnScroll(q(".ab-stats__inner > div"), statBar, { each: 0.09, y: 22 });
      q(".ab-stats__inner strong").forEach((el, i) =>
        countUp(el, { triggerEl: statBar, delay: 0.15 + i * 0.09 })
      );
    }

    revealOnScroll(q(".ab-partner__inner > *"), q(".ab-partner")[0], { each: 0.1, y: 24 });
    revealOnScroll(q(".ab-wa__inner > *"), q(".ab-wa")[0], { each: 0.08, y: 18 });

    q(".rule-title").forEach((t) => revealOnScroll([t], t, { y: 22 }));
  }, []);

  return (
    <>
      <Header />

      <main className="ab" ref={scope}>
        {/* ------------------------------------------------------- hero */}
        <section className="ab-hero">
          <img className="ab-hero__bg" src={BG.hero} alt="" aria-hidden="true" />
          <div className="ab-hero__veil" />

          <div className="shell ab-hero__inner">
            <div className="ab-hero__copy">
              <h1>
                <span>Engineering Sound.</span>
                <em>Empowering Performance.</em>
              </h1>
              <p>
                Qubix and LORD deliver professional audio solutions engineered
                for precision, built for reliability, and trusted by sound
                professionals worldwide.
              </p>
            </div>
            <div className="ab-hero__art">
              <img src={IMG.qx12000} alt="Qubix QX-12000 power amplifier" />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ legacy */}
        <section className="section section--paper ab-legacy">
          <div className="shell ab-legacy__inner">
            <div>
              <p className="eyebrow eyebrow--magenta">
                Precision in Every Frequency
              </p>
              <h2>
                Built on a legacy of excellence and driven by engineering
                innovation.
              </h2>
              <p className="ab-legacy__copy">
                Founded in 1987, LORD began with pioneering microphone
                technologies and evolved into a trusted global brand for
                professional audio systems.
              </p>
              <p className="ab-legacy__copy">
                Established in 2016 in India, Qubix Engineering advanced this
                legacy with in-house design, modern manufacturing, and a
                commitment to delivering performance that professionals depend
                on.
              </p>
            </div>

            <div className="ab-legacy__collage">
              {[catUrl(15, 3), catUrl(20, 2), catUrl(10, 1)].map((src) => (
                <div className="ab-legacy__tile" key={src}>
                  <img src={src} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- journey */}
        <section className="section ab-journey">
          <div className="shell">
            <div className="rule-title rule-title--magenta">
              <h2>Our Journey</h2>
            </div>

            <ol className="ab-journey__line">
              {JOURNEY.map((j) => (
                <li key={j.title}>
                  <span className="ab-journey__dot">
                    <Icon name={j.icon} size={22} />
                  </span>
                  <strong>{j.title}</strong>
                  <p>{j.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------ brands */}
        <section className="section section--tight ab-brands">
          <div className="shell">
            <div className="rule-title rule-title--magenta">
              <h2>Two Brands. One Commitment.</h2>
            </div>

            <div className="ab-brands__grid">
              <article className="ab-brand ab-brand--qubix">
                <QubixMark size={38} />
                <p className="ab-brand__tag">Engineered for Performance.</p>
                <p className="ab-brand__copy">
                  Qubix delivers high-performance professional audio solutions
                  with precision engineering and modern technology.
                </p>
                <div className="ab-brand__shots">
                  {qubixShots.map((src) => (
                    <img key={src} src={src} alt="" loading="lazy" />
                  ))}
                </div>
                <ul className="ab-brand__tags">
                  {QUBIX_TAGS.map((t) => (
                    <li key={t.label}>
                      <Icon name={t.icon} size={17} />
                      <span>{t.label}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="ab-brand ab-brand--lord">
                <LordMark size={30} />
                <p className="ab-brand__tag ab-brand__tag--blue">
                  Built for Reliability.
                </p>
                <p className="ab-brand__copy">
                  LORD offers dependable PA systems, consoles, microphones and
                  components trusted by sound professionals.
                </p>
                <div className="ab-brand__shots">
                  {lordShots.map((src) => (
                    <img key={src} src={src} alt="" loading="lazy" />
                  ))}
                </div>
                <ul className="ab-brand__tags">
                  {LORD_TAGS.map((t) => (
                    <li key={t.label}>
                      <Icon name={t.icon} size={17} />
                      <span>{t.label}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ values */}
        <section className="section section--tight ab-values">
          <div className="shell">
            <div className="rule-title rule-title--magenta">
              <h2>Our Values</h2>
            </div>

            <div className="ab-values__grid">
              {VALUES.map((v) => (
                <article key={v.title}>
                  <Icon name={v.icon} size={26} />
                  <h3>{v.title}</h3>
                  <p>{v.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- ecosystem */}
        <section className="section section--tight ab-eco">
          <div className="shell">
            <div className="rule-title rule-title--magenta">
              <h2>Our Product Ecosystem</h2>
            </div>

            <div className="ab-eco__grid">
              {ECOSYSTEM.map((e) => (
                <article key={e.title}>
                  <h3>{e.title}</h3>
                  <div className="ab-eco__shot">
                    <img src={e.image} alt={e.title} loading="lazy" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ quality */}
        <section className="section section--tight ab-quality">
          <div className="shell ab-quality__inner">
            <div>
              <p className="eyebrow eyebrow--magenta">Quality You Can Hear.</p>
              <h2>Tested. Trusted. Delivered.</h2>
              <p>
                Every Qubix and LORD product undergoes rigorous testing at every
                stage—from component inspection to final performance validation.
              </p>
              <p>
                Advanced test equipment and quality protocols ensure
                reliability, safety, and superior audio performance.
              </p>
            </div>

            <div className="ab-quality__shots">
              {[catUrl(23, 1), catUrl(22, 1), catUrl(35, 9)].map((src) => (
                <div key={src}>
                  <img src={src} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- stats */}
        <section className="ab-stats">
          <div className="shell ab-stats__inner">
            {ABOUT_STATS.map((s) => (
              <div key={s.label}>
                <Icon name={s.icon} size={26} />
                <strong>{s.value}</strong>
                <span>{s.label}</span>
                <small>{s.sub}</small>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- partner */}
        <section className="ab-partner">
          <img className="ab-partner__bg" src={BG.hero} alt="" aria-hidden="true" />
          <div className="shell ab-partner__inner">
            <div>
              <h2>Partner with Sound Excellence.</h2>
              <p>
                Join our network of dealers and system integrators. Let's
                deliver exceptional audio experiences together.
              </p>
            </div>
            <Link className="btn btn--magenta btn--lg" to="/contact">
              Become a Dealer
              <Icon name="arrow" size={15} />
            </Link>
          </div>
        </section>

        {/* --------------------------------------------------------- wa */}
        <section className="ab-wa">
          <div className="shell ab-wa__inner">
            <span className="ab-wa__glyph">
              <Icon name="whatsapp" size={26} />
            </span>
            <div>
              <h3>Have Questions? We're Here to Help.</h3>
              <p>Chat with our team on WhatsApp for quick support and product enquiries.</p>
            </div>
            <a
              className="btn ab-wa__btn btn--lg"
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
