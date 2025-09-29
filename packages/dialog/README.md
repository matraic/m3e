# @m3e/dialog

The `m3e-dialog` component presents important prompts, alerts, and actions in user flows. Designed according to Material 3 principles, it supports custom header, content, and close icon slots, ARIA accessibility, focus management, and theming via CSS custom properties.

## 📦 Installation

```bash
npm install @m3e/dialog
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/dialog/dist/index.js"></script>
```

You also need a module script for `@m3e/icon-button` due to it being a dependency.

```html
<script type="module" src="/node_modules/@m3e/icon-button/dist/index.js"></script>
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

> For production, use index.min.js and a11y.min.js for faster load times.

## 🗂️ Elements

- `m3e-dialog` — A Material 3 Expressive dialog for prompts, alerts, and actions.
- `m3e-dialog-trigger` — An element for opening dialogs by reference (via the `for` attribute).

## 🧪 Examples

The following example illustrates a dialog with a header, content, and actions:

```html
<m3e-button variant="filled">
  <m3e-dialog-trigger for="dlg">Open Dialog</m3e-dialog-trigger>
</m3e-button>
<m3e-dialog id="dlg" dismissible onclosed="console.log(this.returnValue)">
  <span slot="header">Dialog Title</span>
  Dialog content goes here.
  <div slot="actions" end>
    <m3e-button autofocus><m3e-dialog-action return-value="ok">Close</m3e-dialog-action></m3e-button>
  </div>
</m3e-dialog>
```

## 📖 API Reference

This section details the attributes, slots, events, and CSS custom properties available for the `m3e-dialog` component.

### ⚙️ Attributes

| Attribute       | Type      | Default   | Description                                                                                 |
| --------------- | --------- | --------- | ------------------------------------------------------------------------------------------- |
| `alert`         | `boolean` | `false`   | Whether the dialog is an alert.                                                             |
| `close-label`   | `string`  | `"Close"` | The accessible label given to the button used to dismiss the dialog.                        |
| `disable-close` | `boolean` | `false`   | Whether users cannot click the backdrop or press ESC to dismiss the dialog.                 |
| `dismissible`   | `boolean` | `false`   | Whether a button is presented that can be used to close the dialog.                         |
| `no-focus-trap` | `boolean` | `false`   | Whether to disable focus trapping, which keeps keyboard `Tab` navigation within the dialog. |
| `open`          | `boolean` | `false`   | Whether the dialog is open.                                                                 |

### 🧩 Slots

| Slot Name    | Description                              |
| ------------ | ---------------------------------------- |
| _(default)_  | Renders the content of the dialog.       |
| `header`     | Renders the header of the dialog.        |
| `close-icon` | Renders the icon of the button to close. |
| `actions`    | Renders action buttons for the dialog.   |

### 🔔 Events

| Event     | Description                              |
| --------- | ---------------------------------------- |
| `opening` | Emitted when the dialog begins to open.  |
| `opened`  | Emitted when the dialog has opened.      |
| `cancel`  | Emitted when the dialog is cancelled.    |
| `closing` | Emitted when the dialog begins to close. |
| `closed`  | Emitted when the dialog has closed.      |

### 🎛️ CSS Custom Properties

| Property                              | Description                               |
| ------------------------------------- | ----------------------------------------- |
| `--m3e-dialog-shape`                  | Border radius of the dialog container.    |
| `--m3e-dialog-min-width`              | Minimum width of the dialog.              |
| `--m3e-dialog-max-width`              | Maximum width of the dialog.              |
| `--m3e-dialog-color`                  | Foreground color of the dialog.           |
| `--m3e-dialog-container-color`        | Background color of the dialog container. |
| `--m3e-dialog-scrim-color`            | Color of the scrim (backdrop overlay).    |
| `--m3e-dialog-scrim-opacity`          | Opacity of the scrim when open.           |
| `--m3e-dialog-header-container-color` | Background color of the dialog header.    |
| `--m3e-dialog-header-color`           | Foreground color of the dialog header.    |
| `--m3e-dialog-header-font-size`       | Font size for the dialog header.          |
| `--m3e-dialog-header-font-weight`     | Font weight for the dialog header.        |
| `--m3e-dialog-header-line-height`     | Line height for the dialog header.        |
| `--m3e-dialog-header-tracking`        | Letter spacing for the dialog header.     |
| `--m3e-dialog-content-color`          | Foreground color of the dialog content.   |
| `--m3e-dialog-content-font-size`      | Font size for the dialog content.         |
| `--m3e-dialog-content-font-weight`    | Font weight for the dialog content.       |
| `--m3e-dialog-content-line-height`    | Line height for the dialog content.       |
| `--m3e-dialog-content-tracking`       | Letter spacing for the dialog content.    |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
