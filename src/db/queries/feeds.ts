import { db } from "..";
import { feeds } from "../schema";

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
