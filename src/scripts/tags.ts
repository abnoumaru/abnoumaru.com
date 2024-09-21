import { getCollection } from "astro:content";

export async function createUniqueTagsList(): Promise<string[]> {
  const posts = await getCollection("blog");

  const allTags = posts.reduce<string[]>((acc, item) => {
    return acc.concat(item.data.tags);
  }, []);

  const uniqueTags = Array.from(new Set(allTags));

  return uniqueTags;
}
