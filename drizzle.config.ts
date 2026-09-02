import { defineConfig } from "drizzle-kit";
import fs from 'fs';
import path from "path";
import os from "os";

export default defineConfig({
  schema: "src/db",
  out: "src/db",
  dialect: "postgresql",
  dbCredentials: {
    url: getDbUrl(),
  },
});

function getDbUrl() {
    const configFile = path.join(os.homedir(), ".gatorconfig.json");

    try {
      const data = fs.readFileSync(configFile, 'utf8');
      const config = JSON.parse(data)
        return config.db_url;
    } catch (err) {
        console.error('Error reading configuration file:', err);
        return null; // Or throw err, depending on how you want to handle failures
    }
}
