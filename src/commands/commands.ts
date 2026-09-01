
type CommandHandler = (cmdName: string, ...args: string[]) => void;

type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
  if (!cmdName.trim() || !handler || !registry) {
    throw new Error("Invalid command name or handler function");
  }
  registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {

  if (!cmdName.trim() || !registry) {
    throw new Error("Invalid command name or registry");
  }

  const handler = registry[cmdName];

  if (!handler) {
    throw new Error("Invalid command provided");
  }

  handler(cmdName, ...args);

}
