import { WebSocketClientTransport } from "@modelcontextprotocol/sdk/client/websocket.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import "dotenv/config";

/**
 * HIGHSTORY MCP BRIDGE
 * Connects Local Claude Desktop (Stdio) to Remote High Story Server (WS)
 */

const SSE_URL = process.env.HIGHSTORY_SSE_URL;
const TOKEN = process.env.HIGHSTORY_TOKEN;

async function main() {
  if (!SSE_URL || !TOKEN) {
    console.error("Error: HIGHSTORY_SSE_URL and HIGHSTORY_TOKEN environment variables must be set.");
    console.error("Usage: HIGHSTORY_SSE_URL=... HIGHSTORY_TOKEN=... highstory-mcp");
    process.exit(1);
  }

  try {
    // 1. Convert HTTP SSE URL to WebSocket URL if necessary
    let wsString = SSE_URL;
    if (wsString.startsWith('http')) {
        wsString = wsString.replace(/^http/i, 'ws').replace(/\/mcp\/sse\/?$/, '/mcp/ws');
    }
    
    const url = new URL(wsString);
    url.searchParams.set('token', TOKEN);
    
    console.error(`[High Story] Connecting to: ${url.origin}${url.pathname}`);
    const transport = new WebSocketClientTransport(url);

    // 2. Setup standard input/output transport for Claude Desktop
    const stdioTransport = new StdioServerTransport();

    // 3. Bridge logic: relay messages between local and remote
    stdioTransport.onmessage = (message) => {
        transport.send(message).catch(err => console.error("[High Story] Send error:", err));
    };

    transport.onmessage = (message) => {
        stdioTransport.send(message).catch(err => console.error("[High Story] Receive error:", err));
    };

    // 4. Start session
    await transport.start();
    console.error("[High Story] Cloud connection established");
    
    await stdioTransport.start();
    console.error("[High Story] MCP Bridge is active");

  } catch (error: any) {
    console.error("[High Story] Bridge Failure:", error.message);
    if (error.message && error.message.includes("401")) {
        console.error("AUTH ERROR: Invalid HIGHSTORY_TOKEN. Please check your credentials.");
    }
    process.exit(1);
  }
}

main();
