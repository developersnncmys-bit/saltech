import type { ReactNode } from "react";

type PilotState = "dawn" | "amber" | "red" | "green" | "moon";

type Shift = {
  id: string;
  time: string;
  hueClass: string;
  pilot: PilotState;
  cost: string;
  title: string;
  body: ReactNode;
  answer: ReactNode;
  image: string;
};

const shifts: Shift[] = [
  {
    id: "shift-06",
    time: "06:00",
    hueClass: "shift--dawn",
    pilot: "dawn",
    image: "https://images.pexels.com/photos/35072831/pexels-photo-35072831.jpeg?auto=compress&cs=tinysrgb&w=1600",
    cost: "Every plant starts the day at the mimic panel.",
    title: "Shift start. The mimic panel comes alive.",
    body: (
      <>
        Operators walk into the control room and read the entire plant off a
        single mosaic mimic panel &mdash; process flows, alarm states and
        active interlocks visible at a glance before the first HMI is opened.
      </>
    ),
    answer: <></>,
  },
  {
    id: "shift-12",
    time: "12:00",
    hueClass: "shift--noon",
    pilot: "green",
    image: "https://images.pexels.com/photos/2353937/pexels-photo-2353937.jpeg?auto=compress&cs=tinysrgb&w=1600",
    cost: "Safety systems are only as good as their weakest device.",
    title: "Peak operations. Safety systems on watch.",
    body: (
      <>
        Hazardous-area enclosures, ATEX / IECEx-certified control stations and
        safety-instrumented systems keep protecting personnel and process while
        the plant runs at full load through the busiest hours of the day.
      </>
    ),
    answer: <></>,
  },
  {
    id: "shift-18",
    time: "18:00",
    hueClass: "shift--evening",
    pilot: "amber",
    image: "https://images.pexels.com/photos/29224569/pexels-photo-29224569.jpeg?auto=compress&cs=tinysrgb&w=1600",
    cost: "A handover should never mean a loss of context.",
    title: "Shift change. Consoles reconfigure for the next crew.",
    body: (
      <>
        Operator workstations, consoles and indication systems present the
        same information the same way, shift after shift &mdash; so handovers
        are complete, auditable and take minutes, not hours.
      </>
    ),
    answer: <></>,
  },
  {
    id: "shift-22",
    time: "22:00",
    hueClass: "shift--night",
    pilot: "red",
    image: "https://images.pexels.com/photos/11783119/pexels-photo-11783119.jpeg?auto=compress&cs=tinysrgb&w=1600",
    cost: "At night, seconds of missed instrumentation cost hours of downtime.",
    title: "Night operations. Instrumentation surfaces every deviation.",
    body: (
      <>
        Process instrumentation, field devices and annunciator windows push
        every deviation to the mimic and to the operator in real time &mdash;
        so the night crew reacts to conditions, not screen dives.
      </>
    ),
    answer: <></>,
  },
  {
    id: "shift-02",
    time: "02:00",
    hueClass: "shift--deep",
    pilot: "moon",
    image: "https://images.pexels.com/photos/3582392/pexels-photo-3582392.jpeg?auto=compress&cs=tinysrgb&w=1600",
    cost: "Assets have to perform for decades, not just for commissioning day.",
    title: "Long into the night. Long into the asset&rsquo;s life.",
    body: (
      <>
        Specialist mechanical packages, rotary equipment and lifecycle support
        keep the same systems dependable years after handover &mdash; asset
        owners, EPCs and integrators supported for the long haul.
      </>
    ),
    answer: <></>,
  },
];

function Pilot({ state }: { state: PilotState }) {
  const colors: Record<PilotState, string> = {
    dawn: "#f5a623",
    amber: "#f5a623",
    green: "#2fb56a",
    red: "#e0402c",
    moon: "#4a8fff",
  };
  const c = colors[state];
  return (
    <svg
      className="shift__pilot"
      viewBox="0 0 46 46"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`pilot-${state}`} cx="35%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="45%" stopColor={c} />
          <stop offset="100%" stopColor={c} stopOpacity="0.6" />
        </radialGradient>
        <filter id={`glow-${state}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Bezel */}
      <circle cx="23" cy="23" r="21" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      {/* Lens */}
      {state === "moon" ? (
        <>
          <circle cx="23" cy="23" r="15" fill="#0a1220" />
          <path
            d="M 26 10 A 13 13 0 1 0 26 36 A 10 10 0 1 1 26 10 Z"
            fill={c}
            opacity="0.85"
            filter={`url(#glow-${state})`}
          />
        </>
      ) : state === "dawn" ? (
        <>
          <circle cx="23" cy="23" r="15" fill={`url(#pilot-${state})`} opacity="0.55" />
          <path
            d="M 8 26 A 15 15 0 0 1 38 26 L 38 32 L 8 32 Z"
            fill={`url(#pilot-${state})`}
            filter={`url(#glow-${state})`}
          />
        </>
      ) : (
        <circle
          cx="23"
          cy="23"
          r="15"
          fill={`url(#pilot-${state})`}
          filter={`url(#glow-${state})`}
        />
      )}
    </svg>
  );
}

export default function Cycle() {
  return (
    <section className="cycle" id="story">
      <div className="cycle__intro">
        {/* The persistent scroll marker (ball + running time label) is
            rendered by <GlobalBall /> at page root. GSAP drives its
            fade-in / rise / color-flip / time-tick from Animations.tsx. */}

        <div className="cycle__intro-row">
          <div className="cycle__aside">
            <p className="cycle__lede">
              A day inside a Saltech-equipped control room &mdash; from the
              first mimic-panel walk-through to the 2am asset that just keeps
              running.
            </p>
          </div>
          <h2 className="cycle__heading">A day in a safety-critical plant.</h2>
        </div>
      </div>

      {shifts.map((s) => (
        <article className={`shift ${s.hueClass}`} key={s.id}>
          <div className="shift__grid">
            <div className="shift__media">
              <img
                src={s.image}
                alt={`${s.time} shift`}
                className="shift__media-img"
              />
            </div>
            <div className="shift__text">
              {/* <p className="shift__cost">{s.cost}</p> */}
              {/* <div className="shift__meta">
                <Pilot state={s.pilot} />
                <span className="shift__time">{s.time}</span>
              </div> */}
              <h3 className="shift__title">{s.title}</h3>
              <p className="shift__body">{s.body}</p>
              {/* <p className="shift__answer">
                <span className="shift__answer-label">Saltech&rsquo;s fix &rarr;</span>
                {s.answer}
              </p> */}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
