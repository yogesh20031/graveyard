// Shared geometry for the graveyard scene layers. Every layer renders the
// same viewBox with the same aspect handling so they stay registered while
// the parallax moves them at different speeds.

export const SCENE_VIEW_BOX = "0 0 1440 810";
export const SCENE_ASPECT = "xMidYMax slice";

export type Star = {
  x: number;
  y: number;
  r: number;
  slow?: boolean;
};

export type Tombstone = {
  x: number;
  width: number;
  height: number;
  fillClass: string;
};

export const STARS: Star[] = [
  { x: 90, y: 90, r: 1.6 },
  { x: 200, y: 180, r: 1.2, slow: true },
  { x: 320, y: 70, r: 1.8 },
  { x: 430, y: 150, r: 1.1, slow: true },
  { x: 560, y: 60, r: 1.5 },
  { x: 660, y: 190, r: 1.2 },
  { x: 780, y: 90, r: 1.7, slow: true },
  { x: 900, y: 40, r: 1.3 },
  { x: 980, y: 210, r: 1.1, slow: true },
  { x: 1230, y: 80, r: 1.6 },
  { x: 1320, y: 220, r: 1.2, slow: true },
  { x: 1400, y: 130, r: 1.5 },
  { x: 150, y: 300, r: 1 },
  { x: 1170, y: 320, r: 1, slow: true },
];

export const TOMBSTONES: Tombstone[] = [
  { x: 150, width: 56, height: 70, fillClass: "fill-foreground/10" },
  { x: 290, width: 44, height: 56, fillClass: "fill-foreground/8" },
  { x: 420, width: 60, height: 78, fillClass: "fill-foreground/12" },
  { x: 940, width: 50, height: 64, fillClass: "fill-foreground/10" },
  { x: 1060, width: 64, height: 84, fillClass: "fill-foreground/12" },
  { x: 1280, width: 46, height: 58, fillClass: "fill-foreground/8" },
];

export const GROUND_Y = 660;

// Small stones scattered along the hill crest — the graveyard keeps going
// deeper than the fence. baseY follows the hill curve in HillsLayer.
export type DistantStone = Tombstone & { baseY: number; cross?: boolean };

export const DISTANT_STONES: DistantStone[] = [
  { x: 356, width: 26, height: 34, baseY: 545, fillClass: "fill-surface/80" },
  { x: 424, width: 18, height: 30, baseY: 548, fillClass: "fill-surface/90", cross: true },
  { x: 498, width: 30, height: 38, baseY: 550, fillClass: "fill-surface/80" },
  { x: 566, width: 22, height: 28, baseY: 548, fillClass: "fill-surface/90" },
  { x: 872, width: 22, height: 34, baseY: 541, fillClass: "fill-surface/90", cross: true },
  { x: 946, width: 30, height: 40, baseY: 540, fillClass: "fill-surface/80" },
  { x: 1052, width: 20, height: 26, baseY: 543, fillClass: "fill-surface/90" },
  { x: 1216, width: 26, height: 32, baseY: 550, fillClass: "fill-surface/80" },
];

// Grave candles guttering at the stone bases; staggered flicker classes so
// no two flames move together.
export type Candle = { x: number; h: number; flickerClass: string };

export const CANDLES: Candle[] = [
  { x: 142, h: 9, flickerClass: "candle-flicker" },
  { x: 302, h: 7, flickerClass: "candle-flicker-offset" },
  { x: 490, h: 10, flickerClass: "candle-flicker-slow" },
  { x: 932, h: 8, flickerClass: "candle-flicker-offset" },
  { x: 1058, h: 9, flickerClass: "candle-flicker" },
  { x: 1240, h: 7, flickerClass: "candle-flicker-slow" },
];

// Gate opening sits between the pillars; the fence skips this span.
export const GATE_LEFT = 640;
export const GATE_RIGHT = 800;

export const PICKET_XS = Array.from({ length: 30 }, (_, i) => 24 + i * 48).filter(
  (x) => x < GATE_LEFT || x > GATE_RIGHT,
);

export function tombstonePath({ x, width, height }: Tombstone, baseY = GROUND_Y) {
  const r = width / 2;
  return `M ${x} ${baseY} v ${-(height - r)} a ${r} ${r} 0 0 1 ${width} 0 v ${height - r} z`;
}
