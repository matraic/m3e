# @m3e/web/gestures/repeat

Recognizes one child gesture repeatedly. Recognition completes after the configured number of occurrences.

```ts
import { repeat } from "@m3e/web/gestures/repeat";
import { tap } from "@m3e/web/gestures/tap";

const doubleTap = repeat({ count: 2 }, tap());
doubleTap.addListener((detail) => {
  console.log(detail.details.length);
});
```

## Declarative usage

```ts
import "@m3e/web/gestures/repeat";
import "@m3e/web/gestures/tap";
```

```html
<div id="surface"></div>
<m3e-repeat-gesture for="surface" count="2">
  <m3e-tap-gesture></m3e-tap-gesture>
</m3e-repeat-gesture>
```

The element dispatches a `gesture` event with `RepeatGestureDetail` as its detail. The first assigned child gesture is used as the repeated recognizer.

## Showcase examples

Detect a triple tap declaratively by importing `@m3e/web/gestures/repeat`, `@m3e/web/gestures/tap` and binding the gesture element to the target with `for`. Listen for its `gesture` event. Give the target a visible size and an appropriate `touch-action` (the showcase uses `touch-action: none`); provide an accessible alternative for gesture-only interactions.

```html
<div id="item" class="target"></div>
<m3e-repeat-gesture for="item" count="3" max-interval="350">
  <m3e-tap-gesture></m3e-tap-gesture>
</m3e-repeat-gesture>
```

Alternatively, use the same target with `detectGesture` and `phase`. Replace the handler placeholders and retain the returned controller to call `destroy()` when no longer needed.

```js
import { detectGesture, phase } from "@m3e/web/gestures";
import { tap } from "@m3e/web/gestures/tap";
import { repeat } from "@m3e/web/gestures/repeat";

const item = document.getElementById("item");
detectGesture(item, repeat(
  phase({
    onEnd: (detail) => {
      // Handle triple tap
    },
  }),
  {
    count: 3,
    maxInterval: 350
  },
  tap(),
));
```

## Options

| Attribute       | Type                            | Default                     | Description                                                        |
| --------------- | ------------------------------- | --------------------------- | ------------------------------------------------------------------ |
| `disabled`      | `boolean`                       | `false`                     | Whether gesture recognition is disabled.                           |
| `priority`      | `number`                        | `1`                         | The priority in which to recognize gestures.                       |
| `buttons`       | `readonly GestureInputButton[]` | `["primary"]`               | Which buttons can be pressed.                                      |
| `pointer-types` | `readonly PointerType[]`        | `["mouse", "pen", "touch"]` | Which pointer types can be used.                                   |
| `input-filter`  | `GestureInputFilter`            | —                           | Predicate used to determine whether input can be recognized.       |
| `max-interval`  | `number`                        | `250`                       | Maximum allowed time (ms) between consecutive gesture occurrences. |
| `count`         | `number`                        | `2`                         | Number of times a gesture must be repeated.                        |

## Detail

| Property      | Type                                       | Description                                                         |
| ------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| `gestureName` | `string`                                   | The name of the gesture.                                            |
| `phase`       | `"start" \| "update" \| "end" \| "cancel"` | The current phase of the gesture.                                   |
| `inputId`     | `number \| readonly number[]`              | The identifier of the input stream(s) that produced the detail.     |
| `timestamp`   | `number`                                   | The timestamp at which the gesture detail was produced.             |
| `details`     | `readonly TDetail[]`                       | Ordered list of gesture occurrences that form the repeated gesture. |
