document.addEventListener('DOMContentLoaded', function() {
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top <= windowHeight * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    function handleScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate');
        
        animatedElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animate')) {
                element.classList.add('animate');
            }
        });
    }
    
    handleScrollAnimations();
    
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(function() {
            handleScrollAnimations();
        });
    });
    
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            const footer = document.querySelector('.footer-section');
            
            if (footer && (window.scrollY + window.innerHeight) >= footer.offsetTop) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
    }
});