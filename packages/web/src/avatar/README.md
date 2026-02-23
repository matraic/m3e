# @m3e/web/avatar

The `m3e-avatar` component is a reusable identity primitive that displays visual or textual representation with consistent sizing, shape, and typography.

```ts
import "@m3e/web/avatar";
```

## 🗂️ Elements

- `m3e-avatar` — An image, icon or textual initials representing a user or other identity.

## 🧪 Examples

The following example illustrates use of the `m3e-avatar` to present textual initials.

```html
<m3e-avatar>AB</m3e-avatar>
```

The next example illustrates use of the `m3e-avatar` to present an icon.

> This example uses the `@m3e/icon` package to present Material Design symbols, but any icon package can be substituted depending on your design system or preferences

```html
<m3e-avatar>
  <m3e-icon name="person"></m3e-icon>
</m3e-avatar>
```

The last example illustrates use of the `m3e-avatar` to present an image.

```html
<m3e-avatar>
  <img src="https://avatars.githubusercontent.com/u/224686995?s=48&v=4" />
</m3e-avatar>
```

## 📖 API Reference

This section details the slots and CSS custom properties available for the `m3e-avatar` component.

### 🧩 Slots

| Slot        | Description                        |
| ----------- | ---------------------------------- |
| _(default)_ | Renders the content of the avatar. |

### 🎛️ CSS Custom Properties

| Property                   | Description                     |
| -------------------------- | ------------------------------- |
| `--m3e-avatar-size`        | Size of the avatar.             |
| `--m3e-avatar-shape`       | Border radius of the avatar.    |
| `--m3e-avatar-font-size`   | Font size for the avatar.       |
| `--m3e-avatar-font-weight` | Font weight for the avatar.     |
| `--m3e-avatar-line-height` | Line height for the avatar.     |
| `--m3e-avatar-tracking`    | Letter spacing for the avatar.  |
| `--m3e-avatar-color`       | Background color of the avatar. |
| `--m3e-avatar-label-color` | Text color of the avatar.       |
