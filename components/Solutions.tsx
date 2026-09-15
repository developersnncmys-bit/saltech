const scenes = [
  // Mosaic Mimic Systems scene commented out — timeline now starts at
  // "Solution 2" (Control Room & Operator Systems).
  // {
  //   id: "mosaic",
  //   title: "Mosaic Mimic Systems",
  //   body: "New mosaic panels, panel extensions, modifications, legacy replacements, spares and complete control-room mimic systems.",
  //   cta: "Explore Mosaic Mimic Systems",
  //   href: "#mosaic",
  //   image: "/images/mosaic-mimic.png",
  // },
  {
    id: "control-room",
    title: "Control Room & Operator Systems",
    body: "Operator consoles, workstations, displays, video walls and integrated operator environments.",
    cta: "Explore Control Room & Operator Systems",
    href: "#control-room",
    image: "/images/control-room.png",
  },
  {
    id: "hazardous",
    title: "Hazardous Area & Safety",
    body: "ATEX and IECEx enclosures, hazardous-area control solutions and gas, flame and heat detection equipment.",
    cta: "Explore Hazardous Area & Safety",
    href: "#hazardous",
    image: "/images/hazardous.png",
  },
  {
    id: "packages",
    title: "Mechanical & Engineered Packages",
    body: "Fire-water pump packages, non-electric engine starting systems and specialist mechanical packages.",
    cta: "Explore Mechanical & Engineered Packages",
    href: "#packages",
    image: "/images/packages.png",
  },
];

export default function Solutions() {
  return (
    <section className="solutions" id="solutions">
      <div className="solutions__inner">
        <div className="solutions__head">
          <p className="section-eyebrow">What we deliver</p>
          <h2 className="solutions__title">Three more connected solution areas.</h2>
        </div>
      </div>

      <div className="sol-scenes">
        {/* Persistent scroll marker — sticks in the middle of the viewport
            while user scrolls through the 4 scenes. JS in Animations.tsx
            updates the label ("Solution 1" → "Solution 2" ...) as each
            scene enters. Matches the reference's "Day N" pill behaviour. */}
        <div className="sol-marker" aria-hidden="true">
          <span className="sol-marker__dot" />
          <span className="sol-marker__label">Solution 2</span>
        </div>

        {scenes.map((s, i) => (
          <article
            className="sol-scene"
            id={s.id}
            key={s.id}
            data-sol-index={i + 2}
          >
            <div className="sol-scene__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt="" loading="lazy" />
            </div>
            <div className="sol-scene__content">
              <h3 className="sol-scene__title">{s.title}</h3>
              <p className="sol-scene__body">{s.body}</p>
              <a className="sol-scene__cta" href={s.href}>
                {s.cta}
                <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2 10 L10 2 M4 2 H10 V8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
