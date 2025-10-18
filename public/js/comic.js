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
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
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

    // Check for dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    // Handle routing based on URL
    handleRouting();
}

// Set up event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleDarkMode);

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Search functionality
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchQuery = searchInput.value.trim();
            if (searchQuery) {
                navigateToPage('search');
                performSearch(searchQuery);
            }
        }
    });

    // Slider navigation
    sliderPrev.addEventListener('click', () => {
        navigateSlider(-1);
    });

    sliderNext.addEventListener('click', () => {
        navigateSlider(1);
    });

    // Chapter navigation
    prevChapter.addEventListener('click', loadPreviousChapter);
    nextChapter.addEventListener('click', loadNextChapter);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && !e.target.closest('.menu-toggle')) {
            navLinks.classList.remove('active');
        }
    });
}

// Handle routing based on URL
function handleRouting() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.includes('search.html') || params.get('search')) {
        searchQuery = params.get('search') || '';
        searchInput.value = searchQuery;
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
        loadPopularPage();
    } else if (path.includes('latest.html')) {
        navigateToPage('latest');
        loadLatestPage();
    } else if (path.includes('recommendations.html')) {
        navigateToPage('recommendations');
        loadRecommendationsPage();
    } else if (path.includes('top-weekly.html')) {
        navigateToPage('top-weekly');
        loadTopWeeklyPage();
    } else {
        navigateToPage('home');
    }
}

// Navigate between pages
function navigateToPage(page) {
    // Hide all pages
    homePage.style.display = 'none';
    searchPage.style.display = 'none';
    detailPage.style.display = 'none';
    readerPage.style.display = 'none';

    // Stop slider if leaving home page
    if (currentPage === 'home' && page !== 'home') {
        clearInterval(sliderInterval);
    }

    // Show the target page
    switch(page) {
        case 'home':
            homePage.style.display = 'block';
            currentPage = 'home';
            // Restart slider if needed
            if (sliderContainer.children.length > 0) {
                startSlider();
            }
            break;
        case 'search':
            searchPage.style.display = 'block';
            currentPage = 'search';
            break;
        case 'detail':
            detailPage.style.display = 'block';
            currentPage = 'detail';
            break;
        case 'reader':
            readerPage.style.display = 'block';
            currentPage = 'reader';
            break;
        case 'popular':
            // For simplicity, we'll use the search page structure for category pages
            searchPage.style.display = 'block';
            currentPage = 'popular';
            document.querySelector('#searchPage h1').textContent = 'Manhwa Populer';
            break;
        case 'latest':
            searchPage.style.display = 'block';
            currentPage = 'latest';
            document.querySelector('#searchPage h1').textContent = 'Manhwa Terbaru';
            break;
        case 'recommendations':
            searchPage.style.display = 'block';
            currentPage = 'recommendations';
            document.querySelector('#searchPage h1').textContent = 'Rekomendasi Manhwa';
            break;
        case 'top-weekly':
            searchPage.style.display = 'block';
            currentPage = 'top-weekly';
            document.querySelector('#searchPage h1').textContent = 'Top Mingguan';
            break;
    }

    // Update URL without reloading the page
    updateURL(page);
}

// Update URL based on current page
function updateURL(page) {
    let url = '/comic';
    let params = new URLSearchParams();

    switch(page) {
        case 'search':
            if (searchQuery) {
                params.set('search', searchQuery);
                url = `/comic?${params.toString()}`;
            }
            break;
        case 'detail':
            if (currentManhwaSlug) {
                params.set('detail', currentManhwaSlug);
                url = `/comic?${params.toString()}`;
            }
            break;
        case 'reader':
            if (currentChapterSlug) {
                params.set('chapter', currentChapterSlug);
                url = `/comic?${params.toString()}`;
            }
            break;
        case 'popular':
            url = '/comic/popular';
            break;
        case 'latest':
            url = '/comic/latest';
            break;
        case 'recommendations':
            url = '/comic/recommendations';
            break;
        case 'top-weekly':
            url = '/comic/top-weekly';
            break;
    }

    window.history.replaceState({}, '', url);
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        themeToggle.textContent = '☀️';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        themeToggle.textContent = '🌙';
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

            // PERBAIKAN: Gunakan data dari API latest untuk bagian "Terbaru"
            // karena data.latestUpdates tidak memiliki title dan rating yang lengkap
            const latestResponse = await fetch(`${BASE_URL}/kiryuu/latest`);
            const latestData = await latestResponse.json();

            if (latestData.success) {
                populateLatestGrid(latestData.results.slice(0, 12));
            }

            // Populate popular manhwa
            populateGrid(popularGrid, data.popularManhwa.slice(0, 8));

            // Populate top rated (using trending as placeholder)
            populateGrid(topRatedGrid, data.trending.slice(0, 8));
        }
    } catch (error) {
        console.error('Error loading home page:', error);
        showError('Gagal memuat data. Silakan coba lagi.');
    }
}

// Show loading skeletons
function showSkeletons() {
    // Slider skeleton
    sliderContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const slide = document.createElement('div');
        slide.className = 'slide skeleton skeleton-slide';
        sliderContainer.appendChild(slide);
    }

    // Grid skeletons
    const grids = [latestGrid, popularGrid, topRatedGrid];
    grids.forEach(grid => {
        grid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const card = document.createElement('div');
            card.className = 'card skeleton skeleton-card';
            grid.appendChild(card);
        }
    });
}

// Populate slider with data
function populateSlider(items) {
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
    sliderContainer.style.transform = `translateX(-${currentSliderIndex * 100}%)`;
}

// NEW FUNCTION: Populate latest grid with proper data structure
function populateLatestGrid(items) {
    latestGrid.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        // PERBAIKAN: Gunakan struktur data yang benar dari API latest
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
    grid.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        // PERBAIKAN: Gunakan struktur data yang benar
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
        // Show loading state
        searchGrid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const card = document.createElement('div');
            card.className = 'card skeleton skeleton-card';
            searchGrid.appendChild(card);
        }

        searchInfo.textContent = `Mencari "${query}"...`;

        // Fetch search results
        const response = await fetch(`${BASE_URL}/kiryuu/search/${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.success) {
            searchInfo.textContent = `Menampilkan ${data.seriesList.length} hasil untuk "${query}"`;
            populateGrid(searchGrid, data.seriesList);
        } else {
            searchInfo.textContent = `Tidak ada hasil untuk "${query}"`;
            searchGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error performing search:', error);
        searchInfo.textContent = `Terjadi kesalahan saat mencari "${query}"`;
        searchGrid.innerHTML = '';
    }
}

// Load manhwa detail
async function loadManhwaDetail(slug) {
    try {
        // Show loading state
        const detailContainer = document.querySelector('.detail-container');
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
            document.getElementById('readFirstChapter').addEventListener('click', () => {
                if (chaptersList.length > 0) {
                    currentChapterSlug = chaptersList[0].slug;
                    navigateToPage('reader');
                    loadChapter(currentChapterSlug);
                }
            });
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
        // Show loading state
        readerContent.innerHTML = '<div class="skeleton skeleton-card" style="height: 500px; margin-bottom: 10px;"></div>'.repeat(5);

        // Fetch chapter data
        const response = await fetch(`${BASE_URL}/kiryuu/chapter/${slug}`);
        const data = await response.json();

        if (data.success) {
            // Update reader title
            readerTitle.textContent = data.title;

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
            prevChapter.disabled = !data.prevSlug;
            nextChapter.disabled = !data.nextSlug;

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
        // Show loading state
        searchGrid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const card = document.createElement('div');
            card.className = 'card skeleton skeleton-card';
            searchGrid.appendChild(card);
        }

        searchInfo.textContent = 'Memuat manhwa populer...';

        // Fetch popular data
        const response = await fetch(`${BASE_URL}/kiryuu/popular`);
        const data = await response.json();

        if (data.success) {
            searchInfo.textContent = `Menampilkan ${data.results.length} manhwa populer`;
            populateGrid(searchGrid, data.results);
        } else {
            searchInfo.textContent = 'Gagal memuat manhwa populer';
            searchGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading popular page:', error);
        searchInfo.textContent = 'Terjadi kesalahan saat memuat manhwa populer';
        searchGrid.innerHTML = '';
    }
}

// Load latest page
async function loadLatestPage() {
    try {
        // Show loading state
        searchGrid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const card = document.createElement('div');
            card.className = 'card skeleton skeleton-card';
            searchGrid.appendChild(card);
        }

        searchInfo.textContent = 'Memuat manhwa terbaru...';

        // Fetch latest data
        const response = await fetch(`${BASE_URL}/kiryuu/latest`);
        const data = await response.json();

        if (data.success) {
            searchInfo.textContent = `Menampilkan ${data.results.length} manhwa terbaru`;
            populateGrid(searchGrid, data.results);
        } else {
            searchInfo.textContent = 'Gagal memuat manhwa terbaru';
            searchGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading latest page:', error);
        searchInfo.textContent = 'Terjadi kesalahan saat memuat manhwa terbaru';
        searchGrid.innerHTML = '';
    }
}

// Load recommendations page
async function loadRecommendationsPage() {
    try {
        // Show loading state
        searchGrid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const card = document.createElement('div');
            card.className = 'card skeleton skeleton-card';
            searchGrid.appendChild(card);
        }

        searchInfo.textContent = 'Memuat rekomendasi...';

        // Fetch recommendations data
        const response = await fetch(`${BASE_URL}/kiryuu/recommendations`);
        const data = await response.json();

        if (data.success) {
            searchInfo.textContent = `Menampilkan ${data.results.length} rekomendasi`;
            populateGrid(searchGrid, data.results);
        } else {
            searchInfo.textContent = 'Gagal memuat rekomendasi';
            searchGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading recommendations page:', error);
        searchInfo.textContent = 'Terjadi kesalahan saat memuat rekomendasi';
        searchGrid.innerHTML = '';
    }
}

// Load top weekly page
async function loadTopWeeklyPage() {
    try {
        // Show loading state
        searchGrid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const card = document.createElement('div');
            card.className = 'card skeleton skeleton-card';
            searchGrid.appendChild(card);
        }

        searchInfo.textContent = 'Memuat top mingguan...';

        // Fetch top weekly data
        const response = await fetch(`${BASE_URL}/kiryuu/top-weekly`);
        const data = await response.json();

        if (data.success) {
            searchInfo.textContent = `Menampilkan ${data.recommendations.length} top mingguan`;
            populateGrid(searchGrid, data.recommendations);
        } else {
            searchInfo.textContent = 'Gagal memuat top mingguan';
            searchGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading top weekly page:', error);
        searchInfo.textContent = 'Terjadi kesalahan saat memuat top mingguan';
        searchGrid.innerHTML = '';
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
    container.innerHTML = '';
    container.appendChild(errorDiv);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);