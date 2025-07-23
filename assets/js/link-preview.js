// Embedded Link Cards functionality
class EmbeddedLinkCards {
  constructor() {
    this.cache = new Map();
    this.corsProxy = 'https://api.allorigins.win/get?url=';
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.processAutoEmbedLinks());
    } else {
      this.processAutoEmbedLinks();
    }
  }

  processAutoEmbedLinks() {
    // Find standalone links that should be auto-embedded
    const paragraphs = document.querySelectorAll('p');
    
    paragraphs.forEach(p => {
      const text = p.textContent.trim();
      const linkRegex = /^https?:\/\/[^\s]+$/;
      
      // Check if paragraph contains only a URL
      if (linkRegex.test(text)) {
        const url = text;
        this.createEmbeddedCard(p, url);
      }
    });
  }

  async createEmbeddedCard(element, url) {
    try {
      // Check cache first
      let data;
      if (this.cache.has(url)) {
        data = this.cache.get(url);
      } else {
        data = await this.fetchOGPData(url);
        this.cache.set(url, data);
      }

      // Create embedded card HTML
      const cardHTML = `
        <div class="link-card" data-url="${url}">
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="link-card-link">
            <div class="link-card-content">
              ${data.image ? `
                <div class="link-card-image-wrapper">
                  <img src="${data.image}" alt="" class="link-card-image" loading="lazy" onerror="this.parentElement.style.display='none'">
                </div>
              ` : ''}
              <div class="link-card-text">
                <h3 class="link-card-title">${this.escapeHtml(data.title)}</h3>
                ${data.description ? `<p class="link-card-description">${this.escapeHtml(data.description)}</p>` : ''}
                <span class="link-card-url">${this.escapeHtml(new URL(url).hostname)}</span>
              </div>
            </div>
          </a>
        </div>
      `;

      // Replace the paragraph with the card
      element.outerHTML = cardHTML;
      
    } catch (error) {
      console.warn('Failed to create embedded card for:', url, error);
    }
  }

  async fetchOGPData(url) {
    const response = await fetch(`${this.corsProxy}${encodeURIComponent(url)}`);
    const data = await response.json();
    const html = data.contents;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    return {
      title: this.getMetaContent(doc, 'og:title') || 
             this.getMetaContent(doc, 'twitter:title') || 
             doc.querySelector('title')?.textContent || 
             'リンク',
      description: this.getMetaContent(doc, 'og:description') || 
                   this.getMetaContent(doc, 'twitter:description') || 
                   this.getMetaContent(doc, 'description') || 
                   '',
      image: this.getMetaContent(doc, 'og:image') || 
             this.getMetaContent(doc, 'twitter:image') || 
             null,
      url: url
    };
  }

  getMetaContent(doc, property) {
    const meta = doc.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
    return meta ? meta.getAttribute('content') : null;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize when script loads
new EmbeddedLinkCards();