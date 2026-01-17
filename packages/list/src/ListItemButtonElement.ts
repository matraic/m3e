import { css, CSSResultGroup, html, PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";

import {
  AttachInternals,
  Disabled,
  Focusable,
  KeyboardClick,
  LinkButton,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  renderPseudoLink,
  Role,
} from "@m3e/core";

import { M3eListItemElement } from "./ListItemElement";

/**
 * @internal
 * An internal interactive element used to present the content of a list item.
 */
@customElement("m3e-list-item-button")
export class M3eListItemButtonElement extends KeyboardClick(
  LinkButton(Focusable(Disabled(AttachInternals(Role(M3eListItemElement, "button"), true))))
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    M3eListItemElement.styles,
    css`
      :host {
        position: relative;
        outline: none;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
      :host(:not(:disabled)) {
        cursor: pointer;
      }
      a {
        all: unset;
        display: block;
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        z-index: 1;
      }
    `,
  ];

  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this._focusRing, this._stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<m3e-state-layer class="state-layer" ?disabled="${this.disabled}"> </m3e-state-layer>
      <m3e-focus-ring class="focus-ring" inward ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" ?disabled="${this.disabled}"></m3e-ripple>
      ${this[renderPseudoLink]()} ${super.render()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-list-item-button": M3eListItemButtonElement;
  }
}
