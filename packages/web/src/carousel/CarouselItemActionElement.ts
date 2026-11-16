import { CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { property, query } from "lit/decorators.js";

import {
  AttachInternals,
  customElement,
  Disabled,
  Focusable,
  KeyboardClick,
  LinkButton,
  M3eElevationElement,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  renderPseudoLink,
  Role,
} from "@m3e/web/core";

import { CarouselItemActionStyle } from "./styles";

/** @internal The primary action within a carousel grid cell. */
@customElement("m3e-carousel-item-action")
export class M3eCarouselItemActionElement extends KeyboardClick(
  LinkButton(Focusable(Disabled(AttachInternals(Role(LitElement, "button"))))),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = CarouselItemActionStyle;

  /** @private */ @query("m3e-elevation") private _elevation?: M3eElevationElement;
  /** @private */ @query("m3e-focus-ring") private _focusRing?: M3eFocusRingElement;
  /** @private */ @query("m3e-state-layer") private _stateLayer?: M3eStateLayerElement;
  /** @private */ @query("m3e-ripple") private _ripple?: M3eRippleElement;

  /** @internal Whether the action belongs to an edge-to-edge fullscreen carousel. */
  @property({ attribute: false }) fullscreen = false;

  constructor() {
    super();

    this.addEventListener(
      "click",
      (event) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );

    const handleKey = (event: KeyboardEvent) => {
      if (event.target !== this) return;

      if (this.href && event.key === " ") {
        event.stopImmediatePropagation();
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
      }
    };

    this.addEventListener("keydown", handleKey, { capture: true });
    this.addEventListener("keyup", handleKey, { capture: true });
  }

  /** @inheritdoc */
  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    this.role = this.href ? "link" : "button";
  }

  /** @inheritdoc */
  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    this._elevation?.attach(this);
    this._focusRing?.attach(this);
    this._stateLayer?.attach(this);
    this._ripple?.attach(this);
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="surface">
      <m3e-elevation ?disabled=${this.disabled || this.fullscreen}></m3e-elevation>
      <div class="base">
        <slot></slot>
        <m3e-state-layer ?disabled=${this.disabled}></m3e-state-layer>
        <m3e-ripple ?disabled=${this.disabled}></m3e-ripple>
        ${this[renderPseudoLink]()}
      </div>
      <m3e-focus-ring ?inward=${this.fullscreen} ?disabled=${this.disabled}></m3e-focus-ring>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-carousel-item-action": M3eCarouselItemActionElement;
  }
}
