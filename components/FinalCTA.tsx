const BODY_TEXT =
  "Have a new project, an existing panel to modify, or an obsolete system that needs replacing? Send us your drawings, photographs, specification or simply describe what you need. Our engineering team will review the requirement and advise on the most appropriate solution.";

export default function FinalCTA() {
  const words = BODY_TEXT.split(/\s+/);

  return (
    <section className="final" id="contact">
      <div className="final__inner">
        <p className="section-eyebrow">Get in touch</p>
        <p className="final__text" aria-label={BODY_TEXT}>
          {words.map((w, i) => (
            <span key={i} className="final__word" aria-hidden="true">
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
        <div className="final__cta-row">
          <a href="mailto:info@saltech.ltd" className="btn btn--primary">Request a Quote</a>
          <a href="tel:+447542699546" className="btn btn--ghost">Speak to an Engineer</a>
        </div>
      </div>
    </section>
  );
}
