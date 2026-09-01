import path from "path";
import fs from "fs";
import os from "os";

export type Config = {
  dbUrl: string;
  currentUserName?: string;
}

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

export function setUser(name: string): void{
  const filePath = getConfigFilePath();

  const config = readConfig();

  const rawObject = {
    db_url:  config.dbUrl,
    current_user_name: name,
  }
  try {
    const jsonString = JSON.stringify(rawObject);
    fs.writeFileSync(filePath, jsonString, 'utf-8');
  } catch (error) {
     throw new Error('Error writing or parsing JSON file.');
  }

}

export function readConfig(): Config {

  try {
    const filePath = getConfigFilePath();

    const rawData = fs.readFileSync(filePath, "utf-8");

    const config: Config = validateConfig(JSON.parse(rawData));
    return config;
  } catch (error) {
    throw new Error('Error reading or parsing JSON file.');
  }
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig || typeof rawConfig !== 'object') {
    throw new Error('Validation failed: Configuration must be a valid object');
  }

  if (typeof rawConfig.db_url !== 'string') {
     throw new Error('Validation failed: "dbUrl" is missing or is not a string');
  }

  if (typeof rawConfig.current_user_name !== 'string' && typeof rawConfig.current_user_name !== 'undefined') {
    throw new Error('Validation failed: "currentUserName" is not a string');
  }

  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name
  }
}
