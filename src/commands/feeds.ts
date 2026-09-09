import { readConfig } from "../config";
import { createFeedFollow } from "../db/queries/feedFollows";
import { createFeed, getFeeds } from "../db/queries/feeds";
import { getUserById, getUserByName } from "../db/queries/users";
import { Feed, User } from "../db/schema";
import { fetchFeed } from "../rss/feedData";


async function printFeed(feed: Feed): Promise<void> {
  const feedUser = await getUserById(feed.userId);
  console.log(`ID: ${feed.id}`);
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`CreatedAT: ${feed.createdAt}`);
  console.log(`UpdatedAT: ${feed.updatedAt}`);
  console.log(`User ID: ${feed.userId}`);
  console.log(`User name: ${feedUser.name}`);
}

export async function handlerAGG(cmdName: string, ...args: string[]): Promise<void> {
  const url = "https://www.wagslane.dev/index.xml";
  const data = await fetchFeed(url);
  console.log(JSON.stringify(data));
}

export async function handlerAddFeed(cmdName: string,user: User, ...args: string[]): Promise<void> {
  if (args.length < 2) {
    throw new Error("Missing arguments.")
  }

  const feed = await createFeed(args[0], args[1], user.id);
  if (!feed) {
    throw new Error("Unable to create feed");
  }
  const result = await createFeedFollow(user.id, feed.id);
  if (!result) {
    throw new Error("Unable to create feed follow");
  }
  await printFeed(feed);
}

export async function handlerFeeds(cmdName: string, ...args: string[]): Promise<void> {
  const feeds = await getFeeds();

  for (let feed of feeds) {
    const user = await getUserById(feed.userId);
    console.log(`Feed name: ${feed.name}`);
    console.log(`Feed URL: ${feed.url}`);
    console.log(`Created by: ${user.name}`)
  }
}
