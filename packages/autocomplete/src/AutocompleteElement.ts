import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  M3eTextHighlightElement,
  HtmlFor,
  prefersReducedMotion,
  scrollIntoViewIfNeeded,
  forcedColorsActive,
} from "@m3e/core";

import { ListKeyManager } from "@m3e/core/a11y";

import type { M3eFormFieldElement } from "@m3e/form-field";
import type { M3eOptionElement, M3eOptionMenuElement } from "@m3e/option";

/**
 * Enhances a text input with suggested options.
 *
 * @description
 * The `m3e-autocomplete` component augments a text input field with a dynamically positioned menu of filterable suggestions,
 * following Material Design 3 principles. It provides real-time filtering, keyboard navigation, automatic option activation,
 * and text highlighting to guide user selection. The component manages focus, selection state, and menu visibility while
 * integrating seamlessly with form field containers and supporting both required and optional selection modes.
 *
 * @example
 * The following example illustrates use of the `m3e-autocomplete` paired with a `m3e-form-field`.
 * ```html
 * <m3e-form-field>
 *   <label slot="label" for="fruit">Choose your favorite fruit</label>
 *   <input id="fruit" />
 * </m3e-form-field>
 * <m3e-autocomplete for="fruit">
 *   <m3e-option>Apples</m3e-option>
 *   <m3e-option>Oranges</m3e-option>
 *   <m3e-option>Bananas</m3e-option>
 *   <m3e-option>Grapes</m3e-option>
 * </m3e-autocomplete>
 * ```
 *
 * @tag m3e-autocomplete
 *
 * @attr auto-activate - Whether the first option should be automatically activated.
 * @attr hide-selection-indicator - Whether to hide the selection indicator.
 * @attr required - Whether the user is required to make a selection when interacting with the autocomplete.
 *
 * @slot - Renders the options of the autocomplete.
 */
@customElement("m3e-autocomplete")
export class M3eAutocompleteElement extends HtmlFor(LitElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
    .options {
      display: none;
    }
  `;

  /** @private */ private static __nextId = 0;

  /** @private */ readonly #id = `m3e-autocomplete-${M3eAutocompleteElement.__nextId}`;
  /** @private */ readonly #menuId = `${this.#id}-menu`;
  /** @private */ #ignoreFocusVisible = false;
  /** @private */ #menu?: M3eOptionMenuElement;
  /** @private */ #textHighlight?: M3eTextHighlightElement;
  /** @private */ #ignoreHideMenuOnBlur = false;

  /** @private */ readonly #clickHandler = () => this.#handleClick();
  /** @private */ readonly #formFieldPointerDownHandler = () => this.#handleFormFieldPointerDown();
  /** @private */ readonly #focusHandler = () => this.#handleFocus();
  /** @private */ readonly #blurHandler = () => this.#handleBlur();
  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
  /** @private */ readonly #inputHandler = (e: Event) => this.#handleInput(e);
  /** @private */ readonly #changeHandler = () => this.#handleChange();
  /** @private */ readonly #menuToggleHandler = (e: ToggleEvent) => this.#handleMenuToggle(e);
  /** @private */ readonly #menuPointerDownHandler = (e: PointerEvent) => this.#handleMenuPointerDown(e);

  /** @private */ private readonly _listKeyManager = new ListKeyManager<M3eOptionElement>()
    .withWrap()
    .withHomeAndEnd()
    .withPageUpAndDown()
    .withVerticalOrientation()
    .withSkipPredicate((item) => item.disabled || item.style.display === "none")
    .onActiveItemChange(() => {
      if (this._listKeyManager.activeItem) {
        this.#activateOption(this._listKeyManager.activeItem);
      }
    });

  /**
   * Whether to hide the selection indicator.
   * @default false
   */
  @property({ attribute: "hide-selection-indicator", type: Boolean }) hideSelectionIndicator = false;

  /**
   * Whether the user is required to make a selection when interacting with the autocomplete.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * Whether the first option should be automatically activated.
   * @default false
   */
  @property({ attribute: "auto-activate", type: Boolean }) autoActivate = false;

  /** The options that can be selected. */
  get options(): readonly M3eOptionElement[] {
    return this._listKeyManager?.items ?? [];
  }

  /** @private */
  get #input(): HTMLInputElement | null {
    return this.control ? <HTMLInputElement>this.control : null;
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    if (!(control instanceof HTMLInputElement)) return;

    super.attach(control);

    control.autocomplete = "off";
    control.role = "combobox";
    control.ariaAutoComplete = "list";
    control.ariaExpanded = "false";

    control.addEventListener("click", this.#clickHandler);
    control.addEventListener("focus", this.#focusHandler);
    control.addEventListener("blur", this.#blurHandler);
    control.addEventListener("keydown", this.#keyDownHandler);
    control.addEventListener("input", this.#inputHandler);
    control.addEventListener("change", this.#changeHandler);

    this.#formField?.addEventListener("pointerdown", this.#formFieldPointerDownHandler);
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control) {
      this.#formField?.removeEventListener("pointerdown", this.#formFieldPointerDownHandler);

      this.control.role = null;
      this.control.ariaAutoComplete = null;
      this.control.ariaExpanded = null;

      this.control.removeEventListener("click", this.#clickHandler);
      this.control.removeEventListener("focus", this.#focusHandler);
      this.control.removeEventListener("blur", this.#blurHandler);
      this.control.removeEventListener("keydown", this.#keyDownHandler);
      this.control.removeEventListener("input", this.#inputHandler);
      this.control.removeEventListener("change", this.#changeHandler);
    }
    super.detach();
  }

  get #hasVisibleOptions(): boolean {
    return this.options.some((x) => x.style.display !== "none");
  }

  /** @private */
  get #minMenuWidth(): string {
    const formField = this.#formField;
    return `${formField ? formField.menuAnchor.clientWidth : (this.control?.clientWidth ?? 0)}px`;
  }

  /** @private */
  get #formField(): M3eFormFieldElement | null {
    return this.control?.closest("m3e-form-field") ?? null;
  }

  /**
   * Clears the value of the element.
   * @param [restoreFocus=false] Whether to restore input focus.
   */
  clear(restoreFocus = false): void {
    if (!this.#input) return;

    this.#input.value = "";
    if (this.#textHighlight) {
      this.#textHighlight.term = "";
    }

    this.#filterOptions();

    if (restoreFocus) {
      this.#input.focus();
    } else {
      this.#hideMenu();
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    this.role = this.role || "none";
    super.connectedCallback();
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="options" role="listbox">
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
  }

  /** @private */
  #handleClick(): void {
    this.#ignoreFocusVisible = true;
    this.#showMenu();
  }

  /** @private */
  #handleFormFieldPointerDown(): void {
    this.#ignoreHideMenuOnBlur = true;
  }

  /** @private */
  #handleFocus(): void {
    this.#ignoreFocusVisible = true;
    this.#showMenu();
  }

  /** @private */
  #handleBlur(): void {
    if (!this.#ignoreHideMenuOnBlur) {
      this.#hideMenu();
    }
    this.#ignoreHideMenuOnBlur = false;
  }

  /** @private */
  #handleInput(e: Event): void {
    if (!this.#input || e.defaultPrevented) return;

    if (this.#textHighlight) {
      this.#textHighlight.term = this.#input.value;
    }

    this.#filterOptions();

    if (!this.#menu) {
      this.#showMenu();
    } else if (!this.#hasVisibleOptions) {
      this.#hideMenu();
    }

    this.#formField?.notifyControlStateChange(true);
  }

  /** @private */
  #handleChange(): void {
    if (this.#input && this.required && !this.options.some((x) => x.selected && !x.disabled)) {
      this.#input.value = "";
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    if (e.defaultPrevented) return;

    this.#ignoreFocusVisible = false;

    switch (e.key) {
      case "Backspace":
      case "Delete":
        if (this.#input && !this.#input.value) {
          this.#hideMenu();
        }
        break;

      case "Enter":
        if (this.#menu && this._listKeyManager.activeItem) {
          e.preventDefault();
          this.#selectOption(this._listKeyManager.activeItem);
          this.#hideMenu();
        } else if (this.#menu) {
          setTimeout(() => {
            if (this.#input && !this.#input.value) {
              this.#hideMenu();
            }
          });
        }
        break;

      case "Escape":
      case "Tab":
        this.#hideMenu();
        break;

      case "Up":
      case "ArrowUp":
        if (e.altKey) {
          this.#hideMenu();
        } else {
          this._listKeyManager.onKeyDown(e);
        }
        break;

      case "Down":
      case "ArrowDown":
        if (!this.#menu) {
          this.#showMenu();
          e.preventDefault();
        } else {
          this._listKeyManager.onKeyDown(e);
        }
        break;

      default:
        this._listKeyManager.onKeyDown(e);
        break;
    }
  }

  /** @private */
  #handleMenuPointerDown(e: PointerEvent): void {
    e.preventDefault();
    e.stopImmediatePropagation();

    const option = <M3eOptionElement | undefined>(
      e.composedPath().find((x) => x instanceof HTMLElement && x.tagName === "M3E-OPTION")
    );

    if (option && !option.disabled) {
      this._listKeyManager.setActiveItem(option);
      this.#selectOption(option);
      this.#hideMenu();
    }
  }

  /** @private */
  #handleMenuToggle(e: ToggleEvent): void {
    if (!this.#menu) return;

    if (e.newState !== "closed") {
      const option = this.options.find((x) => x.selected && !x.disabled);
      if (option) {
        this._listKeyManager.setActiveItem(option);
        scrollIntoViewIfNeeded(option, this.#menu);
      } else {
        this.#autoActivate();
      }

      this.dispatchEvent(
        new ToggleEvent("toggle", {
          oldState: e.oldState,
          newState: e.newState,
        })
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

  /** @private*/
  #destroyMenu(e: ToggleEvent): void {
    if (!this.#menu || !this.#textHighlight) return;

    [...this.#textHighlight.childNodes].forEach((x) => this.append(x));

    this.#textHighlight.remove();
    this.#menu.remove();
    this.#menu.removeEventListener("toggle", this.#menuToggleHandler);
    this.#menu.removeEventListener("pointerdown", this.#menuPointerDownHandler);
    this.#menu = undefined;
    this.#textHighlight = undefined;

    this.ariaExpanded = "false";
    this.removeAttribute("aria-controls");
    this.removeAttribute("aria-owns");
    this.requestUpdate();

    this.#formField?.notifyControlStateChange();

    this.dispatchEvent(
      new ToggleEvent("toggle", {
        oldState: e.oldState,
        newState: e.newState,
      })
    );
  }

  /** @private */
  #showMenu(): void {
    if (this.#menu || !this.#input || this.#input.readOnly || this.#input.disabled || !this.#hasVisibleOptions) return;

    this.#filterOptions();

    this.#menu = document.createElement("m3e-option-menu");
    this.#menu.id = this.#menuId;
    this.#menu.style.overflowX = "hidden";
    this.#menu.style.minWidth = this.#minMenuWidth;
    this.#menu.addEventListener("toggle", this.#menuToggleHandler);
    this.#menu.addEventListener("pointerdown", this.#menuPointerDownHandler);

    this.#textHighlight = document.createElement("m3e-text-highlight");
    this.#textHighlight.term = this.#input.value;
    this.#menu.appendChild(this.#textHighlight);

    for (const node of [...this.childNodes]) {
      this.#textHighlight.append(node);
    }

    (this.#formField ?? this.#input).insertAdjacentElement("afterend", this.#menu);

    this.ariaExpanded = "true";
    this.setAttribute("aria-controls", this.#menuId);
    this.setAttribute("aria-owns", this.#menuId);

    this.#formField?.notifyControlStateChange();

    if (this._listKeyManager.activeItem && this.autoActivate) {
      this.#activateOption(this._listKeyManager.activeItem, true);
    }

    setTimeout(() => this.#menu?.show(this, this.#formField?.menuAnchor));
  }

  /** @private */
  #hideMenu(): void {
    this.#menu?.hide();
    this.#input?.removeAttribute("aria-activedescendant");
  }

  /** @private */
  #activateOption(option: M3eOptionElement, forceFocusVisible = false): void {
    if (!this.#input) return;

    this.#input.setAttribute("aria-activedescendant", option.id);

    if (this.#menu) {
      scrollIntoViewIfNeeded(option, this.#menu, { block: "nearest", behavior: "instant" });

      const focusVisible =
        forceFocusVisible ||
        (!this.#ignoreFocusVisible && (this.#input.matches(":focus-visible") || forcedColorsActive()));

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
    if (option.selected) return;

    option.selected = true;
    option.requestUpdate();
    this.requestUpdate();

    if (this.#input) {
      this.#input.value = option.value;
    }

    this.#formField?.notifyControlStateChange(true);
  }

  /** @private */
  #filterOptions(): void {
    if (!this.#input) return;

    const term = this.#input.value.toLocaleLowerCase();
    for (const option of this.options) {
      const value = option.value.toLocaleLowerCase();
      const hidden = !value.includes(term);
      option.style.display = hidden ? "none" : "";

      if (hidden) {
        this.#deactivateOption(option);
      }

      if (option.selected && value !== term) {
        option.selected = false;
      }
    }

    const groups = this.#menu?.querySelectorAll("m3e-option-group") ?? this.querySelectorAll("m3e-option-group");
    for (const group of groups) {
      const hidden = [...group.querySelectorAll("m3e-option")].every((x) => x.style.display === "none");
      group.style.display = hidden ? "none" : "";
    }

    this.#autoActivate();
  }

  /** @private */
  #autoActivate(): void {
    if (this.autoActivate && (!this._listKeyManager.activeItem || !this._listKeyManager.activeItem.selected)) {
      const option = this.options.find((x) => !x.disabled && x.style.display !== "none");
      if (option) {
        this._listKeyManager.setActiveItem(option);
        if (this.#menu) {
          scrollIntoViewIfNeeded(option, this.#menu, { block: "nearest", behavior: "instant" });
        }
      }
    }
  }

  /** @private */
  #deactivateOption(option: M3eOptionElement): void {
    option.focusRing?.hide();
    option.stateLayer?.hide("focused");
    if (option === this._listKeyManager.activeItem) {
      this._listKeyManager.updateActiveItem(null);
      this.#input?.removeAttribute("aria-activedescendant");
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-autocomplete": M3eAutocompleteElement;
  }
}
