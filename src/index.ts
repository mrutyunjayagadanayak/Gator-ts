import {registerCommand, runCommand } from "./commands/commands";
import { handlerRegister } from "./commands/register";
import { handlerLogin } from "./commands/users";

async function main() {
  const registry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  if (process.argv.length === 2) {
    console.error("Please provide a command");
    process.exit(1);
  }

  const cliArgs = process.argv.slice(2);
  const command = cliArgs[0];
  const commandArgs = cliArgs.slice(1);

  if (!command.trim()) {
    console.error("Please enter a command.");
    return;
  }
  try {
    await runCommand(registry, command, ...commandArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${command}: ${err.message}`);
    } else {
      console.error(`Error running command ${command}: ${err}`);
    }
     process.exit(1);
  }

  process.exit(0);
}

main();
