# takatori.github.io

**GitHub Pages** + **Jekyll** を使って技術ブログを公開しています。

## 🧱 概要

- Markdown + Jekyll による静的サイト
- GitHub が無料でホスティングしてくれる（GitHub Pages）:contentReference[oaicite:1]{index=1}
- 記事は `_posts` フォルダで管理し、git push で自動デプロイ


## 🛠️ テクノロジースタック

- **Jekyll** (静的サイトジェネレータ):contentReference[oaicite:2]{index=2}
- GitHub Actions を使った自動ビルド＆デプロイ:contentReference[oaicite:3]{index=3}
- テーマ例：`jekyll-theme-minimal`（他にも多数）:contentReference[oaicite:4]{index=4}


## 🚧 セットアップ手順

### 1. リポジトリ作成
```bash
# ユーザーサイトの場合は username.github.io の形式で公開リポジトリを作成
````

### 2. GitHub Pages を有効化

* リポジトリの *Settings → Pages* で branch を選択し、保存

### 3. Jekyll サイト生成

```bash
jekyll new . --skip-bundle
# または `_config.yml` に必要な gem やテーマを追記
```


### 4. ローカルで確認（任意）

#### Docker を使用（推奨）

```bash
# Docker Compose で起動
docker-compose up

# または手動でビルド・実行
docker build -t takatori-blog .
docker run -p 4000:4000 -v $(pwd):/srv/jekyll takatori-blog
```

#### Bundle を使用

```bash
bundle exec jekyll serve
```

ブラウザで `http://localhost:4000` を確認


## ✍️ 記事の書き方

1. `_posts/2025-07-23-your-title.md` のように作成
2. Front Matter を記述：

   ```yaml
   ---
   title: "記事タイトル"
   date: 2025-07-23
   tags: [技術, Jekyll]
   ---
   ```
3. Markdown で本文を書く

4. `git add` → `git commit` → `git push` → 数分後に反映



## 🌐 カスタマイズ&拡張

* **テーマ変更**：`_config.yml` に `theme:` または `remote-theme:` を記述
* **カスタムドメイン**：DNS設定＆GitHub Pages にて指定可
* **コメント/解析**：Disqus、Google Analytics、RSS 連携も可能
* **ドラフト運用**：`_drafts` を活用して非公開記事を管理

---

## 📁 ディレクトリ構成

```
/
├── _config.yml          # Jekyll 設定ファイル
├── _posts/              # ブログ記事
│   └── 2025-07-22-claudecode.md
├── Dockerfile           # Docker 設定
├── docker-compose.yml   # Docker Compose 設定
├── Gemfile             # Ruby 依存関係
├── index.md            # トップページ
├── CLAUDE.md           # Claude Code 用ガイド
└── README.md           # このファイル
```