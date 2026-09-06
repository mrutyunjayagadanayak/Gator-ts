import { fetchFeed } from "../rss/feedData";

export async function handlerAGG(cmdName: string, ...args: string[]): Promise<void> {
  const url = "https://www.wagslane.dev/index.xml";
  await fetchFeed(url);
}
