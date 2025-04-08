// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// src/consts.ts - サイト全体で使用するグローバル定数

/**
 * サイト全体の設定
 */
export const SITE = {
  title: 'abnoumaru.com',
  description: 'Welcome to my website!',
  url: 'https://abnoumaru.com',
  author: 'abnoumaru',
} as const;

/**
 * ソーシャルメディア設定
 */
export const SOCIAL = {
  twitter: {
    handle: '@abnoumaru',
    url: 'https://x.com/abnoumaru',
  },
  github: {
    handle: 'abnoumaru',
    url: 'https://github.com/abnoumaru',
  },
} as const;

/**
 * アナリティクス設定
 */
export const ANALYTICS = {
  googleAnalytics: {
    id: 'G-1FX49E22DX',
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
    icon: `<path fill="currentColor" d="M12 7a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1Z"/><path fill="currentColor" d="M12 5a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm0 16a9 9 0 1 0 0-18a9 9 0 0 0 0 18Zm0-2a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z"/>`,
    bgColor: "#00a4de",
    hoverBgColor: "#0086b3"
  },
  {
    name: "x",
    baseUrl: "https://x.com/intent/tweet",
    ariaLabel: "Xでシェア",
    icon: `<path fill="currentColor" d="M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/>`,
    bgColor: "#000",
    hoverBgColor: "#333"
  }
] as const;

// 後方互換性のための変数
export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.description;
export const SITE_URL = SITE.url;
export const TWITTER_HANDLE = SOCIAL.twitter.handle;
export const GITHUB_HANDLE = SOCIAL.github.handle;
export const GA_ID = ANALYTICS.googleAnalytics.id;
