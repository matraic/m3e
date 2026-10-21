import { expect, test } from "./fixtures";

test.describe("m3e-avatar", () => {
  test("renders slotted initials", async ({ page, render }) => {
    await render("<m3e-avatar>AB</m3e-avatar>");

    const avatar = page.locator("m3e-avatar");
    await expect(avatar).toBeVisible();
    await expect(page.getByText("AB", { exact: true })).toBeVisible();
  });

  test("renders a slotted image", async ({ page, render }) => {
    await render(`
      <m3e-avatar>
        <img alt="Alex Morgan" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
      </m3e-avatar>
    `);

    const avatar = page.locator("m3e-avatar");
    const image = avatar.getByRole("img", { name: "Alex Morgan" });
    await expect(avatar).toBeVisible();
    await expect(image).toBeVisible();
  });
});
