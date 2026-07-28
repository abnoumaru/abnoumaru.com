# Supplements Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/pages/supplements/` にサプリメント一覧を朝・夜別のテーブルで表示するページを追加する。

**Architecture:** 既存の `no-smoking.md` と同じパターン（`layout: default`）で静的HTMLを `supplements.md` に直書きする。テーブルスタイルは専用の `supplements.css` に分離し、`index.css` から import する。

**Tech Stack:** Bridgetown 2.x, HTML, PostCSS

## Global Constraints

- layout は必ず `default` を使う
- permalink は `/pages/supplements/` とする
- HTML は `no-smoking.md` の書き方に倣い、Markdown混在ではなく純粋な HTML で記述する
- CSS クラス名はページ固有のプレフィックス `.supplements-` を付ける
- コミットメッセージは `Structural:` または `Behavioral:` のプレフィックスを付ける

---

### Task 1: テーブル用CSSの追加（Structural）

**Files:**
- Create: `frontend/styles/supplements.css`
- Modify: `frontend/styles/index.css`

**Interfaces:**
- Produces: `.supplements-table-wrapper`（横スクロール用コンテナ）、`.supplements-table`（テーブル本体）

- [ ] **Step 1: `supplements.css` を新規作成する**

`frontend/styles/supplements.css` を以下の内容で作成する：

```css
.supplements-table-wrapper {
  overflow-x: auto;
  margin-bottom: 2rem;
}

.supplements-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.supplements-table th,
.supplements-table td {
  padding: 0.6rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.supplements-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.supplements-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}
```

- [ ] **Step 2: `index.css` に `@import` を追加する**

`frontend/styles/index.css` の末尾（`syntax-highlighting.css` の前）に追記する。
変更後の `index.css`：

```css
@import url("./global.css");
@import url("./header.css");
@import url("./footer.css");
@import url("./post-list.css");
@import url("./blog-post.css");
@import url("./about.css");
@import url("./links.css");
@import url("./no-smoking.css");
@import url("./supplements.css");
@import url("./syntax-highlighting.css");
```

- [ ] **Step 3: リンターを実行して問題がないか確認する**

```bash
hk check --all
```

エラーがあれば `hk fix --all` で自動修正してから再確認する。

- [ ] **Step 4: コミットする**

```bash
git add frontend/styles/supplements.css frontend/styles/index.css
git commit -m "Structural: add supplements table CSS"
```

---

### Task 2: サプリメントページの作成とindexリンク追加（Behavioral）

**Files:**
- Create: `src/pages/supplements.md`
- Modify: `src/pages/index.md`

**Interfaces:**
- Consumes: `.supplements-table-wrapper`、`.supplements-table`（Task 1 で定義）

- [ ] **Step 1: `src/pages/supplements.md` を新規作成する**

```html
---
layout: default
title: supplements
permalink: /pages/supplements/
---

<h1>サプリメント</h1>

<h2>朝（起床後〜朝食時）</h2>
<div class="supplements-table-wrapper">
  <table class="supplements-table">
    <thead>
      <tr>
        <th>製品名</th>
        <th>メモ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>キヨーレオピンキャプレット4</td>
        <td></td>
      </tr>
      <tr>
        <td>Life Extension Two-Per-Day Multivitamin</td>
        <td></td>
      </tr>
      <tr>
        <td>健やかセレクト クエン酸サプリ1200</td>
        <td>クエン酸の働きでCa・Mg吸収率UP</td>
      </tr>
      <tr>
        <td>ビオスリーHi錠</td>
        <td></td>
      </tr>
      <tr>
        <td>エビオス錠</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

<h2>夜（夕食直後〜就寝前）</h2>
<div class="supplements-table-wrapper">
  <table class="supplements-table">
    <thead>
      <tr>
        <th>製品名</th>
        <th>メモ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>「アミノバイタル」® GOLD</td>
        <td></td>
      </tr>
      <tr>
        <td>ハイチオールCプラスEX</td>
        <td></td>
      </tr>
      <tr>
        <td>Natrol Biotin</td>
        <td></td>
      </tr>
      <tr>
        <td>ディアナチュラスタイル 亜鉛</td>
        <td>夜間成長ホルモン＆タンパク質合成強化</td>
      </tr>
      <tr>
        <td>ビオスリーHi錠</td>
        <td></td>
      </tr>
      <tr>
        <td>エビオス錠</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>
```

- [ ] **Step 2: `src/pages/index.md` にリンクを追加する**

変更後の内容：

```html
---
layout: default
title: pages
permalink: /pages/
---

<h2>pages</h2>
<ul>
  <li><a href="/pages/no-smoking/">禁煙情報</a></li>
  <li><a href="/pages/supplements/">サプリメント</a></li>
</ul>
```

- [ ] **Step 3: ビルドが通ることを確認する**

```bash
bin/bridgetown build
```

期待される出力：`Done! 🎉` または `Build Complete` のような成功メッセージ。エラーがなければOK。

- [ ] **Step 4: リンターを実行する**

```bash
hk check --all
```

エラーがあれば `hk fix --all` で修正後、再実行して確認する。

- [ ] **Step 5: コミットする**

```bash
git add src/pages/supplements.md src/pages/index.md
git commit -m "Behavioral: add supplements page with morning/evening tables"
```
