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

  // Only allow "[segment/]*file.html" paths, no suspicious characters
  const allowedPathRegex = /^([a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.html$/;
  const requestedPath = location.hash ? location.hash.substring(2) : "";
  frame.src = allowedPathRegex.test(requestedPath) ? requestedPath : "getting-started/overview.html";
});
