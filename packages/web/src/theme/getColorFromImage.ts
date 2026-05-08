import { hexFromArgb, sourceColorFromImage } from "@material/material-color-utilities";

/**
 * Extracts the Material source color from an image and returns it as a hex string.
 * @param {HTMLImageElement} image - A fully loaded image element. Pixel data is sampled to derive the source color.
 * @returns {Promise<string>} A hex color string (`#RRGGBB`) representing the extracted source color.
 *
 * @example
 * const img = document.querySelector("img");
 * const color = await getColorFromImage(img);
 * // "#6750A4"
 */
export async function getColorFromImage(image: HTMLImageElement): Promise<string> {
  return hexFromArgb(await sourceColorFromImage(image));
}
