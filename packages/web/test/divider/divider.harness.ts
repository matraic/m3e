import type { Locator, Page } from "@playwright/test";

export class DividerHarness {
  html = "";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get divider() {
    return this.page.locator("m3e-divider");
  }

  render() {
    return this.renderFixture(this.html);
  }

  async accessibility() {
    const session = await this.page.context().newCDPSession(this.page);
    try {
      const { root } = await session.send("DOM.getDocument");
      const { nodeId } = await session.send("DOM.querySelector", { nodeId: root.nodeId, selector: "m3e-divider" });
      if (!nodeId) throw new Error("Divider is missing from the DOM.");
      const { nodes } = await session.send("Accessibility.getPartialAXTree", { nodeId, fetchRelatives: false });
      const node = nodes[0];
      if (!node) throw new Error("Divider is missing from the accessibility tree.");
      return {
        ignored: node.ignored,
        role: node.role?.value,
        orientation: node.properties?.find((property) => property.name === "orientation")?.value.value,
      };
    } finally {
      await session.detach();
    }
  }

  insets(divider: Locator = this.divider) {
    return divider.evaluate((element) => {
      const line = element.shadowRoot?.querySelector(".line");
      if (!line) throw new Error("Divider line is missing.");
      const hostBounds = element.getBoundingClientRect();
      const lineBounds = line.getBoundingClientRect();
      return {
        left: lineBounds.left - hostBounds.left,
        right: hostBounds.right - lineBounds.right,
        top: lineBounds.top - hostBounds.top,
        bottom: hostBounds.bottom - lineBounds.bottom,
      };
    });
  }
}
