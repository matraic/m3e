# @m3e/web/gestures/long-press

Recognizes a pointer held in place for a minimum duration.

```ts
import { longPress } from "@m3e/web/gestures/long-press";

const recognizer = longPress({ minDuration: 500 });
recognizer.addListener((detail) => console.log(detail.duration));
```

## Declarative usage

```ts
import "@m3e/web/gestures/long-press";
```

```html
<div id="item"></div>
<m3e-long-press-gesture for="item"></m3e-long-press-gesture>
```

The element dispatches a `gesture` event with `LongPressGestureDetail` as its detail.

## Showcase examples

Detect long press declaratively by importing `@m3e/web/gestures/long-press` and binding the gesture element to the target with `for`. Listen for its `gesture` event. Give the target a visible size and an appropriate `touch-action` (the showcase uses `touch-action: none`); provide an accessible alternative for gesture-only interactions.

```html
<div id="item"></div>
<m3e-long-press-gesture for="item"></m3e-long-press-gesture>
```

Alternatively, use the same target with `detectGesture` and `phase`. Replace the handler placeholders and retain the returned controller to call `destroy()` when no longer needed.

```js
import { detectGesture, phase } from "@m3e/web/gestures";
import { longPress } from "@m3e/web/gestures/long-press";

const item = document.getElementById("item");
detectGesture(item, longPress(phase({
  onEnd: (detail) => {
    // Handle long-press
  }
})));
```

## Options

| Attribute            | Type                            | Default                     | Description                                                      |
| -------------------- | ------------------------------- | --------------------------- | ---------------------------------------------------------------- |
| `disabled`           | `boolean`                       | `false`                     | Whether gesture recognition is disabled.                         |
| `priority`           | `number`                        | `1`                         | The priority in which to recognize gestures.                     |
| `buttons`            | `readonly GestureInputButton[]` | `["primary"]`               | Which buttons can be pressed.                                    |
| `pointer-types`      | `readonly PointerType[]`        | `["mouse", "pen", "touch"]` | Which pointer types can be used.                                 |
| `input-filter`       | `GestureInputFilter`            | —                           | Predicate used to determine whether input can be recognized.     |
| `discrete`           | `boolean`                       | `false`                     | Whether the gesture is discrete.                                 |
| `pointers`           | `number`                        | `1`                         | Number of pointers required for the gesture to be recognized.    |
| `max-displacement`   | `number`                        | `4`                         | Maximum allowed movement (px).                                   |
| `min-duration`       | `number`                        | `500`                       | Minimum time (ms) a pointer must remain pressed.                 |
| `max-press-interval` | `number`                        | `120`                       | Maximum allowed time (ms) between the earliest and latest press. |

## Detail

| Property      | Type                                       | Description                                                     |
| ------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `gestureName` | `string`                                   | The name of the gesture.                                        |
| `phase`       | `"start" \| "update" \| "end" \| "cancel"` | The current phase of the gesture.                               |
| `inputId`     | `number \| readonly number[]`              | The identifier of the input stream(s) that produced the detail. |
| `timestamp`   | `number`                                   | The timestamp at which the gesture detail was produced.         |
| `clientX`     | `number`                                   | Viewport x-coordinate where the long-press began.               |
| `clientY`     | `number`                                   | Viewport y-coordinate where the long-press began.               |
| `localX`      | `number`                                   | Element-relative x-coordinate where the long-press began.       |
| `localY`      | `number`                                   | Element-relative y-coordinate where the long-press began.       |
| `duration`    | `number`                                   | Total duration (ms) of the gesture.                             |
