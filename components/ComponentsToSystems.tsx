"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Copy locked to brief — presentation redesigned to a horizontal
// progression timeline instead of a 2×2 grid. Reads as "we scale
// from a single component all the way up to a complete system."
const waypoints = [
  {
    title: "Components & Spares",
    body: "Individual components, replacement parts and spares to keep existing systems running.",
    scale: "Component-level",
  },
  {
    title: "Modifications & Extensions",
    body: "Existing panel modifications and extensions, facias and panel adjustments.",
    scale: "Sub-assembly",
  },
  {
    title: "Complete Panels & Systems",
    body: "Complete wired panels, control-room assemblies and operator interfaces.",
    scale: "Panel-scale",
  },
  {
    title: "Installation & Site Support",
    body: "Installation and site support delivered from our facility in Shaftesbury, Dorset.",
    scale: "Site-wide",
  },
];

export default function ComponentsToSystems() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const eyebrow = root.querySelector(".cts__eyebrow");
      const titleLines = root.querySelectorAll(".cts__title-line");
      const sub = root.querySelector(".cts__sub");
      const trackFill = root.querySelector<HTMLElement>(".cts__track-fill");
      const nodes = root.querySelectorAll<HTMLElement>(".cts__waypoint-node");
      const waypointsEls = root.querySelectorAll<HTMLElement>(".cts__waypoint");

      // Header reveal (one-shot).
      gsap.set(eyebrow, { yPercent: 130, opacity: 0 });
      gsap.set(titleLines, { yPercent: 105, opacity: 0 });
      gsap.set(sub, { y: 24, opacity: 0 });
      gsap.set(nodes, { scale: 0, opacity: 0 });
      gsap.set(waypointsEls, { y: 30, opacity: 0 });

      const headTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
      headTl
        .to(eyebrow, { yPercent: 0, opacity: 1, duration: 0.55 })
        .to(titleLines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, "-=0.3")
        .to(sub, { y: 0, opacity: 1, duration: 0.65 }, "-=0.55")
        .to(nodes, {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(2)",
        }, "-=0.3")
        .to(waypointsEls, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
        }, "-=0.85");

      // Track fill — one-shot draw across the rail on section enter.
      // Scrub was unreliable because the section is short vertically so
      // the scroll distance for the scrub was too small to be visible.
      if (trackFill) {
        gsap.set(trackFill, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(trackFill, {
          scaleX: 1,
          duration: 1.6,
          ease: "power2.inOut",
          scrollTrigger: { trigger: root, start: "top 65%", once: true },
        });
      }

      // Number counters — count up per waypoint when it enters.
      waypointsEls.forEach((wp, i) => {
        const numEl = wp.querySelector<HTMLElement>(".cts__waypoint-num");
        if (!numEl) return;
        const counter = { v: 0 };
        gsap.to(counter, {
          v: i + 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: wp, start: "top 85%", once: true },
          onUpdate: () => {
            numEl.textContent = String(Math.round(counter.v)).padStart(2, "0");
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="cts" id="components-systems" ref={rootRef}>
      <div className="cts__inner">
        <header className="cts__head">
          <div className="cts__eyebrow-clip">
            <p className="cts__eyebrow">How we support you</p>
          </div>
          <h2 className="cts__title">
            <span className="cts__title-clip"><span className="cts__title-line">COMPONENTS TO</span></span>
            <span className="cts__title-clip"><span className="cts__title-line">COMPLETE SYSTEMS.</span></span>
          </h2>
          <p className="cts__sub">
            Saltech supports customers at every level &mdash; from individual
            components and spares through to complete engineered panels and
            packaged systems.
          </p>
        </header>

        <div className="cts__timeline" role="list">
          {/* Dashed rail that runs behind all four waypoint nodes. */}
          <span className="cts__track" aria-hidden="true">
            <span className="cts__track-fill" />
          </span>

          <ol className="cts__waypoints">
            {waypoints.map((w, i) => (
              <li className="cts__waypoint" role="listitem" key={w.title}>
                <span className="cts__waypoint-node" aria-hidden="true">
                  <span className="cts__waypoint-node-inner" />
                </span>
                <div className="cts__waypoint-body">
                  <div className="cts__waypoint-meta">
                    <span className="cts__waypoint-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="cts__waypoint-scale">{w.scale}</span>
                  </div>
                  <h3 className="cts__waypoint-title">{w.title}</h3>
                  <p className="cts__waypoint-body-text">{w.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
