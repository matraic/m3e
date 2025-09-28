# @m3e/list

The `@m3e/list` package provides expressive, accessible components for organizing and displaying lists of items. It includes both the `m3e-list` container and the `m3e-list-item` element, supporting rich content, flexible layout, and extensive theming via CSS custom properties.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/list
```

## 🗂️ Elements

- `m3e-list` — A list of items.
- `m3e-list-item` — An item in a list.

## 🧪 Examples

The following example illustrates a list with a single item using all supported slots.

> Note: This example uses the `@mwc/icon` package to present Material Design symbols, but any icon package can be substituted depending on your design system or preferences

```html
<m3e-list>
  <m3e-list-item>
    <m3e-icon slot="leading-icon" name="person"></m3e-icon>
    <span slot="overline">Overline</span>
    Headline
    <span slot="supporting-text">Supporting text</span>
    <span slot="trailing-supporting-text">100+</span>
    <m3e-icon slot="trailing-icon" name="arrow_right"></m3e-icon>
  </m3e-list-item>
</m3e-list>
```

## 📖 API Reference

### 🗂️ m3e-list

This section details the slots and CSS custom properties available for the `m3e-list` component.

#### 🧩 Slots

| Slot Name   | Description                    |
| ----------- | ------------------------------ |
| _(default)_ | Renders the items of the list. |

#### 🎛️ CSS Custom Properties

| Property                              | Description                    |
| ------------------------------------- | ------------------------------ |
| `--m3e-list-block-padding`            | Vertical padding for the list. |
| `--m3e-list-divider-inset-start-size` | Start inset for dividers.      |
| `--m3e-list-divider-inset-end-size`   | End inset for dividers.        |

### 🗂️ m3e-list-item

This section details the slots and CSS custom properties available for the `m3e-list-item` component.

#### 🧩 Slots

| Slot Name                  | Description                           |
| -------------------------- | ------------------------------------- |
| _(default)_                | Renders the content of the list item. |
| `leading-icon`             | Renders the leading icon.             |
| `overline`                 | Renders the overline.                 |
| `supporting-text`          | Renders the supporting text.          |
| `trailing-supporting-text` | Renders the trailing supporting text. |
| `trailing-icon`            | Renders the trailing icon.            |

#### 🎛️ CSS Custom Properties

| Property                                               | Description                                       |
| ------------------------------------------------------ | ------------------------------------------------- |
| `--m3e-list-item-spacing`                              | Horizontal gap between elements.                  |
| `--m3e-list-item-padding-inline`                       | Horizontal padding for the list item.             |
| `--m3e-list-item-padding-block`                        | Vertical padding for the list item.               |
| `--m3e-list-item-height`                               | Minimum height of the list item.                  |
| `--m3e-list-item-font-size`                            | Font size for main content.                       |
| `--m3e-list-item-font-weight`                          | Font weight for main content.                     |
| `--m3e-list-item-line-height`                          | Line height for main content.                     |
| `--m3e-list-item-tracking`                             | Letter spacing for main content.                  |
| `--m3e-list-item-overline-font-size`                   | Font size for overline slot.                      |
| `--m3e-list-item-overline-font-weight`                 | Font weight for overline slot.                    |
| `--m3e-list-item-overline-line-height`                 | Line height for overline slot.                    |
| `--m3e-list-item-overline-tracking`                    | Letter spacing for overline slot.                 |
| `--m3e-list-item-supporting-text-font-size`            | Font size for supporting text slot.               |
| `--m3e-list-item-supporting-text-font-weight`          | Font weight for supporting text slot.             |
| `--m3e-list-item-supporting-text-line-height`          | Line height for supporting text slot.             |
| `--m3e-list-item-supporting-text-tracking`             | Letter spacing for supporting text slot.          |
| `--m3e-list-item-trailing-supporting-text-font-size`   | Font size for trailing supporting text slot.      |
| `--m3e-list-item-trailing-supporting-text-font-weight` | Font weight for trailing supporting text slot.    |
| `--m3e-list-item-trailing-supporting-text-line-height` | Line height for trailing supporting text slot.    |
| `--m3e-list-item-trailing-supporting-text-tracking`    | Letter spacing for trailing supporting text slot. |
| `--m3e-list-item-icon-size`                            | Size for leading/trailing icons.                  |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
