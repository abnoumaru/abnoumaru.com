# GitHub Actions Deploy Design

**Date:** 2026-07-05  
**Goal:** Cloudflare Pages のネイティブビルドを GitHub Actions に移行し、依存関係キャッシュでビルド時間を短縮する

## Background

現状は Cloudflare Pages が GitHub push をトリガーにビルドしており、毎回 `bundle install` と `npm install` がゼロから実行されるため約5分かかる。GitHub Actions の依存関係キャッシュを使うことで 1〜2分程度に短縮できる。

## Design

### Trigger

- `main` ブランチへの push のみ
- PR プレビューデプロイはなし

### Workflow: `.github/workflows/deploy.yml`

```yaml
name: Deploy
on:
  push:
    branches: [main]

env:
  BRIDGETOWN_ENV: production
  BUNDLE_WITHOUT: development:test

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # git_metadata plugin のために全履歴が必要

      - uses: ruby/setup-ruby@v1
        with:
          bundler-cache: true  # vendor/bundle をキャッシュ

      - uses: actions/setup-node@v4
        with:
          node-version-file: .node-version
          cache: npm

      - run: npm ci

      - run: bin/bridgetown deploy

      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: abnoumaru-com
          directory: output
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Environment Variables

| 変数 | 値 | 理由 |
|------|-----|------|
| `BRIDGETOWN_ENV` | `production` | Rakefile が明示的に設定しないため |
| `BUNDLE_WITHOUT` | `development:test` | dev/test gems を除外してキャッシュを高速化 |

### GitHub Secrets

| Secret | 内容 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Pages Edit 権限を持つ API Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |

`GITHUB_TOKEN` は GitHub Actions が自動で提供するため設定不要。

### Cloudflare Pages 側の変更

- GitHub 連携を解除済み（ネイティブビルドは発生しない）
- プロジェクト名: `abnoumaru-com`
- 環境変数（`BRIDGETOWN_ENV`, `BUNDLE_WITHOUT`）は不要になる

## Build Steps

```
checkout (fetch-depth: 0)
  └─ ruby/setup-ruby (bundler-cache: true)
  └─ actions/setup-node (cache: npm)
  └─ npm ci
  └─ bin/bridgetown deploy
       └─ rake clean
       └─ node esbuild.config.js --minify
       └─ bridgetown build
  └─ cloudflare/pages-action → output/ をアップロード
```
