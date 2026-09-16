"use client";

import dynamic from "next/dynamic";

const SwitchShowcase = dynamic(() => import("./SwitchShowcase"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "#000" }} />,
});

const cards = [
  {
    num: "01",
    title: "Control room systems.",
    body: "Mosaic mimic panels, operator workstations, and consoles engineered for the plants and facilities running the world's critical assets.",
    series: "Control Room",
  },
  {
    num: "02",
    title: "Hazardous area & safety.",
    body: "ATEX and IECEx-certified enclosures, junction boxes and control stations for Zone 1 / Zone 2 and safety-instrumented systems.",
    series: "Ex-rated",
  },
  {
    num: "03",
    title: "Instrumentation.",
    body: "Process instrumentation, field devices, and indication systems specified, integrated and supported across the asset lifecycle.",
    series: "Instrumentation",
  },
  {
    num: "04",
    title: "Specialist mechanical.",
    body: "Rotary equipment packages and specialist mechanical assemblies delivered with full documentation, testing and long-term support.",
    series: "Mechanical",
  },
];

export default function FeatureGrid() {
  return (
    <section className="features" id="products">
      <div className="features__hero">
        {/* .saltech-cinematic-section is the ONLY element pinned by ScrollTrigger.
            All new-implementation styles are scoped under this class in globals.css. */}
        <div className="features__hero-inner saltech-cinematic-section">
          <h2 className="features__title">
            <span className="features__title-soft">Engineering-led solutions</span>
            <br />
            <span className="features__title-strong">for demanding industrial environments.</span>
          </h2>

          {/* Pre-reveal intro — three paragraphs arranged as a horizontal
              row across the middle of the section. Each fades in one after
              another during the FIRST half of the scroll; then all three
              fade out together so the 3D model can take over. */}
          <div className="features__intro" aria-hidden="true">
            <p className="features__intro-para" data-idx="1">
              Saltech designs, manufactures and integrates mosaic mimic panels,
              control and indication systems, hazardous-area solutions and
              specialist mechanical packages for applications where reliability,
              clarity and long-term support matter.
            </p>
            <p className="features__intro-para" data-idx="2">
              We work with asset owners, EPCs, system integrators, OEMs and
              panel builders to provide engineered solutions from individual
              components and replacement parts through to complete panels
              and packaged systems.
            </p>
            <p className="features__intro-para" data-idx="3">
              Our approach is systems-driven rather than catalogue-driven. We
              work with established technology manufacturers and manufacturing
              partners while selecting the right solution for the application,
              project specification and lifecycle requirements.
            </p>
          </div>

          <div className="saltech-cinematic-canvas" aria-hidden="true">
            <SwitchShowcase />
          </div>

          {/* Bottom-right SOLUTIONS caption removed per client. Kept as a
              JSX comment for quick restore.
          <div className="features__caption">
            <p className="features__caption-eyebrow">Solutions</p>
            <ul className="features__caption-list">
              <li>Mosaic Mimic Systems</li>
              <li>Control Room &amp; Operator Systems</li>
              <li>Hazardous Area &amp; Safety</li>
              <li>Mechanical &amp; Engineered Packages</li>
            </ul>
          </div>
          */}

          {/* Rear text — reveals with the 3D model. Features the Mosaic
              Mimic Systems solution copy (the flagship product line the
              model represents). */}
          <div className="saltech-cinematic-rear-text" aria-hidden="true">
            <div className="saltech-cinematic-rear-text__tag">
              <span className="saltech-cinematic-rear-text__tag-dot" aria-hidden="true" />
              <span className="saltech-cinematic-rear-text__tag-label">Solution 1</span>
            </div>
            <h3 className="saltech-cinematic-rear-text__title">Mosaic Mimic Systems</h3>
            <p className="saltech-cinematic-rear-text__body">
              New mosaic mimic panels, spares, control and indication
              components, panel extensions, modifications and legacy system
              support &mdash; including complete control-room mimic systems
              built and tested in the UK.
            </p>
            <a href="#mosaic" className="saltech-cinematic-rear-text__cta">
              Explore Mosaic Mimic Systems
              <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 10 L10 2 M4 2 H10 V8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Commented out per client — 4-card catalogue grid was Werner-era
          product-showcase copy that no longer fits Saltech's engineering-
          services positioning. Keep in place so we can restore quickly.
      <div className="features__grid">
        {cards.map((c) => (
          <article className="feature-card" key={c.num}>
            <p className="feature-card__num">{c.num}</p>
            <h3 className="feature-card__title">{c.title}</h3>
            <p className="feature-card__body">{c.body}</p>
            <p className="feature-card__series">{c.series}</p>
          </article>
        ))}
      </div>
      */}
    </section>
  );
}
