import { resetFeeds } from "../db/queries/feeds";
import { resetUsers } from "../db/queries/users";

export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
  await resetUsers();
  await resetFeeds();
  console.log("Tables cleaned");
}
