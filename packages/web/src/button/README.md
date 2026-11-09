# @m3e/web/button

The `m3e-button` component is a semantic, expressive UI primitive users interact with to perform an action. Designed according to Material Design 3 guidelines, it supports five visual variants, specified using the `variant` attribute—`filled`, `tonal`, `elevated`, `outlined`, and `text`—each with dynamic elevation, shape morphing, and adaptive color theming. The component responds to interaction states (hover, focus, press, disabled) with smooth motion transitions, ensuring emotional clarity and visual hierarchy.

The component is accessible by default, with ARIA roles, contrast-safe color tokens, and strong focus indicators. It supports optional icons and states for binary actions. When using `m3e-icon` for icons, `filled` is automatically set based on the selected state of a toggle button. It can also function as a link or be used to submit form data.

Native disabled `<button>` elements cannot receive focus. This can be problematic in some cases because it can prevent you from telling the user why the button is disabled. You can use the `disabled-interactive` attribute to style a `m3e-button` as disabled but allow for it to receive focus. The button will have `aria-disabled="true"` for assistive technology.

```ts
import "@m3e/web/button";
```

## 🗂️ Elements

- `m3e-button` — A button users interact with to perform an action.

## 🧪 Examples

Use `variant` to choose `elevated`, `filled`, `tonal`, `outlined`, or `text` (default). The showcase omits the additional variants.

```html
<m3e-button variant="elevated">Elevated</m3e-button>
<!-- Additional variants omitted for brevity -->
```

Use `shape` to choose `square` or `rounded` (default). The showcase omits the additional variants.

```html
<m3e-button variant="elevated" shape="square">Square Elevated</m3e-button>
<!-- Additional variants omitted for brevity -->
```

Use `size` to choose `extra-small`, `small` (default), `medium`, `large`, or `extra-large`. The showcase omits the additional sizes.

```html
<m3e-button variant="tonal" size="extra-small">Extra Small</m3e-button>
<!-- Additional sizes omitted for brevity -->
```

Use the `icon` and `trailing-icon` slots to place icons before or after the label. Import `@m3e/web/icon` and load the Material Symbols font to use `m3e-icon`.

```html
<m3e-button variant="tonal">
  <m3e-icon slot="icon" name="send"></m3e-icon>Send
</m3e-button>
<m3e-button variant="tonal">
  Open<m3e-icon slot="trailing-icon" name="open_in_new_window"></m3e-icon>
</m3e-button>
```

Use `toggle` for binary selection and `selected` to control its state. The cancelable `beforeinput` event precedes the `input` and `change` events. The showcase omits the additional variants.

```html
<m3e-button variant="elevated" toggle>Elevated Toggle</m3e-button>
<!-- Additional variants omitted for brevity -->
```

Use the `selected` and `selected-icon` slots for alternate content when selected. Import `@m3e/web/icon` and load the Material Symbols font to use `m3e-icon`.

```html
<m3e-button variant="filled" toggle>
  <m3e-icon slot="icon" name="play_arrow"></m3e-icon>
  <m3e-icon slot="selected-icon" name="stop"></m3e-icon>
  Start
  <span slot="selected">Stop</span>
</m3e-button>
```

Use `disabled` to disable a button, or `disabled-interactive` to keep a disabled button focusable.

```html
<m3e-button variant="filled" disabled>Disabled</m3e-button>
<m3e-button variant="filled" disabled-interactive>Disabled Interactive</m3e-button>
```

Use `href` to make the button a link; `target`, `rel`, and `download` are also supported. Import `@m3e/web/icon` and load the Material Symbols font to use `m3e-icon`.

```html
<m3e-button variant="tonal" href="https://www.google.com" target="_blank">
  Google<m3e-icon slot="trailing-icon" name="open_in_new_window"></m3e-icon>
</m3e-button>
```

Apply `--md-sys-density-scale` to adjust the density of an extra-small button. Import `@m3e/web/icon` and load the Material Symbols font to use `m3e-icon`. The showcase omits additional buttons and density classes.

```html
<m3e-button variant="filled" size="extra-small" class="density-3">
  <m3e-icon slot="icon" name="stars"></m3e-icon>
  Density -3
</m3e-button>
<!-- Additional buttons omitted for brevity -->
```

```css
.density-3 {
  --md-sys-density-scale: -3;
}
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-button` component.

### ⚙️ Attributes

| Attribute              | Type                                                               | Default     | Description                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`              | `"elevated" \| "filled" \| "tonal" \| "outlined" \| "text"`        | `"text"`    | The appearance variant of the button.                                                                                                  |
| `shape`                | `"rounded" \| "square"`                                            | `"rounded"` | The shape of the button.                                                                                                               |
| `size`                 | `"extra-small" \| "small" \| "medium" \| "large" \| "extra-large"` | `"small"`   | The size of the button.                                                                                                                |
| `toggle`               | `boolean`                                                          | `false`     | Whether the button will toggle between selected and unselected states.                                                                 |
| `selected`             | `boolean`                                                          | `false`     | Whether the toggle button is selected.                                                                                                 |
| `disabled`             | `boolean`                                                          | `false`     | Whether the element is disabled.                                                                                                       |
| `disabled-interactive` | `boolean`                                                          | `false`     | Whether the element is disabled and interactive.                                                                                       |
| `type`                 | `"button" \| "submit" \| "reset"`                                  | `"button"`  | The type of the element.                                                                                                               |
| `name`                 | `string`                                                           |             | The name of the element, submitted as a pair with the element's value as part of form data, when the element is used to submit a form. |
| `value`                | `string`                                                           |             | The value associated with the element's name when it's submitted with form data.                                                       |
| `href`                 | `string`                                                           |             | The URL to which the link button points.                                                                                               |
| `target`               | `string`                                                           |             | The target of the link button.                                                                                                         |
| `rel`                  | `string`                                                           |             | The relationship between the target of the link button and the document.                                                               |
| `download`             | `string`                                                           |             | Whether the target of the link button will be downloaded, optionally specifying the new name of the file.                              |

### 🧩 Slots

| Slot            | Description                                   |
| --------------- | --------------------------------------------- |
| _(default)_     | Renders button label/content.                 |
| `icon`          | Renders leading icon before label.            |
| `trailing-icon` | Renders trailing icon after label.            |
| `selected`      | Renders label when toggle button is selected. |
| `selected-icon` | Renders icon before label when selected.      |

### 🔔 Events

| Event         | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| `beforeinput` | Dispatched before a toggle button's selected state changes. |
| `input`       | Dispatched when a toggle button's selected state changes.   |
| `change`      | Dispatched when a toggle button's selected state changes.   |

### 🎛️ CSS Custom Properties

#### 🧱 Size Properties

All size variants (`extra-small`, `small`, `medium`, `large`, `extra-large`) support the following tokens. Omitting the `[size]-` prefix overrides the value for all sizes.

| Property                                     | Description                          |
| -------------------------------------------- | ------------------------------------ |
| `--m3e-button-[size]-container-height`       | Height of the button container       |
| `--m3e-button-[size]-outline-thickness`      | Outline thickness                    |
| `--m3e-button-[size]-label-text-font-size`   | Font size for label                  |
| `--m3e-button-[size]-label-text-font-weight` | Font weight for label                |
| `--m3e-button-[size]-label-text-line-height` | Line height for label                |
| `--m3e-button-[size]-label-text-tracking`    | Letter tracking for label            |
| `--m3e-button-[size]-icon-size`              | Icon size                            |
| `--m3e-button-[size]-shape-round`            | Corner radius for round shape        |
| `--m3e-button-[size]-shape-square`           | Corner radius for square shape       |
| `--m3e-button-[size]-selected-shape-round`   | Corner radius when selected (round)  |
| `--m3e-button-[size]-selected-shape-square`  | Corner radius when selected (square) |
| `--m3e-button-[size]-shape-pressed-morph`    | Corner radius when pressed           |
| `--m3e-button-[size]-leading-space`          | Space before icon/label              |
| `--m3e-button-[size]-trailing-space`         | Space after icon/label               |
| `--m3e-button-[size]-icon-label-space`       | Space between icon and label         |

#### 📐 Logical Corner Properties

These override an individual logical corner in every state and size.

| Property                         | Description                    |
| -------------------------------- | ------------------------------ |
| `--m3e-button-start-start-shape` | Start-start (top-left in LTR)  |
| `--m3e-button-start-end-shape`   | Start-end (top-right in LTR)   |
| `--m3e-button-end-start-shape`   | End-start (bottom-left in LTR) |
| `--m3e-button-end-end-shape`     | End-end (bottom-right in LTR)  |

#### 🎨 Appearance Variant Properties

All appearance variants (`filled`, `tonal`, `elevated`, `outlined`, `text`) support the following properties (replace `[variant]` with the variant name). Omitting the `[variant]-` prefix overrides the value for all variants.

| Property                                     | Description                       |
| -------------------------------------------- | --------------------------------- |
| `--m3e-[variant]-button-label-text-color`    | Label color                       |
| `--m3e-[variant]-button-icon-color`          | Icon color                        |
| `--m3e-[variant]-button-container-color`     | Container background color        |
| `--m3e-[variant]-button-container-elevation` | Elevation                         |
| `--m3e-[variant]-button-outline-color`       | Outline color (outlined only)     |
| `--m3e-[variant]-button-outline-thickness`   | Outline thickness (outlined only) |

#### 🟫 State Properties

Each variant supports state properties for disabled, hover, focus, pressed, selected, and unselected. For each variant, the following properties are available (replace `[variant]` with the variant name). Omitting the `[variant]-` prefix overrides the value for all variants.

| Property                                              | Description                            |
| ----------------------------------------------------- | -------------------------------------- |
| `--m3e-[variant]-button-disabled-label-text-color`    | Label color when disabled              |
| `--m3e-[variant]-button-disabled-label-text-opacity`  | Label opacity when disabled            |
| `--m3e-[variant]-button-disabled-icon-color`          | Icon color when disabled               |
| `--m3e-[variant]-button-disabled-icon-opacity`        | Icon opacity when disabled             |
| `--m3e-[variant]-button-disabled-container-color`     | Container color when disabled          |
| `--m3e-[variant]-button-disabled-container-opacity`   | Container opacity when disabled        |
| `--m3e-[variant]-button-disabled-container-elevation` | Elevation when disabled                |
| `--m3e-[variant]-button-hover-label-text-color`       | Label color on hover                   |
| `--m3e-[variant]-button-hover-icon-color`             | Icon color on hover                    |
| `--m3e-[variant]-button-hover-state-layer-color`      | State layer color on hover             |
| `--m3e-[variant]-button-hover-state-layer-opacity`    | State layer opacity on hover           |
| `--m3e-[variant]-button-hover-container-elevation`    | Elevation on hover                     |
| `--m3e-[variant]-button-hover-outline-color`          | Outline color on hover (outlined only) |
| `--m3e-[variant]-button-focus-label-text-color`       | Label color on focus                   |
| `--m3e-[variant]-button-focus-icon-color`             | Icon color on focus                    |
| `--m3e-[variant]-button-focus-state-layer-color`      | State layer color on focus             |
| `--m3e-[variant]-button-focus-state-layer-opacity`    | State layer opacity on focus           |
| `--m3e-[variant]-button-focus-container-elevation`    | Elevation on focus                     |
| `--m3e-[variant]-button-focus-outline-color`          | Outline color on focus (outlined only) |
| `--m3e-[variant]-button-pressed-label-text-color`     | Label color on press                   |
| `--m3e-[variant]-button-pressed-icon-color`           | Icon color on press                    |
| `--m3e-[variant]-button-pressed-state-layer-color`    | State layer color on press             |
| `--m3e-[variant]-button-pressed-state-layer-opacity`  | State layer opacity on press           |
| `--m3e-[variant]-button-pressed-container-elevation`  | Elevation on press                     |
| `--m3e-[variant]-button-pressed-outline-color`        | Outline color on press (outlined only) |

#### 🟦 Selected/Unselected State Properties

For toggle buttons, each variant supports selected/unselected state properties. Omitting the `[variant]-` prefix overrides the value for all variants.

| Property                                              | Description                       |
| ----------------------------------------------------- | --------------------------------- |
| `--m3e-[variant]-button-selected-label-text-color`    | Label color when selected         |
| `--m3e-[variant]-button-selected-icon-color`          | Icon color when selected          |
| `--m3e-[variant]-button-selected-container-color`     | Container color when selected     |
| `--m3e-[variant]-button-selected-state-layer-color`   | State layer color when selected   |
| `--m3e-[variant]-button-unselected-label-text-color`  | Label color when unselected       |
| `--m3e-[variant]-button-unselected-icon-color`        | Icon color when unselected        |
| `--m3e-[variant]-button-unselected-container-color`   | Container color when unselected   |
| `--m3e-[variant]-button-unselected-state-layer-color` | State layer color when unselected |
