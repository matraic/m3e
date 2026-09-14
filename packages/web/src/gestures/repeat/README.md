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
