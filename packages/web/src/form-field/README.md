# @m3e/web/form-field

The `m3e-form-field` component is a semantic, expressive container for form controls that anchors label behavior, subscript messaging, and variant-specific layout. Designed according to Material Design 3 guidelines, it supports two visual variants—`outlined` and `filled`—each with dynamic elevation, shape transitions, and adaptive color theming. The component responds to control state changes (focus, hover, press, disabled, invalid) with smooth motion and semantic clarity, ensuring visual hierarchy and emotional resonance.

```ts
import "@m3e/web/form-field";
```

## 🗂️ Elements

- `m3e-form-field` — A container for form controls that applies Material Design styling and behavior.

## 🧪 Examples

Set `variant` to `outlined` (the default) or `filled`.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="fld">Outlined</label>
  <input id="fld" />
</m3e-form-field>
<!-- Additional variants omitted for brevity -->
```

Use `float-label="always"` to keep the label floated above the control.

```html
<m3e-form-field float-label="always">
  <label slot="label" for="fld">Always float label</label>
  <input id="fld" />
</m3e-form-field>
```

Place hint text in the `hint` slot. Use `hide-subscript="never"` to keep the subscript visible.

```html
<m3e-form-field hide-subscript="never">
  <label slot="label" for="fld">Field w/ hint</label>
  <input id="fld" />
  <span slot="hint">Hint text</span>
</m3e-form-field>
```

A required control displays its validation message after interaction or form submission, replacing the hint.

```html
<m3e-form-field>
  <label slot="label" for="fld5">Required field</label>
  <input id="fld5" required />
  <span slot="hint">Hint text</span>
</m3e-form-field>
```

Use the `error` slot to provide a custom error message for an invalid control.

```html
<m3e-form-field>
  <label slot="label" for="fld">Required field</label>
  <input id="fld" required />
  <span slot="hint">Hint text</span>
  <span slot="error">Custom error message</span>
</m3e-form-field>
```

Set `error` to manually apply the error slot text as the control's custom validity. Removing it clears the error state.

```html
<m3e-form-field error>
  <label slot="label" for="fld">Manually validated field</label>
  <input id="fld" />
  <span slot="hint">Hint text</span>
  <span slot="error">Custom error message</span>
</m3e-form-field>
```

Use `hide-required-marker` to hide the required marker without removing the control's required constraint.

```html
<m3e-form-field hide-required-marker>
  <label slot="label" for="fld">Required field</label>
  <input id="fld" required />
</m3e-form-field>
```

Use `prefix` and `suffix` for icons or buttons, and `prefix-text` and `suffix-text` for text. Import `@m3e/web/icon-button` and `@m3e/web/icon`. Give the icon-only button an accessible label and implement its clear action.

```html
<m3e-form-field>
  <label slot="label" for="fld">Amount</label>
  <span slot="prefix-text">$</span>
  <input id="fld" type="number" placeholder="0" />
  <span slot="suffix-text">.00</span>
  <m3e-icon-button slot="suffix">
    <m3e-icon name="clear"></m3e-icon>
  </m3e-icon-button>
</m3e-form-field>
```

Set `--md-sys-density-scale` to adjust the field's density. Negative scales down to -3 are supported; additional classes are omitted.

```html
<m3e-form-field variant="outlined" class="density-3">
  <label slot="label" for="fld">Density -3</label>
  <input id="fld" />
</m3e-form-field>
<!-- Additional fields and variants omitted for brevity -->
```

```css
.density-3 {
  --md-sys-density-scale: -3;
}
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-form-field` component.

### ⚙️ Attributes

| Attribute              | Type                                | Default      | Description                                                              |
| ---------------------- | ----------------------------------- | ------------ | ------------------------------------------------------------------------ |
| `variant`              | `"filled"` \| `"outlined"`          | `"outlined"` | The appearance variant of the field.                                     |
| `hide-required-marker` | `boolean`                           | `false`      | Whether the required marker should be hidden.                            |
| `hide-subscript`       | `"always"` \| `"auto"` \| `"never"` | `"auto"`     | Whether subscript content is hidden.                                     |
| `float-label`          | `"always"` \| `"auto"`              | `"auto"`     | Specifies whether the label should float always or only when necessary.  |
| `error`                | `boolean`                           | `false`      | Manually forces the field into an error state using the error slot text. |

### 🧩 Slots

| Slot          | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| _(default)_   | Renders the form control (e.g. `<input>`, `<select>`, or custom control).   |
| `label`       | Renders the label of the field.                                             |
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
