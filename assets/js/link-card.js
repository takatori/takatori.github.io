// ベアURL・単独リンクを OGP カードに自動変換する。
// 対応パターン:
//   1. <p><a href="url">url</a></p>    (autolinked bare URL)
//   2. <p>https://...</p>               (plain text bare URL)
//   3. <p><a href="url">text</a></p>    (markdown link alone in paragraph)
(function () {
  var data = window.__ogpData;
  if (!data) return;

  var paragraphs = document.querySelectorAll(".markdown-body p");

  paragraphs.forEach(function (p) {
    // <p> の子要素が1つだけかチェック
    if (p.childNodes.length !== 1) return;

    var child = p.childNodes[0];
    var href = null;

    // パターン1,3: <a> タグが唯一の子要素
    if (child.nodeType === 1 && child.tagName === "A") {
      href = child.getAttribute("href");
    }

    // パターン2: プレーンテキストがURL
    if (child.nodeType === 3) {
      var trimmed = child.textContent.trim();
      if (/^https?:\/\/\S+$/.test(trimmed)) {
        href = trimmed;
      }
    }

    if (!href) return;

    var ogp = data[href];
    if (!ogp || !ogp.title) return;

    var card = document.createElement("div");
    card.className = "link-card";

    var link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    if (ogp.image) {
      var imgWrap = document.createElement("div");
      imgWrap.className = "link-card-image";
      var img = document.createElement("img");
      img.src = ogp.image;
      img.alt = ogp.title;
      img.loading = "lazy";
      imgWrap.appendChild(img);
      link.appendChild(imgWrap);
    }

    var content = document.createElement("div");
    content.className = "link-card-content";

    var title = document.createElement("div");
    title.className = "link-card-title";
    title.textContent = ogp.title;
    content.appendChild(title);

    if (ogp.description) {
      var desc = document.createElement("div");
      desc.className = "link-card-description";
      desc.textContent = ogp.description;
      content.appendChild(desc);
    }

    var domain = document.createElement("div");
    domain.className = "link-card-url";
    try {
      domain.textContent = new URL(href).hostname;
    } catch (e) {
      domain.textContent = href;
    }
    content.appendChild(domain);

    link.appendChild(content);
    card.appendChild(link);
    p.replaceWith(card);
  });
})();
