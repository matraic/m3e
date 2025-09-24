/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { css, CSSResultGroup, html, LitElement, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken, ResizeController, Role } from "@m3e/core";

/**
 * Presents short updates about application processes at the bottom of the screen.
 * @tag m3e-snackbar
 *
 * @slot - Renders the content of the snackbar.
 * @slot close-icon - Renders the icon of the button used to close the snackbar.
 *
 * @attr action - The label of the snackbar's action.
 * @attr close-label - The accessible label given to the button used to dismiss the snackbar.
 * @attr dismissible - Whether a button is presented that can be used to close the snackbar.
 * @attr duration - The length of time, in milliseconds, to wait before automatically dismissing the snackbar.
 *
 * @fires toggle - Emitted when the opened state of the snackbar changes.
 *
 * @cssprop --m3e-snackbar-margin - Vertical offset from the bottom of the viewport.
 * @cssprop --m3e-snackbar-container-shape - Border radius of the snackbar container.
 * @cssprop --m3e-snackbar-container-color - Background color of the snackbar.
 * @cssprop --m3e-snackbar-padding - Internal spacing of the snackbar container.
 * @cssprop --m3e-snackbar-min-width - Minimum width of the snackbar.
 * @cssprop --m3e-snackbar-max-width - Maximum width of the snackbar.
 */
@customElement("m3e-snackbar")
export class M3eSnackbarElement extends Role(LitElement, "status") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      position: fixed;
      top: calc(100vh - var(--_snackbar-height, 0px) - var(--m3e-snackbar-margin, 1rem));
      display: inline-flex;
      align-items: center;
      padding: unset;
      margin: unset;
      margin-inline: auto;
      border: unset;
      border-radius: var(--m3e-snackbar-container-shape, ${DesignToken.shape.corner.extraSmall});
      background-color: var(--m3e-snackbar-container-color, ${DesignToken.color.inverseSurface});
      padding: var(--m3e-snackbar-padding, 0.75rem 1rem 0.75rem 1rem);
      min-width: var(--m3e-snackbar-min-width, 21.5rem);
      max-width: var(--m3e-snackbar-max-width, 42rem);
      visibility: hidden;
      opacity: 0;
      transform: scale(0.8);
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard}, 
        transform ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard}, 
        overlay ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete,
        visibility ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete`
      )};
    }
    :host::backdrop {
      background-color: transparent;
    }
    :host(:popover-open) {
      visibility: visible;
      opacity: 1;
      transform: scale(1);
    }
    @starting-style {
      :host(:popover-open) {
        opacity: 0;
        transform: scale(0.8);
      }
    }
    :host([dismissible]) {
      padding-inline-end: 0.5rem;
    }
    .contents {
      display: contents;
      font-size: var(--m3e-snackbar-supporting-text-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(
        --m3e-snackbar-supporting-text-font-weight,
        ${DesignToken.typescale.standard.label.large.fontWeight}
      );
      line-height: var(
        --m3e-snackbar-supporting-text-line-height,
        ${DesignToken.typescale.standard.label.large.lineHeight}
      );
      letter-spacing: var(
        --m3e-snackbar-supporting-text-tracking,
        ${DesignToken.typescale.standard.label.large.tracking}
      );
      color: var(--m3e-snackbar-supporting-text-color, ${DesignToken.color.inverseOnSurface});

      --m3e-text-button-label-text-color: var(--m3e-snackbar-action-text-color, ${DesignToken.color.inversePrimary});
      --m3e-text-button-hover-label-text-color: var(
        --m3e-snackbar-action-text-color,
        ${DesignToken.color.inversePrimary}
      );
      --m3e-text-button-hover-state-layer-color: var(
        --m3e-snackbar-action-text-color,
        ${DesignToken.color.inversePrimary}
      );
      --m3e-text-button-focus-label-text-color: var(
        --m3e-snackbar-action-text-color,
        ${DesignToken.color.inversePrimary}
      );
      --m3e-text-button-focus-state-layer-color: var(
        --m3e-snackbar-action-text-color,
        ${DesignToken.color.inversePrimary}
      );
      --m3e-text-button-pressed-label-text-color: var(
        --m3e-snackbar-action-text-color,
        ${DesignToken.color.inversePrimary}
      );
      --m3e-text-button-pressed-state-layer-color: var(
        --m3e-snackbar-action-text-color,
        ${DesignToken.color.inversePrimary}
      );
      --m3e-standard-icon-button-icon-color: var(
        --m3e-snackbar-close-icon-color,
        ${DesignToken.color.inverseOnSurface}
      );
      --m3e-standard-icon-button-hover-icon-color: var(
        --m3e-snackbar-close-icon-color,
        ${DesignToken.color.inverseOnSurface}
      );
      --m3e-standard-icon-button-hover-state-layer-color: var(
        --m3e-snackbar-close-icon-color,
        ${DesignToken.color.inverseOnSurface}
      );
      --m3e-standard-icon-button-focus-icon-color: var(
        --m3e-snackbar-close-icon-color,
        ${DesignToken.color.inverseOnSurface}
      );
      --m3e-standard-icon-button-focus-state-layer-color: var(
        --m3e-snackbar-close-icon-color,
        ${DesignToken.color.inverseOnSurface}
      );
      --m3e-standard-icon-button-pressed-icon-color: var(
        --m3e-snackbar-close-icon-color,
        ${DesignToken.color.inverseOnSurface}
      );
      --m3e-standard-icon-button-pressed-state-layer-color: var(
        --m3e-snackbar-close-icon-color,
        ${DesignToken.color.inverseOnSurface}
      );
    }
    .supporting-text {
      flex: 1 1 auto;
    }
    ::slotted([slot="close-icon"]),
    .close-icon {
      width: 1em;
      font-size: var(--m3e-icon-button-icon-size, 1.5rem) !important;
    }
  `;

  /** @private */ static __current: M3eSnackbarElement | null = null;

  /** @private */ #timeoutId = -1;
  /** @private */ #actionTaken = false;
  /** @private */ readonly #beforeToggleHandler = (e: ToggleEvent) => this.#handleBeforeToggle(e);

  constructor() {
    super();

    new ResizeController(this, {
      callback: () => {
        this.style.setProperty("--_snackbar-height", `${this.getBoundingClientRect().height}px`);
      },
    });
  }

  /** The currently open snackbar. */
  static get current(): M3eSnackbarElement | null {
    return M3eSnackbarElement.__current;
  }

  /**
   * The length of time, in milliseconds, to wait before automatically dismissing the snackbar.
   * @default 3000
   */
  @property({ type: Number }) duration = 3000;

  /**
   * The label of the snackbar's action.
   * @default ""
   */
  @property() action = "";

  /**
   * Whether a button is presented that can be used to close the snackbar.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) dismissible = false;

  /**
   * The accessible label given to the button used to dismiss the snackbar.
   * @default "Close"
   */
  @property({ attribute: "close-label" }) closeLabel = "Close";

  /** Whether the user clicked the action. */
  get isActionTaken(): boolean {
    return this.#actionTaken;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("beforetoggle", this.#beforeToggleHandler);
    this.setAttribute("popover", "manual");
    this.ariaLive = "polite";
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("beforetoggle", this.#beforeToggleHandler);
  }

  /** @inheritdoc */
  protected override render() {
    return html`<div class="contents">
      <span class="supporting-text"><slot></slot></span>
      ${this.#renderActionButton()} ${this.#renderCloseButton()}
    </div>`;
  }

  /** @private */
  #renderActionButton(): unknown {
    return !this.action ? nothing : html`<m3e-button @click="${this.#handleActionClick}">${this.action}</m3e-button>`;
  }

  /** @private */
  #renderCloseButton(): unknown {
    return !this.dismissible
      ? nothing
      : html`<m3e-icon-button aria-label="${this.closeLabel}" @click="${this.hidePopover}">
          <slot name="close-icon">
            <svg class="close-icon" viewBox="0 -960 960 960" fill="currentColor">
              <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
              />
            </svg>
          </slot>
        </m3e-icon-button>`;
  }

  /** @private */
  #handleActionClick(): void {
    this.#actionTaken = true;
    this.hidePopover();
  }

  /** @private */
  #handleBeforeToggle(e: ToggleEvent): void {
    if (e.newState == "open") {
      M3eSnackbarElement.__current?.hidePopover();
      M3eSnackbarElement.__current = this;

      if (this.duration > 0) {
        this.#timeoutId = setTimeout(() => this.hidePopover(), this.duration);
      }
    } else {
      if (M3eSnackbarElement.__current === this) {
        M3eSnackbarElement.__current = null;
      }

      clearTimeout(this.#timeoutId);
    }
  }
}

interface M3eSnackbarElementEventMap extends HTMLElementEventMap {
  beforetoggle: ToggleEvent;
  toggle: ToggleEvent;
}

export interface M3eSnackbarElement {
  addEventListener<K extends keyof M3eSnackbarElementEventMap>(
    type: K,
    listener: (this: M3eSnackbarElement, ev: M3eSnackbarElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof M3eSnackbarElementEventMap>(
    type: K,
    listener: (this: M3eSnackbarElement, ev: M3eSnackbarElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-snackbar": M3eSnackbarElement;
  }
}
