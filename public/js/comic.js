// Base URL API
const BASE_URL = 'https://www.sankavollerei.com/comic';

// State management
let currentPage = 'home';
let currentSliderIndex = 0;
let sliderInterval;
let searchQuery = '';
let currentManhwaSlug = '';
let currentChapterSlug = '';
let chaptersList = [];

// DOM Elements
const homePage = document.getElementById('homePage');
const searchPage = document.getElementById('searchPage');
const detailPage = document.getElementById('detailPage');
const readerPage = document.getElementById('readerPage');
const searchInput = document.querySelector('.search-input');
const sliderContainer = document.getElementById('sliderContainer');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const latestGrid = document.getElementById('latestGrid');
const popularGrid = document.getElementById('popularGrid');
const topRatedGrid = document.getElementById('topRatedGrid');
const searchGrid = document.getElementById('searchGrid');
const searchInfo = document.getElementById('searchInfo');
const prevChapter = document.getElementById('prevChapter');
const nextChapter = document.getElementById('nextChapter');
const readerTitle = document.getElementById('readerTitle');
const readerContent = document.getElementById('readerContent');

// Initialize the application
function init() {
    // Load home page data
    loadHomePage();

    // Set up event listeners
    setupEventListeners();

    // Handle routing based on URL
    handleRouting();
}

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchQuery = searchInput.value.trim();
                if (searchQuery) {
                    navigateToPage('search');
                    performSearch(searchQuery);
                }
            }
        });
    }

    // Slider navigation
    if (sliderPrev) {
        sliderPrev.addEventListener('click', () => {
            navigateSlider(-1);
        });
    }

    if (sliderNext) {
        sliderNext.addEventListener('click', () => {
            navigateSlider(1);
        });
    }

    // Chapter navigation
    if (prevChapter) {
        prevChapter.addEventListener('click', loadPreviousChapter);
    }

    if (nextChapter) {
        nextChapter.addEventListener('click', loadNextChapter);
    }
}

// Handle routing based on URL
function handleRouting() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.includes('search.html') || params.get('search')) {
        searchQuery = params.get('search') || '';
        if(searchInput) searchInput.value = searchQuery;
        navigateToPage('search');
        if (searchQuery) performSearch(searchQuery);
    } else if (path.includes('detail.html') || params.get('detail')) {
        currentManhwaSlug = params.get('detail') || '';
        navigateToPage('detail');
        loadManhwaDetail(currentManhwaSlug);
    } else if (path.includes('chapter.html') || params.get('chapter')) {
        currentChapterSlug = params.get('chapter') || '';
        navigateToPage('reader');
        loadChapter(currentChapterSlug);
    } else if (path.includes('popular.html')) {
        navigateToPage('popular');
    } else if (path.includes('latest.html')) {
        navigateToPage('latest');
    } else if (path.includes('recommendations.html')) {
        navigateToPage('recommendations');
    } else if (path.includes('top-weekly.html')) {
        navigateToPage('top-weekly');
    } else {
        navigateToPage('home');
    }
}

// Navigate between pages
function navigateToPage(page) {
    // Hide all pages
    if (homePage) homePage.style.display = 'none';
    if (searchPage) searchPage.style.display = 'none';
    if (detailPage) detailPage.style.display = 'none';
    if (readerPage) readerPage.style.display = 'none';

    // Stop slider if leaving home page
    if (currentPage === 'home' && page !== 'home') {
        clearInterval(sliderInterval);
    }

    // Show the target page
    switch(page) {
        case 'home':
            if (homePage) homePage.style.display = 'block';
            currentPage = 'home';
            // Restart slider if needed
            if (sliderContainer && sliderContainer.children.length > 0) {
                startSlider();
            }
            break;
        case 'search':
            if (searchPage) searchPage.style.display = 'block';
            currentPage = 'search';
            break;
        case 'detail':
            if (detailPage) {
                detailPage.style.display = 'block';
                const container = detailPage.querySelector('.detail-container');
                if(container) container.style.display = 'flex';
            }
            currentPage = 'detail';
            break;
        case 'reader':
            if (readerPage) readerPage.style.display = 'block';
            currentPage = 'reader';
            break;
        case 'popular':
            if (searchPage) {
                searchPage.style.display = 'block';
                currentPage = 'popular';
                document.querySelector('#searchPage h1').textContent = 'Manhwa Populer';
                loadPopularPage();
            }
            break;
        case 'latest':
            if (searchPage) {
                searchPage.style.display = 'block';
                currentPage = 'latest';
                document.querySelector('#searchPage h1').textContent = 'Manhwa Terbaru';
                loadLatestPage();
            }
            break;
        case 'recommendations':
            if (searchPage) {
                searchPage.style.display = 'block';
                currentPage = 'recommendations';
                document.querySelector('#searchPage h1').textContent = 'Rekomendasi Manhwa';
                loadRecommendationsPage();
            }
            break;
        case 'top-weekly':
            if (searchPage) {
                searchPage.style.display = 'block';
                currentPage = 'top-weekly';
                document.querySelector('#searchPage h1').textContent = 'Top Mingguan';
                loadTopWeeklyPage();
            }
            break;
    }
}

// Load home page data
async function loadHomePage() {
try {
    // Show loading skeletons
    showSkeletons();

    // Fetch home data
    const response = await fetch(`${BASE_URL}/kiryuu/home`);
    const data = await response.json();

    if (data.success) {
        // Populate slider with recommendations
        populateSlider(data.trending.slice(0, 5));

        const latestResponse = await fetch(`${BASE_URL}/kiryuu/latest`);
        const latestData = await latestResponse.json();

        if (latestData.success) {
            populateLatestGrid(latestData.results.slice(0, 12));
        } else {
             showError('Gagal memuat data terbaru.');
        }

        // Populate popular manhwa
        populateGrid(popularGrid, data.popularManhwa.slice(0, 8));

        // Populate top rated (using trending as placeholder)
        populateGrid(topRatedGrid, data.trending.slice(0, 8));
    } else {
        showError('Gagal memuat data home.');
    }
} catch (error) {
    console.error('Error loading home page:', error);
    showError('Gagal memuat data. Silakan coba lagi.');
}
}

// Show loading skeletons
function showSkeletons() {
    // Slider skeleton
    if (sliderContainer) {
        sliderContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const slide = document.createElement('div');
            slide.className = 'slide skeleton skeleton-slide';
            sliderContainer.appendChild(slide);
        }
    }

    // Grid skeletons
    const grids = [latestGrid, popularGrid, topRatedGrid];
    grids.forEach(grid => {
        if (grid) {
            grid.innerHTML = '';
            for (let i = 0; i < 8; i++) {
                const card = document.createElement('div');
                card.className = 'card skeleton skeleton-card';
                grid.appendChild(card);
            }
        }
    });
}

// Populate slider with data
function populateSlider(items) {
    if (!sliderContainer) return;
    sliderContainer.innerHTML = '';

    items.forEach(item => {
        const slide = document.createElement('div');
        slide.className = 'slide';

        slide.innerHTML = `
            <img src="${item.imageSrc}" alt="${item.title}">
            <div class="slide-content">
                <div class="slide-title">${item.title}</div>
                <div class="slide-info">
                    <span>⭐ ${item.rating}</span>
                    <span>${item.latestChapter}</span>
                </div>
            </div>
        `;

        // Add click event to navigate to detail page
        slide.addEventListener('click', () => {
            currentManhwaSlug = item.slug;
            navigateToPage('detail');
            loadManhwaDetail(item.slug);
        });

        sliderContainer.appendChild(slide);
    });

    // Start slider if on home page
    if (currentPage === 'home') {
        startSlider();
    }
}

// Start slider auto-play
function startSlider() {
    clearInterval(sliderInterval);
    currentSliderIndex = 0;
    updateSliderPosition();

    sliderInterval = setInterval(() => {
        navigateSlider(1);
    }, 5000);
}

// Navigate slider
function navigateSlider(direction) {
    if (!sliderContainer) return;
    const slides = sliderContainer.children;
    currentSliderIndex = (currentSliderIndex + direction + slides.length) % slides.length;
    updateSliderPosition();

    // Reset auto-play timer
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        navigateSlider(1);
    }, 5000);
}

// Update slider position
function updateSliderPosition() {
    if (sliderContainer) {
        sliderContainer.style.transform = `translateX(-${currentSliderIndex * 100}%)`;
    }
}

// NEW FUNCTION: Populate latest grid with proper data structure
   function populateLatestGrid(items) {
    if (!latestGrid) return;
    latestGrid.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const imageUrl = item.imageSrc;
        const chapterInfo = item.chapter || 'No chapters';
        const rating = item.rating || '-';
        const title = item.title || 'Untitled';

        card.innerHTML = `
            <div class="card-image">
                <img src="${imageUrl}" alt="${title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDIwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCAxMDBIMTIwVjEzMEg4MFYxMDBaIiBmaWxsPSIjQ0VDRUNFIi8+CjxwYXRoIGQ9Ik02MCA3MEgxNDBWMTYwSDYwVjcwWiIgZmlsbD0iI0NFQ0VDRSIvPgo8L3N2Zz4K'">
                <div class="card-rating">⭐ ${rating}</div>
            </div>
            <div class="card-content">
                <div class="card-title">${title}</div>
                <div class="card-info">
                    <span>${chapterInfo}</span>
                </div>
            </div>
        `;

        // Add click event to navigate to detail page
        card.addEventListener('click', () => {
            currentManhwaSlug = item.slug;
            navigateToPage('detail');
            loadManhwaDetail(item.slug);
        });

        latestGrid.appendChild(card);
    });
}

// Populate grid with data - FIXED VERSION
function populateGrid(grid, items) {
    if (!grid) return;
    grid.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const imageUrl = item.imageSrc || item.image;
        const chapterInfo = item.latestChapter || item.chapter || '';
        const rating = item.rating || '-';
        const title = item.title || 'Untitled';

        card.innerHTML = `
            <div class="card-image">
                <img src="${imageUrl}" alt="${title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDIwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCAxMDBIMTIwVjEzMEg4MFYxMDBaIiBmaWxsPSIjQ0VDRUNFIi8+CjxwYXRoIGQ9Ik02MCA3MEgxNDBWMTYwSDYwVjcwWiIgZmlsbD0iI0NFQ0VDRSIvPgo8L3N2Zz4K'">
                <div class="card-rating">⭐ ${rating}</div>
            </div>
            <div class="card-content">
                <div class="card-title">${title}</div>
                <div class="card-info">
                    <span>${chapterInfo}</span>
                </div>
            </div>
        `;

        // Add click event to navigate to detail page
        card.addEventListener('click', () => {
            currentManhwaSlug = item.slug;
            navigateToPage('detail');
            loadManhwaDetail(item.slug);
        });

        grid.appendChild(card);
    });
}

// Perform search
async function performSearch(query) {
    try {
        if (!searchGrid) return;
        // Show loading state
        searchGrid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const card = document.createElement('div');
            card.className = 'card skeleton skeleton-card';
            searchGrid.appendChild(card);
        }

        if (searchInfo) searchInfo.textContent = `Mencari "${query}"...`;

        // Fetch search results
        const response = await fetch(`${BASE_URL}/kiryuu/search/${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.success) {
            if (searchInfo) searchInfo.textContent = `Menampilkan ${data.seriesList.length} hasil untuk "${query}"`;
            populateGrid(searchGrid, data.seriesList);
        } else {
            if (searchInfo) searchInfo.textContent = `Tidak ada hasil untuk "${query}"`;
            searchGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error performing search:', error);
        if (searchInfo) searchInfo.textContent = `Terjadi kesalahan saat mencari "${query}"`;
        if (searchGrid) searchGrid.innerHTML = '';
    }
}

// Load manhwa detail
async function loadManhwaDetail(slug) {
    try {
        const detailContainer = document.querySelector('.detail-container');
        if (!detailContainer) return;
        // Show loading state
        detailContainer.innerHTML = '<div class="skeleton skeleton-card" style="height: 400px;"></div>';

        // Fetch manhwa detail
        const response = await fetch(`${BASE_URL}/kiryuu/manga/${slug}`);
        const data = await response.json();

        if (data.success) {
            // Store chapters for navigation
            chaptersList = data.chapters || [];

            // Populate detail page
            detailContainer.innerHTML = `
                <div class="detail-header">
                    <div class="detail-cover">
                        <img src="${data.imageSrc}" alt="${data.title}">
                    </div>
                    <div class="detail-info">
                        <h1 class="detail-title">${data.title}</h1>
                        <div class="detail-meta">
                            <span class="detail-rating">⭐ ${data.rating}</span>
                            <span>${data.status}</span>
                            <span>${data.type}</span>
                            <span>${data.released}</span>
                        </div>
                        <div class="detail-genres">
                            ${data.genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
                        </div>
                        <div class="detail-synopsis">
                            <p>${data.synopsis}</p>
                        </div>
                        <div class="detail-actions">
                            <button class="btn btn-primary" id="readFirstChapter">
                                Baca Chapter Pertama
                            </button>
                            <button class="btn btn-secondary" id="followManhwa">
                                Ikuti
                            </button>
                        </div>
                        <div class="detail-meta">
                            <span>${data.followedBy}</span>
                        </div>
                    </div>
                </div>
                <div class="chapters-list">
                    <div class="chapters-header">Daftar Chapter</div>
                    ${chaptersList.map(chapter => `
                        <div class="chapter-item" data-slug="${chapter.slug}">
                            <span>${chapter.title}</span>
                            <span class="chapter-date">${chapter.date}</span>
                        </div>
                    `).join('')}
                </div>
            `;

            // Add event listeners for chapters
            document.querySelectorAll('.chapter-item').forEach(item => {
                item.addEventListener('click', () => {
                    currentChapterSlug = item.getAttribute('data-slug');
                    navigateToPage('reader');
                    loadChapter(currentChapterSlug);
                });
            });

            // Add event listener for read first chapter button
            const readFirstChapterBtn = document.getElementById('readFirstChapter');
            if (readFirstChapterBtn) {
                readFirstChapterBtn.addEventListener('click', () => {
                    if (chaptersList.length > 0) {
                        currentChapterSlug = chaptersList[0].slug;
                        navigateToPage('reader');
                        loadChapter(currentChapterSlug);
                    }
                });
            }
        } else {
            showError('Gagal memuat detail manhwa.');
        }
    } catch (error) {
        console.error('Error loading manhwa detail:', error);
        showError('Gagal memuat detail manhwa.');
    }
}

// Load chapter
async function loadChapter(slug) {
    try {
        if (!readerContent) return;
        // Show loading state
        readerContent.innerHTML = '<div class="skeleton skeleton-card" style="height: 500px; margin-bottom: 10px;"></div>'.repeat(5);

        // Fetch chapter data
        const response = await fetch(`${BASE_URL}/kiryuu/chapter/${slug}`);
        const data = await response.json();

        if (data.success) {
            // Update reader title
            if (readerTitle) readerTitle.textContent = data.title;

            // Populate chapter images
            readerContent.innerHTML = '';
            data.images.forEach(imageSrc => {
                const img = document.createElement('img');
                img.className = 'reader-image';
                img.src = imageSrc;
                img.alt = data.title;
                readerContent.appendChild(img);
            });

            // Update navigation buttons
            if (prevChapter) prevChapter.disabled = !data.prevSlug;
            if (nextChapter) nextChapter.disabled = !data.nextSlug;

            // Store current chapter slug for navigation
            currentChapterSlug = slug;
        } else {
            showError('Gagal memuat chapter.');
        }
    } catch (error) {
        console.error('Error loading chapter:', error);
        showError('Gagal memuat chapter.');
    }
}

// Load previous chapter
function loadPreviousChapter() {
    if (chaptersList.length > 0) {
        const currentIndex = chaptersList.findIndex(chapter => chapter.slug === currentChapterSlug);
        if (currentIndex > 0) {
            currentChapterSlug = chaptersList[currentIndex - 1].slug;
            loadChapter(currentChapterSlug);
        }
    }
}

// Load next chapter
function loadNextChapter() {
    if (chaptersList.length > 0) {
        const currentIndex = chaptersList.findIndex(chapter => chapter.slug === currentChapterSlug);
        if (currentIndex < chaptersList.length - 1) {
            currentChapterSlug = chaptersList[currentIndex + 1].slug;
            loadChapter(currentChapterSlug);
        }
    }
}

// Load popular page
async function loadPopularPage() {
    try {
        if (!searchGrid) return;
        // Show loading state
        searchGrid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const card = document.createElement('div');
            card.className = 'card skeleton skeleton-card';
            searchGrid.appendChild(card);
        }

        if (searchInfo) searchInfo.textContent = 'Memuat manhwa populer...';

        // Fetch popular data
        const response = await fetch(`${BASE_URL}/kiryuu/popular`);
        const data = await response.json();

        if (data.success) {
            if (searchInfo) searchInfo.textContent = `Menampilkan ${data.results.length} manhwa populer`;
            populateGrid(searchGrid, data.results);
        } else {
            if (searchInfo) searchInfo.textContent = 'Gagal memuat manhwa populer';
            searchGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading popular page:', error);
        if (searchInfo) searchInfo.textContent = 'Terjadi kesalahan saat memuat manhwa populer';
        if (searchGrid) searchGrid.innerHTML = '';
    }
}

// Load latest page
async function loadLatestPage() {
    try {
        if (!searchGrid) return;
        // Show loading state
        searchGrid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const card = document.createElement('div');
            card.className = 'card skeleton skeleton-card';
            searchGrid.appendChild(card);
        }

        if (searchInfo) searchInfo.textContent = 'Memuat manhwa terbaru...';

        // Fetch latest data
        const response = await fetch(`${BASE_URL}/kiryuu/latest`);
        const data = await response.json();

        if (data.success) {
            if (searchInfo) searchInfo.textContent = `Menampilkan ${data.results.length} manhwa terbaru`;
            populateGrid(searchGrid, data.results);
        } else {
            if (searchInfo) searchInfo.textContent = 'Gagal memuat manhwa terbaru';
            searchGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading latest page:', error);
        if (searchInfo) searchInfo.textContent = 'Terjadi kesalahan saat memuat manhwa terbaru';
        if (searchGrid) searchGrid.innerHTML = '';
    }
}

// Load recommendations page
async function loadRecommendationsPage() {
    try {
        if (!searchGrid) return;
        // Show loading state
        searchGrid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const card = document.createElement('div');
            card.className = 'card skeleton skeleton-card';
            searchGrid.appendChild(card);
        }

        if (searchInfo) searchInfo.textContent = 'Memuat rekomendasi...';

        // Fetch recommendations data
        const response = await fetch(`${BASE_URL}/kiryuu/recommendations`);
        const data = await response.json();

        if (data.success) {
            if (searchInfo) searchInfo.textContent = `Menampilkan ${data.results.length} rekomendasi`;
            populateGrid(searchGrid, data.results);
        } else {
            if (searchInfo) searchInfo.textContent = 'Gagal memuat rekomendasi';
            searchGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading recommendations page:', error);
        if (searchInfo) searchInfo.textContent = 'Terjadi kesalahan saat memuat rekomendasi';
        if (searchGrid) searchGrid.innerHTML = '';
    }
}

// Load top weekly page
async function loadTopWeeklyPage() {
    try {
        if (!searchGrid) return;
        // Show loading state
        searchGrid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const card = document.createElement('div');
            card.className = 'card skeleton skeleton-card';
            searchGrid.appendChild(card);
        }

        if (searchInfo) searchInfo.textContent = 'Memuat top mingguan...';

        // Fetch top weekly data
        const response = await fetch(`${BASE_URL}/kiryuu/top-weekly`);
        const data = await response.json();

        if (data.success) {
            if (searchInfo) searchInfo.textContent = `Menampilkan ${data.recommendations.length} top mingguan`;
            populateGrid(searchGrid, data.recommendations);
        } else {
            if (searchInfo) searchInfo.textContent = 'Gagal memuat top mingguan';
            searchGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading top weekly page:', error);
        if (searchInfo) searchInfo.textContent = 'Terjadi kesalahan saat memuat top mingguan';
        if (searchGrid) searchGrid.innerHTML = '';
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-state';
    errorDiv.innerHTML = `
        <div class="error-icon">⚠️</div>
        <div class="error-title">Terjadi Kesalahan</div>
        <div class="error-message">${message}</div>
        <button class="btn btn-primary" onclick="location.reload()">Coba Lagi</button>
    `;

    // Replace current page content with error
    const container = document.querySelector('.container');
    if(container){
        container.innerHTML = '';
        container.appendChild(errorDiv);
    }
}

// Initialize the application.
// We check for 'homePage' to ensure this script only runs on the comic page.
// The script is loaded at the end of the body, so the DOM is ready.
if (document.getElementById('homePage')) {
    init();
}