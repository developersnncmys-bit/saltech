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
          <span className="cred__iso" aria-label="ISO 9001:2015 certified quality management system">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/ISO.png" alt="" className="cred__iso-badge" loading="lazy" />
            <span className="cred__iso-text">
              <span className="cred__iso-text-strong">ISO 9001:2015</span>
              <span className="cred__iso-text-sub">Certified Quality Management System</span>
            </span>
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
