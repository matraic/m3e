import type { Page } from "@playwright/test";

export class FabHarness {
  html = "";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get fab() {
    return this.page.locator("#fab");
  }

  markup(attributes = "", content = "") {
    return `<m3e-fab id="fab" ${attributes}>${content}</m3e-fab>`;
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.renderFixture(`${this.html}<div id="fab-destination"></div><button id="after-fab">After</button>`);
  }

  observeClicks() {
    return this.fab.evaluate((fab) => {
      fab.setAttribute("data-clicks", "0");
      fab.addEventListener("click", () => {
        fab.setAttribute("data-clicks", String(Number(fab.getAttribute("data-clicks")) + 1));
      });
    });
  }

  observeSubmissions() {
    return this.page.locator("form").evaluateAll((forms) => {
      for (const form of forms) {
        if (!(form instanceof HTMLFormElement)) throw new Error("FAB form is not a form element.");
        form.setAttribute("data-submissions", "0");
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          form.setAttribute("data-submissions", String(Number(form.getAttribute("data-submissions")) + 1));
          form.setAttribute("data-values", JSON.stringify([...new FormData(form).entries()]));
        });
      }
    });
  }

  async iconAccessibility() {
    const session = await this.page.context().newCDPSession(this.page);
    try {
      const { root } = await session.send("DOM.getDocument");
      const { nodeId } = await session.send("DOM.querySelector", { nodeId: root.nodeId, selector: "#fab-icon" });
      if (!nodeId) throw new Error("FAB icon is missing.");
      const { nodes } = await session.send("Accessibility.getPartialAXTree", { nodeId, fetchRelatives: false });
      if (!nodes[0]) throw new Error("FAB icon accessibility node is missing.");
      return { ignored: nodes[0].ignored };
    } finally {
      await session.detach();
    }
  }

  shadow(selector: string) {
    return this.page.locator(selector).evaluate((element) => {
      const elevation = element.shadowRoot?.querySelector("m3e-elevation");
      if (!elevation) throw new Error("FAB elevation is missing.");
      const style = getComputedStyle(elevation);
      return style.getPropertyValue("--m3e-elevation-level") + style.boxShadow;
    });
  }
}
