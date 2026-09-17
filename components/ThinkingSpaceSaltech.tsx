"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TS_SCOPE = [
  "Bespoke control-room consoles, desks, turrets and PODs",
  "Furniture design and manufacture",
  "Mounting arrangements and internal voids",
  "Furniture installation",
];

const ST_SCOPE = [
  "Mosaic / mimic and matrix panel facias and components",
  "Panel installation and integration into the consoles",
  "Internal wiring to terminal arrangements",
  "Testing, FAT and site installation / commissioning support",
];

const DELIVERY_STEPS = [
  "Joint definition of the console and mosaic / matrix panel requirements.",
  "Thinking Space designs and manufactures the console or POD / turret with the required panel cut-outs.",
  "Saltech engineers attend Thinking Space to install and integrate the mosaic / matrix facias.",
  "Where required, Saltech wires the panel to terminals within the POD / turret or console void.",
  "The complete console and technical panel assembly is tested through integrated FAT at Thinking Space.",
  "The integrated solution is delivered to site as a coordinated assembly.",
];

export default function ThinkingSpaceSaltech() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const eyebrows = root.querySelectorAll<HTMLElement>(".ts-partnership__eyebrow");
      const titleLines = root.querySelectorAll<HTMLElement>(".ts-partnership__title-line");
      const lede = root.querySelector<HTMLElement>(".ts-partnership__lede");
      const cards = root.querySelectorAll<HTMLElement>(".ts-partnership__card");
      const connector = root.querySelector<HTMLElement>(".ts-partnership__connector");
      const deliveryTitle = root.querySelector<HTMLElement>(".ts-partnership__delivery-title");
      const steps = root.querySelectorAll<HTMLElement>(".ts-partnership__step");
      const bodies = root.querySelectorAll<HTMLElement>(".ts-partnership__body");

      gsap.set(eyebrows, { yPercent: 130, opacity: 0 });
      gsap.set(titleLines, { yPercent: 115, opacity: 0 });
      gsap.set([lede, ...Array.from(bodies)].filter(Boolean), { y: 24, opacity: 0 });
      gsap.set(cards, { y: 40, opacity: 0 });
      gsap.set(connector, { scale: 0.3, opacity: 0 });
      gsap.set(deliveryTitle, { y: 20, opacity: 0 });
      gsap.set(steps, { x: -24, opacity: 0 });

      // HEAD reveal
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
        })
        .to(eyebrows[0], { yPercent: 0, opacity: 1, duration: 0.55 }, 0)
        .to(titleLines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.15)
        .to(lede, { y: 0, opacity: 1, duration: 0.7 }, "-=0.55")
        .to(bodies, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 }, "-=0.5");

      // CARDS reveal
      const cardsRow = root.querySelector<HTMLElement>(".ts-partnership__cards");
      if (cardsRow) {
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: cardsRow, start: "top 80%", once: true },
          })
          .to(cards, { y: 0, opacity: 1, duration: 0.8, stagger: 0.14 })
          .to(connector, { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.7)" }, "-=0.4");
      }

      // DELIVERY reveal
      const delivery = root.querySelector<HTMLElement>(".ts-partnership__delivery");
      if (delivery) {
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: delivery, start: "top 78%", once: true },
          })
          .to(eyebrows[1], { yPercent: 0, opacity: 1, duration: 0.55 }, 0)
          .to(deliveryTitle, { y: 0, opacity: 1, duration: 0.7 }, "-=0.35")
          .to(steps, { x: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.4");
      }

    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="ts-partnership" id="partnership" ref={rootRef}>
      <div className="ts-partnership__inner">
        {/* HEAD — asymmetric two-column: display title (left) + intro copy (right) */}
        <div className="ts-partnership__head">
          <div className="ts-partnership__head-left">
            <div className="ts-partnership__eyebrow-clip">
              <p className="ts-partnership__eyebrow">In partnership</p>
            </div>
            <h2 className="ts-partnership__title">
              <span className="ts-partnership__title-clip">
                <span className="ts-partnership__title-line">Integrated</span>
              </span>
              <span className="ts-partnership__title-clip">
                <span className="ts-partnership__title-line">Control Room</span>
              </span>
              <span className="ts-partnership__title-clip">
                <span className="ts-partnership__title-line">Solutions.</span>
              </span>
              <span className="ts-partnership__title-clip">
                <span className="ts-partnership__title-line ts-partnership__title-line--muted">
                  Thinking Space + Saltech.
                </span>
              </span>
            </h2>
          </div>
          <div className="ts-partnership__head-right">
            <p className="ts-partnership__lede">
              Saltech works closely with Thinking Space to deliver integrated
              control-room solutions combining bespoke operator consoles with
              specialist mosaic, mimic and matrix panel systems.
            </p>
            <p className="ts-partnership__body">
              Thinking Space manufactures the control-room consoles with the
              required panel openings, mounting arrangements and internal
              voids. Saltech then sends its engineering team to Thinking Space
              to install the mosaic or matrix facias into the consoles and,
              where required, wire the panels to terminals within the console
              void.
            </p>
            <p className="ts-partnership__body">
              The completed console and technical panel assembly can then
              undergo integrated Factory Acceptance Testing (FAT) at Thinking
              Space, allowing the customer to inspect and test the complete
              operator solution as an integrated system rather than managing
              separate FAT activities for the console and mosaic / matrix panel.
            </p>
          </div>
        </div>

        {/* CARDS */}
        <div className="ts-partnership__cards" role="list">
          <article className="ts-partnership__card ts-partnership__card--ts" role="listitem">
            <div className="ts-partnership__card-head">
              <span className="ts-partnership__card-mark ts-partnership__card-mark--ts" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                  <rect x="3" y="8" width="18" height="12" rx="1.5" />
                  <path d="M5 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" />
                  <path d="M8 20v2M16 20v2" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <p className="ts-partnership__card-tag">Thinking Space</p>
                <h3 className="ts-partnership__card-role">The console.</h3>
              </div>
            </div>
            <ul className="ts-partnership__list">
              {TS_SCOPE.map((s, i) => (
                <li key={i}><span>{s}</span></li>
              ))}
            </ul>
          </article>

          <div className="ts-partnership__connector" aria-hidden="true">
            <span className="ts-partnership__connector-line" />
            <span className="ts-partnership__connector-badge">+</span>
            <span className="ts-partnership__connector-line" />
          </div>

          <article className="ts-partnership__card ts-partnership__card--st" role="listitem">
            <div className="ts-partnership__card-head">
              <span className="ts-partnership__card-mark ts-partnership__card-mark--st" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="1.5" />
                  <path d="M7 8h10M7 12h10M7 16h6" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <p className="ts-partnership__card-tag">Saltech</p>
                <h3 className="ts-partnership__card-role">The system.</h3>
              </div>
            </div>
            <ul className="ts-partnership__list">
              {ST_SCOPE.map((s, i) => (
                <li key={i}><span>{s}</span></li>
              ))}
            </ul>
          </article>
        </div>

        {/* DELIVERY MODEL — vertical timeline */}
        <div className="ts-partnership__delivery">
          <div className="ts-partnership__delivery-head">
            <div className="ts-partnership__eyebrow-clip">
              <p className="ts-partnership__eyebrow">Delivery model</p>
            </div>
            <h3 className="ts-partnership__delivery-title">
              Typical integrated delivery model.
            </h3>
          </div>
          <ol className="ts-partnership__steps">
            {DELIVERY_STEPS.map((step, i) => (
              <li className="ts-partnership__step" key={i}>
                <span className="ts-partnership__step-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="ts-partnership__step-text">{step}</p>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}
