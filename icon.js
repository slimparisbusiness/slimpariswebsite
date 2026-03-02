document.addEventListener("DOMContentLoaded", function() {
    const trigger = document.querySelector('.social-trigger');
    const menu = document.querySelector('.sticky-social-menu');

    if (trigger && menu) {
        // Handle Tap for Mobile Safari
        trigger.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                e.stopPropagation(); 
                menu.classList.toggle('active');
            }
        });

        // Close menu if tapping anywhere else on the screen
        document.addEventListener('click', function() {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        });
    }
});