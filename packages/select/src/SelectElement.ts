/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

import {
  AttachInternals,
  Labelled,
  ConstraintValidation,
  Dirty,
  Disabled,
  FormAssociated,
  Required,
  RequiredConstraintValidation,
  ResizeController,
  Touched,
  DesignToken,
  formValue,
  M3eFocusRingElement,
  scrollIntoViewIfNeeded,
  Role,
  Focusable,
  prefersReducedMotion,
  forcedColorsActive,
} from "@m3e/core";

import { ListKeyManager } from "@m3e/core/a11y";

import type { M3eFormFieldElement, FormFieldControl } from "@m3e/form-field";
import { M3eOptionElement, M3eOptionPanelElement } from "@m3e/option";

/**
 * A form control that allows users to select a value from a set of predefined options.
 *
 * @description
 * The `m3e-select` component follows Material Design 3 principles and provides a comprehensive
 * selection interface for capturing user input. It supports both single and multiple selection modes,
 * customizable validation states, and accessible keyboard navigation. The component integrates seamlessly
 * with form field containers and dynamically positions its option list menu to ensure optimal viewport
 * visibility. Selection changes are communicated through standard form events, enabling predictable integration
 * with form submission and reactive state management systems.
 *
 * @example
 * The following demonstrates a `m3e-select` component wrapped in a `m3e-form-field` with a slotted label.
 * The label is associated with the select via the `for` and `id` attributes, ensuring accessible form semantics.
 * Each `m3e-option` defines an option within the dropdown.
 *
 * ```html
 * <m3e-form-field>
 *   <label slot="label" for="select">Choose your favorite fruit</label>
 *   <m3e-select id="select">
 *     <m3e-option>Apples</m3e-option>
 *     <m3e-option>Oranges</m3e-option>
 *     <m3e-option>Bananas</m3e-option>
 *     <m3e-option>Grapes</m3e-option>
 *   </m3e-select>
 * </m3e-form-field>
 * ```
 *
 * @tag m3e-select
 *
 * @slot - Renders the options of the select.
 * @slot arrow - Renders the dropdown arrow.
 * @slot value - Renders the selected value(s).
 *
 * @attr disabled - Whether the element is disabled.
 * @attr hide-selection-indicator - Whether to hide the selection indicator for single select options.
 * @attr multi - Whether multiple options can be selected.
 * @attr name - The name that identifies the element when submitting the associated form.
 * @attr required - Whether the element is required.
 *
 * @fires input - Emitted when the selected state changes.
 * @fires change - Emitted when the selected state changes.
 *
 * @cssprop --m3e-form-field-font-size - The font size of the select control.
 * @cssprop --m3e-form-field-font-weight - The font weight of the select control.
 * @cssprop --m3e-form-field-line-height - The line height of the select control.
 * @cssprop --m3e-form-field-tracking - The letter spacing of the select control.
 * @cssprop --m3e-select-container-shape - The corner radius of the select container.
 * @cssprop --m3e-select-disabled-color - The text color when the select is disabled.
 * @cssprop --m3e-select-disabled-color-opacity - The opacity level applied to the disabled text color.
 * @cssprop --m3e-select-icon-size - The size of the dropdown arrow icon.
 */
@customElement("m3e-select")
export class M3eSelectElement
  extends Focusable(
    Labelled(
      RequiredConstraintValidation(
        Dirty(
          Touched(
            Required(ConstraintValidation(FormAssociated(Disabled(AttachInternals(Role(LitElement, "combobox")))))),
          ),
        ),
      ),
    ),
  )
  implements FormFieldControl
{
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
      outline: none;
      position: relative;
      font-size: var(--m3e-form-field-font-size, ${DesignToken.typescale.standard.body.large.fontSize});
      font-weight: var(--m3e-form-field-font-weight, ${DesignToken.typescale.standard.body.large.fontWeight});
      line-height: var(--m3e-form-field-line-height, ${DesignToken.typescale.standard.body.large.lineHeight});
      letter-spacing: var(--m3e-form-field-tracking, ${DesignToken.typescale.standard.body.large.tracking});
      min-height: var(--m3e-form-field-line-height, ${DesignToken.typescale.standard.body.large.lineHeight});
      border-radius: var(--m3e-select-container-shape, ${DesignToken.shape.corner.extraSmall});
    }
    :host(:not(:disabled)) {
      cursor: pointer;
    }
    :host(:disabled) {
      color: color-mix(
        in srgb,
        var(--m3e-select-disabled-color, ${DesignToken.color.onSurface}) var(--m3e-select-disabled-color-opacity, 38%),
        transparent
      );
    }
    .options {
      display: none;
    }
    .base {
      flex: 1 1 auto;
      display: inline-flex;
      align-items: center;
      overflow: hidden;
    }
    .arrow-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: var(--_select-arrow-margin-top);
    }
    ::slotted([slot="arrow"]),
    .arrow {
      vertical-align: middle;
      width: 1em;
      height: 1em;
      font-size: var(--m3e-select-icon-size, 1.5rem);
    }
    :host(.-open) .focus-ring {
      display: none;
    }
  `;

  /** @private */ static __nextId = 0;

  /** @private */ #menu?: M3eOptionPanelElement;
  /** @private */ #ignoreKeyUp = false;
  /** @private */ #ignoreFocusVisible = false;

  /** @private */ readonly #id = `m3e-select-${M3eSelectElement.__nextId++}`;
  /** @private */ readonly #listId = `${this.#id}-list`;

  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);
  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
  /** @private */ readonly #keyUpHandler = (e: KeyboardEvent) => this.#handleKeyUp(e);
  /** @private */ readonly #menuToggleHandler = (e: ToggleEvent) => this.#handleMenuToggle(e);
  /** @private */ readonly #menuPointerDownHandler = (e: MouseEvent) => this.#handleMenuPointerDown(e);

  /** @private */ private readonly _listKeyManager = new ListKeyManager<M3eOptionElement>()
    .withWrap()
    .withHomeAndEnd()
    .withPageUpAndDown()
    .withVerticalOrientation()
    .withTypeahead()
    .onActiveItemChange(() => {
      if (this._listKeyManager.activeItem) {
        this.#activateOption(this._listKeyManager.activeItem);
      }
    });

  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;

  constructor() {
    super();
    new ResizeController(this, {
      callback: () => {
        if (this.#menu) {
          this.#menu.style.minWidth = this.#minMenuWidth;
        }
      },
    });
  }

  /**
   * Whether to hide the selection indicator for single select options.
   * @default false
   */
  @property({ attribute: "hide-selection-indicator", type: Boolean }) hideSelectionIndicator = false;

  /**
   * Whether multiple options can be selected.
   * @default false
   */
  @property({ type: Boolean }) multi = false;

  /** The selected option(s). */
  get selected(): readonly M3eOptionElement[] {
    return this.options.filter((x) => x.selected);
  }

  /** The options that can be selected. */
  get options(): readonly M3eOptionElement[] {
    return this._listKeyManager?.items ?? [];
  }

  /** The selected (enabled) value(s). */
  get value(): string | readonly string[] | null {
    const values = this.selected.filter((x) => !x.disabled).map((x) => x.value);
    switch (values.length) {
      case 0:
        return null;
      case 1:
        return values[0];
      default:
        return values;
    }
  }

  /** @inheritdoc @internal */
  override get [formValue]() {
    const values = this.value;
    if (Array.isArray(values)) {
      const data = new FormData();
      for (const value of values) {
        data.append(this.name, value);
      }
      return data;
    }
    return <string | null>values;
  }

  /** @inheritdoc */
  get shouldLabelFloat(): boolean {
    return this.selected.filter((x) => !x.isEmpty).length > 0;
  }

  /** @private */
  get #minMenuWidth(): string {
    const formField = this.#formField;
    return `${formField ? formField.menuAnchor.clientWidth : this.clientWidth}px`;
  }

  /** @private */
  get #formField(): M3eFormFieldElement | null {
    return this.closest("m3e-form-field");
  }

  /** @inheritdoc */
  onContainerClick(): void {
    this.#ignoreFocusVisible = true;
    this.#toggleMenu();
    this.focus({ preventScroll: true });
  }

  /**
   * Clears the value of the element.
   * @param [restoreFocus=false] Whether to restore input focus.
   */
  clear(restoreFocus = false): void {
    const selected = this.selected;
    const willChange = selected.length > 0;

    if (willChange) {
      selected.forEach((x) => (x.selected = false));
      this.requestUpdate();
    }

    this.#hideMenu();

    if (willChange) {
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (restoreFocus) {
      this.focus();
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.ariaHasPopup = "listbox";
    this.ariaExpanded = "false";

    this.addEventListener("click", this.#clickHandler);
    this.addEventListener("keydown", this.#keyDownHandler);
    this.addEventListener("keyup", this.#keyUpHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("click", this.#clickHandler);
    this.removeEventListener("keydown", this.#keyDownHandler);
    this.removeEventListener("keyup", this.#keyUpHandler);
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("hideSelectionIndicator")) {
      this.options.forEach((x) => x.classList.toggle("-hide-selection-indicator", this.hideSelectionIndicator));
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);

    this._focusRing?.attach(this);

    if (this.#formField && this._focusRing) {
      this._focusRing.style.display = "none";
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html` <m3e-focus-ring class="focus-ring"></m3e-focus-ring>
      <div class="base">
        <m3e-text-overflow>
          <slot name="value">
            ${this.selected
              .filter((x) => !x.isEmpty)
              .map((x, i) => (i > 0 ? html`<span>, </span>${unsafeHTML(x.innerHTML)}` : unsafeHTML(x.innerHTML)))}
          </slot>
        </m3e-text-overflow>
        <div class="arrow-wrapper" aria-hidden="true">
          <slot name="arrow">
            <svg class="arrow" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M480-360 280-560h400L480-360Z" />
            </svg>
          </slot>
        </div>
      </div>
      <div class="options" role="listbox" aria-multiselectable="${this.multi}">
        <slot @slotchange="${this.#handleSlotChange}"></slot>
      </div>`;
  }

  /** @private */
  #handleSlotChange(): void {
    if (this.#menu) return;
    const { added } = this._listKeyManager.setItems([...this.querySelectorAll("m3e-option")]);
    added.forEach((x) => {
      x.id = x.id || `${this.#id}-option-${this._listKeyManager.items.indexOf(x)}`;
      x.classList.toggle("-hide-selection-indicator", this.hideSelectionIndicator);
    });
    this.#formField?.notifyControlStateChange();
  }

  /** @private */
  #handleClick(e: Event): void {
    if (e.defaultPrevented || this.disabled) return;
    this.#toggleMenu();
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    if (e.defaultPrevented) return;
    this.#ignoreFocusVisible = false;

    switch (e.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        if (!this.multi) {
          if (this.#menu && this._listKeyManager.activeItem) {
            this.#selectOption(this._listKeyManager.activeItem);
          }
          if (this.#menu?.isOpen) {
            if (!prefersReducedMotion()) {
              setTimeout(() => this.#hideMenu(), 150);
            } else {
              this.#hideMenu();
            }
          } else {
            this.#showMenu();
          }
        } else if (!this.#menu) {
          this.#ignoreKeyUp = true;
          this.#toggleMenu();
        }

        break;

      case "Escape":
      case "Tab":
        this.#hideMenu();
        break;

      case "Down":
      case "ArrowDown":
        if (this.multi && !this.#menu) {
          this.#toggleMenu();
        } else {
          this._listKeyManager.onKeyDown(e);
          if (!this.#menu && this._listKeyManager.activeItem) {
            this.#selectOption(this._listKeyManager.activeItem);
          }
        }
        break;

      default:
        this._listKeyManager.onKeyDown(e);
        if (!this.multi && !this.#menu && this._listKeyManager.activeItem) {
          this.#selectOption(this._listKeyManager.activeItem);
        }
        break;
    }
  }

  /** @private */
  #handleKeyUp(e: KeyboardEvent): void {
    if (e.defaultPrevented) return;

    if (this.#ignoreKeyUp) {
      this.#ignoreKeyUp = false;
      return;
    }

    switch (e.key) {
      case " ":
      case "Enter":
        if (!this.multi) return;
        e.preventDefault();
        if (this.#menu && this._listKeyManager.activeItem) {
          this.#selectOption(this._listKeyManager.activeItem);
        }
        break;
    }
  }

  /** @private */
  #handleMenuPointerDown(e: MouseEvent): void {
    if (e.button === 2) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    const option = <M3eOptionElement | undefined>(
      e.composedPath().find((x) => x instanceof HTMLElement && x.tagName === "M3E-OPTION")
    );

    if (option && !option.disabled) {
      this.#selectOption(option);
      this._listKeyManager.setActiveItem(option);

      if (!this.multi) {
        if (!prefersReducedMotion()) {
          setTimeout(() => this.#hideMenu(), 150);
        } else {
          this.#hideMenu();
        }
      } else {
        this.requestUpdate();
      }
    }
  }

  /** @private */
  #handleMenuToggle(e: ToggleEvent): void {
    if (!this.#menu) return;

    if (e.newState !== "closed") {
      const option = this.selected.find((x) => !x.disabled) ?? this._listKeyManager.items.find((x) => !x.disabled);
      this._listKeyManager.setActiveItem(option);
      if (option) {
        scrollIntoViewIfNeeded(option, this.#menu, { block: "nearest", behavior: "instant" });
      }
      this.dispatchEvent(
        new ToggleEvent("toggle", {
          oldState: e.oldState,
          newState: e.newState,
        }),
      );
    } else {
      if (prefersReducedMotion()) {
        this.#destroyMenu(e);
      } else {
        // NOTE: use transitionend is preferred but doesn't fire when used here.
        // This is a workaround until that is fixed.
        setTimeout(() => this.#destroyMenu(e), 100);
      }
    }
  }

  /** @private */
  #destroyMenu(e: ToggleEvent): void {
    if (!this.#menu) return;

    [...this.#menu.childNodes].forEach((x) => this.append(x));

    this.#menu.remove();
    this.#menu.removeEventListener("toggle", this.#menuToggleHandler);
    this.#menu.removeEventListener("pointerdown", this.#menuPointerDownHandler);
    this.#menu = undefined;

    this.ariaExpanded = "false";
    this.removeAttribute("aria-controls");
    this.removeAttribute("aria-owns");
    this.requestUpdate();

    this.classList.toggle("-open", false);
    this.#formField?.notifyControlStateChange();

    this.dispatchEvent(
      new ToggleEvent("toggle", {
        oldState: e.oldState,
        newState: e.newState,
      }),
    );
  }

  /** @private */
  #toggleMenu(): void {
    if (this.disabled) return;
    if (this.#menu) {
      this.#hideMenu();
    } else {
      this.#showMenu();
    }
  }

  /** @private */
  #showMenu(): void {
    if (this.#menu) return;

    this.#menu = document.createElement("m3e-option-panel");
    if (this.multi) {
      this.#menu.ariaMultiSelectable = "true";
    }

    this.#menu.id = this.#listId;
    this.#menu.style.overflowX = "hidden";
    this.#menu.style.minWidth = this.#minMenuWidth;
    this.#menu.addEventListener("toggle", this.#menuToggleHandler);
    this.#menu.addEventListener("pointerdown", this.#menuPointerDownHandler);

    for (const node of [...this.childNodes]) {
      this.#menu.append(node);
    }

    (this.#formField ?? this).insertAdjacentElement("afterend", this.#menu);

    this.ariaExpanded = "true";
    this.setAttribute("aria-controls", this.#listId);
    this.setAttribute("aria-owns", this.#listId);
    this.#formField?.notifyControlStateChange();

    setTimeout(() => {
      this.#menu?.show(this, this.#formField?.menuAnchor);
      this.classList.toggle("-open", true);
    });
  }

  /** @private */
  #hideMenu(): void {
    if (!this.#menu) return;

    this.#menu.hide();
    this.removeAttribute("aria-activedescendant");
    this.classList.toggle("-open", false);
  }

  /** @private */
  #activateOption(option: M3eOptionElement): void {
    this.setAttribute("aria-activedescendant", option.id);
    if (this.#menu) {
      scrollIntoViewIfNeeded(option, this.#menu, { block: "nearest", behavior: "instant" });

      const focusVisible = !this.#ignoreFocusVisible && (this.matches(":focus-visible") || forcedColorsActive());

      this.options.forEach((x) => {
        const active = x === option && focusVisible;
        if (active) {
          x.focusRing?.show();
          x.stateLayer?.show("focused");
        } else {
          x.focusRing?.hide();
          x.stateLayer?.hide("focused");
        }
      });
    }
  }

  /** @private */
  #selectOption(option: M3eOptionElement): void {
    const selected = this.multi ? !option.selected : true;
    if (option.selected === selected) return;

    option.selected = selected;

    if (this.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true }))) {
      if (!this.multi) {
        this.selected.filter((x) => x !== option).forEach((x) => (x.selected = false));
      }

      this.requestUpdate();
      this.#formField?.notifyControlStateChange();
      this.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      option.selected = !selected;
    }
  }
}

interface M3eSelectElementEventMap extends HTMLElementEventMap {
  toggle: ToggleEvent;
}

export interface M3eSelectElement {
  addEventListener<K extends keyof M3eSelectElementEventMap>(
    type: K,
    listener: (this: M3eSelectElement, ev: M3eSelectElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eSelectElementEventMap>(
    type: K,
    listener: (this: M3eSelectElement, ev: M3eSelectElementEventMap[K]) => void,
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
    "m3e-select": M3eSelectElement;
  }
}
