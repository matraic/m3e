interface Point {
  /** Horizontal geometry coordinate; cached paths use a unit outer radius. */
  x: number;

  /** Vertical geometry coordinate; cached paths use a unit outer radius. */
  y: number;
}

/** Start point, two control points, and end point of a cubic Bezier segment. */
type Cubic = [Point, Point, Point, Point];

/**
 * Unit-scale star and circle paths with corresponding cubic segments for control-point interpolation.
 * @internal
 */
export interface CircularWavyGeometry {
  /** Closed rounded-star segments normalized to an outer radius of one. */
  star: Cubic[];

  /** Unit-circle segments paired with the star's segments for point-by-point morphing. */
  circle: Cubic[];

  /** Extrapolation limit before the control polygons can reverse winding. */
  maxDeformation: number;
}

function interpolate(a: Point, b: Point, fraction: number): Point {
  return { x: a.x + (b.x - a.x) * fraction, y: a.y + (b.y - a.y) * fraction };
}

function cross(a: Point, b: Point): number {
  return a.x * b.y - a.y * b.x;
}

/**
 * Approximates an arc with tangent-aligned cubic controls; angles are in radians.
 * @internal
 */
function arc(center: Point, radius: number, start: number, sweep: number): Cubic {
  const end = start + sweep;
  const handle = (4 / 3) * Math.tan(sweep / 4) * radius;
  const a = { x: center.x + radius * Math.cos(start), y: center.y + radius * Math.sin(start) };
  const b = { x: center.x + radius * Math.cos(end), y: center.y + radius * Math.sin(end) };

  return [
    a,
    { x: a.x - handle * Math.sin(start), y: a.y + handle * Math.cos(start) },
    { x: b.x + handle * Math.sin(end), y: b.y - handle * Math.cos(end) },
    b,
  ];
}

/**
 * Selects a whole wave count from the stroke-inset circumference and pixel wavelength.
 * Integral counts keep the closing seam on the same wave phase.
 * @internal
 */
export function circularWavyWaveCount(diameter: number, strokeWidth: number, wavelength: number): number {
  const circumference = Math.PI * Math.max(0, diameter - strokeWidth);

  return wavelength > 0 ? Math.min(256, Math.max(5, Math.round(circumference / wavelength))) : 5;
}

/**
 * Builds corresponding circle and rounded-star cubics so their control points can morph continuously.
 * The normalized geometry can be cached and rescaled independently of the indicator's pixel dimensions.
 * @internal
 */
export function createCircularWavyGeometry(waves: number): CircularWavyGeometry {
  const vertices = Array.from({ length: waves * 2 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / waves;
    const radius = i % 2 === 0 ? 1 : 0.75;

    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  });

  const corners = vertices.map((vertex, i) => {
    const previous = vertices[(i + vertices.length - 1) % vertices.length];
    const next = vertices[(i + 1) % vertices.length];
    const length = Math.hypot(previous.x - vertex.x, previous.y - vertex.y);
    const u = { x: (previous.x - vertex.x) / length, y: (previous.y - vertex.y) / length };
    const v = { x: (next.x - vertex.x) / length, y: (next.y - vertex.y) / length };
    const halfAngle = Math.acos(Math.max(-1, Math.min(1, u.x * v.x + u.y * v.y))) / 2;
    const cut = (i % 2 === 0 ? 0.35 : 0.5) / Math.tan(halfAngle);

    return { vertex, u, v, length, halfAngle, cut, extra: 0 };
  });

  // Adjacent fillets share an edge; shrink their radii together rather than allowing them to overlap.
  const fit = Math.min(
    1,
    ...corners.map((corner, i) => corner.length / (corner.cut + corners[(i + 1) % corners.length].cut)),
  );
  corners.forEach((corner, i) => {
    corner.cut *= fit;
    corner.extra = i % 2 === 0 ? corner.cut * 0.4 : 0;
  });

  const smoothingFit = Math.min(
    1,
    ...corners.map((corner, i) => {
      const next = corners[(i + 1) % corners.length];

      return corner.extra + next.extra > 0
        ? Math.max(0, corner.length - corner.cut - next.cut) / (corner.extra + next.extra)
        : 1;
    }),
  );

  corners.forEach((corner) => (corner.extra *= smoothingFit));

  const curves: Cubic[] = [];
  let firstPeak = 0;

  corners.forEach((corner, i) => {
    const { vertex, u, v, cut, extra, halfAngle } = corner;
    const radius = cut * Math.tan(halfAngle);
    const centerDistance = cut / (1 + u.x * v.x + u.y * v.y);
    const center = { x: vertex.x + (u.x + v.x) * centerDistance, y: vertex.y + (u.y + v.y) * centerDistance };

    const start = { x: vertex.x + u.x * cut, y: vertex.y + u.y * cut };
    const direction = Math.sign(v.x * u.y - v.y * u.x);
    const turn = direction * (Math.PI - halfAngle * 2);
    const angle = Math.atan2(start.y - center.y, start.x - center.x);
    const inset = (turn * extra) / (2 * (cut + extra));
    const segments = 2 * Math.max(1, Math.ceil(Math.abs(turn - 2 * inset) / (Math.PI / 2)));
    const rounded = Array.from({ length: segments }, (_, j) =>
      arc(center, radius, angle + inset + ((turn - 2 * inset) * j) / segments, (turn - 2 * inset) / segments),
    );

    const entry = { x: vertex.x + u.x * (cut + extra), y: vertex.y + u.y * (cut + extra) };
    const exit = { x: vertex.x + v.x * (cut + extra), y: vertex.y + v.y * (cut + extra) };

    if (curves.length > 0) {
      const previous = curves[curves.length - 1][3];

      if (Math.hypot(entry.x - previous.x, entry.y - previous.y) > 1e-9) {
        curves.push([previous, interpolate(previous, entry, 1 / 3), interpolate(previous, entry, 2 / 3), entry]);
      }
    }

    // Smooth the outer-lobe entries and exits without breaking their tangent alignment.
    if (extra > 1e-9) {
      const end = rounded[0][0];
      const tangentAngle = angle + inset;
      const handle = Math.hypot(end.x - entry.x, end.y - entry.y) / 3;

      curves.push([
        entry,
        { x: entry.x - u.x * handle, y: entry.y - u.y * handle },
        {
          x: end.x + direction * Math.sin(tangentAngle) * handle,
          y: end.y - direction * Math.cos(tangentAngle) * handle,
        },
        end,
      ]);
    }

    if (i === 0) firstPeak = curves.length + segments / 2;
    curves.push(...rounded);

    if (extra > 1e-9) {
      const start = rounded[rounded.length - 1][3];
      const tangentAngle = angle + turn - inset;
      const handle = Math.hypot(exit.x - start.x, exit.y - start.y) / 3;

      curves.push([
        start,
        {
          x: start.x - direction * Math.sin(tangentAngle) * handle,
          y: start.y + direction * Math.cos(tangentAngle) * handle,
        },
        { x: exit.x - v.x * handle, y: exit.y - v.y * handle },
        exit,
      ]);
    }
  });

  const end = curves[curves.length - 1][3];
  const start = curves[0][0];

  if (Math.hypot(end.x - start.x, end.y - start.y) > 1e-9) {
    curves.push([end, interpolate(end, start, 1 / 3), interpolate(end, start, 2 / 3), start]);
  }

  // Anchor both shapes at the top lobe so morphing does not shift the dash origin.
  const ordered = [...curves.slice(firstPeak), ...curves.slice(0, firstPeak)];
  const outerRadius = Math.hypot(ordered[0][0].x, ordered[0][0].y);
  const normalize = (p: Point): Point => ({ x: p.x / outerRadius, y: p.y / outerRadius });
  const star: Cubic[] = ordered.map((curve) => [
    normalize(curve[0]),
    normalize(curve[1]),
    normalize(curve[2]),
    normalize(curve[3]),
  ]);

  // Match a circle cubic to every star cubic so their control points can interpolate directly.
  const circle = star.map((curve) => {
    const start = Math.atan2(curve[0].y, curve[0].x);
    const end = Math.atan2(curve[3].y, curve[3].x);
    const sweep = (end - start + 2 * Math.PI) % (2 * Math.PI);

    return arc({ x: 0, y: 0 }, 1, start, sweep);
  });

  const innerRadius = Math.min(
    ...star.flatMap((curve) => [Math.hypot(curve[0].x, curve[0].y), Math.hypot(curve[3].x, curve[3].y)]),
  );
  let maxDeformation = 1 / (1 - innerRadius);

  // Limit extrapolation before a control polygon reverses winding and folds a custom-amplitude wave.
  star.forEach((curve, i) => {
    for (let j = 0; j < 3; j++) {
      const p = circle[i][j];
      const q = circle[i][j + 1];
      const dp = { x: curve[j].x - p.x, y: curve[j].y - p.y };
      const dq = { x: curve[j + 1].x - q.x, y: curve[j + 1].y - q.y };
      const a = cross(dp, dq);
      const b = cross(dp, q) + cross(p, dq);
      const c = cross(p, q);
      const discriminant = b * b - 4 * a * c;
      let roots: number[] = [];

      if (Math.abs(a) < 1e-12) {
        if (b < 0) roots = [-c / b];
      } else if (discriminant >= 0) {
        roots = [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)];
      }

      for (const root of roots) {
        if (root > 1) maxDeformation = Math.min(maxDeformation, root);
      }
    }
  });

  return { star, circle, maxDeformation };
}

/**
 * Interpolates a rounded star from its matching circle in the indicator's pixel coordinate system.
 * @param radius Outer radius in pixels.
 * @param center Shared x/y center coordinate in pixels.
 * @param deformation Zero produces a circle, one the default star, and larger values safely deepen its lobes.
 * @internal
 */
export function circularWavyPath(
  geometry: CircularWavyGeometry,
  radius: number,
  center: number,
  deformation: number,
): string {
  const fraction = Math.max(0, Math.min(deformation, geometry.maxDeformation));
  const curves = geometry.star.map((curve, i) =>
    curve.map((p, j) => {
      const point = interpolate(geometry.circle[i][j], p, fraction);
      return { x: center + point.x * radius, y: center + point.y * radius };
    }),
  );

  return (
    `M ${curves[0][0].x},${curves[0][0].y} ` +
    curves
      .map((curve) => `C ${curve[1].x},${curve[1].y} ${curve[2].x},${curve[2].y} ${curve[3].x},${curve[3].y}`)
      .join(" ") +
    " Z"
  );
}
