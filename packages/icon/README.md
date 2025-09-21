# @m3e/icon

The `m3e-icon` component makes it easy to use Material Symbols in your application. It supports outlined, rounded, and sharp variants, as well as variable font features like fill, weight, grade, and optical size. For more information, see the [Material Symbol Guide](https://developers.google.com/fonts/docs/material_symbols) and [Material Symbol Library](https://fonts.google.com/icons).

The Material Symbols font is the easiest way to incorporate Material Symbols into your application. Using the [Fonts CSS API](https://developers.google.com/fonts/docs/css2#forming_api_urls), you can use variable fonts to optimize icon
usage within your application. See [Can I Use's Variable Fonts](https://caniuse.com/variable-fonts) to determine whether
your user's browser support variable fonts.

## 📦 Installation

```bash
npm install @m3e/icon
```

## 🗂️ Elements

- `m3e-icon`

## 🧪 Examples

The following example illustrates showing the `home` icon. The `name` attribute specifies the icon to present.

```html
<m3e-icon name="home"></m3e-icon>
```

The next example illustrates a link used to download a variable font for outlined icons with fill support.

```html
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0"
  rel="stylesheet"
/>
```

## 📖 API Reference

### ⚙️ Attributes

| Attribute      | Type                                 | Default      | Description                                    |
| -------------- | ------------------------------------ | ------------ | ---------------------------------------------- |
| `name`         | `string`                             | `""`         | The name of the icon (e.g., `home`, `search`). |
| `variant`      | `"outlined" \| "rounded" \| "sharp"` | `"outlined"` | Appearance variant.                            |
| `filled`       | `boolean`                            | `false`      | Whether the icon is filled.                    |
| `grade`        | `"low" \| "medium" \| "high"`        | `"medium"`   | Grade of the icon.                             |
| `weight`       | `number` (100–700)                   | `400`        | Weight of the icon.                            |
| `optical-size` | `number` (20–48)                     | `24`         | Optical size of the icon.                      |

### 🎛️ CSS Custom Properties

| Property          | Description            |
| ----------------- | ---------------------- |
| `--m3e-icon-size` | Font size of the icon. |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
