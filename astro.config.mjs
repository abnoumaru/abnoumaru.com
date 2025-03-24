import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: 'https://abnoumaru.com',
  integrations: [
    mdx(),
    sitemap(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
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
