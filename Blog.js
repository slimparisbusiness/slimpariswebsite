document.addEventListener("DOMContentLoaded", function() {

    // === DATE UPDATE ===
    const dateCircle = document.querySelector('.floating-date');
    if(dateCircle) {
        const today = new Date();
        const day = today.getDate();
        const month = today.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        document.querySelector('.date-day').textContent = day.toString().padStart(2, '0');
        document.querySelector('.date-month').textContent = month;
    }

    // === ROTATING CIRCLE ANIMATION ===
    const rotatingCircle = document.querySelector('.rotating-circle');
    if(rotatingCircle) {
        let rotation = 0;
        setInterval(() => {
            rotation += 0.5;
            rotatingCircle.style.transform = `rotate(${rotation}deg)`;
        }, 50);
    }

    // === CATEGORY FILTERING ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articleCards = document.querySelectorAll('.article-card');
    const featuredCard = document.querySelector('.featured-card');
    const showingCount = document.getElementById('showing-count');
    const totalCount = document.getElementById('total-count');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            let visibleCount = 0;

            // Filter articles
            articleCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });

            // Show/hide featured card
            if (featuredCard) {
                const featuredCategory = featuredCard.getAttribute('data-category');
                if (category === 'all' || featuredCategory === category) {
                    featuredCard.style.display = 'block';
                } else {
                    featuredCard.style.display = 'none';
                }
            }

            // Update counter
            if (showingCount) {
                showingCount.textContent = visibleCount;
            }

            // Scroll to articles section smoothly
            const articlesSection = document.querySelector('.articles-section');
            if (articlesSection && category !== 'all') {
                setTimeout(() => {
                    articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        });
    });

    // === VIEW TOGGLE (Grid/List) ===
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const articlesGrid = document.getElementById('articlesGrid');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const view = this.getAttribute('data-view');
            
            if (view === 'list') {
                articlesGrid.classList.add('list-view');
            } else {
                articlesGrid.classList.remove('list-view');
            }
        });
    });

    // === UPDATE TOTAL COUNT ===
    if (totalCount) {
        totalCount.textContent = articleCards.length;
    }
    if (showingCount) {
        showingCount.textContent = articleCards.length;
    }

    // Update hero stats
    const totalArticlesEl = document.getElementById('total-articles');
    if (totalArticlesEl) {
        totalArticlesEl.textContent = articleCards.length;
    }

    // === LOAD MORE FUNCTIONALITY ===
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // In a real implementation, this would:
            // 1. Fetch more articles from the server
            // 2. Append them to the grid
            // 3. Update counters
            
            // For demo purposes, just show a message
            this.innerHTML = '<span>All articles loaded</span>';
            this.disabled = true;
            this.style.opacity = '0.5';
        });
    }

    // === PAGINATION ===
    const pageButtons = document.querySelectorAll('.page-num, .page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            if (page === 'prev' || page === 'next') {
                // Handle prev/next logic
                console.log('Navigate:', page);
            } else {
                // Update active page
                document.querySelectorAll('.page-num').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // In real implementation: load that page's articles
                console.log('Load page:', page);
                
                // Scroll to top of articles
                const articlesSection = document.querySelector('.articles-section');
                if (articlesSection) {
                    articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // === MOBILE MENU ===
    const dropdownItem = document.querySelector('.dropdown');
    if (dropdownItem) {
        const dropdownLink = dropdownItem.querySelector('a');
        const arrowTrigger = dropdownItem.querySelector('.arrow-trigger');

        function toggleDropdown(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault(); 
                e.stopPropagation();
                dropdownItem.classList.toggle('active'); 
                dropdownItem.classList.toggle('show-menu'); 
            }
        }

        if(dropdownLink) dropdownLink.addEventListener('click', toggleDropdown);
        if(arrowTrigger) arrowTrigger.addEventListener('click', toggleDropdown);
    }

    window.toggleMenu = function() {
        const navMenu = document.querySelector('.nav-menu');
        if(navMenu) navMenu.classList.toggle('active');
    }

    // === SEARCH BOX ===
    window.toggleSearch = function() {
        const sb = document.getElementById('search-box');
        if(sb) {
            sb.style.display = sb.style.display === 'block' ? 'none' : 'block';
            if(sb.style.display === 'block') sb.focus();
        }
    }
    
    const searchBox = document.getElementById('search-box');
    if(searchBox) {
        searchBox.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (window.find && e.target.value.length > 0) {
                    if (!window.find(e.target.value)) alert("Text not found.");
                }
            }
        });
    }

    // === SCROLL REVEAL ===
    function reveal() {
        var reveals = document.querySelectorAll('.reveal');
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }
    window.addEventListener('scroll', reveal);
    reveal();
    
    // === ACTIVE NAV LINK ===
    const currentLocation = location.href;
    const menuItem = document.querySelectorAll('.nav-link');
    for (let i = 0; i < menuItem.length; i++) {
        if (menuItem[i].href === currentLocation) {
            menuItem[i].classList.add('active');
        }
    }

    // === PARALLAX DECORATIVE SHAPES ===
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.decorative-shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // === SMOOTH SCROLL TO SECTIONS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
