import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

interface Described {
  name: string;
  description?: string;
}

interface Typed extends Described {
  type?: { text: string };
  default?: string;
  deprecated?: boolean | string;
}

interface RawMember extends Typed {
  kind: "field" | "method";
  privacy?: "public" | "private" | "protected";
  static?: boolean;
  readonly?: boolean;
  attribute?: string;
  parameters?: Typed[];
  return?: { type?: { text: string }; description?: string };
}

interface RawDeclaration extends Described {
  kind: string;
  tagName?: string;
  customElement?: boolean;
  remarks?: string;
  examples?: string[];
  attributes?: Typed[];
  members?: RawMember[];
  slots?: Described[];
  events?: Typed[];
  cssParts?: Described[];
  cssProperties?: Typed[];
  cssStates?: Described[];
}

interface RawManifest {
  modules: { path: string; declarations?: RawDeclaration[] }[];
}

export interface Component {
  tagName: string;
  className: string;
  description: string;
  remarks: string;
  examples: string[];
  /** Folder under `src/`, which is the subpath of the `@m3e/web` and `@m3e/react` entry points. */
  entryPoint: string;
  attributes: Typed[];
  properties: RawMember[];
  methods: RawMember[];
  slots: Described[];
  events: Typed[];
  cssParts: Described[];
  cssProperties: Typed[];
  cssStates: Described[];
}

const toPascal = (value: string) =>
  value
    .split(/[-:_]/)
    .filter(Boolean)
    .map((x) => x[0].toUpperCase() + x.slice(1))
    .join("");

export const reactName = (tagName: string) => toPascal(tagName);
export const reactEventProp = (eventName: string) => `on${toPascal(eventName.replace(/^before(?=[a-z])/, "before-"))}`;

const isPublic = (m: RawMember) => m.privacy !== "private" && m.privacy !== "protected" && !m.name.startsWith("_");

export function parseManifest(manifest: RawManifest): Component[] {
  const components: Component[] = [];
  for (const module of manifest.modules) {
    for (const d of module.declarations ?? []) {
      if (!d.customElement || !d.tagName) continue;
      const members = (d.members ?? []).filter(isPublic);
      components.push({
        tagName: d.tagName,
        className: d.name,
        description: d.description ?? "",
        remarks: d.remarks ?? "",
        examples: d.examples ?? [],
        entryPoint: module.path.split("/")[1] ?? "",
        attributes: d.attributes ?? [],
        properties: members.filter((m) => m.kind === "field" && !m.static),
        methods: members.filter((m) => m.kind === "method" && !m.static),
        slots: d.slots ?? [],
        events: d.events ?? [],
        cssParts: d.cssParts ?? [],
        cssProperties: d.cssProperties ?? [],
        cssStates: d.cssStates ?? [],
      });
    }
  }
  return components.sort((a, b) => a.tagName.localeCompare(b.tagName));
}

export function loadManifest(): Component[] {
  return parseManifest(JSON.parse(readFileSync(resolveWebManifest(), "utf8")) as RawManifest);
}

function resolveWebManifest(): string {
  const require = createRequire(import.meta.url);
  try {
    return require.resolve("@m3e/web/custom-elements.json");
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "ERR_PACKAGE_PATH_NOT_EXPORTED") {
      throw error;
    }
    // Some @m3e/web releases ship the manifest beside the "all" entry point without exporting it.
    return resolve(dirname(require.resolve("@m3e/web/all")), "custom-elements.json");
  }
}

export class Catalog {
  constructor(readonly components: Component[]) {}

  get(tagName: string): Component | undefined {
    const key = tagName.trim().toLowerCase();
    return this.components.find((c) => c.tagName === key || c.tagName === `m3e-${key}` || c.className.toLowerCase() === key);
  }

  search(query: string, limit = 10): Component[] {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return this.components
      .map((c) => {
        const name = `${c.tagName} ${c.className}`.toLowerCase();
        const body = [
          c.description,
          c.remarks,
          ...c.attributes.map((x) => `${x.name} ${x.description ?? ""}`),
          ...c.slots.map((x) => `${x.name} ${x.description ?? ""}`),
          ...c.events.map((x) => `${x.name} ${x.description ?? ""}`),
        ]
          .join(" ")
          .toLowerCase();
        let score = 0;
        for (const t of terms) {
          if (name.includes(t)) score += 10;
          if (body.includes(t)) score += 1;
        }
        return { c, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.c.tagName.localeCompare(b.c.tagName))
      .slice(0, limit)
      .map((x) => x.c);
  }

  /** CSS custom properties across all components, optionally filtered by a substring of name/description. */
  cssProperties(filter?: string, component?: string) {
    const f = filter?.toLowerCase();
    const out: { component: string; name: string; description: string }[] = [];
    for (const c of this.components) {
      if (component && c.tagName !== component) continue;
      for (const p of c.cssProperties) {
        if (f && !`${p.name} ${p.description ?? ""}`.toLowerCase().includes(f)) continue;
        out.push({ component: c.tagName, name: p.name, description: p.description ?? "" });
      }
    }
    return out;
  }
}
