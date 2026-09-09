import { readConfig } from "../config";
import { createFeedFollow, getFeedFollowsByUser } from "../db/queries/feedFollows";
import { getFeedByURL } from "../db/queries/feeds";
import { getUserByName } from "../db/queries/users";

export async function handleFollowing(cmdName: string, ...args: string[]): Promise<void> {
  const currentUser = readConfig().currentUserName;

  if (!currentUser) {
    throw new Error("No user logged in");
  }
  const result = await getFeedFollowsByUser(currentUser);
  if (!result) {
    throw new Error("Unable to get users feeds");
  }
  console.log(`Feeds followed by ${currentUser} - `);
  for (let feed of result) {
    console.log(`${feed.feedName}`);
  }
}

export async function handleFollow(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error("No URL provided");
  }

  const [feed] = await getFeedByURL(args[0]);
  const currentUser = readConfig().currentUserName

  if (!currentUser) {
    throw new Error("No user logged in");
  }
  const userData = await getUserByName(currentUser)
  const result = await createFeedFollow(userData.id, feed.id);

  if (!result) {
    throw new Error("Unable to create feed follows");
  }
  console.log(`Feed Name: ${result.feedName}`);
  console.log(`User Name: ${result.userName}`);
}
