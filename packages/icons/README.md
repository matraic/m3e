# @m3e/icons

The `@m3e/icons` package provides SVG‑based icon modules for the [`@m3e/web`](https://github.com/matraic/m3e/tree/main/packages/web) component suite. Each icon is a standalone ES module that registers itself when imported, making it available to the `m3e-icon` component.

## Examples

### Import a single icon

```js
import "@m3e/icons/outlined/search";
```

### Import all icons for a variant

```js
import "@m3e/icons/outlined";
import "@m3e/icons/rounded";
import "@m3e/icons/sharp";
```

### Import all icons

```js
import "@m3e/icons";
```

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
Material Symbols icons are licensed under the Apache License 2.0 (see LICENSE-APACHE and NOTICE).
