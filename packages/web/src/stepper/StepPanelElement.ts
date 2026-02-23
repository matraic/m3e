import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import { Role } from "@m3e/web/core";

/**
 * A panel presented for a step in a wizard-like workflow.
 *
 * @description
 * The `m3e-step-panel` is a container for presenting contextual content and actions
 * associated with a single step in a structured workflow.
 *
 * @example
 * The following example demonstrates a linear multi-step form flow using the `m3e-stepper`
 * component. Each `m3e-step` defines a navigable step label, linked to its corresponding
 * `m3e-step-panel` via the `for` attribute. Navigation is orchestrated using the
 * `m3e-stepper-next`, `m3e-stepper-previous`, and `m3e-stepper-reset` components.
 *
 * <m3e-stepper>
 *  <m3e-step for="step1">Fill out your name</m3e-step>
 *  <m3e-step for="step2">Fill out your address</m3e-step>
 *  <m3e-step for="step3">Done</m3e-step>
 *  <m3e-step-panel id="step1">
 *    <form>
 *      <m3e-form-field>
 *        <label slot="label" for="name">Name</label>
 *        <input name="name" id="name" required />
 *      </m3e-form-field>
 *    </form>
 *    <div slot="actions">
 *      <m3e-button><m3e-stepper-next>Next</m3e-stepper-next></m3e-button>
 *    </div>
 *  </m3e-step-panel>
 *  <m3e-step-panel id="step2">
 *    <form>
 *      <m3e-form-field>
 *        <label slot="label" for="address">Address</label>
 *        <input name="address" id="address" required />
 *      </m3e-form-field>
 *    </form>
 *    <div slot="actions">
 *      <m3e-button><m3e-stepper-previous>Back</m3e-stepper-previous></m3e-button>
 *      <m3e-button><m3e-stepper-next>Next</m3e-stepper-next></m3e-button>
 *    </div>
 *  </m3e-step-panel>
 *  <m3e-step-panel id="step3">Done
 *    <div slot="actions">
 *      <m3e-button><m3e-stepper-previous>Back</m3e-stepper-previous></m3e-button>
 *      <m3e-button><m3e-stepper-reset>Reset</m3e-stepper-reset></m3e-button>
 *    </div>
 *  </m3e-step-panel>
 * </m3e-stepper>
 *
 * @tag m3e-step-panel
 *
 * @slot - Renders the content of the panel.
 * @slot actions- Renders the actions bar of the panel.
 *
 * @cssprop --m3e-step-panel-padding - Padding inside the step panel container, defining internal spacing around content.
 * @cssprop --m3e-step-panel-spacing - Vertical gap between stacked elements within the step panel.
 * @cssprop --m3e-step-panel-actions-height - Minimum height of the slotted actions container.
 */
@customElement("m3e-step-panel")
export class M3eStepPanelElement extends Role(LitElement, "tabpanel") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    .content {
      display: flex;
      flex-direction: column;
      padding: var(--m3e-step-panel-padding, 1rem 1.5rem 1.5rem 1.5rem);
      row-gap: var(--m3e-step-panel-spacing, 0.5rem);
    }
    ::slotted([slot="actions"]) {
      flex: none;
      display: flex;
      align-items: center;
      min-height: var(--m3e-step-panel-actions-height, 3rem);
    }
    ::slotted([slot="actions"][end]) {
      justify-content: flex-end;
    }
  `;

  /** @internal */
  @state() active = false;

  /** @inheritdoc */
  override connectedCallback(): void {
    this.slot = "panel";

    super.connectedCallback();
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<m3e-collapsible ?open=${this.active}>
      <div class="content">
        <div><slot></slot></div>
        <slot name="actions"></slot>
      </div>
    </m3e-collapsible>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-step-panel": M3eStepPanelElement;
  }
}
