export default function Trial() {
  return (
    <section className="trial" id="trial">
      <div className="trial__inner">
        <div className="trial__left">
          <h2 className="trial__title">Designed to perform for decades.</h2>
        </div>

        <div className="trial__right">
          <h3 className="trial__h">Engage a Saltech engineer.</h3>
          <p className="trial__body">
            From concept and design through manufacture, commissioning and
            long-term support &mdash; we work alongside asset owners, EPCs and
            system integrators to deliver reliable, operator-focused solutions.
          </p>

          <dl className="trial__table">
            <div className="trial__row">
              <dt>We work with</dt>
              <dd>Asset owners, EPCs, integrators</dd>
            </div>
            <div className="trial__row">
              <dt>Delivered across</dt>
              <dd>The full asset lifecycle</dd>
            </div>
            <div className="trial__row">
              <dt>Certified &amp; supportable</dt>
              <dd>Approved partner ecosystem</dd>
            </div>
          </dl>

          <div className="trial__cta-row">
            <a href="#contact" className="tech__download">
              Speak to an engineer
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
