import { resetFeedFollows } from "../db/queries/feedFollows";
import { resetFeeds } from "../db/queries/feeds";
import { resetUsers } from "../db/queries/users";

export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
  await resetFeedFollows();
  await resetUsers();
  await resetFeeds();
  console.log("Tables cleaned");
}
