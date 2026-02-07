document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-list');

    // JSONファイルのパス (キャッシュバスター付き)
    const jsonPath = 'content/news.json?v=' + new Date().getTime();

    if (newsContainer) {
        fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('News file not found');
                }
                return response.json();
            })
            .then(data => {
                renderNews(data.items, newsContainer);
            })
            .catch(error => {
                console.error('Error loading news:', error);
                newsContainer.innerHTML = '<p style="text-align:center; color:#888;">お知らせの読み込みに失敗しました。</p>';
            });
    }

    function renderNews(items, container) {
        if (!items || items.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#888;">現在お知らせはありません。</p>';
            return;
        }

        // 日付順にソート（新しい順）
        // 日付形式が YYYY.MM.DD であることを前提
        items.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 表示件数制限（例えば最新5件）
        const displayItems = items.slice(0, 5);

        let html = '';
        displayItems.forEach(item => {
            const categoryClass = getCategoryClass(item.category);
            const linkUrl = item.url ? item.url : 'javascript:void(0)';
            const linkAttr = item.url && item.url.startsWith('http') ? 'target="_blank"' : '';
            const titleHtml = item.url ? `<a href="${linkUrl}" class="news-link" ${linkAttr}>${item.title}</a>` : `<span class="news-link" style="pointer-events:none;">${item.title}</span>`;

            html += `
                <article class="news-item">
                    <div class="news-date">${item.date}</div>
                    <div class="news-category-badge ${categoryClass}">${item.category}</div>
                    ${titleHtml}
                </article>
            `;
        });

        container.innerHTML = html;
    }

    function getCategoryClass(category) {
        if (category.includes('イベント')) return 'category-event';
        if (category.includes('HRR')) return 'category-hrr';
        return 'category-info';
    }
});
