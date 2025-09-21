/**
 * Adapted from Angular Material CDK ARIA Describer
 * Source: https://github.com/angular/components/blob/main/src/cdk/a11y/aria-describer/aria-describer.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

import { isServer } from "lit";

import { addAriaReferencedId, removeAriaReferencedId } from "./aria-reference";
import { visuallyHide } from "./visuallyHide";

/** Utility for generating visually hidden elements that convey descriptive messages using `aria-describedby`. */
export class M3eAriaDescriber {
  /** @private */ static #nextId = 0;
  /** @private */ static #messageContainers = new Map<
    ParentNode,
    {
      containerElement: HTMLElement;
      messageRegistry: Map<string, { messageElement: Element; count: number }>;
    }
  >();

  /**
   * Adds an `aria-describedby` reference to a hidden element that contains the message.
   * @param {Element} element The element for which to provide a visually hidden description.
   * @param {string} message The message used to describe `element`.
   * @param {string} [role="tooltip"] The ARIA role of the message.
   */
  static describe(element: Element, message: string, role: string = "tooltip"): void {
    if (isServer) {
      return;
    }

    const rootNode = element.getRootNode() as ParentNode;
    if (!(rootNode instanceof ShadowRoot || rootNode instanceof Document)) {
      return;
    }

    let container = this.#messageContainers.get(rootNode);
    if (!container) {
      container = {
        containerElement: this.#createMessageContainer(),
        messageRegistry: new Map<string, { messageElement: Element; count: number }>(),
      };

      // Append to body if document, otherwise, append as a child of shadow root.
      (rootNode instanceof Document ? rootNode.body : rootNode).appendChild(container.containerElement);
    }

    const key = `${role}:${message}`;
    let entry = container.messageRegistry.get(key);
    if (!entry) {
      entry = { messageElement: this.#createMessageElement(message, role), count: 0 };
      container.containerElement.appendChild(entry.messageElement);
      container.messageRegistry.set(key, entry);
    }

    entry.count++;

    addAriaReferencedId(element, "aria-describedby", entry.messageElement.id);
  }

  /**
   * Removes an `aria-describedby` reference to a hidden element that contains the message.
   * @param {Element} element The element from which to remove a visually hidden description.
   * @param {string} message The message used to describe `element`.
   * @param {string} [role="tooltip"] The ARIA role of the message.
   */
  static removeDescription(element: Element, message: string, role: string = "tooltip"): void {
    if (isServer) {
      return;
    }

    const rootNode = element.getRootNode() as ParentNode;
    const container = this.#messageContainers.get(rootNode);
    if (!container) {
      return;
    }

    const key = `${role}:${message}`;
    const entry = container.messageRegistry.get(key);
    if (!entry) {
      return;
    }

    entry.count--;
    removeAriaReferencedId(element, "aria-describedby", entry.messageElement.id);

    // If there are no more elements referencing the message, remove it from the DOM.
    if (entry.count <= 0) {
      entry.messageElement.remove();
      container.messageRegistry.delete(key);
    }

    // If there are no more registered messages, remove the container from the DOM.
    if (container.messageRegistry.size == 0) {
      container.containerElement?.remove();
      this.#messageContainers.delete(rootNode);
    }
  }

  /** @private */
  static #createMessageContainer(): HTMLElement {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("m3e-describedby-message-container");
    visuallyHide(messageContainer.style);
    return messageContainer;
  }

  /** @private */
  static #createMessageElement(message: string, role: string): HTMLElement {
    const messageElement = document.createElement("span");
    messageElement.id = `m3e-describedby-message-${this.#nextId++}`;
    messageElement.role = role;
    messageElement.ariaAtomic = "true";
    messageElement.innerText = message.trim();
    return messageElement;
  }
}

declare global {
  /** Utility for generating visually hidden elements that convey descriptive messages using `aria-describedby`. */
  var M3eAriaDescriber: M3eAriaDescriber;
}

globalThis.M3eAriaDescriber = M3eAriaDescriber;
