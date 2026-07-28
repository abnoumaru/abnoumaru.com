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

カラム：製品名 / タイミング / メモ

| 製品名 | タイミング | メモ |
|---|---|---|
| キヨーレオピンキャプレット4 | 朝 | |
| Life Extension Two-Per-Day Multivitamin | 朝 | |
| 健やかセレクト クエン酸サプリ1200 | 朝 | クエン酸の働きでCa・Mg吸収率UP |
| ビオスリーHi錠 | 朝・夜 | |
| エビオス錠 | 朝・夜 | |
| 「アミノバイタル」® GOLD | 夜 | |
| ハイチオールCプラスEX | 夜 | |
| Natrol Biotin | 夜 | |
| ディアナチュラスタイル 亜鉛 | 夜 | 夜間成長ホルモン＆タンパク質合成強化 |

## スタイル方針

- `global.css` にはテーブルスタイルがないため `supplements.css` を新規作成
- テーブルは横幅いっぱいに広げ、行ごとに交互背景色（zebra stripe）を付けて読みやすくする
- モバイルでは横スクロール可能なコンテナで対応

## 実装アプローチ

案1（採用）：シンプルな静的Markdownページ。既存の `no-smoking.md` と同じパターン。HTMLテーブルを `supplements.md` に直書きする。

YAMLデータ化やERBテンプレート化は行わない（YAGNI）。
