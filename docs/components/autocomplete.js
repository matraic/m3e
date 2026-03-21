window.addEventListener("DOMContentLoaded", () => {
  for (const autocomplete of document.querySelectorAll("m3e-autocomplete.custom-filter")) {
    autocomplete.filter = (option, term) => option.value.toLocaleLowerCase().startsWith(term.toLocaleLowerCase());
  }

  const usStates = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

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
});

function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
