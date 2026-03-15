import { css, CSSResultGroup } from "lit";

import { DesignToken, Role, setCustomState, customElement, ScrollController, MutationController } from "@m3e/web/core";
import { M3eFloatingPanelElement } from "@m3e/web/core/anchoring";

import { M3eOptGroupElement } from "./OptGroupElement";

/**
 * Presents a list of options on a temporary surface.
 *
 * @description
 * The `m3e-option-panel` component renders a scrollable container for displaying selectable options
 * as a Material Design 3 menu surface. It provides dynamic positioning and anchoring to trigger elements,
 * automatic viewport boundary detection with intelligent repositioning, and smooth enter/exit animations.
 *
 * @tag m3e-option-panel
 *
 * @slot - Renders the contents of the list.
 *
 * @fires beforetoggle - Dispatched before the toggle state changes.
 * @fires toggle - Dispatched after the toggle state has changed.
 *
 * @cssprop --m3e-option-panel-container-shape - Corner radius of the panel container.
 * @cssprop --m3e-option-panel-container-min-width - Minimum width of the panel container.
 * @cssprop --m3e-option-panel-container-max-width - Maximum width of the panel container.
 * @cssprop --m3e-option-panel-container-max-height - Maximum height of the panel container.
 * @cssprop --m3e-option-panel-container-padding-block - Vertical padding inside the panel container.
 * @cssprop --m3e-option-panel-container-padding-inline - Horizontal padding inside the panel container.
 * @cssprop --m3e-option-panel-container-color - Background color of the panel container.
 * @cssprop --m3e-option-panel-container-elevation - Box shadow elevation of the panel container.
 * @cssprop --m3e-option-panel-gap - Vertical spacing between option items.
 * @cssprop --m3e-option-panel-divider-spacing - Vertical spacing around slotted `m3e-divider` elements.
 * @cssprop --m3e-option-panel-text-highlight-container-color - Background color used for text highlight matches.
 * @cssprop --m3e-option-panel-text-highlight-color - Text color used for text highlight matches.
 */
@customElement("m3e-option-panel")
export class M3eOptionPanelElement extends Role(M3eFloatingPanelElement, "listbox") {
  static {
    if (typeof window !== "undefined") {
      const lightDomStyle = new CSSStyleSheet();
      lightDomStyle.replaceSync(
        css`
          m3e-option-panel > m3e-divider {
            margin-block: var(--m3e-option-panel-divider-spacing, 0.5rem);
          }
          m3e-option-panel m3e-option[hidden],
          m3e-option-panel m3e-optgroup[hidden] {
            display: none;
          }
        `.toString(),
      );

      document.adoptedStyleSheets = [...document.adoptedStyleSheets, lightDomStyle];
    }
  }

  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    M3eFloatingPanelElement.styles,
    css`
      :host {
        --m3e-floating-panel-container-shape: var(
          --m3e-option-panel-container-shape,
          ${DesignToken.shape.corner.large}
        );
        --m3e-floating-panel-container-min-width: var(--m3e-option-panel-container-min-width, 7rem);
        --m3e-floating-panel-container-max-width: var(--m3e-option-panel-container-max-width, 17.5rem);
        --m3e-floating-panel-container-max-height: var(--m3e-option-panel-container-max-height, 17.5rem);
        --m3e-floating-panel-container-color: var(
          --m3e-option-panel-container-color,
          ${DesignToken.color.surfaceContainer}
        );
        --m3e-floating-panel-container-elevation: var(
          --m3e-option-panel-container-elevation,
          ${DesignToken.elevation.level3}
        );
        --m3e-floating-panel-container-padding-inline: var(--m3e-option-panel-container-padding-inline, 0.25rem);
        --m3e-floating-panel-container-padding-block: var(--m3e-option-panel-container-padding-block, 0.25rem);
      }
      .base {
        row-gap: var(--m3e-option-panel-gap, 0.125rem);
        --m3e-text-highlight-container-color: var(
          --m3e-option-panel-text-highlight-container-color,
          ${DesignToken.color.tertiaryContainer}
        );
        --m3e-text-highlight-color: var(
          --m3e-option-panel-text-highlight-color,
          ${DesignToken.color.onTertiaryContainer}
        );
        --m3e-focus-ring-outward-offset: 0px;
        --m3e-focus-ring-growth-factor: 1.5;
      }
    `,
  ];

  /** @private */
  readonly #scrollController = new ScrollController(this, {
    target: null,
    callback: () => this.hide(false),
  });

  constructor() {
    super();

    new MutationController(this, {
      config: {
        childList: true,
        subtree: true,
      },
      callback: () => this.#handleMutation(),
    });
  }

  /** @inheritdoc */
  override async show(trigger: HTMLElement, anchor?: HTMLElement): Promise<void> {
    await super.show(trigger, anchor);
    this.#scrollController.observe(trigger);
  }

  /** @inheritdoc */
  override hide(restoreFocus?: boolean): void {
    if (this.trigger) {
      this.#scrollController.unobserve(this.trigger);
    }
    super.hide(restoreFocus);
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.#handleMutation();
  }

  /** @private */
  #handleMutation(): void {
    const options = this.querySelectorAll("m3e-option");
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      setCustomState(option, "-first", i === 0 && !(option.parentElement instanceof M3eOptGroupElement));
      setCustomState(option, "-last", i === options.length - 1);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-option-panel": M3eOptionPanelElement;
  }
}
