import { getTextContent, guid } from "@m3e/core";

/** A node in a table of contents. */
export interface TocNode {
  /** An opaque identifier that uniquely identifies the node. */
  id: string;

  /** The level of the node. */
  level: number;

  /** The text to display for the node. */
  label: string;

  /** The element of the node. */
  element: HTMLElement;

  /** The child nodes. */
  nodes: TocNode[];
}

/** Provides functionality used to generate a table of contents used for in-page navigation. */
export class TocGenerator {
  /**
   * Generates nodes from which to construct a table of contents for in-page navigation.
   * @param {HTMLElement} element The element for which to generate a table of contents.
   * @param {number} [maxDepth=6] The maximum depth of the table of contents.
   * @returns {Array<TocNode>} The top-level nodes of the table of contents.
   */
  static generate(element: HTMLElement, maxDepth: number = 6): Array<TocNode> {
    const maxLevel = 6;
    let topLevel = maxLevel;
    const nodes = new Array<TocNode>();
    element
      .querySelectorAll<HTMLElement>(
        "h1:not([m3e-toc-ignore]),h2:not([m3e-toc-ignore]),h3:not([m3e-toc-ignore]),h4:not([m3e-toc-ignore]),h5:not([m3e-toc-ignore]),h6:not([m3e-toc-ignore]),m3e-heading[level]:not([m3e-toc-ignore])"
      )
      .forEach((element) => {
        const level = TocGenerator.#getHeaderLevel(element);
        topLevel = Math.min(level, topLevel);
        nodes.push({
          id: element.id || guid(),
          element,
          level,
          label: getTextContent(element, true),
          nodes: new Array<TocNode>(),
        });
      });

    for (let level = topLevel + maxDepth - 1; level > topLevel; level--) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.level === level) {
          for (let j = i; j >= 0; j--) {
            const prev = nodes[j];
            if (prev.level < level) {
              prev.nodes.push(node);
              break;
            }
          }
        }
      }
    }

    nodes.forEach((x) => (x.level -= topLevel - 1));
    return nodes.filter((x) => x.level === 1);
  }

  /** @internal */
  static #getHeaderLevel(element: HTMLElement): number {
    return element.tagName.startsWith("H")
      ? parseInt(element.tagName.substring(1))
      : parseInt(element.getAttribute("level") ?? "0");
  }
}
