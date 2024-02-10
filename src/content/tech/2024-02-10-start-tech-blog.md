---
title: 'Tech Blogが生えました'
description: 'Astroのほぼテンプレで作ったブログにTech Blogを生やした'
pubDate: 'Feb 10 2024'
heroImage: '/blog-placeholder-3.jpg'
---

ふと久々に自分のサイトがほしいと思いこのサイトを立ち上げたが基本的には [はじめての投稿](https://abnoumaru.com/blog/2024-02-04-first-post/) に書いてある通り、とりとめのない自分向けの日記に利用したい気持ちが強い。

ただもしかしたら技術的なことを発信したくなるかもしれないと思い、技術ブログもほしくなった。

現在所属している会社の技術ブログは [catnose99/team-blog-hub](https://github.com/catnose99/team-blog-hub) を利用している。
おかげで各々が自分の好きなメディアでブログを書いている。
とりとめのない記事と技術の記事が混じってしまうと後々上記のようなBlog Hubに参加できないと思ったので、ブログを用途に寄って分割したいと思った。

[abnoumaru/abnoumaru.com](https://github.com/abnoumaru/abnoumaru.com) にコードが公開されているが、見ての通りこのブログは現時点ではAstroのブログテンプレートをほぼそのまま利用しているサイトである。
まずは /src 配下にあるBlog関連のファイルをそっくりそのままコピーしてBlogをTechに書き換えたりしてみた。しかし `src/components/FormattedDate.astro` を利用する部分で `date.toISOString is not a function` のエラーが出てしまう。
型変換関連でなにかが足りないか？と思い探したところ `src/content/config.ts` で型変換されている。
AstroはContent Collectionsによりコンテンツが管理されているが、そのSchemaを定義している箇所だった。

Content Collectionsについて調べたところちょうど複数のコレクションを定義する方法があった。

https://docs.astro.build/en/guides/content-collections/#defining-multiple-collections

おかげでシュッとブログを用途に寄って分割できて便利でした。

ﾊｯﾋﾟｰﾊｯﾋﾟｰﾊｯﾋﾟｰ