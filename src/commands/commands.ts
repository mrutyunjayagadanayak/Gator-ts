import { User } from "../db/schema";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void> | void;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
  if (!cmdName.trim() || !handler || !registry) {
    throw new Error("Invalid command name or handler function");
  }
  registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {

  if (!cmdName.trim() || !registry) {
    throw new Error("Invalid command name or registry");
  }

  const handler = registry[cmdName];

  if (!handler) {
    throw new Error("Invalid command provided");
  }

  await handler(cmdName, ...args);
}
