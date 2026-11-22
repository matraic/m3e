/**
 * Builds a quadratic wave with a positive pixel wavelength, containing configured and animated amplitudes.
 * Stroke width, wavelength, and amplitudes use pixels; the optional phase is in radians.
 * @internal
 */
export function linearWavyPath({
  width,
  strokeWidth,
  configuredAmplitude,
  amplitude,
  wavelength,
  phase = 0,
}: {
  /** Visible indicator width in pixels; the generated wave can extend past its right edge. */
  width: number;

  /** Thickness of the wave's stroke in pixels. */
  strokeWidth: number;

  /** CSS-configured amplitude in pixels, retained when reserving canvas space. */
  configuredAmplitude: number;

  /** Current interpolated amplitude in pixels, used to shape the wave. */
  amplitude: number;

  /** Positive distance in pixels occupied by one full wave. */
  wavelength: number;

  /** Wave phase in radians. Defaults to zero. */
  phase?: number;
}): {
  /** SVG path data, flattening to a horizontal line when amplitude is zero. */
  path: string;

  /** SVG coordinate bounds containing the stroke and reserved amplitude. */
  viewBox: string;

  /** Canvas height in pixels, including the stroke and both sides of the reserved amplitude. */
  height: number;
} {
  // Preserve enough canvas space while a reduced CSS amplitude is still morphing from a larger wave.
  const extent = Math.max(configuredAmplitude, amplitude);
  const y = extent + strokeWidth / 2;

  const path: string[] = [];
  const step = wavelength / 2;
  let x = 0;

  path.push(`M ${x},${y}`);

  if (amplitude === 0) {
    path.push(`H ${width}`);
  } else {
    // Each quadratic spans half a wavelength, alternating its control point across the centerline.
    while (x <= width) {
      const endX = x + step;
      const endY = y + amplitude * Math.sin((2 * Math.PI * endX) / wavelength + phase);
      const cpX = x + step / 2;
      const cpY = y + amplitude * Math.sin((2 * Math.PI * (x + step / 2)) / wavelength + phase);

      path.push(`Q ${cpX},${cpY} ${endX},${endY}`);
      x += step;
    }
  }

  const height = strokeWidth + extent * 2;
  const viewBox = `0 0 ${width} ${height}`;

  return { path: path.join(" "), viewBox, height };
}
