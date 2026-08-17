import { cn } from "@/lib/cn";

/**
 * Light UI-mockup stand-in for a project thumbnail, so the work grid reads
 * the way the reference does before any real screenshots are uploaded.
 *
 * Everything is drawn from the brand palette — ink teal for structure, warm
 * sand for the accent — so a placeholder row still looks like one system.
 * Three body layouts keep the four-up grid from looking like one tile
 * repeated.
 */
const palettes = [
  { accent: "#053D3A", wash: "#FFE2B8" },
  { accent: "#0A5450", wash: "#F0C177" },
  { accent: "#1F6D68", wash: "#FFE2B8" },
  { accent: "#053D3A", wash: "#F5D9A8" },
] as const;

const bars = [38, 62, 30, 78, 52, 88, 44];

/**
 * Wide stand-in for a project page banner. The card placeholder is drawn at
 * 4:3 and would have to be sliced to fill a 2:1 banner, which magnifies its
 * UI furniture into abstract blobs. This is drawn for the shape it occupies:
 * a quiet plotted series on a chart canvas, which reads as deliberate rather
 * than as a broken screenshot.
 */
export function BannerPlaceholder({
  index,
  title,
  className,
}: {
  index: number;
  title: string;
  className?: string;
}) {
  const { accent, wash } = palettes[index % palettes.length];

  // A different but deterministic series per project.
  const points = Array.from({ length: 9 }, (_, i) => {
    const wave = Math.sin((i + index * 1.7) * 0.9) * 0.5 + 0.5;
    const drift = i / 8;
    return {
      x: 90 + i * 128,
      y: Math.round(470 - (wave * 0.55 + drift * 0.35) * 300),
    };
  });

  const line = points.map((p) => `${p.x} ${p.y}`).join(" L ");

  return (
    <svg
      viewBox="0 0 1200 600"
      className={cn("block h-full w-full", className)}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="1200" height="600" fill="#FDF7EE" />

      {/* Header row — without it the top quarter of the canvas reads as
          dead space rather than as a chart with a title above it. */}
      <g fill="#E4D8C6">
        <rect x="90" y="58" width="240" height="14" rx="7" />
        <rect x="90" y="86" width="150" height="10" rx="5" />
      </g>
      <g>
        <rect x="930" y="60" width="52" height="12" rx="6" fill={accent} opacity="0.75" />
        <rect x="994" y="60" width="52" height="12" rx="6" fill={wash} />
        <rect x="1058" y="60" width="56" height="12" rx="6" fill="#E4D8C6" />
      </g>

      {/* Chart canvas */}
      <g stroke="#E4D8C6" strokeWidth="1">
        {[130, 215, 300, 385, 470].map((y) => (
          <line key={y} x1="90" y1={y} x2="1114" y2={y} />
        ))}
        {points.map((p) => (
          <line key={p.x} x1={p.x} y1="120" x2={p.x} y2="470" opacity="0.55" />
        ))}
      </g>

      {/* Axis */}
      <line x1="90" y1="470" x2="1114" y2="470" stroke="#CBBCA4" strokeWidth="1.5" />

      {/* Area under the series */}
      <path
        d={`M ${line} L 1114 470 L 90 470 Z`}
        fill={wash}
        opacity="0.35"
      />
      <path d={`M ${line}`} fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p) => (
        <circle key={p.x} cx={p.x} cy={p.y} r="5" fill="#FDF7EE" stroke={accent} strokeWidth="2.5" />
      ))}
    </svg>
  );
}

export function ProjectPlaceholder({
  index,
  title,
  className,
}: {
  index: number;
  title: string;
  className?: string;
}) {
  const { accent, wash } = palettes[index % palettes.length];
  const layout = index % 3;

  return (
    <svg
      viewBox="0 0 400 300"
      className={cn("block h-full w-full", className)}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="300" fill="#F5EDE0" />
      <rect width="400" height="30" fill="#FDF7EE" />
      <circle cx="19" cy="15" r="4" fill={accent} />
      <g fill="#CBBCA4">
        <rect x="248" y="12" width="26" height="6" rx="3" />
        <rect x="284" y="12" width="26" height="6" rx="3" />
        <rect x="320" y="12" width="26" height="6" rx="3" />
      </g>
      <rect x="356" y="8" width="32" height="14" rx="7" fill={wash} />

      {layout === 0 ? (
        /* Dashboard: KPI bars beside a donut */
        <>
          <rect x="16" y="46" width="182" height="238" rx="4" fill="#FDF7EE" />
          <g fill="#E4D8C6">
            <rect x="30" y="62" width="96" height="8" rx="4" />
            <rect x="30" y="78" width="68" height="8" rx="4" />
          </g>
          {bars.map((h, i) => (
            <rect
              key={i}
              x={30 + i * 23}
              y={262 - h}
              width="13"
              height={h}
              rx="2"
              fill={accent}
              opacity={0.35 + i * 0.09}
            />
          ))}

          <rect x="210" y="46" width="174" height="238" rx="4" fill="#FDF7EE" />
          <circle cx="272" cy="122" r="42" fill="none" stroke="#E4D8C6" strokeWidth="15" />
          <circle
            cx="272"
            cy="122"
            r="42"
            fill="none"
            stroke={accent}
            strokeWidth="15"
            strokeDasharray={`${132 + index * 16} 400`}
            strokeLinecap="round"
            transform="rotate(-90 272 122)"
          />
          <g fill="#E4D8C6">
            <rect x="228" y="196" width="138" height="8" rx="4" />
            <rect x="228" y="214" width="110" height="8" rx="4" />
            <rect x="228" y="232" width="78" height="8" rx="4" />
          </g>
          <circle cx="350" cy="122" r="13" fill={wash} />
        </>
      ) : layout === 1 ? (
        /* Report page: headline block beside a hero shape */
        <>
          <g fill="#CBBCA4">
            <rect x="24" y="72" width="150" height="13" rx="6" />
            <rect x="24" y="94" width="118" height="13" rx="6" />
          </g>
          <g fill="#E4D8C6">
            <rect x="24" y="124" width="160" height="7" rx="3" />
            <rect x="24" y="138" width="132" height="7" rx="3" />
            <rect x="24" y="152" width="146" height="7" rx="3" />
          </g>
          <rect x="24" y="176" width="72" height="20" rx="10" fill={accent} />
          <rect x="104" y="176" width="52" height="20" rx="10" fill="#E4D8C6" />

          <rect x="216" y="46" width="168" height="238" rx="4" fill="#FDF7EE" />
          <circle cx="300" cy="140" r="62" fill={accent} />
          <circle cx="344" cy="88" r="22" fill={wash} />
          <rect x="232" y="228" width="90" height="8" rx="4" fill="#E4D8C6" />
          <rect x="232" y="246" width="60" height="8" rx="4" fill="#EDE3D2" />
        </>
      ) : (
        /* Data table / registry view */
        <>
          <rect x="16" y="46" width="368" height="238" rx="4" fill="#FDF7EE" />
          <rect x="30" y="62" width="104" height="10" rx="5" fill="#CBBCA4" />
          <rect x="314" y="60" width="56" height="16" rx="8" fill={accent} />
          <rect x="30" y="90" width="340" height="1" fill="#E4D8C6" />
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <g key={row}>
              <circle cx="40" cy={112 + row * 28} r="6" fill={accent} opacity={0.28 + row * 0.12} />
              <rect
                x="56"
                y={108 + row * 28}
                width={150 - row * 14}
                height="8"
                rx="4"
                fill="#E4D8C6"
              />
              <rect x="232" y={108 + row * 28} width="62" height="8" rx="4" fill="#EDE3D2" />
              <rect
                x="312"
                y={106 + row * 28}
                width={46 - row * 4}
                height="12"
                rx="6"
                fill={wash}
                opacity={0.5 + row * 0.1}
              />
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
