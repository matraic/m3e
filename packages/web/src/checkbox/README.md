# @m3e/web/checkbox

The `m3e-checkbox` component enables users to select one or more options from a set. It supports selected, unselected, and indeterminate states, and communicates selection through visual cues and accessible semantics. This component reflects user intent, form participation, and validation feedback, adapting to disabled and required contexts. It emits `input` and `change` events to signal state transitions and integrates with form submission via `name` and `value`.

```ts
import "@m3e/web/checkbox";
```

## 🗂️ Elements

- `m3e-checkbox` — A checkbox that allows a user to select one or more options from a limited number of choices.

## 🧪 Examples

Checkboxes can be unchecked, checked, or indeterminate.

```html
<m3e-checkbox></m3e-checkbox>
<m3e-checkbox checked></m3e-checkbox>
<m3e-checkbox indeterminate></m3e-checkbox>
```

Associate labels by wrapping the checkbox or using `for`.

```html
<label><m3e-checkbox></m3e-checkbox> Checkbox 1</label>
<m3e-checkbox id="chk2"></m3e-checkbox>
<label for="chk2">Checkbox 2</label>
```

Use `disabled` to disable a checkbox and its associated label.

```html
<label><m3e-checkbox disabled></m3e-checkbox>Disabled Checkbox 1</label>
<m3e-checkbox id="chk3" disabled></m3e-checkbox>
<label for="chk3">Disabled Checkbox 2</label>
```

Use `required` to require a checked value on form submission. Import `@m3e/web/button`
for the submit button. The showcase script prevents navigation and checks validity;
load it before `DOMContentLoaded`.

```html
<form>
  <label>
    <m3e-checkbox name="accepted" required></m3e-checkbox>I accept the Terms and Conditions
  </label>
  <br />
  <m3e-button variant="filled" type="submit">Submit</m3e-button>
</form>
```
```js
window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.checkValidity();
  });
});
```

Apply a density scale with CSS custom properties. Additional classes are omitted for brevity.

```html
<label>
  <m3e-checkbox class="density-3"></m3e-checkbox>
  Density -3
</label>
<!-- Additional checkboxes omitted for brevity -->
```
```css
.density-3 {
  --md-sys-density-scale: -3;
}
```

## 📖 API Reference

This section details the attributes, events and CSS custom properties available for the `m3e-checkbox` component.

### ⚙️ Attributes

| Attribute       | Type      | Default | Description                                                               |
| --------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `checked`       | `boolean` | `false` | Whether the element is checked.                                           |
| `disabled`      | `boolean` | `false` | Whether the element is disabled.                                          |
| `indeterminate` | `boolean` | `false` | Whether the element's checked state is indeterminate.                     |
| `name`          | `string`  |         | The name that identifies the element when submitting the associated form. |
| `required`      | `boolean` | `false` | Whether the element is required.                                          |
| `value`         | `string`  | `"on"`  | A string representing the value of the checkbox.                          |

#### 🔔 Events

| Event         | Description                                                                      |
| ------------- | -------------------------------------------------------------------------------- |
| `beforeinput` | Emitted before the checked state changes.                                        |
| `input`       | Dispatched when the checked state changes.                                       |
| `invalid`     | Dispatched when a form is submitted and the element fails constraint validation. |
| `change`      | Dispatched when the checked state changes.                                       |

### 🎛️ CSS Custom Properties

| Property                                             | Description                                      |
| ---------------------------------------------------- | ------------------------------------------------ |
| `--m3e-checkbox-icon-size`                           | Size of the checkbox icon inside the container.  |
| `--m3e-checkbox-container-size`                      | Base size of the checkbox container.             |
| `--m3e-checkbox-container-shape`                     | Border radius of the icon container.             |
| `--m3e-checkbox-unselected-outline-thickness`        | Border thickness for unselected state.           |
| `--m3e-checkbox-unselected-outline-color`            | Border color for unselected state.               |
| `--m3e-checkbox-unselected-hover-outline-color`      | Border color on hover when unselected.           |
| `--m3e-checkbox-unselected-disabled-outline-color`   | Base color for disabled unselected outline.      |
| `--m3e-checkbox-unselected-disabled-outline-opacity` | Opacity for disabled unselected outline.         |
| `--m3e-checkbox-unselected-error-outline-color`      | Border color for invalid unselected state.       |
| `--m3e-checkbox-selected-container-color`            | Background color for selected container.         |
| `--m3e-checkbox-selected-icon-color`                 | Icon color for selected state.                   |
| `--m3e-checkbox-selected-disabled-container-color`   | Base color for disabled selected container.      |
| `--m3e-checkbox-selected-disabled-container-opacity` | Opacity for disabled selected container.         |
| `--m3e-checkbox-selected-disabled-icon-color`        | Base color for disabled selected icon.           |
| `--m3e-checkbox-selected-disabled-icon-opacity`      | Opacity for disabled selected icon.              |
| `--m3e-checkbox-unselected-hover-color`              | Ripple hover color for unselected state.         |
| `--m3e-checkbox-unselected-focus-color`              | Ripple focus color for unselected state.         |
| `--m3e-checkbox-unselected-ripple-color`             | Ripple base color for unselected state.          |
| `--m3e-checkbox-selected-hover-color`                | Ripple hover color for selected state.           |
| `--m3e-checkbox-selected-focus-color`                | Ripple focus color for selected state.           |
| `--m3e-checkbox-selected-ripple-color`               | Ripple base color for selected state.            |
| `--m3e-checkbox-unselected-error-hover-color`        | Ripple hover color for invalid unselected state. |
| `--m3e-checkbox-unselected-error-focus-color`        | Ripple focus color for invalid unselected state. |
| `--m3e-checkbox-unselected-error-ripple-color`       | Ripple base color for invalid unselected state.  |
| `--m3e-checkbox-selected-error-hover-color`          | Ripple hover color for invalid selected state.   |
| `--m3e-checkbox-selected-error-focus-color`          | Ripple focus color for invalid selected state.   |
| `--m3e-checkbox-selected-error-ripple-color`         | Ripple base color for invalid selected state.    |
