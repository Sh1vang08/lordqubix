import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import {
  CONTACT,
  INTEREST_CARDS,
  ENQUIRY_STEPS,
  FAQS,
  PRODUCT_CATEGORY_OPTIONS,
  BG,
  whatsappLink,
} from "../data/site";
import { useGsap, revealOnScroll, parallax, gsap, EASE, DUR } from "../anim/useAnim";
import "./Contact.css";

const EMPTY = {
  name: "",
  company: "",
  phone: "",
  email: "",
  category: "",
  model: "",
  requirement: "",
};

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((x) => ({ ...x, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your full name.";
    if (!form.company.trim()) next.company = "Please enter your company.";
    if (!/^[\d\s+()-]{7,}$/.test(form.phone.trim()))
      next.phone = "Please enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!form.category) next.category = "Please select a category.";
    if (!form.requirement.trim())
      next.requirement = "Please describe your requirement.";
    return next;
  };

  const submit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = document.querySelector("[aria-invalid='true']");
      first?.focus();
      return;
    }
    // No backend in this build — hand the enquiry to WhatsApp, which is the
    // primary channel throughout the approved designs.
    const msg = [
      `New enquiry from ${form.name} (${form.company})`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Category: ${form.category}`,
      form.model && `Model: ${form.model}`,
      `Requirement: ${form.requirement}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappLink(msg), "_blank", "noopener");
    setSent(true);
    setForm(EMPTY);
  };

  const field = (key) => ({
    value: form[key],
    onChange: set(key),
    "aria-invalid": errors[key] ? "true" : undefined,
    "aria-describedby": errors[key] ? `${key}-err` : undefined,
  });

  const scope = useGsap((self, root) => {
    const q = gsap.utils.selector(root);

    gsap
      .timeline({ defaults: { ease: EASE } })
      .from(q(".ct-hero .eyebrow"), { opacity: 0, y: 14, duration: DUR.fast })
      .from(q(".ct-hero h1"), { opacity: 0, y: 30, duration: DUR.base }, "-=0.3")
      .from(q(".ct-hero__copy"), { opacity: 0, y: 18, duration: DUR.base }, "-=0.5")
      .from(q(".ct-panel"), { opacity: 0, x: -34, duration: DUR.base }, "-=0.45")
      .from(q(".ct-form-card"), { opacity: 0, x: 34, duration: DUR.base }, "-=0.7");

    parallax(q(".ct-hero__bg")[0], q(".ct-hero")[0], 50);

    revealOnScroll(q(".ct-panel__list li"), q(".ct-panel__list")[0], { each: 0.08, y: 18 });
    revealOnScroll(q(".ct-interest article"), q(".ct-interest")[0], { each: 0.07, y: 30 });
    revealOnScroll(q(".ct-steps li"), q(".ct-steps")[0], { each: 0.12, y: 26 });
    revealOnScroll(q(".ct-faq li"), q(".ct-faq")[0], { each: 0.06, y: 16 });
    revealOnScroll(q(".ct-map__copy > *"), q(".ct-map")[0], { each: 0.08, y: 22 });
    revealOnScroll(q(".ct-map__frame"), q(".ct-map")[0], { y: 28, delay: 0.12 });
    revealOnScroll(q(".ct-wa__inner > *"), q(".ct-wa")[0], { each: 0.08, y: 18 });

    q(".rule-title").forEach((t) => revealOnScroll([t], t, { y: 22 }));
  }, []);

  return (
    <>
      <Header />

      <main className="ct" ref={scope}>
        {/* -------------------------------------------------------- hero */}
        <section className="ct-hero">
          <img className="ct-hero__bg" src={BG.waveform} alt="" aria-hidden="true" />
          <div className="shell ct-hero__inner">
            <p className="eyebrow">Let's Connect</p>
            <h1>
              Let's Build the Right
              <br />
              Audio Solution
            </h1>
            <p className="ct-hero__copy">
              Talk to our audio experts or send us your requirements.
              <br />
              We'll help you choose the right products for your needs.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------- panel + form */}
        <section className="shell ct-main">
          <aside className="ct-panel">
            <h2>
              Talk to Our
              <br />
              Product Experts
            </h2>
            <p className="ct-panel__lede">
              Get in touch with our team for expert guidance, custom solutions
              and product support.
            </p>

            <a
              className="btn btn--whatsapp btn--block btn--lg"
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" size={19} />
              Chat on WhatsApp
            </a>

            <ul className="ct-panel__list">
              <li>
                <Icon name="phone" size={18} />
                <div>
                  <strong>{CONTACT.phone}</strong>
                  <span>{CONTACT.hours}</span>
                </div>
              </li>
              <li>
                <Icon name="mail" size={18} />
                <div>
                  <strong>{CONTACT.email}</strong>
                  <span>We reply within 2 business hours</span>
                </div>
              </li>
              <li>
                <Icon name="clock" size={18} />
                <div>
                  <strong>Business Hours</strong>
                  <span>{CONTACT.hours}</span>
                </div>
              </li>
              <li>
                <Icon name="headset" size={18} />
                <div>
                  <strong>Our Response Promise</strong>
                  <span>
                    We typically respond within 2 business hours on working
                    days.
                  </span>
                </div>
              </li>
            </ul>
          </aside>

          <div className="ct-form-card">
            <h2>Send Us an Enquiry</h2>
            <p className="ct-form__lede">
              Fill in your details and our experts will get back to you.
            </p>

            {sent && (
              <p className="ct-form__sent" role="status">
                <Icon name="check-shield" size={17} />
                Thanks! Your enquiry has been prepared in WhatsApp — press send
                there and our team will reply shortly.
              </p>
            )}

            <form className="ct-form" onSubmit={submit} noValidate>
              <div className="ct-form__row">
                <label className="ct-field">
                  <span>
                    Full Name <i>*</i>
                  </span>
                  <input type="text" autoComplete="name" {...field("name")} />
                  {errors.name && (
                    <em id="name-err">{errors.name}</em>
                  )}
                </label>

                <label className="ct-field">
                  <span>
                    Company / Organization <i>*</i>
                  </span>
                  <input
                    type="text"
                    autoComplete="organization"
                    {...field("company")}
                  />
                  {errors.company && (
                    <em id="company-err">{errors.company}</em>
                  )}
                </label>
              </div>

              <div className="ct-form__row">
                <label className="ct-field">
                  <span>
                    Phone Number <i>*</i>
                  </span>
                  <input type="tel" autoComplete="tel" {...field("phone")} />
                  {errors.phone && <em id="phone-err">{errors.phone}</em>}
                </label>

                <label className="ct-field">
                  <span>
                    Email Address <i>*</i>
                  </span>
                  <input type="email" autoComplete="email" {...field("email")} />
                  {errors.email && <em id="email-err">{errors.email}</em>}
                </label>
              </div>

              <label className="ct-field">
                <span>
                  Product Category <i>*</i>
                </span>
                <div className="ct-select">
                  <select {...field("category")}>
                    <option value="">Select a Category</option>
                    {PRODUCT_CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevron-down" size={15} />
                </div>
                {errors.category && (
                  <em id="category-err">{errors.category}</em>
                )}
              </label>

              <label className="ct-field">
                <span>Model / Product Interest</span>
                <input
                  type="text"
                  placeholder="e.g., QX Series Amplifier, MG Mixing Console"
                  {...field("model")}
                />
              </label>

              <label className="ct-field">
                <span>
                  Requirement / Application <i>*</i>
                </span>
                <textarea
                  rows={4}
                  placeholder="Tell us about your requirement, venue type, project details, quantity, timeline, etc."
                  {...field("requirement")}
                />
                {errors.requirement && (
                  <em id="requirement-err">{errors.requirement}</em>
                )}
              </label>

              <button type="submit" className="btn btn--primary btn--block btn--lg">
                <Icon name="send" size={17} />
                Send Enquiry
              </button>

              <p className="ct-form__note">
                <Icon name="lock" size={14} />
                Your information is secure and will not be shared with third
                parties.
              </p>
            </form>
          </div>
        </section>

        {/* ---------------------------------------------------- interest */}
        <section className="section section--tight">
          <div className="shell">
            <div className="rule-title rule-title--blue">
              <h2 className="ct-h2">What Are You Interested In?</h2>
            </div>

            <div className="ct-interest">
              {INTEREST_CARDS.map((c) => (
                <article key={c.title}>
                  <div className="ct-interest__shot">
                    <img src={c.image} alt={c.title} loading="lazy" />
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.copy}</p>
                  <a className="ct-interest__link" href="/products">
                    Explore <Icon name="arrow" size={14} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- steps */}
        <section className="section section--tight">
          <div className="shell">
            <div className="rule-title rule-title--blue">
              <h2 className="ct-h2">How Enquiries Work</h2>
            </div>

            <ol className="ct-steps">
              {ENQUIRY_STEPS.map((s) => (
                <li key={s.n}>
                  <span className="ct-steps__n">{s.n}</span>
                  <span className="ct-steps__icon">
                    <Icon name={s.icon} size={24} />
                  </span>
                  <div>
                    <strong>{s.title}</strong>
                    <p>{s.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* --------------------------------------------------------- faq */}
        <section className="section section--tight">
          <div className="shell">
            <div className="rule-title rule-title--blue">
              <h2 className="ct-h2">Frequently Asked Questions</h2>
            </div>

            <ul className="ct-faq">
              {FAQS.map((f, i) => (
                <li key={f.q} className={openFaq === i ? "is-open" : ""}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-${i}`}
                  >
                    <span>
                      {i + 1}. {f.q}
                    </span>
                    <Icon name="chevron-down" size={16} />
                  </button>
                  <div className="ct-faq__body" id={`faq-${i}`} role="region">
                    <p>{f.a}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------------- map */}
        <section className="ct-map">
          <div className="shell ct-map__inner">
            <div className="ct-map__copy">
              <p className="eyebrow">Our Office</p>
              <h2 className="ct-h2">Connect With Qubix</h2>
              <p className="ct-map__lede">
                We're here to help you build powerful audio solutions. Reach out
                to us anytime.
              </p>
              <ul>
                <li>
                  <Icon name="phone" size={17} />
                  <span>{CONTACT.phone}</span>
                </li>
                <li>
                  <Icon name="mail" size={17} />
                  <span>{CONTACT.email}</span>
                </li>
                <li>
                  <Icon name="clock" size={17} />
                  <span>{CONTACT.hours}</span>
                </li>
              </ul>
            </div>

            <div className="ct-map__frame">
              <img src={BG.map} alt="Map showing the Qubix office location" />
              <span className="ct-map__pin">
                <Icon name="pin" size={22} />
              </span>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- wa */}
        <section className="ct-wa">
          <div className="shell ct-wa__inner">
            <span className="ct-wa__glyph">
              <Icon name="whatsapp" size={26} />
            </span>
            <div>
              <h3>Need Quick Assistance?</h3>
              <p>Chat with our experts instantly on WhatsApp.</p>
            </div>
            <a
              className="btn ct-wa__btn btn--lg"
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" size={18} />
              Chat on WhatsApp
              <Icon name="arrow" size={14} />
            </a>
          </div>
        </section>
      </main>

      <Footer
        blurb="Professional audio solutions engineered for performance, reliability and complete peace of mind."
      />
    </>
  );
}
