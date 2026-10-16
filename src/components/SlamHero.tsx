const DEPTH = 16;

function Extrusion({ href, color }: { href: string; color: string }) {
  return (
    <>
      {Array.from({ length: DEPTH }, (_, i) => i + 1).map((i) => (
        <use
          key={i}
          href={href}
          stroke={color}
          transform={`translate(${i * 0.8} ${i * 1.5})`}
        />
      ))}
    </>
  );
}

export function SlamHero() {
  return (
    <div className="flex h-[390px] items-center justify-center [perspective:900px]">
      <div className="[transform-style:preserve-3d] [transform:rotateX(24deg)_rotateZ(-8deg)]">
        <svg
          width="342"
          height="380"
          viewBox="0 0 342 380"
          role="img"
          aria-label="X and O slammed together"
        >
          <defs>
            <linearGradient
              id="o-face"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="140"
              x2="0"
              y2="340"
            >
              <stop offset="0" stopColor="#f8bf5a" />
              <stop offset="1" stopColor="#ee7a3a" />
            </linearGradient>
            <filter id="soft-blur">
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <g id="x-shape" fill="none" strokeWidth="58" strokeLinecap="round">
              <path d="M62 52L186 196M186 52L62 196" />
            </g>
            <g id="o-shape" fill="none" strokeWidth="54">
              <circle cx="212" cy="236" r="86" />
            </g>
          </defs>

          {/* The floor: contact shadow, impact rings, cracks */}
          <ellipse
            cx="190"
            cy="330"
            rx="150"
            ry="34"
            fill="#000"
            opacity=".55"
            filter="url(#soft-blur)"
          />
          <ellipse
            cx="190"
            cy="318"
            rx="165"
            ry="44"
            fill="none"
            stroke="#ee7a3a"
            strokeWidth="2"
            opacity=".35"
          />
          <ellipse
            cx="190"
            cy="318"
            rx="140"
            ry="34"
            fill="none"
            stroke="#f8bf5a"
            strokeWidth="1.5"
            opacity=".25"
          />
          <g
            stroke="#fcf5e8"
            strokeWidth="3"
            strokeLinecap="round"
            opacity=".35"
          >
            <path d="M20 300L48 292M30 340L58 330M330 296L304 292M322 346L296 336M170 372L172 356" />
          </g>

          {/* Back to front: X slab, X face, O slab, O face */}
          <Extrusion href="#x-shape" color="#8f7a5a" />
          <use href="#x-shape" stroke="#fcf5e8" />
          <Extrusion href="#o-shape" color="#a8481b" />
          <use href="#o-shape" stroke="url(#o-face)" />

          {/* Debris */}
          <g fill="#f8bf5a" opacity=".8">
            <rect
              x="298"
              y="150"
              width="9"
              height="9"
              rx="2"
              transform="rotate(20 302 154)"
            />
            <rect x="28" y="236" width="7" height="7" rx="2" />
            <rect x="316" y="96" width="6" height="6" rx="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}
