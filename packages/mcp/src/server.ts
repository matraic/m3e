import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Catalog, Component, reactEventProp, reactName } from "./manifest.js";

const reply = (text: string, isError = false) => ({
  content: [{ type: "text" as const, text }],
  ...(isError ? { isError } : {}),
});

const oneLine = (s?: string) => (s ?? "").replace(/\s+/g, " ").trim();

function notFound(catalog: Catalog, name: string) {
  const hints = catalog.search(name, 5).map((c) => c.tagName);
  return reply(
    `Unknown component "${name}".${hints.length ? ` Did you mean: ${hints.join(", ")}?` : ""} Use list_components to see all.`,
    true,
  );
}

function section(title: string, rows: string[]) {
  return rows.length ? `\n## ${title}\n${rows.join("\n")}\n` : "";
}

export function describe(c: Component): string {
  const attrs = c.attributes.map(
    (a) =>
      `- \`${a.name}\` (${a.type?.text ?? "unknown"}${a.default !== undefined ? `, default ${a.default}` : ""}): ${oneLine(a.description)}`,
  );
  const attrNames = new Set(c.attributes.map((a) => a.name));
  const props = c.properties
    .filter((p) => !attrNames.has(p.attribute ?? p.name))
    .map(
      (p) =>
        `- \`${p.name}\` (${p.type?.text ?? "unknown"}${p.readonly ? ", readonly" : ""}): ${oneLine(p.description)}`,
    );
  const methods = c.methods.map(
    (m) =>
      `- \`${m.name}(${(m.parameters ?? []).map((p) => `${p.name}: ${p.type?.text ?? "any"}`).join(", ")})\`: ${oneLine(m.description)}`,
  );
  const slots = c.slots.map((s) => `- \`${s.name || "(default)"}\`: ${oneLine(s.description)}`);
  const events = c.events.map((e) => `- \`${e.name}\` (${e.type?.text ?? "Event"}): ${oneLine(e.description)}`);
  const parts = c.cssParts.map((p) => `- \`${p.name}\`: ${oneLine(p.description)}`);
  const states = c.cssStates.map((p) => `- \`${p.name}\`: ${oneLine(p.description)}`);
  const vars = c.cssProperties.map((p) => `- \`${p.name}\`: ${oneLine(p.description)}`);

  return (
    `# <${c.tagName}> (${c.className})\n${c.description}\n` +
    (c.remarks ? `\n${c.remarks}\n` : "") +
    `\nImport: \`import "@m3e/web/${c.entryPoint}";\`\n` +
    section("Attributes", attrs) +
    section("Other properties", props) +
    section("Methods", methods) +
    section("Slots", slots) +
    section("Events", events) +
    section("CSS parts", parts) +
    section("CSS states", states) +
    section("CSS custom properties", vars)
  );
}

function usage(c: Component): string {
  return c.examples.length
    ? c.examples.map((example, i) => `## Example ${i + 1}\n\n${example}`).join("\n\n")
    : `No usage examples are documented for <${c.tagName}>. See get_component for its API.`;
}

function reactUsage(c: Component): string {
  const name = reactName(c.tagName);
  const handlers = c.events.map((e) => `${reactEventProp(e.name)}`);
  return [
    "```tsx",
    `import { ${name} } from "@m3e/react/${c.entryPoint}";`,
    "",
    `<${name}>Content</${name}>`,
    "```",
    `Event props (derived from the element's events): ${handlers.length ? handlers.map((h) => `\`${h}\``).join(", ") : "none"}.`,
    "Properties map to React props by camelCase property name; the ref is forwarded to the element.",
  ].join("\n");
}

export function createServer(catalog: Catalog): McpServer {
  const server = new McpServer({ name: "m3e", version: "2.12.0" });
  const readOnly = { readOnlyHint: true, openWorldHint: false };

  server.registerTool(
    "list_components",
    {
      title: "List M3E components",
      description: "Lists every M3E custom element with a one-line description.",
      annotations: readOnly,
    },
    async () => reply(catalog.components.map((c) => `- ${c.tagName}: ${oneLine(c.description)}`).join("\n")),
  );

  server.registerTool(
    "get_component",
    {
      title: "Get component API",
      description:
        "Returns the API of an M3E component: attributes, properties, methods, slots, events, CSS parts, states and custom properties.",
      inputSchema: { name: z.string().describe('Tag name, e.g. "m3e-button" (the "m3e-" prefix is optional)') },
      annotations: readOnly,
    },
    async ({ name }) => {
      const c = catalog.get(name);
      return c ? reply(describe(c)) : notFound(catalog, name);
    },
  );

  server.registerTool(
    "search_components",
    {
      title: "Search components",
      description: "Searches component names, descriptions, attributes, slots and events for the given keywords.",
      inputSchema: {
        query: z.string().min(1),
        limit: z.number().int().min(1).max(50).optional().describe("Maximum results (default 10)"),
      },
      annotations: readOnly,
    },
    async ({ query, limit }) => {
      const found = catalog.search(query, limit ?? 10);
      return reply(
        found.length ? found.map((c) => `- ${c.tagName}: ${oneLine(c.description)}`).join("\n") : "No matches.",
      );
    },
  );

  server.registerTool(
    "get_usage_example",
    {
      title: "Get usage example",
      description: "Returns the component's documented examples from the Custom Elements Manifest.",
      inputSchema: { name: z.string() },
      annotations: readOnly,
    },
    async ({ name }) => {
      const c = catalog.get(name);
      return c ? reply(usage(c)) : notFound(catalog, name);
    },
  );

  server.registerTool(
    "get_react_wrapper",
    {
      title: "Get React wrapper info",
      description: "Returns the @m3e/react import, component name and event props for a component.",
      inputSchema: { name: z.string() },
      annotations: readOnly,
    },
    async ({ name }) => {
      const c = catalog.get(name);
      return c ? reply(reactUsage(c)) : notFound(catalog, name);
    },
  );

  server.registerTool(
    "list_css_properties",
    {
      title: "List design tokens / CSS custom properties",
      description:
        "Lists CSS custom properties used to theme components, optionally filtered by component and/or keyword.",
      inputSchema: {
        component: z.string().optional().describe("Restrict to one component, e.g. m3e-button"),
        filter: z.string().optional().describe("Case-insensitive substring matched against name and description"),
      },
      annotations: readOnly,
    },
    async ({ component, filter }) => {
      const tag = component ? catalog.get(component)?.tagName : undefined;
      if (component && !tag) return notFound(catalog, component);
      const rows = catalog.cssProperties(filter, tag);
      if (!rows.length) return reply("No matching CSS custom properties.");
      const cap = 200;
      const text = rows.slice(0, cap).map((r) => `- ${r.component} \`${r.name}\`: ${oneLine(r.description)}`);
      if (rows.length > cap) text.push(`… ${rows.length - cap} more; narrow with component or filter.`);
      return reply(text.join("\n"));
    },
  );

  return server;
}
