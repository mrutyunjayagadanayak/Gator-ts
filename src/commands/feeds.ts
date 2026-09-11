
import { createFeedFollow } from "../db/queries/feedFollows";
import { createFeed, getFeeds } from "../db/queries/feeds";
import { getUserById } from "../db/queries/users";
import { Feed, User } from "../db/schema";
import { fetchFeed, getNextFeedToFetch, markFeedFetched } from "../rss/feedData";
import { parseDuration } from "./time";



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

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const timeArg = args[0];
  const timeBetweenRequests = parseDuration(timeArg);
  if (!timeBetweenRequests) {
    throw new Error(
      `invalid duration: ${timeArg} – use format 1h 30m 15s or 3500ms`,
    );
  }

  console.log(`Collecting feeds every ${timeArg}...`);

  // run the first scrape immediately
  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log(`No feeds to fetch.`);
    return;
  }
  console.log(`Found a feed to fetch!`);
  await scrapeFeed(feed);
}

async function scrapeFeed(feed: Feed) {
  const feedData = await fetchFeed(feed.url);
  await markFeedFetched(feed.id);

  for (const item of feedData.channel.item) {
    console.log(item.title);
  }

  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
}

function handleError(err: unknown) {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
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
