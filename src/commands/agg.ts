import { fetchFeed } from "../rss/feedData";

export async function handlerAGG(cmdName: string, ...args: string[]): Promise<void> {
  const url = "https://www.wagslane.dev/index.xml";
  const data = await fetchFeed(url);
  console.log(JSON.stringify(data));
}
