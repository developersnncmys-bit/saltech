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
  // Duplicate the list so the CSS marquee can translate -50% and loop
  // seamlessly (the second half is a visual copy of the first).
  const marquee = [...orgs, ...orgs];

  return (
    <section className="cred" id="credibility">
      <div className="cred__inner">
        <div className="cred__head">
          <h2 className="cred__title">Organisations we have supported.</h2>
        </div>

        <div className="cred__marquee" aria-label="Client organisations">
          <ul className="cred__track" aria-hidden="true">
            {marquee.map((o, i) => (
              <li className="cred__cell" key={`${o.slug}-${i}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/logos/${o.slug}.png`} alt={o.name} loading="lazy" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
