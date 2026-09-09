import { db } from ".."
import { feedFollows, feeds, users } from "../schema"
import { eq } from 'drizzle-orm';
import { getFeedByURL } from "./feeds";
import { readConfig } from "../../config";
import { getUserByName } from "./users";

export async function createFeedFollow(userId: string, feedId:string) {
  const [newFeedFollow] = await db.insert(feedFollows).values({
    userId: userId,
    feedId: feedId,
  }).returning();
  const [result] = await db
    .select({
      feedFollowsId: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAT: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      userName: users.name,
      feedName: feeds.name
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, newFeedFollow.id));
  return result;
}

export async function follow(url: string) {
  const [feed] = await getFeedByURL(url);
  const config = readConfig();
  const currentUserName = config.currentUserName

  if (!currentUserName) {
    throw new Error("No user logged in");
  }
  const userData = await getUserByName(currentUserName);
  if (!userData) {
    throw new Error("No user data received");
  }

  const result = await createFeedFollow(userData.id, feed.id)
  return result;
}

export async function getFeedFollowsByUser(user: string) {
  const userdata = await getUserByName(user);

  if (!userdata) {
    throw new Error("No user data received");
  }
  const result = await db.select({
      feedFollowsId: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAT: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      userName: users.name,
      feedName: feeds.name
  }).from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userdata.id));
  return result;
}

export async function resetFeedFollows() {
  db.delete(feedFollows);
}
