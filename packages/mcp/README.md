# @m3e/mcp

The `@m3e/mcp` package provides an [MCP](https://modelcontextprotocol.io/) server that gives AI assistants access to the M3E Web Components catalog.

## Install

Requires Node.js 22 or later.

```sh
npm install @m3e/mcp
```

## Configure an MCP client

### Standard I/O (stdio)

The default transport is stdio. For example, add this server to `.mcp.json` in your workspace root:

```json
{
  "mcpServers": {
    "m3e": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@m3e/mcp"]
    }
  }
}
```

In VS Code, the guided setup offers workspace-root configuration when the experimental `chat.mcp.workspaceRootConfig.enabled` setting is enabled. Alternatively, add the same configuration to `$COPILOT_HOME/mcp-config.json` (or `~/.copilot/mcp-config.json` when `COPILOT_HOME` is unset) for use across workspaces.

The legacy VS Code format uses `.vscode/mcp.json` with a top-level `servers` object instead; it remains available for compatibility. See the [VS Code MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration) for format and capability differences.

The server can also be started directly:

```sh
npx -y @m3e/mcp
```

### Streamable HTTP

Start the server in a terminal:

```sh
npx -y @m3e/mcp --http
```

It listens at `http://127.0.0.1:3333/mcp` by default. Configure an MCP client to connect to that URL. A portable workspace-root `.mcp.json` entry can be:

```json
{
  "mcpServers": {
    "m3e": {
      "type": "http",
      "url": "http://127.0.0.1:3333/mcp"
    }
  }
}
```

The HTTP transport is stateless and has no authentication. The default host is loopback (`127.0.0.1`); only bind it to a network interface you trust.

## Tools

| Tool                  | Purpose                                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list_components`     | List all custom elements and short descriptions.                                                                                                                          |
| `get_component`       | Get a component's description, detailed remarks, attributes, properties, methods, slots, events, CSS parts, CSS states, and CSS custom properties. Accepts a tag name with or without the `m3e-` prefix. |
| `search_components`   | Search component names, descriptions, attributes, slots, and events.                                                                                                      |
| `get_usage_example`   | Get the component's usage examples.                                                                                                                                       |
| `get_react_wrapper`   | Get the corresponding `@m3e/react` import, wrapper name, and event prop names.                                                                                            |
| `list_css_properties` | List CSS custom properties across components, optionally filtering by component or keyword.                                                                               |

Unknown component names return suggestions when similar components are found. These tools provide catalog information and snippets; they do not execute or modify the user's project.

## CLI options

```text
m3e-mcp [--http] [--port 3333] [--host 127.0.0.1]
```

| Option             | Description                                     |
| ------------------ | ----------------------------------------------- |
| `--http`           | Use stateless Streamable HTTP instead of stdio. |
| `--port <number>`  | HTTP listening port. Default: `3333`.           |
| `--host <address>` | HTTP listening address. Default: `127.0.0.1`.   |
| `--help`           | Show usage.                                     |
