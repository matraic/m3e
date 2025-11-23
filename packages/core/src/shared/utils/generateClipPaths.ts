type Point = { x: number; y: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function quadraticBezier(p0: Point, p1: Point, p2: Point, t: number): Point {
  const x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
  const y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
  return { x, y };
}

function cubicBezier(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const x =
    Math.pow(1 - t, 3) * p0.x +
    3 * Math.pow(1 - t, 2) * t * p1.x +
    3 * (1 - t) * Math.pow(t, 2) * p2.x +
    Math.pow(t, 3) * p3.x;

  const y =
    Math.pow(1 - t, 3) * p0.y +
    3 * Math.pow(1 - t, 2) * t * p1.y +
    3 * (1 - t) * Math.pow(t, 2) * p2.y +
    Math.pow(t, 3) * p3.y;

  return { x, y };
}

function parsePath(pathData: string) {
  const commands = pathData.match(/[a-zA-Z][^a-zA-Z]*/g) || [];

  return commands.map((cmd) => {
    const type = cmd[0];
    const nums = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);

    return { type, nums };
  });
}

function samplePath(pathData: string, maxPoints: number): Point[] {
  const segments = parsePath(pathData);

  let current: Point = { x: 0, y: 0 };
  let start: Point = { x: 0, y: 0 };

  const segs: { type: string; pts: Point[]; length: number }[] = [];

  for (const seg of segments) {
    if (seg.type === "M") {
      current = { x: seg.nums[0], y: seg.nums[1] };
      start = current;
    } else if (seg.type === "L") {
      const next = { x: seg.nums[0], y: seg.nums[1] };
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      segs.push({ type: "L", pts: [current, next], length: Math.hypot(dx, dy) });
      current = next;
    } else if (seg.type === "H") {
      const next = { x: seg.nums[0], y: current.y };
      const dx = next.x - current.x;
      segs.push({ type: "L", pts: [current, next], length: Math.abs(dx) });
      current = next;
    } else if (seg.type === "V") {
      const next = { x: current.x, y: seg.nums[0] };
      const dy = next.y - current.y;
      segs.push({ type: "L", pts: [current, next], length: Math.abs(dy) });
      current = next;
    } else if (seg.type === "Q") {
      const p1 = { x: seg.nums[0], y: seg.nums[1] };
      const p2 = { x: seg.nums[2], y: seg.nums[3] };
      let length = 0;
      let prev = current;
      const steps = 20;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const pt = quadraticBezier(current, p1, p2, t);
        length += Math.hypot(pt.x - prev.x, pt.y - prev.y);
        prev = pt;
      }
      segs.push({ type: "Q", pts: [current, p1, p2], length });
      current = p2;
    } else if (seg.type === "C") {
      const p1 = { x: seg.nums[0], y: seg.nums[1] };
      const p2 = { x: seg.nums[2], y: seg.nums[3] };
      const p3 = { x: seg.nums[4], y: seg.nums[5] };
      let length = 0;
      let prev = current;
      const steps = 20;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const pt = cubicBezier(current, p1, p2, p3, t);
        length += Math.hypot(pt.x - prev.x, pt.y - prev.y);
        prev = pt;
      }
      segs.push({ type: "C", pts: [current, p1, p2, p3], length });
      current = p3;
    } else if (seg.type === "Z") {
      const dx = start.x - current.x;
      const dy = start.y - current.y;
      segs.push({ type: "L", pts: [current, start], length: Math.hypot(dx, dy) });
      current = start;
    }
  }

  const totalLength = segs.reduce((sum, s) => sum + s.length, 0);
  const step = totalLength / (maxPoints - 1);
  const points: Point[] = [];

  let distSoFar = 0;
  let segIndex = 0;

  for (let i = 0; i < maxPoints; i++) {
    const targetDist = i * step;
    while (segIndex < segs.length && distSoFar + segs[segIndex].length < targetDist) {
      distSoFar += segs[segIndex].length;
      segIndex++;
    }
    const seg = segs[segIndex];
    if (!seg) break;

    const localT = (targetDist - distSoFar) / seg.length;
    if (seg.type === "L") {
      const [p0, p1] = seg.pts;
      points.push({ x: lerp(p0.x, p1.x, localT), y: lerp(p0.y, p1.y, localT) });
    } else if (seg.type === "Q") {
      const [p0, p1, p2] = seg.pts;
      points.push(quadraticBezier(p0, p1, p2, localT));
    } else if (seg.type === "C") {
      const [p0, p1, p2, p3] = seg.pts;
      points.push(cubicBezier(p0, p1, p2, p3, localT));
    }
  }

  return points;
}

function pointsToPercentClipPath(points: { x: number; y: number }[]): string {
  const coords = points.map((p) => {
    const xPercent = clamp(p.x * 100, 0, 100);
    const yPercent = clamp(p.y * 100, 0, 100);
    return `${xPercent.toFixed(2)}% ${yPercent.toFixed(2)}%`;
  });
  return `${coords.join(", ")}`;
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function bbox(points: { x: number; y: number }[]) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function rotateArray<T>(arr: T[], offset: number) {
  const n = arr.length;
  const out = new Array<T>(n);
  for (let i = 0; i < n; i++) {
    out[i] = arr[(i + offset) % n];
  }
  return out;
}

function bestCircularShift(target: { x: number; y: number }[], source: { x: number; y: number }[]) {
  const n = target.length;
  let bestK = 0;
  let bestScore = Infinity;
  for (let k = 0; k < n; k++) {
    let score = 0;
    for (let i = 0; i < n; i++) {
      const s = source[(i + k) % n];
      const t = target[i];
      const dx = s.x - t.x;
      const dy = s.y - t.y;
      score += dx * dx + dy * dy;
      if (score >= bestScore) break; // early exit
    }
    if (score < bestScore) {
      bestScore = score;
      bestK = k;
    }
  }
  return bestK;
}

function signedArea(points: { x: number; y: number }[]) {
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const a = points[i];
    const b = points[(i + 1) % n];
    area += a.x * b.y - b.x * a.y;
  }
  return area / 2;
}

function normalizePointSets(sets: { x: number; y: number }[][]) {
  const normalized = sets.map((pts) => {
    const b = bbox(pts);
    const translated = pts.map((p) => ({ x: p.x - b.minX, y: p.y - b.minY }));
    const scale = Math.max(b.width, b.height) || 1;
    const scaled = translated.map((p) => ({ x: p.x / scale, y: p.y / scale }));
    const widthScaled = b.width / scale;
    const heightScaled = b.height / scale;
    const offsetX = (1 - widthScaled) / 2;
    const offsetY = (1 - heightScaled) / 2;
    return scaled.map((p) => ({ x: p.x + offsetX, y: p.y + offsetY }));
  });

  const reference = normalized[0];
  const refSign = Math.sign(signedArea(reference));
  for (let i = 1; i < normalized.length; i++) {
    let set = normalized[i];
    const sign = Math.sign(signedArea(set));
    if (sign !== 0 && sign !== refSign) {
      set = set.slice().reverse();
    }
    const k = bestCircularShift(reference, set);
    normalized[i] = rotateArray(set, k);
  }

  return normalized;
}

/**
 * Generates normalized clip paths from SVG path data.
 * @param {string[]} paths The SVG path data to convert to normalized clip paths.
 * @param {number} maxPoints The maximum number of points to which to normalize paths.
 * @returns {string[]} The normalized clip paths.
 */
export function generateClipPaths(paths: string[], maxPoints: number): string[] {
  return normalizePointSets(paths.map((x) => samplePath(x, maxPoints))).map((x) => pointsToPercentClipPath(x));
}
