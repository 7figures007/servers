# High Story MCP Server

This is the official [Model Context Protocol](https://modelcontextprotocol.io) server for High Story. It allows AI clients like Claude Desktop to execute social media campaigns, regenerate images, and manage your social content directly from the chat.

## Installation

```bash
npm install -g highstory-mcp
```

## Configuration

The server requires a connection to your High Story Cloud instance. You need two environment variables:

1. `HIGHSTORY_SSE_URL`: The URL of your Supabase Edge Function (e.g., `https://xxxx.supabase.co/functions/v1/highstory-mcp-server`)
2. `HIGHSTORY_TOKEN`: Your personal access token (Supabase JWT).

### Setup for Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "highstory": {
      "command": "npx",
      "args": ["-y", "highstory-mcp"],
      "env": {
        "HIGHSTORY_SSE_URL": "YOUR_SSE_URL",
        "HIGHSTORY_TOKEN": "YOUR_TOKEN"
      }
    }
  }
}
```

## Tools

- `execute_campaign`: Create and run AI content campaigns.
- `regenerate_image`: Tweak visual prompts for social posts.
- `enhance_manual_post`: Use AI to improve your drafts.
- `publish_post`: Schedule or publish content to social platforms.

## License

MIT
