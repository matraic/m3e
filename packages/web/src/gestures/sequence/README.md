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
