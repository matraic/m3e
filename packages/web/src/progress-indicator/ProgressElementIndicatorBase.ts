import { css, CSSResultGroup, LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { AttachInternals, ReconnectedCallback, Role, setCustomEnumState } from "@m3e/web/core";

import { isProgressIndicatorVariant, ProgressIndicatorVariant } from "./ProgressIndicatorVariant";

/** A base implementation for an element used to convey progress. This class must be inherited. */
export abstract class ProgressElementIndicatorBase extends ReconnectedCallback(
  AttachInternals(Role(LitElement, "progressbar"), true),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host([hidden]) {
      display: none;
    }
    @media (forced-colors: active) {
      :host {
        --m3e-progress-indicator-color: CanvasText;
        --m3e-progress-indicator-track-color: Canvas;
      }
    }
  `;

  /**
   * A fractional value, between 0 and `max`, indicating progress.
   * @default 0
   */
  @property({ type: Number, reflect: true }) value = 0;

  /**
   * The maximum progress value.
   * @default 100
   */
  @property({ type: Number }) max = 100;

  /**
   * The appearance of the indicator.
   * @default "flat"
   */
  @property({ reflect: true, useDefault: true }) variant: ProgressIndicatorVariant = "flat";

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.#applyVariant();
    this.ariaValueMin = "0";
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("variant")) {
      this.#applyVariant();
    }
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("value")) {
      this.ariaValueNow = `${this.value}`;
    }
    if (changedProperties.has("max")) {
      this.ariaValueMax = `${this.max}`;
    }
  }

  /** @private */
  #applyVariant(): void {
    if (!isProgressIndicatorVariant(this.variant)) {
      this.variant = "flat";
    }
    setCustomEnumState(this, this.variant, "flat", "wavy");
  }
}
