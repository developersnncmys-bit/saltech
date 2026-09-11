/**
 * GlobalBall — ONE persistent DOM element used for BOTH the reframe
 * mosaic-tile scene and the cycle marker/clock. Lives at document root
 * (position: fixed) so it can survive across sections without being
 * torn down and remounted.
 *
 * The reframe scene reveals a mosaic mimic tile: an amber-lit square
 * tile that, on CONTRACT, gains a metal mounting frame with grid
 * tickmarks (bezel), a P&ID process-symbol overlay (highlight), and a
 * tile-ID nameplate (mark) — showing that one tile is a single cell
 * of a much larger mosaic mimic panel. Directly reflects Saltech's
 * flagship Mosaic Mimic Systems product line.
 *
 * The bezel + highlight + mark keep their existing reframe__btn-*
 * class names so the Animations.tsx opacity selectors still work.
 */
export default function GlobalBall() {
  return (
    <div className="global-ball" aria-hidden="true">
      <div className="global-ball-orb">
        <svg
          className="reframe__button-svg"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Reframe-era amber tile gradient — default state. */}
            <linearGradient id="tile-amber" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF8072" />
              <stop offset="50%" stopColor="#FE3529" />
              <stop offset="100%" stopColor="#B01A12" />
            </linearGradient>
            {/* Clip path — used to constrain the mimic-panel photo to
                the tile's rounded-square footprint. */}
            <clipPath id="tile-clip">
              <rect x="18" y="18" width="164" height="164" rx="6" />
            </clipPath>
            {/* Cycle-era gradients — used by the color-flip CSS.
                Kept as radial gradients so the tile picks up an LED-glow
                feel when the class flips to green/amber/red. */}
            <radialGradient id="marker-cap-red" cx="34%" cy="26%" r="62%">
              <stop offset="0%" stopColor="#ff8b78" />
              <stop offset="10%" stopColor="#e0402c" />
              <stop offset="55%" stopColor="#c8291a" />
              <stop offset="100%" stopColor="#8a1810" />
            </radialGradient>
            <radialGradient id="marker-cap-green" cx="34%" cy="26%" r="62%">
              <stop offset="0%" stopColor="#8ce7ac" />
              <stop offset="10%" stopColor="#2fb56a" />
              <stop offset="55%" stopColor="#1e8a4e" />
              <stop offset="100%" stopColor="#0f5a30" />
            </radialGradient>
            <radialGradient id="marker-cap-amber" cx="34%" cy="26%" r="62%">
              <stop offset="0%" stopColor="#FF8072" />
              <stop offset="10%" stopColor="#FE3529" />
              <stop offset="55%" stopColor="#B01A12" />
              <stop offset="100%" stopColor="#5E0A05" />
            </radialGradient>
            <linearGradient id="bezel-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8e8e8" />
              <stop offset="50%" stopColor="#9a9a9a" />
              <stop offset="100%" stopColor="#3a3a3a" />
            </linearGradient>
          </defs>

          {/* BEZEL — fades in during CONTRACT phase only. Metal mounting
              frame around the tile, plus short grid tickmarks on all
              four sides that hint the tile is one cell in a much larger
              mosaic mimic panel. */}
          <g className="reframe__btn-bezel">
            {/* Outer metal frame */}
            <rect x="4" y="4" width="192" height="192" rx="10" fill="url(#bezel-metal)" />
            {/* Inner mounting recess */}
            <rect x="12" y="12" width="176" height="176" rx="7" fill="#1a1a1a" />
            {/* Grid tickmarks on each side — visual cue that neighbouring
                tiles continue beyond the frame */}
            <line x1="0" y1="100" x2="4" y2="100" stroke="#5a5a5a" strokeWidth="1.4" />
            <line x1="196" y1="100" x2="200" y2="100" stroke="#5a5a5a" strokeWidth="1.4" />
            <line x1="100" y1="0" x2="100" y2="4" stroke="#5a5a5a" strokeWidth="1.4" />
            <line x1="100" y1="196" x2="100" y2="200" stroke="#5a5a5a" strokeWidth="1.4" />
          </g>

          {/* Solid amber tile base — always visible. Becomes the wash on
              EXPAND. global-ball-cap-solid → color-flip target. */}
          <rect
            className="global-ball-cap-solid"
            x="18"
            y="18"
            width="164"
            height="164"
            rx="6"
            fill="#B01A12"
          />

          {/* Gradient overlay — always visible.
              global-ball-cap-gradient → color-flip target. Reduced
              opacity so the mimic-panel photo below shows through with
              a slight amber cast. */}
          <rect
            className="global-ball-cap-gradient"
            x="18"
            y="18"
            width="164"
            height="164"
            rx="6"
            fill="url(#tile-amber)"
            opacity="0.55"
          />

          {/* Real mosaic mimic panel photo — clipped to the tile shape.
              Fetched from the live Saltech control-room page so the
              tile face reads as an actual industrial mimic panel
              rather than a stylised graphic. If this URL ever 404s,
              the amber base + gradient above remain fully visible so
              the tile still looks like a lit LED tile. */}
          <image
            href="https://saltech.ltd/wp-content/uploads/2026/02/ChatGPT-Image-Feb-8-2026-01_31_15-PM-1024x683.png"
            x="18"
            y="18"
            width="164"
            height="164"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#tile-clip)"
            opacity="0.85"
          />

          {/* HIGHLIGHT — fades in second (0.36). Diagonal specular
              gloss over the tile face, giving the mimic-panel photo a
              lit-plastic sheen when the CONTRACT phase reveals the
              tile as a physical, illuminated object. Clipped to the
              tile so the gloss doesn't spill past the tile edges. */}
          <g
            className="reframe__btn-highlight"
            opacity="0"
            clipPath="url(#tile-clip)"
          >
            <polygon
              points="18,18 90,18 18,90"
              fill="#ffffff"
              opacity="0.28"
            />
            <polygon
              points="18,18 60,18 18,60"
              fill="#ffffff"
              opacity="0.22"
            />
          </g>

          {/* MARK — fades in last (0.38). Tile-ID nameplate at the
              bottom of the tile: a small dark strip with an engineering
              tag identifier. Alludes to the plant-tag conventions used
              on real mosaic mimic panels. */}
          <g className="reframe__btn-mark" opacity="0">
            <rect
              x="66"
              y="158"
              width="68"
              height="18"
              rx="2"
              fill="#2a1808"
              opacity="0.92"
            />
            <text
              x="100"
              y="171"
              textAnchor="middle"
              fill="#FF8072"
              fontSize="11"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight="700"
              letterSpacing="0.14em"
            >
              M-01
            </text>
          </g>
        </svg>
      </div>
      <span className="global-ball-time" data-current-time="06:00">
        06:00
      </span>
    </div>
  );
}
