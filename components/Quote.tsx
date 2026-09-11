const text =
  "Safety-critical infrastructure earns its trust one shift at a time. Our job is to deliver control room and operator systems that stay dependable long after commissioning day.";

export default function Quote() {
  const words = text.split(" ");

  return (
    <section className="quote" id="testimonial">
      <div className="quote__portrait">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/testimonial.png" alt="Saltech — engineering ethos" />
      </div>
      <div className="quote__inner">
        <blockquote className="quote__text">
          &ldquo;
          {words.map((w, i) => (
            <span className="quote__word" key={i}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
          &rdquo;
        </blockquote>
        <p className="quote__attr">Saltech &mdash; engineering ethos</p>
        <a href="#story" className="quote__link">
          Read more about us
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 10 L10 2 M4 2 H10 V8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
