document.addEventListener("DOMContentLoaded", () => {
  const shapeNames = [
    "4-leaf-clover",
    "4-sided-cookie",
    "6-sided-cookie",
    "7-sided-cookie",
    "8-leaf-clover",
    "9-sided-cookie",
    "12-sided-cookie",
    "arch",
    "arrow",
    "boom",
    "bun",
    "burst",
    "circle",
    "diamond",
    "fan",
    "flower",
    "gem",
    "ghost-ish",
    "heart",
    "hexagon",
    "oval",
    "pentagon",
    "pill",
    "pixel-circle",
    "pixel-triangle",
    "puffy",
    "puffy-diamond",
    "semicircle",
    "slanted",
    "soft-boom",
    "soft-burst",
    "square",
    "sunny",
    "triangle",
    "very-sunny",
  ];

  const shapeEl = document.querySelector("#morph");
  let index = 0;

  function updateShape() {
    shapeEl.setAttribute("name", shapeNames[index]);
    index = (index + 1) % shapeNames.length;
  }

  updateShape();
  setInterval(updateShape, 1000);
});
