import { cubicEasing } from "./WavyAmplitude";

const INDETERMINATE_DURATION = 6;

/**
 * One indeterminate animation frame. Angles are degrees; dash lengths assume an SVG path length of 100.
 * @internal
 */
export interface CircularWavyMotionFrame {
  /** Visible arc length expressed as a clockwise sweep in degrees. */
  sweep: number;

  /** Rotation of the enclosing SVG in degrees. */
  rotation: number;

  /** Active-path counter-rotation in degrees that compensates for the moving dash. */
  waveRotation: number;

  /** Moving dash offset in normalized path units, synchronized with the counter-rotation. */
  dashOffset: number;

  /** Space-separated visible and hidden dash lengths, totaling 100 normalized path units. */
  dashArray: string;
}

/**
 * Samples degree-based sweep and rotations from elapsed seconds, with SVG dash lengths normalized to 100.
 * @internal
 */
export function circularWavyMotion(elapsed: number, waveCount: number): CircularWavyMotionFrame {
  const cycle = elapsed % INDETERMINATE_DURATION;

  const minSweep = 0.1 * 360;
  const maxSweep = 0.87 * 360;
  const halfCycle = INDETERMINATE_DURATION / 2;
  const sweep =
    cycle < halfCycle
      ? minSweep + (maxSweep - minSweep) * (cycle / halfCycle)
      : maxSweep - (maxSweep - minSweep) * cubicEasing((cycle - halfCycle) / halfCycle, 0.2, 0, 0, 1);

  // Short quarter-turn bursts are layered over the continuous rotation.
  const quarter = Math.floor(cycle / 1.5);
  const quarterProgress = Math.min((cycle % 1.5) / 0.3, 1);
  const rotation = (cycle / INDETERMINATE_DURATION) * 1080 + (quarter + quarterProgress) * 90;

  // Keep dash movement and its counter-rotation on the same phase so arc endpoints stay aligned.
  const waveOffset = (elapsed / waveCount) % 1;
  const progress = sweep / 3.6;

  return {
    sweep,
    rotation,
    waveRotation: -waveOffset * 360,
    dashOffset: -waveOffset * 100,
    dashArray: `${progress} ${100 - progress}`,
  };
}
