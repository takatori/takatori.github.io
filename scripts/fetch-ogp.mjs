#!/usr/bin/env node

// posts/*/index.md 内のベアURL（行にURLのみ）からOGPデータを取得し、
// _data/ogp.json にキャッシュする。
//
// 使い方: node scripts/fetch-ogp.mjs
//   --force  キャッシュを無視して全て再取得

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS_DIR = join(ROOT, "posts");
const CACHE_PATH = join(ROOT, "_data", "ogp.json");
const TIMEOUT_MS = 10000;
const FORCE = process.argv.includes("--force");

/** posts ディレクトリ以下の index.md を再帰的に収集 */
function findMarkdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...findMarkdownFiles(full));
    } else if (entry === "index.md") {
      files.push(full);
    }
  }
  return files;
}

/** Markdown ファイルからカード対象URLを抽出
 *  - ベアURL: 行全体がURLのみ
 *  - 単独リンク: 行全体が [text](url) のみ
 */
function extractCardUrls(content) {
  const urls = new Set();
  let inFrontMatter = false;
  let frontMatterCount = 0;
  let inCodeBlock = false;

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    // front matter のスキップ
    if (trimmed === "---") {
      frontMatterCount++;
      inFrontMatter = frontMatterCount < 2;
      continue;
    }
    if (inFrontMatter) continue;

    // コードブロックのスキップ
    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // 行全体がURLのみ
    if (/^https?:\/\/\S+$/.test(trimmed)) {
      urls.add(trimmed);
      continue;
    }

    // 行全体が [text](url) のみ
    const linkMatch = trimmed.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (linkMatch) {
      urls.add(linkMatch[2]);
    }
  }
  return [...urls];
}

/** HTML からOGPメタタグを抽出 */
function parseOgp(html) {
  const get = (property) => {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
      "i"
    );
    const re2 = new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
      "i"
    );
    return (html.match(re) || html.match(re2) || [])[1] || "";
  };

  const title =
    get("og:title") ||
    get("twitter:title") ||
    (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] ||
    "";

  const description = get("og:description") || get("twitter:description") || get("description") || "";
  const image = get("og:image") || get("twitter:image") || "";

  return {
    title: title.trim(),
    description: description.trim(),
    image: image.trim(),
  };
}

/** URL から OGP データを取得 */
async function fetchOgp(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OGPFetcher/1.0; +https://takatori.github.io)",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const html = await res.text();
    const ogp = parseOgp(html);

    if (!ogp.title) return null;
    return ogp;
  } catch {
    return null;
  }
}

// --- main ---
async function main() {
  // 既存キャッシュ読み込み
  let cache = {};
  if (!FORCE && existsSync(CACHE_PATH)) {
    try {
      cache = JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
    } catch {
      cache = {};
    }
  }

  // 全ベアURLを収集
  const mdFiles = findMarkdownFiles(POSTS_DIR);
  const allUrls = new Set();
  for (const file of mdFiles) {
    const content = readFileSync(file, "utf-8");
    for (const url of extractCardUrls(content)) {
      allUrls.add(url);
    }
  }

  console.log(`Found ${allUrls.size} card URL(s) in ${mdFiles.length} file(s)`);

  // 未キャッシュのURLを取得
  const toFetch = [...allUrls].filter((url) => !(url in cache));
  if (toFetch.length === 0) {
    console.log("All URLs already cached. Use --force to refetch.");
  }

  for (const url of toFetch) {
    process.stdout.write(`Fetching: ${url} ... `);
    const ogp = await fetchOgp(url);
    if (ogp) {
      cache[url] = ogp;
      console.log(`OK (${ogp.title.slice(0, 40)})`);
    } else {
      cache[url] = null;
      console.log("SKIP (no OGP data)");
    }
  }

  // キャッシュに存在するが記事に含まれないURLを削除
  for (const url of Object.keys(cache)) {
    if (!allUrls.has(url)) {
      delete cache[url];
    }
  }

  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n", "utf-8");
  console.log(`Saved ${Object.keys(cache).length} entries to _data/ogp.json`);
}

main();
