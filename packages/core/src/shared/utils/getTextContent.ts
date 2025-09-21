/**
 * Gets the text content of a given node, including slotted content.
 * @param {Node} node The node for which to get text content.
 * @param {boolean} [trim = false] A value indicating whether to trim content.
 * @returns {string} The text content of `node`.
 */
export function getTextContent(node: Node, trim: boolean = false): string {
  let textContent = "";

  switch (node.nodeType) {
    case Node.TEXT_NODE:
      textContent = node.nodeValue ?? "";
      break;
    case Node.ELEMENT_NODE:
      if (node instanceof HTMLSlotElement) {
        for (const assignedNode of node.assignedNodes({ flatten: true })) {
          textContent += getTextContent(assignedNode, trim);
        }
      } else {
        for (const child of node.childNodes) {
          textContent += getTextContent(child, trim);
        }
      }
      break;
  }

  if (trim) {
    textContent = textContent.trim();
  }
  return textContent;
}
