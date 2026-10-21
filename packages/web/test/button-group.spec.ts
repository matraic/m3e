import { expect, test } from "./fixtures";

test.describe("m3e-button-group", () => {
  test("exposes a group containing its buttons", async ({ page, render }) => {
    await render(`
      <m3e-button-group>
        <m3e-button>Save</m3e-button>
        <m3e-button>Cancel</m3e-button>
      </m3e-button-group>
    `);

    await expect(page.getByRole("group")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  test("makes toggle buttons exclusive radio options by default", async ({ page, render }) => {
    await render(`
      <m3e-button-group>
        <m3e-button toggle>Day</m3e-button>
        <m3e-button toggle>Week</m3e-button>
        <m3e-button toggle>Month</m3e-button>
      </m3e-button-group>
    `);

    const day = page.getByRole("radio", { name: "Day" });
    const week = page.getByRole("radio", { name: "Week" });
    const month = page.getByRole("radio", { name: "Month" });
    await expect(page.getByRole("radiogroup")).toBeVisible();

    await week.click();
    await expect(week).toHaveAttribute("selected", "");
    await expect(day).not.toHaveAttribute("selected");

    await month.click();
    await expect(month).toHaveAttribute("selected", "");
    await expect(week).not.toHaveAttribute("selected");
  });

  test("allows multiple toggle buttons to be selected when multi is set", async ({ page, render }) => {
    await render(`
      <m3e-button-group multi>
        <m3e-button toggle>Bold</m3e-button>
        <m3e-button toggle>Italic</m3e-button>
      </m3e-button-group>
    `);

    const group = page.getByRole("group");
    const bold = page.getByRole("button", { name: "Bold" });
    const italic = page.getByRole("button", { name: "Italic" });
    await expect(group).toBeVisible();

    await bold.click();
    await italic.click();

    await expect(bold).toHaveAttribute("aria-pressed", "true");
    await expect(italic).toHaveAttribute("aria-pressed", "true");
  });

  test("accepts the connected variant and supported sizes", async ({ page, render }) => {
    await render('<m3e-button-group variant="connected" size="large"><m3e-button>One</m3e-button></m3e-button-group>');

    const group = page.locator("m3e-button-group");
    await expect(group).toHaveAttribute("variant", "connected");
    await expect(group).toHaveAttribute("size", "large");
  });
});
