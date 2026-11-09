# @m3e/web/theme

The `m3e-theme` component is a non-visual element used to apply dynamic color, expressive motion, density, and strong focus indicators to nested, theme-aware elements.

When `m3e-theme` is nested directly beneath the `<body>` of a document, the `<body>`'s `background-color` is set to the computed value of `--md-sys-color-background` and `color` is set to the computed value of `--md-sys-color-on-background`. In addition the document's `scrollbar-color` is set to the computed values of `--m3e-scrollbar-thumb-color` and `--m3e-scrollbar-track-color` which, when supported, cascades to all viewport scrollbars.

The `motion` attribute selects the springs behind the `--md-sys-motion-spring-*` tokens. Where the CSS `linear()` easing function is supported, each token is sampled from its spring's damping ratio and stiffness; otherwise, a `cubic-bezier()` approximation is used.

```ts
import "@m3e/web/theme";
```

## 🗂️ Elements

- `m3e-theme` — A non-visual element responsible for application-level theming.
- `m3e-theme-icon` — An icon that visually presents a preview of a theme.

## 🧪 Examples

Showcase: Color. Import `@m3e/web/theme`.

```html
<m3e-theme color="#4285F4">
  <!-- Swatches omitted for brevity -->
</m3e-theme>
```

Showcase: Schemes. Import `@m3e/web/theme`.

```html
<m3e-theme color="#4285F4" scheme="dark">
  <!-- Swatches omitted for brevity -->
</m3e-theme>
```

Showcase: Contrast. Import `@m3e/web/theme`.

```html
<m3e-theme color="#4285F4" contrast="high">
  <!-- Swatches omitted for brevity -->
</m3e-theme>
```

Showcase: Density. Import `@m3e/web/theme`.

```html
<m3e-theme density="-3">
  <!-- Buttons omitted for brevity -->
</m3e-theme>
<!-- Additional densities omitted for brevity -->
```

Showcase: Motion. Import `@m3e/web/theme`.

```html
<m3e-theme motion="standard">
  <!-- Switch omitted for brevity -->
</m3e-theme>
<m3e-theme motion="expressive">
  <!-- Switch omitted for brevity -->
</m3e-theme>
```

## 📖 API Reference

### 🗂️ m3e-theme

This section details the attributes, events, and slots available for the `m3e-theme` component.

#### ⚙️ Attributes

| Attribute      | Type                                                                                                                              | Default        | Description                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------- |
| `color`        | `string`                                                                                                                          | `"#6750A4"`    | The hex color from which to derive dynamic color palettes. |
| `variant`      | `"monochrome" \| "neutral" \| "tonal-spot" \| "vibrant" \| "expressive" \| "fidelity" \| "rainbow" \| "fruit-salad" \| "content"` | `"tonal-spot"` | The color variant of the theme.                            |
| `scheme`       | `"auto" \| "light" \| "dark"`                                                                                                     | `"auto"`       | The color scheme of the theme.                             |
| `contrast`     | `"standard" \| "medium" \| "high"`                                                                                                | `"standard"`   | The contrast level of the theme.                           |
| `strong-focus` | `boolean`                                                                                                                         | `false`        | Whether to enable strong focus indicators.                 |
| `density`      | `number`                                                                                                                          | `0`            | The density scale (0, -1, -2).                             |
| `motion`       | `"standard" \| "expressive"`                                                                                                      | `"expressive"` | The motion scheme.                                         |

#### 🔔 Events

| Event    | Description                        |
| -------- | ---------------------------------- |
| `change` | Dispatched when the theme changes. |

#### 🧩 Slots

| Slot        | Description                          |
| ----------- | ------------------------------------ |
| _(default)_ | Renders content styled by the theme. |

### 🗂️ m3e-theme-icon

This section details the attributes and CSS custom properties available for the `m3e-theme-icon` component.

#### ⚙️ Attributes

| Attribute | Type                                                                                                                              | Default     | Description                                |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------ |
| `color`   | `string`                                                                                                                          | `"#6750A4"` | The hex color of the theme to preview      |
| `variant` | `"monochrome" \| "neutral" \| "tonal-spot" \| "vibrant" \| "expressive" \| "fidelity" \| "rainbow" \| "fruit-salad" \| "content"` | `"content"` | The color variant of the theme to preview. |
| `scheme`  | `"auto" \| "light" \| "dark"`                                                                                                     | `"auto"`    | The color scheme of the theme to preview.  |

#### 🎛️ CSS Custom Properties

| Property                           | Description                                                |
| ---------------------------------- | ---------------------------------------------------------- |
| `--m3e-theme-icon-size`            | Size of the theme icon.                                    |
| `--m3e-theme-icon-shape`           | Border radius of the icon container.                       |
| `--m3e-theme-icon-outline-color`   | Outline stroke color of the icon border.                   |
| `--m3e-theme-icon-outline-opacity` | Opacity percentage applied to the outline color.           |
| `--m3e-theme-icon-container-color` | Fill color for the container layer of the previewed theme. |
| `--m3e-theme-icon-color`           | Fill color for the primary layer of the previewed theme.   |
