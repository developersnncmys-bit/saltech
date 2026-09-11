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
          <p className="features__eyebrow">What we deliver</p>
          <h2 className="features__title">
            Our solutions <span className="features__title-soft">&amp; services.</span>
          </h2>

          <div className="saltech-cinematic-canvas" aria-hidden="true">
            <SwitchShowcase />
          </div>

          <div className="features__caption">
            <p className="features__caption-eyebrow">Engineered</p>
            <ul className="features__caption-list">
              <li>Concept &amp; design</li>
              <li>Manufacture &amp; test</li>
              <li>Commissioning &amp; support</li>
            </ul>
          </div>

          <div className="saltech-cinematic-rear-text" aria-hidden="true">
            <p className="saltech-cinematic-rear-text__eyebrow">Engineered</p>
            <h3 className="saltech-cinematic-rear-text__title">From concept to commissioning.</h3>
            <p className="saltech-cinematic-rear-text__body">
              Engineering-led design, precision manufacture and full asset-lifecycle
              support &mdash; delivered alongside asset owners, EPCs and system
              integrators.
            </p>
          </div>
        </div>
      </div>

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
    </section>
  );
}
