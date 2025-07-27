---
title: "ClaudeCodeの使い方Tips集"
date: 2025-07-22
tags: [ClaudeCode, AI, 開発ツール]
description: "ClaudeCodeを使っていて学んだことを一箇所にまとめたTips集です。LLMに読ませたくないファイル管理や利用料金確認など実用的な情報をまとめています。"
---

これはClaudeCodeを使っていて学んだことを一箇所にまとめておくための記事です。
さまざまなTipsが日々公開されているのでまとめておく。

## Cluade Codeとは

Clude CodeとはAnthropicのエージェント型コーディングツール。
作りたいものを自然言語で伝えると、モデルが自律的に考えてコードを実装してくれる。

https://docs.anthropic.com/ja/docs/claude-code/overview


## Tips

### 設定

Claude Code自体の設定はjsonファイルに記述する  
https://docs.anthropic.com/ja/docs/claude-code/settings

| 設定の種類       | ファイルパス                          | 適用範囲           | 用途・特徴                                                                 |
|------------------|----------------------------------------|--------------------|------------------------------------------------------------------------------|
| ユーザー設定     | `~/.claude/settings.json`              | すべてのプロジェクト | グローバルな設定。全プロジェクトに共通して適用される                         |
| プロジェクト設定 | `.claude/settings.json`                | 該当プロジェクトのみ | ソース管理にチェックインされ、チームと共有される設定                         |
| 個人用設定       | `.claude/settings.local.json`          | 該当プロジェクトのみ | 個人的・一時的な設定。ソース管理に含めない。作成時に`.gitignore`に自動で追加 |


ユーザ設定をdotfilesに入れておくと良さそう

#### 読ませたくないファイルの管理

- 機密情報など読ませたくないファイルは `permissions`で制御する
- 設定している項目は`/permissions`コマンドで確認できる

[ClaudeCodeでLLMに読ませたくないファイルを管理する方法](https://izanami.dev/post/d6f25eec-71aa-4746-8c0d-80c67a1459be)



### MCP
https://docs.anthropic.com/ja/docs/claude-code/mcp

### 利用料金を見る

ccussageを使う
[ryoppippi/ccusage - GitHub](https://github.com/ryoppippi/ccusage)

### Kiroのような開発スタイルにする

[Kiroの仕様書駆動開発プロセスをClaude Codeで徹底的に再現した](https://zenn.dev/gotalab/articles/3db0621ce3d6d2)

### Hook
https://docs.anthropic.com/ja/docs/claude-code/hooks-guide


[Claude CodeのHooksは設定したほうがいい](https://syu-m-5151.hatenablog.com/entry/2025/07/14/105812)

### カスタムスラッシュコマンド

[【Claude Codeの活用事例】よく使うカスタムスラッシュコマンド5選！](https://tech.findy.co.jp/entry/2025/07/23/070000)


### Sub Agent

https://zenn.dev/tacoms/articles/552140c84aaefa