window.addEventListener("DOMContentLoaded", () => {
  const frame = document.querySelector("#content-frame");
  frame.addEventListener("load", () => {
    const currentUrl = frame.contentWindow?.location.href.substring(document.baseURI.length);
    history.replaceState({}, "", "#/" + currentUrl);

    const menuItem = document.querySelector(`a[href='${currentUrl}']`)?.closest("m3e-nav-menu-item");
    if (menuItem) {
      menuItem.selected = true;
    }
  });

  frame.src = location.hash ? location.hash.substring(2) : "getting-started/overview.html";
});
