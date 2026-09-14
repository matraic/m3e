# Gestures

The `@m3e/web/gestures` module provides a gesture recognition subsystem supporting declarative and programmatic gesture detection. It uses a modular recognizer architecture with a priority-based disposition system that resolves competing claims on input.

The subsystem includes:

- Pointer tracking and gesture details with viewport and element-local coordinates
- Configurable thresholds, pointer types, buttons, priorities, and input filters
- Arbitration for recognizers competing for the same input stream
- Composed recognizers for sequences and repetitions
- Declarative elements that bind to a target with the `for` attribute

## Installation

Import the base module when using the shared types or `detectGesture`:

```ts
import { detectGesture } from "@m3e/web/gestures";
```

Each recognizer has its own entry point. Import only the recognizers used by an application:

```ts
import { tap } from "@m3e/web/gestures/tap";
import { swipe } from "@m3e/web/gestures/swipe";
```

The recognizer entry points are:

| Entry point                                                                                                               | Factory       | Gesture                                                  | Element                    |
| ------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------- | -------------------------- |
| [`@m3e/web/gestures/long-press`](https://github.com/matraic/m3e/tree/HEAD/packages/web/src/gestures/long-press/README.md) | `longPress()` | Press held for a minimum duration                        | `<m3e-long-press-gesture>` |
| [`@m3e/web/gestures/pan`](https://github.com/matraic/m3e/tree/HEAD/packages/web/src/gestures/pan/README.md)               | `pan()`       | Continuous dragging                                      | `<m3e-pan-gesture>`        |
| [`@m3e/web/gestures/repeat`](https://github.com/matraic/m3e/tree/HEAD/packages/web/src/gestures/repeat/README.md)         | `repeat()`    | Repeated child gesture                                   | `<m3e-repeat-gesture>`     |
| [`@m3e/web/gestures/rotate`](https://github.com/matraic/m3e/tree/HEAD/packages/web/src/gestures/rotate/README.md)         | `rotate()`    | Multi-pointer rotation                                   | `<m3e-rotate-gesture>`     |
| [`@m3e/web/gestures/scale`](https://github.com/matraic/m3e/tree/HEAD/packages/web/src/gestures/scale/README.md)           | `scale()`     | Pinch or spread                                          | `<m3e-scale-gesture>`      |
| [`@m3e/web/gestures/sequence`](https://github.com/matraic/m3e/tree/HEAD/packages/web/src/gestures/sequence/README.md)     | `sequence()`  | Child gestures in order                                  | `<m3e-sequence-gesture>`   |
| [`@m3e/web/gestures/swipe`](https://github.com/matraic/m3e/tree/HEAD/packages/web/src/gestures/swipe/README.md)           | `swipe()`     | Fast directional movement                                | `<m3e-swipe-gesture>`      |
| [`@m3e/web/gestures/tap`](https://github.com/matraic/m3e/tree/HEAD/packages/web/src/gestures/tap/README.md)               | `tap()`       | One or more taps                                         | `<m3e-tap-gesture>`        |
| [`@m3e/web/gestures/transform`](https://github.com/matraic/m3e/tree/HEAD/packages/web/src/gestures/transform/README.md)   | `transform()` | Low-level multi-pointer translation, scale, and rotation | `<m3e-transform-gesture>`  |

The base `@m3e/web/gestures` entry point exports shared types, recognizer base classes, pointer tracking, and `detectGesture`. Individual recognizer APIs and their detail and option types are exported from their entry points.

## Programmatic API

Create a recognizer, bind it to an element, and destroy the binding when it is no longer needed:

```ts
import { detectGesture } from "@m3e/web/gestures";
import { tap } from "@m3e/web/gestures/tap";

const button = document.querySelector("button")!;
const recognizer = tap(
  (detail) => {
    console.log("Tapped at", detail.pointers[0].clientX, detail.pointers[0].clientY);
  },
  { maxDuration: 180 },
);

const controller = detectGesture(button, recognizer);

// Temporarily disable every recognizer managed by this controller.
controller.disabled = true;

// Remove the binding when the owning view is disposed.
controller.destroy();
```

Factories accept a listener, partial options, or both:

```ts
import { pan } from "@m3e/web/gestures/pan";

const recognizer = pan({
  activationMode: "move",
  lockAxis: "x",
  minDisplacement: 8,
});

recognizer.addListener((detail) => {
  if (detail.phase === "update") {
    console.log(detail.totalDeltaX, detail.velocityX);
  }
});
```

Every recognizer also exposes its options and can be combined with other recognizers on the same element:

```ts
import { detectGesture } from "@m3e/web/gestures";
import { longPress } from "@m3e/web/gestures/long-press";
import { swipe } from "@m3e/web/gestures/swipe";
import { tap } from "@m3e/web/gestures/tap";

const controller = detectGesture(element, tap(), longPress(), swipe());
```

The resolver uses recognizer priority and disposition to decide which recognizers may claim an input stream. Set a higher `priority` when a recognizer should win a conflict.

## Arbitration

When multiple recognizers receive the same input stream, each reports a disposition while it evaluates the input. The resolver tracks these dispositions independently for each input stream:

| Disposition | Meaning                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------- |
| `accept`    | The recognizer intends to claim the input stream.                                                  |
| `reject`    | The recognizer declines or withdraws its claim.                                                    |
| `hold`      | The recognizer delays resolution while it waits for more input. A hold blocks arbitration.         |
| `release`   | The recognizer releases a previous hold.                                                           |
| `defer`     | The recognizer remains active without blocking resolution. It is rejected unless it later accepts. |

The resolver follows this process:

1. If any recognizer holds the input stream, resolution waits until every hold is released or rejected.
2. Once there are no holds, an eager acceptor is preferred. If multiple eager recognizers accept, the one with the highest `priority` wins.
3. If there are no eager acceptors, the acceptor with the highest `priority` wins.
4. The winning recognizer receives an `accept` resolution. Remaining acceptors and all deferrers receive a `reject` resolution.
5. If no recognizer can accept, the input stream is removed from the resolver.

Priority is compared only when a recognizer has a strictly higher value, so equal-priority contenders retain their existing resolution order. A recognizer that accepts after holding moves to the front of the acceptor queue, allowing it to be considered first when priorities are equal.

## Declarative API

Import the element entry point, then bind a gesture element to a target with `for`:

```ts
import "@m3e/web/gestures/tap";
```

```html
<button id="save-button">Save</button> <m3e-tap-gesture for="save-button"></m3e-tap-gesture>
```

Gesture elements are non-visual and dispatch a `gesture` event with the recognizer's detail object:

```ts
const gesture = document.querySelector("m3e-tap-gesture")!;

gesture.addEventListener("gesture", (event) => {
  const detail = event.detail;
  console.log(detail.gestureName, detail.timestamp);
});
```

The common element properties are:

| Property / attribute | Default             | Description                                              |
| -------------------- | ------------------- | -------------------------------------------------------- |
| `for`                | Required            | ID of the element receiving pointer input                |
| `disabled`           | `false`             | Disables recognition                                     |
| `priority`           | `1`                 | Resolver priority used during arbitration                |
| `buttons`            | `"primary"`         | Space-separated buttons accepted by the recognizer       |
| `pointer-types`      | `"mouse pen touch"` | Space-separated pointer types accepted by the recognizer |

Recognizer-specific attributes are documented by each element's option type in its entry point. For example, tap supports `max-duration`, `max-displacement`, and `max-press-interval`; pan supports `activation-mode`, `lock-axis`, and `min-displacement`.

## Composing gestures

`sequence` and `repeat` accept recognizers as children when used programmatically, or gesture elements when used declaratively.

```ts
import { detectGesture } from "@m3e/web/gestures";
import { repeat } from "@m3e/web/gestures/repeat";
import { tap } from "@m3e/web/gestures/tap";

const doubleTap = repeat({ count: 2 }, tap());

detectGesture(element, doubleTap);
doubleTap.addListener((detail) => {
  console.log(`${detail.occurrences.length} taps`);
});
```

```html
<div id="canvas"></div>
<m3e-sequence-gesture for="canvas">
  <m3e-long-press-gesture></m3e-long-press-gesture>
  <m3e-tap-gesture></m3e-tap-gesture>
</m3e-sequence-gesture>
```

## Gesture phases

Every gesture detail includes a `phase` describing its position in the recognition lifecycle:

| Phase    | Description                                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| `start`  | The recognizer has begun tracking or has activated the gesture.                                            |
| `update` | The active gesture has changed or progressed. Details such as movement, scale, or rotation may be updated. |
| `end`    | The gesture completed successfully.                                                                        |
| `cancel` | The gesture failed, was interrupted, or lost the input stream.                                             |

Not every recognizer emits every phase. Continuous recognizers such as pan, scale, rotate, and transform can emit `start`, `update`, and `end`; a failed recognition may emit `cancel`. Discrete recognizers may emit only the phases relevant to their lifecycle.

```ts
recognizer.addListener((detail) => {
  switch (detail.phase) {
    case "start":
      console.log("Gesture started");
      break;
    case "update":
      console.log("Gesture changed");
      break;
    case "end":
      console.log("Gesture completed");
      break;
    case "cancel":
      console.log("Gesture cancelled");
      break;
  }
});
```

## Gesture details

Details share an `inputId`, `timestamp`, `gestureName`, and `phase`. The remaining fields depend on the recognizer:

| Gesture    | Useful detail fields                                                                |
| ---------- | ----------------------------------------------------------------------------------- |
| Tap        | `duration`, `pointers`                                                              |
| Long press | `phase`, `duration`, `clientX`, `clientY`                                           |
| Pan        | `phase`, `deltaX`, `deltaY`, `totalDeltaX`, `totalDeltaY`, `velocityX`, `velocityY` |
| Swipe      | `direction`, `axis`, `distance`, `speed`, `angle`                                   |
| Scale      | `phase`, `scale`, `distance`, `clientCenterX`, `clientCenterY`                      |
| Rotate     | `rotation`, `rotationDelta`, `rotationVelocity`, `currentAngle`                     |
| Transform  | `phase`, translation, scale, and rotation values                                    |
| Sequence   | `sequence` containing each child detail                                             |
| Repeat     | `occurrences` containing each completed detail                                      |

Use the generated TypeScript declarations for the complete detail and option contracts:

```ts
import type { TapGestureDetail } from "@m3e/web/gestures/tap";
import type { PanGestureOptions } from "@m3e/web/gestures/pan";
```

## Creating custom recognizers

Extend `GestureRecognizerBase` when implementing a recognizer from normalized input. Define an options interface that extends `GestureOptions`, a detail interface that extends `GestureDetail`, and a default value for every custom option.

```ts
import {
  DefaultGestureOptions,
  GestureDetail,
  GestureOptions,
  PointerInput,
  GestureRecognizerBase,
} from "@m3e/web/gestures";

interface CustomGestureOptions extends GestureOptions {
  minDistance: number;
}

interface CustomGestureDetail extends GestureDetail {
  distance: number;
}

class CustomGestureRecognizer extends GestureRecognizerBase<CustomGestureOptions, CustomGestureDetail> {
  override get defaultOptions(): CustomGestureOptions {
    return { ...DefaultGestureOptions, minDistance: 8 };
  }

  protected override _onPointerDown(input: PointerInput): void {
    this._hold(input.inputId);
  }

  protected override _onPointerMove(input: PointerInput): void {
    // Evaluate the input and call _accept, _reject, _hold, _release, or _defer.
  }

  protected override _onAccept(_inputId: number): void {
    // Emit CustomGestureDetail when the resolver accepts the claim.
  }

  protected override _onReject(_inputId: number): void {
    // Stop tracking state for a rejected input stream.
  }

  override reset(): void {
    // Clear all internal tracking state.
  }
}
```

`GestureRecognizerBase` filters disabled recognizers, pointer types, buttons, and `inputFilter` before dispatching normalized input to the protected pointer and wheel hooks. Use its protected helpers to participate in arbitration:

| Helper              | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `_accept(inputId)`  | Claim an input stream.                                    |
| `_reject(inputId)`  | Withdraw from an input stream.                            |
| `_hold(inputId)`    | Delay arbitration while more input is required.           |
| `_release(inputId)` | Release a previous hold.                                  |
| `_defer(inputId)`   | Stay active without blocking another recognizer.          |
| `_emit(detail)`     | Notify registered listeners with semantic gesture detail. |

Implement `_onAccept`, `_onReject`, and `reset` to handle resolver results and cleanup. Bind a custom recognizer with `detectGesture` just like a built-in recognizer:

```ts
import { detectGesture } from "@m3e/web/gestures";

const recognizer = new CustomGestureRecognizer({ minDistance: 12 });
const controller = detectGesture(element, recognizer);
```

To expose the recognizer declaratively, extend `GestureElementBase`, expose any custom options as reactive properties, and provide the recognizer instance:

```ts
import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";
import { GestureElementBase } from "@m3e/web/gestures";

import { CustomGestureDetail, CustomGestureOptions, CustomGestureRecognizer } from "./CustomGestureRecognizer";

@customElement("m3e-custom-gesture")
class M3eCustomGestureElement extends GestureElementBase<CustomGestureOptions, CustomGestureDetail> {
  readonly recognizer = new CustomGestureRecognizer();

  @property({ type: Number }) minDistance = 8;

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);
    this.recognizer.options = { minDistance: this.minDistance };
  }
}
```

Use `DelegatingGestureRecognizerBase` instead when the custom recognizer transforms or composes another recognizer's input and detail. This keeps input forwarding, resolution, disabled state, and option propagation aligned with the built-in composed recognizers.
