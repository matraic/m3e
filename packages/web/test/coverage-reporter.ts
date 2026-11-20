import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, readFile, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import type { Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { CoverageReport } from "monocart-coverage-reports";

import { bundle, coverageAttachment, type CoverageFunctions } from "./coverage-data";

export default class BrowserCoverageReporter implements Reporter {
  private readonly data = new Map<string, CoverageFunctions[]>();

  onTestEnd(test: TestCase, result: TestResult) {
    const component = this.#componentForTest(test);

    for (const attachment of result.attachments) {
      if (attachment.name === coverageAttachment && attachment.body) {
        const functions: CoverageFunctions = JSON.parse(attachment.body.toString("utf8"));
        if (!component) continue;

        const componentData = this.data.get(component) ?? [];
        componentData.push(functions);
        this.data.set(component, componentData);
      }
    }
  }

  async onEnd(): Promise<{ status: "failed" } | void> {
    if (!this.data.size) {
      console.error("No browser coverage collected. Run tests that use the web component render fixture.");
      return { status: "failed" };
    }

    const [source, map] = await Promise.all([
      readFile(bundle, "utf8"),
      readFile(new URL(`${bundle.href}.map`), "utf8"),
    ]);
    const sourceMap = JSON.parse(map);
    for (const [component, data] of this.data) {
      const report = new CoverageReport({
        name: `M3E ${component} Coverage`,
        outputDir: fileURLToPath(new URL(`../coverage/components/${component}/`, import.meta.url)),
        sourceFilter: `src/${component}/**/*.ts`,
        reports: ["html", "lcovonly", "text-summary", ["raw", { merge: true }]],
      });
      await report.add(data.map((functions) => ({ url: bundle.href, functions, source, sourceMap })));
      if (!(await report.generate())?.files.length) {
        console.error(`Browser coverage for ${component} could not be mapped to TypeScript sources.`);
        return { status: "failed" };
      }
    }

    const componentsDirectory = new URL("../coverage/components/", import.meta.url);
    const componentEntries = await readdir(componentsDirectory, { withFileTypes: true });
    const rawDirectories = componentEntries
      .filter((entry) => entry.isDirectory() && /^[a-z0-9][a-z0-9-]*$/i.test(entry.name))
      .map((entry) => new URL(`../coverage/components/${entry.name}/raw/`, import.meta.url))
      .filter(existsSync);
    const sourcesDirectory = new URL("../coverage/components/sources/", import.meta.url);
    await mkdir(sourcesDirectory, { recursive: true });
    for (const rawDirectory of rawDirectories) {
      for (const file of (await readdir(rawDirectory)).filter((name) => name.startsWith("source-"))) {
        const source = new URL(file, rawDirectory);
        const sharedSource = new URL(file, sourcesDirectory);
        if (!existsSync(sharedSource)) await copyFile(source, sharedSource);
        await unlink(source);
      }
    }
    const inputDirs = [fileURLToPath(sourcesDirectory), ...rawDirectories.map((directory) => fileURLToPath(directory))];
    const report = new CoverageReport({
      name: "M3E Web Coverage",
      outputDir: fileURLToPath(new URL("../coverage/", import.meta.url)),
      inputDir: inputDirs,
      sourceFilter: "src/**/*.ts",
      reports: ["html", "lcovonly", "text-summary"],
      clean: false,
    });
    if (!(await report.generate())?.files.length) {
      console.error("Browser coverage could not be mapped to the web package TypeScript sources.");
      return { status: "failed" };
    }
  }

  #componentForTest(test: TestCase): string | undefined {
    const file = test.location.file.replace(/\\/g, "/");
    const testDirectory = file.lastIndexOf("/test/");
    if (testDirectory === -1) return undefined;

    const relativePath = file.slice(testDirectory + "/test/".length);
    const component = relativePath.split("/")[0].replace(/\.spec\.[^.]+$/, "");
    return /^[a-z0-9][a-z0-9-]*$/i.test(component) ? component : undefined;
  }
}
