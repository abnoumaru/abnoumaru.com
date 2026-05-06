# abnoumaru.com

[Bridgetown](https://www.bridgetownrb.com/) で構築している個人ブログ。Cloudflare Pages にデプロイされる。

## Setup

```sh
bundle install
npm install
```

## Commands

| Command                         | Action                                              |
| :------------------------------ | :-------------------------------------------------- |
| `bin/bridgetown start`          | ローカル開発サーバを `http://localhost:4000` で起動 |
| `bin/bridgetown deploy`         | 本番ビルド（Cloudflare Pages と同じコマンド）       |
| `hk check --all`                | 全リンター（Ruby/CSS/HTML/JS）を実行                |
| `hk fix --all`                  | リンターの自動修正                                  |
