// Load publications from JSON
let publicationsData = [];
let tagLabels = {};
let activeTag = 'highlight';

async function loadPublications() {
    try {
        const response = await fetch('publications.json');
        const data = await response.json();
        publicationsData = data.publications;
        tagLabels = data.tagLabels || {};
        activeTag = data.defaultTag || 'highlight';
        renderTagFilters();
        displayPublications();
    } catch (error) {
        console.error('Error loading publications:', error);
    }
}

function renderTagFilters() {
    const container = document.getElementById('tagFilters');
    if (!container) return;

    // Add "All" button
    let html = `<button class="tag-btn${activeTag === 'all' ? ' active' : ''}" data-tag="all">All</button>`;

    // Add tag buttons
    for (const [key, label] of Object.entries(tagLabels)) {
        html += `<button class="tag-btn${activeTag === key ? ' active' : ''}" data-tag="${key}">${label}</button>`;
    }

    container.innerHTML = html;

    // Bind click events
    container.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeTag = btn.dataset.tag;
            container.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayPublications();
        });
    });
}

function displayPublications() {
    const container = document.getElementById('publicationsList');
    let publications;

    if (activeTag === 'all') {
        publications = publicationsData;
    } else {
        publications = publicationsData.filter(pub => pub.tags && pub.tags.includes(activeTag));
    }

    container.innerHTML = publications.map(pub => createPublicationHTML(pub)).join('');

    // Wait for images/videos to load, then run masonry layout
    const cards = container.querySelectorAll('.pub-card');
    const mediaElements = container.querySelectorAll('.pub-media img, .pub-media video');
    let loaded = 0;
    const total = mediaElements.length;

    function onAllLoaded() {
        layoutMasonry();
        // Set up hover behaviors
        cards.forEach(card => {
            const video = card.querySelector('video');
            if (video) {
                card.addEventListener('mouseenter', () => video.play());
                card.addEventListener('mouseleave', () => {
                    video.pause();
                    video.currentTime = 0;
                });
            }
        });
    }

    if (total === 0) {
        onAllLoaded();
    } else {
        mediaElements.forEach(el => {
            if (el.tagName === 'VIDEO') {
                if (el.readyState >= 1) { loaded++; if (loaded >= total) onAllLoaded(); }
                else el.addEventListener('loadedmetadata', () => { loaded++; if (loaded >= total) onAllLoaded(); });
            } else {
                if (el.complete) { loaded++; if (loaded >= total) onAllLoaded(); }
                else el.addEventListener('load', () => { loaded++; if (loaded >= total) onAllLoaded(); });
            }
        });
        // Fallback in case some media fails to load
        setTimeout(onAllLoaded, 3000);
    }
}

// JS masonry layout — positions cards absolutely in columns
function layoutMasonry() {
    const container = document.getElementById('publicationsList');
    const cards = Array.from(container.querySelectorAll('.pub-card'));
    if (cards.length === 0) return;

    const gap = 16; // 1rem
    const containerWidth = container.offsetWidth;

    // Determine column count based on width
    let cols = 4;
    if (containerWidth < 768) cols = 1;
    else if (containerWidth < 1100) cols = 3;

    const colWidth = (containerWidth - gap * (cols - 1)) / cols;
    const colHeights = new Array(cols).fill(0);

    cards.forEach(card => {
        // Find the shortest column
        const minHeight = Math.min(...colHeights);
        const colIndex = colHeights.indexOf(minHeight);

        card.style.width = colWidth + 'px';
        card.style.left = colIndex * (colWidth + gap) + 'px';
        card.style.top = colHeights[colIndex] + 'px';

        colHeights[colIndex] += card.offsetHeight + gap;
    });

    // Set container height
    container.style.height = Math.max(...colHeights) + 'px';
}

// Re-layout on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutMasonry, 150);
});

// Helper function to get icon for link type
function getLinkIcon(key, url) {
    const icons = {
        'paper': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>`,
        'arxiv': `<img src="images/icons/arxiv-logomark-small.svg" class="link-icon-img" alt="arXiv">`,
        'website': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>`,
        'code': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
        </svg>`,
        'github': `<svg class="link-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>`,
        'data': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <ellipse cx="12" cy="5" rx="9" ry="3"/>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>`,
        'dataset': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <ellipse cx="12" cy="5" rx="9" ry="3"/>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>`,
        'demo': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>`,
        'blog': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>`,
        'video': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>`,
        'talk': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>`,
        'press': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
        </svg>`,
        'model': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>`,
        'models': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>`,
        'report': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>`,
        'slides': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>`
    };

    if (url) {
        if (url.includes('github.com')) return icons.github || icons.code;
        if (url.includes('arxiv.org')) return icons.arxiv;
        if (url.includes('youtube.com') || url.includes('youtu.be')) return icons.video;
        if (url.includes('huggingface.co')) {
            if (url.includes('/datasets/')) return icons.data;
            return icons.model;
        }
    }

    return icons[key.toLowerCase()] || icons.website;
}

function createPublicationHTML(pub) {
    const authorsHtml = pub.authors.map(author =>
        author.includes('Yue Yang') ? `<strong>${author}</strong>` : author
    ).join(', ');

    const linksHtml = Object.entries(pub.links || {})
        .map(([key, url]) => {
            const icon = getLinkIcon(key, url);
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            return `<a href="${url}" target="_blank">${icon}${label}</a>`;
        })
        .join('');

    // Media: image or video
    let mediaHtml = '';
    if (pub.video) {
        mediaHtml = `<div class="pub-media">
            <video muted loop playsinline preload="metadata">
                <source src="${pub.video}" type="video/mp4">
            </video>
        </div>`;
    } else if (pub.image) {
        mediaHtml = `<div class="pub-media">
            <img src="${pub.image}" alt="${pub.title}" loading="lazy">
        </div>`;
    }

    const awardHtml = pub.award ? `<span class="pub-award">${pub.award}</span>` : '';

    // Tags display (with data-tag for colored styling)
    const tagsHtml = (pub.tags || [])
        .filter(t => t !== 'highlight')
        .map(t => `<span class="pub-tag" data-tag="${t}">${tagLabels[t] || t}</span>`)
        .join('');

    // Venue line
    const venueLine = `<span class="pub-venue-text">${pub.venue} ${pub.year}</span>`;

    // TL;DR
    const tldrHtml = pub.tldr ? `<div class="pub-tldr"><strong>TL;DR:</strong> ${pub.tldr}</div>` : '';

    return `
        <div class="pub-card${pub.tags && pub.tags.includes('highlight') ? ' is-highlight' : ''}" data-id="${pub.id}">
            ${mediaHtml}
            <div class="pub-summary">
                <div class="pub-title">${pub.title}</div>
                <div class="pub-meta">
                    ${venueLine}
                    ${awardHtml}
                </div>
                ${tagsHtml ? `<div class="pub-tags">${tagsHtml}</div>` : ''}
            </div>
            <div class="pub-details">
                <div class="pub-authors">${authorsHtml}</div>
                ${linksHtml ? `<div class="pub-links">${linksHtml}</div>` : ''}
                ${tldrHtml}
            </div>
        </div>
    `;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPublications();
});

// Smooth scroll with offset for sticky nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});
