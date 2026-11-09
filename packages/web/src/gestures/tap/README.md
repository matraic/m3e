# @m3e/web/gestures/tap

Recognizes a short press and release with limited pointer movement.

```ts
import { tap } from "@m3e/web/gestures/tap";

const recognizer = tap((detail) => {
  console.log(detail.gestureName, detail.clientX, detail.clientY);
});
```

## Declarative usage

```ts
import "@m3e/web/gestures/tap";
```

```html
<button id="save">Save</button> <m3e-tap-gesture for="save"></m3e-tap-gesture>
```

The element dispatches a `gesture` event with `TapGestureDetail` as its detail.

## Showcase examples

Detect tap declaratively by importing `@m3e/web/gestures/tap` and binding the gesture element to the target with `for`. Listen for its `gesture` event. Give the target a visible size and an appropriate `touch-action` (the showcase uses `touch-action: none`); provide an accessible alternative for gesture-only interactions.

```html
<div id="item"></div>
<m3e-tap-gesture for="item"></m3e-tap-gesture>
```

Alternatively, use the same target with `detectGesture` and `phase`. Replace the handler placeholders and retain the returned controller to call `destroy()` when no longer needed.

```js
import { detectGesture, phase } from "@m3e/web/gestures";
import { tap } from "@m3e/web/gestures/tap";

const item = document.getElementById("item");
detectGesture(item, tap(phase({
  onEnd: (detail) => {
    // Handle tap
  }
})));
```

## Options

| Attribute              | Type                            | Default                     | Description                                                        |
| ---------------------- | ------------------------------- | --------------------------- | ------------------------------------------------------------------ |
| `disabled`             | `boolean`                       | `false`                     | Whether gesture recognition is disabled.                           |
| `priority`             | `number`                        | `1`                         | The priority in which to recognize gestures.                       |
| `buttons`              | `readonly GestureInputButton[]` | `["primary"]`               | Which buttons can be pressed.                                      |
| `pointer-types`        | `readonly PointerType[]`        | `["mouse", "pen", "touch"]` | Which pointer types can be used.                                   |
| `input-filter`         | `GestureInputFilter`            | —                           | Predicate used to determine whether input can be recognized.       |
| `pointers`             | `number`                        | `1`                         | Number of pointers required for the gesture to be recognized.      |
| `max-duration`         | `number`                        | `180`                       | Maximum allowed press duration (ms).                               |
| `max-displacement`     | `number`                        | `12`                        | Maximum allowed movement (px).                                     |
| `max-press-interval`   | `number`                        | `120`                       | Maximum allowed time (ms) between the earliest and latest press.   |
| `max-release-interval` | `number`                        | `120`                       | Maximum allowed time (ms) between the earliest and latest release. |

## Detail

| Property      | Type                                       | Description                                                     |
| ------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `gestureName` | `string`                                   | The name of the gesture.                                        |
| `phase`       | `"start" \| "update" \| "end" \| "cancel"` | The current phase of the gesture.                               |
| `inputId`     | `number \| readonly number[]`              | The identifier of the input stream(s) that produced the detail. |
| `timestamp`   | `number`                                   | The timestamp at which the gesture detail was produced.         |
| `clientX`     | `number`                                   | Viewport x-coordinate where the tap began.                      |
| `clientY`     | `number`                                   | Viewport y-coordinate where the tap began.                      |
| `localX`      | `number`                                   | Element-relative x-coordinate where the tap began.              |
| `localY`      | `number`                                   | Element-relative y-coordinate where the tap began.              |
| `duration`    | `number`                                   | Total duration (ms) of the gesture.                             |
