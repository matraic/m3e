import { CustomElementDecorator } from "lit/decorators.js";

export type Constructor<T> = { new (...args: unknown[]): T };

/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```js
 * @element('my-element')
 * class MyElement extends LitElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @param {string} tagName The tag name of the custom element to define.
 */
export const element =
  (tagName: string): CustomElementDecorator =>
  (
    classOrTarget: Omit<typeof HTMLElement, "new"> | Constructor<HTMLElement>,
    context?: ClassDecoratorContext<Constructor<HTMLElement>>,
  ) => {
    const define = () => {
      if (typeof window !== "undefined" && !customElements.get(tagName)) {
        customElements.define(tagName, classOrTarget as CustomElementConstructor);
      }
    };

    if (context) {
      context.addInitializer(define);
    } else {
      define();
    }
  };
