// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// src/consts.ts - サイト全体で使用するグローバル定数

/**
 * サイト全体の設定
 */
export const SITE = {
  title: "abnoumaru.com",
  description: "Welcome to my website!",
  url: "https://abnoumaru.com",
  author: "abnoumaru",
} as const;

/**
 * ソーシャルメディア設定
 */
export const SOCIAL = {
  twitter: {
    handle: "@abnoumaru",
    url: "https://x.com/abnoumaru",
  },
  github: {
    handle: "abnoumaru",
    url: "https://github.com/abnoumaru",
  },
} as const;

/**
 * アナリティクス設定
 */
export const ANALYTICS = {
  googleAnalytics: {
    id: "G-1FX49E22DX",
    enabled: true,
  },
} as const;

/**
 * シェアボタン設定
 */
export const SHARE_BUTTONS = [
  {
    name: "hatena",
    baseUrl: "https://b.hatena.ne.jp/entry/",
    ariaLabel: "はてなブックマークでシェア",
    icon: "simple-icons:hatenabookmark",
  },
  {
    name: "x",
    baseUrl: "https://x.com/intent/tweet",
    ariaLabel: "Xでシェア",
    icon: "simple-icons:x",
  },
] as const;

// 後方互換性のための変数
export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.description;
export const SITE_URL = SITE.url;
export const TWITTER_HANDLE = SOCIAL.twitter.handle;
export const GITHUB_HANDLE = SOCIAL.github.handle;
export const GA_ID = ANALYTICS.googleAnalytics.id;
