"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function Animations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }

    /* -------------------------------------------------- SMOOTH SCROLL
       Lenis wraps the native scroll with a lerped/inertia-based one that
       feels much smoother than raw wheel/trackpad scroll. Wired to
       ScrollTrigger via the standard pattern:
         - lenis.on("scroll", ScrollTrigger.update) — so every smooth
           scroll tick advances scrubbed ScrollTriggers
         - gsap.ticker drives lenis.raf() — one animation loop, no
           duplicate rAF
         - lagSmoothing(0) — disables GSAP's lag compensation so the
           smoothed scroll and the pin timelines stay in perfect sync */
    // "Butter" mode. Long duration + gentle exponential ease-out
    // creates the silky glide that feels continuous and smooth.
    // The exponential curve means the scroll decelerates naturally
    // over 1.6s instead of stopping abruptly, giving that "coasting"
    // feel that reads as buttery.
    const lenis = new Lenis({
      duration: 2.4,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.55,
      touchMultiplier: 0.9,
      syncTouch: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const lenisTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisTick);
    gsap.ticker.lagSmoothing(0);

    // Cleanup slots that live outside gsap.context (context cleanup
     // only tears down GSAP-managed things — the raf loop and the DOM
     // event listeners we register manually below need their own
     // teardown routed through useEffect's return).
    let ballSafetyCleanup: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const nav = document.querySelector(".nav");
      const setNavLight = (on: boolean) =>
        nav?.classList.toggle("nav--on-light", on);

      /* -------------------------------------------------- HERO
         Two-phase pinned intro (V2 — Sept 2026):
         Phase 0 (initial view) — only eyebrow + headline visible; the
                                  sub-body, credibility bullets, and CTA row
                                  are pre-hidden by gsap.set below.
         Phase 1 (on scroll)   — background image zooms slightly + the three
                                  hidden blocks fade+rise in as a stagger.
                                  Eyebrow + headline stay in place; nothing
                                  is faded OUT. */
      const hero = document.querySelector(".hero");
      if (hero) {
        // Pre-hide the three second-phase blocks. gsap.set applies inline
        // styles synchronously on mount so there is no FOUC. When
        // prefers-reduced-motion is true we hit the early return above and
        // these never run — meaning reduced-motion users see everything
        // without needing to scroll. Correct fallback behaviour.
        gsap.set(".hero__sub-body", { opacity: 0, y: 30 });
        gsap.set(".hero__credibility", { opacity: 0, y: 24 });
        gsap.set(".hero__cta-row", { opacity: 0, y: 24 });
        // Phase-0 offset — shifts the whole wordmark down by ~22% of its
        // own height so eyebrow + title sit at viewport centre even though
        // the (invisible) reveal blocks below still take flex space. On
        // scroll this animates back to 0 so phase-1 content lands where
        // its natural flow layout expects it.
        gsap.set(".hero__wordmark", { yPercent: 22 });

        // Entry — fade the eyebrow + title in on page load.
        // Image intentionally NOT animated here: any .from() on it would
        // set an initial scale synchronously, which the scrub timeline
        // below would then capture as its own start value, permanently
        // zooming the image. The scrub does the entire image zoom.
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".hero__eyebrow", { y: 14, opacity: 0, duration: 0.35 })
          .from(".hero__title", { y: 40, opacity: 0, duration: 0.6 }, "-=0.15");

        // Pinned scrub timeline. As the user scrolls through the pinned
        // hero, the background image zooms and the three hidden blocks
        // reveal in sequence (sub-body → credibility → CTA row). The
        // eyebrow + headline are NOT touched — they stay put.
        gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=80%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })
          // Image scales through the whole scrub — subtle background motion
          // keeps giving scroll feedback even during the phase-0 hold.
          // fromTo (explicit scale: 1 start) so the scrub doesn't inherit
          // any transient scale value from earlier in the boot sequence.
          .fromTo(".hero__img",
            { scale: 1 },
            { scale: 1.15, ease: "power1.inOut", duration: 1 },
            0
          )
          // Phase-0 HOLD (scroll 0 → ~30% of pin): nothing touches the
          // wordmark; eyebrow + title stay fully visible at viewport centre.
          // Phase-0 → phase-1 TRANSITION begins at timeline position 0.30.
          // In phase 1, shift the wordmark UP by ~22% of its own height so
          // the visible sub-body + credibility + CTA group is centred in the
          // viewport (the invisible eyebrow+title above still take flex
          // space and would otherwise push the visible block low).
          .to(".hero__wordmark", { yPercent: -22, ease: "power2.out", duration: 0.35 }, 0.30)
          // Eyebrow + title fade + lift out during the transition.
          // Explicit fromTo so the scrub can't inherit opacity 0 from the
          // intro's .from() (which was making them invisible on phase 0).
          .fromTo(".hero__eyebrow",
            { opacity: 1, y: 0 },
            { opacity: 0, y: -14, ease: "power2.in", duration: 0.25 },
            0.30
          )
          .fromTo(".hero__title",
            { opacity: 1, y: 0 },
            { opacity: 0, y: -32, ease: "power2.in", duration: 0.30 },
            0.30
          )
          // Sub-body — the new phase-1 anchor. Crossfades in while the
          // headline dissolves, scaling up ~35% so it reads as a mid-size
          // headline (bigger than body copy, smaller than the H1).
          .to(".hero__sub-body", {
            opacity: 1, y: 0,
            scale: 1.6,
            transformOrigin: "center center",
            color: "#ffffff",
            fontWeight: 700,
            ease: "power2.out", duration: 0.35,
          }, 0.35)
          .to(".hero__credibility", { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 }, 0.65)
          .to(".hero__cta-row", { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 }, 0.80);
      }

      /* -------------------------------------------------- REFRAME
         The graphic circle BECOMES the product. 5-phase pinned timeline:
         (1) HOLD    · headline visible with small red button in the gap
         (2) EXPAND  · red cap scales ~40x to fill the viewport as a red wash
         (3) HOLD-RED· brief dwell on the pure red field
         (4) CONTRACT· red shrinks back to product size AND bezel + highlight
                       + SALTECH mark fade in — becomes a physical switch
         (5) DESCEND · switch translates downward, off-screen into next section

         The button is a SIBLING of the H2 (not a child) so the H2 fade
         doesn't take the button with it. Position is set from the invisible
         inline slot in the H2 via getBoundingClientRect. */
      const reframe = document.querySelector<HTMLElement>(".reframe");
      // Ball is now the shared .global-ball rendered at page root (fixed).
      const button = document.querySelector<HTMLElement>(".global-ball");
      const orb = button?.querySelector<HTMLElement>(".global-ball-orb");
      const slot = reframe?.querySelector<HTMLElement>(".reframe__slot");

      // Section pins to viewport top. The cosmic layer (200vh tall,
      // half red space + half white with content baked in) slides
      // upward by 50% of its own height during the pin — which is
      // exactly one viewport. That swaps the visible half from the
      // red top to the white bottom, and the content sitting in the
      // white bottom rises INTO view along with it. Because the
      // content is INSIDE the cosmic layer, the transition between
      // "white part of gradient" and "white with content" is one
      // continuous element — no seam, no separate fade.
      if (reframe) {
        gsap.set(".reframe__cosmic", { yPercent: 0 });

        // Scroll-triggered wash — NO pin. As the section enters the
        // viewport, the cosmic layer slides upward, revealing the
        // white content half. Start when section top hits viewport
        // bottom, complete by the time section top hits viewport top.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: reframe,
              start: "top bottom",
              end: "top top",
              scrub: 0.6,
            },
          })
          .to(".reframe__cosmic", { yPercent: -50, ease: "power2.inOut" }, 0);
      }

      // NOTE: Reframe ball/tile choreography DISABLED. Flip the `false &&`
      // back to just `reframe && button && orb && slot` to re-enable the
      // full HOLD → EXPAND → HOLD-RED → CONTRACT → HOLD-AT-CONTRACT pin.
      // If you re-enable the ball block, REMOVE the simple pin above
      // (this file will have two pins on `.reframe` otherwise).
      if ((false as boolean) && reframe && button && orb && slot) {
        const title = reframe.querySelector<HTMLElement>(".reframe__title");
        const body = reframe.querySelector<HTMLElement>(".reframe__body");
        const eyebrow = reframe.querySelector<HTMLElement>(".reframe__eyebrow");
        const bezel = button.querySelector<SVGGElement>(".reframe__btn-bezel");
        const highlight = button.querySelector<SVGGElement>(".reframe__btn-highlight");
        const mark = button.querySelector<SVGTextElement>(".reframe__btn-mark");

        // Slot has default width 0 in CSS (so the headline doesn't show
        // an awkward empty gap before pin engages). GSAP animates the
        // slot's width open at pin start and closed again at EXPAND.
        const expectedSlotWidth = () =>
          Math.max(56, Math.min((5 * window.innerWidth) / 100, 80));

        // Ball position: measure the slot at its TARGET (expanded)
        // width, not its current width. Because the H2 is text-align:
        // center and "Control" is wider than "that", the slot's actual
        // center X shifts rightward from the viewport center when the
        // slot expands. If we measured with the slot at its current
        // width (which starts at 0), the ball would land at the wrong
        // spot — visibly left of the gap, overlapping "Control".
        //
        // To get the correct target X, temporarily force the slot to
        // its expected width, measure its rect, then restore. Two forced
        // reflows per measurement, but this only happens on pin enter /
        // resize / refresh — not per-frame — so the perf cost is
        // negligible.
        const measureDeltas = () => {
          const reframeRect = reframe.getBoundingClientRect();
          // Save whatever width GSAP or CSS currently has on the slot,
          // temporarily force it to the target expanded width to
          // measure, then restore. Using gsap.getProperty/gsap.set
          // preserves GSAP's internal cache so this doesn't fight any
          // in-flight width tween.
          const previousWidth = gsap.getProperty(slot, "width") as number;
          gsap.set(slot, { width: expectedSlotWidth() });
          const slotRect = slot.getBoundingClientRect();
          gsap.set(slot, { width: previousWidth });
          const slotCenterX =
            slotRect.left - reframeRect.left + slotRect.width / 2;
          const slotCenterY =
            slotRect.top - reframeRect.top + slotRect.height / 2;
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          button.dataset.dx = String(centerX - slotCenterX);
          button.dataset.dy = String(centerY - slotCenterY);
          return { slotCenterX, slotCenterY };
        };

        const placeButtonOnce = () => {
          const { slotCenterX, slotCenterY } = measureDeltas();
          // Measure the ORB (not the whole flex container which includes
          // the time label). We want the orb centered on the slot.
          const orbRect = orb.getBoundingClientRect();
          // NOTE: no autoAlpha here — the ball's fixed viewport position
          // means it would visibly float over Hero (which is above reframe
          // in scroll order). Visibility is toggled by the pin
          // ScrollTrigger's onEnter/onLeaveBack callbacks below.
          gsap.set(button, {
            left: slotCenterX - orbRect.width / 2,
            top: slotCenterY - orbRect.height / 2,
            x: 0,
            y: 0,
            scale: 1,
          });
        };
        // Initial state: bezel/highlight/SALTECH-mark start invisible
        // — they only fade in during the CONTRACT phase of the pin
        // timeline. onEnter/onEnterBack now use pinTl.progress() to
        // force the timeline to re-sync on re-entry, so no manual
        // reset is needed there.
        gsap.set([bezel, highlight, mark], { opacity: 0 });
        placeButtonOnce();
        // On resize: only refresh deltas — never touch the button's
        // transform/opacity while an animation might be scrubbing it.
        window.addEventListener("resize", measureDeltas);

        // Scale factor to make the red cap cover the whole viewport.
        // Measure the ORB (the actual visible circle), not the whole
        // flex container which also contains the time-label span.
        const getExpandScale = () => {
          const btnW = orb.getBoundingClientRect().width || 140;
          const diag = Math.hypot(window.innerWidth, window.innerHeight);
          // 1.6x diagonal / orb diameter — covers even on wide aspect ratios
          return (diag * 1.6) / btnW;
        };

        // Pin: +=800% (8x viewport) so descent has real scroll room and
        // scrub:true means every scroll click moves the ball instantly.
        // The descent phase is 55% of the timeline — that's ~440vh of scroll
        // during which the ball is continuously visibly falling.
        const pinTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: reframe,
            start: "top top",
            end: "+=500%",
            pin: true,
            pinSpacing: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Re-place ball at pin-start slot position on every refresh
            // (layout shifts, font loading, resize). Also re-sync
            // visibility state from the trigger's active flag so that
            // reloading with scroll already past the pin start doesn't
            // leave the ball hidden (onEnter only fires on forward scroll
            // INTO the trigger — never fires if we start out inside it).
            onRefresh: (self) => {
              placeButtonOnce();
              if (self.isActive) {
                gsap.set(button, { autoAlpha: 1 });
                slot.classList.add("is-taken");
              } else {
                gsap.set(button, { autoAlpha: 0 });
                slot.classList.remove("is-taken");
              }
            },
            // Visibility gate: the ball only exists (visually) while the
            // reframe pin is active. Before entering, it would otherwise
            // float over the Hero at its fixed viewport slot; scrolling
            // back to Hero should hide it again. In parallel, we toggle
            // .is-taken on the slot's CSS placeholder ball — it holds the
            // headline gap pre-pin, then fades out the instant the JS
            // ball takes over so there's no empty gap between "Control"
            // and "that".
            onEnter: () => {
              placeButtonOnce();
              gsap.set(button, { autoAlpha: 1 });
              slot.classList.add("is-taken");
              // Force ScrollTrigger to flush all trigger state to
              // timelines synchronously in this same tick, so the pin
              // timeline scrub applies scale/x/y/bezel-opacity for the
              // CURRENT scroll position — no one-frame gap where
              // placeButtonOnce's scale:1/x:0/y:0 baseline is visible
              // before the scrub catches up.
              ScrollTrigger.update();
            },
            onEnterBack: () => {
              // Scrolling back up from cycle into reframe pin. At this
              // scroll position we're at pin progress ~1.0 (CONTRACT
              // completed), so bypass the scrub lerp (scrub: 1.2 would
              // take 1.2s to reach target values) and PRE-SET the ball
              // to exactly the CONTRACT-end state in the same tick as
              // placeButtonOnce. This eliminates the visible frame gap
              // where the ball would sit at the slot (scale 1, no
              // bezel) before scrub caught up. The next scroll tick's
              // scrub will re-apply timeline values continuously —
              // which start from these matching values, so no visible
              // transition.
              placeButtonOnce();
              const dx = parseFloat(button.dataset.dx || "0");
              const dy = parseFloat(button.dataset.dy || "0");
              gsap.set(button, {
                autoAlpha: 1,
                scale: 1.2,
                x: dx,
                y: dy + window.innerHeight * 0.22,
              });
              gsap.set([bezel, highlight, mark], { opacity: 1 });
              slot.classList.add("is-taken");
            },
            onLeaveBack: () => {
              // Scrolling UP out of the pin toward Hero. Hide the ball
              // completely and also snap its transforms back to identity
              // so nothing lingers over Hero at a stale position. AND
              // restore the slot's CSS placeholder so the H2 gap isn't
              // empty when the reframe scrolls back into view again.
              gsap.set(button, { autoAlpha: 0, x: 0, y: 0, scale: 1 });
              slot.classList.remove("is-taken");
              cycleMarkerTime?.classList.remove("is-visible");
            },
            // NOTE: no onLeave here. Scrolling DOWN past the pin end
            // means the ball is transitioning into the cycle marker —
            // it's still visible on screen. If we removed .is-taken
            // here, the slot's CSS placeholder would pop back in and
            // we'd see TWO red balls (placeholder in slot + JS ball
            // below description). The placeholder only needs to reappear
            // when scrolling BACK to Hero (handled by onLeaveBack).
          },
        });

        // (1) HOLD  0.00 → 0.06 : reader takes in headline. Open the
        //     slot from width 0 (its CSS default, so no gap before pin)
        //     to its full expected width — this is what creates the
        //     visible gap for the ball in "Control [ball] that". Very
        //     quick (0.02 of timeline = ~10vh scroll) so the reveal
        //     feels like the ball punches into existence rather than
        //     text sliding open.
        pinTl.to(
          slot,
          {
            width: () => expectedSlotWidth(),
            duration: 0.02,
            ease: "power2.out",
          },
          0
        );
        pinTl.to({}, { duration: 0.04 });

        // (2) EXPAND  0.06 → 0.20 : text turns DARK (stays visible on the
        //     amber wash which now fills a cosmic-dark bg — white text
        //     would be invisible on the amber, so we invert to a deep
        //     brown/black), ball scales to fill viewport AND moves y
        //     toward viewport center so the wash is centered.
        pinTl.to(title, { color: "#1a1006", duration: 0.10, ease: "power1.inOut" }, 0.06);
        pinTl.to(body, { color: "rgba(26,16,6,0.82)", duration: 0.10, ease: "power1.inOut" }, 0.06);
        pinTl.to(eyebrow, { color: "rgba(26,16,6,0.82)", duration: 0.10, ease: "power1.inOut" }, 0.06);
        pinTl.to(slot, { width: 0, duration: 0.10, ease: "power1.inOut" }, 0.06);
        pinTl.to(
          button,
          {
            scale: getExpandScale,
            y: () => parseFloat(button.dataset.dy || "0"),
            ease: "power2.inOut",
            duration: 0.14,
          },
          0.06
        );

        // (3) HOLD-RED  0.20 → 0.28 : pure red wash briefly
        pinTl.to({}, { duration: 0.08 });

        // (4) CONTRACT  0.28 → 0.42 : ball shrinks to a legible tile
        //     size and moves BELOW the text at horizontal center; text
        //     stays visible with color restored to black. Bezel +
        //     highlight + mark reveal on the ball. Scale is 1.2 so the
        //     tile is a properly-visible mosaic mimic tile with its
        //     panel photo, metal frame and tag ID all readable —
        //     rather than a tiny illegible dot.
        pinTl.to(title, { color: "#ffffff", duration: 0.10, ease: "power1.inOut" }, 0.28);
        pinTl.to(body, { color: "rgba(255,255,255,0.78)", duration: 0.10, ease: "power1.inOut" }, 0.28);
        pinTl.to(eyebrow, { color: "rgba(255,255,255,0.7)", duration: 0.10, ease: "power1.inOut" }, 0.28);
        pinTl.to(
          button,
          {
            scale: 1.2,
            x: () => parseFloat(button.dataset.dx || "0"),
            y: () =>
              parseFloat(button.dataset.dy || "0") + window.innerHeight * 0.22,
            ease: "power2.inOut",
            duration: 0.14,
          },
          0.28
        );
        pinTl.to(bezel, { opacity: 1, duration: 0.10, ease: "power1.out" }, 0.34);
        pinTl.to(highlight, { opacity: 1, duration: 0.10, ease: "power1.out" }, 0.36);
        pinTl.to(mark, { opacity: 1, duration: 0.08, ease: "power1.out" }, 0.38);

        // (5) HOLD  0.42 → 1.00 : ball STAYS at CONTRACT position as a
        //     small physical switch below the description for the rest of
        //     the pin scroll. No DESCEND, no fade out — the user asked
        //     for one continuous ball that flows from reframe into cycle,
        //     so we leave it visible here and let the cycle timeline
        //     smoothly reshape it into the plain marker.
        pinTl.to({}, { duration: 0.58 });

        // Nav goes dark-text (on-light) while on the white section
        ScrollTrigger.create({
          trigger: reframe,
          start: "top 80px",
          end: "bottom 80px",
          onToggle: (self) => setNavLight(self.isActive),
        });

        // (The fixed white bg layer approach was removed — reframe now
        // paints its own white bg again, and .reframe__sticky's z-index
        // was bumped above the ball at document-root level, so text
        // stays on top of the red wash without needing a separate layer.)
      }

      /* -------------------------------------------------- CYCLE — nav goes light over cream section */
      const cycle = document.querySelector<HTMLElement>(".cycle");
      if (cycle) {
        ScrollTrigger.create({
          trigger: cycle,
          start: "top 80px",
          end: "bottom 80px",
          onToggle: (self) => setNavLight(self.isActive),
        });
      }

      /* -------------------------------------------------- CYCLE MARKER
         Ball descends into the viewport during the cycle intro (no time
         label yet), then PARKS at mid-viewport once the first shift is
         reached. From then on, the time label ticks smoothly forward with
         every scroll — interpolating between the 5 shift timestamps
         (06:00 → 12:00 → 18:00 → 22:00 → 02:00 next day). */
      const cycleMarker = document.querySelector<HTMLElement>(".global-ball");
      const cycleMarkerOrb = cycleMarker?.querySelector<HTMLElement>(".global-ball-orb");
      const cycleMarkerTime = document.querySelector<HTMLElement>(".global-ball-time");
      const cycleIntro = document.querySelector<HTMLElement>(".cycle__intro");
      const shiftEls = gsap.utils.toArray<HTMLElement>(".shift");
      const firstShift = shiftEls[0];
      const lastShift = shiftEls[shiftEls.length - 1];

      // NOTE: Cycle time-marker DISABLED together with the Reframe ball
      // choreography above. Flip the `false &&` back to just the original
      // guard to re-enable the ticking 06:00 → 02:00 scroll marker.
      if ((false as boolean) && cycleMarker && cycleMarkerTime && cycleIntro && firstShift && lastShift) {
        // The shared .global-ball is sized to the REFRAME clamp (90-150px)
        // so the reframe pushbutton looks right. The old .cycle__marker-orb
        // was ~35% of that size (32-52px). To keep the cycle marker
        // visually identical to before, we scale the ball down here.
        // Old: scale 0.85 on 52px orb ≈ 44px displayed
        // New: scale 0.29 on 150px ball ≈ 44px displayed → same on-screen size
        // Keeps the SAME physical-button appearance the reframe pin left
        // us with (CONTRACT scale 0.42, bezel+highlight+SALTECH mark
        // visible). Entry matches CONTRACT exactly so the handoff is
        // seamless. Base is larger so the parked button reads clearly
        // next to the time label.
        const CYCLE_BASE_SCALE = 0.42;
        const CYCLE_ENTRY_SCALE = 0.42;
        const CYCLE_EXIT_SCALE = 0.28;

        // NO gsap.set() at ctx-mount time — that would clobber the
        // reframe pin's initial state (which places the ball at the H2
        // slot). Instead, the cycle timeline's first .set() call — with
        // immediateRender: false — establishes the entry state ONLY when
        // the cycle ScrollTrigger reaches its start position.
        //
        // MAIN TIMELINE — set entry state, fade in at the reframe ball's
        // end position, rise gently to park at 14vh (slightly larger),
        // HOLD through all shifts, then fade off-screen.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: cycleIntro,
              start: "top bottom",
              endTrigger: lastShift,
              end: "bottom center",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          // Entry — SMOOTHLY animate from wherever the reframe pin left
          // the ball (CONTRACT state: below description at ~92vh viewport,
          // scale 0.42, with bezel + highlight + SALTECH mark visible) to
          // the cycle marker position at 78vh. Keeps the same physical
          // button appearance — bezel + highlight + mark stay visible so
          // it's clearly the same button flowing down from reframe, NOT
          // a different plain red ball.
          //
          // Using .to() instead of .set() means the button flows from
          // its last reframe position into the marker position rather
          // than hard-snapping.
          .to(
            cycleMarker,
            {
              top: "78vh",
              // Center the WHOLE visible combo (orb + gap + time label)
              // in the viewport. The ball container has a fixed width
              // (150px) but the time label overflows to the right, so
              // the actual visual extent is ~orb.left → time.right.
              // Centering on just the orb pushed the combo right of
              // center (because the time label extends past the orb);
              // centering on the container's fixed width did the same.
              left: () => {
                const orbW = cycleMarkerOrb
                  ? cycleMarkerOrb.getBoundingClientRect().width
                  : cycleMarker.getBoundingClientRect().width;
                const timeRect = cycleMarkerTime.getBoundingClientRect();
                const orbRect = cycleMarkerOrb
                  ? cycleMarkerOrb.getBoundingClientRect()
                  : cycleMarker.getBoundingClientRect();
                // Visual combo width = from orb's left edge to time's
                // right edge (accounts for gap between them and the
                // time label's actual rendered width).
                const comboW = Math.max(
                  orbW,
                  timeRect.right - orbRect.left
                );
                return window.innerWidth / 2 - comboW / 2;
              },
              x: 0,
              y: 0,
              scale: CYCLE_ENTRY_SCALE,
              autoAlpha: 1,
              ease: "power2.inOut",
              duration: 0.06,
            },
            0
          )
          // Stay at entry position (78vh) through cycle intro + first part of
          // 06:00 shift. Rise to sticky-top position around "8:00" scroll.
          .to({}, { duration: 0.16 })
          .to(cycleMarker, { top: "14vh", scale: CYCLE_BASE_SCALE, duration: 0.04 }, 0.22)
          .to({}, { duration: 0.66 })  // HOLD across remaining shifts
          .to(
            cycleMarker,
            { top: "108vh", scale: CYCLE_EXIT_SCALE, autoAlpha: 0, duration: 0.08 },
            0.92
          );

        // TIME INTERPOLATION — start showing the label when the first shift
        // enters, then tick forward continuously with scroll through all 5.
        // Times as minutes since midnight (02:00 next day = 1560).
        const times = [360, 720, 1080, 1320, 1560]; // 06:00 12:00 18:00 22:00 02:00+1
        const fmt = (mins: number) => {
          const total = Math.round(mins);
          const h = Math.floor(total / 60) % 24;
          const m = total % 60;
          return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        };

        // Each shift's TITLE is the anchor — time reveals when a title
        // reaches viewport center and updates as titles pass through it.
        const shiftTitles = shiftEls.map(
          (s) => s.querySelector<HTMLElement>(".shift__title") ?? s
        );
        const lastTitle = shiftTitles[shiftTitles.length - 1];

        // Reveal the time label only when the FIRST SHIFT TITLE has
        // scrolled into the lower part of the viewport (top 75%). By this
        // point the ball has fully parked at 62vh and the "Shift start..."
        // content is clearly the active section — so the "06:00" reveals
        // right next to the ball, inside the shift, not during cycle intro.
        ScrollTrigger.create({
          // Trigger on the FIRST SHIFT (not its title) with start at
          // "top bottom" — so the time label reveals the moment the
          // "Shift start. First press of the day" section's top edge
          // enters the viewport from below, which is the same moment
          // the ball becomes sticky at the top. Previously used the
          // title with "top 75%" which fired ~half a viewport later.
          trigger: firstShift,
          start: "top bottom",
          endTrigger: lastShift,
          end: "bottom 40%",
          onEnter: () => cycleMarkerTime.classList.add("is-visible"),
          onEnterBack: () => cycleMarkerTime.classList.add("is-visible"),
          onLeave: () => cycleMarkerTime.classList.remove("is-visible"),
          onLeaveBack: () => cycleMarkerTime.classList.remove("is-visible"),
        });

        // Set initial value so the reveal always shows 06:00 clean.
        cycleMarkerTime.textContent = fmt(times[0]);

        // Time interpolates CONTINUOUSLY across the full scroll distance
        // between each pair of shift titles. Anchor: shift[i] title at 65%
        // viewport = time exactly = times[i]. shift[i+1] title at 65% =
        // time exactly = times[i+1]. Between, time smoothly ticks forward
        // with every scroll click across the ~100vh span between shifts.
        // (65% matches the ball's park position at 62vh — ball and title
        // meet at each shift's exact time value.)
        const cycleMarkerEl = document.querySelector<HTMLElement>(".global-ball");
        const setCapByTime = (mins: number) => {
          if (!cycleMarkerEl) return;
          // 07:00 (420) → green, 20:00 (1200) → amber, 25:00 (1500) → red
          let cls: "global-ball--green" | "global-ball--amber" | null;
          if (mins >= 1500) cls = null; // red
          else if (mins >= 1200) cls = "global-ball--amber";
          else if (mins >= 420) cls = "global-ball--green";
          else cls = null; // red before 07:00
          cycleMarkerEl.classList.toggle(
            "global-ball--green",
            cls === "global-ball--green"
          );
          cycleMarkerEl.classList.toggle(
            "global-ball--amber",
            cls === "global-ball--amber"
          );
        };
        for (let i = 0; i < shiftTitles.length - 1; i++) {
          const from = times[i];
          const to = times[i + 1];
          ScrollTrigger.create({
            trigger: shiftTitles[i],
            start: "top 65%",
            endTrigger: shiftTitles[i + 1],
            end: "top 65%",
            scrub: 1,
            onUpdate: (self) => {
              const current = from + (to - from) * self.progress;
              cycleMarkerTime.textContent = fmt(current);
              setCapByTime(current);
            },
          });
        }

        // Flip marker time-label color to white on dark shifts (night, deep).
        shiftEls.forEach((shift) => {
          const isDark =
            shift.classList.contains("shift--night") ||
            shift.classList.contains("shift--deep");
          ScrollTrigger.create({
            trigger: shift,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () =>
              cycleMarker.classList.toggle("global-ball--dark", isDark),
            onEnterBack: () =>
              cycleMarker.classList.toggle("global-ball--dark", isDark),
          });
        });
        // Suppress unused var warning
        void firstShift;
        void lastTitle;
      }

      /* Individual shifts — parallax disabled; caused visible per-scroll jitter */

      /* DARK MODE TRIGGER — when the 22:00 (night) shift reaches the top of
         the viewport, flip both the night AND deep shifts to full dark.
         Reverse on scroll back up. */
      const eveningShift = document.querySelector<HTMLElement>(".shift--evening");
      const nightShift = document.querySelector<HTMLElement>(".shift--night");
      const deepShift = document.querySelector<HTMLElement>(".shift--deep");

      /* CAP COLOR is now driven inside the time-interpolation onUpdate above
         so the color always matches the displayed time exactly. */
      if (nightShift) {
        const darkTargets = [eveningShift, nightShift, deepShift].filter(
          (el): el is HTMLElement => !!el
        );
        const addDark = () =>
          darkTargets.forEach((el) => el.classList.add("shift--is-dark"));
        const removeDark = () =>
          darkTargets.forEach((el) => el.classList.remove("shift--is-dark"));
        ScrollTrigger.create({
          trigger: nightShift,
          start: "top center",
          endTrigger: deepShift || nightShift,
          end: "bottom top",
          onEnter: addDark,
          onEnterBack: addDark,
          onLeave: removeDark,
          onLeaveBack: removeDark,
        });
      }

      /* -------------------------------------------------- FEATURES — pushbutton rotates on scroll */
      const featuresHero = document.querySelector<HTMLElement>(".features__hero");
      const product = document.querySelector<HTMLElement>(".features__product");
      if (featuresHero && product) {
        gsap.to(product, {
          rotation: 90,
          scale: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: featuresHero,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      }

      /* -------------------------------------------------- TRIAL / TECH — light-section nav (clients is now dark) */
      [".trial", ".quote", ".tech"].forEach((sel) => {
        const el = document.querySelector<HTMLElement>(sel);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 80px",
          end: "bottom 80px",
          onToggle: (self) => setNavLight(self.isActive),
        });
      });

      /* -------------------------------------------------- QUOTE — reveal via
         raw scroll math + rAF. Independent of ScrollTrigger/Lenis — if
         the page scrolls, this animates. Progress is measured against the
         viewport with getBoundingClientRect on every frame the scroll has
         changed. */
      const quoteText = document.querySelector<HTMLElement>(".quote__text");
      if (quoteText) {
        const words = Array.from(
          quoteText.querySelectorAll<HTMLElement>(".quote__word")
        );
        if (words.length > 0) {
          const paint = (progress: number) => {
            const p = Math.max(0, Math.min(1, progress));
            const revealed = Math.round(p * words.length);
            for (let i = 0; i < words.length; i++) {
              const on = i < revealed;
              if ((words[i].dataset.revealed === "true") !== on) {
                words[i].dataset.revealed = on ? "true" : "false";
              }
            }
          };
          const compute = () => {
            const rect = quoteText.getBoundingClientRect();
            const vh = window.innerHeight;
            // Progress 0 when text top is at 80% down viewport (just
            // entering). Progress 1 when text bottom is at 40% down
            // viewport (nearly finished passing). Linear between.
            const startY = vh * 0.8;
            const endY = vh * 0.4;
            const totalTravel = (startY - endY) + rect.height;
            const traveled = startY - rect.top;
            paint(traveled / totalTravel);
          };
          compute();
          let ticking = false;
          const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
              compute();
              ticking = false;
            });
          };
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", compute);
        }
      }

      /* -------------------------------------------------- SOLUTIONS — per-scene entry + image parallax
         Each full-viewport .sol-scene:
           - text stagger (title → body → cta) fades up when the scene
             enters the viewport (one-shot, not scrubbed)
           - image scrubs a slow scale+translate as the scene passes
             through, giving a subtle parallax/depth feel                */
      gsap.utils.toArray<HTMLElement>(".sol-scene").forEach((scene) => {
        const media = scene.querySelector<HTMLElement>(".sol-scene__media img");
        const title = scene.querySelector<HTMLElement>(".sol-scene__title");
        const body = scene.querySelector<HTMLElement>(".sol-scene__body");
        const cta = scene.querySelector<HTMLElement>(".sol-scene__cta");

        const textTargets = [title, body, cta].filter(
          (el): el is HTMLElement => !!el
        );
        if (textTargets.length) {
          gsap.set(textTargets, { y: 40, opacity: 0 });
          gsap.to(textTargets, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.14,
            scrollTrigger: {
              trigger: scene,
              start: "top 65%",
              once: true,
            },
          });
        }

        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.12, yPercent: -4 },
            {
              scale: 1,
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            }
          );
        }
      });

      /* Solutions section is white — flip nav to dark-text while active */
      const solutions = document.querySelector<HTMLElement>(".solutions");
      if (solutions) {
        ScrollTrigger.create({
          trigger: solutions,
          start: "top 80px",
          end: "bottom 80px",
          onToggle: (self) => setNavLight(self.isActive),
        });
      }

      /* -------------------------------------------------- FINAL CTA — word-by-word scrub reveal */
      const finalText = document.querySelector<HTMLElement>(".final__text");
      if (finalText) {
        const words = Array.from(
          finalText.querySelectorAll<HTMLElement>(".final__word")
        );
        if (words.length > 0) {
          const paint = (progress: number) => {
            const p = Math.max(0, Math.min(1, progress));
            const revealed = Math.round(p * words.length);
            for (let i = 0; i < words.length; i++) {
              const on = i < revealed;
              if ((words[i].dataset.revealed === "true") !== on) {
                words[i].dataset.revealed = on ? "true" : "false";
              }
            }
          };
          const compute = () => {
            const rect = finalText.getBoundingClientRect();
            const vh = window.innerHeight;
            const startY = vh * 0.85;
            const endY = vh * 0.35;
            const totalTravel = (startY - endY) + rect.height;
            const traveled = startY - rect.top;
            paint(traveled / totalTravel);
          };
          compute();
          let ticking = false;
          const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
              compute();
              ticking = false;
            });
          };
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", compute);
        }
      }

      /* -------------------------------------------------- GENERIC REVEAL */
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => el.classList.add("is-in"),
          once: true,
        });
      });

      /* -------------------------------------------------- BALL SAFETY NET
         Defensive scroll listener that ENFORCES "ball hidden in Hero
         region". Why we need this on top of ScrollTrigger callbacks:
         the BackToTop button uses native `window.scrollTo({ behavior:
         "smooth" })`, and Chrome's native smooth-scroll can dispatch
         scroll events with big gaps between them — big enough that
         ScrollTrigger's onLeaveBack sometimes doesn't fire when the
         scroll blows past the pin-start boundary. Result: ball's pin
         state (CONTRACT position, autoAlpha 1) sticks around and the
         ball ends up floating over the hero.

         This listener runs on every scroll event and, if reframe hasn't
         yet reached the viewport top (i.e. we're still in hero region),
         hard-resets the ball to hidden. It's idempotent — reads the
         current state and only writes when we're actually in hero — so
         it doesn't fight the pin timeline when the pin is active. */
      const reframeEl = document.querySelector<HTMLElement>(".reframe");
      const ballEl = document.querySelector<HTMLElement>(".global-ball");
      const slotEl = document.querySelector<HTMLElement>(".reframe__slot");
      const timeEl = document.querySelector<HTMLElement>(".global-ball-time");
      const firstShiftEl = document.querySelector<HTMLElement>(".shift");
      const allShifts = document.querySelectorAll<HTMLElement>(".shift");
      const lastShiftEl = allShifts[allShifts.length - 1] ?? null;
      if (reframeEl && ballEl) {
        const enforceBallState = () => {
          const rr = reframeEl.getBoundingClientRect();
          // reframe.top > 0 means the reframe hasn't reached the viewport
          // top yet — we're still scrolling through Hero. Ball must be
          // hidden here regardless of what the pin timeline last set.
          if (rr.top > 0) {
            gsap.set(ballEl, { autoAlpha: 0, x: 0, y: 0, scale: 1 });
            slotEl?.classList.remove("is-taken");
            timeEl?.classList.remove("is-visible");
            return;
          }
          // Time label visibility: should be visible while somewhere
          // between the first shift entering the viewport (top bottom,
          // matching the ScrollTrigger start) and the last shift exiting
          // (bottom above viewport top). Outside that range, force it
          // off — the shift ScrollTriggers handle this normally but
          // smooth-scroll (from BackToTop) can skip past their
          // boundaries. Range MUST be a superset of the trigger's range
          // or the listener will strip the class right after the trigger
          // adds it.
          if (timeEl && firstShiftEl && lastShiftEl) {
            const fr = firstShiftEl.getBoundingClientRect();
            const lr = lastShiftEl.getBoundingClientRect();
            const vh = window.innerHeight;
            const inShiftRange = fr.top < vh && lr.bottom > 0;
            if (!inShiftRange) timeEl.classList.remove("is-visible");
          }
        };
        // (1) Scroll events — catches most transitions.
        window.addEventListener("scroll", enforceBallState, { passive: true });
        // (2) requestAnimationFrame loop — the absolute guarantee. Runs
        //     every frame (~60fps) so even if a scroll event is missed
        //     (fast programmatic scroll, tab switch race, layout shift
        //     from font load, etc.), the ball can never be visible in
        //     Hero for more than one frame. Cheap: one getBoundingClientRect
        //     + a conditional gsap.set that's a no-op when already hidden.
        let rafId = 0;
        const rafEnforce = () => {
          enforceBallState();
          rafId = requestAnimationFrame(rafEnforce);
        };
        rafId = requestAnimationFrame(rafEnforce);
        // (3) ScrollTrigger's own refresh event — fires on layout shifts
        //     (resize, font load, pin recalculations). Enforce right after
        //     any recalculation.
        ScrollTrigger.addEventListener("refresh", enforceBallState);
        // (4) Run once immediately so the very first paint reflects the
        //     correct state (before any scroll or raf tick).
        enforceBallState();
        // Store cleanup for the outer useEffect return — gsap.context()
        // doesn't tear down our manually-registered raf loop and DOM
        // listeners, so route them through React's own teardown so we
        // don't leak on hot reload / unmount.
        ballSafetyCleanup = () => {
          cancelAnimationFrame(rafId);
          window.removeEventListener("scroll", enforceBallState);
          ScrollTrigger.removeEventListener("refresh", enforceBallState);
        };
      }
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ballSafetyCleanup?.();
      // Tear down Lenis — stop its raf hook, remove scroll listener,
      // destroy the instance so it doesn't keep processing scroll after
      // hot reload / unmount.
      gsap.ticker.remove(lenisTick);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return null;
}
