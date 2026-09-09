import { handlerAddFeed, handlerAGG, handlerFeeds } from "./commands/feeds";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handleFollow, handleFollowing, handleUnfollow } from "./commands/feed-following";
import { handlerRegister } from "./commands/register";
import { handlerReset } from "./commands/reset";
import { handlerLogin, handleUsers } from "./commands/users";
import { middlewareLoggedIn } from "./middleware";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handleUsers);
  registerCommand(registry, "agg", handlerAGG);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "follow", middlewareLoggedIn(handleFollow));
  registerCommand(registry, "following", middlewareLoggedIn(handleFollowing));
  registerCommand(registry, "unfollow", middlewareLoggedIn(handleUnfollow));
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
