// 1. SLIDER LOGIC
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const heroSection = document.querySelector('.hero'); 
let slideInterval; 

function startAutoSlide() {
    clearInterval(slideInterval); 
    // 6 Seconds (Steady Speed)
    slideInterval = setInterval(autoSlide, 6000); 
}

function showSlide(index) {
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentSlide].classList.add('active');
}

function autoSlide() { showSlide(currentSlide + 1); }

// Pause on hover so people can read
if(heroSection) {
    heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSection.addEventListener('mouseleave', () => startAutoSlide());
}

function moveSlide(direction) {
    showSlide(currentSlide + direction);
    startAutoSlide(); 
}

// Start Slider
startAutoSlide();

// 2. SEARCH TOGGLE
function toggleSearch() {
    const sb = document.getElementById('search-box');
    sb.style.display = sb.style.display === 'block' ? 'none' : 'block';
    if (sb.style.display === 'block') sb.focus();
}

// 3. MOBILE MENU TOGGLE
function toggleMenu() { 
    document.querySelector('.nav-menu').classList.toggle('active'); 
}

function toggleMobileMenu(element) {
    const menu = element.parentElement.querySelector('.services-grid');
    if (menu.style.display === 'grid') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'grid';
    }
}

// 4. ACCORDION
const accordions = document.querySelectorAll('.accordion-header');
accordions.forEach(acc => {
    acc.addEventListener('click', function() {
        accordions.forEach(item => {
            if (item !== this) {
                item.classList.remove('active');
                item.nextElementSibling.style.maxHeight = null;
            }
        });
        this.classList.toggle('active');
        const panel = this.nextElementSibling;
        panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
    });
});

// 5. PROMO MODAL (Session-Based & Safari Optimized)
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById('promoModal');
    
    // Check if seen in this session
    const hasSeenInThisSession = sessionStorage.getItem('slimParisSeen');

    if (!hasSeenInThisSession && modal) {
        setTimeout(() => { 
            modal.style.display = 'flex'; 
            sessionStorage.setItem('slimParisSeen', 'true');
        }, 1500); 
    }
});

// The "Close" Function - Essential for your HTML onclick to work
function closePromo() { 
    const modal = document.getElementById('promoModal');
    if (modal) {
        modal.style.display = 'none'; 
    }
}

// Safari-friendly "Click Outside to Close" logic
window.addEventListener('click', function(event) {
    const modal = document.getElementById('promoModal');
    // If the user clicks the dark background (the modal itself) and not the image
    if (event.target === modal) {
        closePromo();
    }
});

// 6. SCROLL REVEAL
window.addEventListener('scroll', reveal);
function reveal() {
    var reveals = document.querySelectorAll('.reveal');
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        } else {
            reveals[i].classList.remove('active');
        }
    }
}

// 7. AWARDS TOGGLE
function toggleAwards() {
    var moreAwards = document.getElementById("more-awards-section");
    var btn = document.getElementById("viewMoreBtn");
    
    if (moreAwards.style.display === "none") {
        moreAwards.style.display = "flex"; 
        btn.innerHTML = 'View Less <i class="fas fa-chevron-up"></i>'; 
        btn.classList.add("open");
    } else {
        moreAwards.style.display = "none"; 
        btn.innerHTML = 'View More Achievements <i class="fas fa-chevron-down"></i>'; 
        btn.classList.remove("open");
        document.querySelector('.awards-section-deco').scrollIntoView({behavior: 'smooth'});
    }
}

// 8. STICKY MENU HYBRID LOGIC
const socialTrigger = document.querySelector('.social-trigger');
const stickyMenu = document.querySelector('.sticky-social-menu');

if (socialTrigger) {
    socialTrigger.addEventListener('click', function(e) {
        // Stop the click from closing immediately via the document listener below
        e.stopPropagation(); 
        stickyMenu.classList.toggle('active');
    });
}

// Close the menu if the user taps anywhere else on the page
document.addEventListener('click', function() {
    if (stickyMenu && stickyMenu.classList.contains('active')) {
        stickyMenu.classList.remove('active');
    }
});