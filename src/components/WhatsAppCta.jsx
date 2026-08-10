import Icon from "./Icon";
import { whatsappLink, BG } from "../data/site";
import "./WhatsAppCta.css";

/**
 * The recurring "Have Questions? Let's Talk." band.
 * `tone`: dark (home/about), slim (products), blue (category), green (contact).
 */
export default function WhatsAppCta({
  tone = "dark",
  title = "Have Questions? Let's Talk.",
  copy = "Our experts are ready to help you find the right solution for your needs.",
  label = "WhatsApp Enquiry",
  note,
}) {
  return (
    <div className={`wacta wacta--${tone}`}>
      {tone !== "green" && (
        <img className="wacta__bg" src={BG.waveform} alt="" aria-hidden="true" />
      )}

      <div className="wacta__body">
        <span className="wacta__glyph">
          <Icon name="whatsapp" size={tone === "green" ? 26 : 34} />
        </span>
        <div className="wacta__text">
          <h3>{title}</h3>
          <p>{copy}</p>
        </div>
      </div>

      <div className="wacta__action">
        <a
          className={`btn ${
            tone === "green" ? "btn--whatsapp" : "btn--ghost-green"
          } btn--lg`}
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="whatsapp" size={18} />
          {label}
          <Icon name="chevron" size={13} />
        </a>
        {note && <small>{note}</small>}
      </div>
    </div>
  );
}
