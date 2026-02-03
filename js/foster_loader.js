/**
 * Foster Animal Loader
 * Fetches data from a Google Sheet (published as CSV) and renders cards.
 */

// CONFIGURATION: Replace this URL with your published Google Sheet CSV URL
// How to get this URL:
// 1. Open your Google Sheet
// 2. Go to File > Share > Publish to web
// 3. Select "Entire Document" (or specific sheet) and "Comma-separated values (.csv)"
// 4. Click Publish and copy the link
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKivzfFAQjXalXrHQpSzYyA4RxJGfIi9H0hPI6wAyhApeRrHNT15Cv0eqvMuTVQ-TLsZFUqpxLZldQ/pub?output=csv";

// fallback data in case the sheet is not set up yet (optional, or leave empty)
const FALLBACK_DATA = [];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('foster-container');

    if (!GOOGLE_SHEET_CSV_URL) {
        // If no URL is set, we might want to show a message or use fallback
        // For now, let's just log it and maybe show a placeholder if dev mode
        console.warn('Google Sheet URL is not set in js/foster_loader.js');
        // If you want to keep the current hardcoded ones as fallback until set up, 
        // you wouldn't load this script or would handle it differently.
        // But the plan is to switch. Let's show a message if empty.
        container.innerHTML = '<p class="text-center">現在、情報の読み込み設定中です。</p>';
        return;
    }

    fetch(GOOGLE_SHEET_CSV_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvText => {
            const animals = parseCSV(csvText);
            renderAnimals(animals, container);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            container.innerHTML = '<p class="text-center">データの読み込みに失敗しました。</p>';
        });
});

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const animals = [];

    for (let i = 1; i < lines.length; i++) {
        // Handle simple CSV splitting (doesn't handle commas inside quotes, but enough for simple data)
        const currentLine = lines[i].split(',');

        if (currentLine.length === headers.length) {
            const animal = {};
            for (let j = 0; j < headers.length; j++) {
                animal[headers[j]] = currentLine[j].trim();
            }
            animals.push(animal);
        }
    }
    return animals;
}

function renderAnimals(animals, container) {
    if (animals.length === 0) {
        container.innerHTML = '<p class="text-center">現在、里親募集中の動物はいません。</p>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'foster-grid';

    animals.forEach(animal => {
        // Expected columns: Name, Gender, Age, ImageFilename, Status
        // ImageFilename should be just the name, e.g., "ainyan.png"
        // We assume images are in assets/里親募集中動物/猫/

        // Safety check for image path - can be customized
        const imagePath = `assets/里親募集中動物/猫/${animal['ImageFilename']}`;

        const card = document.createElement('div');
        card.className = 'foster-card';
        card.innerHTML = `
            <img src="${imagePath}" alt="${animal['Name']}" onerror="this.src='assets/images/placeholder.jpg'">
            <div class="foster-info">
                <h4>${animal['Status'] || '募集中'}</h4>
                <p class="foster-name">名前：${animal['Name']}</p>
                <p class="foster-details">性別：${animal['Gender']}　年齢：${animal['Age']}</p>
            </div>
        `;
        grid.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(grid);
}
