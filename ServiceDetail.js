
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Find the button that is currently pink (active)
    const activeBtn = document.querySelector('.service-list li a.active');
    
    // 2. If it exists, scroll the menu so this button is in the CENTER
    if (activeBtn) {
        activeBtn.scrollIntoView({
            behavior: 'auto', // Instant jump (no scrolling animation)
            block: 'nearest',
            inline: 'center'  // This centers the button horizontally
        });
    }
});

