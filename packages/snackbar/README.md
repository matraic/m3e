# @m3e/snackbar

The `@m3e/snackbar` package provides the `M3eSnackbar` global service on `window` (`globalThis`) used to present short updates about application processes at the bottom of the screen from anywhere in an application.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/snackbar
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/snackbar/dist/index.js"></script>
```

You also need a module script for `@m3e/button` and `@m3e/icon-button` due to being a dependency.

```html
<script type="module" src="/node_modules/@m3e/button/dist/index.js"></script>
<script type="module" src="/node_modules/@m3e/icon-button/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include additional dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js"
    }
  }
</script>
```

> For production, use index.min.js for faster load times.

## 🧪 Examples

The following example illustrates basic usage.

```js
M3eSnackbar.open("File deleted");
```

The next example illustrates presenting a snackbar with an action and callback.

```js
M3eSnackbar.open("File deleted", "Undo", {
  actionCallback: () => {
    // Undo logic here
  },
});
```

## 📖 API Reference

### 🛠️ Snackbar Service

This section details the methods available for the `M3eSnackbar` service.

#### ⚙️ Methods

| Method    | Signature                                                                                      | Description                                                                                                                                                                                                                                                                                                           |
| --------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`    | `open(message: string, options?: SnackbarOptions): void`                                       | Opens a snackbar with a message.<br>- `message`: The message to show in the snackbar.<br>- `options`: (optional) Options that control the behavior of the snackbar.                                                                                                                                                   |
| `open`    | `open(message: string, action: string, options?: SnackbarOptions): void`                       | Opens a snackbar with a message and action.<br>- `message`: The message to show in the snackbar.<br>- `action`: The label for the snackbar action.<br>- `options`: (optional) Options that control the behavior of the snackbar.                                                                                      |
| `open`    | `open(message: string, action: string, dismissible: boolean, options?: SnackbarOptions): void` | Opens a snackbar with a message, action, and optional close affordance.<br>- `message`: The message to show in the snackbar.<br>- `action`: The label for the snackbar action.<br>- `dismissible`: Whether to present close affordance.<br>- `options`: (optional) Options that control the behavior of the snackbar. |
| `open`    | `open(message: string, dismissible: boolean, options?: SnackbarOptions): void`                 | Opens a snackbar with a message and optional close affordance.<br>- `message`: The message to show in the snackbar.<br>- `dismissible`: Whether to present close affordance.<br>- `options`: (optional) Options that control the behavior of the snackbar.                                                            |
| `dismiss` | `dismiss(): void`                                                                              | Dismisses the currently visible snackbar.                                                                                                                                                                                                                                                                             |

### 🗂️ Snackbar

This section details the attributes, slots and CSS custom properties available for the `m3e-snackbar` component.

#### ⚙️ Attributes

| Attribute     | Type      | Default   | Description                                                                                |
| ------------- | --------- | --------- | ------------------------------------------------------------------------------------------ |
| `action`      | `string`  |           | The label of the snackbar's action.                                                        |
| `close-label` | `string`  | `"Close"` | The accessible label given to the button used to dismiss the snackbar.                     |
| `dismissible` | `boolean` | `false`   | Whether a button is presented that can be used to close the snackbar.                      |
| `duration`    | `number`  | `3000`    | The length of time, in milliseconds, to wait before automatically dismissing the snackbar. |

#### 🧩 Slots

| Slot         | Description                            |
| ------------ | -------------------------------------- |
| _(default)_  | Renders the content of the snackbar.   |
| `close-icon` | Renders the icon for the close button. |

#### 🎛️ CSS Custom Properties

| Property                                     | Description                                  |
| -------------------------------------------- | -------------------------------------------- |
| `--m3e-snackbar-margin`                      | Vertical offset from the bottom of viewport. |
| `--m3e-snackbar-container-shape`             | Border radius of the snackbar container.     |
| `--m3e-snackbar-container-color`             | Background color of the snackbar.            |
| `--m3e-snackbar-padding`                     | Internal spacing of the snackbar container.  |
| `--m3e-snackbar-min-width`                   | Minimum width of the snackbar.               |
| `--m3e-snackbar-max-width`                   | Maximum width of the snackbar.               |
| `--m3e-snackbar-supporting-text-font-size`   | Font size for supporting text.               |
| `--m3e-snackbar-supporting-text-font-weight` | Font weight for supporting text.             |
| `--m3e-snackbar-supporting-text-line-height` | Line height for supporting text.             |
| `--m3e-snackbar-supporting-text-tracking`    | Letter spacing for supporting text.          |
| `--m3e-snackbar-supporting-text-color`       | Color of supporting text.                    |
| `--m3e-snackbar-action-text-color`           | Color of the action button text.             |
| `--m3e-snackbar-close-icon-color`            | Color of the close icon.                     |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
