# @m3e/web/gestures/sequence

Recognizes multiple child gestures in a required order. The sequence completes only when every child recognizer completes; a failed child cancels the sequence.

```ts
import { sequence } from "@m3e/web/gestures/sequence";
import { longPress } from "@m3e/web/gestures/long-press";
import { tap } from "@m3e/web/gestures/tap";

const recognizer = sequence(longPress(), tap());
```

## Declarative usage

```ts
import "@m3e/web/gestures/sequence";
import "@m3e/web/gestures/long-press";
import "@m3e/web/gestures/tap";
```

```html
<div id="canvas"></div>
<m3e-sequence-gesture for="canvas">
  <m3e-long-press-gesture></m3e-long-press-gesture>
  <m3e-tap-gesture></m3e-tap-gesture>
</m3e-sequence-gesture>
```

The element dispatches a `gesture` event with `SequenceGestureDetail` as its detail. Child gesture elements are processed in DOM order.

## Showcase examples

Detect a long press followed by a pan declaratively by importing `@m3e/web/gestures/sequence`, `@m3e/web/gestures/long-press`, `@m3e/web/gestures/pan` and binding the gesture element to the target with `for`. Listen for its `gesture` event. Give the target a visible size and an appropriate `touch-action` (the showcase uses `touch-action: none`); provide an accessible alternative for gesture-only interactions.

```html
<div id="item" class="target"></div>
<m3e-sequence-gesture for="item" max-interval="0">
  <m3e-long-press-gesture></m3e-long-press-gesture>
  <m3e-pan-gesture activation-mode="move"></m3e-pan-gesture>
</m3e-sequence-gesture>
```

Alternatively, use the same target with `detectGesture` and `phase`. Replace the handler placeholders and retain the returned controller to call `destroy()` when no longer needed.

```js
import { detectGesture, phase } from "@m3e/web/gestures";
import { longPress } from "@m3e/web/gestures/long-press";
import { pan } from "@m3e/web/gestures/pan";
import { sequence } from "@m3e/web/gestures/sequence";

const item = document.getElementById("item");
detectGesture(
  item,
  sequence(
    { maxInterval: 0 },
    longPress(
      phase({
        onEnd: (detail) => {
          // Handle pick up
        },
      }),
    ),
    pan(
      {
        activationMode: "move",
      },
      phase({
        onUpdate: (detail) => {
          // Handle move
        },
      }),
    ),
  ),
);
```

## Options

| Attribute       | Type                            | Default                     | Description                                                     |
| --------------- | ------------------------------- | --------------------------- | --------------------------------------------------------------- |
| `disabled`      | `boolean`                       | `false`                     | Whether gesture recognition is disabled.                        |
| `priority`      | `number`                        | `1`                         | The priority in which to recognize gestures.                    |
| `buttons`       | `readonly GestureInputButton[]` | `["primary"]`               | Which buttons can be pressed.                                   |
| `pointer-types` | `readonly PointerType[]`        | `["mouse", "pen", "touch"]` | Which pointer types can be used.                                |
| `input-filter`  | `GestureInputFilter`            | —                           | Predicate used to determine whether input can be recognized.    |
| `max-interval`  | `number`                        | `250`                       | Maximum allowed time (ms) between each gesture in the sequence. |

## Detail

| Property      | Type                                       | Description                                                     |
| ------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `gestureName` | `string`                                   | The name of the gesture.                                        |
| `phase`       | `"start" \| "update" \| "end" \| "cancel"` | The current phase of the gesture.                               |
| `inputId`     | `number \| readonly number[]`              | The identifier of the input stream(s) that produced the detail. |
| `timestamp`   | `number`                                   | The timestamp at which the gesture detail was produced.         |
| `details`     | `readonly GestureDetail[]`                 | Ordered list of gesture occurrences that form the sequence.     |
