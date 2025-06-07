# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server at localhost:4321
- `npm run build` - Build production site (includes type checking via `astro check`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on TypeScript and Astro files
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run prettier` - Format code with Prettier

## Architecture Overview

This is an Astro-based personal blog/website with the following key architectural elements:

### Content Management
- Blog posts are managed through Astro's content collections in `src/content/blog/`
- Content schema is defined in `src/content/config.ts` with required fields: title, description, pubDate, optional updatedDate, heroImage, tags, isTech flag, and path
- Blog posts support both regular content and tech-focused content (controlled by `isTech` frontmatter)
- Images for posts are stored in `public/` directory with date-based folder structure

### Site Configuration
- Global site constants are centralized in `src/consts.ts` including site metadata, social media links, analytics configuration, and share button configurations
- Astro configuration in `astro.config.mjs` includes MDX, sitemap, and Partytown (for Google Analytics) integrations
- Site URL is configured as https://abnoumaru.com

### Layout Structure
- `BaseLayout.astro` provides the main HTML structure with Japanese language setting
- Components are organized in `src/components/` with reusable elements like Header, Footer, BaseHead
- Page templates in `src/layouts/` handle specific content types (PagesPost for blog posts)

### Routing
- Dynamic blog post routing via `src/pages/blog/[...slug].astro`
- Tag-based filtering with dynamic routes in `src/pages/tags/`
- RSS feed generation through `src/pages/rss.xml.js`

### Styling
- CSS files are organized by component/page in `src/styles/`
- Custom fonts (MonaspaceNeon) are loaded from `public/fonts/`

### Key Integrations
- Google Analytics via Partytown for performance
- Social sharing buttons for Hatena Bookmark and X (Twitter)
- Sitemap generation for SEO