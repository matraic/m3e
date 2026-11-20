import type { Page } from "@playwright/test";

export class AvatarHarness {
  private content = "";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get avatar() {
    return this.page.locator("m3e-avatar");
  }

  graphic(name: string) {
    return this.avatar.getByRole("img", { name });
  }

  prepareInitials() {
    this.content = "<m3e-avatar>AB</m3e-avatar>";
  }

  prepareImage() {
    this.content = `
      <m3e-avatar>
        <img alt="Alex Morgan" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
      </m3e-avatar>
    `;
  }

  prepareIcon() {
    this.content = '<m3e-avatar><m3e-icon name="person" aria-label="Person"></m3e-icon></m3e-avatar>';
  }

  render() {
    return this.renderFixture(this.content);
  }
}
