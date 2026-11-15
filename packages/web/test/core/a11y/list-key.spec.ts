import { ListKeyManager } from "@m3e/web/core/a11y";
import { expect, test } from "@playwright/test";

test.describe("ListKeyManager page navigation", () => {
  for (const direction of ["ltr", "rtl"] as const) {
    test(`skips disabled items in the page direction in ${direction}`, () => {
      const items = Array.from({ length: 25 }, (_, index) => ({ id: `${index}` }) as HTMLElement);
      const manager = new ListKeyManager<HTMLElement>()
        .withDirectionality(direction)
        .withPageUpAndDown()
        .withSkipPredicate((item) => item === items[8] || item === items[13]);
      manager.setItems(items);

      const press = (key: string) => {
        const event = Object.assign(new Event("keydown", { cancelable: true }), { key }) as KeyboardEvent;
        manager.onKeyDown(event);
        expect(event.defaultPrevented).toBe(true);
      };

      manager.setActiveItem(items[18]);
      press("PageUp");
      expect(manager.activeItem).toBe(items[7]);

      manager.setActiveItem(items[3]);
      press("PageDown");
      expect(manager.activeItem).toBe(items[14]);

      manager.setActiveItem(items[3]);
      press("PageUp");
      expect(manager.activeItem).toBe(items[0]);

      manager.setActiveItem(items[23]);
      press("PageDown");
      expect(manager.activeItem).toBe(items[24]);
    });
  }
});
