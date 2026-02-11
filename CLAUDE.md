# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Jekyll-based technical blog hosted on GitHub Pages. The site publishes Japanese technical articles about programming and development tools.

## Development Commands

### Local Development

#### Using Docker (Recommended)
```bash
# Start with Docker Compose
docker-compose up

# Or build and run manually
docker build -t takatori-blog .
docker run -p 4000:4000 -v $(pwd):/srv/jekyll takatori-blog
```

#### Using Bundle (Alternative)
```bash
# Start local Jekyll server
bundle exec jekyll serve
```

Site will be available at `http://localhost:4000`

### Content Management
```bash
# Create new blog post (directory name: yyyyMMdd-slug)
mkdir posts/20250101-my-new-post
# Create index.md and place images in the same directory
```

## Architecture

### Directory Structure
- `posts/` - Blog posts, each in its own subdirectory
  - `posts/<yyyyMMdd-slug>/index.md` - Post content in Markdown
  - `posts/<yyyyMMdd-slug>/` - Images and other assets for the post
- `_layouts/` - Custom layouts (default, post, home)
- `_includes/` - Reusable HTML partials (head, header, footer)
- `assets/css/style.scss` - Custom styles
- `feed.xml` - Custom Atom feed
- GitHub Actions automatically builds and deploys to GitHub Pages

### Post Format
Each post lives in `posts/<yyyyMMdd-slug>/index.md` with YAML front matter:
```yaml
---
title: "記事タイトル"
date: YYYY-MM-DD
tags: [技術, Jekyll]
description: "記事の説明文"
image: /posts/<yyyyMMdd-slug>/ogp.png  # Optional: OGP image (absolute path)
redirect_from:                 # Optional: redirects from old URLs
  - /old/path/
---

![screenshot](./screenshot.png)  # Images use relative paths
```

- `layout: post` and `author: takatori` are set automatically via `_config.yml` defaults
- URL is determined by directory structure: `/posts/<yyyyMMdd-slug>/`
- Images placed alongside `index.md` can be referenced with relative paths like `./image.png`
- OGP images must use absolute paths (from site root) for social media compatibility

### Technology Stack
- **Jekyll** - Static site generator
- **GitHub Pages** - Hosting platform
- **GitHub Actions** - CI/CD pipeline
- **Markdown** - Content format
- **jekyll-redirect-from** - URL redirect support

## Content Guidelines

- Posts are written in Japanese
- Technical content focuses on programming tips and development tools
- Recent posts include Claude Code usage tips
