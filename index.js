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

// 5. PROMO MODAL
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById('promoModal');
    // Pop up after 0.3 second
    if(modal) {
        setTimeout(() => { modal.style.display = 'flex'; }, 300); 
    }
});

function closePromo() { 
    document.getElementById('promoModal').style.display = 'none'; 
}

// Close if clicked outside
window.onclick = function(event) {
    const modal = document.getElementById('promoModal');
    if (event.target == modal) modal.style.display = "none";
}

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