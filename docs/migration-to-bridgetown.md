# Astro → Bridgetown v2.1.2 移行計画書

本ドキュメントは、`abnoumaru.com`（Astro v6.0.8 製の個人ブログ・全 34 記事）を [Bridgetown](https://github.com/bridgetownrb/bridgetown) v2.1.2 へ置き換えるための実装手順書である。別作業者がこの文書だけを見て移行作業を遂行できる粒度を目指す。

---

## 1. 概要

- **移行元**: Astro v6.0.8（Node.js 24.14.0 / TypeScript）
- **移行先**: Bridgetown v2.1.2（Ruby 4.0.3 / Node.js 22.21 以上）
- **ホスティング**: Cloudflare Pages を継続利用
- **対象範囲**:
  - 全 34 件のブログ記事（`src/content/blog/*.md`）
  - 全ページ: `home`, `blog` 一覧, `blog` 詳細, `about`, `links`, `no-smoking`, `404`
  - 機能: RSS / sitemap / robots.txt / OGP / Google Analytics / Giscus コメント / シェアボタン / フッタの git commit hash 表示
- **対象外**: 新機能追加（タグページ・検索・カテゴリページなど現状未実装の機能は今回も実装しない）

---

## 2. 設計上の重要決定

| 項目 | 決定 |
| --- | --- |
| テンプレートエンジン | **ERB**（Bridgetown v2 系のデフォルト） |
| URL 構造 | `/blog/YYYY-MM-DD/` を維持（被リンクと RSS リーダーへの影響を防ぐため） |
| 投稿コレクション | 標準の `posts` を使用、`src/_posts/` に配置 |
| 記事ファイル名 | `YYYY-MM-DD-post.md`（Bridgetown は `YYYY-MM-DD-<title>.md` 形式を要求するため、suffix `-post` を機械的に付与） |
| Permalink | フロントマターに `permalink: /blog/YYYY-MM-DD/` を記載して URL を固定 |
| 設定ファイル | `bridgetown.config.yml` は使わず、`config/initializers.rb` の Ruby DSL に統一（v2 標準） |
| `bin/bridgetown` | `bundle binstubs bridgetown-core` で生成された Ruby binstub を採用（手書きしない） |
| ページ配置 | `src/_pages/` ではなく `src/` 直下（`src/index.md`, `src/posts.md`, `src/about.md`, `src/404.html`, `src/500.html`）に置く |
| グローバル定数 | `src/consts.ts` を `src/_data/site_metadata.yml` に移行 |
| 静的アセット | 既存の絶対パス `/YYYY-MM-DD/foo.jpg` を維持するため、`static/` ディレクトリ（または `src/images/` 直下）に同一構造で配置 |
| 主要プラグイン | `bridgetown-feed`（RSS）、`bridgetown-sitemap`、`bridgetown-seo-tag` |
| デプロイ | Cloudflare Pages の Build command を `bundle exec bridgetown deploy`、Build output directory を `output` に変更 |

### 2.1 フロントマター変換ルール

| Astro 既存 | Bridgetown 移行後 | 備考 |
| --- | --- | --- |
| `title` | `title` | そのまま |
| `description` | `description` | そのまま |
| `pubDate` | `date` | Bridgetown 標準の投稿日フィールド |
| `updatedDate` | `last_modified_at` | 任意フィールドとして保持 |
| `heroImage` | `heroImage` | そのまま（レイアウト側で参照） |
| `tags` | `tags` | そのまま |
| `isTech` | `isTech` | そのまま（RSS のカテゴリ分類用） |
| `path` | （削除） | 現状未使用フィールドのため移行不要 |
| - | `layout: post` | 新規追加 |
| - | `permalink: /blog/YYYY-MM-DD/` | 新規追加 |

---

## 3. Astro → Bridgetown 機能対応表

| 領域 | Astro 現状 | Bridgetown 移行先 |
| --- | --- | --- |
| ビルドツール | `astro build` | `bin/bridgetown deploy`（Rakefile 経由で esbuild + 静的サイト生成） |
| 開発サーバ | `astro dev`（:4321） | `bin/bridgetown start`（:4000） |
| 型チェック | `astro check` | （なし。Ruby のため不要） |
| コンテンツ | `src/content/blog/*.md` | `src/_posts/*.md` |
| コレクション定義 | `src/content.config.ts`（Zod） | `config/initializers.rb` の `collections.posts.permalink` |
| レイアウト | `src/layouts/*.astro` | `src/_layouts/*.erb` |
| コンポーネント | `src/components/*.astro` | `src/_components/*.erb`（必要なら Ruby Component sidecar `.rb`） |
| ページ | `src/pages/**/*.astro` | `src/**/*.{md,erb,html}`（`src/` 直下、`_*` プレフィックス除く） |
| Partials | （Astro コンポーネント） | `src/_partials/*.erb`（`<%= render "name" %>` で呼び出し） |
| 動的ルート | `[...slug].astro` | `posts` コレクション + `permalink` |
| RSS | `src/pages/rss.xml.js`（`@astrojs/rss`） | `bridgetown-feed`（必要に応じてテンプレ上書き） |
| Sitemap | `@astrojs/sitemap` (homepage only filter) | `bridgetown-sitemap` + 個別ページに `sitemap: false` |
| OGP / SEO | `BaseHead.astro` 自前生成 | `bridgetown-seo-tag` + カスタム head パーシャル |
| Google Analytics | `@astrojs/partytown` | head 末尾に gtag.js を直接埋め込み（Partytown 相当は別途検討） |
| アイコン | `astro-icon` + `@iconify-json/*` | SVG をリポジトリに直接配置 |
| グローバル定数 | `src/consts.ts` | `src/_data/site_metadata.yml`、`src/_data/links.yml` 等 |
| Giscus | `src/components/Comment.astro` | `src/_components/comment.erb`（`<script>` をそのまま移植） |
| git commit hash | `Footer.astro` で `execSync` | ビルド時にヘルパで `` `git rev-parse --short HEAD`.strip `` |
| 禁煙日数計算 | クライアント側 JS | `frontend/javascript/no-smoking.js` にそのまま移植 |
| Lint | ESLint + Prettier | RuboCop（任意）、Prettier はフロントエンドアセットのみ |
| textlint | あり | そのまま継続（Markdown 対象） |
| Renovate | `renovate.json` | `bundler` datasource を `customManagers` に追加 |

---

## 4. 事前準備

1. ローカルに Ruby 4.0.3、Node.js 22.21 以上が入っていることを確認する。

   ```bash
   ruby -v   # ruby 4.0.3
   node -v   # v22.21 以上
   ```

   `.mise.toml` 利用者は `[tools]` に `ruby = "4.0.3"` を追記して `mise install`。

2. 既存サイトのバックアップとして Git タグを打つ。

   ```bash
   git tag pre-bridgetown-migration
   git push origin pre-bridgetown-migration
   ```

3. 移行作業ブランチを作成する。

   ```bash
   git checkout -b migration/bridgetown
   ```

---

## 5. 段階的移行手順

各ステップは独立したコミット単位を想定する。Tidy First に従い、構造変更（ディレクトリ・依存追加）と振る舞い変更（コンテンツ・テンプレート移植）は別コミットに分ける。

### Step 1: Bridgetown 雛形の取り込み（構造変更）

実装方針として、Bridgetown が要求するボイラープレート（`Rakefile`, `config.ru`, `esbuild.config.js`, `postcss.config.js`, `jsconfig.json`, `config/{esbuild.defaults.js,puma.rb,initializers.rb}`, `frontend/javascript/index.js`, `frontend/styles/{index,syntax-highlighting}.css`, `plugins/{site_builder.rb,builders/.keep}`, `server/{roda_app.rb,routes/hello.rb.sample}`, `src/_layouts/{default,page,post}.erb`, `src/_partials/{_head,_footer}.erb`, `src/_components/shared/{navbar.erb,navbar.rb}`, `src/_data/site_metadata.yml`, `src/{index,posts,about}.md`, `src/{404,500}.html`, `src/favicon.ico`, `src/images/logo.svg`, `tmp/pids/.keep`）を手書きせず、`bridgetown new` の出力を rsync で取り込む。

#### 1.1 雛形を一時ディレクトリに生成

```bash
SKEL=$(mktemp -d -t bridgetown-skel-XXXXXX)
gem install bridgetown -v 2.1.2 --no-document   # 既にインストール済みならスキップ可
bridgetown new "$SKEL/skel" --templates erb --skip-bundle --skip-npm
```

#### 1.2 rsync で雛形をプロジェクトへ取り込み

merge が必要なファイル（`.gitignore`, `package.json`, `Gemfile`, `README.md`, `.ruby-version`）は exclude してコピーする。

```bash
rsync -av \
  --exclude='.git/' \
  --exclude='.gitignore' \
  --exclude='package.json' \
  --exclude='Gemfile' \
  --exclude='README.md' \
  --exclude='.ruby-version' \
  "$SKEL/skel/" ./
```

#### 1.3 `Gemfile` を作成（雛形ベース + プラグイン3つ）

雛形の `Gemfile` をコピーし、末尾に Bridgetown プラグイン 3 つを追記する。`puma` は雛形どおり `< 8` のまま。Ruby バージョンは `.ruby-version`（`4.0.3`）で管理するので Gemfile では指定しない。

```ruby
gem "bridgetown", "~> 2.1.2"
gem "puma", "< 8"
gem "bridgetown-feed", "~> 4.0"
gem "bridgetown-seo-tag", "~> 7.0"
gem "bridgetown-sitemap", "~> 3.0"
```

#### 1.4 `.gitignore` を merge

雛形の `.gitignore`（`output`, `.bridgetown-cache`, `.bridgetown-metadata`, `.routes.json`, `node_modules`, `/.bundle`, `.byebug_history`, `.env`, yarn 系, `/tmp/*` 等）に既存 Astro 用エントリ（`dist/`, `.astro/`, `.env.production`, `npm-debug.log*`, `pnpm-debug.log*`）を追記する。`vendor/` も追記。

#### 1.5 `package.json` を merge

既存（Astro）の `dependencies` / `devDependencies` / `scripts` / `engines` を維持しつつ、雛形の `devDependencies`（`esbuild`, `glob`, `postcss`, `postcss-flexbugs-fixes`, `postcss-import`, `postcss-load-config`, `postcss-preset-env`, `read-cache`）と `scripts`（`esbuild`, `esbuild-dev`）を追記。`"private": true` も追加。

#### 1.6 `config/initializers.rb` にプラグイン init を追加

雛形の `config/initializers.rb` 末尾の `end` の直前に以下を追記する。`url`、`permalink`、`timezone` などの abnoumaru 固有設定は Step 2 で書く。

```ruby
# Bridgetown plugins
init :"bridgetown-feed"
init :"bridgetown-seo-tag"
init :"bridgetown-sitemap"
```

なお Bridgetown v2 では `bridgetown.config.yml` は使わず、設定はすべてこの `config/initializers.rb` に書く。

#### 1.7 `bundle install` と `bundle binstubs`

```bash
bundle install
bundle binstubs bridgetown-core
```

- `bundle install` で `Gemfile.lock` が生成される。`vendor/bundle` に gem が入る（`.bundle/config` で `BUNDLE_PATH: "vendor/bundle"` を指定する場合）。
- `bundle binstubs bridgetown-core` で `bin/bridgetown` および `bin/bt` の Ruby binstub が生成される。手書きしないこと。

#### 1.8 `npm install`

```bash
npm install
```

雛形由来の Bridgetown 用 devDependencies がインストールされ、`package-lock.json` が更新される。

#### 1.9 動作確認

```bash
bin/bridgetown --version  # → "bridgetown 2.1.2 ..."
```

### Step 2: グローバルデータの移行

`src/consts.ts` の内容を YAML として `src/_data/site_metadata.yml` に転記する。

```yaml
# src/_data/site_metadata.yml
title: abnoumaru.com
description: abnoumaruのウェブサイト。日常系。
url: https://abnoumaru.com
author: abnoumaru

social:
  twitter:
    handle: "@abnoumaru"
    url: https://x.com/abnoumaru
  github:
    handle: abnoumaru
    url: https://github.com/abnoumaru

analytics:
  google_analytics:
    id: G-1FX49E22DX
    enabled: true

share_buttons:
  - name: hatena
    base_url: https://b.hatena.ne.jp/entry/
    aria_label: はてなブックマークでシェア
    icon: hatenabookmark
  - name: x
    base_url: https://x.com/intent/tweet
    aria_label: Xでシェア
    icon: x
```

`about` ページのキャリア情報、`links` ページのリンク一覧などは `src/_data/career.yml`、`src/_data/links.yml` に分離する（テンプレートとデータの分離）。

### Step 3: レイアウトとコンポーネントの移植

| Astro ファイル | 移行先 | メモ |
| --- | --- | --- |
| `src/layouts/BaseLayout.astro` | `src/_layouts/default.erb` | `<%= seo_tag %>` を `<head>` 内に呼び出し |
| `src/layouts/PagesPost.astro` | `src/_layouts/post.erb` | `default.erb` を継承（`<% content_for :main do %>` 等で）し、ヒーロー画像・シェアボタン・コメントを配置 |
| `src/components/BaseHead.astro` | `src/_components/base_head.erb` | `bridgetown-seo-tag` で賄えない要素（GA、JSON-LD、ファビコン）のみ手書き |
| `src/components/Header.astro` | `src/_components/header.erb` | ハンバーガー JS を `frontend/javascript/header.js` に分離 |
| `src/components/Footer.astro` | `src/_components/footer.erb` | git hash は次項参照 |
| `src/components/HeaderLink.astro` | ERB ヘルパ `nav_link(label, url)` |
| `src/components/FormattedDate.astro` | ERB ヘルパ `format_date(date)` |
| `src/components/Comment.astro` | `src/_components/comment.erb` | Giscus の `<script>` をそのまま埋め込み |

git commit hash 取得は `plugins/builders/git_metadata.rb` で site メタデータに注入する:

```ruby
class GitMetadata < SiteBuilder
  def build
    hook :site, :pre_render do |site|
      hash = `git rev-parse --short HEAD`.strip
      site.config["git_commit_hash"] = hash
    end
  end
end
```

テンプレート側では `<%= site.config["git_commit_hash"] %>` で参照。

### Step 4: スタイル移植

CSS はすべて `frontend/styles/` 配下に集約する。

```
frontend/styles/
├── index.css        # @import で global, header, blog-post を取り込む
├── global.css       # src/styles/global.css をそのままコピー
├── header.css       # src/styles/header.css をそのままコピー
└── blog-post.css    # src/styles/blog-post.css をそのままコピー
```

`MonaspaceNeon` 等のカスタムフォントが `public/fonts/` にある場合は `static/fonts/` に移し、`@font-face` の `src` は絶対パスのまま維持する。

### Step 5: ページ移植

Bridgetown では `src/` 直下にページファイルを置く（雛形では `src/index.md`, `src/posts.md`, `src/about.md`, `src/404.html`, `src/500.html`）。`src/_pages/` ディレクトリは標準ではない。

| Astro | Bridgetown | 実装メモ |
| --- | --- | --- |
| `src/pages/index.astro` | `src/index.erb` または `src/index.md` | `collections.posts.resources.first(5)` で最新 5 件。雛形の `src/index.md` を上書き |
| `src/pages/blog/index.astro` | `src/blog.erb` | `collections.posts.resources` を `date desc` で全件表示。雛形の `src/posts.md` を流用してリネーム or 上書き |
| `src/pages/about/index.astro` | `src/about.erb` | `site.data.career` をループ。雛形の `src/about.md` を上書き |
| `src/pages/links/index.astro` | `src/links.erb` | `site.data.links` をループ |
| `src/pages/no-smoking/index.astro` | `src/no-smoking.erb` | 計算 JS は `frontend/javascript/no-smoking.js` に分離 |
| `src/pages/404.astro` | `src/404.html`（雛形にあり） | フロントマターに `permalink: /404.html` を指定 |

URL を `/about/` のようにディレクトリ末尾スラッシュ形式にしたい場合は、フロントマターに `permalink: /about/` を明記するか、`config/initializers.rb` で `permalink "pretty"` を設定する。

各ページに `bridgetown-seo-tag` 用の `title`、`description`、必要に応じて `image` をフロントマターで設定する。

### Step 6: 投稿の移行

#### 6.1 ファイル名変換

```bash
mkdir -p src/_posts
for f in src/content/blog/*.md; do
  base=$(basename "$f" .md)
  cp "$f" "src/_posts/${base}-post.md"
done
```

#### 6.2 フロントマター変換

Ruby ワンライナーで一括変換する例:

```bash
ruby -i -p -e '
  $_.gsub!(/^pubDate:/, "date:")
  $_.gsub!(/^updatedDate:/, "last_modified_at:")
' src/_posts/*.md
```

その後、各記事に `permalink` と `layout` を追加する。`---` で始まる先頭の YAML ブロックを書き換えるスクリプトをワンショットで実行する:

```ruby
# scripts/add_frontmatter.rb
require "yaml"

Dir.glob("src/_posts/*.md").each do |path|
  content = File.read(path)
  next unless content.start_with?("---")

  parts = content.split("---", 3)
  fm = YAML.safe_load(parts[1], permitted_classes: [Date, Time])
  body = parts[2]

  basename = File.basename(path, ".md").sub(/-post$/, "")
  fm["permalink"] = "/blog/#{basename}/"
  fm["layout"] = "post"

  File.write(path, "---\n#{fm.to_yaml.sub(/^---\n/, "")}---#{body}")
end
```

```bash
ruby scripts/add_frontmatter.rb
```

#### 6.3 動作確認

`bin/bridgetown start` を起動し、`http://localhost:4000/blog/2026-03-08/` 等が 200 を返すことを確認する。

### Step 7: 静的アセット移行

```bash
mkdir -p static
cp -r public/icon static/
cp -r public/fonts static/ 2>/dev/null || true
for d in public/20*/; do
  cp -r "$d" static/
done
cp public/robots.txt static/
```

`bridgetown.config.yml` で `static/` 配下を出力にコピーする設定（v2 系では `static/` は標準でコピー対象）を確認。`public/blog-placeholder-1.jpg` 等のデフォルト OGP 画像も忘れず移す。

`favicon` のインライン SVG は `src/_components/base_head.erb` 内にそのまま記述する。

### Step 8: RSS / Sitemap / robots.txt の調整

#### 8.1 RSS

`bridgetown-feed` は既定で `/feed.xml` を生成する。既存 URL は `/rss.xml` のため、いずれかを選ぶ。

- **A 案（推奨）**: 自前で `src/rss.xml.erb` を書き、既存の Astro 版と同じ XML を出力する。`tags` カスタムフィールドや `<category>Tech</category>` を再現できる。
- **B 案**: `bridgetown-feed` の `feed_path: /rss.xml` 設定で URL を合わせる。カスタムフィールドが必要なら `lib/feed.xml.erb` を上書きする。

A 案の最小実装例（`src/rss.xml.erb`）:

```erb
---
permalink: /rss.xml
layout: false
---
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><%= site.data.site_metadata.title %></title>
    <description><%= site.data.site_metadata.description %></description>
    <link><%= site.data.site_metadata.url %></link>
    <lastBuildDate><%= Time.now.utc.rfc822 %></lastBuildDate>
    <% collections.posts.resources.each do |post| %>
      <item>
        <title><%= post.data.title %></title>
        <link><%= absolute_url(post.relative_url) %></link>
        <description><%= post.data.description %></description>
        <pubDate><%= post.data.date.rfc822 %></pubDate>
        <tags><%= Array(post.data.tags).join(",") %></tags>
        <% if post.data.isTech %><category>Tech</category><% end %>
      </item>
    <% end %>
  </channel>
</rss>
```

#### 8.2 Sitemap

`bridgetown-sitemap` を使い、ホームページ以外の sitemap 出力を抑制する。各ページ・各投稿のフロントマターに `sitemap: false` を入れる方が確実（Astro 版の `filter` ロジックを忠実に再現する場合）。

#### 8.3 robots.txt

`static/robots.txt` に既存内容をそのままコピーする:

```
User-agent: *
Allow: /$
Disallow: /
```

### Step 9: ローカル動作確認

```bash
bin/bridgetown start
```

ブラウザで以下をすべて踏む:

- `/`（最新 5 件表示）
- `/blog/`（全 34 件表示）
- `/blog/2026-03-08/` 等の個別記事
- `/about/`、`/links/`、`/no-smoking/`
- 存在しない URL での 404 表示

ビルド成果物のチェック:

```bash
bin/bridgetown build
xmllint --noout output/rss.xml
xmllint --noout output/sitemap.xml
ls output/blog/ | wc -l   # 34 ディレクトリ存在
```

ヘッドレス検証として `curl -sI http://localhost:4000/blog/2026-03-08/` で 200 を確認。

### Step 10: Astro 関連ファイルの撤去

ローカル動作確認が通ったら、Astro 由来のファイルを削除する。

```bash
rm -rf src/components src/layouts src/pages src/styles src/content src/content.config.ts src/consts.ts src/env.d.ts
rm -rf astro.config.mjs tsconfig.json eslint.config.js prettier.config.cjs
rm -rf .astro dist node_modules
```

`package.json` から Astro 系依存を削除する。残すのは Bridgetown の esbuild ビルドに必要な依存のみ:

```bash
npm pkg delete dependencies.astro
npm pkg delete dependencies.@astrojs/check
npm pkg delete dependencies.@astrojs/compiler-rs
npm pkg delete dependencies.@astrojs/mdx
npm pkg delete dependencies.@astrojs/partytown
npm pkg delete dependencies.@astrojs/rss
npm pkg delete dependencies.@astrojs/sitemap
npm pkg delete dependencies.astro-icon
npm pkg delete dependencies.@iconify-json/lucide
npm pkg delete dependencies.@iconify-json/simple-icons
npm pkg delete devDependencies.eslint-plugin-astro
npm pkg delete devDependencies.prettier-plugin-astro
```

`scripts` も Bridgetown 用に書き換える（`dev`、`build`、`preview` を `bin/bridgetown start` 系へ）。

### Step 11: Cloudflare Pages のビルド設定変更

Cloudflare ダッシュボードまたは `wrangler` で以下に変更する。

| 設定項目 | 変更前 | 変更後 |
| --- | --- | --- |
| Build command | `npm run build` | `bundle exec bridgetown deploy` |
| Build output directory | `dist` | `output` |
| Root directory | `/` | `/`（変更なし） |

リポジトリ直下に `.ruby-version` を追加する:

```
4.0.3
```

> Cloudflare Pages の v3 ビルドシステムは Ruby 3.4.4 / Bundler 2.6.9 がデフォルト、v2 は Ruby 3.2.2 がデフォルト。`.ruby-version` または環境変数 `RUBY_VERSION` で任意のバージョンに切り替えられる。Ruby 4.0.3 はデフォルトより新しいため、ビルドイメージで利用可能か事前に Cloudflare Pages のビルドログで確認すること（未対応の場合は v3 ビルドシステムへの切替やビルド時インストールの手当てが必要）。`Gemfile` を検出すると `bundle install` が自動実行される。

環境変数設定:

| 変数名 | 値 | スコープ |
| --- | --- | --- |
| `BRIDGETOWN_ENV` | `production` | Production / Preview |
| `RUBY_VERSION` | `4.0.3` | （`.ruby-version` で代替するなら不要） |
| `NODE_VERSION` | `22.21.0` 以上 | Production / Preview |

ビルド実行順:

1. Cloudflare Pages がリポジトリを clone
2. `.ruby-version` を読んで Ruby を準備
3. `Gemfile` を検出し `bundle install`
4. `package.json` を検出し `npm install`
5. `bundle exec bridgetown deploy` を実行（内部で `frontend` の esbuild バンドル → 静的サイト生成）
6. `output/` の中身を Cloudflare Pages にデプロイ

プレビューデプロイ（PR 単位）も同設定で動くこと、Functions / Workers は使用しないことを確認する。

---

## 6. 検証チェックリスト

実装完了時に以下をすべてチェックする。

### ローカル

- [ ] `bin/bridgetown build` がエラーなく完了する
- [ ] `output/` 配下に 34 記事すべての HTML が生成される
- [ ] 各記事の URL が `/blog/YYYY-MM-DD/` 形式
- [ ] ホームページに最新 5 件が日付降順で表示される
- [ ] `/blog/` 一覧に 34 件すべてが日付降順で表示される
- [ ] `/rss.xml` が生成され `xmllint --noout` を通過する
- [ ] `/sitemap.xml` がホームページのみを含む
- [ ] OGP メタタグ（`og:title`, `og:description`, `og:image`, `twitter:card` 等）が各ページで出力される
- [ ] `/about/`、`/links/`、`/no-smoking/`、`/404.html` がそれぞれ生成される
- [ ] Giscus が個別記事ページで初期化される
- [ ] シェアボタン（はてな / X）のリンクが正しい URL を指す
- [ ] Google Analytics の gtag が `<head>` 内に挿入される
- [ ] `/no-smoking/` の日数表示が現在日基準で動作する
- [ ] `output/robots.txt` が `Allow: /$` / `Disallow: /` を含む
- [ ] フッタの git commit hash がビルド時のコミットを示している
- [ ] 既存記事中の画像参照（`/2024-02-04/foo.jpg` 等）が 404 にならない

### 本番（Cloudflare Pages プレビュー）

- [ ] PR デプロイのビルドログで `bundle install` と `bundle exec bridgetown deploy` の両方が成功する
- [ ] プレビュー URL でホーム / ブログ一覧 / 個別記事 / about / links / no-smoking / 404 を確認
- [ ] OGP を実際の URL で `https://www.opengraph.xyz/` 等で確認
- [ ] Google Analytics のリアルタイムレポートにヒットが入る

---

## 7. ロールバック方針

- 移行作業は `migration/bridgetown` ブランチで行い、`main` には Pull Request 経由でのみマージする
- 本番デプロイ後に問題が見つかった場合:
  1. Cloudflare Pages の「Rollback」機能で直前のデプロイへ戻す
  2. その後、PR を `git revert`、または `pre-bridgetown-migration` タグからチェックアウトしてホットフィックスを作成

---

## 8. 既知の懸念・要検討事項

- **GA の Web Worker 化**: Astro では Partytown でメインスレッドを保護していたが、Bridgetown 標準にはない。まずは同期 `gtag.js` 読み込みで代替し、必要に応じて [partytown](https://partytown.builder.io/) を手動導入する
- **Zod スキーマ相当のバリデーション**: `src/content.config.ts` の型バリデーションは Bridgetown では失われる。必要なら `plugins/builders/post_validator.rb` で `title`/`description`/`date` の存在を検査する軽量チェックを追加する
- **アイコン SVG**: `astro-icon` で読み込んでいた `simple-icons:hatenabookmark`、`simple-icons:x` は手作業で SVG を取得し、`src/_components/icons/hatena.svg`、`src/_components/icons/x.svg` に直接置く
- **Cloudflare Web Analytics の挿入**: 現在の `Footer.astro` には言及があるが実コードがない。実装時にダッシュボードのスニペットを `src/_components/footer.erb` 末尾に挿入する
- **`mise.toml` の `tasks.new`**: 記事テンプレート生成タスクを Bridgetown 用に書き換える（`src/_posts/$(date +%Y-%m-%d)-post.md` を生成し、`permalink` と `layout` を含める）
- **Renovate**: `renovate.json` の `customManagers` に Gemfile の `bundler` datasource を追加する
- **textlint**: 対象は Markdown のままで OK。記事ファイルのパスを `src/content/blog/**/*.md` から `src/_posts/**/*.md` に変更する

---

## 参考リンク

- [Bridgetown 公式ドキュメント](https://www.bridgetownrb.com/docs/)
- [Bridgetown v2.1.2 リリースノート](https://github.com/bridgetownrb/bridgetown/releases/tag/v2.1.2)
- [Cloudflare Pages: Language support and tools](https://developers.cloudflare.com/pages/configuration/language-support-and-tools/)
- [bridgetown-feed](https://github.com/bridgetownrb/bridgetown-feed)
- [bridgetown-sitemap](https://github.com/bridgetownrb/bridgetown-sitemap)
- [bridgetown-seo-tag](https://github.com/bridgetownrb/bridgetown-seo-tag)
