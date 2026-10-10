---
title: "Search Engineering Tech Talk 2026 Summerで「AIエージェントのための検索」を発表しました"
date: 2026-07-23
tags: [AI Agent, LLM, 検索, 登壇]
description: "Search Engineering Tech Talk 2026 Summerで「AIエージェントのための検索 - どう検索させ、何を返すか」を発表しました。AIエージェントと人間の検索行動の違いと、エージェント向けの検索手法を紹介しています。"
---

2026年7月23日に開催された[Search Engineering Tech Talk 2026 Summer](https://search-tech.connpass.com/event/396099/)で、「AIエージェントのための検索 - どう検索させ、何を返すか」というタイトルで発表しました。

<iframe class="speakerdeck-iframe" src="https://speakerdeck.com/player/d95669d7b6f44380bbe9249c7de4cfa0" width="710" height="399" style="aspect-ratio:710/399; width:100%; height:auto; border:0; padding:0; margin:0; background:transparent;" frameborder="0" allowtransparency="true" allowfullscreen="allowfullscreen"></iframe>

[AIエージェントのための検索 - Speaker Deck](https://speakerdeck.com/takatorisatoshi/aiezientonotamenojian-suo)

## 発表の内容

AIエージェントは人間とは違う使い方で検索します。人間のクエリは平均2語程度ですが、エージェントのクエリは中央値で10語ほどあり、引用符やサイト指定も多用します。また、エージェントは返された結果をすべてコンテキストに入れるので、無関係な文書が混ざるとその影響を受けやすくなります。

発表では、この違いを踏まえて、エージェント向けの検索を「どう検索させるか」と「何を返すか」の2つの観点で整理しました。

どう検索させるかについては、次の3つのパターンを紹介しました。

- クエリ投げ型: Function callingやMCPで検索APIを呼び、固定のパイプラインで処理する
- コマンド型: `grep`・`ls`・`cat`のようなファイルシステムの語彙で探索させる
- コード型（Search as Code）: 検索のプリミティブをコードで組み合わせさせる

何を返すかについては、従来のRAGのようにチャンクを返す方式、生のコーパスを直接操作させる方式、絞り込んだ範囲をワークスペースとして渡して直接操作させる方式を比べました。

コマンド型の具体的な実装については、以前書いた[検索エンジン上に作るAgent向け仮想ファイルシステム](/posts/20260515-virtual-filesystem-for-agents/)でも紹介しています。
