#!/usr/bin/env node
import { createServer as createHttpServer } from "node:http";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Catalog, loadManifest } from "./manifest.js";
import { createServer } from "./server.js";

const args = process.argv.slice(2);
const flag = (name: string) => {
  const i = args.indexOf(name);
  return i < 0 ? undefined : (args[i + 1] ?? "");
};

if (args.includes("--help")) {
  console.log("Usage: m3e-mcp [--http] [--port 3333] [--host 127.0.0.1]\nDefaults to stdio.");
  process.exit(0);
}

const catalog = new Catalog(loadManifest());

if (!args.includes("--http")) {
  await createServer(catalog).connect(new StdioServerTransport());
} else {
  const port = Number(flag("--port") ?? 3333);
  const host = flag("--host") ?? "127.0.0.1";

  const http = createHttpServer(async (req, res) => {
    if (!req.url?.startsWith("/mcp")) {
      res.writeHead(404).end();
      return;
    }
    if (req.method !== "POST") {
      res.writeHead(405, { Allow: "POST" }).end();
      return;
    }
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      const server = createServer(catalog);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
      res.on("close", () => {
        void transport.close();
        void server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch {
      if (!res.headersSent) res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32700, message: "Invalid request" }, id: null }));
    }
  });
  http.listen(port, host, () => console.error(`m3e-mcp listening on http://${host}:${port}/mcp`));
}
