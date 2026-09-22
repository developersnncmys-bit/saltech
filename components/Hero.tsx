export default function Hero() {
  return (
    <header id="top" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <video
          className="hero__img"
          src="/videos/hero.mp4"
          poster="/images/hero-banner-section.png"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="hero__vignette" />
      </div>

      <div className="hero__stage">
        <div className="hero__center">
          <div className="hero__wordmark">
            <p className="hero__eyebrow">UK Engineering &amp; Industrial Solutions</p>
            <h1 className="hero__title">
              Engineering &amp; Control Systems<br />
              for Critical Industrial Environments<span className="hero__title-dot">.</span>
            </h1>
            <p className="hero__sub-body">
              We specialise in mosaic mimic panels, control room systems,
              hazardous-area solutions and specialist industrial packages for
              demanding industrial environments.
            </p>

            <ul className="hero__credibility" aria-label="Capabilities">
              <li><span className="hero__credibility-dot" aria-hidden="true" />UK engineering, assembly and testing from Shaftesbury, Dorset</li>
              <li><span className="hero__credibility-dot" aria-hidden="true" />Complete wired panels, FAT and site support</li>
            </ul>

            <div className="hero__cta-row">
              <a href="#contact" className="btn btn--primary">Request a Quote</a>
              <a href="#mosaic" className="btn btn--ghost">Explore Mosaic Mimic Systems</a>
            </div>
          </div>
        </div>

        <p className="hero__scroll-cue">Scroll to know more.</p>
      </div>
    </header>
  );
}
