---
title: 'SLOいつ決めましょう？というタイトルで #第3木曜LT会 に登壇した'
description: '登壇してきました'
pubDate: 'May 18 2024'
tags: ["登壇","SRE","SLO","ログ"]
isTech: true
---

## このページは

[SREどうでしょう？というテーマのLT会](https://metaps.connpass.com/event/313921/) で登壇してきた。

資料は[こちら](https://speakerdeck.com/abnoumaru/sloitujue-memasiyou)。

## 内容について

以前 [SREたちの廊下](https://findy.connpass.com/event/311323/) というイベントをオンライン視聴していた際に「SLOは最初から設定したほうがいいですか？」というコメントがあった。
この登壇はそのコメントについて自分なりに回答するような内容になっている。
自分は大きな組織でSLOを導入してみるお手伝いをした経験があるので、その体験をベースに話を進めていった。

資料にある通り、SLOに関する処理を反復するに価値があると思っていて、
「SLOという共通の物差しを持って会話をする時間で組織としていい変化や気付きがあるよ。」
「それらの価値のある反復を増やしたり。共通の物差しをなるべく手に入れるために早めに始めるのがいいんじゃないかな？」というのが、伝えたいことだった。

## もうひとつの早く始めたほうがいい理由

SLOというより何かを集計したいときによくありがちな問題として「運用開始後ログ出力を直す必要が出てくると大変」があると思っている。

例えば「SLOを計測したいからこういうログ出力にしてほしい」とか「ログ集約をするためにこういうフォーマットでログを出力してほしい」といったコミュニケーションが最近増えてきていたと感じる。
（昔は単一のサーバにログインして集計してもそんなに手間ではなかったかもしれないが、いまはシステムが分散された結果として集約・計測が当たり前になってることが理由だと思っている。）

組織やサービスが大きくなってくると様々な理由で、こういうログ出力を直すタスクは時間がかかるのかな、と体感している。
例えばいろいろなツールでログを使ってるからフォーマットを直すならたくさん調整が必要である、とか。

ただログを計測する際にログ出力が意図した通りでないと、思ったように値が取れなかったり、集計先のツールの機能をうまく使えこなせなったりする。
例えばCloud Loggingにログを転送する場合、特別なJSONフィールドがある。これによりログがキレイに構造化されて視認性やクエリしやすさが変わってくる。
https://cloud.google.com/logging/docs/structured-logging?hl=ja#structured_logging_special_fields

SLOをなるべく意味ある数字にしたり集計しやすくするためにも、早い段階できればリリース前に検討できると良いなと思っている。

## 最後に

関わってくれた皆様ありがとうございました。
