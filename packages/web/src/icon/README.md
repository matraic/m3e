# @m3e/web/icon

The `m3e-icon` component makes it easy to use Material Symbols in your application. It supports outlined, rounded, and sharp variants, as well as variable font features like fill, weight, grade, and optical size. For more information, see the [Material Symbol Guide](https://developers.google.com/fonts/docs/material_symbols) and [Material Symbol Library](https://fonts.google.com/icons).

The Material Symbols font is the easiest way to incorporate Material Symbols into your application. Using the [Fonts CSS API](https://developers.google.com/fonts/docs/css2#forming_api_urls), you can use variable fonts to optimize icon
usage within your application. See [Can I Use's Variable Fonts](https://caniuse.com/variable-fonts) to determine whether your user's browser support variable fonts.

Alternatively, import SVG icons from `@m3e/icons`. A registered icon renders as SVG; otherwise, the component falls back to the Material Symbols font. Icons are hidden from assistive technology by default unless given `aria-label`, `aria-labelledby`, or `aria-hidden`.

```ts
import "@m3e/web/icon";
```

## 🗂️ Elements

- `m3e-icon` — A small symbol used to easily identify an action or category.

## 🧪 Examples

Use `name` to select an icon. Load the appropriate Material Symbols font or register a matching SVG icon.

```html
<m3e-icon name="home"></m3e-icon>
```

Load the outlined variable font with fill support.

```html
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0"
  rel="stylesheet"
/>
```

Import individual SVG icon modules from `@m3e/icons` to register them. The icon name and variant must match the registration.

```js
import "@m3e/icons/outlined/search";
import "@m3e/icons/outlined/home";
import "@m3e/icons/outlined/settings";
import "@m3e/icons/outlined/favorite";
import "@m3e/icons/outlined/notifications";
```

```html
<m3e-icon variant="outlined" name="search"></m3e-icon>
<m3e-icon variant="outlined" name="home"></m3e-icon>
<m3e-icon variant="outlined" name="settings"></m3e-icon>
<m3e-icon variant="outlined" name="favorite"></m3e-icon>
<m3e-icon variant="outlined" name="notifications"></m3e-icon>
```

## 📖 API Reference

### ⚙️ Attributes

| Attribute      | Type                                 | Default      | Description                                                    |
| -------------- | ------------------------------------ | ------------ | -------------------------------------------------------------- |
| `name`         | `string`                             |              | The name of the icon.                                          |
| `variant`      | `"outlined" \| "rounded" \| "sharp"` | `"outlined"` | The appearance variant of the icon.                            |
| `filled`       | `boolean`                            | `false`      | Whether the icon is filled.                                    |
| `grade`        | `"low" \| "medium" \| "high"`        | `"medium"`   | The grade of the icon.                                         |
| `weight`       | `number`                             | `400`        | A value from 100 to 700 indicating the weight of the icon.     |
| `optical-size` | `number`                             | `24`         | A value from 20 to 48 indicating the optical size of the icon. |

### 🎛️ CSS Custom Properties

| Property          | Description            |
| ----------------- | ---------------------- |
| `--m3e-icon-size` | Font size of the icon. |
