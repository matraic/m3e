# @m3e/web/autocomplete

The `m3e-autocomplete` component enhances a text input field with a dynamically positioned menu of filterable suggestions. Following Material Design 3 principles, it provides real-time filtering, keyboard navigation, automatic option activation, and text highlighting to guide user selection.

```ts
import "@m3e/web/autocomplete";
```

## 🗂️ Elements

- `m3e-autocomplete` — An input enhancement that displays a filtered menu of suggestions, providing real-time filtering and keyboard navigation.

## 🧪 Examples

Pair autocomplete with a form field.

```html
<m3e-form-field>
  <label slot="label" for="fruit">Choose your favorite fruit</label>
  <input id="fruit" />
</m3e-form-field>
<m3e-autocomplete for="fruit">
  <m3e-option>Apples</m3e-option>
  <m3e-option>Oranges</m3e-option>
  <m3e-option>Bananas</m3e-option>
  <m3e-option>Grapes</m3e-option>
</m3e-autocomplete>
```

Use `filter` and `case-sensitive` for a case-sensitive prefix match. Supply options as in the basic example.

```html
<m3e-form-field>
  <label slot="label" for="fruit">Choose your favorite fruit</label>
  <input id="fruit" value="Apple" />
</m3e-form-field>
<m3e-autocomplete for="fruit" filter="starts-with" case-sensitive>
  <!-- Options omitted for brevity -->
</m3e-autocomplete>
```

Set the `filter` property for custom matching. Supply options as in the basic example. Load the script before `DOMContentLoaded`.

```html
<m3e-form-field>
  <label slot="label" for="fruit">Choose your favorite fruit</label>
  <input id="fruit" value="Apple" />
</m3e-form-field>
<m3e-autocomplete class="custom-filter" for="fruit">
  <!-- Options omitted for brevity -->
</m3e-autocomplete>
```

```js
window.addEventListener("DOMContentLoaded", () => {
  for (const autocomplete of document.querySelectorAll("m3e-autocomplete.custom-filter")) {
    autocomplete.filter = (option, term) =>
      option.value.toLocaleLowerCase().startsWith(term.toLocaleLowerCase());
  }
});
```

Use `no-data-label` to set the empty-state text. Supply options as in the basic example.

```html
<m3e-form-field>
  <label slot="label" for="fruit">Choose your favorite fruit</label>
  <input id="fruit" value="Pear" />
</m3e-form-field>
<m3e-autocomplete for="fruit" no-data-label="No data">
  <!-- Options omitted for brevity -->
</m3e-autocomplete>
```

Load initial options when the input is focused. Define `usStates` and run the listener after the markup is available.

```html
<m3e-form-field>
  <label slot="label" for="state">State</label>
  <input id="state" />
</m3e-form-field>
<m3e-autocomplete for="state" class="lazy">
  <m3e-loading-indicator slot="loading"></m3e-loading-indicator>
</m3e-autocomplete>
```

```js
const lazy = document.querySelector("m3e-autocomplete.lazy");
lazy.addEventListener("query", () => {
  if (!lazy.querySelector("m3e-option")) {
    lazy.loading = true;
    setTimeout(() => {
      usStates.forEach((state) => {
        const option = document.createElement("m3e-option");
        option.innerText = state;
        lazy.appendChild(option);
      });
      lazy.loading = false;
    }, 2000);
  }
});
```

Search as the user types with debouncing and cancellation. Define `usStates` and run the listener after the markup is available.

```html
<m3e-form-field>
  <label slot="label" for="state">State</label>
  <input id="state" />
</m3e-form-field>
<m3e-autocomplete for="state" filter="none" class="search">
  <m3e-loading-indicator slot="loading"></m3e-loading-indicator>
</m3e-autocomplete>
```

```js
const search = document.querySelector("m3e-autocomplete.search");

let debounceTimer = -1;
let activeRequest = null;

search.addEventListener("query", (e) => {
  const term = e.detail.term?.trim().toLowerCase();

  // User is typing → reset debounce, but do NOT show loading yet
  clearTimeout(debounceTimer);

  // If user cleared the field
  if (!term) {
    // Cancel any in‑flight request
    if (activeRequest) activeRequest.abort();

    // Reset UI
    search.querySelectorAll("m3e-option").forEach((x) => x.remove());
    search.hideNoData = true;
    search.loading = false;
    return;
  }

  // Now a real search is happening → show loading
  search.loading = true;
  search.hideNoData = false;

  // If a request is already loading, keep showing loading
  // but cancel the old request
  if (activeRequest) activeRequest.abort();

  // Start debounce
  debounceTimer = setTimeout(() => {
    // Clear old results (so we don't show stale data)
    search.querySelectorAll("m3e-option").forEach((x) => x.remove());

    // Create a cancellable "request"
    const controller = new AbortController();
    activeRequest = controller;

    // Simulate async search
    setTimeout(() => {
      // If canceled, do nothing
      if (controller.signal.aborted) return;

      // Populate results
      usStates
        .filter((x) => x.toLowerCase().includes(term))
        .forEach((state) => {
          const option = document.createElement("m3e-option");
          option.innerText = state;
          search.appendChild(option);
        });

      search.loading = false;

      activeRequest = null;
    }, 2000);
  }, 300); // debounce delay
});
```

Use `required` to require an option selection. Supply options as in the basic example.

```html
<m3e-form-field>
  <label slot="label" for="fruit">Choose your favorite fruit</label>
  <input id="fruit" value="Apple" />
</m3e-form-field>
<m3e-autocomplete for="fruit" required>
  <!-- Options omitted for brevity -->
</m3e-autocomplete>
```

Use `auto-activate` to activate the first option. Supply options as in the basic example.

```html
<m3e-form-field>
  <label slot="label" for="fruit">Choose your favorite fruit</label>
  <input id="fruit" />
</m3e-form-field>
<m3e-autocomplete for="fruit" auto-activate>
  <!-- Options omitted for brevity -->
</m3e-autocomplete>
```

Pair autocomplete with an input chip set. Supply options as in the basic example.

```html
<m3e-form-field>
  <label slot="label" for="fruit">Choose your favorite fruits</label>
  <m3e-input-chip-set aria-label="Enter favorite fruits">
    <input id="fruit" slot="input" placeholder="Add fruit..." />
  </m3e-input-chip-set>
</m3e-form-field>
<m3e-autocomplete for="fruit">
  <!-- Options omitted for brevity -->
</m3e-autocomplete>
```

Apply density to the form field and panel using `panel-class`. Supply options as in the basic example. The showcase omits additional density classes.

```html
<m3e-form-field class="density-3">
  <label slot="label" for="fld">Density -3</label>
  <input id="fld" />
</m3e-form-field>
<m3e-autocomplete for="fld" panel-class="density-3">
  <!-- Options omitted for brevity -->
</m3e-autocomplete>
<!-- Additional fields omitted for brevity -->
```

```css
.density-3 {
  --md-sys-density-scale: -3;
}
```

## 📖 API Reference

This section details the attributes and slots available for the `m3e-autocomplete` component.

### ⚙️ Attributes

| Attribute                  | Type                                                   | Default      | Description                                                                    |
| -------------------------- | ------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------ |
| `auto-activate`            | `boolean`                                              | `false`      | Whether the first option should be automatically activated.                    |
| `case-sensitive`           | `boolean`                                              | `false`      | Whether filtering is case sensitive.                                           |
| `filter`                   | `"contains" \| "starts-with" \| "ends-with" \| "none"` | `"contains"` | Mode in which to filter options.                                               |
| `hide-selection-indicator` | `boolean`                                              | `false`      | Whether to hide the selection indicator for options.                           |
| `hide-loading`             | `boolean`                                              | `false`      | Whether to hide the menu while options are loading.                            |
| `hide-no-data`             | `boolean`                                              | `false`      | Whether to hide the menu when there are no options to display.                 |
| `loading`                  | `boolean`                                              | `false`      | Whether options are currently being loaded.                                    |
| `loading-label`            | `string`                                               | `Loading...` | The text announced and displayed while loading options.                        |
| `no-data-label`            | `string`                                               | `No options` | The text announced and displayed when no options match the current term.       |
| `panel-class`              | `string`                                               |              | Class or list of classes to be applied to the autocomplete's overlay panel.    |
| `required`                 | `boolean`                                              | `false`      | Whether the user must make a selection when interacting with the autocomplete. |
| `results-label`            | `string`                                               |              | The text announced when the available options change for the current term.     |

### 🔧 Properties

| Property       | Type                                                                                                            | Default                          | Description                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------- |
| `filter`       | `"contains" \| "starts-with" \| "ends-with" \| "none" \| ((option: M3eOptionElement, term: string) => boolean)` | `"contains"`                     | Mode in which to filter options.                                           |
| `resultsLabel` | `Function`                                                                                                      | ``(count) => `${count} options`` | The text announced when the available options change for the current term. |

### 🧩 Slots

| Slot        | Description                                        |
| ----------- | -------------------------------------------------- |
| _(default)_ | Renders the options available.                     |
| `loading`   | Renders content when loading options.              |
| `no-data`   | Renders content when there are no options to show. |

### 🔥 Events

| Event    | Description                                                                                   |
| -------- | --------------------------------------------------------------------------------------------- |
| `toggle` | Dispatched when the options menu opens or closes.                                             |
| `query`  | Dispatched when the input is focused or when the user modifies its value.                     |
| `change` | Dispatched when the committed value changes due to selecting an option or clearing the input. |
