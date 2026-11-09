# @m3e/web/dialog

The `m3e-dialog` component presents important prompts, alerts, and actions in user flows. Designed according to Material 3 principles, it supports custom header, content, and close icon slots, ARIA accessibility, focus management, and theming via CSS custom properties.

```ts
import "@m3e/web/dialog";
```

## 🗂️ Elements

- `m3e-dialog` — A Material 3 Expressive dialog for prompts, alerts, and actions.
- `m3e-dialog-trigger` — An element for opening dialogs by reference (via the `for` attribute).
- `m3e-dialog-action` — An element for closing a parent dialog with a return value.

## 🧪 Examples

Use a trigger to open a dismissible dialog with a header and an action.
Import `@m3e/web/button` for the buttons.

```html
<m3e-button variant="filled">
  <m3e-dialog-trigger for="dlg">Open Dialog</m3e-dialog-trigger>
</m3e-button>
<m3e-dialog id="dlg" dismissible>
  <span slot="header">Lorem ipsum dolor sit amet</span>
  <!-- Content omitted for brevity -->
  <div slot="actions" end>
    <m3e-button autofocus><m3e-dialog-action return-value="ok">Close</m3e-dialog-action></m3e-button>
  </div>
</m3e-dialog>
```

Nest a trigger inside a clickable element and connect it to the dialog by id.
Import `@m3e/web/button` for the button.

```html
<m3e-button variant="filled">
  <m3e-dialog-trigger for="dlg">Open Dialog</m3e-dialog-trigger>
</m3e-button>
<m3e-dialog id="dlg" dismissible>
  <!-- Content omitted for brevity -->
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

| Slot         | Description                              |
| ------------ | ---------------------------------------- |
| _(default)_  | Renders the content of the dialog.       |
| `header`     | Renders the header of the dialog.        |
| `close-icon` | Renders the icon of the button to close. |
| `actions`    | Renders action buttons for the dialog.   |

### 🔔 Events

| Event     | Description                                 |
| --------- | ------------------------------------------- |
| `opening` | Dispatched when the dialog begins to open.  |
| `opened`  | Dispatched when the dialog has opened.      |
| `cancel`  | Dispatched when the dialog is cancelled.    |
| `closing` | Dispatched when the dialog begins to close. |
| `closed`  | Dispatched when the dialog has closed.      |

### 🎛️ CSS Custom Properties

| Property                              | Description                               |
| ------------------------------------- | ----------------------------------------- |
| `--m3e-dialog-shape`                  | Border radius of the dialog container.    |
| `--m3e-dialog-min-width`              | Minimum width of the dialog.              |
| `--m3e-dialog-max-height`             | Maximum height of the dialog.             |
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
