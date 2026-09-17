const HEADLINE =
  "Engineering support designed to perform today — and over decades.";
const DESCRIPTION =
  "Have a new project, an existing panel to modify, or an obsolete system that needs replacing?";

const CARD_BODY =
  "For customers who cannot identify their existing mosaic system, a simple route to share photographs of the front and rear of the panel, component markings or available drawings.";
const CARD_CAPTION =
  "Open WhatsApp directly from this CTA to send photographs of an existing panel or component in seconds.";

const WHATSAPP_NUMBER = "919538492009";
const WHATSAPP_PREFILL =
  "Hi Saltech, I'd like to send panel photos for a mosaic / legacy system enquiry.";

export default function FinalCTA() {
  const words = HEADLINE.split(/\s+/);
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_PREFILL
  )}`;

  return (
    <section className="final" id="contact">
      <div className="final__inner">
        <div className="final__left">
          <p className="section-eyebrow">Get in touch</p>
          <h2 className="final__title" aria-label={HEADLINE}>
            {words.map((w, i) => (
              <span key={i} className="final__word" aria-hidden="true">
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
          <p className="final__body">{DESCRIPTION}</p>
          <div className="final__cta-row">
            <a href="mailto:info@saltech.ltd" className="btn btn--primary final__btn">
              Request a Quote
            </a>
            <a href="tel:+447542699546" className="btn btn--ghost final__btn">
              Speak to an Engineer
            </a>
          </div>
        </div>

        <aside className="final__card" aria-labelledby="final-card-title">
          <h3 id="final-card-title" className="final__card-title">Send Panel Photos</h3>
          <p className="final__card-body">{CARD_BODY}</p>
          <div className="final__card-actions">
            <a
              href="mailto:info@saltech.ltd?subject=Panel%20photos%20for%20quote"
              className="final__card-btn final__card-btn--light"
            >
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <rect x="2" y="5.5" width="16" height="11" rx="2" />
                <circle cx="10" cy="11" r="3" />
                <path d="M7 5.5l1-1.5h4l1 1.5" strokeLinejoin="round" />
              </svg>
              Send Panel Photos
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="final__card-btn final__card-btn--whatsapp"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              Send Panel Photos via WhatsApp
            </a>
          </div>
          <p className="final__card-caption">{CARD_CAPTION}</p>
        </aside>
      </div>
    </section>
  );
}
