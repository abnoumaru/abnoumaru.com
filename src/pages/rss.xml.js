import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site || SITE_URL,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			...(post.data.updatedDate && { updatedDate: post.data.updatedDate }),
			...(post.data.heroImage && { customData: `<image>${post.data.heroImage}</image>` }),
			customData: `
				<tags>${post.data.tags?.join(',')}</tags>
				${post.data.isTech ? '<category>Tech</category>' : ''}
			`,
			link: `/blog/${post.slug}/`,
		})),
		customData: `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
	});
}
