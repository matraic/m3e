import { CSSResult } from "lit";

/**
 * Registers a constructable stylesheet in the document’s `adoptedStyleSheets`.
 * @param css - A `CSSResult` (e.g., from `css```) whose text will be injected into a constructable stylesheet.
 */
export function registerStyleSheet(css: CSSResult) {
  if (typeof window === "undefined") return;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css.toString());
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
}
