# @m3e/web/select

The `m3e-select` component provides a form control for selecting a value from a set of predefined options. Following Material Design 3 principles, it supports both single and multiple selection modes, customizable validation states, accessible keyboard navigation, and extensive theming via CSS custom properties.

```ts
import "@m3e/web/select";
```

## 🗂️ Elements

- `m3e-select` — A form control that allows users to select a value from a set of predefined options with support for single and multiple selection.

## 🧪 Example

The following demonstrates a `m3e-select` component wrapped in a `m3e-form-field` with a slotted label. The label is associated with the select via the `for` and `id` attributes, ensuring accessible form semantics. Each `m3e-option` defines an option within the dropdown.

```html
<m3e-form-field>
  <label slot="label" for="select">Choose your favorite fruit</label>
  <m3e-select id="select">
    <m3e-option>Apples</m3e-option>
    <m3e-option>Oranges</m3e-option>
    <m3e-option>Bananas</m3e-option>
    <m3e-option>Grapes</m3e-option>
  </m3e-select>
</m3e-form-field>
```

Multiple selection:

```html
<m3e-select multi>
  <m3e-option value="javascript">JavaScript</m3e-option>
  <m3e-option value="typescript">TypeScript</m3e-option>
  <m3e-option value="python">Python</m3e-option>
</m3e-select>
```

## 📖 API Reference

### 🗂️ m3e-select

This section details the attributes, slots, events and CSS custom properties available for the `m3e-select` component.

#### ⚙️ Attributes

| Attribute                  | Type      | Default | Description                                                               |
| -------------------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `disabled`                 | `boolean` | `false` | Whether the element is disabled.                                          |
| `hide-selection-indicator` | `boolean` | `false` | Whether to hide the selection indicator for single select options.        |
| `multi`                    | `boolean` | `false` | Whether multiple options can be selected.                                 |
| `name`                     | `string`  |         | The name that identifies the element when submitting the associated form. |
| `required`                 | `boolean` | `false` | Whether the element is required.                                          |

#### 🔔 Events

| Event    | Description                              |
| -------- | ---------------------------------------- |
| `input`  | Emitted when the selected state changes. |
| `change` | Emitted when the selected state changes. |

#### 🧩 Slots

| Slot        | Description                        |
| ----------- | ---------------------------------- |
| _(default)_ | Renders the options of the select. |
| `arrow`     | Renders the dropdown arrow.        |
| `value`     | Renders the selected value(s).     |

#### 🎛️ CSS Custom Properties

| Property                              | Description                                           |
| ------------------------------------- | ----------------------------------------------------- |
| `--m3e-form-field-font-size`          | The font size of the select control.                  |
| `--m3e-form-field-font-weight`        | The font weight of the select control.                |
| `--m3e-form-field-line-height`        | The line height of the select control.                |
| `--m3e-form-field-tracking`           | The letter spacing of the select control.             |
| `--m3e-select-container-shape`        | The corner radius of the select container.            |
| `--m3e-select-disabled-color`         | The text color when the select is disabled.           |
| `--m3e-select-disabled-color-opacity` | The opacity level applied to the disabled text color. |
| `--m3e-select-icon-size`              | The size of the dropdown arrow icon.                  |
