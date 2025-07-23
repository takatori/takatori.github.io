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
# Create new blog post
# File format: _posts/YYYY-MM-DD-title.md
touch _posts/$(date +%Y-%m-%d)-new-post.md

# Deploy changes
git add .
git commit -m "Add new post"
git push origin master
```

## Architecture

### Directory Structure
- `_posts/` - Blog post content in Markdown format
- `README.md` - Repository documentation in Japanese
- GitHub Actions automatically builds and deploys to GitHub Pages

### Post Format
Blog posts require YAML front matter:
```yaml
---
title: "記事タイトル"
date: YYYY-MM-DD
tags: [技術, Jekyll]
---
```

### Technology Stack
- **Jekyll** - Static site generator
- **GitHub Pages** - Hosting platform
- **GitHub Actions** - CI/CD pipeline
- **Markdown** - Content format

## Content Guidelines

- Posts are written in Japanese
- Technical content focuses on programming tips and development tools
- Recent posts include Claude Code usage tips
- No build configuration files present - relies on GitHub Pages default Jekyll setup