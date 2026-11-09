# @m3e/web/button-group

The `m3e-button-group` component arranges multiple into a unified, expressive layout, supporting both `standard` and `connected` variants. It enables seamless, accessible grouping of actions, adapts to various sizes, and ensures consistent spacing, shape, and alignment. Designed according to Material 3 principles, it empowers users to interact with related actions in a visually harmonious and intuitive way.

```ts
import "@m3e/web/button-group";
```

## 🗂️ Elements

- `m3e-button-group` — Organizes buttons and adds interactions between them.

## 🧪 Examples

A standard group arranges icon buttons and adds interaction between adjacent buttons. Import `@m3e/web/icon-button`. Import `@m3e/web/icon` and load the Material Symbols font. Give each icon-only button an accessible name using `aria-label`.

```html
<m3e-button-group>
  <m3e-icon-button>
    <m3e-icon name="arrow_back"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button>
    <m3e-icon name="arrow_forward"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button width="wide" variant="filled">
    <m3e-icon name="add"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button>
    <m3e-icon name="picture_in_picture"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button>
    <m3e-icon name="more_vert"></m3e-icon>
  </m3e-icon-button>
</m3e-button-group>
```

A standard group can contain text buttons. Import `@m3e/web/button`. Import `@m3e/web/icon` and load the Material Symbols font.

```html
<m3e-button-group>
  <m3e-button variant="tonal">
    <m3e-icon slot="icon" name="play_arrow"></m3e-icon>Start
  </m3e-button>
  <m3e-button variant="tonal">
    <m3e-icon slot="icon" name="directions_car"></m3e-icon>Directions
  </m3e-button>
  <m3e-button variant="tonal">
    <m3e-icon slot="icon" name="share"></m3e-icon>Share
  </m3e-button>
</m3e-button-group>
```

A standard group can mix text and icon buttons, including wide icon buttons. Import `@m3e/web/button`. Import `@m3e/web/icon-button`. Import `@m3e/web/icon` and load the Material Symbols font. Give each icon-only button an accessible name using `aria-label`.

```html
<m3e-button-group>
  <m3e-icon-button variant="filled" width="wide">
    <m3e-icon name="fast_rewind"></m3e-icon>
  </m3e-icon-button>
  <m3e-button variant="filled">
    <m3e-icon slot="icon" name="play_arrow"></m3e-icon>Play
  </m3e-button>
  <m3e-icon-button variant="filled" width="wide">
    <m3e-icon name="fast_forward"></m3e-icon>
  </m3e-icon-button>
</m3e-button-group>
```

Use `variant="connected"` to create a connected group. Import `@m3e/web/button`.

```html
<m3e-button-group variant="connected">
  <m3e-button variant="tonal" toggle>Start</m3e-button>
  <m3e-button variant="tonal" toggle>Directions</m3e-button>
  <m3e-button variant="tonal" toggle>Share</m3e-button>
</m3e-button-group>
```

Use `size` to control standard group spacing. Set the same size on each button for uniform sizing. Import `@m3e/web/icon-button`. Import `@m3e/web/icon` and load the Material Symbols font. Give each icon-only button an accessible name using `aria-label`.

```html
<m3e-button-group size="large">
  <m3e-icon-button size="large">
    <m3e-icon name="arrow_back"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button size="large">
    <m3e-icon name="arrow_forward"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button size="large" width="wide" variant="filled">
    <m3e-icon name="add"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button size="large">
    <m3e-icon name="picture_in_picture"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button size="large">
    <m3e-icon name="more_vert"></m3e-icon>
  </m3e-icon-button>
</m3e-button-group>
```

Connected groups have the same spacing regardless of size. Set the group and button sizes to match for uniform sizing. Import `@m3e/web/button`.

```html
<m3e-button-group size="large" variant="connected">
  <m3e-button variant="tonal" size="large" toggle>Start</m3e-button>
  <m3e-button variant="tonal" size="large" toggle>Directions</m3e-button>
  <m3e-button variant="tonal" size="large" toggle>Share</m3e-button>
</m3e-button-group>
```

Use `multi` to allow multiple toggle buttons to be selected; without it the group is single-select. Import `@m3e/web/icon-button`. Import `@m3e/web/icon` and load the Material Symbols font. Give each icon-only button an accessible name using `aria-label`.

```html
<m3e-button-group multi>
  <m3e-icon-button variant="tonal" toggle>
    <m3e-icon name="format_bold"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button variant="tonal" toggle>
    <m3e-icon name="format_italic"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button variant="tonal" toggle>
    <m3e-icon name="format_underlined"></m3e-icon>
  </m3e-icon-button>
</m3e-button-group>
```

Apply `--md-sys-density-scale` to the group to adjust its buttons. Supply buttons as in the standard or connected examples. The showcase omits additional groups and density classes.

```html
<m3e-button-group class="density-3">
  <!-- Buttons omitted for brevity -->
</m3e-button-group>
<!-- Additional groups and variants omitted for brevity -->
```

```css
.density-3 {
  --md-sys-density-scale: -3;
}
```

## 📖 API Reference

This section details the attributes, slots, and CSS custom properties available for the `m3e-button-group` component.

### ⚙️ Attributes

| Attribute | Type                                                               | Default      | Description                                      |
| --------- | ------------------------------------------------------------------ | ------------ | ------------------------------------------------ |
| `multi`   | `boolean`                                                          | `false`      | Whether multiple toggle buttons can be selected. |
| `size`    | `"extra-small" \| "small" \| "medium" \| "large" \| "extra-large"` | `"small"`    | The size of the group.                           |
| `variant` | `"standard" \| "connected"`                                        | `"standard"` | The appearance variant of the group.             |

### 🧩 Slots

| Slot        | Description                       |
| ----------- | --------------------------------- |
| _(default)_ | Renders the buttons of the group. |

### 🎛️ CSS Custom Properties

| Property                                                       | Description                                       |
| -------------------------------------------------------------- | ------------------------------------------------- |
| `--m3e-standard-button-group-extra-small-spacing`              | Spacing between buttons in standard, extra-small. |
| `--m3e-standard-button-group-small-spacing`                    | Spacing between buttons in standard, small.       |
| `--m3e-standard-button-group-medium-spacing`                   | Spacing between buttons in standard, medium.      |
| `--m3e-standard-button-group-large-spacing`                    | Spacing between buttons in standard, large.       |
| `--m3e-standard-button-group-extra-large-spacing`              | Spacing between buttons in standard, extra-large. |
| `--m3e-connected-button-group-spacing`                         | Spacing between buttons in connected variant.     |
| `--m3e-connected-button-group-extra-small-inner-shape`         | Corner shape for connected, extra-small.          |
| `--m3e-connected-button-group-extra-small-inner-pressed-shape` | Pressed corner shape for connected, extra-small.  |
| `--m3e-connected-button-group-small-inner-shape`               | Corner shape for connected, small.                |
| `--m3e-connected-button-group-small-inner-pressed-shape`       | Pressed corner shape for connected, small.        |
| `--m3e-connected-button-group-medium-inner-shape`              | Corner shape for connected, medium.               |
| `--m3e-connected-button-group-medium-inner-pressed-shape`      | Pressed corner shape for connected, medium.       |
| `--m3e-connected-button-group-large-inner-shape`               | Corner shape for connected, large.                |
| `--m3e-connected-button-group-large-inner-pressed-shape`       | Pressed corner shape for connected, large.        |
| `--m3e-connected-button-group-extra-large-inner-shape`         | Corner shape for connected, extra-large.          |
| `--m3e-connected-button-group-extra-large-inner-pressed-shape` | Pressed corner shape for connected, extra-large.  |
