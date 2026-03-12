document.addEventListener("DOMContentLoaded", function() {

    // === 1. DATE & ANIMATION ===
    const dateCircle = document.querySelector('.floating-date');
    if(dateCircle) {
        const today = new Date();
        const day = today.getDate();
        const month = today.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const dayEl = document.querySelector('.date-day');
        const monthEl = document.querySelector('.date-month');
        if(dayEl) dayEl.textContent = day.toString().padStart(2, '0');
        if(monthEl) monthEl.textContent = month;
    }

    const rotatingCircle = document.querySelector('.rotating-circle');
    if(rotatingCircle) {
        let rotation = 0;
        setInterval(() => {
            rotation += 0.5;
            rotatingCircle.style.transform = `rotate(${rotation}deg)`;
        }, 50);
    }

    // === 2. PAGINATION & FILTER LOGIC ===
    const articleCards = Array.from(document.querySelectorAll('.article-card'));
    const paginationContainer = document.getElementById('pagination');
    const showingCount = document.getElementById('showing-count');
    const totalCountEl = document.getElementById('total-count');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const featuredCard = document.querySelector('.featured-card');
    const grid = document.getElementById('articlesGrid');
    const noArticlesMsg = document.getElementById('no-articles-message');
    
    const limit = 6; 
    let currentPage = 1;
    let filteredArticles = [...articleCards];

    function createPagination() {
        if (!paginationContainer) return;
        const totalPages = Math.ceil(filteredArticles.length / limit);
        paginationContainer.innerHTML = '';

        // Hide pagination if 1 or 0 pages
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.setAttribute('data-page', 'prev');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.setAttribute('data-page', i);
            paginationContainer.appendChild(btn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.setAttribute('data-page', 'next');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        paginationContainer.appendChild(nextBtn);
        paginationContainer.style.display = 'flex';
    }

    function displayPage(page, isManual = false) {
        currentPage = page;
        sessionStorage.setItem('blogPage', page);
        
        const start = (page - 1) * limit;
        const end = start + limit;

        // Hide all articles
        articleCards.forEach(card => card.style.display = 'none');
        
        // Show only the slice for this page
        filteredArticles.slice(start, end).forEach(card => card.style.display = 'block');

        // Update active class on buttons
        document.querySelectorAll('.page-num').forEach(btn => {
            const btnPage = parseInt(btn.getAttribute('data-page'));
            btn.classList.toggle('active', btnPage === currentPage);
        });

        // Update footer counter
        if (showingCount) {
            showingCount.textContent = filteredArticles.length === 0 ? "0" : Math.min(end, filteredArticles.length);
        }
        
        if (isManual) {
            const articlesSection = document.querySelector('.articles-section');
            if (articlesSection) articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // 1. DYNAMIC FILTER LOGIC
    // 1. DYNAMIC FILTER LOGIC
    function applyGroupFilter(category, isInitialLoad = false) {
        sessionStorage.setItem('blogCategory', category);

        let currentFiltered = articleCards.filter(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all') return true;
            if (category === 'media') return cardCat === 'media' || cardCat === 'founder';
            if (category === 'health') return cardCat === 'health' || cardCat === 'lifestyle';
            return cardCat === category;
        });

        const featuredSection = document.getElementById('dynamic-featured-card');
        const watchBtn = document.getElementById('feat-watch-btn');

        if (category === 'all') {
            featuredSection.style.display = 'block';
            if(watchBtn) watchBtn.style.display = 'flex';
            
            document.getElementById('feat-title').textContent = "Redefining The Ideal Body: Curve Beauty vs. Scale Numbers";
            document.getElementById('feat-desc').textContent = "An in-depth conversation about modern beauty standards and the shift from weight-focused thinking to celebrating natural curves.";
            document.getElementById('feat-img').src = "images/SP2.png";
            document.getElementById('feat-cat').textContent = "Media Talk";
            document.getElementById('feat-date').textContent = "10 min read | 25th March 2025"; // Hard-coded pipe for the main story
            document.getElementById('feat-link').href = "media2.html";
            
            filteredArticles = currentFiltered;

        } else if (currentFiltered.length > 0) {
            featuredSection.style.display = 'block';
            if(watchBtn) watchBtn.style.display = 'none';
            
            const topArticle = currentFiltered[0]; 

            // 1. Format the metadata (Read time + Pipe + Date)
            const readTime = topArticle.querySelector('.meta-item:nth-child(1)').textContent.trim();
            const articleDate = topArticle.querySelector('.meta-item:nth-child(2)').textContent.trim();
            const formattedMeta = `${readTime} | ${articleDate}`;

            // 2. Extract other info
            const title = topArticle.querySelector('.card-title').textContent;
            const desc = topArticle.querySelector('.card-excerpt').textContent;
            const imgSrc = topArticle.querySelector('img').src;
            const catLabel = topArticle.querySelector('.card-category').textContent;
            const link = topArticle.querySelector('.card-link').href;

            // 3. Inject everything into the Featured Section
            document.getElementById('feat-title').textContent = title;
            document.getElementById('feat-desc').textContent = desc;
            document.getElementById('feat-img').src = imgSrc;
            document.getElementById('feat-cat').textContent = catLabel;
            document.getElementById('feat-date').textContent = formattedMeta; // Use the piped version!
            document.getElementById('feat-link').href = link;

            filteredArticles = currentFiltered.slice(1);

        } else {
            featuredSection.style.display = 'none';
            filteredArticles = [];
        }

        if (noArticlesMsg) {
            noArticlesMsg.style.display = (currentFiltered.length === 0) ? 'block' : 'none';
        }

        createPagination();
        
        if (!isInitialLoad) {
            displayPage(1, true);
        } else {
            const savedPage = sessionStorage.getItem('blogPage');
            displayPage(savedPage ? parseInt(savedPage) : 1, false);
        }
    }

   // 2. BUTTON LISTENERS WITH DYNAMIC SCROLL
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // UI: Highlight the clicked button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // LOGIC: Swap the Featured content and Filter the Grid
            const category = this.getAttribute('data-category');
            applyGroupFilter(category);

            // SCROLL: Move view to the "Featured" Label
            const scrollTarget = document.getElementById('featured-anchor');
            if (scrollTarget) {
                // Increased from 160 to 185 to push the text further down
                const navOffset = 185; 
                
                const elementPosition = scrollTarget.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === 3. PAGINATION CLICK LISTENER ===
    if (paginationContainer) {
        paginationContainer.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;
            
            const action = target.getAttribute('data-page');
            const totalPages = Math.ceil(filteredArticles.length / limit);

            if (action === 'prev') {
                if (currentPage > 1) displayPage(currentPage - 1, true);
            } else if (action === 'next') {
                if (currentPage < totalPages) displayPage(currentPage + 1, true);
            } else {
                const pageNum = parseInt(action);
                if (pageNum) displayPage(pageNum, true);
            }
        });
    }

    // === 4. SAFARI-PROOF SCROLL & HISTORY MANAGEMENT ===
    
    // 1. Handle the scroll reveal and parallax as usual
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 150) {
                el.classList.add('active');
            }
        });
        
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.decorative-shape').forEach((shape, index) => {
            const moveValue = scrolled * (index + 1) * 0.4; 
            if (shape.classList.contains('shape-2')) {
                shape.style.transform = `translateY(${moveValue}px) rotate(45deg)`;
            } else {
                shape.style.transform = `translateY(${moveValue}px)`;
            }
        });
    });

    // 2. Tell the browser NOT to try its own scroll memory
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    
    // 3. The "Safari Fix": Use pageshow instead of load
    window.addEventListener('pageshow', (event) => {
        const scrollPos = sessionStorage.getItem('blogScrollPos');
        const savedCategory = sessionStorage.getItem('blogCategory') || 'all';

        // Re-sync filter buttons
        filterButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-category') === savedCategory));
        
        // Apply the filter logic
        applyGroupFilter(savedCategory, true);

        // Show the grid
        if (grid) grid.classList.add('ready');

        // The Scroll Jump
        if (scrollPos) {
            // Safari needs a tiny delay to calculate the height of the filtered grid
            setTimeout(() => {
                window.scrollTo(0, parseInt(scrollPos));
            }, 50); 
        }
    });

    // 4. Save the position before leaving
    window.addEventListener('pagehide', () => {
        sessionStorage.setItem('blogScrollPos', window.scrollY);
    });

    // === 5. INITIALIZE STATS ===
    if (totalCountEl) totalCountEl.textContent = articleCards.length;
    const totalArticlesHero = document.getElementById('total-articles-hero');
    const totalCategoriesHero = document.getElementById('total-categories-hero');

    if (totalArticlesHero) totalArticlesHero.textContent = articleCards.length;
    if (totalCategoriesHero) totalCategoriesHero.textContent = "4"; 
});

// === NAVIGATION FUNCTIONS ===
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

function toggleMobileMenu(element) {
    // Prevent the click from bubbling up
    if (event) event.stopPropagation();
    
    // Find the parent <li> and toggle the class
    const parentLi = element.closest('.dropdown');
    parentLi.classList.toggle('show-menu');
}

function toggleSearch() {
    const sb = document.getElementById('search-box');
    if (sb) {
        sb.style.display = (sb.style.display === 'block') ? 'none' : 'block';
        if (sb.style.display === 'block') sb.focus();
    }
}

// Search functionality
const searchBox = document.getElementById('search-box');
if (searchBox) {
    searchBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (window.find && e.target.value.length > 0) {
                if (!window.find(e.target.value)) alert("Text not found.");
            }
        }
    });
}