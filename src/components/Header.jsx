import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Icon from "./Icon";
import { BrandLogo } from "./Logo";
import { whatsappLink } from "../data/site";
import "./Header.css";

/**
 * One header for the whole site. It links only the six real pages so every
 * nav item resolves to a route that exists.
 */
const NAV = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Power Amplifiers", to: "/products/power-amplifiers" },
  { label: "QX Series", to: "/products/qx-series" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="shell header__inner">
        <Link to="/" className="header__logo" aria-label="Qubix and LORD home">
          <BrandLogo height={30} />
        </Link>

        <nav className="header__nav" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/" || item.to === "/products"}
              className={({ isActive }) =>
                `header__link ${isActive ? "is-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <a
            className="btn btn--whatsapp btn--sm"
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" size={16} />
            WhatsApp
          </a>
        </div>

        <button
          className="header__burger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className={open ? "is-x" : ""} />
        </button>
      </div>

      <div
        className={`header__drawer ${open ? "is-open" : ""}`}
        role="dialog"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <nav className="header__drawer-nav">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="header__drawer-link">
              {item.label}
              <Icon name="chevron" size={15} />
            </Link>
          ))}
        </nav>
        <div className="header__drawer-cta">
          <a
            className="btn btn--whatsapp btn--block"
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" size={17} />
            WhatsApp Enquiry
          </a>
        </div>
      </div>

      <button
        className={`header__scrim ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
        tabIndex={-1}
        aria-hidden="true"
      />
    </header>
  );
}
