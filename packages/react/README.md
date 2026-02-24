# @m3e/react

The `@m3e/react` package provides idiomatic, typed React bindings for M3E Web Components, exposing their properties, attributes, and native DOM events through a familiar React interface with full ref forwarding and client‑only compatibility.

## 🧪 Example

The following example demonstrates how to use the `M3eButton` React binding from `@m3e/react/button`.

```tsx
"use client";

import { M3eButton } from "@m3e/react/button";

export default function ClickExample() {
  return <M3eButton onClick={() => console.log("Button clicked!")}>Click me</M3eButton>;
}
```

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
