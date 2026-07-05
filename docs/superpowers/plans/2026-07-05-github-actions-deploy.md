# GitHub Actions Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `.github/workflows/deploy.yml` を作成し、Cloudflare Pages へのデプロイを GitHub Actions 経由に移行する

**Architecture:** main への push をトリガーに、gem/npm キャッシュ付きでビルドし `cloudflare/pages-action` で成果物をアップロードする。Cloudflare Pages のネイティブビルドは既に無効化済み。

**Tech Stack:** GitHub Actions, ruby/setup-ruby, actions/setup-node, cloudflare/pages-action@v1, Bridgetown 2.x

## Global Constraints

- Ruby バージョンは `.ruby-version`（4.0.3）に従う
- Node バージョンは `.node-version`（24.14.0）に従う
- `fetch-depth: 0` は必須（`plugins/builders/git_metadata.rb` が git 履歴を参照するため）
- `BRIDGETOWN_ENV=production` / `BUNDLE_WITHOUT=development:test` は env に必須
- デプロイ対象ディレクトリ: `output/`
- Cloudflare Pages プロジェクト名: `abnoumaru-com`
- GitHub Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` 設定済み

---

### Task 1: ワークフローファイルを作成する

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: main push 時に Cloudflare Pages へデプロイするワークフロー

- [ ] **Step 1: ディレクトリを作成する**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: ワークフローファイルを作成する**

`.github/workflows/deploy.yml` を以下の内容で作成する:

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
          fetch-depth: 0

      - uses: ruby/setup-ruby@v1
        with:
          bundler-cache: true

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

- [ ] **Step 3: YAML 構文を検証する**

```bash
ruby -e "require 'yaml'; YAML.load_file('.github/workflows/deploy.yml'); puts 'OK'"
```

Expected: `OK`

- [ ] **Step 4: コミットして push する**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions deploy workflow"
git push origin main
```

- [ ] **Step 5: GitHub Actions の実行を確認する**

GitHub リポジトリ → **Actions** タブを開き、`Deploy` ワークフローが起動していることを確認する。

各ステップが green になれば完了。失敗した場合はログを確認してエラーを修正する。

- [ ] **Step 6: デプロイ結果を確認する**

`cloudflare/pages-action` ステップのログに表示される URL（`https://abnoumaru-com.pages.dev` など）にアクセスし、サイトが正常に表示されることを確認する。
