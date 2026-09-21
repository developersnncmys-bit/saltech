"use client";

import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// =============================================================================
// CAMERA KEYFRAMES  —  tune these to fine-tune each stage of the sequence.
//
// Each keyframe defines:
//   pos       : camera world position       [x, y, z]
//   target    : camera lookAt point         [x, y, z]
//   modelRotY : subtle model Y-rotation     (radians)
//
// Distance-from-origin profile follows the "medium → closer → close → medium
// → medium" curve. The scroll driver smoothstep-interpolates between each
// adjacent pair.
//
// If the CAD model imported facing the wrong way, tune MODEL_INITIAL_ROTATION
// below instead of the keyframes — it's applied ONCE at load, before scaling.
// =============================================================================

type Keyframe = {
  pos: [number, number, number];
  target: [number, number, number];
  modelRotY: number;
};

// 7-keyframe choreography. Product opens at ~55% vh, enlarges to ~65% during
// engineering. Camera pos interpolated with slerp (smooth arc).
//
// COMPOSITION FLIP (engineering scene):
// The rear/internal camera pose puts the product naturally on the LEFT of
// the viewport — we lean into that. Product on LEFT, engineering copy on
// the RIGHT (editorial split-screen), not the previous product-right layout.
//
// target.x moves product LEFT via a NEGATIVE offset on stages 4→7. The
// motion is progressive: stage 4 partially shifts, stage 5 fully arrives,
// so the right side visibly CLEARS before any text fades in.
//
// target.y kept constant (0.15) across engineering so there's zero vertical
// camera motion during the exit — no upward jump toward the navbar.
const KEYFRAMES: Record<string, Keyframe> = {
  // 0.00–0.15  Opening hero. Front 3/4, product ~55% vh, heading + specs visible.
  stage1_hero:            { pos: [ 3.7,  2.1,  6.2], target: [ 0.00, 0.25, 0.0], modelRotY: 0.00 },
  // 0.15–0.32  Heading/specs fade, product enlarges, slow rotation begins.
  stage2_enlarge:         { pos: [ 3.5,  1.7,  5.6], target: [ 0.00, 0.15, 0.0], modelRotY: 0.03 },
  // 0.32–0.50  Product rotates toward the side, camera swings to the right.
  stage3_sideRotate:      { pos: [ 5.9,  1.3,  3.3], target: [ 0.00, 0.15, 0.0], modelRotY: 0.05 },
  // 0.50–0.60  Camera arrives at rear-left. target.x begins moving product LEFT.
  stage4_engineeringIn:   { pos: [-3.5,  1.7, -6.0], target: [-0.55, 0.15, 0.0], modelRotY: 0.08 },
  // 0.60–0.82  Engineering DOMINANT. target.x = -1.0 → product center ≈ 36vw,
  // right side of the viewport CLEAR for the copy block.
  stage5_engineering:     { pos: [-2.5,  1.5, -5.7], target: [-1.00, 0.15, 0.0], modelRotY: 0.08 },
  // 0.82–0.92  HOLD the final engineering composition — no motion.
  stage6_hold:            { pos: [-2.5,  1.5, -5.7], target: [-1.00, 0.15, 0.0], modelRotY: 0.08 },
  // 0.92–1.00  Graceful exit. Same pose — NO camera jump; only wrapper scale.
  stage7_exit:            { pos: [-2.5,  1.5, -5.7], target: [-1.00, 0.15, 0.0], modelRotY: 0.08 },
};

// Stage 4 ends at 0.60 so the product is FULLY at its final left position
// before any engineering copy fades in (0.62+). Guarantees zero overlap
// during the transition, not just at the final frame.
const STAGES: { key: keyof typeof KEYFRAMES; end: number }[] = [
  { key: "stage1_hero",           end: 0.15 },
  { key: "stage2_enlarge",        end: 0.32 },
  { key: "stage3_sideRotate",     end: 0.50 },
  { key: "stage4_engineeringIn",  end: 0.60 },
  { key: "stage5_engineering",    end: 0.82 },
  { key: "stage6_hold",           end: 0.92 },
  { key: "stage7_exit",           end: 1.00 },
];

const MODEL_INITIAL_ROTATION: [number, number, number] = [0, 0, 0];
const MODEL_TARGET_SIZE = 2.6;
// Compressed timeline — every scroll segment produces a visible change,
// no long stretches of empty black space.
const SCROLL_DISTANCE_PX = 1500;
const SECTION_SELECTOR = ".saltech-cinematic-section";
const MODEL_URL = "/models/saltech-switch.gltf";

// =============================================================================

useGLTF.preload(MODEL_URL);

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const rampIn = (p: number, s: number, e: number) => clamp01((p - s) / (e - s));
const rampOut = (p: number, s: number, e: number) => 1 - rampIn(p, s, e);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Reusable temporaries for slerpPos — avoid per-frame allocations
const _tmpVA = new THREE.Vector3();
const _tmpVB = new THREE.Vector3();

/**
 * Spherical interpolation of a position around the world origin.
 * Direction slerps on the sphere, magnitude lerps linearly. Keeps the
 * interpolated point on a smooth arc so distance never dips below the
 * endpoints — critical for consistent product size during large orbits.
 */
function slerpPos(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  _tmpVA.set(a[0], a[1], a[2]);
  _tmpVB.set(b[0], b[1], b[2]);
  const magA = _tmpVA.length();
  const magB = _tmpVB.length();

  if (magA < 1e-4 || magB < 1e-4) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }

  const invA = 1 / magA;
  const invB = 1 / magB;
  const ax = _tmpVA.x * invA, ay = _tmpVA.y * invA, az = _tmpVA.z * invA;
  const bx = _tmpVB.x * invB, by = _tmpVB.y * invB, bz = _tmpVB.z * invB;
  const dot = Math.min(1, Math.max(-1, ax * bx + ay * by + az * bz));
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega);

  if (sinOmega < 1e-4) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }

  const wa = Math.sin((1 - t) * omega) / sinOmega;
  const wb = Math.sin(t * omega) / sinOmega;
  const dx = ax * wa + bx * wb;
  const dy = ay * wa + by * wb;
  const dz = az * wa + bz * wb;
  const mag = magA + (magB - magA) * t;
  // Normalize (interpolated direction has length ~1 already, but not exact)
  const dLen = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
  const scale = mag / dLen;
  return [dx * scale, dy * scale, dz * scale];
}

function getPose(p: number) {
  let fromKey: keyof typeof KEYFRAMES = STAGES[0].key;
  let spanStart = 0;
  for (let i = 0; i < STAGES.length; i++) {
    const s = STAGES[i];
    if (p <= s.end || i === STAGES.length - 1) {
      const from = KEYFRAMES[fromKey];
      const to = KEYFRAMES[s.key];
      const t = s.end === spanStart ? 1 : clamp01((p - spanStart) / (s.end - spanStart));
      const k = smooth(t);
      return {
        // Position on a sphere → distance from origin varies smoothly, never dips
        pos: slerpPos(from.pos, to.pos, k),
        // Targets are small offsets near origin — plain lerp is fine
        target: [
          lerp(from.target[0], to.target[0], k),
          lerp(from.target[1], to.target[1], k),
          lerp(from.target[2], to.target[2], k),
        ] as [number, number, number],
        modelRotY: lerp(from.modelRotY, to.modelRotY, k),
      };
    }
    fromKey = s.key;
    spanStart = s.end;
  }
  const last = KEYFRAMES[STAGES[STAGES.length - 1].key];
  return { pos: last.pos, target: last.target, modelRotY: last.modelRotY };
}

function SwitchModel({
  progressRef,
  onReady,
}: {
  progressRef: MutableRefObject<number>;
  onReady: () => void;
}) {
  const { scene } = useGLTF(MODEL_URL) as unknown as { scene: THREE.Group };
  const wrapperRef = useRef<THREE.Group>(null);
  const baseScaleRef = useRef(1);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !scene) return;

    wrapper.position.set(0, 0, 0);
    wrapper.rotation.set(0, 0, 0);
    wrapper.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);
    scene.rotation.set(
      MODEL_INITIAL_ROTATION[0],
      MODEL_INITIAL_ROTATION[1],
      MODEL_INITIAL_ROTATION[2],
    );
    scene.scale.set(1, 1, 1);

    // Force the matrix chain to recompute BEFORE measuring the box.
    //
    // Box3.setFromObject reads each object's cached matrixWorld. Three.js
    // only refreshes matrixWorld during a render — useLayoutEffect runs
    // BEFORE the next frame, so without manual updates the box can be
    // measured against a stale wrapper.matrixWorld left over from a
    // previous mount (React StrictMode double-invoke, HMR, fast refresh).
    // That stale matrix can contain residual scale, making the measured
    // box huge, the computed scale tiny, and the model render at ~1% of
    // intended size on some reloads. Explicitly refresh the chain first.
    wrapper.updateMatrix();
    wrapper.matrixWorld.copy(wrapper.matrix);
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = MODEL_TARGET_SIZE / maxDim;

    scene.position.sub(center);
    wrapper.scale.setScalar(scale);
    baseScaleRef.current = scale;

    // Names/keywords that identify the third-party ETI brand decal baked
    // into the GLB. Any mesh (or material) matching any of these gets
    // hidden. Doesn't modify the .gltf file — pure runtime filter.
    const HIDE_PATTERNS = ["eti", "logo", "decal", "brand", "label", "watermark"];
    const shouldHide = (s: string | undefined | null) => {
      if (!s) return false;
      const lower = s.toLowerCase();
      return HIDE_PATTERNS.some((p) => lower.includes(p));
    };

    // One-time debug: list every mesh name so we can identify the ETI mesh
    // if the pattern above misses it. Remove after verifying.
    const meshNames: string[] = [];

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      const matArr = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const matNames = matArr.map((m) => (m ? m.name : "")).filter(Boolean).join(",");
      meshNames.push(`${mesh.name || "(unnamed)"}  [mat: ${matNames || "(none)"}]`);

      // Hide by mesh name OR by material name (branding is often a separately-named material)
      if (shouldHide(mesh.name) || matArr.some((m) => shouldHide(m?.name))) {
        mesh.visible = false;
        return;
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      matArr.forEach((m) => {
        const std = m as THREE.MeshStandardMaterial;
        if (!std || !(std as unknown as { isMeshStandardMaterial?: boolean }).isMeshStandardMaterial) return;
        if (std.metalness !== undefined && std.metalness > 0.5) {
          std.envMapIntensity = 1.4;
        } else {
          std.envMapIntensity = 0.7;
        }
        std.needsUpdate = true;
      });
    });

    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.info("[SwitchShowcase] meshes in GLB:\n" + meshNames.join("\n"));
    }

    onReady();
  }, [scene, onReady]);

  useFrame(() => {
    if (!wrapperRef.current) return;
    const p = progressRef.current;
    wrapperRef.current.rotation.y = getPose(p).modelRotY;
    // Graceful exit (0.92 → 1.00): subtle 5% scale recede.
    const handoff = rampIn(p, 0.92, 1.0);
    wrapperRef.current.scale.setScalar(baseScaleRef.current * (1 - 0.05 * handoff));
  });

  return (
    <group ref={wrapperRef}>
      <primitive object={scene} />
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    const { pos, target } = getPose(0);
    camera.position.set(pos[0], pos[1], pos[2]);
    lookAt.current.set(target[0], target[1], target[2]);
    camera.lookAt(lookAt.current);
    if ((camera as THREE.PerspectiveCamera).updateProjectionMatrix) {
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }
  }, [camera]);

  useFrame(() => {
    const { pos, target } = getPose(progressRef.current);
    camera.position.set(pos[0], pos[1], pos[2]);
    lookAt.current.set(target[0], target[1], target[2]);
    camera.lookAt(lookAt.current);
  });
  return null;
}

function RearAccentLight({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const ref = useRef<THREE.DirectionalLight>(null);
  useFrame(() => {
    if (!ref.current) return;
    // Warm accent for copper/orange internals — reads with Saltech's amber.
    // Starts earlier (0.32) for the side-rotation reveal, holds strong
    // through engineering (0.82).
    ref.current.intensity = lerp(0.60, 3.0, rampIn(progressRef.current, 0.32, 0.72));
  });
  return <directionalLight ref={ref} position={[0.8, 2.2, -6]} intensity={0.60} color="#FFB8B0" />;
}

export default function SwitchShowcase({ renderCanvas = true }: { renderCanvas?: boolean } = {}) {
  const progressRef = useRef(0);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector<HTMLElement>(SECTION_SELECTOR);
    if (!section) return;

    // Scope all DOM queries to inside the section so we can NEVER touch
    // any element outside the cinematic wrapper.
    const eyebrow  = section.querySelector<HTMLElement>(".features__eyebrow");
    const title    = section.querySelector<HTMLElement>(".features__title");
    const caption  = section.querySelector<HTMLElement>(".features__caption");
    const canvas   = section.querySelector<HTMLElement>(".saltech-cinematic-canvas");
    // Pre-reveal intro — three paragraphs arranged as a horizontal row.
    // Each reveals in sequence during the first half of the scroll, then
    // they exit together so the 3D model can take over.
    const introParas = Array.from(
      section.querySelectorAll<HTMLElement>(".features__intro-para")
    );
    // Rear text — reveals WITH the 3D model in the second half of the
    // scroll. Contains the Mosaic Mimic Systems solution copy.
    const rearTag     = section.querySelector<HTMLElement>(".saltech-cinematic-rear-text__tag");
    const rearEyebrow = section.querySelector<HTMLElement>(".saltech-cinematic-rear-text__eyebrow");
    const rearTitle   = section.querySelector<HTMLElement>(".saltech-cinematic-rear-text__title");
    const rearBody    = section.querySelector<HTMLElement>(".saltech-cinematic-rear-text__body");
    const rearCta     = section.querySelector<HTMLElement>(".saltech-cinematic-rear-text__cta");
    const rearChildren: (HTMLElement | null)[] = [rearTag, rearEyebrow, rearTitle, rearBody, rearCta];
    // Editorial hero container — wraps tag + heading (with inline pill)
    // + body + CTA. The inline pill inside the heading is the mosaic
    // image that expands via scroll.
    const heroWrap  = section.querySelector<HTMLElement>(".saltech-cinematic-hero");
    const canvasImg = section.querySelector<HTMLElement>(".saltech-cinematic-canvas__img");
    const staticImage = section.querySelector<HTMLElement>(
      ".saltech-cinematic-static-image"
    );

    // Two-phase reveal:
    //   Phase 0 (scroll 0.00 → 0.42): "Engineering-led solutions..."
    //     title + eyebrow visible from start; three intro paragraphs
    //     stagger in, hold, then exit together.
    //   Phase 1 (scroll 0.42 → 1.00): Mosaic Mimic hero fades in
    //     (Solution pill + heading with inline mosaic pill + body +
    //     CTA), then image expands to fill viewport, then fades out.
    // Explicit progress-0 state so first paint matches phase 0.
    if (eyebrow) { eyebrow.style.opacity = "1"; eyebrow.style.transform = "translateX(-50%) translateY(0px)"; }
    if (title)   { title.style.opacity   = "1"; title.style.transform   = "translateX(-50%) translateY(0px)"; }
    if (caption) caption.style.opacity = "0";
    if (canvas) {
      canvas.style.opacity = renderCanvas ? "0" : "1";
      canvas.style.visibility = renderCanvas ? "hidden" : "visible";
    }
    introParas.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
    });
    // Rear-text children stay at opacity 1 — the heroWrap parent
    // controls visibility. If children are also 0, the multiplication
    // (parent × child) means they can never show even when heroWrap
    // fades in.
    rearChildren.forEach((el) => {
      if (!el) return;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    if (heroWrap) heroWrap.style.opacity = "0";
    if (canvasImg) {
      canvasImg.style.setProperty("--reveal-scale", "1");
      canvasImg.style.setProperty("--reveal-radius", "999px");
    }

    // Non-overlapping fades. Hero heading exits with a slight UPWARD lift so
    // the transition reads as intentional rather than passive.
    //   eyebrow      1→0  during 0.10–0.18  (translateY 0 → -10)
    //   title        1→0  during 0.15–0.28  (translateY 0 → -22)
    //   caption      1→0  during 0.20–0.32
    // Engineering copy — product fully settled on LEFT at 0.60, then text
    // fades in on the RIGHT with a 4%-scroll stagger for editorial rhythm:
    //   rearEyebrow  0→1  during 0.62–0.70  (translateY 20 → 0)
    //   rearTitle    0→1  during 0.66–0.74
    //   rearBody     0→1  during 0.70–0.78
    // All three exit together 0.94–1.00.
    const applyRearChild = (
      el: HTMLElement | null,
      inStart: number,
      inEnd: number,
      p: number,
    ) => {
      if (!el) return;
      const inK  = rampIn(p, inStart, inEnd);
      const outK = rampOut(p, 0.94, 1.00);
      el.style.opacity = String(inK * outK);
      el.style.transform = `translateY(${lerp(20, 0, inK)}px)`;
    };

    // Sequenced-paragraph reveal for the rear body slot. Each paragraph
    // has its own visible window inside the "engineering scene" (0.70–1.00).
    // Ranges chosen so each holds long enough to read + brief cross-fades
    // between them. All three exit together during 0.94–1.00 so the last
    // paragraph joins the rest of the rear text in leaving the scene.
    const applyRearParagraph = (
      el: HTMLElement | null,
      inStart: number,
      inEnd: number,
      outStart: number,
      outEnd: number,
      p: number,
    ) => {
      if (!el) return;
      const inK  = rampIn(p, inStart, inEnd);
      const outK = 1 - rampIn(p, outStart, outEnd);
      const exitK = rampOut(p, 0.94, 1.00);
      el.style.opacity = String(inK * outK * exitK);
      el.style.transform = `translateY(${lerp(20, 0, inK)}px)`;
    };

    // Max scale for the image expansion — updated by alignImageToPill()
    // below once real dimensions are known. Declared here (before
    // applyText) so the closure can safely reference it.
    const maxScaleRef = { current: 20 };

    const applyText = (p: number) => {
      // Phase 0 (0.00 → 0.42): features title + eyebrow + 3 intro
      // paragraphs. Phase 1 (0.42 → 1.00): Mosaic Mimic hero fades in,
      // then image expands to full viewport, then everything exits.
      const preRevealHidden = p > 0.42;
      const canvasHidden    = p < 0.42;
      if (staticImage) {
        const imageIn = rampIn(p, 0.42, 0.48);

        staticImage.style.opacity = String(imageIn);
        staticImage.style.visibility =
        imageIn > 0 ? "visible" : "hidden";
    }

      if (eyebrow) {
        const k = rampIn(p, 0.34, 0.42);
        eyebrow.style.opacity = String(1 - k);
        eyebrow.style.transform = `translateX(-50%) translateY(${lerp(0, -10, k)}px)`;
        eyebrow.style.visibility = preRevealHidden ? "hidden" : "visible";
      }
      if (title) {
        const k = rampIn(p, 0.34, 0.42);
        title.style.opacity = String(1 - k);
        title.style.transform = `translateX(-50%) translateY(${lerp(0, -22, k)}px)`;
        title.style.visibility = preRevealHidden ? "hidden" : "visible";
      }
      if (caption) {
        caption.style.opacity = "0";
      }
      if (canvas) {
      // Keep the static mosaic image visible.
      // The static image is rendered by FeatureGrid when renderCanvas=false.
        if (renderCanvas) {
          const inK = rampIn(p, 0.44, 0.54);
          const outK = rampOut(p, 0.94, 1.00);

          canvas.style.opacity = String(inK * outK);
           canvas.style.visibility = canvasHidden ? "hidden" : "visible";
          } else {
          canvas.style.opacity = "1";
          canvas.style.visibility = "visible";
          }
      }
      if (canvasImg) {
        // Scroll-scrubbed entry — image opacity 0→1 and scale 0.94→1 ride
        // an S-curve from progress 0.36 → 0.54 (270px runway) so the image
        // fades in and grows in lockstep with the scroll wheel instead of
        // playing a canned CSS transition the moment .is-full toggles.
        const entryK = easeInOutCubic(rampIn(p, 0.36, 0.54));
        canvasImg.style.setProperty("--img-opacity", String(entryK));
        canvasImg.style.setProperty("--img-scale", String(lerp(0.94, 1, entryK)));

        // Three discrete states — no more inline pill:
        //   pre-reveal (p < 0.42) → hidden
        //   full (0.42 < p < 0.68) → image fills full viewport
        //   split (p > 0.68) → image shrinks to LEFT HALF, hero copy
        //                     re-appears on right (Solution 2 style)
        const wantFull  = p > 0.42 && p < 0.68;
        const wantSplit = p > 0.68;
        const isFull  = canvasImg.classList.contains("is-full");
        const isSplit = canvasImg.classList.contains("is-split");

        if (wantSplit && !isSplit) {
          canvasImg.classList.remove("is-full");
          canvasImg.classList.add("is-split");
        } else if (wantFull && !isFull) {
          canvasImg.classList.remove("is-split");
          canvasImg.classList.add("is-full");
        } else if (p < 0.42) {
          canvasImg.classList.remove("is-full", "is-split");
        }
      }

      // Horizontal intro paragraphs — cascade in during 0.02 → 0.32 with
      // wide overlapping windows and an S-curve ease so each reveal feels
      // unhurried. All three exit together by 0.42 with a slight upward
      // lift (matches the title/eyebrow exit).
      const introOut = 1 - rampIn(p, 0.34, 0.42);
      const exitK = 1 - introOut;
      const paraTimings: [number, number][] = [
        [0.02, 0.16],
        [0.10, 0.24],
        [0.18, 0.32],
      ];
      introParas.forEach((el, i) => {
        const t = paraTimings[i] ?? [0, 0];
        const easedIn = easeInOutCubic(rampIn(p, t[0], t[1]));
        el.style.opacity = String(easedIn * introOut);
        el.style.transform = `translateY(${lerp(30, 0, easedIn) + lerp(0, -10, exitK)}px)`;
        el.style.visibility = preRevealHidden ? "hidden" : "visible";
      });

      // Hero (Solution pill + title + body + CTA) only appears in the
      // SPLIT state — right half of viewport with editorial layout,
      // alongside the shrunk mosaic image on the left. No centered
      // inline-pill state anymore.
      if (heroWrap) {
        const splitIn = rampIn(p, 0.72, 0.80);
        heroWrap.style.opacity = String(splitIn);
        heroWrap.style.pointerEvents = splitIn > 0.5 ? "auto" : "none";
        if (p > 0.72) heroWrap.classList.add("is-split");
        else if (p < 0.68) heroWrap.classList.remove("is-split");
      }
    };
    applyText(0);

    // No pill alignment needed — image goes hidden → full viewport →
    // left-half via CSS class toggles. Position/size is fully controlled
    // by .is-full / .is-split rules in globals.css.

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // gsap.context() with the section as scope. Anything created inside
    // (animations, ScrollTriggers) is tracked. ctx.revert() on unmount
    // cleans up ONLY the animations created here — never touches triggers
    // owned by Animations.tsx or any other section.
    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      stRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${SCROLL_DISTANCE_PX}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.0,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Camera stages remap: paragraphs run during scroll 0.00→0.55.
          // The canvas is visibility:hidden during that band (applyText
          // handles the gate) so any camera motion at low progress is
          // never seen. We start the camera at stage-3 (side view) so
          // when the canvas first becomes visible at 0.55, the model is
          // already at a compositionally-nice angle — then the camera
          // orbits around through stages 4 → 5 → 6 → 7 as the user
          // continues to scroll, giving that natural "model rotating on
          // scroll" feel from the earlier build.
          const rawT = Math.max(0, (self.progress - 0.55) / 0.45);
          progressRef.current = 0.32 + rawT * 0.68;
          applyText(self.progress);
        },
      });
    }, section);

    // Hide the site's custom cursor ring while the pointer is over this
    // section — the experience should feel cinematic, not like a 3D viewer.
    // Uses a body class so the CSS rule can target the cursor elements
    // (they're appended to <body> outside this component's DOM subtree).
    const onEnter = () => document.body.classList.add("saltech-cinematic-hover");
    const onLeave = () => document.body.classList.remove("saltech-cinematic-hover");
    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);

    return () => {
      ctx.revert();
      stRef.current = null;
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
      document.body.classList.remove("saltech-cinematic-hover");
    };
  }, []);

  // Called from SwitchModel once GLTF is loaded, centered and scaled.
  // Refresh ONLY our own trigger so measurements are correct — never touch
  // triggers owned by other components/sections.
  const handleModelReady = () => {
    requestAnimationFrame(() => {
      stRef.current?.refresh();
    });
  };

  const initialCam = KEYFRAMES.stage1_hero.pos;

  // When renderCanvas is false, skip the WebGL Canvas entirely (no 3D model
  // loaded, no GPU cost) but keep the useEffect above running — that's what
  // drives the section's pinned scroll timeline, paragraph reveals, and
  // canvas/rear-text fades. FeatureGrid renders a static mosaic image in
  // place of the model.
  if (!renderCanvas) return null;

  return (
    <>
      <Canvas
        className="saltech-cinematic-canvas"
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{
         position: [initialCam[0], initialCam[1], initialCam[2]],
         fov: 35,
         near: 0.1,
         far: 100
        }}
       shadows
       style={{ width: "100%", height: "100%" }}
      >
        {/* Studio 3-point lighting — KEY from upper-LEFT-front (viewer's left),
            FILL cool from opposite, RIM warm from directly behind.
            Grazing edge kickers reveal black-plastic curvature against the
            black environment without lifting mid-tones (which would make the
            white face plate blow out). */}
        <ambientLight intensity={0.10} />

        {/* KEY — soft warm, upper-LEFT-front */}
        <directionalLight
          position={[-4, 6, 5]}
          intensity={1.9}
          color="#fff1d8"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* FILL — cool, opposite side, keeps shadow side moody but readable */}
        <directionalLight position={[5, 2, 3.5]} intensity={0.7} color="#c9d9ff" />

        {/* RIM — cool white from directly behind. BOOSTED so the black
            housing silhouette reads clearly against the black environment. */}
        <directionalLight position={[0, 3, -6]} intensity={2.0} color="#e6ecff" />

        {/* Grazing edge kickers — near-horizontal, opposite sides.
            Reveal the curvature of the black plastic without lifting mid-tones. */}
        <directionalLight position={[ 6.5, 0.3, -1.5]} intensity={1.2} color="#ffd0a0" />
        <directionalLight position={[-6.5, 0.3, -1.5]} intensity={1.2} color="#b0c8ff" />

        <Suspense fallback={null}>
          <SwitchModel progressRef={progressRef} onReady={handleModelReady} />
          <RearAccentLight progressRef={progressRef} />
          {/* Soft contact shadow directly beneath the model — grounds it */}
          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.35}
            scale={5}
            blur={2.6}
            far={3.5}
            resolution={512}
            color="#000000"
          />
          {/* Reflections only — never a background */}
          <Environment preset="studio" background={false} environmentIntensity={0.55} />
        </Suspense>

        <CameraRig progressRef={progressRef} />
      </Canvas>
    </>
  );
}
