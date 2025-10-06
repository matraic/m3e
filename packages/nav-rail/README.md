# @m3e/nav-rail

The `m3e-nav-rail` component extends `@m3e/nav-bar` to provide a vertical navigation rail and interactive items for switching between primary destinations in your application. Designed for larger devices, the nav rail supports compact and expanded modes, orientation, selection, and extensive theming via CSS custom properties.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/nav-rail
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/nav-rail/dist/index.js"></script>
```

You also need a module script for `@m3e/nav-bar` due to it being a dependency.

```html
<script type="module" src="/node_modules/@m3e/nav-bar/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js",
      "@m3e/core/a11y": "/node_modules/@m3e/core/dist/a11y.js",
      "@m3e/core/layout": "/node_modules/@m3e/core/dist/layout.js",
      "@m3e/nav-bar": "/node_modules/@m3e/nav-bar/dist/index.js"
    }
  }
</script>
```

> For production, use index.min.js, a11y.min.js, and layout.min.js for faster load times.

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

| Property                                    | Description                                     |
| ------------------------------------------- | ----------------------------------------------- |
| `--m3e-nav-rail-top-space`                  | Top block padding for the nav rail.             |
| `--m3e-nav-rail-bottom-space`               | Bottom block padding for the nav rail.          |
| `--m3e-nav-rail-compact-width`              | Width of the nav rail in compact mode.          |
| `--m3e-nav-rail-expanded-inline-padding`    | Inline padding for expanded nav rail.           |
| `--m3e-nav-rail-expanded-min-width`         | Minimum width of the nav rail in expanded mode. |
| `--m3e-nav-rail-expanded-max-width`         | Maximum width of the nav rail in expanded mode. |
| `--m3e-nav-rail-expanded-item-height`       | Height of nav items in expanded mode.           |
| `--m3e-nav-rail-button-item-space`          | Space below icon buttons and FABs.              |
| `--m3e-nav-rail-expanded-icon-button-inset` | Inset for icon buttons in expanded mode.        |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
