const orgs = [
  { name: "Westinghouse", slug: "westinghouse" },
  { name: "EDF", slug: "edf" },
  { name: "Schneider Electric", slug: "schneider-electric" },
  { name: "Yokogawa", slug: "yokogawa" },
  { name: "ABB", slug: "abb" },
  { name: "Honeywell", slug: "honeywell" },
  { name: "Emerson", slug: "emerson" },
  { name: "Phillips 66", slug: "phillips-66" },
  { name: "Worley", slug: "worley" },
  { name: "Wood", slug: "wood" },
  { name: "ONGC", slug: "ongc" },
  { name: "Network Rail", slug: "network-rail" },
  { name: "VolkerRail", slug: "volkerrail" },
  { name: "Siemens", slug: "siemens" },
  { name: "Engie", slug: "engie" },
  { name: "Shell", slug: "shell" },
  { name: "BT", slug: "bt" },
  { name: "ExxonMobil", slug: "exxonmobil" },
  { name: "ConocoPhillips", slug: "conocophillips" },
  { name: "Valero", slug: "valero" },
];

export default function Credibility() {
  return (
    <section className="cred" id="credibility">
      <div className="cred__inner">
        <div className="cred__head">
          <p className="section-eyebrow">Credibility</p>
          <h2 className="cred__title">Organisations we have supported.</h2>
          <span className="cred__iso" aria-label="ISO 9001:2015 certified">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 2 L15 5 L19 5 L19 9 L22 12 L19 15 L19 19 L15 19 L12 22 L9 19 L5 19 L5 15 L2 12 L5 9 L5 5 L9 5 Z" />
              <path d="M8 12 L11 15 L16 9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            ISO 9001:2015 Certified
          </span>
        </div>

        <ul className="cred__grid" aria-label="Client organisations">
          {orgs.map((o) => (
            <li className="cred__cell" key={o.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/logos/${o.slug}.png`} alt={o.name} loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
