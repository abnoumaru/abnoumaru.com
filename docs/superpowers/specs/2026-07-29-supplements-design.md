---
name: supplements-page-design
description: サプリメント一覧ページの設計 — pages セクションに朝・夜タイミング付きテーブルを追加
metadata:
  type: project
---

# サプリメントページ設計

## 概要

`/pages/supplements/` に飲んでいるサプリメントの一覧をタイミング（朝・夜）付きのテーブルで表示するページを追加する。

## ファイル構成

| ファイル | 変更内容 |
|---|---|
| `src/pages/supplements.md` | 新規作成。サプリテーブルを記述 |
| `src/pages/index.md` | サプリメントページへのリンクを追加 |
| `frontend/styles/supplements.css` | テーブル用スタイルを新規作成 |
| `frontend/styles/index.css` | `supplements.css` の `@import` を追加 |

## ページ仕様

- **layout**: `default`
- **permalink**: `/pages/supplements/`
- **title**: `supplements`
- **h1**: `サプリメント`

## テーブル構成

朝・夜を別セクション（`<h2>` 見出し＋テーブル）に分ける。カラム：製品名 / メモ。

### 朝（起床後〜朝食時）

| 製品名 | メモ |
|---|---|
| キヨーレオピンキャプレット4 | |
| Life Extension Two-Per-Day Multivitamin | |
| 健やかセレクト クエン酸サプリ1200 | クエン酸の働きでCa・Mg吸収率UP |
| ビオスリーHi錠 | |
| エビオス錠 | |

### 夜（夕食直後〜就寝前）

| 製品名 | メモ |
|---|---|
| 「アミノバイタル」® GOLD | |
| ハイチオールCプラスEX | |
| Natrol Biotin | |
| ディアナチュラスタイル 亜鉛 | 夜間成長ホルモン＆タンパク質合成強化 |
| ビオスリーHi錠 | |
| エビオス錠 | |

## スタイル方針

- `global.css` にはテーブルスタイルがないため `supplements.css` を新規作成
- テーブルは横幅いっぱいに広げ、行ごとに交互背景色（zebra stripe）を付けて読みやすくする
- モバイルでは横スクロール可能なコンテナで対応

## 実装アプローチ

案1（採用）：シンプルな静的Markdownページ。既存の `no-smoking.md` と同じパターン。HTMLテーブルを `supplements.md` に直書きする。

YAMLデータ化やERBテンプレート化は行わない（YAGNI）。
