const standaloneGrid = document.querySelector(".carousel-grid-demo");
const hero = document.querySelector("#hero-default");
const heroCustomWidth = document.querySelector("#hero-custom-width");
const centeredHero = document.querySelector("#hero-centered-default");
const centeredHeroCustomWidth = document.querySelector("#hero-centered-custom-width");
const cloneItems = (source) =>
  source.items.map((item) => {
    const clone = item.cloneNode(true);

    for (const property of [...clone.style]) {
      if (property === "flex-basis" || property.startsWith("--_carousel-")) {
        clone.style.removeProperty(property);
      }
    }

    clone.removeAttribute("aria-colindex");
    clone.removeAttribute("aria-rowindex");

    return clone;
  });
await Promise.all([hero.updateComplete, centeredHero.updateComplete]);
standaloneGrid.append(...cloneItems(hero));
heroCustomWidth.append(...cloneItems(hero));
centeredHeroCustomWidth.append(...cloneItems(centeredHero));
