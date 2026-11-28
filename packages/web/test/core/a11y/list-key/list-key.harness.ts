import { ListKeyManager } from "@m3e/web/core/a11y";

export class ListKeyHarness {
  readonly items = Array.from({ length: 25 }, (_, index) => ({ id: `${index}` }) as HTMLElement);
  readonly manager = new ListKeyManager<HTMLElement>().withPageUpAndDown();
  handled = false;

  press(index: number, key: string) {
    this.manager.setActiveItem(this.items[index]);
    const event = Object.assign(new Event("keydown", { cancelable: true }), { key }) as KeyboardEvent;
    this.manager.onKeyDown(event);
    this.handled = event.defaultPrevented;
  }
}
