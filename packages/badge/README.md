# @m3e/badge

The `m3e-badge` component is a compact visual indicator used to label content. Designed according to Material Design 3 guidelines, it can display counts, presence, or semantic emphasis, and is attachable to icons, buttons, or other components. Badges support dynamic sizing, color, and shape, ensuring clarity and accessibility while maintaining a consistent, expressive appearance across surfaces.

> **Part of the [M3E](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/badge
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/badge`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/badge/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/badge/dist/css-custom-data.json"]
}
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/badge/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js",
      "@m3e/core/bidi": "/node_modules/@m3e/core/dist/bidi.js",
      "@m3e/core/anchoring": "/node_modules/@m3e/core/dist/anchoring.js"
    }
  }
</script>
```

> For production, use index.min.js, bidi.min.js, and anchoring.min.js for faster load times.

## 🗂️ Elements

- `m3e-badge` — A visual indicator used to label content.

## 🧪 Examples

The following example illustrates attaching a `m3e-badge` to another element using the `for` attribute.

```html
<m3e-button id="button">Button</m3e-button><m3e-badge for="button">10</m3e-badge>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-badge` component.

### ⚙️ Attributes

| Attribute  | Type                                                                                                              | Default         | Description                                                  |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------ |
| `size`     | `"small" \| "medium" \| "large"`                                                                                  | `"medium"`      | The size of the badge.                                       |
| `position` | `"above-after" \| "above-before" \| "below-before" \| "below-after" \| "before" \| "after" \| "above" \| "below"` | `"above-after"` | The position of the badge, when attached to another element. |

### 🧩 Slots

| Slot        | Description                       |
| ----------- | --------------------------------- |
| _(default)_ | Renders the content of the badge. |

### 🎛️ CSS Custom Properties

The `m3e-badge` element supports scoped CSS custom properties for shape, color, sizing, and typography across badge sizes. These tokens enable consistent theming, semantic clarity, and expressive control.

#### 🧱 Global Properties

| Property                      | Description                              |
| ----------------------------- | ---------------------------------------- |
| `--m3e-badge-shape`           | Corner radius of the badge container.    |
| `--m3e-badge-color`           | Foreground color of badge content.       |
| `--m3e-badge-container-color` | Background color of the badge container. |

#### 🟢 Small Badge

Used for minimal indicators such as presence dots or unread markers.

| Property                 | Description                       |
| ------------------------ | --------------------------------- |
| `--m3e-badge-small-size` | Fixed dimensions for small badge. |

#### 🟡 Medium Badge

Used for numeric counts or short labels.

| Property                         | Description                            |
| -------------------------------- | -------------------------------------- |
| `--m3e-badge-medium-size`        | Height and minimum width of the badge. |
| `--m3e-badge-medium-font-size`   | Font size for badge label.             |
| `--m3e-badge-medium-font-weight` | Font weight for badge label.           |
| `--m3e-badge-medium-line-height` | Line height for badge label.           |
| `--m3e-badge-medium-tracking`    | Letter spacing for badge label.        |

#### 🔵 Large Badge

Used for longer labels or emphasis in dense layouts.

| Property                        | Description                            |
| ------------------------------- | -------------------------------------- |
| `--m3e-badge-large-size`        | Height and minimum width of the badge. |
| `--m3e-badge-large-font-size`   | Font size for badge label.             |
| `--m3e-badge-large-font-weight` | Font weight for badge label.           |
| `--m3e-badge-large-line-height` | Line height for badge label.           |
| `--m3e-badge-large-tracking`    | Letter spacing for badge label.        |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
