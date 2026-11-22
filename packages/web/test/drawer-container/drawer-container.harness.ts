import type { Page } from "@playwright/test";

export class DrawerContainerHarness {
  attributes = "";
  containerStyle = "";
  startStyle = "";
  toggleSide?: "start" | "end";
  focusable = false;
  endFocusable = false;
  secondContainer = false;
  direction?: "ltr" | "rtl";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string, direction?: "ltr" | "rtl") => Promise<void>,
  ) {}

  get container() {
    return this.page.locator("#drawer-container");
  }
  get start() {
    return this.page.locator("#navigation");
  }
  get end() {
    return this.page.locator("#details");
  }
  get toggle() {
    return this.page.locator("#drawer-trigger");
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    const target = this.toggleSide === "end" ? "details" : "navigation";
    await this.renderFixture(
      `
      <m3e-button id="drawer-trigger" toggle>Menu${this.toggleSide ? `<m3e-drawer-toggle for="${target}"></m3e-drawer-toggle>` : ""}</m3e-button>
      <m3e-button id="drawer-other-trigger" toggle>Other menu</m3e-button>
      <m3e-drawer-container id="drawer-container" ${this.attributes} style="height: 200px; ${this.containerStyle}">
        <nav slot="start" id="navigation" aria-label="Primary navigation" style="${this.startStyle}">Start navigation${this.focusable ? '<button id="drawer-first">First</button><button id="drawer-last">Last</button>' : ""}</nav>
        <main><button id="drawer-main">Main content</button></main>
        <aside slot="end" id="details">End details${this.endFocusable ? '<button id="end-first">First</button><button id="end-last">Last</button>' : ""}</aside>
      </m3e-drawer-container>
      ${
        this.secondContainer
          ? `
        <m3e-drawer-container id="other-container" start-mode="over" style="height: 200px">
          <nav slot="start" id="other-navigation">Other navigation</nav>
          <main>Other main content</main>
        </m3e-drawer-container>
      `
          : ""
      }
    `,
      this.direction,
    );
    await this.page.addStyleTag({ content: "body { margin: 0; }" });
    if (this.toggleSide) {
      await this.page.waitForFunction(
        (id) => document.querySelector("#drawer-trigger")?.getAttribute("aria-controls") === id,
        target,
      );
    }
  }

  observeChanges() {
    return this.container.evaluate((container) => {
      container.setAttribute("data-changes", "0");
      document.addEventListener("change", (event) => {
        if (event.target === container) {
          container.setAttribute("data-changes", String(Number(container.getAttribute("data-changes")) + 1));
        }
      });
    });
  }

  async accessibility(selector: string) {
    const session = await this.page.context().newCDPSession(this.page);
    try {
      const { root } = await session.send("DOM.getDocument");
      const { nodeId } = await session.send("DOM.querySelector", { nodeId: root.nodeId, selector });
      if (!nodeId) throw new Error(`Missing drawer element: ${selector}`);
      const { nodes } = await session.send("Accessibility.getPartialAXTree", { nodeId, fetchRelatives: false });
      const node = nodes[0];
      if (!node) throw new Error(`Missing accessibility node: ${selector}`);
      return { ignored: node.ignored, role: node.role?.value, name: node.name?.value };
    } finally {
      await session.detach();
    }
  }

  borders() {
    return this.container.evaluate((element) => {
      const start = element.shadowRoot?.querySelector<HTMLElement>(".start");
      const end = element.shadowRoot?.querySelector<HTMLElement>(".end");
      if (!start || !end) throw new Error("Drawer sides are missing.");
      const startStyle = getComputedStyle(start);
      const endStyle = getComputedStyle(end);
      return {
        start:
          parseFloat(startStyle.borderInlineEndWidth) > 0 && startStyle.borderInlineEndColor !== "rgba(0, 0, 0, 0)",
        end: parseFloat(endStyle.borderInlineStartWidth) > 0 && endStyle.borderInlineStartColor !== "rgba(0, 0, 0, 0)",
      };
    });
  }
}
