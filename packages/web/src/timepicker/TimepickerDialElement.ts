/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, nothing, PropertyValues, unsafeCSS } from "lit";
import { classMap } from "lit/directives/class-map.js";

import {
  AttachInternals,
  computeCssSize,
  customElement,
  DesignToken,
  Role,
  safeStyleMap,
  SuppressInitialAnimation,
} from "@m3e/web/core";

import { TimepickerInputElementBase } from "./TimepickerInputElementBase";

/**
 * A clock‑face surface for selecting hours and minutes using a movable hand.
 * @description
 * The `m3e-timepicker-dial` component provides a clock-face experience
 * for selecting hours and minutes. It supports both 12- and 24-hour formats,
 * and exposes view changes through accessible events.
 *
 * @tag m3e-timepicker-dial
 *
 * @attr format - Whether to use a 12‑hour or 24‑hour clock.
 * @attr hour - The hour, in 24-hour time, from 0..23.
 * @attr max-time - The maximum time that can be selected.
 * @attr min-time - The minimum time that can be selected.
 * @attr minute - The minute, from 0..59.
 * @attr second - The second, from 0..59.
 * @attr show-seconds - Whether to show seconds.
 * @attr period - The 12-hour time period.
 * @attr view - The view used to input time.
 *
 * @fires change - Dispatched when the selected time changes.
 * @fires view-change - Dispatched when the view changes.
 *
 * @cssprop --m3e-timepicker-dial-container-size - Size of the dial container.
 * @cssprop --m3e-timepicker-dial-container-shape - Corner radius of the dial container.
 * @cssprop --m3e-timepicker-dial-container-color - Background color of the dial container.
 * @cssprop --m3e-timepicker-dial-inset - Inset offset applied to the dial surface.
 * @cssprop --m3e-timepicker-dial-center-size - Size of the dial center.
 * @cssprop --m3e-timepicker-dial-handle-color - Color of the active handle.
 * @cssprop --m3e-timepicker-dial-handle-size - Size of the handle.
 * @cssprop --m3e-timepicker-dial-handle-disabled-color - Color of a disabled handle.
 * @cssprop --m3e-timepicker-dial-handle-disabled-opacity - Opacity of a disabled handle.
 * @cssprop --m3e-timepicker-dial-dial-inset - Inset applied to the handle area.
 * @cssprop --m3e-timepicker-dial-numeral-size - Size of the dial numerals.
 * @cssprop --m3e-timepicker-dial-numeral-color - Text color of inactive numerals.
 * @cssprop --m3e-timepicker-dial-numeral-shape - Corner radius of the numerals.
 * @cssprop --m3e-timepicker-dial-numeral-font-size - Font size of the outer numerals.
 * @cssprop --m3e-timepicker-dial-numeral-font-weight - Font weight of the outer numerals.
 * @cssprop --m3e-timepicker-dial-numeral-line-height - Line height of the outer numerals.
 * @cssprop --m3e-timepicker-dial-numeral-tracking - Letter spacing of the outer numerals.
 * @cssprop --m3e-timepicker-dial-inner-numeral-font-size - Font size of the inner numerals.
 * @cssprop --m3e-timepicker-dial-inner-numeral-font-weight - Font weight of the inner numerals.
 * @cssprop --m3e-timepicker-dial-inner-numeral-line-height - Line height of the inner numerals.
 * @cssprop --m3e-timepicker-dial-inner-numeral-tracking - Letter spacing of the inner numerals.
 * @cssprop --m3e-timepicker-dial-numeral-active-color - Color of active numerals.
 * @cssprop --m3e-timepicker-dial-numeral-disabled-color - Color of disabled numerals.
 * @cssprop --m3e-timepicker-dial-numeral-disabled-opacity - Opacity of disabled numerals.
 * @cssprop --m3e-timepicker-dial-handle-center-size - Size of the handle center indicator.
 */
@customElement("m3e-timepicker-dial")
export class M3eTimepickerDialElement extends SuppressInitialAnimation(
  AttachInternals(Role(TimepickerInputElementBase, "none")),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      width: var(--m3e-timepicker-dial-container-size, 16rem);
      aspect-ratio: 1 / 1;
    }
    .base {
      contain: layout style paint;
      position: relative;
      width: 100%;
      height: 100%;
      touch-action: none;
      border-radius: var(--m3e-timepicker-dial-container-shape, ${DesignToken.shape.corner.full});
      background-color: var(--m3e-timepicker-dial-container-color, ${DesignToken.color.surfaceContainerHighest});
    }
    .base:not(.dragging) {
      cursor: grab;
    }
    .base.dragging {
      cursor: grabbing;
    }
    .base.dragging .numeral {
      pointer-events: none;
    }
    .dial {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      touch-action: inherit;
      pointer-events: none;
      border-radius: inherit;

      --_numeral-radius: calc(
        calc(var(--m3e-timepicker-dial-container-size, 16rem) / 2) - calc(
            var(--m3e-timepicker-dial-numeral-size, 2.5rem) / 2
          ) - var(--m3e-timepicker-dial-inset, 4px)
      );
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))) .dial {
      transition: ${unsafeCSS(`opacity ${DesignToken.motion.duration.medium1} ${DesignToken.motion.easing.standard},
        transform ${DesignToken.motion.duration.medium1} ${DesignToken.motion.easing.standard}`)};
    }
    .dial:not(.hidden) {
      opacity: 1;
      transform: scale(1);
    }
    .dial.hidden {
      opacity: 0;
    }
    .dial.hour.hidden {
      transform: scale(1.2);
    }
    .dial.minute.hidden {
      transform: scale(0.8);
    }
    .dial.second.hidden {
      transform: scale(1.2);
    }
    .center {
      position: absolute;
      box-sizing: border-box;
      bottom: calc(50% - calc(var(--m3e-timepicker-dial-center-size, 8px) / 2));
      left: calc(50% - calc(var(--m3e-timepicker-dial-center-size, 8px) / 2));
      width: var(--m3e-timepicker-dial-center-size, 8px);
      height: var(--m3e-timepicker-dial-center-size, 8px);
      touch-action: inherit;
      pointer-events: none;
      border-radius: 50%;
    }
    .center::before,
    .center::after {
      content: "";
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
    }
    .center::before {
      background-color: var(--m3e-timepicker-dial-container-color, ${DesignToken.color.surfaceContainerHighest});
    }
    .center:not(.disabled)::after {
      background-color: var(--m3e-timepicker-dial-handle-color, ${DesignToken.color.primary});
    }
    .center.disabled::after {
      background-color: color-mix(
        in srgb,
        var(--m3e-timepicker-dial-handle-disabled-color, ${DesignToken.color.onSurface})
          var(--m3e-timepicker-dial-handle-disabled-opacity, 10%),
        transparent
      );
    }
    .handle {
      position: absolute;
      touch-action: inherit;
      left: calc(50% - calc(var(--m3e-timepicker-dial-handle-size, 2px) / 2));
      width: var(--m3e-timepicker-dial-handle-size, 2px);
      transform: rotate(calc(var(--_hand-angle, 0) * 1deg));
      transform-origin: bottom;
    }
    .handle:not(.disabled) {
      background-color: var(--m3e-timepicker-dial-handle-color, ${DesignToken.color.primary});
    }
    .handle.disabled {
      background-color: color-mix(
        in srgb,
        var(--m3e-timepicker-dial-handle-disabled-color, ${DesignToken.color.onSurface})
          var(--m3e-timepicker-dial-handle-disabled-opacity, 10%),
        transparent
      );
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))) .base:not(.dragging) .handle {
      transition: ${unsafeCSS(
        `transform ${DesignToken.motion.duration.medium1} ${DesignToken.motion.easing.standard}`,
      )};
    }
    .handle:not(.inner) {
      top: calc(var(--m3e-timepicker-dial-dial-inset, 4px) + var(--m3e-timepicker-dial-numeral-size, 2.5rem));
      height: calc(50% - var(--m3e-timepicker-dial-dial-inset, 4px) - var(--m3e-timepicker-dial-numeral-size, 2.5rem));
    }
    .handle.inner {
      top: calc(
        var(--m3e-timepicker-dial-numeral-size, 2.5rem) + var(--m3e-timepicker-dial-dial-inset, 4px) +
          var(--m3e-timepicker-dial-numeral-size, 2.5rem)
      );
      height: calc(
        50% - calc(
            var(--m3e-timepicker-dial-numeral-size, 2.5rem) + var(--m3e-timepicker-dial-dial-inset, 4px) +
              var(--m3e-timepicker-dial-numeral-size, 2.5rem)
          )
      );
    }
    .handle::before {
      content: "";
      position: absolute;
      touch-action: inherit;
      width: var(--m3e-timepicker-dial-numeral-size, 2.5rem);
      height: var(--m3e-timepicker-dial-numeral-size, 2.5rem);
      top: calc(0px - var(--m3e-timepicker-dial-numeral-size, 2.5rem));
      left: calc(
        0px - calc(var(--m3e-timepicker-dial-numeral-size, 2.5rem) / 2) +
          calc(var(--m3e-timepicker-dial-handle-size, 2px) / 2)
      );
      border-radius: 50%;
      box-sizing: border-box;
    }
    .handle:not(.disabled)::before {
      background-color: var(--m3e-timepicker-dial-handle-color, ${DesignToken.color.primary});
    }
    .handle.disabled::before {
      background-color: color-mix(
        in srgb,
        var(--m3e-timepicker-dial-handle-disabled-color, ${DesignToken.color.onSurface})
          var(--m3e-timepicker-dial-handle-disabled-opacity, 10%),
        transparent
      );
    }
    .handle:not(.active)::after {
      content: "";
      position: absolute;
      touch-action: inherit;
      width: var(--m3e-timepicker-dial-handle-center-size, 4px);
      height: var(--m3e-timepicker-dial-handle-center-size, 4px);
      top: calc(
        0px - calc(var(--m3e-timepicker-dial-numeral-size, 2.5rem) / 2) - calc(
            var(--m3e-timepicker-dial-handle-center-size, 4px) / 2
          )
      );
      left: calc(50% - calc(var(--m3e-timepicker-dial-handle-center-size, 4px) / 2));
      border-radius: 50%;
      box-sizing: border-box;
    }
    .handle:not(.active):not(.disabled)::after {
      background-color: var(--m3e-timepicker-dial-numeral-active-color, ${DesignToken.color.onPrimary});
    }
    .handle:not(.active).disabled::after {
      background-color: color-mix(
        in srgb,
        var(--m3e-timepicker-dial-numeral-disabled-color, ${DesignToken.color.onSurface})
          var(--m3e-timepicker-dial-numeral-disabled-opacity, 38%),
        transparent
      );
    }
    .numeral {
      user-select: none;
      touch-action: inherit;
      position: absolute;
      inset: 50%;
      translate: -50% -50%;
      width: var(--m3e-timepicker-dial-numeral-size, 2.5rem);
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--m3e-timepicker-dial-numeral-shape, ${DesignToken.shape.corner.full});
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))) .numeral.active {
      transition-delay: ${DesignToken.motion.duration.medium1};
      transition: ${unsafeCSS(`color ${DesignToken.motion.duration.short1} ${DesignToken.motion.easing.standard}`)};
    }
    .numeral:not(.active):not(.disabled) {
      color: var(--m3e-timepicker-dial-numeral-color, ${DesignToken.color.onSurface});
    }
    .numeral.active:not(.disabled) {
      color: var(--m3e-timepicker-dial-numeral-active-color, ${DesignToken.color.onPrimary});
    }
    .numeral.disabled {
      color: color-mix(
        in srgb,
        var(--m3e-timepicker-dial-numeral-disabled-color, ${DesignToken.color.onSurface})
          var(--m3e-timepicker-dial-numeral-disabled-opacity, 38%),
        transparent
      );
    }
    .numeral:not(.inner) {
      transform: rotate(var(--_numeral-angle)) translateY(calc(-1 * var(--_numeral-radius)))
        rotate(calc(-1 * var(--_numeral-angle)));
      font-size: var(--m3e-timepicker-dial-numeral-font-size, ${DesignToken.typescale.standard.body.large.fontSize});
      font-weight: var(
        --m3e-timepicker-dial-numeral-font-weight,
        ${DesignToken.typescale.standard.body.large.fontWeight}
      );
      line-height: var(
        --m3e-timepicker-dial-numeral-line-height,
        ${DesignToken.typescale.standard.body.large.lineHeight}
      );
      letter-spacing: var(
        --m3e-timepicker-dial-numeral-tracking,
        ${DesignToken.typescale.standard.body.large.tracking}
      );
    }
    .numeral.inner {
      transform: rotate(var(--_numeral-angle))
        translateY(calc(calc(-1 * var(--_numeral-radius)) + var(--m3e-timepicker-dial-numeral-size, 2.5rem)))
        rotate(calc(-1 * var(--_numeral-angle)));
      font-size: var(
        --m3e-timepicker-dial-inner-numeral-font-size,
        ${DesignToken.typescale.standard.body.small.fontSize}
      );
      font-weight: var(
        --m3e-timepicker-dial-inner-numeral-font-weight,
        ${DesignToken.typescale.standard.body.small.fontWeight}
      );
      line-height: var(
        --m3e-timepicker-dial-inner-numeral-line-height,
        ${DesignToken.typescale.standard.body.small.lineHeight}
      );
      letter-spacing: var(
        --m3e-timepicker-dial-inner-numeral-tracking,
        ${DesignToken.typescale.standard.body.small.tracking}
      );
    }
    @media (forced-colors: active) {
      .base,
      .center::before {
        background-color: Canvas;
      }
      .numeral:not(.active):not(.disabled) {
        color: CanvasText;
      }
      .center:not(.disabled)::after,
      .handle:not(.disabled) {
        background-color: Highlight;
      }
      .handle:not(.disabled)::before {
        background-color: unset;
        outline: var(--m3e-timepicker-dial-handle-size, 2px) solid Highlight;
      }
      .handle:not(.active):not(.disabled)::after {
        background-color: Highlight;
      }
      .numeral.active:not(.disabled) {
        color: Highlight;
      }
      .center.disabled::after,
      .handle:not(.active).disabled::after,
      .handle.disabled {
        background-color: GrayText;
      }
      .handle.disabled::before {
        background-color: unset;
        outline: var(--m3e-timepicker-dial-handle-size, 2px) solid GrayText;
      }
      .numeral.disabled:not(.active),
      .numeral.disabled.active {
        color: GrayText;
      }
      .numeral {
        forced-color-adjust: none;
        background-color: transparent;
      }
      .base {
        outline: 1px solid CanvasText;
      }
    }
    @media (prefers-reduced-motion) {
      :host(:not(:is(:state(--no-animate), :--no-animate))) .dial,
      :host(:not(:is(:state(--no-animate), :--no-animate))) .base:not(.dragging) .handle,
      :host(:not(:is(:state(--no-animate), :--no-animate))) .numeral.active {
        transition: none;
      }
    }
  `;

  /** @private */ #dragState?: { cachedRect: DOMRect; cachedInnerInset: number; timeChanged: boolean };

  /** @inheritdoc */
  override connectedCallback(): void {
    this.ariaHidden = "true";
    super.connectedCallback();
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (
      _changedProperties.has("hour") ||
      _changedProperties.has("minute") ||
      _changedProperties.has("second") ||
      _changedProperties.has("showSeconds") ||
      _changedProperties.has("view") ||
      _changedProperties.has("period") ||
      _changedProperties.has("minTime") ||
      _changedProperties.has("maxTime") ||
      _changedProperties.has("blackoutTimes")
    ) {
      this.#updateHand();
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div
      class="base"
      @pointerdown="${this.#handlePointerDown}"
      @pointermove="${this.#handlePointerMove}"
      @pointerup="${this.#handlePointerUp}"
    >
      ${this.#renderHandle()} ${this.#renderHourFace()} ${this.#renderMinuteFace()} ${this.#renderSecondFace()}
      <div class="center"></div>
    </div>`;
  }

  /** @private */
  #renderHandle(): unknown {
    return this[this.view] !== null ? html`<div class="handle"></div>` : nothing;
  }

  /** @private */
  #renderHourFace(): unknown {
    const use24 = this.currentFormat === "24";
    const step = 30;
    const outer = Array.from({ length: 12 }, (_, i) => {
      const hour = i === 0 ? 12 : i;
      const angle = i * step;
      const active =
        this.hour === null
          ? false
          : !use24
            ? this.hour % 12 === i
            : this.hour < 13 && this.hour > 0 && this.hour % 12 === i;
      const disabled = this.isHourDisabled(use24 ? hour : this.period === "pm" ? (hour % 12) + 12 : hour % 12);
      return this.#renderNumeral(`${hour}`, angle, active, disabled);
    });

    const inner = !use24
      ? nothing
      : Array.from({ length: 12 }, (_, i) => {
          const hour = i + 13;
          const angle = (i + 1) * step;
          const active = (this.hour === 0 && hour === 24) || this.hour === hour;
          const disabled = this.isHourDisabled(hour === 24 ? 0 : hour);
          return this.#renderNumeral(hour == 24 ? "00" : `${hour}`, angle, active, disabled, true);
        });

    return html`<div class="${classMap({ dial: true, hour: true, hidden: this.view !== "hour" })}">
      ${outer}${inner}
    </div>`;
  }

  /** @private */
  #renderMinuteFace(): unknown {
    return html`<div class="${classMap({ dial: true, minute: true, hidden: this.view !== "minute" })}">
      ${Array.from({ length: 60 }, (_, i) => {
        if (i % 5 !== 0) return;
        const angle = i * 6;
        const label = i % 5 === 0 ? i.toString().padStart(2, "0") : "";
        const active = i === this.minute;
        const disabled = this.hour !== null && this.isMinuteDisabled(this.hour, i);
        return this.#renderNumeral(label, angle, active, disabled);
      })}
    </div>`;
  }

  /** @private */
  #renderSecondFace(): unknown {
    if (!this.showSeconds) return nothing;

    return html`<div class="${classMap({ dial: true, second: true, hidden: this.view !== "second" })}">
      ${Array.from({ length: 60 }, (_, i) => {
        if (i % 5 !== 0) return;
        const angle = i * 6;
        const label = i % 5 === 0 ? i.toString().padStart(2, "0") : "";
        const active = i === this.second;
        const disabled = this.hour !== null && this.minute !== null && this.isSecondDisabled(this.hour, this.minute, i);
        return this.#renderNumeral(label, angle, active, disabled);
      })}
    </div>`;
  }

  /** @private */
  #renderNumeral(label: string, angle: number, active: boolean, disabled: boolean, inner: boolean = false): unknown {
    return html`<div
      class="${classMap({ numeral: true, inner, active, disabled })}"
      style="${safeStyleMap({ "--_numeral-angle": `${angle}deg` })}"
    >
      ${label}
    </div>`;
  }

  /** @private */
  #updateHand(): void {
    const hand = this.shadowRoot?.querySelector<HTMLElement>(".handle");
    const center = this.shadowRoot?.querySelector<HTMLElement>(".center");
    if (!hand || !center) return;

    let active = false;
    let inner = false;
    let angle: number | null = null;
    let disabled = false;

    switch (this.view) {
      case "hour":
        if (this.hour !== null) {
          active = true;
          angle = (this.hour % 12) * 30;
          inner = this.currentFormat === "24" && (this.hour < 1 || this.hour > 12);
          disabled = this.isHourDisabled(this.hour);
        }
        break;

      case "minute":
        if (this.minute !== null) {
          angle = this.minute * 6;
          active = this.minute % 5 === 0;
          disabled = this.hour !== null && this.isMinuteDisabled(this.hour, this.minute);
        }
        break;

      case "second":
        if (this.second !== null) {
          angle = this.second * 6;
          active = this.second % 5 === 0;
          disabled =
            this.hour !== null && this.minute !== null && this.isSecondDisabled(this.hour, this.minute, this.second);
        }
        break;
    }

    hand.classList.toggle("active", active);
    hand.classList.toggle("inner", inner);
    hand.classList.toggle("disabled", disabled);
    center.classList.toggle("disabled", disabled);

    if (angle != null) {
      hand.style.setProperty("--_hand-angle", `${angle}`);
    } else {
      hand.style.removeProperty("--_hand-angle");
    }
  }

  /** @private */
  #handlePointerDown(e: PointerEvent): void {
    if ((e.pointerType === "mouse" && e.button > 1) || !(e.currentTarget instanceof HTMLElement)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.classList.add("dragging");

    this.#dragState = {
      timeChanged: false,
      cachedRect: e.currentTarget.getBoundingClientRect(),
      cachedInnerInset:
        this.view === "hour" && this.currentFormat === "24"
          ? computeCssSize(
              e.currentTarget,
              "calc(var(--m3e-timepicker-dial-numeral-size, 2.5rem) + var(--m3e-timepicker-dial-inset, 4px))",
            )
          : 0,
    };

    this.#dragState.timeChanged =
      this.view === "hour"
        ? this.#changeHour(
            this.#hourFromAngle(
              this.#angleFromPointer(e, this.#dragState),
              this.#isPointerInsideInnerRing(e, this.#dragState),
            ),
          )
        : this.view === "minute"
          ? this.#changeMinute(this.#minuteFromAngle(this.#angleFromPointer(e, this.#dragState)))
          : this.#changeSecond(this.#secondFromAngle(this.#angleFromPointer(e, this.#dragState)));
  }

  /** @private */
  #handlePointerMove(e: PointerEvent): void {
    if (
      !(e.currentTarget instanceof HTMLElement) ||
      !e.currentTarget.hasPointerCapture(e.pointerId) ||
      !this.#dragState
    )
      return;

    this.#dragState.timeChanged =
      (this.view === "hour"
        ? this.#changeHour(
            this.#hourFromAngle(
              this.#angleFromPointer(e, this.#dragState),
              this.#isPointerInsideInnerRing(e, this.#dragState),
            ),
          )
        : this.view === "minute"
          ? this.#changeMinute(this.#minuteFromAngle(this.#angleFromPointer(e, this.#dragState)))
          : this.#changeSecond(this.#secondFromAngle(this.#angleFromPointer(e, this.#dragState)))) ||
      this.#dragState.timeChanged;
  }

  /** @private */
  #handlePointerUp(e: PointerEvent): void {
    if (
      !(e.currentTarget instanceof HTMLElement) ||
      !e.currentTarget.hasPointerCapture(e.pointerId) ||
      !this.#dragState
    )
      return;

    e.currentTarget.releasePointerCapture(e.pointerId);
    e.currentTarget.classList.remove("dragging");

    if (this.#dragState.timeChanged) {
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (
      this.view === "hour" &&
      (this.#dragState.timeChanged ||
        !this.isHourDisabled(
          this.#hourFromAngle(
            this.#angleFromPointer(e, this.#dragState),
            this.#isPointerInsideInnerRing(e, this.#dragState),
          ),
        ))
    ) {
      this.view = "minute";
      this.dispatchEvent(new CustomEvent("view-change"));
    } else if (
      this.view === "minute" &&
      this.showSeconds &&
      (this.#dragState.timeChanged ||
        this.hour === null ||
        !this.isMinuteDisabled(
          this.hour,
          this.#hourFromAngle(
            this.#angleFromPointer(e, this.#dragState),
            this.#isPointerInsideInnerRing(e, this.#dragState),
          ),
        ))
    ) {
      this.view = "second";
      this.dispatchEvent(new CustomEvent("view-change"));
    }

    this.#dragState = undefined;
  }

  /** @private */
  #angleFromPointer(e: PointerEvent, state: { cachedRect: DOMRect }): number {
    const cx = state.cachedRect.left + state.cachedRect.width / 2;
    const cy = state.cachedRect.top + state.cachedRect.height / 2;
    return ((Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 450) % 360;
  }

  /** @private */
  #radiusFromPointer(e: PointerEvent, state: { cachedRect: DOMRect }): number {
    const cx = state.cachedRect.left + state.cachedRect.width / 2;
    const cy = state.cachedRect.top + state.cachedRect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /** @private */
  #isPointerInsideInnerRing(e: PointerEvent, state: { cachedRect: DOMRect; cachedInnerInset: number }): boolean {
    if (state.cachedInnerInset <= 0) return false;
    return this.#radiusFromPointer(e, state) < state.cachedRect.width / 2 - state.cachedInnerInset;
  }

  /** @private */
  #hourFromAngle(angle: number, inner: boolean): number {
    const index = Math.round(angle / 30) % 12;
    const hour = inner ? (index === 0 ? 0 : index + 12) : index === 0 ? 12 : index;
    return this.currentFormat === "24" ? hour : this.period === "pm" ? (hour % 12) + 12 : hour % 12;
  }

  /** @private */
  #minuteFromAngle(angle: number): number {
    return Math.round(angle / 6) % 60;
  }

  /** @private */
  #secondFromAngle(angle: number): number {
    return Math.round(angle / 6) % 60;
  }

  /** @private */
  #changeHour(value: number): boolean {
    if (this.hour !== value && !this.isHourDisabled(value)) {
      this.hour = value;
      return true;
    }
    return false;
  }

  /** @private */
  #changeMinute(value: number): boolean {
    if (this.hour !== null && this.isMinuteDisabled(this.hour, value)) return false;
    if (this.minute !== value) {
      this.minute = value;
      return true;
    }
    return false;
  }

  /** @private */
  #changeSecond(value: number): boolean {
    if (this.hour !== null && this.minute !== null && this.isSecondDisabled(this.hour, this.minute, value))
      return false;
    if (this.second !== value) {
      this.second = value;
      return true;
    }
    return false;
  }
}

interface M3eTimepickerDialElementEventMap extends HTMLElementEventMap {
  "view-change": CustomEvent;
}

export interface M3eTimepickerDialElement {
  addEventListener<K extends keyof M3eTimepickerDialElementEventMap>(
    type: K,
    listener: (this: M3eTimepickerDialElement, ev: M3eTimepickerDialElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eTimepickerDialElementEventMap>(
    type: K,
    listener: (this: M3eTimepickerDialElement, ev: M3eTimepickerDialElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-timepicker-dial": M3eTimepickerDialElement;
  }
}
