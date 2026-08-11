import { Link } from "react-router-dom";
import Icon from "./Icon";
import { BrandLogo } from "./Logo";
import { CONTACT, whatsappLink } from "../data/site";
import "./Footer.css";

const SOCIALS = [
  { name: "Facebook", d: "M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6A21 21 0 0 0 14.28 3.5c-2.4 0-4.05 1.47-4.05 4.16V9.9H7.5V13h2.73v8z" },
  { name: "Instagram", d: "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5.8-7.8a1.07 1.07 0 1 1-2.15 0 1.07 1.07 0 0 1 2.15 0zM20.8 8.5c-.07-1.44-.4-2.72-1.45-3.77-1.05-1.05-2.33-1.38-3.77-1.46-1.49-.08-5.94-.08-7.43 0-1.43.07-2.71.4-3.76 1.45C3.34 5.77 3.02 7.05 2.94 8.49c-.08 1.49-.08 5.94 0 7.43.07 1.44.4 2.72 1.45 3.77 1.05 1.05 2.33 1.38 3.77 1.46 1.49.08 5.94.08 7.43 0 1.44-.07 2.72-.4 3.77-1.46 1.05-1.05 1.38-2.33 1.46-3.77.08-1.49.08-5.93 0-7.42zm-1.9 9.02a3.04 3.04 0 0 1-1.71 1.71c-1.18.47-3.99.36-5.3.36s-4.12.1-5.3-.36a3.04 3.04 0 0 1-1.71-1.71c-.47-1.18-.36-3.99-.36-5.3s-.1-4.12.36-5.3A3.04 3.04 0 0 1 6.7 5.21c1.18-.47 3.99-.36 5.3-.36s4.12-.1 5.3.36a3.04 3.04 0 0 1 1.71 1.71c.47 1.18.36 3.99.36 5.3s.11 4.12-.36 5.3z" },
  { name: "YouTube", d: "M21.6 8.1a2.5 2.5 0 0 0-1.76-1.77C18.28 5.9 12 5.9 12 5.9s-6.28 0-7.84.42A2.5 2.5 0 0 0 2.4 8.1C2 9.67 2 12.94 2 12.94s0 3.27.4 4.84a2.5 2.5 0 0 0 1.76 1.77c1.56.42 7.84.42 7.84.42s6.28 0 7.84-.42a2.5 2.5 0 0 0 1.76-1.77c.4-1.57.4-4.84.4-4.84s0-3.27-.4-4.84zM10 15.9V9.98l5.2 2.96z" },
  { name: "LinkedIn", d: "M6.94 8.6H3.56V21h3.38zM5.25 3.1a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92zM21 13.87c0-3.4-1.82-4.98-4.24-4.98-1.96 0-2.83 1.08-3.32 1.83V8.6H9.9c.05.98 0 12.4 0 12.4h3.54v-6.93c0-.32.02-.63.12-.86.25-.63.83-1.28 1.8-1.28 1.28 0 1.79.97 1.79 2.38V21H21z" },
];

/**
 * `tone` picks between the dark-navy footer (home / category / about /
 * contact) and the slightly deeper products-page footer. They share
 * structure; the mockups differ only in the column set and logo lockup.
 */
export default function Footer({ tone = "dark", columns, blurb }) {
  const cols = columns || DEFAULT_COLUMNS;

  return (
    <footer className={`footer footer--${tone}`}>
      <div className="shell footer__inner">
        <div className="footer__brand">
          <BrandLogo height={34} />
          <p className="footer__blurb">
            {blurb ||
              "Professional audio solutions for every application. Engineered for performance. Built for reliability."}
          </p>
          <ul className="footer__socials">
            {SOCIALS.map((s) => (
              <li key={s.name}>
                <a href="#" aria-label={s.name}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                    <path d={s.d} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {cols.map((col) => (
          <nav className="footer__col" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="footer__col footer__contact">
          <h3>Contact Us</h3>
          <ul>
            <li>
              <Icon name="whatsapp" size={15} />
              <span>WhatsApp: {CONTACT.phone}</span>
            </li>
            <li>
              <Icon name="phone" size={15} />
              <span>
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
                  {CONTACT.phone}
                </a>
                {", "}
                <a href={`tel:${CONTACT.phoneAlt.replace(/\s/g, "")}`}>
                  {CONTACT.phoneAlt}
                </a>
              </span>
            </li>
            <li>
              <Icon name="mail" size={15} />
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>
              <Icon name="pin" size={15} />
              <span>{CONTACT.address}</span>
            </li>
          </ul>
          <a
            className="btn btn--whatsapp btn--sm footer__wa"
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" size={16} />
            WhatsApp Enquiry
          </a>
        </div>
      </div>

      <div className="footer__bar">
        <div className="shell footer__bar-inner">
          <p>© {new Date().getFullYear()} Qubix &amp; LORD. All rights reserved.</p>
          <div className="footer__legal">
            <a href="#">Privacy Policy</a>
            <i />
            <a href="#">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Every footer link resolves to one of the six real pages — no dead routes.
 */
const DEFAULT_COLUMNS = [
  {
    title: "Pages",
    links: [
      { label: "Home", to: "/" },
      { label: "All Products", to: "/products" },
      { label: "Power Amplifiers", to: "/products/power-amplifiers" },
      { label: "QX Series", to: "/products/qx-4500" },
      { label: "About Us", to: "/about" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Power Amplifiers", to: "/products/power-amplifiers" },
      { label: "Mixing Consoles", to: "/products" },
      { label: "Audio Processing", to: "/products" },
      { label: "Wireless Systems", to: "/products" },
      { label: "Speakers & Components", to: "/products" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Our Brands", to: "/about" },
      { label: "Product Support", to: "/contact" },
      { label: "Become a Dealer", to: "/contact" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
];
