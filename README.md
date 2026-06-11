# abnoumaru.com

[Bridgetown](https://www.bridgetownrb.com/) で構築している個人ブログ。Cloudflare Pages にデプロイされる。

## 記事を書いて公開する

1. 雛形を生成（日付を省くと今日）。`src/_posts/<日付>-post.md` と画像用の `src/<日付>/` ができる

   ```sh
   rake "post:new[2026-06-04,記事タイトル]"
   ```

2. 本文を書き、画像は `src/<日付>/` に配置

3. ローカルで `http://localhost:4000` を確認

   ```sh
   bin/bridgetown start
   ```

4. リンターでチェック

   ```sh
   hk check --all
   ```

5. 必要なら自動修正

   ```sh
   hk fix --all
   ```

6. push（Cloudflare Pages が自動ビルド。`main` は本番公開、それ以外はプレビュー）

   ```sh
   git push
   ```

## ビルド

- `bin/bridgetown deploy` — Cloudflare Pages が使う本番ビルド（`clean` → esbuild → Bridgetown build）。
- `bin/bridgetown test` — `BRIDGETOWN_ENV=test` でビルド。
- `bin/bridgetown clean` — `output/` を削除。
