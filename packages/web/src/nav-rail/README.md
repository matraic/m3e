# @m3e/web/nav-rail

The `m3e-nav-rail` component extends `@m3e/nav-bar` to provide a vertical navigation rail and interactive items for switching between primary destinations in your application. Designed for larger devices, the nav rail supports compact and expanded modes, orientation, selection, and extensive theming via CSS custom properties.

```ts
import "@m3e/web/nav-rail";
```

## 🗂️ Elements

- `m3e-nav-rail` — A vertical bar, typically used on larger devices, that allows a user to switch between views.

## 🧪 Example

The following example illustrates a nav rail whose expanded state is automatically determined by the current screen size. In addition, a toggle button is used to allow the user to manually toggle the expanded state.

```html
<m3e-nav-rail id="nav-rail" mode="auto">
  <m3e-icon-button toggle>
    <m3e-icon name="menu"></m3e-icon>
    <m3e-icon slot="selected" name="menu_open"></m3e-icon>
    <m3e-nav-rail-toggle for="nav-rail"></m3e-nav-rail-toggle>
  </m3e-icon-button>
  <m3e-fab size="small">
    <m3e-icon name="edit"></m3e-icon>
    <span slot="label">Extended</span>
  </m3e-fab>
  <m3e-nav-item><m3e-icon slot="icon" name="news"></m3e-icon>News</m3e-nav-item>
  <m3e-nav-item><m3e-icon slot="icon" name="globe"></m3e-icon>Global</m3e-nav-item>
  <m3e-nav-item><m3e-icon slot="icon" name="star"></m3e-icon>For you</m3e-nav-item>
  <m3e-nav-item><m3e-icon slot="icon" name="newsstand"></m3e-icon>Trending</m3e-nav-item>
</m3e-nav-rail>
```

## 📖 API Reference

This section details the attributes, slots, events and CSS custom properties available for the `m3e-nav-rail` component.

### ⚙️ Attributes

| Attribute | Type                              | Default | Description                                        |
| --------- | --------------------------------- | ------- | -------------------------------------------------- |
| mode      | "compact" \| "expanded" \| "auto" | auto    | The mode in which items in the rail are presented. |

### 🔔 Events

| Event  | Description                                         |
| ------ | --------------------------------------------------- |
| change | Emitted when the selected state of an item changes. |

### 🧩 Slots

| Slot        | Description                    |
| ----------- | ------------------------------ |
| _(default)_ | Renders the items of the rail. |

### 🎛️ CSS Custom Properties

| Property                                    | Description                                        |
| ------------------------------------------- | -------------------------------------------------- |
| `--m3e-nav-rail-top-space`                  | Top block padding for the nav rail.                |
| `--m3e-nav-rail-bottom-space`               | Bottom block padding for the nav rail.             |
| `--m3e-nav-rail-compact-width`              | Width of the nav rail in compact mode.             |
| `--m3e-nav-rail-inline-padding`             | Inline padding for nav rail.                       |
| `--m3e-nav-rail-expanded-width`             | Width of the nav rail in expanded mode.            |
| `--m3e-nav-rail-expanded-item-height`       | Height of nav items in expanded mode.              |
| `--m3e-nav-rail-button-item-space`          | Space below icon buttons and FABs.                 |
| `--m3e-nav-rail-icon-button-inset`          | Inset for icon buttons.                            |
| `--m3e-nav-rail-expanded-inline-padding`    | Deprecated, use `--m3e-nav-rail-inline-padding`    |
| `--m3e-nav-rail-expanded-min-width`         | Deprecated, use `--m3e-nav-rail-expanded-width`    |
| `--m3e-nav-rail-expanded-max-width`         | Deprecated, use `--m3e-nav-rail-expanded-width`    |
| `--m3e-nav-rail-expanded-icon-button-inset` | Deprecated, use `--m3e-nav-rail-icon-button-inset` |
