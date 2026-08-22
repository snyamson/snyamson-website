/**
 * Draws the artwork for the AIP case study and writes it to public/work/.
 *
 *   node scripts/make-project-art.mts
 *
 * The source screenshots of the real system cannot be published: every list
 * in them is farmer names, dates of birth, farmer IDs and communities. So
 * this redraws the *shape* of the system instead — a register, the crop mix
 * it tracks, and the plot boundaries it maps — with every value rendered as
 * a bar. There is nothing to redact because there is nothing to read.
 *
 * It is a generator rather than two exported files so the images stay in the
 * palette: the tokens below are the same ones in globals.css, and re-running
 * this is how you change them. It also means the art can be re-rendered at a
 * different size without anyone opening a drawing program.
 *
 * No text anywhere. Rasterisers do not agree on which fonts they have, and a
 * headline that silently falls back to Times would undo the whole thing.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

/* The palette, straight from @theme in globals.css. */
const BG = "#FDF7EE";
const SURFACE = "#F5EDE0";
const CARD = "#FFFFFF";
const BORDER = "#E4D8C6";
const BORDER_STRONG = "#CBBCA4";
const INK = "#053D3A";
const INK_2 = "#0A5450";
const SAND = "#FFE2B8";
const SAND_DEEP = "#F0C177";

type Box = { x: number; y: number; w: number; h: number };
type Point = [number, number];

/** Plot boundaries in 0–1 space, so one set of shapes fits any panel. */
const PLOTS: Point[][] = [
  [
    [0.09, 0.11],
    [0.42, 0.07],
    [0.46, 0.29],
    [0.13, 0.34],
  ],
  [
    [0.51, 0.09],
    [0.88, 0.13],
    [0.83, 0.35],
    [0.51, 0.31],
  ],
  [
    [0.07, 0.4],
    [0.41, 0.37],
    [0.45, 0.62],
    [0.11, 0.66],
  ],
  [
    [0.49, 0.39],
    [0.91, 0.43],
    [0.86, 0.61],
    [0.5, 0.58],
  ],
  [
    [0.13, 0.72],
    [0.52, 0.7],
    [0.57, 0.9],
    [0.17, 0.93],
  ],
  [
    [0.61, 0.67],
    [0.92, 0.69],
    [0.89, 0.89],
    [0.63, 0.91],
  ],
];

/** The one plot drawn as surveyed — filled, with its corner points shown. */
const SURVEYED = 2;

/** The crop mix the programme monitors: plantain, rice, cassava, groundnut, potato. */
const CROPS = [
  { share: 0.32, fill: INK },
  { share: 0.24, fill: INK_2 },
  { share: 0.18, fill: SAND_DEEP },
  { share: 0.15, fill: SAND },
  { share: 0.11, fill: BORDER_STRONG },
];

/**
 * The six codes the AGRA transcripts were grouped under: bureaucratic delay,
 * cost, awareness, gender, accessibility, compliance pressure. Weight is how
 * often each came up, which drives node size and bar length.
 */
const THEMES = [
  { weight: 1, fill: INK },
  { weight: 0.84, fill: INK_2 },
  { weight: 0.68, fill: SAND_DEEP },
  { weight: 0.55, fill: SAND },
  { weight: 0.44, fill: BORDER_STRONG },
  { weight: 0.34, fill: INK_2 },
];

const round = (n: number) => Math.round(n * 100) / 100;

function place(box: Box, [nx, ny]: Point): Point {
  return [round(box.x + nx * box.w), round(box.y + ny * box.h)];
}

function polygon(box: Box, points: Point[]): string {
  return points.map((p) => place(box, p).join(",")).join(" ");
}

/** Average of a polygon's corners — close enough to a centre for a marker. */
function centroid(box: Box, points: Point[]): Point {
  const sum = points.reduce<Point>(
    (acc, [x, y]) => [acc[0] + x, acc[1] + y],
    [0, 0],
  );
  return place(box, [sum[0] / points.length, sum[1] / points.length]);
}

function panel(box: Box, fill = CARD, radius = 10): string {
  return `<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="${radius}" fill="${fill}" stroke="${BORDER}" stroke-width="2"/>`;
}

function bar(x: number, y: number, w: number, h: number, fill: string, opacity = 1) {
  return `<rect x="${round(x)}" y="${round(y)}" width="${round(w)}" height="${h}" rx="${h / 2}" fill="${fill}"${opacity === 1 ? "" : ` opacity="${opacity}"`}/>`;
}

/**
 * The farmer register. Column headers are bars and so is every value — this
 * is the panel the real screenshot could never be used for.
 */
function register(box: Box, rows: number): string {
  const pad = 24;
  const left = box.x + pad;
  const right = box.x + box.w - pad;
  const width = right - left;
  const headerY = box.y + 30;
  const bodyTop = headerY + 30;
  const rowH = (box.y + box.h - pad - bodyTop) / rows;

  const columns = [0, 0.28, 0.52, 0.74].map((f) => left + f * width);

  const head = [0.15, 0.13, 0.11, 0.1]
    .map((f, i) => bar(columns[i], headerY, f * width, 9, BORDER_STRONG))
    .join("");

  const body = Array.from({ length: rows }, (_, i) => {
    const cy = bodyTop + i * rowH + rowH / 2;
    const rule =
      i > 0
        ? `<line x1="${left}" y1="${round(bodyTop + i * rowH)}" x2="${right}" y2="${round(bodyTop + i * rowH)}" stroke="${BORDER}" stroke-width="1"/>`
        : "";
    return [
      rule,
      `<circle cx="${round(columns[0] + 10)}" cy="${round(cy)}" r="10" fill="${INK}" opacity="${round(0.2 + i * 0.12)}"/>`,
      bar(columns[0] + 28, cy - 5, (0.16 - i * 0.008) * width, 10, BORDER),
      bar(columns[1], cy - 5, (0.16 - i * 0.01) * width, 10, BORDER),
      bar(columns[2], cy - 5, (0.13 - i * 0.006) * width, 10, SURFACE),
      `<rect x="${round(columns[3])}" y="${round(cy - 9)}" width="${round((0.14 - i * 0.004) * width)}" height="18" rx="9" fill="${SAND}" opacity="${round(0.55 + i * 0.07)}"/>`,
    ].join("");
  }).join("");

  return [
    panel(box),
    head,
    `<line x1="${left}" y1="${round(headerY + 22)}" x2="${right}" y2="${round(headerY + 22)}" stroke="${BORDER}" stroke-width="1.5"/>`,
    body,
  ].join("");
}

/** Crop mix, as a ring with a legend beside it. */
function cropMix(box: Box): string {
  const r = Math.min(box.h * 0.34, box.w * 0.24);
  const cx = box.x + box.w * 0.28;
  const cy = box.y + box.h / 2;
  const circumference = 2 * Math.PI * r;
  const stroke = r * 0.44;

  let offset = 0;
  const ring = CROPS.map(({ share, fill }) => {
    const length = share * circumference;
    const segment = `<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(r)}" fill="none" stroke="${fill}" stroke-width="${round(stroke)}" stroke-dasharray="${round(length - 3)} ${round(circumference)}" transform="rotate(${round(offset * 360 - 90)} ${round(cx)} ${round(cy)})"/>`;
    offset += share;
    return segment;
  }).join("");

  const legendX = box.x + box.w * 0.54;
  const legendTop = cy - (CROPS.length * 30) / 2 + 6;
  const legend = CROPS.map(({ fill }, i) => {
    const y = legendTop + i * 30;
    return [
      `<rect x="${round(legendX)}" y="${round(y - 8)}" width="16" height="16" rx="4" fill="${fill}"/>`,
      bar(legendX + 26, y - 4.5, box.w * (0.26 - i * 0.02), 9, BORDER),
    ].join("");
  }).join("");

  return [panel(box), ring, legend].join("");
}

/**
 * The plot map: boundaries over a grid, one plot shown as surveyed with its
 * corner points, and markers on two others.
 */
function plotMap(box: Box, id: string): string {
  const step = Math.round(box.w / 7);
  const grid: string[] = [];
  for (let x = box.x + step; x < box.x + box.w; x += step) {
    grid.push(
      `<line x1="${x}" y1="${box.y}" x2="${x}" y2="${box.y + box.h}" stroke="${BORDER}" stroke-width="1"/>`,
    );
  }
  for (let y = box.y + step; y < box.y + box.h; y += step) {
    grid.push(
      `<line x1="${box.x}" y1="${y}" x2="${box.x + box.w}" y2="${y}" stroke="${BORDER}" stroke-width="1"/>`,
    );
  }

  const shapes = PLOTS.map((points, i) => {
    const surveyed = i === SURVEYED;
    return `<polygon points="${polygon(box, points)}" fill="${surveyed ? SAND_DEEP : SAND}" fill-opacity="${surveyed ? 0.75 : 0.4}" stroke="${INK}" stroke-width="${surveyed ? 3.5 : 2}" stroke-linejoin="round"/>`;
  }).join("");

  const vertices = PLOTS[SURVEYED].map((p) => {
    const [x, y] = place(box, p);
    return `<circle cx="${x}" cy="${y}" r="6" fill="${BG}" stroke="${INK}" stroke-width="3"/>`;
  }).join("");

  // The enrolled area, drawn loose around the plots so it reads as a claim
  // over the land rather than as another field.
  const outline = `<path d="M ${polygon(box, [
    [0.03, 0.05],
    [0.97, 0.05],
    [0.97, 0.96],
    [0.03, 0.96],
  ])
    .split(" ")
    .join(" L ")} Z" fill="none" stroke="${BORDER_STRONG}" stroke-width="2" stroke-dasharray="10 9"/>`;

  const pins = [0, 5]
    .map((i) => {
      const [x, y] = centroid(box, PLOTS[i]);
      const tip = round(y + 13);
      return `<g><path d="M ${x} ${tip} c -7,-11 -11,-15 -11,-21 a 11,11 0 1,1 22,0 c 0,6 -4,10 -11,21 z" fill="${INK}"/><circle cx="${x}" cy="${round(tip - 24)}" r="4.2" fill="${BG}"/></g>`;
    })
    .join("");

  return [
    `<clipPath id="${id}"><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="10"/></clipPath>`,
    panel(box, SURFACE),
    `<g clip-path="url(#${id})">${grid.join("")}${outline}${shapes}${vertices}${pins}</g>`,
  ].join("");
}

/**
 * Progress against target, one track per crop. Reads as the question the
 * programme actually asks — how much of the displaced production has been
 * put back — without putting a number on it.
 */
function progressRows(box: Box, series = CROPS): string {
  const pad = 26;
  const left = box.x + pad;
  const width = box.w - pad * 2;
  const rows = series.length;
  const gap = (box.h - pad * 2) / rows;

  const tracks = series.map(({ fill }, i) => {
    const y = box.y + pad + gap * i + gap / 2;
    const labelW = width * 0.2;
    const trackX = left + labelW + 18;
    const trackW = width - labelW - 18;
    // Longest track first, so the column reads top-down like a ranking.
    const filled = trackW * (0.9 - i * 0.13);
    return [
      bar(left, y - 5, labelW * (0.9 - i * 0.06), 10, BORDER_STRONG),
      `<rect x="${round(trackX)}" y="${round(y - 9)}" width="${round(trackW)}" height="18" rx="9" fill="${SURFACE}"/>`,
      `<rect x="${round(trackX)}" y="${round(y - 9)}" width="${round(filled)}" height="18" rx="9" fill="${fill}"/>`,
    ].join("");
  }).join("");

  return [panel(box), tracks].join("");
}

/** Input distribution, as a column chart. */
function inputBars(box: Box): string {
  const pad = 24;
  const baseline = box.y + box.h - pad - 6;
  const top = box.y + pad + 8;
  const heights = [0.42, 0.66, 0.34, 0.88, 0.56, 0.74, 0.48];
  const slot = (box.w - pad * 2) / heights.length;
  const width = slot * 0.5;

  const columns = heights
    .map((f, i) => {
      const h = (baseline - top) * f;
      const x = box.x + pad + i * slot + (slot - width) / 2;
      return `<rect x="${round(x)}" y="${round(baseline - h)}" width="${round(width)}" height="${round(h)}" rx="4" fill="${INK}" opacity="${round(0.32 + i * 0.09)}"/>`;
    })
    .join("");

  return [
    panel(box),
    columns,
    `<line x1="${box.x + pad}" y1="${round(baseline)}" x2="${box.x + box.w - pad}" y2="${round(baseline)}" stroke="${BORDER_STRONG}" stroke-width="1.5"/>`,
  ].join("");
}

/* ------------------------------------------------------------------ *
 * Panels for the rice policy dialogues
 *
 * The picture here is a decision, not a dataset: every issue scored the same
 * way, plotted against what it would take to fix, and a room that narrows
 * from everyone with a view to the few who can act.
 * ------------------------------------------------------------------ */

/**
 * Impact against feasibility. The shaded corner is where an issue is both
 * worth doing and doable — which is the whole point of scoring them.
 */
function impactFeasibility(box: Box): string {
  const pad = 34;
  const plot: Box = {
    x: box.x + pad + 14,
    y: box.y + pad,
    w: box.w - pad * 2 - 14,
    h: box.h - pad * 2 - 14,
  };

  const unit = Math.min(plot.w, plot.h);

  // x = feasibility, y = impact, r = how many actors it touches. Spread
  // across all four quadrants: a prioritisation picture that only shows the
  // winners is not showing a prioritisation.
  const issues: { at: Point; size: number }[] = [
    { at: [0.78, 0.85], size: 0.075 },
    { at: [0.62, 0.7], size: 0.058 },
    { at: [0.88, 0.6], size: 0.05 },
    { at: [0.22, 0.82], size: 0.066 },
    { at: [0.36, 0.63], size: 0.045 },
    { at: [0.11, 0.55], size: 0.052 },
    { at: [0.5, 0.47], size: 0.04 },
    { at: [0.71, 0.3], size: 0.046 },
    { at: [0.87, 0.17], size: 0.038 },
    { at: [0.29, 0.22], size: 0.043 },
    { at: [0.46, 0.33], size: 0.035 },
  ];

  const grid = [0.25, 0.5, 0.75]
    .flatMap((f) => [
      `<line x1="${round(plot.x + plot.w * f)}" y1="${round(plot.y)}" x2="${round(plot.x + plot.w * f)}" y2="${round(plot.y + plot.h)}" stroke="${BORDER}" stroke-width="1"/>`,
      `<line x1="${round(plot.x)}" y1="${round(plot.y + plot.h * f)}" x2="${round(plot.x + plot.w)}" y2="${round(plot.y + plot.h * f)}" stroke="${BORDER}" stroke-width="1"/>`,
    ])
    .join("");

  const dots = issues
    .map(({ at, size }) => {
      // Normalised y is impact, so it has to be flipped into screen space.
      const [x, y] = place(plot, [at[0], 1 - at[1]]);
      const priority = at[0] >= 0.5 && at[1] >= 0.5;
      const strategic = at[0] < 0.5 && at[1] >= 0.5;
      const fill = priority ? INK : strategic ? SAND_DEEP : BORDER_STRONG;
      return `<circle cx="${x}" cy="${y}" r="${round(unit * size)}" fill="${fill}" stroke="${BG}" stroke-width="2.5"/>`;
    })
    .join("");

  return [
    panel(box),
    // Exactly the top-right quadrant, so it lands on the gridlines rather
    // than floating near them.
    `<rect x="${round(plot.x + plot.w * 0.5)}" y="${round(plot.y)}" width="${round(plot.w * 0.5)}" height="${round(plot.h * 0.5)}" fill="${SAND}" opacity="0.45"/>`,
    grid,
    `<path d="M ${round(plot.x)} ${round(plot.y)} V ${round(plot.y + plot.h)} H ${round(plot.x + plot.w)}" fill="none" stroke="${BORDER_STRONG}" stroke-width="2"/>`,
    dots,
  ].join("");
}

/** The room narrowing: everyone with a view, down to the few who can act. */
function engagementFunnel(box: Box): string {
  const pad = 30;
  const layers = [
    { width: 1, people: 11, fill: SAND },
    { width: 0.78, people: 7, fill: SAND_DEEP },
    { width: 0.56, people: 5, fill: INK_2 },
    { width: 0.34, people: 3, fill: INK },
  ];
  const usable = box.w - pad * 2;
  const gap = (box.h - pad * 2) / layers.length;
  const height = round(Math.min(gap * 0.62, 58));

  const bands = layers
    .map((layer, i) => {
      const w = round(usable * layer.width);
      const x = round(box.x + pad + (usable - w) / 2);
      const y = round(box.y + pad + gap * i + (gap - height) / 2);

      const spacing = w / (layer.people + 1);
      const dots = Array.from(
        { length: layer.people },
        (_, n) =>
          `<circle cx="${round(x + spacing * (n + 1))}" cy="${round(y + height / 2)}" r="5" fill="${i >= 2 ? SAND : INK}" opacity="${i >= 2 ? 1 : 0.7}"/>`,
      ).join("");

      return `<rect x="${x}" y="${y}" width="${w}" height="${height}" rx="${round(height / 2)}" fill="${layer.fill}"/>${dots}`;
    })
    .join("");

  return [panel(box), bands].join("");
}

/** One row per criterion, scored the same way for every issue. */
function criteriaRows(box: Box, rows: number): string {
  const pad = 28;
  const left = box.x + pad;
  const width = box.w - pad * 2;
  const gap = (box.h - pad * 2) / rows;
  const pips = 5;

  const scores = [5, 4, 5, 3, 4, 2, 3];

  const items = Array.from({ length: rows }, (_, i) => {
    const y = box.y + pad + gap * i + gap / 2;
    const labelW = width * 0.44;
    const pipGap = (width - labelW - 10) / pips;
    const filled = scores[i % scores.length];

    const dots = Array.from({ length: pips }, (_, n) => {
      const cx = left + labelW + 10 + pipGap * n + pipGap / 2;
      return n < filled
        ? `<circle cx="${round(cx)}" cy="${round(y)}" r="7" fill="${INK}"/>`
        : `<circle cx="${round(cx)}" cy="${round(y)}" r="7" fill="none" stroke="${BORDER_STRONG}" stroke-width="2"/>`;
    }).join("");

    return [bar(left, y - 4.5, labelW * (0.92 - (i % 4) * 0.08), 9, BORDER), dots].join("");
  }).join("");

  return [panel(box), items].join("");
}

/* ------------------------------------------------------------------ *
 * Panels for the rainfed water study
 *
 * Field operations rather than a system or an analysis: who collected what,
 * where, and whether it cleared the quality bar. Everything here is fixed
 * rather than random, so re-running the generator produces the same bytes.
 * ------------------------------------------------------------------ */

/**
 * An intensity ramp made of real tokens rather than one token fading out.
 * Ink at partial opacity over white turns grey-blue, which is the one thing
 * this palette has no room for — the steps have to stay warm the whole way
 * down, so they step through sand into ink instead of dissolving.
 */
const RAMP = [SAND, SAND_DEEP, INK_2, INK];

/** Days across, enumerators down. One square per survey day. */
function collectionMatrix(box: Box, cols: number, rows: number): string {
  const pad = 26;
  const cellW = (box.w - pad * 2) / cols;
  const cellH = (box.h - pad * 2) / rows;
  const size = round(Math.min(cellW, cellH) * 0.68);

  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = box.x + pad + col * cellW + (cellW - size) / 2;
    const y = box.y + pad + row * cellH + (cellH - size) / 2;

    // Deterministic, so re-running the generator produces the same bytes.
    // One cell is left unfilled: a day that produced nothing is part of what
    // a collection tracker is for.
    const seed = (col * 7 + row * 3) % 11;
    const missing = seed === 4;
    const fill = missing ? BORDER : RAMP[seed % RAMP.length];

    return `<rect x="${round(x)}" y="${round(y)}" width="${size}" height="${size}" rx="${round(size * 0.28)}" fill="${fill}"/>`;
  }).join("");

  return [panel(box), cells].join("");
}

/** Households collected per community, against the sample target. */
function sampleColumns(box: Box): string {
  const pad = 28;
  const baseline = box.y + box.h - pad - 4;
  const top = box.y + pad + 10;
  const span = baseline - top;
  const shares = [0.88, 0.93, 0.9, 0.97, 0.9];
  const target = 0.85;

  const slot = (box.w - pad * 2) / shares.length;
  const width = round(slot * 0.46);

  const columns = shares
    .map((share, i) => {
      const x = box.x + pad + i * slot + (slot - width) / 2;
      void i;
      const h = round(span * share);
      return [
        `<rect x="${round(x)}" y="${round(top)}" width="${width}" height="${round(span)}" rx="${round(width / 2)}" fill="${SURFACE}"/>`,
        `<rect x="${round(x)}" y="${round(baseline - h)}" width="${width}" height="${h}" rx="${round(width / 2)}" fill="${INK}"/>`,
      ].join("");
    })
    .join("");

  const targetY = round(baseline - span * target);

  return [
    panel(box),
    columns,
    `<line x1="${round(box.x + pad - 6)}" y1="${targetY}" x2="${round(box.x + box.w - pad + 6)}" y2="${targetY}" stroke="${SAND_DEEP}" stroke-width="2.5" stroke-dasharray="9 7"/>`,
    `<line x1="${round(box.x + pad)}" y1="${round(baseline)}" x2="${round(box.x + box.w - pad)}" y2="${round(baseline)}" stroke="${BORDER_STRONG}" stroke-width="1.5"/>`,
  ].join("");
}

/** The watershed, its river, and the five communities sampled inside it. */
function catchment(box: Box, id: string): string {
  const outline: Point[] = [
    [0.12, 0.17],
    [0.35, 0.07],
    [0.63, 0.1],
    [0.87, 0.24],
    [0.93, 0.48],
    [0.84, 0.75],
    [0.61, 0.91],
    [0.35, 0.93],
    [0.15, 0.79],
    [0.06, 0.5],
  ];

  const river: Point[] = [
    [0.22, 0.1],
    [0.33, 0.33],
    [0.45, 0.45],
    [0.53, 0.66],
    [0.68, 0.83],
  ];
  const branch: Point[] = [
    [0.78, 0.28],
    [0.6, 0.42],
    [0.45, 0.45],
  ];

  const communities: Point[] = [
    [0.28, 0.28],
    [0.66, 0.24],
    [0.74, 0.6],
    [0.42, 0.72],
    [0.2, 0.58],
  ];

  // Fixed offsets, so a community's households land in the same place on
  // every run rather than jittering with the random seed of the day.
  const spread: Point[] = [
    [-0.05, -0.04],
    [0.05, -0.03],
    [-0.06, 0.03],
    [0.04, 0.05],
    [-0.02, -0.07],
    [0.07, 0.02],
  ];

  const line = (points: Point[], width: number) =>
    `<polyline points="${polygon(box, points)}" fill="none" stroke="${INK_2}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;

  const clusters = communities
    .map((centre, i) => {
      const dots = spread
        .map(([dx, dy]) => {
          const [x, y] = place(box, [centre[0] + dx, centre[1] + dy]);
          return `<circle cx="${x}" cy="${y}" r="4.5" fill="${BORDER_STRONG}"/>`;
        })
        .join("");
      const [cx, cy] = place(box, centre);
      const lead = i === 3;
      return `${dots}<circle cx="${cx}" cy="${cy}" r="${lead ? 11 : 9}" fill="${lead ? SAND_DEEP : INK}" stroke="${BG}" stroke-width="3"/>`;
    })
    .join("");

  return [
    `<clipPath id="${id}"><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="10"/></clipPath>`,
    panel(box, SURFACE),
    `<g clip-path="url(#${id})">`,
    `<polygon points="${polygon(box, outline)}" fill="${BG}" stroke="${BORDER_STRONG}" stroke-width="2.5"/>`,
    line(river, 4),
    line(branch, 2.5),
    clusters,
    `</g>`,
  ].join("");
}

/** The data quality checks, most passed and one still open. */
function checklist(box: Box, rows: number): string {
  const pad = 26;
  const left = box.x + pad;
  const gap = (box.h - pad * 2) / rows;

  const items = Array.from({ length: rows }, (_, i) => {
    const y = box.y + pad + gap * i + gap / 2;
    const done = i < rows - 1;
    const mark = done
      ? `<rect x="${round(left)}" y="${round(y - 9)}" width="18" height="18" rx="6" fill="${INK}"/><path d="M ${round(left + 4.5)} ${round(y)} l 3.5 4 l 5.5 -7" fill="none" stroke="${SAND}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<rect x="${round(left)}" y="${round(y - 9)}" width="18" height="18" rx="6" fill="none" stroke="${BORDER_STRONG}" stroke-width="2"/>`;
    return [
      mark,
      bar(left + 30, y - 4.5, (box.w - pad * 2 - 30) * (0.88 - i * 0.09), 9, done ? BORDER : SURFACE),
    ].join("");
  }).join("");

  return [panel(box), items].join("");
}

/* ------------------------------------------------------------------ *
 * Panels for the regulatory study
 *
 * A different kind of work needs a different picture. The AIP art draws a
 * system somebody uses; this one draws an analysis somebody did — coded
 * transcripts, the themes they resolved into, and how often each came up.
 * No app frame, because there was no app: the deliverable was a document.
 * ------------------------------------------------------------------ */

/** A coded transcript: speech as bars, with the coded runs highlighted. */
function transcript(box: Box, rows: number): string {
  const pad = 24;
  const gutter = 44;
  const left = box.x + pad;
  const textLeft = left + gutter + 16;
  const textWidth = box.x + box.w - pad - textLeft;
  const rowH = (box.h - pad * 2) / rows;

  // Which rows carry a code, and which code. Fixed rather than random so
  // re-running the generator produces a byte-identical file.
  const coded: Record<number, number> = { 1: 0, 2: 0, 5: 1, 6: 1, 7: 1, 10: 2, 13: 3 };

  const lines = Array.from({ length: rows }, (_, i) => {
    const y = box.y + pad + i * rowH;
    const cy = y + rowH / 2;
    const theme = coded[i];
    const width = textWidth * (0.62 + ((i * 37) % 33) / 100);

    // Always sand, never the code's own colour. Ink at low opacity turns
    // grey-blue over white, which is the one thing the palette does not
    // allow; and sand is already what the site highlights text with, so a
    // coded passage looks the same as a selected one.
    const highlight =
      theme === undefined
        ? ""
        : `<rect x="${round(textLeft - 8)}" y="${round(cy - rowH / 2 + 3)}" width="${round(width + 16)}" height="${round(rowH - 6)}" rx="5" fill="${SAND}" opacity="${round(0.9 - theme * 0.13)}"/>`;

    // A code tag in the gutter only where a coded run starts.
    const startsRun = theme !== undefined && coded[i - 1] !== theme;
    const tag = startsRun
      ? `<rect x="${round(left)}" y="${round(cy - 7)}" width="${gutter}" height="14" rx="7" fill="${THEMES[theme].fill}"/>`
      : "";

    return [highlight, tag, bar(textLeft, cy - 5, width, 10, BORDER)].join("");
  }).join("");

  return [
    panel(box),
    `<line x1="${round(left + gutter + 8)}" y1="${round(box.y + pad)}" x2="${round(left + gutter + 8)}" y2="${round(box.y + box.h - pad)}" stroke="${BORDER}" stroke-width="1.5"/>`,
    lines,
  ].join("");
}

/** The themes as a cluster: one hub, five satellites, sized by how often each came up. */
function themeNetwork(box: Box): string {
  const nodes: Point[] = [
    [0.5, 0.47],
    [0.22, 0.23],
    [0.79, 0.21],
    [0.85, 0.67],
    [0.47, 0.84],
    [0.15, 0.68],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [1, 2],
    [3, 4],
    [5, 4],
  ];
  const unit = Math.min(box.w, box.h);

  const links = edges
    .map(([a, b]) => {
      const [x1, y1] = place(box, nodes[a]);
      const [x2, y2] = place(box, nodes[b]);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${BORDER_STRONG}" stroke-width="1.5"/>`;
    })
    .join("");

  const dots = nodes
    .map((point, i) => {
      const [x, y] = place(box, point);
      const r = round(unit * (0.055 + THEMES[i].weight * 0.055));
      const halo =
        i === 0
          ? `<circle cx="${x}" cy="${y}" r="${round(r + 13)}" fill="none" stroke="${INK}" stroke-width="1.5" stroke-dasharray="5 6"/>`
          : "";
      return `${halo}<circle cx="${x}" cy="${y}" r="${r}" fill="${THEMES[i].fill}" stroke="${BG}" stroke-width="3"/>`;
    })
    .join("");

  return [panel(box), links, dots].join("");
}

/** The codebook: every code as a chip, two to a row. */
function codebook(box: Box, rows: number): string {
  const pad = 24;
  const left = box.x + pad;
  const colW = (box.w - pad * 2) / 2;
  const rowH = (box.h - pad * 2) / rows;

  const chips = Array.from({ length: rows * 2 }, (_, i) => {
    const x = left + (i % 2) * colW;
    const y = box.y + pad + Math.floor(i / 2) * rowH + rowH / 2;
    const theme = THEMES[i % THEMES.length];
    return [
      `<rect x="${round(x)}" y="${round(y - 8)}" width="16" height="16" rx="5" fill="${theme.fill}"/>`,
      bar(x + 26, y - 4.5, colW * (0.62 - (i % 3) * 0.08), 9, BORDER),
    ].join("");
  }).join("");

  return [panel(box), chips].join("");
}

/** The app frame: sidebar, top bar, and the search field, all as shapes. */
function chrome(width: number, height: number, frame: Box): string {
  const barH = 72;
  const railW = 66;

  const icons = Array.from({ length: 7 }, (_, i) => {
    const y = frame.y + barH + 34 + i * 52;
    const active = i === 0;
    return [
      active
        ? `<rect x="${round(frame.x + railW / 2 - 17)}" y="${round(y - 5)}" width="34" height="34" rx="10" fill="${SAND}"/>`
        : "",
      `<rect x="${round(frame.x + railW / 2 - 11)}" y="${round(y + 1)}" width="22" height="22" rx="6" fill="${active ? INK : BORDER_STRONG}"/>`,
    ].join("");
  }).join("");

  const searchW = Math.min(420, width * 0.3);
  const searchX = frame.x + frame.w / 2 - searchW / 2;
  const searchY = frame.y + barH / 2 - 17;

  return [
    `<rect x="${frame.x}" y="${frame.y}" width="${frame.w}" height="${frame.h}" rx="14" fill="${BG}" stroke="${BORDER}" stroke-width="2"/>`,
    `<path d="M ${frame.x} ${frame.y + barH} H ${frame.x + frame.w}" stroke="${BORDER}" stroke-width="2"/>`,
    `<path d="M ${frame.x + railW} ${frame.y + barH} V ${frame.y + frame.h}" stroke="${BORDER}" stroke-width="2"/>`,

    // menu
    ...[0, 1, 2].map((i) =>
      bar(frame.x + 22, frame.y + barH / 2 - 9 + i * 9, 22, 3, BORDER_STRONG),
    ),
    // mark
    `<rect x="${frame.x + 84}" y="${frame.y + barH / 2 - 15}" width="30" height="30" rx="8" fill="${INK}"/>`,
    `<path d="M ${frame.x + 105} ${frame.y + barH / 2 - 6} H ${frame.x + 96} a 5 5 0 0 0 0 10 h 6 a 5 5 0 0 1 0 10 H ${frame.x + 93}" fill="none" stroke="${SAND}" stroke-width="2.6" stroke-linecap="round"/>`,
    // title
    bar(frame.x + 128, frame.y + barH / 2 - 8, 196, 15, BORDER_STRONG),
    // search
    `<rect x="${round(searchX)}" y="${round(searchY)}" width="${round(searchW)}" height="34" rx="17" fill="${SURFACE}" stroke="${BORDER}" stroke-width="1.5"/>`,
    `<circle cx="${round(searchX + 26)}" cy="${round(searchY + 17)}" r="6.5" fill="none" stroke="${BORDER_STRONG}" stroke-width="2.5"/>`,
    `<path d="M ${round(searchX + 31)} ${round(searchY + 22)} l 5 5" stroke="${BORDER_STRONG}" stroke-width="2.5" stroke-linecap="round"/>`,
    // account
    `<circle cx="${frame.x + frame.w - 44}" cy="${frame.y + barH / 2}" r="18" fill="${INK}"/>`,

    icons,
  ].join("");
}

function svg(width: number, height: number, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${BG}"/>${body}</svg>`;
}

/** AIP, 4:3 — the card in the work grid. */
function aipThumbnail(): string {
  const W = 1200;
  const H = 900;
  const frame: Box = { x: 40, y: 48, w: W - 80, h: H - 96 };
  const barH = 72;
  const railW = 66;

  const left = frame.x + railW + 26;
  const top = frame.y + barH + 26;
  const right = frame.x + frame.w - 26;
  const bottom = frame.y + frame.h - 26;

  const colGap = 24;
  const leftW = (right - left) * 0.53;
  const mapX = left + leftW + colGap;

  return svg(
    W,
    H,
    [
      chrome(W, H, frame),
      register({ x: left, y: top, w: leftW, h: (bottom - top) * 0.55 }, 5),
      cropMix({
        x: left,
        y: top + (bottom - top) * 0.55 + colGap,
        w: leftW,
        h: (bottom - top) * 0.45 - colGap,
      }),
      plotMap({ x: mapX, y: top, w: right - mapX, h: bottom - top }, "map-thumb"),
    ].join(""),
  );
}

/** AIP, 2:1 — the banner at the top of the case study. */
function aipBanner(): string {
  const W = 2000;
  const H = 1000;
  const frame: Box = { x: 56, y: 56, w: W - 112, h: H - 112 };
  const barH = 72;
  const railW = 66;

  const left = frame.x + railW + 30;
  const top = frame.y + barH + 30;
  const right = frame.x + frame.w - 30;
  const bottom = frame.y + frame.h - 30;
  const gap = 26;

  const colW = (right - left - gap * 2) / 3;

  return svg(
    W,
    H,
    [
      chrome(W, H, frame),
      register({ x: left, y: top, w: colW, h: (bottom - top) * 0.62 }, 5),
      inputBars({
        x: left,
        y: top + (bottom - top) * 0.62 + gap,
        w: colW,
        h: (bottom - top) * 0.38 - gap,
      }),
      cropMix({ x: left + colW + gap, y: top, w: colW, h: (bottom - top) * 0.44 }),
      progressRows({
        x: left + colW + gap,
        y: top + (bottom - top) * 0.44 + gap,
        w: colW,
        h: (bottom - top) * 0.56 - gap,
      }),
      plotMap(
        { x: left + (colW + gap) * 2, y: top, w: colW, h: bottom - top },
        "map-large",
      ),
    ].join(""),
  );
}

/* ------------------------------------------------------------------ *
 * The regulatory study: panels on paper, no app frame.
 * ------------------------------------------------------------------ */

/** AGRA, 4:3. */
function agraThumbnail(): string {
  const W = 1200;
  const H = 900;
  const pad = 48;
  const gap = 24;

  const left = pad;
  const top = pad;
  const right = W - pad;
  const bottom = H - pad;

  const leftW = (right - left - gap) * 0.5;
  const rightX = left + leftW + gap;
  const rightW = right - rightX;

  return svg(
    W,
    H,
    [
      transcript({ x: left, y: top, w: leftW, h: bottom - top }, 14),
      themeNetwork({
        x: rightX,
        y: top,
        w: rightW,
        h: (bottom - top) * 0.58,
      }),
      progressRows(
        {
          x: rightX,
          y: top + (bottom - top) * 0.58 + gap,
          w: rightW,
          h: (bottom - top) * 0.42 - gap,
        },
        // Five, not six: the ramp has to run dark to light without turning
        // back, and the sixth theme reuses a dark.
        THEMES.slice(0, 5),
      ),
    ].join(""),
  );
}

/** AGRA, 2:1. */
function agraBanner(): string {
  const W = 2000;
  const H = 1000;
  const pad = 56;
  const gap = 26;

  const left = pad;
  const top = pad;
  const right = W - pad;
  const bottom = H - pad;

  const usable = right - left - gap * 2;
  const colA = usable * 0.3;
  const colB = usable * 0.38;
  const colC = usable * 0.32;

  const bX = left + colA + gap;
  const cX = bX + colB + gap;

  return svg(
    W,
    H,
    [
      transcript({ x: left, y: top, w: colA, h: bottom - top }, 16),
      themeNetwork({ x: bX, y: top, w: colB, h: bottom - top }),
      progressRows(
        { x: cX, y: top, w: colC, h: (bottom - top) * 0.5 },
        THEMES.slice(0, 5),
      ),
      codebook(
        {
          x: cX,
          y: top + (bottom - top) * 0.5 + gap,
          w: colC,
          h: (bottom - top) * 0.5 - gap,
        },
        4,
      ),
    ].join(""),
  );
}

/* ------------------------------------------------------------------ *
 * The rainfed water study: a field operation, not a screen.
 * ------------------------------------------------------------------ */

/** IWMI, 4:3. */
function iwmiThumbnail(): string {
  const W = 1200;
  const H = 900;
  const pad = 48;
  const gap = 24;

  const left = pad;
  const top = pad;
  const right = W - pad;
  const bottom = H - pad;

  const leftW = (right - left - gap) * 0.47;
  const rightX = left + leftW + gap;

  return svg(
    W,
    H,
    [
      collectionMatrix(
        { x: left, y: top, w: leftW, h: (bottom - top) * 0.44 },
        6,
        4,
      ),
      sampleColumns({
        x: left,
        y: top + (bottom - top) * 0.44 + gap,
        w: leftW,
        h: (bottom - top) * 0.56 - gap,
      }),
      catchment(
        { x: rightX, y: top, w: right - rightX, h: bottom - top },
        "catchment-thumb",
      ),
    ].join(""),
  );
}

/** IWMI, 2:1. */
function iwmiBanner(): string {
  const W = 2000;
  const H = 1000;
  const pad = 56;
  const gap = 26;

  const left = pad;
  const top = pad;
  const right = W - pad;
  const bottom = H - pad;

  const usable = right - left - gap * 2;
  const colA = usable * 0.3;
  const colB = usable * 0.38;
  const colC = usable * 0.32;

  const bX = left + colA + gap;
  const cX = bX + colB + gap;

  return svg(
    W,
    H,
    [
      collectionMatrix(
        { x: left, y: top, w: colA, h: (bottom - top) * 0.46 },
        6,
        4,
      ),
      sampleColumns({
        x: left,
        y: top + (bottom - top) * 0.46 + gap,
        w: colA,
        h: (bottom - top) * 0.54 - gap,
      }),
      catchment({ x: bX, y: top, w: colB, h: bottom - top }, "catchment-large"),
      checklist({ x: cX, y: top, w: colC, h: bottom - top }, 8),
    ].join(""),
  );
}

/* ------------------------------------------------------------------ *
 * The rice policy dialogues: a decision being reached.
 * ------------------------------------------------------------------ */

/** Rice dialogues, 4:3. */
function riceThumbnail(): string {
  const W = 1200;
  const H = 900;
  const pad = 48;
  const gap = 24;

  const left = pad;
  const top = pad;
  const right = W - pad;
  const bottom = H - pad;

  const leftW = (right - left - gap) * 0.44;
  const rightX = left + leftW + gap;

  return svg(
    W,
    H,
    [
      criteriaRows({ x: left, y: top, w: leftW, h: (bottom - top) * 0.54 }, 5),
      engagementFunnel({
        x: left,
        y: top + (bottom - top) * 0.54 + gap,
        w: leftW,
        h: (bottom - top) * 0.46 - gap,
      }),
      impactFeasibility({ x: rightX, y: top, w: right - rightX, h: bottom - top }),
    ].join(""),
  );
}

/** Rice dialogues, 2:1. */
function riceBanner(): string {
  const W = 2000;
  const H = 1000;
  const pad = 56;
  const gap = 26;

  const left = pad;
  const top = pad;
  const right = W - pad;
  const bottom = H - pad;

  const usable = right - left - gap * 2;
  const colA = usable * 0.3;
  const colB = usable * 0.4;
  const colC = usable * 0.3;

  const bX = left + colA + gap;
  const cX = bX + colB + gap;

  return svg(
    W,
    H,
    [
      criteriaRows({ x: left, y: top, w: colA, h: bottom - top }, 7),
      impactFeasibility({ x: bX, y: top, w: colB, h: bottom - top }),
      engagementFunnel({ x: cX, y: top, w: colC, h: bottom - top }),
    ].join(""),
  );
}

/* ------------------------------------------------------------------ *
 * Output
 *
 * Keyed by project slug, because that is what the Sanity importer looks
 * for: `<slug>-thumbnail.png` becomes the card image and `<slug>-banner.png`
 * the case-study banner. Rename a slug and its key here has to follow.
 * ------------------------------------------------------------------ */
const ART: Record<string, { thumbnail: () => string; banner: () => string }> = {
  "aip-ghana-sierra-leone": { thumbnail: aipThumbnail, banner: aipBanner },
  "agra-regulatory-environment-ghana": {
    thumbnail: agraThumbnail,
    banner: agraBanner,
  },
  "iwmi-rainfed-water-management": {
    thumbnail: iwmiThumbnail,
    banner: iwmiBanner,
  },
  "rice-policy-dialogues-sierra-leone": {
    thumbnail: riceThumbnail,
    banner: riceBanner,
  },
};

const outDir = path.join(process.cwd(), "public", "work");
await mkdir(outDir, { recursive: true });

for (const [slug, art] of Object.entries(ART)) {
  for (const [suffix, markup] of [
    ["thumbnail", art.thumbnail()],
    ["banner", art.banner()],
  ] as const) {
    const name = `${slug}-${suffix}`;
    const svgPath = path.join(outDir, `${name}.svg`);
    const pngPath = path.join(outDir, `${name}.png`);

    await writeFile(svgPath, markup, "utf8");
    await sharp(Buffer.from(markup)).png({ compressionLevel: 9 }).toFile(pngPath);

    console.log(`  ${path.relative(process.cwd(), pngPath)}`);
  }
}
