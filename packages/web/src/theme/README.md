# @m3e/web/theme

The `m3e-theme` component is a non-visual element used to apply dynamic color, expressive motion, density, and strong focus indicators to nested, theme-aware elements.

When `m3e-theme` is nested directly beneath the `<body>` of a document, the `<body>`'s `background-color` is set to the computed value of `--md-sys-color-background` and `color` is set to the computed value of `--md-sys-color-on-background`. In addition the document's `scrollbar-color` is set to the computed values of `--m3e-scrollbar-thumb-color` and `--m3e-scrollbar-track-color` which, when supported, cascades to all viewport scrollbars.

```ts
import "@m3e/web/theme";
```

## 🗂️ Elements

- `m3e-theme` — A non-visual element responsible for application-level theming.

## 🧪 Examples

The following example adds a top-level `m3e-theme` directly beneath a document's `<body>` element to apply application-level theming. In this example, `color` and `scheme` are used to create a dynamic color palette which automatically adjusts to a user's light or dark color preference. In addition, expressive motion and strong focus indicators are enabled.

```html
<body>
  <m3e-theme color="#6750A4" scheme="auto" motion="expressive" strong-focus>
    <!-- App content here -->
  </m3e-theme>
</body>
```

## 📖 API Reference

### ⚙️ Attributes

| Attribute      | Type                                                                                                                              | Default      | Description                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------- |
| `color`        | `string`                                                                                                                          | `"#6750A4"`  | The hex color from which to derive dynamic color palettes. |
| `variant`      | `"monochrome" \| "neutral" \| "tonal-spot" \| "vibrant" \| "expressive" \| "fidelity" \| "rainbow" \| "fruit-salad" \| "content"` | `"content"`  | The color variant of the theme.                            |
| `scheme`       | `"auto" \| "light" \| "dark"`                                                                                                     | `"auto"`     | The color scheme of the theme.                             |
| `contrast`     | `"standard" \| "medium" \| "high"`                                                                                                | `"standard"` | The contrast level of the theme.                           |
| `strong-focus` | `boolean`                                                                                                                         | `false`      | Whether to enable strong focus indicators.                 |
| `density`      | `number`                                                                                                                          | `0`          | The density scale (0, -1, -2).                             |
| `motion`       | `"standard" \| "expressive"`                                                                                                      | `"standard"` | The motion scheme.                                         |
