# @m3e/bottom-sheet

The `m3e-bottom-sheet` component implements a Material 3 bottom sheet with gesture‑driven resizing, detent snapping, and adaptive motion. It behaves as a heavy surface: transitions use non‑bouncy, decelerating motion.

The sheet supports direct manipulation through vertical drag gestures. Movement below an 8px threshold is ignored to ensure reliable tap‑to‑cycle behavior on the handle. Once activated, dragging updates the sheet height with friction near the minimum height to prevent abrupt collapse.

When detents are defined, the sheet snaps to the nearest detent on release. If hideable, downward gestures may dismiss the sheet using either velocity or a small distance threshold below the collapsed detent. When no detents are present, the sheet behaves as a simple open/hidden surface with a bottom‑measured hide threshold.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/bottom-sheet
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/bottom-sheet`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/bottom-sheet/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/bottom-sheet/dist/css-custom-data.json"]
}
```

## 🚀 Native Module Support

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/bottom-sheet/dist/index.js"></script>
```

You also need a module script for `@m3e/core` due to it being a dependency.

```html
<script type="module" src="/node_modules/@m3e/core/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include additional dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js",
      "@m3e/core/a11y": "/node_modules/@m3e/core/dist/a11y.js"
    }
  }
</script>
```

> For production, use index.min.js for faster load times.

## 🗂️ Elements

- `m3e-bottom-sheet` — A sheet used to show secondary content anchored to the bottom of the screen.
- `m3e-bottom-sheet-trigger` — An element for opening bottom sheets by reference (via the `for` attribute).
- `m3e-bottom-sheet-action` — An action element for use within bottom sheets.

## 🧪 Examples

The following example illustrates a modal bottom sheet with a drag handle, detents, and an action list:

```html
<m3e-button>
  <m3e-bottom-sheet-trigger for="bottomSheet"> Open Bottom Sheet </m3e-bottom-sheet-trigger>
</m3e-button>

<m3e-bottom-sheet id="bottomSheet" modal handle hideable detents="fit half full">
  <m3e-action-list>
    <m3e-list-action autofocus>
      <m3e-bottom-sheet-action>Google Keep</m3e-bottom-sheet-action>
      <span slot="supporting-text">Add to a note</span>
    </m3e-list-action>
    <m3e-list-action>
      <m3e-bottom-sheet-action>Google Docs</m3e-bottom-sheet-action>
      <span slot="supporting-text">Embed in a document</span>
    </m3e-list-action>
  </m3e-action-list>
</m3e-bottom-sheet>
```

## 📖 API Reference

### 🗂️ `m3e-bottom-sheet`

This section details the attributes, slots, events, and CSS custom properties available for the `m3e-bottom-sheet` component.

#### ⚙️ Attributes

| Attribute       | Type      | Default | Description                                                                                   |
| --------------- | --------- | ------- | --------------------------------------------------------------------------------------------- |
| `detent`        | `number`  | `0`     | The zero-based index of the detent the sheet should open to.                                  |
| `detents`       | `string`  | —       | Detents (discrete height states) the sheet can snap to.                                       |
| `handle`        | `boolean` | `false` | Whether to display a drag handle and enable the top region of the sheet as a gesture surface. |
| `handle-label`  | `string`  | —       | The accessible label given to the drag handle.                                                |
| `hideable`      | `boolean` | `false` | Whether the bottom sheet can hide when swiped down.                                           |
| `hide-friction` | `number`  | —       | The friction coefficient to hide the sheet, or set it to the next closest expanded detent.    |
| `modal`         | `boolean` | `false` | Whether the bottom sheet behaves as a modal.                                                  |
| `open`          | `boolean` | `false` | Whether the bottom sheet is open.                                                             |

#### 🧩 Slots

| Slot        | Description                       |
| ----------- | --------------------------------- |
| _(default)_ | Renders the content of the sheet. |
| `header`    | Renders the header of the sheet.  |

#### 🔔 Events

| Event     | Description                             |
| --------- | --------------------------------------- |
| `opening` | Emitted when the sheet begins to open.  |
| `opened`  | Emitted when the sheet has opened.      |
| `cancel`  | Emitted when the sheet is cancelled.    |
| `closing` | Emitted when the sheet begins to close. |
| `closed`  | Emitted when the sheet has closed.      |

#### 🎛️ CSS Custom Properties

| Property                                          | Description                                     |
| ------------------------------------------------- | ----------------------------------------------- |
| `--m3e-bottom-sheet-width`                        | The width of the sheet.                         |
| `--m3e-bottom-sheet-max-width`                    | The maximum width of the sheet.                 |
| `--m3e-bottom-sheet-container-color`              | The background color of the sheet container.    |
| `--m3e-bottom-sheet-elevation`                    | The elevation level when not modal.             |
| `--m3e-bottom-sheet-modal-elevation`              | The elevation level when modal.                 |
| `--m3e-bottom-sheet-full-elevation`               | The elevation level when full height.           |
| `--m3e-bottom-sheet-z-index`                      | The z-index of the non-modal sheet.             |
| `--m3e-bottom-sheet-minimized-container-shape`    | The border radius when minimized.               |
| `--m3e-bottom-sheet-container-shape`              | The border radius of the sheet container.       |
| `--m3e-bottom-sheet-full-container-shape`         | The border radius when full height.             |
| `--m3e-bottom-sheet-scrim-color`                  | The color of the scrim overlay.                 |
| `--m3e-bottom-sheet-scrim-opacity`                | The opacity of the scrim overlay.               |
| `--m3e-bottom-sheet-peek-height`                  | The visible height when minimized.              |
| `--m3e-bottom-sheet-compact-top-space`            | The top space in compact mode.                  |
| `--m3e-bottom-sheet-top-space`                    | The top space in standard mode.                 |
| `--m3e-bottom-sheet-padding-block`                | The vertical padding.                           |
| `--m3e-bottom-sheet-padding-inline`               | The horizontal padding.                         |
| `--m3e-bottom-sheet-drag-handle-container-height` | The height of the drag handle container.        |
| `--m3e-bottom-sheet-handle-width`                 | The width of the drag handle.                   |
| `--m3e-bottom-sheet-handle-height`                | The height of the drag handle.                  |
| `--m3e-bottom-sheet-handle-shape`                 | The border radius of the handle.                |
| `--m3e-bottom-sheet-handle-color`                 | The color of the drag handle.                   |
| `--m3e-bottom-sheet-handle-focus-ring-offset`     | The offset of the focus ring around the handle. |

### 🗂️ `m3e-bottom-sheet-trigger`

An element for opening bottom sheets by reference (via the `for` attribute).

#### ⚙️ Attributes

| Attribute   | Type                  | Default     | Description                                                                                                    |
| ----------- | --------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| `detent`    | `number \| undefined` | `undefined` | The zero-based index of the detent the sheet should open to.                                                   |
| `secondary` | `boolean`             | `false`     | Marks this trigger as a secondary trigger for accessibility. Secondary triggers do not receive ARIA ownership. |

#### 🧩 Slots

| Slot        | Description                         |
| ----------- | ----------------------------------- |
| _(default)_ | Renders the content of the trigger. |

### 🗂️ `m3e-bottom-sheet-action`

An action element for closing a parent bottom sheet when activated.

#### 🧩 Slots

| Slot        | Description                        |
| ----------- | ---------------------------------- |
| _(default)_ | Renders the content of the action. |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
