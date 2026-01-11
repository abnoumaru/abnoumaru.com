import type { Publication, PublicationSource } from "../types/publication";

interface RSSFeedConfig {
  url: string;
  source: PublicationSource;
}

const RSS_FEEDS: RSSFeedConfig[] = [
  { url: "https://note.com/abnoumaru/rss", source: "note" },
  { url: "https://zenn.dev/abnoumaru/feed", source: "zenn" },
  { url: "https://speakerdeck.com/abnoumaru.rss", source: "speakerdeck" },
];

async function fetchRSSFeed(config: RSSFeedConfig): Promise<Publication[]> {
  try {
    const response = await fetch(config.url);
    if (!response.ok) {
      console.warn(`RSS fetch failed for ${config.source}: ${response.status}`);
      return [];
    }

    const xmlText = await response.text();
    const items: Publication[] = [];

    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex =
      /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
    const linkRegex = /<link>(.*?)<\/link>/;
    const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;

    let match;
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];

      const titleMatch = itemContent.match(titleRegex);
      const linkMatch = itemContent.match(linkRegex);
      const pubDateMatch = itemContent.match(pubDateRegex);

      if (titleMatch && linkMatch && pubDateMatch) {
        const title = titleMatch[1] || titleMatch[2];
        items.push({
          title: title.trim(),
          url: linkMatch[1].trim(),
          pubDate: new Date(pubDateMatch[1]),
          source: config.source,
        });
      }
    }

    return items;
  } catch (error) {
    console.warn(`RSS fetch error for ${config.source}:`, error);
    return [];
  }
}

export async function fetchAllPublications(): Promise<Publication[]> {
  const results = await Promise.all(RSS_FEEDS.map(fetchRSSFeed));
  const allPublications = results.flat();

  return allPublications.sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()
  );
}
