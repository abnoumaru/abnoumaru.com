# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `bin/bridgetown start` — ローカル開発サーバを `http://localhost:4000` で起動
- `bin/bridgetown deploy` — 本番ビルド（Rakefile が `clean` → esbuild → Bridgetown build を実行。Cloudflare Pages もこのコマンド）
- `hk check --all` — Ruby/CSS/HTML/JS のリンターをまとめて実行
- `hk fix --all` — リンターの自動修正

## Architecture Overview

Bridgetown 2.x で構築している個人ブログ。Cloudflare Pages にデプロイされる。

### Content

- ブログ記事は `src/_posts/<YYYY-MM-DD>-<slug>.md`（または `.md` 内の frontmatter）に置く
- 各記事の画像など静的アセットは `src/<YYYY-MM-DD>/` 配下
- 静的ページ（about, blog, links 等）は `src/*.md` 直下

### Layouts & Partials

- `src/_layouts/default.erb` — 全体のベースレイアウト（`<html>`/`<head>`/`<body>` 構造）
- `src/_layouts/post.erb` — 記事ページ用
- `src/_partials/_head.erb` / `_header.erb` / `_footer.erb` / `_format_date.erb` / `_comment.erb` — 再利用パーシャル

### Site Configuration

- `config/initializers.rb` — Bridgetown 設定（URL、ロケール、テンプレートエンジン、プラグインの有効化）
- `src/_data/site_metadata.yml` — タイトル・説明・SNS リンク等のサイトメタデータ
- `src/_data/career.yml`, `src/_data/links.yml` — about / links ページのデータ

### Plugins

- `plugins/builders/git_metadata.rb` — Git のコミットハッシュをサイトに埋め込む
- `plugins/builders/svg_icon.rb` — `simple-icons` 由来の SVG をテンプレートから差し込む

### Frontend Pipeline

- `frontend/styles/index.css`（PostCSS）と `frontend/javascript/index.js` を esbuild でビルド
- 設定: `esbuild.config.js`, `postcss.config.js`, `config/esbuild.defaults.js`

### Integrations

- RSS: `bridgetown-feed`（`/rss.xml` で配信）
- Sitemap: `bridgetown-sitemap`
- Analytics: Cloudflare Web Analytics

## Toolchain

- Ruby/Node のバージョンは `.ruby-version` / `.node-version` を参照
- mise 利用者は `.mise.toml` で `hk` / `pkl` も自動セットアップされる
- リンタ構成は `hk.pkl` に集約（rubocop, rubyfmt, erb_lint, stylelint, prettier）
