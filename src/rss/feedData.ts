import { XMLParser } from "fast-xml-parser";

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export async function fetchFeed(feedURL: string): Promise<void> {
  try {
    const receivedData = await fetch(feedURL, {
      method: "GET",
      headers: {
        'User-Agent': 'gator'
      }
    });
    if (!receivedData.ok) {
      throw new Error("Unable to receive data");
    }
    const data = await receivedData.text();
    const parser = new XMLParser();
    const xmlData: RSSFeed = parser.parse(data).rss;
    console.log(xmlData.channel.description);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch the feed: ${error.message}`);
    } else {
      throw new Error("An unexpected error occured.");
    }
  }
}
