import assert from "node:assert/strict";
import { copyFileSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { pathToFileURL } from "node:url";
import { Catalog, loadManifest } from "../src/index.js";
import { describe } from "../src/server.js";

const catalog = new Catalog(loadManifest());

test("loads components from the web package manifest", () => {
  assert.ok(catalog.components.length > 50);
  assert.ok(catalog.get("button"));
});

test("loads documented examples as formatted strings", () => {
  const examples = catalog.get("calendar")?.examples;
  assert.ok(examples && examples.length > 0);
  assert.ok(examples.every((example) => typeof example === "string"));
  assert.ok(examples.some((example) => /```html\r?\n<m3e-calendar/.test(example)));
});

test("exposes detailed descriptions without replacing the short description", () => {
  const calendar = catalog.get("calendar");
  assert.ok(calendar);
  assert.equal(calendar.description, "A calendar used to select a date.");
  assert.ok(calendar.remarks.startsWith("The `m3e-calendar` component"));
  assert.match(calendar.remarks, /Date string handling/);
  assert.match(calendar.remarks, /\r?\n\r?\nDate string handling/);
  assert.ok(describe(calendar).includes(calendar.remarks));
  assert.ok(catalog.search("Date string handling").some((component) => component.tagName === "m3e-calendar"));
  assert.ok(catalog.components.every((component) => typeof component.remarks === "string"));
});

test("exposes date input and datepicker parsing guidance and examples", () => {
  for (const [name, count] of [["date-input", 13], ["datepicker", 10]] as const) {
    const component = catalog.get(name);
    assert.ok(component);
    assert.match(component.remarks, /Date string handling/);
    assert.match(describe(component), /local date may differ/);
    assert.equal(component.examples.length, count);
    assert.ok(component.examples.every((example) => typeof example === "string" && /```(?:html|js)\r?\n/.test(example)));
  }
  const toggle = catalog.get("datepicker-toggle");
  assert.ok(toggle?.examples.some((example) => example.includes('<m3e-datepicker-toggle for="datepicker">')));
});

test("exposes showcase examples for the remaining modules and supporting elements", () => {
  const main = [
    "icon-button", "list", "action-list", "selection-list", "loading-indicator", "menu", "nav-bar",
    "nav-menu", "nav-rail", "paginator", "circular-progress-indicator", "linear-progress-indicator",
    "radio-group", "search-bar", "search-view", "segmented-button", "select", "shape", "skeleton",
    "slide-group", "slider", "snackbar", "split-button", "split-pane", "stepper", "swipe-reveal",
    "swipe-reveal-group", "switch", "tabs", "textarea-autosize", "theme", "timepicker", "toc",
    "toolbar", "tooltip", "rich-tooltip", "tree",
  ];
  for (const name of main) {
    assert.ok(catalog.get(name)?.examples.some((example) => example.startsWith("Showcase:")), name);
  }
  for (const name of [
    "option", "optgroup", "option-panel", "list-action", "list-option", "menu-item-group",
    "stepper-next", "stepper-previous", "stepper-reset", "timepicker-toggle", "timepicker-input",
    "timepicker-dial", "toc-item", "rich-tooltip-action", "tree-item",
  ]) {
    assert.ok(catalog.get(name)?.examples.length, name);
  }
  assert.ok(catalog.get("timepicker")?.examples.some((example) =>
    example.includes("toLocaleTimeString") && example.includes("</m3e-timepicker>"),
  ));
});

async function fixture(t: TestContext, exports: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), "m3e-mcp-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const web = join(root, "node_modules", "@m3e", "web");
  mkdirSync(join(web, "dist"), { recursive: true });
  writeFileSync(join(root, "package.json"), JSON.stringify({ type: "module" }));
  writeFileSync(join(web, "package.json"), JSON.stringify({ name: "@m3e/web", exports }));
  writeFileSync(join(web, "dist", "all.js"), "");
  const manifest = {
    modules: [
      {
        path: "src/button/Button.ts",
        declarations: [
          {
            kind: "class",
            name: "FixtureButton",
            customElement: true,
            tagName: "m3e-fixture",
            examples: ["```html\n<m3e-fixture>Example</m3e-fixture>\n```"],
          },
        ],
      },
    ],
  };
  writeFileSync(join(web, "dist", "custom-elements.json"), JSON.stringify(manifest));
  copyFileSync(new URL("../src/manifest.js", import.meta.url), join(root, "manifest.js"));
  const module: typeof import("../src/manifest.js") = await import(pathToFileURL(join(root, "manifest.js")).href);
  return module;
}

test("loads the explicitly exported web manifest", async (t) => {
  const module = await fixture(t, { "./custom-elements.json": "./dist/custom-elements.json" });
  assert.equal(module.loadManifest()[0].examples[0], "```html\n<m3e-fixture>Example</m3e-fixture>\n```");
  assert.equal(module.loadManifest()[0].remarks, "");
});

test("falls back to the manifest beside the all entry point when it is not exported", async (t) => {
  const module = await fixture(t, { "./all": "./dist/all.js" });
  assert.equal(module.loadManifest()[0].examples[0], "```html\n<m3e-fixture>Example</m3e-fixture>\n```");
});

test("search ranks name matches first", () => {
  assert.equal(catalog.search("button")[0].tagName.includes("button"), true);
});

test("css properties can be filtered by component", () => {
  const rows = catalog.cssProperties(undefined, "m3e-button");
  assert.ok(rows.length > 0 && rows.every((r) => r.component === "m3e-button"));
});
