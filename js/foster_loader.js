/**
 * Foster Animal Loader
 * Fetches animal data from local JSON files and renders cards to the grid.
 */

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('foster-grid');
    if (!grid) return;

    // Load both dogs and cats data
    Promise.all([
        fetch('content/dogs.json').then(res => res.json()),
        fetch('content/cats.json').then(res => res.json())
    ])
        .then(([dogsData, catsData]) => {
            const dogs = dogsData.items || [];
            const cats = catsData.items || [];

            // Combine them: Dogs first, then Cats
            const animals = [...dogs, ...cats];

            renderAnimals(animals, grid);
        })
        .catch(error => {
            console.error('Error loading animal data:', error);
            grid.innerHTML = '<p class="text-center">データの読み込みに失敗しました。</p>';
        });
});

function renderAnimals(animals, container) {
    if (animals.length === 0) {
        container.innerHTML = '<p class="text-center">現在、里親募集中の動物はいません。</p>';
        return;
    }

    container.innerHTML = ''; // Clear container

    animals.forEach(animal => {
        const card = document.createElement('div');
        card.className = 'foster-card hidden'; // Hidden by default for scroll animation

        // Use placeholder if image is missing
        const imgSrc = animal.image || 'assets/images/placeholder.jpg';

        card.innerHTML = `
            <div class="foster-img-wrap">
                <img src="${imgSrc}" alt="${animal.name}" onerror="this.src='assets/images/placeholder.jpg'">
            </div>
            <div class="foster-info">
                <span class="foster-tag">${animal.status || '募集中'}</span>
                <h3 class="foster-name">${animal.name}</h3>
                <p class="foster-details">性別：${animal.gender}　年齢：${animal.age}</p>
                <p class="foster-desc" style="font-size: 0.85rem; margin-top: 10px; color: var(--color-text-light); height: 3.6em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${animal.description || ''}</p>
            </div>
        `;

        // Add Click Event to open details
        card.addEventListener('click', () => {
            openAnimalModal(animal);
        });

        container.appendChild(card);
    });

    // Re-initialize scroll animation for newly added cards
    if (window.refreshScrollAnimations) {
        window.refreshScrollAnimations();
    }
}

/**
 * Opens the animal detail modal with specific data
 */
function openAnimalModal(animal) {
    const modal = document.getElementById('modalAnimal');
    if (!modal) return;

    // Set content
    document.getElementById('modalAnimalName').innerText = animal.name;
    document.getElementById('modalAnimalTag').innerText = animal.status || '募集中';
    document.getElementById('modalAnimalDetails').innerText = `性別：${animal.gender}　年齢：${animal.age}`;
    document.getElementById('modalAnimalDesc').innerText = animal.description || '紹介文は現在準備中です。';

    const imgSrc = animal.image || 'assets/images/placeholder.jpg';
    document.getElementById('modalAnimalImg').style.backgroundImage = `url('${imgSrc}')`;

    // Show modal
    modal.style.display = 'block';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
