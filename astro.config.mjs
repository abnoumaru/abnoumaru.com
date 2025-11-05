import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from "@astrojs/partytown";
import icon from "astro-icon";

const HOMEPAGE = 'https://abnoumaru.com/';

// https://astro.build/config
export default defineConfig({
  site: 'https://abnoumaru.com',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => page === HOMEPAGE,
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    icon(),
  ],
  // パフォーマンス最適化の設定
  build: {
    // 画像最適化のパス（文字列を指定）
    assets: 'assets',
    // チャンキングの改善
    inlineStylesheets: 'auto',
  },
  // コードの圧縮
  compressHTML: true,
  // プリロードの機能を強化
  prefetch: true,
});
