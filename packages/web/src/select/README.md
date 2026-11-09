# @m3e/web/select

The `m3e-select` component provides a form control for selecting a value from a set of predefined options. Following Material Design 3 principles, it supports both single and multiple selection modes, customizable validation states, accessible keyboard navigation, and extensive theming via CSS custom properties.

```ts
import "@m3e/web/select";
```

## 🗂️ Elements

- `m3e-select` — A form control that allows users to select a value from a set of predefined options with support for single and multiple selection.

## 🧪 Example

Showcase: Basic usage. Import `@m3e/web/select`. Also import `@m3e/web/form-field`, `@m3e/web/option`.

```html
<m3e-form-field>
  <label slot="label" for="select">Favorite fruit</label>
  <m3e-select id="select">
    <m3e-option>Apples</m3e-option>
    <m3e-option>Oranges</m3e-option>
    <m3e-option>Bananas</m3e-option>
    <m3e-option>Grapes</m3e-option>
  </m3e-select>
</m3e-form-field>
```

Showcase: Empty options. Import `@m3e/web/select`. Also import `@m3e/web/form-field`, `@m3e/web/option`.

```html
<m3e-form-field>
  <label slot="label" for="select">Favorite fruit</label>
  <m3e-select id="select">
    <m3e-option value="">None</m3e-option>
    <m3e-option>Apples</m3e-option>
    <m3e-option>Oranges</m3e-option>
    <m3e-option>Bananas</m3e-option>
    <m3e-option>Grapes</m3e-option>
  </m3e-select>
</m3e-form-field>
```

Showcase: Option groups. Import `@m3e/web/select`. Also import `@m3e/web/form-field`, `@m3e/web/option`.

```html
<m3e-form-field>
  <label slot="label" for="select">Pokemon</label>
  <m3e-select id="select">
    <m3e-optgroup>
      <span slot="label">Grass</span>
      <m3e-option>Bulbasaur</m3e-option>
      <m3e-option>Oddish</m3e-option>
      <m3e-option>Bellsprout</m3e-option>
    </m3e-optgroup>
    <!-- Additional option groups omitted for brevity -->
  </m3e-select>
</m3e-form-field>
```

Showcase: Selection. Import `@m3e/web/select`. Also import `@m3e/web/form-field`, `@m3e/web/option`.

```html
<m3e-form-field>
  <label slot="label" for="select">Toppings</label>
  <m3e-select id="select" multi>
    <m3e-option selected>Extra cheese</m3e-option>
    <m3e-option selected>Mushroom</m3e-option>
    <!-- Additional option groups omitted for brevity -->
  </m3e-select>
</m3e-form-field>
```

Showcase: Selection. Import `@m3e/web/select`. Also import `@m3e/web/form-field`, `@m3e/web/option`.

```html
<m3e-form-field>
  <label slot="label" for="select">Toppings</label>
  <m3e-select id="select" multi value="extra-cheese,mushroom">
    <m3e-option value="extra-cheese">Extra cheese</m3e-option>
    <m3e-option value="mushroom">Mushroom</m3e-option>
    <!-- Additional option groups omitted for brevity -->
  </m3e-select>
</m3e-form-field>
```

Showcase: Disabling. Import `@m3e/web/select`. Also import `@m3e/web/form-field`, `@m3e/web/option`.

```html
<m3e-form-field>
  <label slot="label" for="select">Favorite fruit</label>
  <m3e-select id="select" disabled>
    <m3e-option selected>Apples</m3e-option>
    <!-- Additional option groups omitted for brevity -->
  </m3e-select>
</m3e-form-field>
```

Showcase: Disabling. Import `@m3e/web/select`. Also import `@m3e/web/form-field`, `@m3e/web/option`.

```html
<m3e-form-field>
  <label slot="label" for="select">Favorite fruit</label>
  <m3e-select id="select">
    <m3e-option disabled>Apples</m3e-option>
    <!-- Additional option groups omitted for brevity -->
  </m3e-select>
</m3e-form-field>
```

Showcase: Required. Import `@m3e/web/select`. Also import `@m3e/web/form-field`, `@m3e/web/option`.

```html
<m3e-form-field>
  <label slot="label" for="select">Favorite fruit</label>
  <m3e-select id="select" required>
    <m3e-option value="">None</m3e-option>
    <m3e-option>Apples</m3e-option>
    <!-- Additional option groups omitted for brevity -->
  </m3e-select>
</m3e-form-field>
```

Showcase: Density. Import `@m3e/web/select`. Also import `@m3e/web/form-field`. Apply the required styling for the illustrated classes in your application. Additional styles are omitted for brevity.

```html
<m3e-form-field class="density-3">
  <label slot="label" for="select">Density -3</label>
  <m3e-select id="select" panel-class="density-3">
    <!-- Options omitted for brevity -->
  </m3e-select>
</m3e-form-field>
<!-- Additional fields omitted for brevity -->
```

```css
.density-3 {
  --md-sys-density-scale: -3;
}
```

## 📖 API Reference

### 🗂️ m3e-select

This section details the attributes, slots, events and CSS custom properties available for the `m3e-select` component.

#### ⚙️ Attributes

| Attribute                  | Type      | Default | Description                                                                      |
| -------------------------- | --------- | ------- | -------------------------------------------------------------------------------- |
| `disabled`                 | `boolean` | `false` | Whether the element is disabled.                                                 |
| `hide-selection-indicator` | `boolean` | `false` | Whether to hide the selection indicator for single select options.               |
| `multi`                    | `boolean` | `false` | Whether multiple options can be selected.                                        |
| `name`                     | `string`  |         | The name that identifies the element when submitting the associated form.        |
| `panel-class`              | `string`  |         | Class or list of classes to be applied to the select's overlay panel.            |
| `required`                 | `boolean` | `false` | Whether the element is required.                                                 |
| `value`                    | `string`  |         | Selected value(s), single for single‑select or comma‑separated for multi‑select. |

#### 🔔 Events

| Event         | Description                                   |
| ------------- | --------------------------------------------- |
| `beforeinput` | Dispatched before the selected state changes. |
| `input`       | Dispatched when the selected state changes.   |
| `change`      | Dispatched when the selected state changes.   |

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
