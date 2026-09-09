import { readConfig } from "../config";
import { createFeedFollow, deleteFeedFollows, getFeedFollowsByUser } from "../db/queries/feedFollows";
import { getFeedByURL } from "../db/queries/feeds";
import { getUserByName } from "../db/queries/users";
import { User } from "../db/schema";

export async function handleFollowing(cmdName: string,user: User ,...args: string[]): Promise<void> {
  const currentUser = user.name

  const result = await getFeedFollowsByUser(currentUser);
  if (!result) {
    throw new Error("Unable to get users feeds");
  }
  console.log(`Feeds followed by ${currentUser} - `);
  for (let feed of result) {
    console.log(`${feed.feedName}`);
  }
}

export async function handleFollow(cmdName: string,user: User, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error("No URL provided");
  }

  const [feed] = await getFeedByURL(args[0]);

  const result = await createFeedFollow(user.id, feed.id);

  if (!result) {
    throw new Error("Unable to create feed follows");
  }
  console.log(`Feed Name: ${result.feedName}`);
  console.log(`User Name: ${result.userName}`);
}

export async function handleUnfollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error("No URL provided");
  }

  const [feed] = await getFeedByURL(args[0]);

  if (!feed) {
    throw new Error("No feed found");
  }
  const [result] = await deleteFeedFollows(user, feed);

  if (!result) {
    console.log("Nothing to delete");
    return;
  }

  console.log(`Feed ${feed.name} deleted for ${user.name}`);

}
