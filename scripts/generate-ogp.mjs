#!/usr/bin/env node

// 各記事の index.md から OGP 画像 (ogp.png) を自動生成する。
// 既に ogp.png が存在する記事はスキップする。
//
// 使い方: node scripts/generate-ogp.mjs
//   --force  既存画像も含めて全て再生成

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = join(ROOT, "posts");
const FONT_PATH = join(ROOT, "scripts", "fonts", "NotoSansJP-Bold.ttf");
const FORCE = process.argv.includes("--force");

const WIDTH = 1200;
const HEIGHT = 630;

// front matter からタイトルと日付を取得
function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (m) fm[m[1]] = m[2];
  }
  return fm;
}

// タイトルを適切な位置で改行する
function wrapTitle(title, maxChars) {
  const lines = [];
  let current = "";
  for (const char of title) {
    current += char;
    if (current.length >= maxChars) {
      lines.push(current);
      current = "";
    }
  }
  if (current) lines.push(current);
  return lines;
}

// OGP 画像を生成
async function generateOgpImage(title, date, tags) {
  const fontData = readFileSync(FONT_PATH);
  const titleLines = wrapTitle(title, 20);
  const titleSize = title.length > 30 ? 42 : title.length > 20 ? 48 : 56;
  const dateStr = date ? date.replace(/-/g, ".") : "";
  const tagStr = tags ? tags.replace(/[\[\]]/g, "").split(",").map(t => t.trim()).filter(Boolean).join("  /  ") : "";

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          padding: "60px",
          fontFamily: "Noto Sans JP",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                width: "100%",
              },
              children: titleLines.map((line) => ({
                type: "div",
                props: {
                  style: {
                    color: "#ffffff",
                    fontSize: titleSize,
                    fontWeight: 700,
                    lineHeight: 1.4,
                    textAlign: "center",
                  },
                  children: line,
                },
              })),
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                width: "100%",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    },
                    children: [
                      tagStr
                        ? {
                            type: "div",
                            props: {
                              style: {
                                color: "#64b5f6",
                                fontSize: 18,
                              },
                              children: tagStr,
                            },
                          }
                        : null,
                      {
                        type: "div",
                        props: {
                          style: {
                            color: "#8899aa",
                            fontSize: 20,
                          },
                          children: dateStr,
                        },
                      },
                    ].filter(Boolean),
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      color: "#8899aa",
                      fontSize: 22,
                    },
                    children: "takatori.github.io",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Noto Sans JP",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });
  return resvg.render().asPng();
}

// フォントがなければダウンロード
const FONT_URL = "https://fonts.gstatic.com/s/notosansjp/v56/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf";

async function ensureFont() {
  if (existsSync(FONT_PATH)) return;
  const { mkdirSync } = await import("fs");
  mkdirSync(dirname(FONT_PATH), { recursive: true });
  console.log("Downloading font...");
  const res = await fetch(FONT_URL);
  if (!res.ok) throw new Error(`Font download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(FONT_PATH, buf);
  console.log("Font downloaded.");
}

// --- main ---
async function main() {
  await ensureFont();

  const dirs = readdirSync(POSTS_DIR).filter((d) =>
    statSync(join(POSTS_DIR, d)).isDirectory()
  );

  let generated = 0;
  let skipped = 0;

  for (const dir of dirs) {
    const mdPath = join(POSTS_DIR, dir, "index.md");
    const ogpPath = join(POSTS_DIR, dir, "ogp.png");

    if (!existsSync(mdPath)) continue;

    if (!FORCE && existsSync(ogpPath)) {
      console.log(`SKIP: ${dir}/ogp.png (already exists)`);
      skipped++;
      continue;
    }

    const content = readFileSync(mdPath, "utf-8");
    const fm = parseFrontMatter(content);

    if (!fm.title) {
      console.log(`SKIP: ${dir} (no title)`);
      skipped++;
      continue;
    }

    process.stdout.write(`Generating: ${dir}/ogp.png ... `);
    const png = await generateOgpImage(fm.title, fm.date, fm.tags);
    writeFileSync(ogpPath, png);
    console.log("OK");
    generated++;
  }

  console.log(`Done: ${generated} generated, ${skipped} skipped`);
}

main();
