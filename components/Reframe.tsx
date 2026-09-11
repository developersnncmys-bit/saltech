export default function Reframe() {
  return (
    <section className="reframe" id="story-intro">
      {/* Cosmic curtain — a tall, sliding wrapper that contains BOTH
          the red gradient bg (upper half) AND the content (lower
          white half). On scroll GSAP translates its yPercent upward,
          so the cosmic red slides out the top of the viewport and
          the white portion (with the content sitting inside it)
          rises into place. */}
      <div className="reframe__cosmic">
        <div className="reframe__sticky">
          <div className="reframe__inner">
          <p className="section-eyebrow reframe__section-eyebrow">About Saltech</p>

          <div className="reframe__grid">
            <div className="reframe__left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="reframe__img"
                src="/images/hero-banner-section.png"
                alt="Saltech engineered systems"
              />
              <h2 className="reframe__title">
                <span className="reframe__title-soft">
                  Engineering-led
                  <br />
                  solutions.
                </span>
                <br />
                <span className="reframe__title-strong">
                  Built for critical
                  <br />
                  environments.
                </span>
              </h2>
            </div>

            <div className="reframe__right">
              <p className="reframe__body">
                Saltech designs, manufactures and integrates mosaic mimic
                panels, control and indication systems, hazardous-area
                solutions and specialist mechanical packages for applications
                where reliability, clarity and long-term support matter.
              </p>
              <p className="reframe__body">
                We work with asset owners, EPCs, system integrators, OEMs and
                panel builders to provide engineered solutions from individual
                components and replacement parts through to complete panels
                and packaged systems.
              </p>
              <p className="reframe__body">
                Our approach is systems-driven rather than catalogue-driven.
                We work with established technology manufacturers and
                manufacturing partners while selecting the right solution for
                the application, project specification and lifecycle
                requirements.
              </p>
              <a href="#about" className="reframe__cta">
                Learn more about us
              </a>
            </div>
          </div>

          <p className="reframe__tagline">
            From countless projects, engineering excellence emerges
          </p>
          </div>
        </div>
      </div>
    </section>
  );
}
