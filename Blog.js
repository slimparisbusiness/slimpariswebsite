document.addEventListener("DOMContentLoaded", function() {

    // === 1. DATE & ANIMATION ===
    const dateCircle = document.querySelector('.floating-date');
    if(dateCircle) {
        const today = new Date();
        const day = today.getDate();
        const month = today.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        document.querySelector('.date-day').textContent = day.toString().padStart(2, '0');
        document.querySelector('.date-month').textContent = month;
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
    
    const limit = 6; 
    let currentPage = 1;
    let filteredArticles = [...articleCards];

    function createPagination() {
        if (!paginationContainer) return;
        const totalPages = Math.ceil(filteredArticles.length / limit);
        paginationContainer.innerHTML = '';

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
        paginationContainer.style.display = totalPages > 1 ? 'flex' : 'none';
    }

    function displayPage(page, isManual = false) {
        currentPage = page;
        const start = (page - 1) * limit;
        const end = start + limit;

        articleCards.forEach(card => card.style.display = 'none');
        filteredArticles.slice(start, end).forEach(card => card.style.display = 'block');

        document.querySelectorAll('.page-num').forEach(btn => {
            const btnPage = parseInt(btn.getAttribute('data-page'));
            btn.classList.toggle('active', btnPage === currentPage);
        });

        if (showingCount) {
            showingCount.textContent = Math.min(end, filteredArticles.length);
        }
        
        const isRestoring = sessionStorage.getItem('blogScrollPos');
        if (isManual && !isRestoring) {
            const articlesSection = document.querySelector('.articles-section');
            if (articlesSection) articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // NEW: Centralized function to handle the "Group" filtering
    function applyGroupFilter(category) {
        sessionStorage.setItem('blogCategory', category);

        filteredArticles = articleCards.filter(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all') return true;
            
            // Logic for Mixed Groups
            if (category === 'media') return cardCat === 'media' || cardCat === 'founder';
            if (category === 'health') return cardCat === 'health' || cardCat === 'lifestyle';
            
            // Exact match for Problem Solver & Events
            return cardCat === category;
        });

        if (featuredCard) {
            const featCat = featuredCard.getAttribute('data-category');
            
            if (category === 'all') {
                featuredCard.style.display = 'block';
            } else if (category === 'media') {
                featuredCard.style.display = (featCat === 'media' || featCat === 'founder') ? 'block' : 'none';
            } else if (category === 'health') {
                featuredCard.style.display = (featCat === 'health' || featCat === 'lifestyle') ? 'block' : 'none';
            } else {
                featuredCard.style.display = (featCat === category) ? 'block' : 'none';
            }
        }

        currentPage = 1;
        createPagination();
        displayPage(1, true);
    }

    // === 3. EVENT LISTENERS ===
    if (paginationContainer) {
        paginationContainer.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;
            const action = target.getAttribute('data-page');
            if (action === 'prev') {
                if (currentPage > 1) displayPage(currentPage - 1, true);
            } else if (action === 'next') {
                if (currentPage < Math.ceil(filteredArticles.length / limit)) displayPage(currentPage + 1, true);
            } else {
                const pageNum = parseInt(action);
                if (pageNum) displayPage(pageNum, true);
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            applyGroupFilter(category);
        });
    });

    // === 4. SCROLL & HISTORY MANAGEMENT ===
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

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    
    window.addEventListener('load', () => {
        const scrollPos = sessionStorage.getItem('blogScrollPos');
        const savedCategory = sessionStorage.getItem('blogCategory');

        // Restore category group if coming back
        if (savedCategory) {
            const targetBtn = document.querySelector(`.filter-btn[data-category="${savedCategory}"]`);
            if (targetBtn) {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                targetBtn.classList.add('active');
                
                // Manual trigger of the filter logic without scrolling
                filteredArticles = articleCards.filter(card => {
                    const cardCat = card.getAttribute('data-category');
                    if (savedCategory === 'all') return true;
                    if (savedCategory === 'media') return cardCat === 'media' || cardCat === 'founder';
                    if (savedCategory === 'health') return cardCat === 'health' || cardCat === 'lifestyle';
                    return cardCat === savedCategory;
                });
                createPagination();
            }
        }

        if (scrollPos) {
            window.scrollTo(0, parseInt(scrollPos));
            setTimeout(() => {
                sessionStorage.removeItem('blogScrollPos');
                sessionStorage.removeItem('blogCategory');
            }, 500);
        }
    });

    window.addEventListener('pagehide', () => sessionStorage.setItem('blogScrollPos', window.scrollY));

    // === 5. INITIALIZE ===
    if (totalCountEl) totalCountEl.textContent = articleCards.length;
    createPagination();

    if (!sessionStorage.getItem('blogScrollPos')) {
        window.scrollTo(0, 0); 
    }
    
    displayPage(1);

    // === 6. AUTOMATIC HERO STATS ===
    const totalArticlesHero = document.getElementById('total-articles-hero');
    const totalCategoriesHero = document.getElementById('total-categories-hero');

    if (totalArticlesHero) totalArticlesHero.textContent = articleCards.length;
    if (totalCategoriesHero) {
        // Since we grouped them, you now have exactly 5 visible buttons
        totalCategoriesHero.textContent = "5";
    }
});