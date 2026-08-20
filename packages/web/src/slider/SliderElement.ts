import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  addCustomState,
  AttachInternals,
  customElement,
  deleteCustomState,
  DesignToken,
  hasCustomState,
  prefersReducedMotion,
  ResizeController,
  safeStyleMap,
  setCustomEnumState,
} from "@m3e/web/core";

import { M3eDirectionality, SupportsDirectionality } from "@m3e/web/core/bidi";

import { M3eSliderThumbElement } from "./SliderThumbElement";
import { isSliderOrientation, SliderOrientation } from "./SliderOrientation";
import { isSliderSize, SliderSize } from "./SliderSize";

/**
 * Allows for the selection of numeric values from a range.
 *
 * @description
 * The `m3e-slider` component enables users to select a numeric value from a continuous or discrete range.
 * Designed according to Material 3 principles, it supports labeled value indicators, tick marks, and
 * snapping behavior.
 *
 * @example
 * The following example illustrates a labelled slider with thumb used to select a single numeric value.
 * ```html
 * <m3e-slider labelled>
 *  <m3e-slider-thumb value="50"></m3e-slider-thumb>
 * </m3e-slider>
 * ```
 *
 * @example
 * The next example illustrates a labelled range slider with two thumbs used to select a minimum and maximum numeric value.
 * ```html
 * <m3e-slider labelled>
 *  <m3e-slider-thumb value="25"></m3e-slider-thumb>
 *  <m3e-slider-thumb value="75"></m3e-slider-thumb>
 * </m3e-slider>
 * ```
 *
 * @example
 * The next example illustrates a vertical slider. Values run bottom-to-top.
 * ```html
 * <m3e-slider orientation="vertical" labelled>
 *  <m3e-slider-thumb value="40"></m3e-slider-thumb>
 * </m3e-slider>
 * ```
 *
 * @tag m3e-slider
 *
 * @slot - Renders the thumbs of the slider.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr discrete - Whether to show tick marks.
 * @attr labelled - Whether to show value labels when activated.
 * @attr max - The maximum allowable value.
 * @attr min - The minimum allowable value.
 * @attr orientation - The orientation of the slider.
 * @attr step - The value at which the thumb will snap.
 * @attr size - The size of the slider.
 *
 * @fires beforeinput - Dispatched before the value of a thumb changes.
 * @fires input - Dispatched when the value of a thumb changes.
 * @fires change - Dispatched when the value of a thumb changes.
 *
 * @cssprop --m3e-slider-min-width - Minimum inline size of the slider host.
 * @cssprop --m3e-slider-small-height - Height of the slider when size is small or extra-small.
 * @cssprop --m3e-slider-medium-height - Height of the slider when size is medium.
 * @cssprop --m3e-slider-large-height - Height of the slider when size is large.
 * @cssprop --m3e-slider-extra-large-height - Height of the slider when size is extra-large.
 * @cssprop --m3e-slider-small-active-track-shape - Corner shape of the active track for small sliders.
 * @cssprop --m3e-slider-small-inactive-active-track-start-shape - Corner shape of the inactive track start for small sliders.
 * @cssprop --m3e-slider-small-inactive-track-end-shape - Corner shape of the inactive track end for small sliders.
 * @cssprop --m3e-slider-medium-active-track-shape - Corner shape of the active track for medium sliders.
 * @cssprop --m3e-slider-medium-inactive-active-track-start-shape - Corner shape of the inactive track start for medium sliders.
 * @cssprop --m3e-slider-medium-inactive-track-end-shape - Corner shape of the inactive track end for medium sliders.
 * @cssprop --m3e-slider-large-active-track-shape - Corner shape of the active track for large sliders.
 * @cssprop --m3e-slider-large-inactive-active-track-start-shape - Corner shape of the inactive track start for large sliders.
 * @cssprop --m3e-slider-large-inactive-track-end-shape - Corner shape of the inactive track end for large sliders.
 * @cssprop --m3e-slider-extra-large-active-track-shape - Corner shape of the active track for extra-large sliders.
 * @cssprop --m3e-slider-extra-large-inactive-active-track-start-shape - Corner shape of the inactive track start for extra-large sliders.
 * @cssprop --m3e-slider-extra-large-inactive-track-end-shape - Corner shape of the inactive track end for extra-large sliders.
 * @cssprop --m3e-slider-extra-small-track-height - Height of the track for extra-small sliders.
 * @cssprop --m3e-slider-small-track-height - Height of the track for small sliders.
 * @cssprop --m3e-slider-medium-track-height - Height of the track for medium sliders.
 * @cssprop --m3e-slider-large-track-height - Height of the track for large sliders.
 * @cssprop --m3e-slider-extra-large-track-height - Height of the track for extra-large sliders.
 * @cssprop --m3e-slider-tick-size - Size of each tick mark.
 * @cssprop --m3e-slider-tick-shape - Corner shape of each tick mark.
 * @cssprop --m3e-slider-inactive-track-color - Background color of the inactive track when enabled.
 * @cssprop --m3e-slider-disabled-inactive-track-color - Base color of the inactive track when disabled.
 * @cssprop --m3e-slider-disabled-inactive-track-opacity - Opacity of the inactive track when disabled.
 * @cssprop --m3e-slider-active-track-color - Background color of the active track when enabled.
 * @cssprop --m3e-slider-disabled-active-track-color - Base color of the active track when disabled.
 * @cssprop --m3e-slider-disabled-active-track-opacity - Opacity of the active track when disabled.
 * @cssprop --m3e-slider-tick-active-color - Color of active ticks when enabled.
 * @cssprop --m3e-slider-disabled-tick-active-color - Color of active ticks when disabled.
 * @cssprop --m3e-slider-tick-inactive-color - Color of inactive ticks when enabled.
 * @cssprop --m3e-slider-disabled-tick-inactive-color - Color of inactive ticks when disabled.
 */
@customElement("m3e-slider")
export class M3eSliderElement extends SupportsDirectionality(AttachInternals(LitElement)) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      vertical-align: middle;
      min-inline-size: var(--m3e-slider-min-width, 200px);
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      line-height: 0;
    }
    :host([hidden]) {
      display: none;
    }
    :host(:not([disabled])) {
      cursor: pointer;
    }
    :host(:is(:state(--extra-small), :--extra-small)),
    :host(:is(:state(--small), :--small)) {
      height: var(--m3e-slider-small-height, 44px);
    }
    :host(:not(:is(:state(--rtl), :--rtl)):is(:state(--extra-small), :--extra-small)) .base,
    :host(:not(:is(:state(--rtl), :--rtl)):is(:state(--small), :--small)) .base {
      --_slider-active-track-shape: var(--m3e-slider-small-active-track-shape, ${DesignToken.shape.corner.smallStart});
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-small-inactive-active-track-start-shape,
        ${DesignToken.shape.corner.smallStart}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-small-inactive-track-end-shape,
        ${DesignToken.shape.corner.smallEnd}
      );
    }
    :host(:is(:state(--rtl), :--rtl):is(:state(--extra-small), :--extra-small)) .base,
    :host(:is(:state(--rtl), :--rtl):is(:state(--small), :--small)) .base {
      --_slider-active-track-shape: var(--m3e-slider-small-active-track-shape, ${DesignToken.shape.corner.smallEnd});
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-small-inactive-active-track-start-shape,
        ${DesignToken.shape.corner.smallEnd}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-small-inactive-track-end-shape,
        ${DesignToken.shape.corner.smallStart}
      );
    }
    :host(:is(:state(--extra-small), :--extra-small)) .track {
      height: calc(var(--m3e-slider-extra-small-track-height, 16px));
    }
    :host(:is(:state(--small), :--small)) .track {
      height: calc(var(--m3e-slider-small-track-height, 24px));
    }
    :host(:is(:state(--medium), :--medium)) {
      height: var(--m3e-slider-medium-height, 52px);
    }
    :host(:not(:is(:state(--rtl), :--rtl)):is(:state(--medium), :--medium)) .base {
      --_slider-active-track-shape: var(
        --m3e-slider-medium-active-track-shape,
        ${DesignToken.shape.corner.mediumStart}
      );
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-medium-inactive-active-track-start-shape,
        ${DesignToken.shape.corner.mediumStart}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-medium-inactive-track-end-shape,
        ${DesignToken.shape.corner.mediumEnd}
      );
    }
    :host(:is(:state(--rtl), :--rtl):is(:state(--medium), :--medium)) .base {
      --_slider-active-track-shape: var(--m3e-slider-medium-active-track-shape, ${DesignToken.shape.corner.mediumEnd});
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-medium-inactive-active-track-start-shape,
        ${DesignToken.shape.corner.mediumEnd}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-medium-inactive-track-end-shape,
        ${DesignToken.shape.corner.mediumStart}
      );
    }
    :host(:is(:state(--medium), :--medium)) .track {
      height: var(--m3e-slider-medium-track-height, 40px);
    }
    :host(:is(:state(--large), :--large)) {
      height: var(--m3e-slider-large-height, 68px);
    }
    :host(:not(:is(:state(--rtl), :--rtl)):is(:state(--large), :--large)) .base {
      --_slider-active-track-shape: var(--m3e-slider-large-active-track-shape, ${DesignToken.shape.corner.largeStart});
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-large-inactive-active-track-start-shape,
        ${DesignToken.shape.corner.largeStart}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-large-inactive-track-end-shape,
        ${DesignToken.shape.corner.largeEnd}
      );
    }
    :host(:is(:state(--rtl), :--rtl):is(:state(--large), :--large)) .base {
      --_slider-active-track-shape: var(--m3e-slider-large-active-track-shape, ${DesignToken.shape.corner.largeEnd});
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-large-inactive-active-track-start-shape,
        ${DesignToken.shape.corner.largeEnd}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-large-inactive-track-end-shape,
        ${DesignToken.shape.corner.largeStart}
      );
    }
    :host(:is(:state(--large), :--large)) .track {
      height: var(--m3e-slider-large-track-height, 56px);
    }
    :host(:is(:state(--extra-large), :--extra-large)) {
      height: var(--m3e-slider-extra-large-height, 108px);
    }
    :host(:not(:is(:state(--rtl), :--rtl)):is(:state(--extra-large), :--extra-large)) .base {
      --_slider-active-track-shape: var(
        --m3e-slider-extra-large-active-track-shape,
        ${DesignToken.shape.corner.extraLargeStart}
      );
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-extra-large-inactive-active-track-start-shape,
        ${DesignToken.shape.corner.extraLargeStart}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-extra-large-inactive-track-end-shape,
        ${DesignToken.shape.corner.extraLargeEnd}
      );
    }
    :host(:is(:state(--rtl), :--rtl):is(:state(--extra-large), :--extra-large)) .base {
      --_slider-active-track-shape: var(
        --m3e-slider-extra-large-active-track-shape,
        ${DesignToken.shape.corner.extraLargeEnd}
      );
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-extra-large-inactive-active-track-start-shape,
        ${DesignToken.shape.corner.extraLargeEnd}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-extra-large-inactive-track-end-shape,
        ${DesignToken.shape.corner.extraLargeStart}
      );
    }
    :host(:is(:state(--extra-large), :--extra-large)) .track {
      height: var(--m3e-slider-extra-large-track-height, 96px);
    }
    :host(:is(:state(--animating), :--animating)) .track-active,
    :host(:is(:state(--animating), :--animating)) .track-inactive.start,
    :host(:is(:state(--animating), :--animating)) .track-inactive.end {
      transition: ${unsafeCSS(`margin-inline-start ${DesignToken.motion.spring.fastEffects},
        width ${DesignToken.motion.spring.fastEffects}`)};
    }
    .base {
      contain: layout style;
      display: inline-flex;
      align-items: center;
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      outline: none;
      touch-action: none;
    }
    .track {
      contain: layout style paint;
      position: relative;
      flex: 1 1 auto;
      touch-action: none;
    }
    .track-inactive,
    .track-active {
      contain: layout style paint;
      position: absolute;
      height: 100%;
      touch-action: none;
    }
    .track-active {
      margin-inline-start: var(--_slider-active-track-offset, 0px);
      width: var(--_slider-active-track-size, 0px);
      border-radius: var(--_slider-active-track-middle-shape, var(--_slider-active-track-shape));
    }
    .track-inactive.start {
      width: var(--_slider-inactive-track-before-size, 0px);
      border-radius: var(--_slider-inactive-track-start-shape);
    }
    .track-inactive.end {
      margin-inline-start: var(--_slider-inactive-track-after-offset, 0px);
      width: var(--_slider-inactive-track-after-size, 0px);
      border-radius: var(--_slider-inactive-track-end-shape);
    }
    .ticks {
      position: absolute;
      width: 100%;
      height: var(--m3e-slider-tick-size, 4px);
      overflow: visible;
      touch-action: none;
    }
    .tick {
      position: absolute;
      top: 0;
      touch-action: none;
      inset-inline-start: calc(var(--m3e-slider-tick-size, 4px) + calc(var(--m3e-slider-tick-size, 4px) / 2));
      width: var(--m3e-slider-tick-size, 4px);
      height: var(--m3e-slider-tick-size, 4px);
      border-radius: var(--m3e-slider-tick-shape, ${DesignToken.shape.corner.full});
    }
    .tick.hidden {
      visibility: hidden;
    }
    :host(:not([disabled])) .track-inactive {
      background-color: var(--m3e-slider-inactive-track-color, ${DesignToken.color.secondaryContainer});
    }
    :host([disabled]) .track-inactive {
      background-color: color-mix(
        in srgb,
        var(--m3e-slider-disabled-inactive-track-color, ${DesignToken.color.onSurface})
          var(--m3e-slider-disabled-inactive-track-opacity, 12%),
        transparent
      );
    }
    :host(:not([disabled])) .track-active {
      background-color: var(--m3e-slider-active-track-color, ${DesignToken.color.primary});
    }
    :host([disabled]) .track-active {
      background-color: color-mix(
        in srgb,
        var(--m3e-slider-disabled-active-track-color, ${DesignToken.color.onSurface})
          var(--m3e-slider-disabled-active-track-opacity, 38%),
        transparent
      );
    }
    :host(:not([disabled])) .tick.active {
      background-color: var(--m3e-slider-tick-active-color, ${DesignToken.color.onPrimary});
    }
    :host([disabled]) .tick.active {
      background-color: var(--m3e-slider-disabled-tick-active-color, ${DesignToken.color.inverseOnSurface});
    }
    :host(:not([disabled])) .tick.inactive {
      background-color: var(--m3e-slider-tick-inactive-color, ${DesignToken.color.onSecondaryContainer});
    }
    :host([disabled]) .tick.inactive {
      background-color: var(--m3e-slider-disabled-tick-inactive-color, ${DesignToken.color.onSurface});
    }
    :host(:not([discrete])) .tick.active {
      display: none;
    }
    :host(:hover[labelled]) .base,
    :host(:focus-within[labelled]) .base {
      --_slider-label-visibility: visible;
      --_slider-label-opacity: 1;
      --_slider-label-transform: scale(1);
    }
    @media (forced-colors: active) {
      :host(:not([disabled])) .track-inactive {
        background-color: unset;
      }
      :host(:not([disabled])) .base.range .track-inactive.start,
      :host(:not([disabled])) .track-inactive.end {
        border: 1px solid CanvasText;
        box-sizing: border-box;
      }
      :host(:not([disabled])) .tick.inactive {
        background-color: CanvasText;
      }
      :host(:not([disabled])) .tick.active {
        background-color: Canvas;
      }
      :host(:not([disabled])) .track-active {
        background-color: CanvasText;
      }
      :host([disabled]) .base.range .track-inactive.start,
      :host([disabled]) .track-inactive.end {
        border: 1px solid GrayText;
        box-sizing: border-box;
      }
      :host([disabled]) .track-active {
        background-color: GrayText;
      }
      :host([disabled]) .tick.inactive {
        background-color: GrayText;
      }
      :host([disabled]) .tick.active {
        background-color: Canvas;
      }
    }

    /* ── Vertical orientation ────────────────────────────────────────────────
       Everything above lays the slider out along the inline axis. These rules
       re-map it to the block axis and are deliberately additive: they come last
       and so win on source order, which keeps the horizontal path untouched.

       Segments are anchored with bottom rather than margin-inline-start because a
       vertical slider runs bottom-to-top, so the offsets the element writes —
       measured from the end holding the minimum — already point the right way.
       The five --_slider-* custom properties are plain lengths and need no
       change; only the property they feed does.

       Corner radii are composed from the symmetric corner tokens rather than the
       Start/End ones, whose 4-value radii round the inline edges. */
    :host(:is(:state(--vertical), :--vertical)) {
      min-inline-size: auto;
      min-block-size: var(--m3e-slider-min-width, 200px);
      /* Containing block for .base below. */
      position: relative;
    }
    /* .base is taken out of flow rather than sized with height: 100%. A vertical
       host has no definite block size of its own - its height comes from
       min-block-size, from a flex parent, or from the consumer - and a percentage
       height resolves against the parent's *computed* height, which is auto. That
       collapses .base to zero and takes the track and both thumbs with it, since
       .base is their containing block. Insets resolve against the used height, so
       they work in every case. */
    :host(:is(:state(--vertical), :--vertical)) .base {
      position: absolute;
      inset: 0;
      width: auto;
      height: auto;
      flex-direction: column;
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--extra-small), :--extra-small)),
    :host(:is(:state(--vertical), :--vertical):is(:state(--small), :--small)) {
      height: auto;
      width: var(--m3e-slider-small-height, 44px);
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--extra-small), :--extra-small)) .track {
      height: auto;
      width: calc(var(--m3e-slider-extra-small-track-height, 16px));
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--small), :--small)) .track {
      height: auto;
      width: calc(var(--m3e-slider-small-track-height, 24px));
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--medium), :--medium)) {
      height: auto;
      width: var(--m3e-slider-medium-height, 52px);
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--medium), :--medium)) .track {
      height: auto;
      width: var(--m3e-slider-medium-track-height, 40px);
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--large), :--large)) {
      height: auto;
      width: var(--m3e-slider-large-height, 68px);
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--large), :--large)) .track {
      height: auto;
      width: var(--m3e-slider-large-track-height, 56px);
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--extra-large), :--extra-large)) {
      height: auto;
      width: var(--m3e-slider-extra-large-height, 108px);
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--extra-large), :--extra-large)) .track {
      height: auto;
      width: var(--m3e-slider-extra-large-track-height, 96px);
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--extra-small), :--extra-small)) .base {
      --_slider-active-track-shape: var(
        --m3e-slider-extra-small-active-track-shape,
        0 0 ${DesignToken.shape.corner.small} ${DesignToken.shape.corner.small}
      );
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-extra-small-inactive-active-track-start-shape,
        0 0 ${DesignToken.shape.corner.small} ${DesignToken.shape.corner.small}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-extra-small-inactive-track-end-shape,
        ${DesignToken.shape.corner.small} ${DesignToken.shape.corner.small} 0 0
      );
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--small), :--small)) .base {
      --_slider-active-track-shape: var(
        --m3e-slider-small-active-track-shape,
        0 0 ${DesignToken.shape.corner.small} ${DesignToken.shape.corner.small}
      );
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-small-inactive-active-track-start-shape,
        0 0 ${DesignToken.shape.corner.small} ${DesignToken.shape.corner.small}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-small-inactive-track-end-shape,
        ${DesignToken.shape.corner.small} ${DesignToken.shape.corner.small} 0 0
      );
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--medium), :--medium)) .base {
      --_slider-active-track-shape: var(
        --m3e-slider-medium-active-track-shape,
        0 0 ${DesignToken.shape.corner.medium} ${DesignToken.shape.corner.medium}
      );
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-medium-inactive-active-track-start-shape,
        0 0 ${DesignToken.shape.corner.medium} ${DesignToken.shape.corner.medium}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-medium-inactive-track-end-shape,
        ${DesignToken.shape.corner.medium} ${DesignToken.shape.corner.medium} 0 0
      );
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--large), :--large)) .base {
      --_slider-active-track-shape: var(
        --m3e-slider-large-active-track-shape,
        0 0 ${DesignToken.shape.corner.large} ${DesignToken.shape.corner.large}
      );
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-large-inactive-active-track-start-shape,
        0 0 ${DesignToken.shape.corner.large} ${DesignToken.shape.corner.large}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-large-inactive-track-end-shape,
        ${DesignToken.shape.corner.large} ${DesignToken.shape.corner.large} 0 0
      );
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--extra-large), :--extra-large)) .base {
      --_slider-active-track-shape: var(
        --m3e-slider-extra-large-active-track-shape,
        0 0 ${DesignToken.shape.corner.extraLarge} ${DesignToken.shape.corner.extraLarge}
      );
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-extra-large-inactive-active-track-start-shape,
        0 0 ${DesignToken.shape.corner.extraLarge} ${DesignToken.shape.corner.extraLarge}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-extra-large-inactive-track-end-shape,
        ${DesignToken.shape.corner.extraLarge} ${DesignToken.shape.corner.extraLarge} 0 0
      );
    }
    :host(:is(:state(--vertical), :--vertical)) .track-inactive,
    :host(:is(:state(--vertical), :--vertical)) .track-active {
      width: 100%;
      height: auto;
      margin-inline-start: 0;
    }
    :host(:is(:state(--vertical), :--vertical)) .track-active {
      bottom: var(--_slider-active-track-offset, 0px);
      height: var(--_slider-active-track-size, 0px);
    }
    :host(:is(:state(--vertical), :--vertical)) .track-inactive.start {
      bottom: 0;
      height: var(--_slider-inactive-track-before-size, 0px);
    }
    :host(:is(:state(--vertical), :--vertical)) .track-inactive.end {
      bottom: var(--_slider-inactive-track-after-offset, 0px);
      height: var(--_slider-inactive-track-after-size, 0px);
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--animating), :--animating)) .track-active,
    :host(:is(:state(--vertical), :--vertical):is(:state(--animating), :--animating)) .track-inactive.start,
    :host(:is(:state(--vertical), :--vertical):is(:state(--animating), :--animating)) .track-inactive.end {
      transition: ${unsafeCSS(`bottom ${DesignToken.motion.spring.fastEffects},
        height ${DesignToken.motion.spring.fastEffects}`)};
    }
    :host(:is(:state(--vertical), :--vertical)) .ticks {
      width: var(--m3e-slider-tick-size, 4px);
      height: 100%;
    }
    :host(:is(:state(--vertical), :--vertical)) .tick {
      top: auto;
      inset-inline-start: 0;
      bottom: calc(var(--m3e-slider-tick-size, 4px) + calc(var(--m3e-slider-tick-size, 4px) / 2));
    }
  `;

  /** @private */ #directionalitySubscription?: () => void;

  /** @private */
  @query(".base") private readonly _base?: HTMLElement;

  /** @private */
  @state() private _ticks = new Array<{ value: number; active: boolean; hidden: boolean }>();

  /** @private */ readonly #changedThumbs = new Set<M3eSliderThumbElement>();
  /** @private */ #thumbs = new Array<M3eSliderThumbElement>();
  /** @private */ #activeThumb?: M3eSliderThumbElement;
  /** @private Extent of the slider along its own axis. */ #cachedSize = 0;
  /** @private Extent of a thumb along the slider's axis. */ #cachedThumbSize = 0;
  /** @private Client coordinate of the axis start edge — left when horizontal, top when vertical. */
  #cachedClientStart = 0;
  /** @private Client coordinate of the axis end edge — right when horizontal, bottom when vertical. */
  #cachedClientEnd = 0;
  /** @private Extent of the slider's bounding rect along its own axis. */ #cachedClientSize = 0;
  /** @private */ #lastThumbMoveTimestamp = 0;

  constructor() {
    super();
    new ResizeController(this, { callback: () => this.#updateDimensions(true) });
  }

  /**
   * The orientation of the slider.
   * @default "horizontal"
   */
  @property({ reflect: true, useDefault: true })
  orientation: SliderOrientation = "horizontal";

  /**
   * The size of the slider.
   * @default "extra-small"
   */
  @property({ reflect: true, useDefault: true }) size: SliderSize = "extra-small";

  /**
   * Whether the element is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether to show tick marks.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) discrete = false;

  /**
   * The minimum allowable value.
   * @default 0
   */
  @property({ type: Number }) min = 0;

  /**
   * The maximum allowable value.
   * @default 100
   */
  @property({ type: Number }) max = 100;

  /**
   * The value at which the thumb will snap.
   * @default 1
   */
  @property({ type: Number }) step = 1;

  /**
   * Whether to show value labels when activated.
   * @default false
   */
  @property({ type: Boolean }) labelled = false;

  /** The function used to format display values. */
  @property({ attribute: false }) displayWith: ((value: number | null) => string) | null = null;

  /**
   * Whether the slider is laid out along the block axis.
   * @private
   */
  get #vertical(): boolean {
    return this.orientation === "vertical";
  }

  /** The thumbs used to select values. */
  get thumbs(): readonly M3eSliderThumbElement[] {
    return this.#thumbs;
  }

  /** Whether the slider is a range slider. */
  get isRange(): boolean {
    return this.#thumbs.length > 1;
  }

  /** The thumb used to select a value. */
  get thumb(): M3eSliderThumbElement | null {
    return this.#thumbs[0] ?? null;
  }

  /** The thumb used to select the lower value of a range slider. */
  get lowerThumb(): M3eSliderThumbElement | null {
    return this.thumb;
  }

  /** The thumb used to select the upper value of a range slider. */
  get upperThumb(): M3eSliderThumbElement | null {
    return this.#thumbs[1] ?? null;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.#applySize();
    this.#applyOrientation();
    this.#directionalitySubscription = M3eDirectionality.observe(() => {
      this.#updateDimensions(true);
      this.requestUpdate();
    });
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#changedThumbs.clear();
    this.#directionalitySubscription?.();
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("size")) {
      this.#applySize();
    }
    if (_changedProperties.has("orientation")) {
      this.#applyOrientation();
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("disabled")) {
      this.#thumbs.forEach((x) => (x.disabled = this.disabled));
    }
    if (_changedProperties.has("orientation")) {
      // The axis changed, so every cached measurement and every thumb transform
      // now describes the wrong one.
      this.#updateThumbs();
      this.#updateDimensions(true);
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div
      class="base"
      tabindex="${ifDefined(!this.disabled ? "-1" : undefined)}"
      @pointerdown=${this.#handlePointerDown}
      @pointermove=${this.#handlePointerMove}
      @pointerup=${this.#handlePointerUp}
      @keydown=${this.#handleKeyDown}
      @keyup=${this.#handleKeyUp}
      @value-change=${this.#handleThumbChange}
    >
      <div class="track" aria-hidden="true">
        <div class="track-inactive start"></div>
        <div class="track-active"></div>
        <div class="track-inactive end"></div>
      </div>
      <div class="ticks" aria-hidden="true">${this._ticks.map((x) => this.#renderTick(x))}</div>
      <slot @slotchange=${this.#handleSlotChange}></slot>
    </div>`;
  }

  /** @private */
  #applySize(): void {
    if (!isSliderSize(this.size)) {
      this.size = "extra-small";
    }
    setCustomEnumState(this, this.size, "extra-large", "extra-small", "large", "medium", "small");
  }

  /** @private */
  #applyOrientation(): void {
    if (!isSliderOrientation(this.orientation)) {
      this.orientation = "horizontal";
    }
    setCustomEnumState(this, this.orientation, "horizontal", "vertical");
  }

  /** @private */
  #renderTick(tick: { value: number; active: boolean; hidden: boolean }) {
    return html`<div
      class="tick ${tick.active ? "active" : "inactive"}${tick.hidden ? " hidden" : ""}"
      style="${safeStyleMap({
        transform: this.#translate(this.#pointFromValue(tick.value)),
      })}"
    ></div>`;
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    this.#thumbs = (<HTMLSlotElement>e.target)
      .assignedElements({ flatten: true })
      .filter((x) => x instanceof M3eSliderThumbElement);

    if (this.#thumbs.length > 2) {
      this.#thumbs.length = 2;
    }
    if (this.isRange) {
      this._base?.style.setProperty("--_slider-active-track-middle-shape", `0`);
    } else {
      this._base?.style.removeProperty("--_slider-active-track-middle-shape");
    }

    this.#updateThumbs();
  }

  /** @private */
  #updateThumbs(): void {
    this.#thumbs.forEach((thumb, i) => {
      if (this.disabled) {
        thumb.disabled = true;
      }
      thumb.ariaValueMin = `${this.#thumbs[i - 1]?.value ?? this.min}`;
      thumb.ariaValueMax = `${this.#thumbs[i + 1]?.value ?? this.max}`;
      thumb.ariaValueNow = `${thumb.value ?? this.#thumbs[i - 1]?.value ?? this.min}`;
      thumb.ariaOrientation = this.orientation;

      // The thumb is slotted light DOM, so its own stylesheet cannot select on the
      // slider's orientation. A custom state carries it across.
      if (this.#vertical) {
        addCustomState(thumb, "--vertical");
      } else {
        deleteCustomState(thumb, "--vertical");
      }
    });
  }

  /**
   * Positions an element `pos` along the slider's axis, measured from the end that
   * holds `min`. Vertical sliders run bottom-to-top, so the offset is negated and
   * directionality does not apply.
   * @private
   */
  #translate(pos: number): string {
    return this.#vertical
      ? `translate(0, ${-pos}px)`
      : `translate(${M3eDirectionality.current === "rtl" ? -pos : pos}px, 0)`;
  }

  /** @private */
  #pointFromValue(value: number): number {
    return (this.#cachedSize - this.#cachedThumbSize) * ((value - this.min) / (this.max - this.min));
  }

  /** @private */
  #valueFromPoint(e: PointerEvent): number {
    // The axis end holds `min` for a vertical slider, as it does in rtl.
    const pos =
      this.#vertical || M3eDirectionality.current === "rtl"
        ? this.#cachedClientEnd - (this.#vertical ? e.clientY : e.clientX)
        : e.clientX - this.#cachedClientStart;

    const step = this.step === 0 ? 1 : this.step;
    const numSteps = Math.floor((this.max - this.min) / step);

    const thumbRatio = this.#cachedSize ? this.#cachedThumbSize / this.#cachedSize : 0;
    const percentage = (pos / this.#cachedClientSize - thumbRatio / 2) / (1 - thumbRatio || 1);

    const fixedPercentage = Math.round(percentage * numSteps) / numSteps;
    const impreciseValue = fixedPercentage * (this.max - this.min) + this.min;
    return Math.round(impreciseValue / step) * step;
  }

  /** @private */
  #updateCachedDimensions(force = false): void {
    if (!this.lowerThumb) return;

    const size = this.#vertical ? this.clientHeight : this.clientWidth;
    const thumbSize = this.#vertical ? this.lowerThumb.clientHeight : this.lowerThumb.clientWidth;

    this.#cachedSize = !force && this.#cachedSize > 0 ? this.#cachedSize : size;
    this.#cachedThumbSize = !force && this.#cachedThumbSize > 0 ? this.#cachedThumbSize : thumbSize;

    const rect = this.getBoundingClientRect();
    const clientStart = this.#vertical ? rect.top : rect.left;
    const clientEnd = this.#vertical ? rect.bottom : rect.right;
    const clientSize = this.#vertical ? rect.height : rect.width;

    this.#cachedClientStart = !force && this.#cachedClientStart > 0 ? this.#cachedClientStart : clientStart;
    this.#cachedClientEnd = !force && this.#cachedClientEnd > 0 ? this.#cachedClientEnd : clientEnd;
    this.#cachedClientSize = !force && this.#cachedClientSize > 0 ? this.#cachedClientSize : clientSize;
  }

  /** @private */
  #updateDimensions(force = false): void {
    this.#updateCachedDimensions(force);
    if (!this.lowerThumb) return;

    const lowerValue = this.lowerThumb.value ?? this.min;
    const lowerPos = this.#pointFromValue(lowerValue);
    this.lowerThumb.style.transform = this.#translate(lowerPos);

    if (!this.upperThumb) {
      this._base?.classList.toggle("range", false);
      this._base?.style.setProperty("--_slider-active-track-size", `${lowerPos}px`);
      this._base?.style.setProperty("--_slider-inactive-track-after-offset", `${lowerPos + this.#cachedThumbSize}px`);
      this._base?.style.setProperty(
        "--_slider-inactive-track-after-size",
        `${this.#cachedSize - lowerPos - this.#cachedThumbSize}px`,
      );

      this.#updateTicks((i) => i < lowerValue);
    } else {
      const upperValue = this.upperThumb.value ?? lowerValue;
      const upperPos = this.#pointFromValue(upperValue);
      this.upperThumb.style.transform = this.#translate(upperPos);

      this._base?.classList.toggle("range", true);
      this._base?.style.setProperty("--_slider-inactive-track-before-size", `${lowerPos}px`);
      this._base?.style.setProperty("--_slider-active-track-offset", `${lowerPos + this.#cachedThumbSize}px`);
      this._base?.style.setProperty("--_slider-active-track-size", `${upperPos - lowerPos - this.#cachedThumbSize}px`);
      this._base?.style.setProperty("--_slider-inactive-track-after-offset", `${upperPos + this.#cachedThumbSize}px`);
      this._base?.style.setProperty(
        "--_slider-inactive-track-after-size",
        `${this.#cachedSize - this.#cachedThumbSize - upperPos}px`,
      );

      this.#updateTicks((i) => i > lowerValue && i < upperValue);
    }
  }

  /** @private */
  #updateTicks(active: (value: number) => boolean): void {
    this._ticks = [];
    if (this.discrete && this.step > 1) {
      for (let i = this.min; i <= this.max; i += this.step) {
        this._ticks.push({ value: i, active: active(i), hidden: false });
      }
    } else {
      this._ticks.push({ value: this.min, active: active(this.min), hidden: false });
      if (this.min < 0 && this.max > 0) {
        this._ticks.push({ value: 0, active: active(0), hidden: false });
      }
      this._ticks.push({ value: this.max, active: active(this.max), hidden: false });
    }
    this.#updateTickOverlap();
  }

  /** @private */
  #updateTickOverlap(): void {
    if (this.#cachedSize === 0 || this.#cachedThumbSize === 0) return;
    const thumbs = this.#thumbs.filter((t) => t.value != null);
    if (thumbs.length === 0) return;
    const thumbHalfWidth = this.#cachedThumbSize / 2;
    this._ticks = this._ticks.map((tick) => {
      const tickPos = this.#pointFromValue(tick.value);
      const hidden = thumbs.some((thumb) => {
        const thumbPos = this.#pointFromValue(thumb.value!);
        return Math.abs(tickPos - thumbPos) < thumbHalfWidth;
      });
      return { ...tick, hidden };
    });
  }

  /** @private */
  #handlePointerDown(e: PointerEvent): void {
    this.#updateCachedDimensions(true);

    if (e.pointerType === "mouse" && e.button > 1) return;
    if (!this.lowerThumb || this.disabled) return;

    if (e.target instanceof HTMLElement) {
      e.target.setPointerCapture(e.pointerId);
    }

    this.#changedThumbs.clear();
    this.#lastThumbMoveTimestamp = e.timeStamp;

    this.#activeThumb = e.composedPath().find((x) => x instanceof M3eSliderThumbElement);

    if (this.#activeThumb) {
      return;
    }

    const value = this.#valueFromPoint(e);
    let min = this.min;
    let max = this.max;

    if (this.#activeThumb === this.upperThumb) {
      min = Math.max(min, this.lowerThumb?.value ?? 0);
    } else if (this.upperThumb) {
      max = Math.min(max, this.upperThumb.value ?? this.max);
    }

    if (!this.upperThumb) {
      if (!this.lowerThumb.disabled) {
        this.#changeThumb(this.lowerThumb, Math.min(max, Math.max(min, value)), true);
        this.#activeThumb = this.lowerThumb;
      }
    } else {
      const lowerValue = this.lowerThumb.value ?? this.min;
      const upperValue = this.upperThumb.value ?? lowerValue;

      if (value < lowerValue) {
        if (!this.lowerThumb.disabled) {
          this.#changeThumb(this.lowerThumb, Math.min(max, Math.max(min, value)), true);
          this.#activeThumb = this.lowerThumb;
        }
      } else if (value > upperValue) {
        if (!this.upperThumb.disabled) {
          this.#changeThumb(this.upperThumb, Math.min(max, Math.max(min, value)), true);
          this.#activeThumb = this.upperThumb;
        }
      } else {
        const mid = (lowerValue + upperValue) / 2;
        if (value < mid && !this.lowerThumb.disabled) {
          this.#changeThumb(this.lowerThumb, Math.min(max, Math.max(min, value)), true);
          this.#activeThumb = this.lowerThumb;
        } else if (!this.upperThumb.disabled) {
          this.#changeThumb(this.upperThumb, Math.min(max, Math.max(min, value)), true);
          this.#activeThumb = this.upperThumb;
        }
      }
    }
  }

  /** @private */
  #handlePointerMove(e: PointerEvent): void {
    if (
      !(e.target instanceof HTMLElement) ||
      !e.target.hasPointerCapture(e.pointerId) ||
      !this.#activeThumb ||
      this.#activeThumb.disabled
    ) {
      return;
    }

    let value = this.#valueFromPoint(e);
    let min = this.min;
    let max = this.max;

    if (this.#activeThumb === this.upperThumb) {
      min = Math.max(min, this.lowerThumb?.value ?? 0);
    } else if (this.upperThumb) {
      max = Math.min(max, this.upperThumb.value ?? this.max);
    }

    value = Math.min(max, Math.max(min, value));
    if (value === this.#activeThumb.value) {
      return;
    }

    // Only animate value change when there are steps and drag speed occurs past a tolerance.
    // Tolerance is based on visual impact to transitions during fast drag operations.

    const effectiveStep = this.step === 0 ? 1 : this.step;
    let animate = effectiveStep !== 1;

    if (animate) {
      for (const coalescedEvent of e.getCoalescedEvents()) {
        if (coalescedEvent.timeStamp - this.#lastThumbMoveTimestamp < 90) {
          animate = false;
        }
        this.#lastThumbMoveTimestamp = coalescedEvent.timeStamp;
      }
    }

    if (!animate) {
      if (hasCustomState(this, "--animating")) {
        deleteCustomState(this, "--animating");
        this.#activeThumb.style.transition = "";
      }
    }

    this.#changeThumb(this.#activeThumb, value, animate);
  }

  /** @private */
  #handlePointerUp(e: PointerEvent): void {
    if (e.pointerType === "mouse" && e.button > 1) return;
    if (!this.lowerThumb || this.disabled) return;

    if (e.target instanceof HTMLElement) {
      e.target.releasePointerCapture(e.pointerId);
    }

    this.#lastThumbMoveTimestamp = 0;

    if (this.#activeThumb && !this.#activeThumb.disabled) {
      this.#commitThumb(this.#activeThumb);
      this.#activeThumb.focus();
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    this.#activeThumb = e.composedPath().find((x) => x instanceof M3eSliderThumbElement);

    if (!this.#activeThumb) return;

    const value = this.#activeThumb.value ?? 0;

    let min = this.min;
    let max = this.max;

    if (this.#activeThumb === this.upperThumb) {
      min = Math.max(min, this.lowerThumb?.value ?? 0);
    } else if (this.upperThumb) {
      max = Math.max(max, this.upperThumb.value ?? this.max);
    }

    // A vertical slider runs bottom-to-top, so ArrowUp always increases and
    // directionality — an inline-axis concern — does not apply.
    const ascending = this.#vertical || M3eDirectionality.current === "ltr";

    switch (e.key) {
      case "Home":
        this.#changeThumb(this.#activeThumb, min);
        e.preventDefault();
        break;

      case "End":
        this.#changeThumb(this.#activeThumb, max);
        e.preventDefault();
        break;

      case "PageUp":
        if (ascending) {
          this.#changeThumb(this.#activeThumb, Math.min(max, value + (this.step > 1 ? this.step : 10)));
        } else {
          this.#changeThumb(this.#activeThumb, Math.max(min, value - (this.step > 1 ? this.step : 10)));
        }

        e.preventDefault();
        break;

      case "PageDown":
        if (ascending) {
          this.#changeThumb(this.#activeThumb, Math.max(min, value - (this.step > 1 ? this.step : 10)));
        } else {
          this.#changeThumb(this.#activeThumb, Math.min(max, value + (this.step > 1 ? this.step : 10)));
        }
        e.preventDefault();
        break;

      case "Down":
      case "ArrowDown":
      case "Left":
      case "ArrowLeft":
        if (ascending) {
          this.#changeThumb(this.#activeThumb, Math.max(min, value - this.step));
        } else {
          this.#changeThumb(this.#activeThumb, Math.min(max, value + this.step));
        }

        e.preventDefault();

        break;

      case "Up":
      case "ArrowUp":
      case "Right":
      case "ArrowRight":
        if (ascending) {
          this.#changeThumb(this.#activeThumb, Math.min(max, value + this.step));
        } else {
          this.#changeThumb(this.#activeThumb, Math.max(min, value - this.step));
        }

        e.preventDefault();
        break;

      case " ":
        e.preventDefault();
        break;
    }
  }

  /** @private */
  #handleKeyUp(e: KeyboardEvent): void {
    const activeThumb = e.composedPath().find((x) => x instanceof M3eSliderThumbElement);
    if (activeThumb) {
      this.#commitThumb(activeThumb);
    }
  }

  /** @private */
  #handleThumbChange(e: Event): void {
    e.stopPropagation();
    this.#updateThumbs();
    this.#updateDimensions();
  }

  /** @private */
  #changeThumb(thumb: M3eSliderThumbElement, value: number, animate = false): void {
    if (thumb.value === value) return;

    if (thumb.dispatchEvent(new Event("beforeinput", { bubbles: true, cancelable: true }))) {
      if (animate && !prefersReducedMotion()) {
        addCustomState(this, "--animating");
        thumb.addEventListener(
          "transitionend",
          () => {
            thumb.style.transition = "";
            deleteCustomState(this, "--animating");
          },
          { once: true },
        );
        thumb.style.transition = `transform ${DesignToken.motion.spring.fastEffects}`;
      }
      this.#changedThumbs.add(thumb);
      thumb.value = value;
      thumb.markAsDirty();
      thumb.markAsTouched();
      thumb.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  /** @private */
  #commitThumb(thumb: M3eSliderThumbElement): void {
    if (this.#changedThumbs.has(thumb)) {
      thumb.dispatchEvent(new Event("change", { bubbles: true }));
      this.#changedThumbs.delete(thumb);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-slider": M3eSliderElement;
  }
}
