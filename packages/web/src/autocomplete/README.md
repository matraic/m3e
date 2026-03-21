# @m3e/web/autocomplete

The `m3e-autocomplete` component enhances a text input field with a dynamically positioned menu of filterable suggestions. Following Material Design 3 principles, it provides real-time filtering, keyboard navigation, automatic option activation, and text highlighting to guide user selection.

```ts
import "@m3e/web/autocomplete";
```

## 🗂️ Elements

- `m3e-autocomplete` — An input enhancement that displays a filtered menu of suggestions, providing real-time filtering and keyboard navigation.

## 🧪 Example

```html
<m3e-form-field>
  <label slot="label" for="fruit">Choose your favorite fruit</label>
  <input id="fruit" />
</m3e-form-field>
<m3e-autocomplete for="fruit">
  <m3e-option>Apples</m3e-option>
  <m3e-option>Oranges</m3e-option>
  <m3e-option>Bananas</m3e-option>
  <m3e-option>Grapes</m3e-option>
</m3e-autocomplete>
```

With auto-activation and required selection:

```html
<m3e-autocomplete for="fruit" auto-activate required>
  <m3e-option>Apples</m3e-option>
  <m3e-option>Oranges</m3e-option>
  <m3e-option>Bananas</m3e-option>
  <m3e-option>Grapes</m3e-option>
</m3e-autocomplete>
```

## 📖 API Reference

This section details the attributes and slots available for the `m3e-autocomplete` component.

### ⚙️ Attributes

| Attribute                  | Type                                         | Default      | Description                                                                    |
| -------------------------- | -------------------------------------------- | ------------ | ------------------------------------------------------------------------------ |
| `auto-activate`            | `boolean`                                    | `false`      | Whether the first option should be automatically activated.                    |
| `case-sensitive`           | `boolean`                                    | `false`      | Whether filtering is case sensitive.                                           |
| `filter`                   | `"contains" \| "starts-with" \| "ends-with"` | `"contains"` | Mode in which to filter options.                                               |
| `hide-selection-indicator` | `boolean`                                    | `false`      | Whether to hide the selection indicator for options.                           |
| `hide-loading`             | `boolean`                                    | `false`      | Whether to hide the menu while options are loading.                            |
| `hide-no-data`             | `boolean`                                    | `false`      | Whether to hide the menu when there are no options to display.                 |
| `loading`                  | `boolean`                                    | `false`      | Whether options are currently being loaded.                                    |
| `loading-label`            | `string`                                     | `Loading...` | The text announced and displayed while loading options.                        |
| `no-data-label`            | `string`                                     | `No options` | The text announced and displayed when no options match the current term.       |
| `required`                 | `boolean`                                    | `false`      | Whether the user must make a selection when interacting with the autocomplete. |
| `results-label`            | `string`                                     |              | The text announced when the available options change for the current term.     |

### 🔧 Properties

| Property       | Type                                                                                                  | Default                          | Description                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------- |
| `filter`       | `"contains" \| "starts-with" \| "ends-with" \| ((option: M3eOptionElement, term: string) => boolean)` | `"contains"`                     | Mode in which to filter options.                                           |
| `resultsLabel` | `Function`                                                                                            | ``(count) => `${count} options`` | The text announced when the available options change for the current term. |

### 🧩 Slots

| Slot        | Description                                        |
| ----------- | -------------------------------------------------- |
| _(default)_ | Renders the options available.                     |
| `loading`   | Renders content when loading options.              |
| `no-data`   | Renders content when there are no options to show. |

### 🔥 Events

| Event    | Description                                                            |
| -------- | ---------------------------------------------------------------------- |
| `toggle` | Emitted when the options menu opens or closes.                         |
| `query`  | Emitted when the input is focused or when the user modifies its value. |
