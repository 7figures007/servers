import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log("\n🚀 High Story MCP - Configuration Automatique\n");

  const token = await question("🔑 Entrez votre HIGHSTORY_TOKEN (JWT) : ");
  if (!token) {
    console.error("Erreur : Le token est obligatoire.");
    process.exit(1);
  }

  const sseUrl = await question("🌐 Entrez l'URL de votre serveur (par défaut : https://jeprtikkylotvcddrqvm.supabase.co/functions/v1/highstory-mcp-server) : ") || "https://jeprtikkylotvcddrqvm.supabase.co/functions/v1/highstory-mcp-server";

  const isMac = process.platform === 'darwin';
  const configPath = isMac 
    ? path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
    : path.join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json');

  console.log(`\n📂 Recherche de la configuration Claude : ${configPath}`);

  let config: any = { mcpServers: {} };

  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(content);
    }
  } catch (e) {
    console.log("⚠️ Fichier inexistant ou corrompu, création d'un nouveau fichier.");
  }

  if (!config.mcpServers) config.mcpServers = {};

  config.mcpServers.highstory = {
    command: "npx",
    args: ["-y", "highstory-mcp"],
    env: {
      HIGHSTORY_SSE_URL: sseUrl,
      HIGHSTORY_TOKEN: token
    }
  };

  try {
    // Ensure directory exists
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("\n✅ Configuration réussie !");
    console.log("🔄 Veuillez redémarrer Claude Desktop pour activer High Story.");
  } catch (e: any) {
    console.error(`\n❌ Erreur lors de l'écriture : ${e.message}`);
  }

  rl.close();
}

setup();
