/**
 * YonNana CMS Integration Script
 * This script fetches content from the JSON data files managed by Decap CMS.
 */

async function loadCMSContent() {
    // 1. Load News
    const newsContainer = document.querySelector('.news-list');
    if (newsContainer) {
        try {
            const response = await fetch('content/news.json');
            if (response.ok) {
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    newsContainer.innerHTML = ''; // Clear hardcoded
                    data.items.slice(0, 5).forEach(item => renderNewsItem(newsContainer, item));
                }
            }
        } catch (e) {
            console.error('News loading failed', e);
        }
    }

    // 2. Load Dogs
    const dogGrid = document.querySelector('#dog-grid');
    if (dogGrid) {
        try {
            const response = await fetch('content/dogs.json');
            if (response.ok) {
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    dogGrid.innerHTML = '';
                    data.items.forEach(item => renderFosterCard(dogGrid, item));
                }
            }
        } catch (e) {
            console.error('Dogs loading failed', e);
        }
    }

    // 3. Load Cats
    const catGrid = document.querySelector('#cat-grid');
    if (catGrid) {
        try {
            const response = await fetch('content/cats.json');
            if (response.ok) {
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    catGrid.innerHTML = '';
                    data.items.forEach(item => renderFosterCard(catGrid, item));
                }
            }
        } catch (e) {
            console.error('Cats loading failed', e);
        }
    }
}

function renderNewsItem(container, data) {
    const item = document.createElement('div');
    item.className = 'news-item';
    item.innerHTML = `
        <div class="news-date">${data.date.replace(/-/g, '.')}</div>
        <a href="${data.url || '#'}" class="news-link">
            <span class="news-category">${data.category}</span>
            <div class="news-title">${data.title}</div>
        </a>
    `;
    container.appendChild(item);
}

function renderFosterCard(container, data) {
    const card = document.createElement('div');
    card.className = 'foster-card fade-in visible';
    card.setAttribute('data-description', data.description || "");
    card.innerHTML = `
        <img src="${data.image}" alt="${data.name}">
        <div class="foster-info">
            <h4>${data.status}</h4>
            <p class="foster-name">名前：${data.name}</p>
            <p class="foster-details">性別：${data.gender}　年齢：${data.age}</p>
        </div>
    `;
    container.appendChild(card);
}

document.addEventListener('DOMContentLoaded', loadCMSContent);
