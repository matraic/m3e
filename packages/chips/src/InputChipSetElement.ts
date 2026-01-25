import { css, CSSResultGroup, html, PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

import {
  AttachInternals,
  ConstraintValidation,
  DesignToken,
  Dirty,
  Disabled,
  FormAssociated,
  formValue,
  Required,
  RequiredConstraintValidation,
  Role,
  Touched,
} from "@m3e/core";

import { ListKeyManager, ListManager } from "@m3e/core/a11y";
import { M3eDirectionality } from "@m3e/core/bidi";
import { FormFieldControl } from "@m3e/form-field";

import { M3eChipSetElement } from "./ChipSetElement";
import { M3eInputChipElement } from "./InputChipElement";

/**
 * A container that transforms user input into a cohesive set of interactive chips, supporting entry, editing, and removal of discrete values.
 *
 * @description
 * The `m3e-input-chip-set` component enables users to input, display, and manage a collection of discrete
 * values as input chips. Designed for expressive, accessible forms, it supports keyboard navigation, validation,
 * and seamless integration with form controls. This component is ideal for capturing user-generated tags,
 * keywords, or selections in a visually consistent and interactive manner.
 *
 * @example
 * The following example illustrates the use of the `m3e-input-chip-set` inside a `m3e-form-field`.
 * In this example, the `input` slot specifies the `input` element used to add input chips and the
 * field label's `for` attribute targets the `input` element to provide an accessible label.
 * ```html
 * <m3e-form-field>
 *  <label slot="label" for="keywords">Keywords</label>
 *  <m3e-input-chip-set aria-label="Enter keywords">
 *    <input id="keywords" slot="input" placeholder="New keyword..." />
 *  </m3e-input-chip-set>
 * </m3e-form-field>
 * ```
 *
 * @tag m3e-input-chip-set
 *
 * @slot - Renders the chips of the set.
 * @slot input - Renders the input element used to add new chips to the set.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr name - The name that identifies the element when submitting the associated form.
 * @attr required - Whether a value is required for the element.
 * @attr vertical - Whether the element is oriented vertically.
 *
 * @fires change - Emitted when a chip is added to, or removed from, the set.
 *
 * @cssprop --m3e-chip-set-spacing - The spacing (gap) between chips in the set.
 */
@customElement("m3e-input-chip-set")
export class M3eInputChipSetElement
  extends RequiredConstraintValidation(
    Required(
      ConstraintValidation(Dirty(Touched(FormAssociated(Disabled(AttachInternals(Role(M3eChipSetElement, "grid"))))))),
    ),
  )
  implements FormFieldControl
{
  static {
    const lightDomStyle = new CSSStyleSheet();
    lightDomStyle.replaceSync(
      css`
        m3e-input-chip-set [slot="input"]::placeholder {
          user-select: none;
          color: currentColor;
          transition: opacity ${DesignToken.motion.duration.extraLong1};
        }
        m3e-input-chip-set:not(:focus-within) [slot="input"]::placeholder {
          opacity: 0;
          transition: 0s;
        }
        m3e-input-chip-set:hover [slot="input"]::placeholder {
          transition: 0s;
        }
        @media (prefers-reduced-motion) {
          m3e-input-chip-set [slot="input"]::placeholder {
            transition: none !important;
          }
        }
      `.toString(),
    );

    document.adoptedStyleSheets = [...document.adoptedStyleSheets, lightDomStyle];
  }

  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    M3eChipSetElement.styles,
    css`
      ::slotted([slot="input"]) {
        outline: unset;
        border: unset;
        background-color: transparent;
        box-shadow: none;
        font-family: inherit;
        font-size: inherit;
        line-height: initial;
        letter-spacing: inherit;
        color: var(--_form-field-input-color, inherit);
        flex: 1 1 auto;
        min-width: 0;
        padding: unset;
      }
      ::slotted(m3e-input-chip) {
        min-width: 0;
      }
      span[role="row"],
      span[role="gridcell"] {
        display: contents;
      }
    `,
  ];

  /** @private */ #directionalitySubscription?: () => void;
  /** @private */ readonly #inputChangeHandler = () => this.#handleInputChange();
  /** @private */ readonly #inputKeyDownHandler = (e: KeyboardEvent) => this.#handleInputKeyDown(e);
  /** @private */ readonly #focusHandler = () => this.#handleFocus();
  /** @private */ readonly #focusInHandler = () => this.#handleFocusIn();
  /** @private */ readonly #focusOutHandler = () => this.#handleFocusOut();
  /** @private */ readonly #chipRemoveHandler = (e: Event) => this.#handleChipRemove(e);
  /** @private */ readonly #chipClickHandler = (e: Event) => this.#handleChipClick(e);

  /** @private */ readonly #listManager = new ListManager<M3eInputChipElement>();
  /** @private */ readonly #listKeyManager = new ListKeyManager<HTMLElement>()
    .onActiveItemChange(() => this.#listKeyManager.activeItem?.focus())
    .withHomeAndEnd()
    .withSkipPredicate((x) => !x.hasAttribute("tabindex"))
    .withDirectionality(M3eDirectionality.current);

  /** @private */ #ignoreInputChange = false;
  /** @private */ #input: HTMLInputElement | null = null;
  /** @private */ #tabindex = 0;

  /** The chips of the set. */
  get chips(): readonly M3eInputChipElement[] {
    // NOTE: query is used instead of the internal list management due to
    // validating required state on change to support form-field integration.
    return [...this.querySelectorAll("m3e-input-chip")];
  }

  /** The values of the set. */
  get value(): readonly string[] | null {
    const values = this.chips.filter((x) => !x.disabled).map((x) => x.value);
    return values.length == 0 ? null : values;
  }

  /** @inheritdoc @internal */
  override get [formValue]() {
    const values = this.value;
    if (!values) return null;
    const data = new FormData();
    for (const value of values) {
      data.append(this.name, value);
    }
    return data;
  }

  /** @inheritdoc */
  get shouldLabelFloat(): boolean {
    return this.chips.length > 0;
  }

  /** @inheritdoc */
  onContainerClick(): void {
    this.#input?.focus();
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.closest("m3e-form-field")?.notifyControlStateChange();

    this.#tabindex = Number.parseInt(this.getAttribute("tabindex") ?? "0");
    this.addEventListener("focus", this.#focusHandler);
    this.addEventListener("focusin", this.#focusInHandler);
    this.addEventListener("focusout", this.#focusOutHandler);

    this.#directionalitySubscription = M3eDirectionality.observe(
      () => (this.#listKeyManager.directionality = M3eDirectionality.current),
    );
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("focus", this.#focusHandler);
    this.removeEventListener("focusin", this.#focusInHandler);
    this.removeEventListener("focusout", this.#focusOutHandler);

    this.#directionalitySubscription?.();
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", `${this.#tabindex}`);
    }
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("vertical")) {
      this.ariaOrientation = null;
    }
    if (changedProperties.has("disabled")) {
      this.#listManager.items.forEach((x) => (x.disabled = this.disabled));
      if (this.#input) {
        this.#input.disabled = this.disabled;
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot @keydown="${this.#handleKeyDown}" @slotchange="${this.#handleSlotChange}"></slot>
      <span role="row">
        <span role="gridcell"><slot name="input" @slotchange="${this.#handleInputSlotChange}"></slot></span>
      </span> `;
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    this.#listKeyManager.onKeyDown(e);
  }

  /** @private */
  async #handleSlotChange(): Promise<void> {
    const { added, removed } = this.#listManager.setItems([...this.querySelectorAll("m3e-input-chip")]);

    for (const chip of added) {
      if (chip.isUpdatePending) {
        await chip.updateComplete;
      }
      if (this.disabled) {
        chip.disabled = true;
      }
      chip.addEventListener("remove", this.#chipRemoveHandler);
      chip.cell.addEventListener("click", this.#chipClickHandler);
    }

    removed.forEach((x) => {
      x.removeEventListener("remove", this.#chipRemoveHandler);
      x.cell.removeEventListener("click", this.#chipClickHandler);
    });

    this.#listKeyManager.setItems(
      this.#listManager.items.flatMap((x) => (x.removeButton ? [x.cell, x.removeButton] : [x.cell])),
    );
    if (!this.#listKeyManager.activeItem) {
      this.#listKeyManager.updateActiveItem(this.#listKeyManager.items.find((x) => x.hasAttribute("tabindex")));
    }
  }

  /** @private */
  #handleInputSlotChange(): void {
    const input = this.querySelector("input");
    if (this.#input) {
      this.#input.removeEventListener("change", this.#inputChangeHandler);
      this.#input.removeEventListener("keydown", this.#inputKeyDownHandler);
    }

    this.#input = input;
    if (this.#input) {
      this.#input.disabled = this.disabled;
      this.#input.addEventListener("change", this.#inputChangeHandler);
      this.#input.addEventListener("keydown", this.#inputKeyDownHandler);

      const property = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!;
      Object.defineProperty(input, "value", {
        get: () => property.get?.call(input),
        set: (value: string) => {
          property.set?.call(input, value);
          if (this.#input === input && !this.#ignoreInputChange) {
            this.#handleInputChange();
          }
        },
      });
    }
  }

  /** @private */
  #handleFocus(): void {
    setTimeout(() => (this.#listKeyManager.activeItem ?? this.#input)?.focus());
  }

  /** @private */
  #handleFocusIn(): void {
    this.setAttribute("tabindex", "-1");
  }

  /** @private */
  #handleFocusOut(): void {
    this.setAttribute("tabindex", `${this.#tabindex}`);
  }

  /** @private */
  #handleChipRemove(e: Event): void {
    const chip = <M3eInputChipElement>e.target;
    const index = this.#listManager.items.indexOf(chip);
    const nextChip = this.#listManager.items.find((x, y) => y > index && !x.disabled && x.removable);

    chip.remove();

    this.#listKeyManager.setActiveItem(this.#listKeyManager.items.find((x) => x === nextChip?.removeButton));
    if (!this.#listKeyManager.activeItem) {
      this.#input?.focus();
    }

    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** @private */
  #handleChipClick(e: Event): void {
    this.#listKeyManager.updateActiveItem(e.composedPath().find((x) => x instanceof M3eInputChipElement)?.cell);
  }

  /** @private */
  #handleInputChange(): void {
    const value = this.#input?.value;
    if (!value) return;

    setTimeout(() => {
      const value = this.#input?.value;
      if (!value) return;

      const chip = document.createElement("m3e-input-chip");
      chip.removable = true;
      chip.appendChild(document.createTextNode(value));
      this.appendChild(chip);

      if (this.#input) {
        try {
          this.#ignoreInputChange = true;
          this.#input.value = "";
        } finally {
          this.#ignoreInputChange = false;
        }
      }

      this.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  /** @private */
  #handleInputKeyDown(e: KeyboardEvent): void {
    if (e.key === "Backspace" && !this.#input?.value) {
      const item = [...this.#listManager.items]
        .reverse()
        .find((x) => !x.disabled && !x.disabledInteractive && x.removable);
      if (item) {
        item.dispatchEvent(new Event("remove"));
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-input-chip-set": M3eInputChipSetElement;
  }
}
