# @m3e/web/form-field

The `m3e-form-field` component is a semantic, expressive container for form controls that anchors label behavior, subscript messaging, and variant-specific layout. Designed according to Material Design 3 guidelines, it supports two visual variants—`outlined` and `filled`—each with dynamic elevation, shape transitions, and adaptive color theming. The component responds to control state changes (focus, hover, press, disabled, invalid) with smooth motion and semantic clarity, ensuring visual hierarchy and emotional resonance.

```ts
import "@m3e/web/form-field";
```

## 🗂️ Elements

- `m3e-form-field` — A container for form controls that applies Material Design styling and behavior.

## 🧪 Examples

The following example illustrates a basic usage of the `m3e-form-field`.

```html
<m3e-form-field>
  <label slot="label" for="field">Text field</label>
  <input id="field" />
</m3e-form-field>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-form-field` component.

### ⚙️ Attributes

| Attribute              | Type                                | Default      | Description                                                             |
| ---------------------- | ----------------------------------- | ------------ | ----------------------------------------------------------------------- |
| `variant`              | `"filled"` \| `"outlined"`          | `"outlined"` | The appearance variant of the field.                                    |
| `hide-required-marker` | `boolean`                           | `false`      | Whether the required marker should be hidden.                           |
| `hide-subscript`       | `"always"` \| `"auto"` \| `"never"` | `"auto"`     | Whether subscript content is hidden.                                    |
| `float-label`          | `"always"` \| `"auto"`              | `"auto"`     | Specifies whether the label should float always or only when necessary. |

### 🧩 Slots

| Slot          | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| _(default)_   | Renders the form control (e.g. `<input>`, `<select>`, or custom control).   |
| `prefix`      | Renders visual content before the control (e.g. icons, avatars, tokens).    |
| `prefix-text` | Renders plain text before the control, aligned with the input baseline.     |
| `suffix`      | Renders visual content after the control (e.g. icons, buttons, indicators). |
| `suffix-text` | Renders plain text after the control, aligned with the input baseline.      |
| `hint`        | Renders hint text in the subscript area when the control is valid.          |
| `error`       | Renders error text in the subscript area when the control is invalid.       |

#### 🧠 Notes

- Only one control should be slotted at a time.
- `hint` and `error` slots are mutually exclusive based on control validity.
- Prefix/suffix slots support both decorative and interactive content.
- Floating label behavior is automatically coordinated with control state and value.

### 🎛️ CSS Custom Properties

| Property                                      | Description                                       |
| --------------------------------------------- | ------------------------------------------------- |
| `--m3e-form-field-font-size`                  | Font size for the form field container text.      |
| `--m3e-form-field-font-weight`                | Font weight for the form field container text.    |
| `--m3e-form-field-line-height`                | Line height for the form field container text.    |
| `--m3e-form-field-tracking`                   | Letter spacing for the form field container text. |
| `--m3e-form-field-label-font-size`            | Font size for the floating label.                 |
| `--m3e-form-field-label-font-weight`          | Font weight for the floating label.               |
| `--m3e-form-field-label-line-height`          | Line height for the floating label.               |
| `--m3e-form-field-label-tracking`             | Letter spacing for the floating label.            |
| `--m3e-form-field-subscript-font-size`        | Font size for hint and error text.                |
| `--m3e-form-field-subscript-font-weight`      | Font weight for hint and error text.              |
| `--m3e-form-field-subscript-line-height`      | Line height for hint and error text.              |
| `--m3e-form-field-subscript-tracking`         | Letter spacing for hint and error text.           |
| `--m3e-form-field-color`                      | Text color for the form field container.          |
| `--m3e-form-field-subscript-color`            | Color for hint and error text.                    |
| `--m3e-form-field-invalid-color`              | Color used when the control is invalid.           |
| `--m3e-form-field-focused-outline-color`      | Outline color when focused.                       |
| `--m3e-form-field-focused-color`              | Label color when focused.                         |
| `--m3e-form-field-outline-color`              | Outline color in outlined variant.                |
| `--m3e-form-field-container-color`            | Background color in filled variant.               |
| `--m3e-form-field-hover-container-color`      | Hover background color in filled variant.         |
| `--m3e-form-field-width`                      | Width of the form field container.                |
| `--m3e-form-field-icon-size`                  | Size of prefix and suffix icons.                  |
| `--m3e-outlined-form-field-container-shape`   | Corner radius for outlined container.             |
| `--m3e-form-field-container-shape`            | Corner radius for filled container.               |
| `--m3e-form-field-hover-container-opacity`    | Opacity for hover background in filled variant.   |
| `--m3e-form-field-disabled-opacity`           | Opacity for disabled text.                        |
| `--m3e-form-field-disabled-container-opacity` | Opacity for disabled container background.        |
