import { css, CSSResultGroup, html, LitElement, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";

import { customElement, DesignToken, Role } from "@m3e/web/core";
import { M3eDirectionality } from "@m3e/web/core/bidi";

import { TimepickerOrientation } from "./TimepickerOrientation";
import { TimepickerPeriod } from "./TimepickerPeriod";

/** @internal An internal element responsible for selecting a time period (AM/PM). */
@customElement("m3e-timepicker-input-period-toggle")
export class M3eTimepickerInputPeriodToggleElement extends Role(LitElement, "radiogroup") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    .base {
      contain: layout style;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-radius: var(--m3e-timepicker-input-period-toggle-shape, ${DesignToken.shape.corner.small});
      border: var(--m3e-timepicker-input-period-toggle-outline-thickness, 1px) solid
        var(--m3e-timepicker-input-period-toggle-outline-color, ${DesignToken.color.outline});
    }
    :host([orientation="vertical"]) {
      height: var(--m3e-timepicker-input-period-toggle-vertical-height, 5rem);
      width: var(--m3e-timepicker-input-period-toggle-vertical-width, 3.25rem);
    }
    :host([orientation="vertical"]) .base {
      flex-direction: column;
    }
    :host([orientation="horizontal"]) {
      height: var(--m3e-timepicker-input-period-toggle-horizontal-height, 2.375rem);
      width: var(--m3e-timepicker-input-period-toggle-horizontal-width, 13.5rem);
    }
    .period-button {
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      cursor: pointer;
      position: relative;
      transition: ${unsafeCSS(
        `background-color color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard},
        color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`,
      )};
      font-size: var(
        --m3e-timepicker-input-period-toggle-label-font-size,
        ${DesignToken.typescale.standard.title.medium.fontSize}
      );
      font-weight: var(
        --m3e-timepicker-input-period-toggle-label-font-weight,
        ${DesignToken.typescale.standard.title.medium.fontWeight}
      );
      line-height: var(
        --m3e-timepicker-input-period-toggle-label-line-height,
        ${DesignToken.typescale.standard.title.medium.lineHeight}
      );
      letter-spacing: var(
        --m3e-timepicker-input-period-toggle-label-tracking,
        ${DesignToken.typescale.standard.title.medium.tracking}
      );
    }
    :host([orientation="vertical"]) .period-button {
      height: 50%;
      width: 100%;
    }
    :host([orientation="horizontal"]) .period-button {
      height: 100%;
      width: 50%;
    }
    :host([orientation="vertical"]) .period-button:first-child {
      border-start-start-radius: inherit;
      border-start-end-radius: inherit;
    }
    :host([orientation="horizontal"]) .period-button:first-child {
      border-start-start-radius: inherit;
      border-end-start-radius: inherit;
    }
    .divider {
      flex: none;
    }
    :host([orientation="vertical"]) .divider {
      width: 100%;
      border-bottom: var(--m3e-timepicker-input-period-toggle-outline-thickness, 1px) solid
        var(--m3e-timepicker-input-period-toggle-outline-color, ${DesignToken.color.outline});
    }
    :host([orientation="horizontal"]) .divider {
      height: 100%;
      border-inline-end: var(--m3e-timepicker-input-period-toggle-outline-thickness, 1px) solid
        var(--m3e-timepicker-input-period-toggle-outline-color, ${DesignToken.color.outline});
    }
    :host([orientation="vertical"]) .period-button:last-child {
      border-end-start-radius: inherit;
      border-end-end-radius: inherit;
    }
    :host([orientation="horizontal"]) .period-button:last-child {
      border-start-end-radius: inherit;
      border-end-end-radius: inherit;
    }
    .period-button[aria-checked="true"] {
      background-color: var(
        --m3e-timepicker-input-period-toggle-selected-container-color,
        ${DesignToken.color.tertiaryContainer}
      );
      color: var(--m3e-timepicker-input-period-toggle-selected-label-color, ${DesignToken.color.onTertiaryContainer});
      --m3e-state-layer-hover-color: var(
        --m3e-timepicker-input-period-toggle-selected-hover-state-layer-color,
        ${DesignToken.color.onTertiaryContainer}
      );
      --m3e-state-layer-focus-color: var(
        --m3e-timepicker-input-period-toggle-selected-focus-state-layer-color,
        ${DesignToken.color.onTertiaryContainer}
      );
      --m3e-ripple-color: var(
        --m3e-timepicker-input-period-toggle-selected-pressed-state-layer-color,
        ${DesignToken.color.onTertiaryContainer}
      );
    }
    .period-button[aria-checked="false"] {
      color: var(--m3e-timepicker-input-period-toggle-unselected-label-color, ${DesignToken.color.onSurfaceVariant});
      --m3e-state-layer-hover-color: var(
        --m3e-timepicker-input-period-toggle-unselected-hover-state-layer-color,
        ${DesignToken.color.onSurfaceVariant}
      );
      --m3e-state-layer-focus-color: var(
        --m3e-timepicker-input-period-toggle-unselected-focus-state-layer-color,
        ${DesignToken.color.onSurfaceVariant}
      );
      --m3e-ripple-color: var(
        --m3e-timepicker-input-period-toggle-unselected-pressed-state-layer-color,
        ${DesignToken.color.onSurfaceVariant}
      );
    }
  `;

  /** The 12-hour time period. */
  @property() period: TimepickerPeriod = "am";

  /** The orientation of the toggle. */
  @property({ reflect: true }) orientation: Exclude<TimepickerOrientation, "auto"> = "vertical";

  /** @inheritdoc */
  protected override render(): unknown {
    const format = new Intl.DateTimeFormat(navigator.language, { hour: "numeric", hour12: true });

    return html`<div class="base" tabindex="-1" @keydown="${this.#handleKeyDown}">
      <div
        id="am"
        class="period-button"
        role="radio"
        aria-checked="${this.period === "am" ? "true" : "false"}"
        tabindex="${this.period === "am" ? "0" : "-1"}"
        @click="${this.#handleClick}"
      >
        <m3e-focus-ring class="focus-ring" for="am"></m3e-focus-ring>
        <m3e-state-layer class="state-layer" for="am"></m3e-state-layer>
        <m3e-ripple class="ripple" centered for="am"></m3e-ripple>
        ${format.formatToParts(new Date(2020, 0, 1, 9)).find((p) => p.type === "dayPeriod")?.value ?? "AM"}
      </div>
      <div class="divider" aria-hidden="true"></div>
      <div
        id="pm"
        class="period-button"
        role="radio"
        aria-checked="${this.period === "pm" ? "true" : "false"}"
        tabindex="${this.period === "pm" ? "0" : "-1"}"
        @click="${this.#handleClick}"
      >
        <m3e-focus-ring class="focus-ring" for="pm"></m3e-focus-ring>
        <m3e-state-layer class="state-layer" for="pm"></m3e-state-layer>
        <m3e-ripple class="ripple" centered for="pm"></m3e-ripple>
        ${format.formatToParts(new Date(2020, 0, 1, 21)).find((p) => p.type === "dayPeriod")?.value ?? "PM"}
      </div>
    </div>`;
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    if (e.defaultPrevented) return;

    const changePeriod = (prev: TimepickerPeriod, next: TimepickerPeriod) => {
      if (this.period === prev) {
        this.period = next;
        this.shadowRoot?.querySelector<HTMLElement>(`#${this.period}`)?.focus();
        this.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    switch (e.key) {
      case "Left":
      case "ArrowLeft":
        e.preventDefault();
        if (this.orientation === "horizontal") {
          if (M3eDirectionality.current === "rtl") {
            changePeriod("am", "pm");
          } else {
            changePeriod("pm", "am");
          }
        }
        break;

      case "Right":
      case "ArrowRight":
        e.preventDefault();
        if (this.orientation === "horizontal") {
          if (M3eDirectionality.current === "rtl") {
            changePeriod("pm", "am");
          } else {
            changePeriod("am", "pm");
          }
        }
        break;

      case "Up":
      case "ArrowUp":
        e.preventDefault();
        if (this.orientation === "vertical") {
          changePeriod("pm", "am");
        }

        break;

      case "Down":
      case "ArrowDown":
        e.preventDefault();
        if (this.orientation === "vertical") {
          changePeriod("am", "pm");
        }
        break;
    }
  }

  /** @private */
  #handleClick(e: Event): void {
    const period = <TimepickerPeriod>(<HTMLElement>e.currentTarget).id;
    if (period !== this.period) {
      this.period = period;
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
}
