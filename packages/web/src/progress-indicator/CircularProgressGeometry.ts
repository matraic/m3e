import { ProgressIndicatorVariant } from "./ProgressIndicatorVariant";

/**
 * A circle's center, radius, and extra viewBox padding, all in pixels.
 * @internal
 */
export interface CircularProgressCircle {
  /** Horizontal center in SVG coordinates, including any viewBox padding. */
  cx: number;

  /** Vertical center in SVG coordinates, including any viewBox padding. */
  cy: number;

  /** Radius of the stroke's centerline in pixels. */
  r: number;

  /** Extra space on each viewBox edge, including half the flat variant's stroke width. */
  padding: number;
}

/**
 * Clockwise boundaries measured from twelve o'clock, with pixel gaps and optional flat-variant padding.
 * @internal
 */
export interface CircularProgressArcOptions {
  /** Clockwise starting angle in degrees from twelve o'clock. Defaults to zero. */
  startAngle?: number;

  /** Clockwise ending angle in degrees from twelve o'clock. Defaults to 360. */
  endAngle?: number;

  /** Distance in pixels trimmed from each end of the arc. Defaults to zero. */
  gap?: number;

  /** Additional flat-variant viewBox padding in pixels, before stroke padding. Defaults to zero. */
  padding?: number;
}

/**
 * Resolves the legacy flat circle or the stroke-inset wavy circle, using pixel dimensions.
 * @internal
 */
export function createCircularProgressCircle(
  diameter: number,
  strokeWidth: number,
  variant: ProgressIndicatorVariant,
  padding: number,
): CircularProgressCircle {
  if (variant === "wavy") {
    const r = Math.max(0, (diameter - strokeWidth) / 2);
    return { cx: diameter / 2, cy: diameter / 2, r, padding: 0 };
  }

  padding = padding + strokeWidth / 2;
  const r = diameter / 2;
  const cx = r + padding;
  const cy = r + padding;

  return { cx, cy, r, padding };
}

/**
 * Converts a pixel distance along a circle to degrees.
 * @internal
 */
export function circularProgressSizeToDegrees(size: number, radius: number): number {
  return radius > 0 ? size * (360 / (2 * Math.PI * radius)) : 0;
}

function polarToCartesian(circle: CircularProgressCircle, degrees: number) {
  const rad = (degrees - 90) * (Math.PI / 180);

  return {
    x: circle.cx + circle.r * Math.cos(rad),
    y: circle.cy + circle.r * Math.sin(rad),
  };
}

/**
 * Builds an SVG arc with pixel gaps at both ends, preserving each variant's viewBox and arc rules.
 * @internal
 */
export function circularProgressArc(
  diameter: number,
  strokeWidth: number,
  variant: ProgressIndicatorVariant,
  { startAngle = 0, endAngle = 360, gap = 0, padding = 0 }: CircularProgressArcOptions,
): {
  /** SVG path data, or an empty string when no arc can be drawn. */
  path: string;

  /** SVG coordinate bounds, including any flat-variant padding. */
  viewBox: string;
} {
  if (diameter === 0 || strokeWidth === 0) return { path: "", viewBox: "0 0 0 0" };

  const circle = createCircularProgressCircle(diameter, strokeWidth, variant, padding);

  if (gap > 0) {
    startAngle += circularProgressSizeToDegrees(gap, circle.r);
    endAngle -= circularProgressSizeToDegrees(gap, circle.r);
  }

  if (variant === "wavy" && endAngle <= startAngle) {
    return { path: "", viewBox: `0 0 ${diameter} ${diameter}` };
  }

  // A single SVG arc cannot represent a closed 360-degree circle.
  if (endAngle - startAngle >= 360) {
    endAngle = startAngle + 359.999;
  }

  const start = polarToCartesian(circle, endAngle);
  const end = polarToCartesian(circle, startAngle);
  const path = `M ${start.x} ${start.y} A ${circle.r} ${circle.r} 0 ${endAngle - startAngle <= 180 ? "0" : "1"} 0 ${end.x} ${end.y}`;
  const viewBox = `0 0 ${diameter + circle.padding * 2} ${diameter + circle.padding * 2}`;

  return { path, viewBox };
}
