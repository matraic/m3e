# @m3e/icon-button

The `m3e-icon-button` component is a semantic, expressive UI primitive for triggering actions with a single icon. Designed according to Material Design 3 guidelines, it supports four visual variants, specified using the `variant` attribute—`filled`, `tonal`, `outlined`, and `standard`—each with dynamic elevation, shape morphing, and adaptive color theming. The component responds to interaction states (hover, focus, press, disabled) with smooth motion transitions, ensuring emotional clarity and visual hierarchy.

The component is accessible by default, with ARIA roles, contrast-safe color tokens, and strong focus indicators. It supports optional icons and states for binary actions. When using `m3e-icon` for icons, `filled` is automatically set based on the selected state of a toggle button. It can also function as a link or be used to submit form data.

Native disabled `<button>` elements cannot receive focus. This can be problematic in some cases because it can prevent you from telling the user why the button is disabled. You can use the `disabled-interactive` attribute to style a `m3e-icon-button` as disabled but allow for it to receive focus. The button will have `aria-disabled="true"` for assistive technology.

## 📦 Installation

```bash
npm install @m3e/icon-button
```

## 🗂️ Elements

- `m3e-icon-button`

## 🧪 Examples

The following example illustrates changing the appearance from `standard` (default) to `filled` using the `variant` attribute,
changing the size using the `size` attribute, and enabling toggle behavior using the `toggle` attribute.

```html
<m3e-icon-button variant="filled" size="large" toggle selected>
  <m3e-icon name="favorite"></m3e-icon>
</m3e-icon-button>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-icon-button` component.

### ⚙️ Attributes

| Attribute              | Type                                                    | Default      | Description                                                    |
| ---------------------- | ------------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| `variant`              | `"standard"` \| `"outlined"` \| `"filled"` \| `"tonal"` | `"standard"` | Appearance variant.                                            |
| `shape`                | `"rounded"` \| `"square"`                               | `"rounded"`  | Shape of the button.                                           |
| `size`                 | `"extra-small"` \| `"small"` \| `"medium"` \| `"large"` | `"small"`    | Size of the button.                                            |
| `width`                | `"narrow"` \| `"default"` \| `"wide"`                   | `"default"`  | Width of the button.                                           |
| `toggle`               | `boolean`                                               | `false`      | Whether the button toggles between selected/unselected states. |
| `selected`             | `boolean`                                               | `false`      | Whether the toggle button is selected.                         |
| `disabled`             | `boolean`                                               | `false`      | Disables the button.                                           |
| `disabled-interactive` | `boolean`                                               | `false`      | Disables the button but allows some interaction.               |
| `type`                 | `"button"` \| `"submit"` \| `"reset"`                   | `"button"`   | Button type.                                                   |
| `name`                 | `string`                                                |              | Name for form submission.                                      |
| `value`                | `string`                                                |              | Value for form submission.                                     |
| `href`                 | `string`                                                |              | URL for link button.                                           |
| `target`               | `string`                                                |              | Target for link button.                                        |
| `rel`                  | `string`                                                |              | Relationship for link button.                                  |
| `download`             | `string`                                                |              | Download attribute for link button.                            |

### 🧩 Slots

| Slot Name   | Description                             |
| ----------- | --------------------------------------- |
| _(default)_ | Renders the icon of the button.         |
| `selected`  | Renders an icon when selected (toggle). |

### 🎛️ CSS Custom Properties

#### 🧱 Size Properties

All size variants (`extra-small`, `small`, `medium`, `large`, `extra-large`) support:

| Property                                          | Description                          |
| ------------------------------------------------- | ------------------------------------ |
| `--m3e-icon-button-[size]-container-height`       | Height of the button container       |
| `--m3e-icon-button-[size]-outline-thickness`      | Outline thickness                    |
| `--m3e-icon-button-[size]-icon-size`              | Icon size                            |
| `--m3e-icon-button-[size]-shape-round`            | Corner radius for round shape        |
| `--m3e-icon-button-[size]-shape-square`           | Corner radius for square shape       |
| `--m3e-icon-button-[size]-selected-shape-round`   | Corner radius when selected (round)  |
| `--m3e-icon-button-[size]-selected-shape-square`  | Corner radius when selected (square) |
| `--m3e-icon-button-[size]-shape-pressed-morph`    | Corner radius when pressed           |
| `--m3e-icon-button-[size]-narrow-leading-space`   | Space before icon (narrow width)     |
| `--m3e-icon-button-[size]-narrow-trailing-space`  | Space after icon (narrow width)      |
| `--m3e-icon-button-[size]-default-leading-space`  | Space before icon (default width)    |
| `--m3e-icon-button-[size]-default-trailing-space` | Space after icon (default width)     |
| `--m3e-icon-button-[size]-wide-leading-space`     | Space before icon (wide width)       |
| `--m3e-icon-button-[size]-wide-trailing-space`    | Space after icon (wide width)        |

#### 🎨 Appearance Variant Properties

All appearance variants (`standard`, `outlined`, `filled`, `tonal`) support the following properties (replace `[variant]` with the variant name):

| Property                                      | Description                   |
| --------------------------------------------- | ----------------------------- |
| `--m3e-[variant]-icon-button-icon-color`      | Icon color                    |
| `--m3e-[variant]-icon-button-container-color` | Container background color    |
| `--m3e-[variant]-icon-button-outline-color`   | Outline color (outlined only) |

#### 🟫 State Properties

Each variant supports state properties for disabled, hover, focus, pressed, selected, and unselected. For each variant, the following properties are available (replace `[variant]` with the variant name):

| Property                                                           | Description                            |
| ------------------------------------------------------------------ | -------------------------------------- |
| `--m3e-[variant]-icon-button-disabled-container-color`             | Container color when disabled          |
| `--m3e-[variant]-icon-button-disabled-container-opacity`           | Container opacity when disabled        |
| `--m3e-[variant]-icon-button-disabled-icon-color`                  | Icon color when disabled               |
| `--m3e-[variant]-icon-button-disabled-icon-opacity`                | Icon opacity when disabled             |
| `--m3e-[variant]-icon-button-disabled-outline-color`               | Outline color when disabled (outlined) |
| `--m3e-[variant]-icon-button-hover-icon-color`                     | Icon color on hover                    |
| `--m3e-[variant]-icon-button-hover-outline-color`                  | Outline color on hover (outlined)      |
| `--m3e-[variant]-icon-button-hover-state-layer-color`              | State layer color on hover             |
| `--m3e-[variant]-icon-button-hover-state-layer-opacity`            | State layer opacity on hover           |
| `--m3e-[variant]-icon-button-hover-unselected-icon-color`          | Unselected icon color on hover         |
| `--m3e-[variant]-icon-button-hover-unselected-state-layer-color`   | Unselected state layer color on hover  |
| `--m3e-[variant]-icon-button-hover-selected-icon-color`            | Selected icon color on hover           |
| `--m3e-[variant]-icon-button-hover-selected-state-layer-color`     | Selected state layer color on hover    |
| `--m3e-[variant]-icon-button-focus-icon-color`                     | Icon color on focus                    |
| `--m3e-[variant]-icon-button-focus-outline-color`                  | Outline color on focus (outlined)      |
| `--m3e-[variant]-icon-button-focus-state-layer-color`              | State layer color on focus             |
| `--m3e-[variant]-icon-button-focus-state-layer-opacity`            | State layer opacity on focus           |
| `--m3e-[variant]-icon-button-focus-unselected-icon-color`          | Unselected icon color on focus         |
| `--m3e-[variant]-icon-button-focus-unselected-state-layer-color`   | Unselected state layer color on focus  |
| `--m3e-[variant]-icon-button-focus-selected-icon-color`            | Selected icon color on focus           |
| `--m3e-[variant]-icon-button-focus-selected-state-layer-color`     | Selected state layer color on focus    |
| `--m3e-[variant]-icon-button-pressed-icon-color`                   | Icon color on press                    |
| `--m3e-[variant]-icon-button-pressed-outline-color`                | Outline color on press (outlined)      |
| `--m3e-[variant]-icon-button-pressed-state-layer-color`            | State layer color on press             |
| `--m3e-[variant]-icon-button-pressed-state-layer-opacity`          | State layer opacity on press           |
| `--m3e-[variant]-icon-button-pressed-unselected-icon-color`        | Unselected icon color on press         |
| `--m3e-[variant]-icon-button-pressed-unselected-state-layer-color` | Unselected state layer color on press  |
| `--m3e-[variant]-icon-button-pressed-selected-icon-color`          | Selected icon color on press           |
| `--m3e-[variant]-icon-button-pressed-selected-state-layer-color`   | Selected state layer color on press    |

#### 🟦 Selected/Unselected State Properties

For toggle buttons, each variant supports selected/unselected state properties:

| Property                                                   | Description                       |
| ---------------------------------------------------------- | --------------------------------- |
| `--m3e-[variant]-icon-button-selected-icon-color`          | Icon color when selected          |
| `--m3e-[variant]-icon-button-selected-container-color`     | Container color when selected     |
| `--m3e-[variant]-icon-button-selected-state-layer-color`   | State layer color when selected   |
| `--m3e-[variant]-icon-button-unselected-icon-color`        | Icon color when unselected        |
| `--m3e-[variant]-icon-button-unselected-container-color`   | Container color when unselected   |
| `--m3e-[variant]-icon-button-unselected-state-layer-color` | State layer color when unselected |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
