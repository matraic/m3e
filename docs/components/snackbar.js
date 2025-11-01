document.addEventListener("DOMContentLoaded", () => {
  const example1 = document.querySelector("#example1");
  example1.addEventListener("click", () => {
    M3eSnackbar.open("File deleted");
  });

  const example2 = document.querySelector("#example2");
  example2.addEventListener("click", () => {
    M3eSnackbar.open("File deleted", "Undo", {
      actionCallback: () => {
        // Undo logic here
      },
    });
  });

  const example3 = document.querySelector("#example3");
  example3.addEventListener("click", () => {
    M3eSnackbar.open("File deleted", true);
  });
});
