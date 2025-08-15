// Load publications from JSON
let publicationsData = [];
let showSelected = true;

async function loadPublications() {
    try {
        const response = await fetch('publications.json');
        const data = await response.json();
        publicationsData = data.publications;
        displayPublications();
    } catch (error) {
        console.error('Error loading publications:', error);
    }
}

function displayPublications() {
    const container = document.getElementById('publicationsList');
    const publications = showSelected 
        ? publicationsData.filter(pub => pub.selected) 
        : publicationsData;
    
    container.innerHTML = publications.map(pub => createPublicationHTML(pub)).join('');
}

// Helper function to get icon for link type
function getLinkIcon(key, url) {
    const icons = {
        'paper': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
        </svg>`,
        'arxiv': `<img src="images/icons/arxiv-logomark-small.svg" class="link-icon-img" alt="arXiv">`,  // Updated path
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
            <line x1="10" y1="8" x2="14" y2="8"/>
            <line x1="10" y1="12" x2="14" y2="12"/>
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
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="15" y2="17"/>
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
        'bibtex': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <text x="12" y="14" text-anchor="middle" font-size="8" fill="currentColor">BIB</text>
        </svg>`,
        'slides': `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>`
    };
    
    // Check URL patterns for automatic icon selection
    if (url) {
        if (url.includes('github.com')) return icons.github || icons.code;
        if (url.includes('arxiv.org')) return icons.arxiv;  // Will use your arxiv-logomark-small.svg
        if (url.includes('youtube.com') || url.includes('youtu.be')) return icons.video;
        if (url.includes('huggingface.co')) {
            if (url.includes('/datasets/')) return icons.data;
            return icons.model;
        }
    }
    
    // Return icon by key or default
    return icons[key.toLowerCase()] || icons.website;
}

function createPublicationHTML(pub) {
    const authorsHtml = pub.authors.map(author => 
        author.includes('Yue Yang') ? `<strong>${author}</strong>` : author
    ).join(', ');
    
    // Create links with icons
    const linksHtml = Object.entries(pub.links || {})
        .map(([key, url]) => {
            const icon = getLinkIcon(key, url);
            const label = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
            return `<a href="${url}" target="_blank">${icon}${label}</a>`;
        })
        .join('');
    
    const imageHtml = pub.video 
        ? `<div class="publication-image">
               ${pub.videoCaption ? `<div class="video-caption">${pub.videoCaption}</div>` : ''}
               <video autoplay muted loop>
                   <source src="${pub.video}" type="video/mp4">
               </video>
           </div>`
        : pub.image 
        ? `<div class="publication-image">
               <img src="${pub.image}" alt="${pub.title}">
           </div>`
        : '';
    
    const awardHtml = pub.award ? `<span class="award">(${pub.award})</span>` : '';
    
    // Create expandable TL;DR with unique ID
    const tldrHtml = pub.tldr ? `
        <div class="publication-tldr collapsed" id="tldr-${pub.id}">
            <div class="tldr-content">
                <strong>TL;DR:</strong> ${pub.tldr}
            </div>
            <button class="tldr-toggle" onclick="toggleTldr('${pub.id}')" aria-label="Expand">
                <span class="toggle-text">more</span>
                <svg class="toggle-icon" width="12" height="12" viewBox="0 0 12 12">
                    <path d="M6 9L3 6h6z" fill="currentColor"/>
                </svg>
            </button>
        </div>
    ` : '';
    
    return `
        <div class="publication-item">
            ${imageHtml}
            <div class="publication-content">
                <div class="publication-title">
                    <a href="${pub.links?.paper || pub.links?.arxiv || '#'}" target="_blank">${pub.title}</a>
                </div>
                <div class="publication-authors">${authorsHtml}</div>
                <div class="publication-venue">
                    <strong>${pub.venue}</strong> ${pub.year} ${awardHtml}
                </div>
                ${linksHtml ? `<div class="publication-links">${linksHtml}</div>` : ''}
                ${tldrHtml}
            </div>
        </div>
    `;
}

// Add toggle function
function toggleTldr(pubId) {
    const tldrElement = document.getElementById(`tldr-${pubId}`);
    const toggleBtn = tldrElement.querySelector('.tldr-toggle');
    const toggleText = toggleBtn.querySelector('.toggle-text');
    const toggleIcon = toggleBtn.querySelector('.toggle-icon');
    
    if (tldrElement.classList.contains('collapsed')) {
        tldrElement.classList.remove('collapsed');
        tldrElement.classList.add('expanded');
        toggleText.textContent = 'less';
        toggleIcon.style.transform = 'rotate(180deg)';
    } else {
        tldrElement.classList.remove('expanded');
        tldrElement.classList.add('collapsed');
        toggleText.textContent = 'more';
        toggleIcon.style.transform = 'rotate(0deg)';
    }
}

// Toggle between selected and all publications
document.addEventListener('DOMContentLoaded', () => {
    loadPublications();
    
    const selectedBtn = document.getElementById('selectedBtn');
    const allBtn = document.getElementById('allBtn');
    
    selectedBtn.addEventListener('click', () => {
        showSelected = true;
        selectedBtn.classList.add('active');
        allBtn.classList.remove('active');
        displayPublications();
    });
    
    allBtn.addEventListener('click', () => {
        showSelected = false;
        allBtn.classList.add('active');
        selectedBtn.classList.remove('active');
        displayPublications();
    });
});

// Smooth scroll with offset for sticky nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Height of sticky nav
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