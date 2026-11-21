import { mergeTests } from "@playwright/test";
import { test as bddTest } from "playwright-bdd";

import { test as componentTest } from "../fixtures";
import { ChipsHarness } from "./chips.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ chips: ChipsHarness }>({
  chips: async ({ page, render }, use) => use(new ChipsHarness(page, render)),
});
