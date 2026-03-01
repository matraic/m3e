import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";

import {
  AttachInternals,
  DesignToken,
  Disabled,
  Focusable,
  HtmlFor,
  KeyboardClick,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  Role,
  Selected,
} from "@m3e/web/core";

import { addAriaReferencedId, removeAriaReferencedId, selectionManager } from "@m3e/web/core/a11y";

/**
 * An interactive element that, when activated, presents an associated tab panel.
 *
 * @description
 * The `m3e-tab` component is an interactive control used within a tabbed interface to activate and
 * reveal an associated tab panel. It supports accessible labeling, optional iconography, and selection
 * state styling consistent with Material 3 guidance. Tabs may be disabled, selected, or linked to a
 * specific panel via the `for` attribute, enabling declarative control and semantic clarity.
 *
 * @example
 * The following example illustrates using the `m3e-tabs`, `m3e-tab`, and `m3e-tab-panel` components to present
 * secondary tabs.
 * ```html
 * <m3e-tabs>
 *  <m3e-tab selected for="videos"><m3e-icon slot="icon" name="videocam"></m3e-icon>Video</m3e-tab>
 *  <m3e-tab for="photos"><m3e-icon slot="icon" name="photo"></m3e-icon>Photos</m3e-tab>
 *  <m3e-tab for="audio"><m3e-icon slot="icon" name="music_note"></m3e-icon>Audio</m3e-tab>
 *  <m3e-tab-panel id="videos">Videos</m3e-tab-panel>
 *  <m3e-tab-panel id="photos">Photos</m3e-tab-panel>
 *  <m3e-tab-panel id="audio">Audio</m3e-tab-panel>
 * </m3e-tabs>
 * ```
 *
 * @tag m3e-tab
 *
 * @slot - Renders the label of the tab.
 * @slot icon - Renders an icon before the tab's label.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr selected - Whether the element is selected.
 *
 * @fires input - Emitted when the selected state changes.
 * @fires change - Emitted when the selected state changes.
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-tab-font-size - Font size for tab label.
 * @cssprop --m3e-tab-font-weight - Font weight for tab label.
 * @cssprop --m3e-tab-line-height - Line height for tab label.
 * @cssprop --m3e-tab-tracking - Letter spacing for tab label.
 * @cssprop --m3e-tab-padding-start - Padding on the inline start of the tab.
 * @cssprop --m3e-tab-padding-end - Padding on the inline end of the tab.
 * @cssprop --m3e-tab-focus-ring-shape - Border radius for the focus ring.
 * @cssprop --m3e-tab-selected-color - Text color for selected tab.
 * @cssprop --m3e-tab-selected-container-hover-color - Hover state-layer color for selected tab.
 * @cssprop --m3e-tab-selected-container-focus-color - Focus state-layer color for selected tab.
 * @cssprop --m3e-tab-selected-ripple-color - Ripple color for selected tab.
 * @cssprop --m3e-tab-unselected-color - Text color for unselected tab.
 * @cssprop --m3e-tab-unselected-container-hover-color - Hover state-layer color for unselected tab.
 * @cssprop --m3e-tab-unselected-container-focus-color - Focus state-layer color for unselected tab.
 * @cssprop --m3e-tab-unselected-ripple-color - Ripple color for unselected tab.
 * @cssprop --m3e-tab-disabled-color - Text color for disabled tab.
 * @cssprop --m3e-tab-disabled-opacity - Text opacity for disabled tab.
 * @cssprop --m3e-tab-spacing - Column gap between icon and label.
 * @cssprop --m3e-tab-icon-size - Font size for slotted icon.
 */
@customElement("m3e-tab")
export class M3eTabElement extends Selected(
  HtmlFor(KeyboardClick(Focusable(Disabled(AttachInternals(Role(LitElement, "tab"), true))))),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      outline: none;
      user-select: none;
      height: calc(var(--_tab-height) + ${DesignToken.density.calc(-3)});
      font-size: var(--m3e-tab-font-size, ${DesignToken.typescale.standard.title.small.fontSize});
      font-weight: var(--m3e-tab-font-weight, ${DesignToken.typescale.standard.title.small.fontWeight});
      line-height: var(--m3e-tab-line-height, ${DesignToken.typescale.standard.title.small.lineHeight});
      letter-spacing: var(--m3e-tab-tracking, ${DesignToken.typescale.standard.title.small.tracking});
      flex-grow: var(--_tab-grow);
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    :host(:not(:disabled)) {
      cursor: pointer;
    }
    .base {
      box-sizing: border-box;
      vertical-align: middle;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 100%;
      height: 100%;
      padding-inline-start: var(--m3e-tab-padding-start, 1.5rem);
      padding-inline-end: var(--m3e-tab-padding-end, 1.5rem);
    }
    .touch {
      position: absolute;
      height: 3rem;
      left: 0;
      right: 0;
    }
    .focus-ring {
      border-radius: var(--m3e-tab-focus-ring-shape, ${DesignToken.shape.corner.large});
    }
    :host([selected]:focus-within) .focus-ring {
      top: var(--_tab-focus-ring-top-offset, 0);
      bottom: var(--_tab-focus-ring-bottom-offset, 0);
    }
    :host([selected]:not(:disabled)) .base {
      color: var(--m3e-tab-selected-color, var(--_tab-selected-color, ${DesignToken.color.primary}));
      --m3e-state-layer-hover-color: var(
        --m3e-tab-selected-container-hover-color,
        var(--_tab-selected-container-hover-color, ${DesignToken.color.primary})
      );
      --m3e-state-layer-focus-color: var(
        --_tab-selected-container-focus-color,
        var(--m3e-tab-selected-container-focus-color, ${DesignToken.color.primary})
      );
      --m3e-ripple-color: var(
        --_tab-selected-ripple-color,
        var(--m3e-tab-selected-ripple-color, ${DesignToken.color.primary})
      );
    }
    :host(:not([selected]):not(:disabled)) .base {
      color: var(--m3e-tab-unselected-color, ${DesignToken.color.onSurfaceVariant});
      --m3e-state-layer-hover-color: var(--m3e-tab-unselected-container-hover-color, ${DesignToken.color.onSurface});
      --m3e-state-layer-focus-color: var(--m3e-tab-unselected-container-focus-color, ${DesignToken.color.onSurface});
      --m3e-ripple-color: var(--m3e-tab-unselected-ripple-color, ${DesignToken.color.onSurface});
    }
    :host(:disabled) .base {
      color: color-mix(
        in srgb,
        var(--m3e-tab-disabled-color, ${DesignToken.color.onSurface}) var(--m3e-tab-disabled-opacity, 38%),
        transparent
      );
    }
    .wrapper {
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
      flex-direction: var(--_tab-direction);
      justify-content: center;
      column-gap: var(--m3e-tab-spacing, 0.5rem);
    }
    ::slotted([slot="icon"]) {
      width: 1em;
      font-size: var(--m3e-tab-icon-size, 1.5rem) !important;
    }
    @media (forced-colors: active) {
      :host([selected]:not(:disabled)) .base {
        color: ButtonText;
      }
      :host(:not([selected]):not(:disabled)) .base {
        color: ButtonText;
      }
      :host(:disabled) .base {
        color: GrayText;
      }
    }
  `;

  /** @private */ private static __nextId = 0;

  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;
  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);

  /** @internal A reference to the element that wraps the label of the tab. */
  @query(".label") readonly label!: HTMLElement;

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    control.id = control.id || `m3e-tab-panel-${M3eTabElement.__nextId++}`;
    addAriaReferencedId(this, "aria-controls", control.id);
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control && this.control.id) {
      removeAriaReferencedId(this, "aria-controls", this.control.id);
    }

    super.detach();
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this._focusRing, this._stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("selected")) {
      this.closest("m3e-tabs")?.[selectionManager].notifySelectionChange(this);
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <m3e-state-layer class="state-layer" ?disabled="${this.disabled}"></m3e-state-layer>
      <m3e-focus-ring class="focus-ring" inward ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" ?disabled="${this.disabled}"></m3e-ripple>
      <div class="touch" aria-hidden="true"></div>
      <div class="wrapper">
        <slot name="icon" aria-hidden="true"></slot><span class="label"><slot></slot></span>
      </div>
    </div>`;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (this.disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    if (e.defaultPrevented || this.selected) return;

    this.selected = true;
    if (this.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true }))) {
      this.closest("m3e-tabs")?.[selectionManager].notifySelectionChange(this);
      this.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      this.selected = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-tab": M3eTabElement;
  }
}
