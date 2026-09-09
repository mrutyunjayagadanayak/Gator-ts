import { db } from "..";
import { feeds } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeed(name: string, url: string, user: string) {
  const [result] = await db.insert(feeds).values({
    name: name,
    url: url,
    userId: user,
  }).returning();
  return result;
}

export async function resetFeeds() {
  await db.delete(feeds);
}

export async function getFeeds() {
  return db.select().from(feeds);
}

export async function getFeedByURL(url: string) {
  return await db.select().from(feeds).where(eq(feeds.url, url));
}
