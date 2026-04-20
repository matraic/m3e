import { IconRegistry, SvgIconInfo } from "./IconRegistry";
import { IconVariant } from "./IconVariant";

export type { SvgIconInfo } from "./IconRegistry";

/**
 * Registers an SVG icon to the internal icon registry used by `m3e-icon`.
 * @param {string} name The name of the icon.
 * @param {IconVariant} variant The variant of the icon.
 * @param data The outlined and filled SVG information of the icon.
 */
export function registerIcon(
  name: string,
  variant: IconVariant,
  data: { outlined: SvgIconInfo; filled: SvgIconInfo },
): void {
  IconRegistry.addIcon(name, variant, data);
}
