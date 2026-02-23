import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { Constructor } from "./Constructor";
import { isDisabledInteractiveMixin } from "./DisabledInteractive";
import { isDisabledMixin } from "./Disabled";
import { hasKeys } from "./hasKeys";

/** A symbol through which to access a function used to render a pseudo link. */
export const renderPseudoLink = Symbol("renderPseudoLink");

/** Specifies the possible targets for a link. */
export type LinkTarget = "_self" | "_blank" | "_parent" | "_top" | (string & {});

/** Defines functionality for an interactive element that functions as a link. */
export interface LinkButtonMixin {
  /**
   * The URL to which the link button points.
   * @default ""
   */
  href: string;

  /**
   * The target of the link button.
   * @default ""
   */
  target: LinkTarget;

  /**
   * The relationship between the `target` of the link button and the document.
   * @default ""
   */
  rel: string;

  /**
   * A value indicating whether the `target` of the link button will be downloaded,
   * optionally specifying the new name of the file.
   * @default null
   */
  download: string | null;

  /** Function used to render a pseudo link. */
  [renderPseudoLink](): unknown;
}

/**
 * Determines whether a value is a `LinkButtonMixin`.
 * @param {unknown} value The value to test.
 * @returns {value is LinkButtonMixin} Whether `value` is a `LinkButtonMixin`.
 */
export function isLinkButtonMixin(value: unknown): value is LinkButtonMixin {
  return hasKeys<LinkButtonMixin>(value, "download", "href", "rel", "target");
}

const _clickHandler = Symbol("_clickHandler");

/**
 * Mixin to augment an element with behavior that supports functioning as a link.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<LinkButtonMixin>} A constructor that implements `LinkButtonMixin`.
 */
export function LinkButton<T extends Constructor<LitElement>>(base: T): Constructor<LinkButtonMixin> & T {
  abstract class _LinkButtonMixin extends base implements LinkButtonMixin {
    private [_clickHandler] = async (e: Event) => {
      if (isDisabledInteractiveMixin(this) && this.disabledInteractive) {
        e.preventDefault();
        e.stopPropagation();
      }

      await new Promise<void>((resolve) => resolve());
      if (e.defaultPrevented) {
        return;
      }

      if (this.href) {
        e.preventDefault();
        e.stopImmediatePropagation();

        const link = document.createElement("a");
        link.href = this.href;
        link.rel = this.rel;
        link.target = this.target;
        if (this.download != null) {
          link.download = this.download;
        }

        link.addEventListener("click", async () => {
          await new Promise<void>((resolve) => resolve());
          link.remove();
        });

        document.body.appendChild(link);
        link.click();
      }
    };

    /**
     * The URL to which the link button points.
     * @default ""
     */
    @property() href = "";

    /**
     * The target of the link button.
     * @default ""
     */
    @property() target: LinkTarget = "";

    /**
     * The relationship between the `target` of the link button and the document.
     * @default ""
     */
    @property() rel = "";

    /**
     * A value indicating whether the `target` of the link button will be downloaded,
     * optionally specifying the new name of the file.
     * @default null
     */
    @property({ reflect: false }) get download(): string | null {
      return this.getAttribute("download");
    }
    set download(value: string | null) {
      const old = this.download;
      if (old !== value) {
        if (value) {
          this.setAttribute("download", value);
        } else {
          this.removeAttribute("download");
        }
        this.requestUpdate("download", old);
      }
    }

    /** @inheritdoc */
    override connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener("click", this[_clickHandler]);

      if (this.hasAttribute("href") && this.role === "button") {
        this.role = "link";
      }
    }

    /** @inheritdoc */
    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener("click", this[_clickHandler]);
    }

    /** @internal */
    [renderPseudoLink](): unknown {
      const disabled = isDisabledMixin(this) && this.disabled;
      const disabledInteractive = isDisabledInteractiveMixin(this) && this.disabledInteractive;

      return !disabled && !disabledInteractive && this.href
        ? html`<a
            href="${this.href}"
            target="${ifDefined(this.target || undefined)}"
            rel="${ifDefined(this.rel || undefined)}"
            download="${ifDefined(this.download || undefined)}"
            tabindex="-1"
            aria-hidden="true"
            @pointerdown="${this.#handleLinkPointerDown}"
            @focus="${this.#handleLinkFocus}"
            @blur="${this.#handleLinkBlur}"
          ></a>`
        : nothing;
    }

    /** @private */
    #handleLinkPointerDown(e: PointerEvent): void {
      if (e.button !== 2) {
        e.preventDefault();
        e.stopImmediatePropagation();

        this.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
      } else {
        (e.target as HTMLLinkElement).removeAttribute("aria-hidden");
      }
    }

    /** @private */
    #handleLinkFocus(e: Event): void {
      (e.target as HTMLLinkElement).blur();
      this.focus();
    }

    /** @private */
    #handleLinkBlur(e: Event): void {
      (e.target as HTMLLinkElement).setAttribute("aria-hidden", "true");
    }
  }

  return _LinkButtonMixin;
}
