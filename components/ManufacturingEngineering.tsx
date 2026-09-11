"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ManufacturingEngineering() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const eyebrow = root.querySelector(".mfg__eyebrow");
      const titleLines = root.querySelectorAll(".mfg__title-line");
      const bodies = root.querySelectorAll<HTMLElement>(".mfg__body");
      const stats = root.querySelectorAll<HTMLElement>(".mfg__stat");

      gsap.set(eyebrow, { yPercent: 130, opacity: 0 });
      gsap.set(titleLines, { yPercent: 105, opacity: 0 });
      gsap.set(bodies, { y: 24, opacity: 0 });
      gsap.set(stats, { y: 30, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
      tl.to(eyebrow, { yPercent: 0, opacity: 1, duration: 0.55 })
        .to(titleLines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, "-=0.3")
        .to(bodies, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, "-=0.55")
        .to(stats, { y: 0, opacity: 1, duration: 0.6, stagger: 0.09 }, "-=0.3");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="mfg" id="manufacturing" ref={rootRef}>
      <div className="mfg__inner">
        <div className="mfg__eyebrow-clip">
          <p className="mfg__eyebrow">Manufacturing &amp; engineering</p>
        </div>
        <h2 className="mfg__title">
          <span className="mfg__title-clip"><span className="mfg__title-line">DESIGNED,</span></span>
          <span className="mfg__title-clip"><span className="mfg__title-line">ASSEMBLED &amp; TESTED</span></span>
          <span className="mfg__title-clip"><span className="mfg__title-line">IN THE UK.</span></span>
        </h2>

        <div className="mfg__body-wrap">
          <p className="mfg__body">
            Saltech provides engineering, assembly, wiring and testing from its
            facility in Shaftesbury, Dorset &mdash; supporting projects from
            individual assemblies through to complete control-room panels and
            engineered systems.
          </p>
          <p className="mfg__body">
            Where specialist manufacturing or certified products are required,
            Saltech works with established technology and manufacturing
            partners and manages the technical interface between the customer
            requirement and the supplied solution.
          </p>
        </div>

        <div className="mfg__stats">
          <div className="mfg__stat">
            <span className="mfg__stat-idx">01</span>
            <p className="mfg__stat-k">Shaftesbury, Dorset</p>
            <p className="mfg__stat-v">Engineering &amp; workshop facility</p>
          </div>
          <div className="mfg__stat">
            <span className="mfg__stat-idx">02</span>
            <p className="mfg__stat-k">FAT &amp; site support</p>
            <p className="mfg__stat-v">End-to-end delivery</p>
          </div>
          <div className="mfg__stat">
            <span className="mfg__stat-idx">03</span>
            <p className="mfg__stat-k">ISO 9001:2015</p>
            <p className="mfg__stat-v">Certified quality system</p>
          </div>
        </div>
      </div>
    </section>
  );
}
