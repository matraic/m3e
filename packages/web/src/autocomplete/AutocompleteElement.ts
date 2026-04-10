/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import {
  HtmlFor,
  prefersReducedMotion,
  scrollIntoViewIfNeeded,
  forcedColorsActive,
  setCustomState,
  deleteCustomState,
  addCustomState,
  customElement,
  MutationController,
  EventAttribute,
} from "@m3e/web/core";

import { ListKeyManager, M3eLiveAnnouncer } from "@m3e/web/core/a11y";
import { M3eOptGroupElement, M3eOptionElement, M3eOptionPanelElement } from "@m3e/web/option";
import type { M3eFormFieldElement } from "@m3e/web/form-field";

import { AutocompleteFilterMode } from "./AutocompleteFilterMode";
import { AutocompleteQueryEventDetail } from "./AutocompleteQueryEventDetail";

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
 * @attr case-sensitive - Whether filtering is case sensitive.
 * @attr filter - Mode in which to filter options.
 * @attr hide-selection-indicator - Whether to hide the selection indicator.
 * @attr hide-loading - Whether to hide the menu when loading options.
 * @attr hide-no-data - Whether to hide the menu when there are no options to show.
 * @attr loading - Whether options are being loaded.
 * @attr loading-label - The text announced and presented when loading options.
 * @attr no-data-label - The text announced and presented when no options are available for the current term.
 * @attr panel-class - Class or list of classes to be applied to the autocomplete's overlay panel.
 * @attr required - Whether the user is required to make a selection when interacting with the autocomplete.
 * @attr results-label - The text announced when available options change for the current term.
 *
 * @slot - Renders the options of the autocomplete.
 * @slot loading - Renders content when loading options.
 * @slot no-data - Renders content when there are no options to show.
 *
 * @fires toggle - Emitted when the options menu opens or closes.
 * @fires query - Emitted when the input is focused or when the user modifies its value.
 * @fires change - Emitted when the committed value changes due to selecting an option or clearing the input.
 */
@customElement("m3e-autocomplete")
export class M3eAutocompleteElement extends EventAttribute(HtmlFor(LitElement), "query") {
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
  /** @private */ private _options = new Array<M3eOptionElement>();
  /** @private */ #clone?: HTMLElement;
  /** @private */ #ignoreFocusVisible = false;
  /** @private */ #menu?: M3eOptionPanelElement;
  /** @private */ #ignoreHideMenuOnBlur = false;
  /** @private */ #inputChanged = false;
  /** @private */ #hasFocus = false;
  /** @private */ #mutationAbortController?: AbortController;

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
    .withSkipPredicate((item) => item.disabled || item.hidden === true)
    .onActiveItemChange(() => {
      if (this._listKeyManager.activeItem) {
        this.#activateOption(this._listKeyManager.activeItem);
      }
    });

  constructor() {
    super();

    new MutationController(this, {
      config: {
        childList: true,
        subtree: true,
      },
      callback: () => this.#handleMutation(),
    });
  }

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

  /**
   * Whether filtering is case sensitive.
   * @default false
   */
  @property({ attribute: "case-sensitive", type: Boolean }) caseSensitive = false;

  /**
   * Mode in which to filter options.
   * @default "contains"
   */
  @property({
    converter: {
      fromAttribute(value: string | null): AutocompleteFilterMode {
        if (value === null) return "contains";
        if (value === "starts-with" || value === "ends-with" || value === "contains" || value === "none") {
          return value;
        }
        return "contains";
      },
    },
  })
  filter: AutocompleteFilterMode | ((option: M3eOptionElement, term: string) => boolean) = "contains";

  /**
   * Whether options are being loaded.
   * @default false
   */
  @property({ type: Boolean }) loading = false;

  /**
   * Whether to hide the menu when there are no options to show.
   * @default false
   */
  @property({ attribute: "hide-no-data", type: Boolean }) hideNoData = false;

  /**
   * Whether to hide the menu when loading options.
   * @default false
   */
  @property({ attribute: "hide-loading", type: Boolean }) hideLoading = false;

  /**
   * The text announced and presented when loading options.
   * @default "Loading..."
   */
  @property({ attribute: "loading-label" }) loadingLabel = "Loading...";

  /**
   * The text announced and presented when no options are available for the current term.
   * @default "No options"
   */
  @property({ attribute: "no-data-label" }) noDataLabel = "No options";

  /**
   * The text announced when available options change for the current term.
   * @default (count) => `${count} options`
   */
  @property({ attribute: "results-label" }) resultsLabel: string | ((count: number) => string) = (count) =>
    `${count} options`;

  /**
   * Class or list of classes to be applied to the autocomplete's overlay panel.
   * @default ""
   */
  @property({ attribute: "panel-class" }) panelClass = "";

  /** The options that can be selected. */
  get options(): readonly M3eOptionElement[] {
    return this._options ?? [];
  }

  /** The selected option. */
  get selected(): M3eOptionElement | null {
    return this.options.find((x) => x.selected) ?? null;
  }

  /** The selected (enabled) value. */
  get value(): string | null {
    const selected = this.selected;
    return selected && !selected.disabled ? selected.value : null;
  }

  /** @private */
  get #options(): readonly M3eOptionElement[] {
    return this._listKeyManager?.items ?? [];
  }

  /** @private */
  get #input(): HTMLInputElement | null {
    return this.control ? <HTMLInputElement>this.control : null;
  }

  /** @private */
  get #hasNoDataSlot(): boolean {
    return (this.#clone?.querySelector("[slot='no-data']") ?? null) !== null;
  }

  /** @private */
  get #hasLoadingSlot(): boolean {
    return (this.#clone?.querySelector("[slot='loading']") ?? null) !== null;
  }

  /** @private */
  get #shouldShowMenu(): boolean {
    return (
      this.#options.some((x) => x.hidden === false) ||
      (this.loading && !this.hideLoading && this.loadingLabel.length > 0) ||
      (!this.loading && !this.hideNoData && this.noDataLabel.length > 0)
    );
  }

  /** @private */
  get #formField(): M3eFormFieldElement | null {
    return this.control?.closest("m3e-form-field") ?? null;
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

  /**
   * Clears the value of the element.
   * @param [restoreFocus=false] Whether to restore input focus.
   */
  clear(restoreFocus = false): void {
    if (!this.#input) return;

    this.#input.value = "";
    if (this.#clearOptions()) {
      this.dispatchEvent(new Event("change", { bubbles: true }));
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
    super.connectedCallback();
    this.#handleMutation();
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("hideNoData") && this.hideNoData && this.#menu) {
      setCustomState(this.#menu, "-no-data", false);
    }

    if (changedProperties.has("loading")) {
      if (this.loading) {
        if (this.#hasFocus) {
          if (this.loadingLabel) {
            M3eLiveAnnouncer.announce(this.loadingLabel, "polite");
          }
          if (!this.#menu && this.#shouldShowMenu) {
            this.#showMenu();
          }
        }
      } else if (this.#menu && !this.#shouldShowMenu) {
        this.#hideMenu();
      } else if (this.#menu) {
        deleteCustomState(this.#menu, "-loading");
      } else if (this.#hasFocus) {
        this.#showMenu();
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="options" aria-hidden="true">
      <slot></slot>
    </div>`;
  }

  /** @private */
  async #handleMutation(): Promise<void> {
    if (this.#mutationAbortController) {
      this.#mutationAbortController.abort();
    }
    const mutationAbortController = new AbortController();
    this.#mutationAbortController = mutationAbortController;

    const options = [...this.querySelectorAll("m3e-option")];

    for (const option of options) {
      if (mutationAbortController.signal.aborted) {
        break;
      }
      if (option.isUpdatePending) {
        await option.updateComplete;
      }
    }

    if (mutationAbortController.signal.aborted) {
      return;
    }

    this._options = options;

    this.#clone = <HTMLElement>this.cloneNode(true);

    const { added } = this._listKeyManager.setItems([...this.#clone.querySelectorAll("m3e-option")]);
    added.forEach((x) => {
      x.id = x.id || `${this.#id}-option-${this._listKeyManager.items.indexOf(x)}`;
      setCustomState(x, "-hide-selection-indicator", this.hideSelectionIndicator);
    });

    if (this.#menu) {
      const count = this.#filterOptions();
      this.#projectClone();
      if (!this.#shouldShowMenu) {
        this.#hideMenu();
      } else {
        this.#updateMenuState(this.#menu, count);
      }
    }
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
    this.#hasFocus = true;
    this.#ignoreFocusVisible = true;

    if (this.options.length == 0 && !(<HTMLInputElement>this.control).readOnly) {
      this.dispatchEvent(
        new CustomEvent<AutocompleteQueryEventDetail>("query", {
          detail: { term: this.#input?.value ?? "" },
          bubbles: true,
          composed: true,
        }),
      );
    }

    this.#showMenu();
  }

  /** @private */
  #handleBlur(): void {
    this.#hasFocus = false;
    if (!this.#ignoreHideMenuOnBlur) {
      this.#hideMenu();
    }
    this.#ignoreHideMenuOnBlur = false;
  }

  /** @private */
  #handleInput(e: Event): void {
    if (!this.#input || e.defaultPrevented) return;

    this.dispatchEvent(
      new CustomEvent<AutocompleteQueryEventDetail>("query", {
        detail: { term: this.#input.value },
        bubbles: true,
        composed: true,
      }),
    );

    if (this.#input.value === "" && this.#clearOptions()) {
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }

    this.#inputChanged = true;
    try {
      if (!this.#menu) {
        this.#showMenu();
      } else {
        this.#filterOptions();
        if (!this.#shouldShowMenu) {
          this.#hideMenu();
        }
      }
    } finally {
      this.#inputChanged = false;
      this.#formField?.notifyControlStateChange(true);
    }
  }

  /** @private */
  #handleChange(): void {
    if (this.#input) {
      const selected = this.selected;
      if (this.required) {
        this.#input.value = selected?.label ?? "";
      } else if (selected && selected.label !== this.#input.value && this.#clearOptions()) {
        this.dispatchEvent(new Event("change", { bubbles: true }));
      }
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
          if (!prefersReducedMotion()) {
            setTimeout(() => this.#hideMenu(), 150);
          } else {
            this.#hideMenu();
          }
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
    if (e.button === 2) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    const option = <M3eOptionElement | undefined>(
      e.composedPath().find((x) => x instanceof HTMLElement && x.tagName === "M3E-OPTION")
    );

    if (option && !option.disabled) {
      this._listKeyManager.setActiveItem(option);
      this.#selectOption(option);
      if (!prefersReducedMotion()) {
        setTimeout(() => this.#hideMenu(), 150);
      } else {
        this.#hideMenu();
      }
    }
  }

  /** @private */
  #handleMenuToggle(e: ToggleEvent): void {
    if (!this.#menu) return;

    if (e.newState !== "closed") {
      const option = this.#options.find((x) => x.selected && !x.disabled);
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

  /** @private*/
  #destroyMenu(e: ToggleEvent): void {
    if (!this.#menu) return;

    this.#clone?.replaceChildren(...this.#menu.childNodes);

    this.#menu.remove();
    this.#menu.removeEventListener("toggle", this.#menuToggleHandler);
    this.#menu.removeEventListener("pointerdown", this.#menuPointerDownHandler);
    this.#menu = undefined;

    if (this.#input) {
      this.#input.ariaExpanded = "false";
      this.#input.removeAttribute("aria-controls");
      this.#input.removeAttribute("aria-owns");
    }
    this.requestUpdate();

    this.#formField?.notifyControlStateChange();

    this.dispatchEvent(
      new ToggleEvent("toggle", {
        oldState: e.oldState,
        newState: e.newState,
      }),
    );

    if (this.#input?.slot === "input" && this.#input.parentElement?.tagName === "M3E-INPUT-CHIP-SET") {
      this.#clearOptions();
    }
  }

  /** @private */
  #showMenu(): void {
    if (this.#menu || !this.#input || this.#input.readOnly || this.#input.disabled) return;

    const count = this.#filterOptions();

    if (!this.#shouldShowMenu) return;

    this.#menu = document.createElement("m3e-option-panel");
    this.#menu.id = this.#menuId;

    if (this.panelClass) {
      for (const klass of this.panelClass
        .split(/\s+/)
        .map((d) => d.trim())
        .filter(Boolean)) {
        this.#menu.classList.add(klass);
      }
    }

    this.#menu.style.overflowX = "hidden";
    this.#menu.scrollStrategy = "reposition";
    this.#menu.fitAnchorWidth = true;
    this.#menu.addEventListener("toggle", this.#menuToggleHandler);
    this.#menu.addEventListener("pointerdown", this.#menuPointerDownHandler);

    this.#projectClone();

    this.#updateMenuState(this.#menu, count);

    (this.#formField ?? this.#input).insertAdjacentElement("afterend", this.#menu);

    this.#input.setAttribute("aria-controls", this.#menuId);
    this.#input.setAttribute("aria-owns", this.#menuId);

    this.#formField?.notifyControlStateChange();

    if (this._listKeyManager.activeItem && this.autoActivate) {
      this.#activateOption(this._listKeyManager.activeItem, true);
    }

    const input = this.#input;
    setTimeout(() => this.#menu?.show(input, this.#formField?.menuAnchor));
  }

  /** @private */
  #projectClone(): void {
    if (!this.#clone || !this.#menu) return;
    const children = [...this.#clone.childNodes];
    if (!this.#hasNoDataSlot && this.noDataLabel) {
      const noDataSpan = document.createElement("span");
      noDataSpan.slot = "no-data";
      noDataSpan.textContent = this.noDataLabel;
      children.push(noDataSpan);
    }
    if (!this.#hasLoadingSlot && this.loadingLabel) {
      const loadingSpan = document.createElement("span");
      loadingSpan.slot = "loading";
      loadingSpan.textContent = this.loadingLabel;
      children.push(loadingSpan);
    }
    this.#menu.replaceChildren(...children);
  }

  /** @private */
  #updateMenuState(menu: M3eOptionPanelElement, count: number): void {
    setCustomState(menu, "-loading", this.loading);
    setCustomState(menu, "-no-data", count == 0);
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

      this.#options.forEach((x) => {
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
  async #updateSelectionState(clone: M3eOptionElement): Promise<void> {
    const option = this._options[this._listKeyManager.items.indexOf(clone)];
    if (option) {
      option.selected = clone.selected;
      if (option.isUpdatePending) {
        await option.updateComplete;
      }
    }
  }

  /** @private */
  async #selectOption(option: M3eOptionElement): Promise<void> {
    if (option.selected) return;

    option.selected = true;
    await this.#updateSelectionState(option);
    if (option.isUpdatePending) {
      await option.updateComplete;
    }

    this.requestUpdate();
    if (this.isUpdatePending) {
      await this.updateComplete;
    }

    if (this.#input) {
      this.#input.value = option.label;
    }

    this.dispatchEvent(new Event("change", { bubbles: true }));

    this.#formField?.notifyControlStateChange(true);
  }

  /** @private */
  #filterOption(clone: M3eOptionElement, option: M3eOptionElement, term: string, exactTerm: string): boolean {
    const value = this.caseSensitive ? option.value : option.value.toLowerCase();
    switch (this.filter) {
      case "starts-with":
        clone.term = exactTerm;
        clone.highlightMode = this.filter;
        return value.startsWith(term);
      case "ends-with":
        clone.term = exactTerm;
        clone.highlightMode = this.filter;
        return value.endsWith(term);
      case "contains":
        clone.term = exactTerm;
        clone.highlightMode = this.filter;
        return value.includes(term);
      case "none":
        clone.disableHighlight = true;
        return true;
      default:
        clone.disableHighlight = true;
        return this.filter(option, exactTerm);
    }
  }

  /** @private */
  #filterOptions(): number {
    if (!this.#input) return 0;

    const oldCount = this.#options.filter((x) => x.hidden === false).length;
    const shouldAnnounce = !this.loading && this.#inputChanged;
    this.#inputChanged = false;

    const exactTerm = this.#input.value;
    const term = this.caseSensitive ? exactTerm : exactTerm.toLocaleLowerCase();

    let newCount = 0;
    let first = false;
    let last: M3eOptionElement | undefined;

    for (let i = 0; i < this.#options.length; i++) {
      const clone = this.#options[i];
      const option = this._options[i];
      clone.hidden = !this.#filterOption(clone, option, term, exactTerm);

      if (clone.hidden === true) {
        this.#deactivateOption(clone);
        deleteCustomState(clone, "-first");
        deleteCustomState(clone, "-last");
      } else {
        newCount++;
        if (!first && !(clone.parentElement instanceof M3eOptGroupElement)) {
          addCustomState(clone, "-first");
          first = true;
          addCustomState(clone, "-last");
          last = clone;
        } else {
          deleteCustomState(clone, "-first");
          if (last) {
            deleteCustomState(last, "-last");
          }
          addCustomState(clone, "-last");
          last = clone;
        }
      }
    }

    if (this.#menu) {
      this.#updateMenuState(this.#menu, newCount);
    }

    const groups = this.#menu?.querySelectorAll("m3e-optgroup") ?? this.#clone?.querySelectorAll("m3e-optgroup") ?? [];
    for (const group of groups) {
      group.hidden = [...group.querySelectorAll("m3e-option")].every((x) => x.hidden === true);
    }

    if (shouldAnnounce) {
      this.#announceResults(oldCount, newCount);
    }

    this.#autoActivate();
    return newCount;
  }

  /** @private */
  #clearOptions(): boolean {
    const selected = this._listKeyManager.items.filter((x) => x.selected);
    if (selected.length > 0) {
      selected.forEach((x) => {
        x.selected = false;
        this.#updateSelectionState(x);
      });
      return true;
    }
    return false;
  }

  /** @private */
  #announceResults(oldCount: number, newCount: number): void {
    if (!this.#hasFocus) return;
    if (newCount == 0) {
      if (oldCount > 0 && this.noDataLabel) {
        M3eLiveAnnouncer.announce(this.noDataLabel, "polite");
      }
    } else if (oldCount != newCount) {
      const message = this.resultsLabel instanceof Function ? this.resultsLabel(newCount) : this.resultsLabel;
      if (message) {
        M3eLiveAnnouncer.announce(message, "polite");
      }
    }
  }

  /** @private */
  #autoActivate(): void {
    if (this.autoActivate && (!this._listKeyManager.activeItem || !this._listKeyManager.activeItem.selected)) {
      const option = this.#options.find((x) => !x.disabled && x.hidden === false);
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

interface M3eAutocompleteElementEventMap extends HTMLElementEventMap {
  toggle: ToggleEvent;
  query: CustomEvent<AutocompleteQueryEventDetail>;
}

export interface M3eAutocompleteElement {
  addEventListener<K extends keyof M3eAutocompleteElementEventMap>(
    type: K,
    listener: (this: M3eAutocompleteElement, ev: M3eAutocompleteElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eAutocompleteElementEventMap>(
    type: K,
    listener: (this: M3eAutocompleteElement, ev: M3eAutocompleteElementEventMap[K]) => void,
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
    "m3e-autocomplete": M3eAutocompleteElement;
  }
}
