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
            <h2 className="reframe__title">
              Engineering-led{" "}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="reframe__title-img"
                src="/images/hero-banner-section.png"
                alt="Saltech engineered systems"
              />{" "}
              solutions.
              <br />
              Built for critical environments.
            </h2>

            <p className="reframe__body reframe__body--lead">
              Saltech designs, manufactures and integrates mosaic mimic
              panels, control and indication systems, hazardous-area
              solutions and specialist mechanical packages for applications
              where reliability, clarity and long-term support matter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
