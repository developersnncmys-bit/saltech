"use client";

import { useState } from "react";

type Row = {
  label: string;
  series: string;
  specs: [string, string][];
};

const rows: Row[] = [
  {
    label: "Control room systems",
    series: "Mimic &amp; consoles",
    specs: [
      ["Mosaic mimic panels", "Custom-engineered plant overviews"],
      ["Operator workstations", "Multi-screen consoles &amp; desks"],
      ["Indication systems", "Alarm windows, annunciators, interlocks"],
      ["Delivery", "Design, manufacture, factory acceptance"],
    ],
  },
  {
    label: "Hazardous area &amp; safety",
    series: "ATEX / IECEx",
    specs: [
      ["Enclosures", "Ex-rated junction boxes, control stations"],
      ["Certification", "ATEX &amp; IECEx, Zone 1 / Zone 2"],
      ["Application", "Safety-instrumented systems (SIS)"],
      ["Documentation", "Full traceability &amp; test certificates"],
    ],
  },
  {
    label: "Process instrumentation",
    series: "Field &amp; panel",
    specs: [
      ["Field devices", "Pressure, temperature, level, flow"],
      ["Panel indication", "Digital &amp; analog indicators"],
      ["Integration", "Specified &amp; integrated to plant DCS/PLC"],
      ["Lifecycle", "Specification through long-term support"],
    ],
  },
  {
    label: "Specialist mechanical packages",
    series: "Rotary &amp; skid",
    specs: [
      ["Rotary equipment", "Pump, blower &amp; compressor packages"],
      ["Skid packages", "Fully engineered mechanical assemblies"],
      ["Testing", "FAT and on-site commissioning support"],
      ["Support", "Documentation, spares, lifecycle services"],
    ],
  },
  {
    label: "Engineering &amp; design services",
    series: "Concept &rarr; FEED",
    specs: [
      ["Consulting", "Concept, feasibility, front-end design"],
      ["Specification", "Datasheets, single-line diagrams, BoM"],
      ["Compliance", "Industry standards &amp; safety codes"],
      ["Partners", "Approved technology &amp; manufacturing partners"],
    ],
  },
  {
    label: "Asset-lifecycle support",
    series: "Post-handover",
    specs: [
      ["Commissioning", "On-site and remote commissioning"],
      ["Maintenance", "Planned and reactive service"],
      ["Spares", "Managed critical-spares programmes"],
      ["Upgrades", "Obsolescence and modernisation planning"],
    ],
  },
];

export default function TechDetails() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="tech" id="tech">
      <div className="tech__inner">
        <div className="tech__left">
          <h2 className="tech__title">What we deliver.</h2>
          <p className="tech__body">
            Solutions engineered end-to-end &mdash; from concept and design
            through certified manufacture, commissioning and long-term
            asset-lifecycle support. Six capability areas, one accountable
            engineering partner.
          </p>
          <a href="#contact" className="tech__download">
            Talk to our engineers
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M7 2 V10 M4 7 L7 10 L10 7 M2 12 H12" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="tech__right">
          <div className="tech__accordion" role="list">
            {rows.map((r, i) => {
              const open = openIdx === i;
              return (
                <div
                  className="tech-row"
                  key={r.label}
                  data-open={open ? "true" : "false"}
                  role="listitem"
                >
                  <button
                    type="button"
                    className="tech-row__head"
                    onClick={() => setOpenIdx(open ? null : i)}
                    aria-expanded={open}
                  >
                    <span
                      className="tech-row__label"
                      dangerouslySetInnerHTML={{ __html: r.label }}
                    />
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "16px" }}>
                      <span
                        className="tech-row__series"
                        dangerouslySetInnerHTML={{ __html: r.series }}
                      />
                      <span className="tech-row__plus" aria-hidden="true" />
                    </span>
                  </button>
                  <div className="tech-row__body">
                    <dl className="tech-row__body-inner">
                      {r.specs.map(([dt, dd]) => (
                        <div key={dt} style={{ display: "contents" }}>
                          <dt>{dt}</dt>
                          <dd>{dd}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
