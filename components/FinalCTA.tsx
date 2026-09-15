const HEADLINE =
  "Have a new project, an existing panel to modify, or an obsolete system that needs replacing?";
const DESCRIPTION =
  "Send us your drawings, photographs, specification or simply describe what you need. Our engineering team will review the requirement and advise on the most appropriate solution.";

export default function FinalCTA() {
  const words = HEADLINE.split(/\s+/);

  return (
    <section className="final" id="contact">
      <div className="final__inner">
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
          <a href="mailto:info@saltech.ltd" className="final__link">Request a Quote</a>
          <a href="tel:+447542699546" className="final__link">Speak to an Engineer</a>
        </div>
      </div>
    </section>
  );
}
