# @m3e/nextjs

The `@m3e/nextjs` package provides idiomatic, typed dynamic imports in nextjs for M3E Web Components, exposing their properties, attributes, and native DOM events through a familiar React interface with full ref forwarding and client‑only compatibility.

The React bindings are client-only and must be used inside a `"use client"` an also works without this `"use client"` because Dynamic Import is Used boundary in your application.

To support Next.js and SSR, `@m3e/web` works with Lit's server-ready modules, and consumers only need to wrap their `next.config.js` with `withLitSSR` from `@lit-labs/nextjs`. This lets Next.js load the correct server build instead of evaluating browser code during rendering, so all `@m3e/web` elements render on the server and hydrate on the client without any extra setup.

## 🧪 Example

The following example demonstrates how to use the `M3eButton` React binding from `@m3e/nextjs/button`.

```tsx
"use client";

import { M3eButton, M3eButtonElement } from "@m3e/nextjs/button";
import {useRef} from "react";

export default function ClickExample() {
    const buttonRef = useRef<M3eButtonElement>();
  return <M3eButton onClick={() => console.log("Button clicked!")}>Click me</M3eButton>;
}
```

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
