document.addEventListener('DOMContentLoaded', () => {
    initializeProjectMockupCarousels();
});

/* Helper: Update Project Mockup Indicators */
function updateProjectMockupDots(dots, activeIndex) {
    dots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
}
/* END Helper: Update Project Mockup Indicators */

/* Helper: Initialize Project Mockup Carousels */
function initializeProjectMockupCarousels() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('.projectMockupCarousel').forEach((carousel) => {
        const track = carousel.querySelector('.projectMockupTrack');
        const slides = [...carousel.querySelectorAll('.projectMockupSlide')];
        const dots = [...carousel.querySelectorAll('.projectMockupDot')];

        if (!track || !slides.length || slides.length !== dots.length) {
            return;
        }

        let activeIndex = 0;
        let scrollFrame = null;

        function showSlide(nextIndex, shouldFocus = false) {
            activeIndex = Math.min(Math.max(nextIndex, 0), slides.length - 1);
            updateProjectMockupDots(dots, activeIndex);
            track.scrollTo({ left: activeIndex * track.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });

            if (shouldFocus) {
                dots[activeIndex].focus();
            }
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
            dot.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                    event.preventDefault();
                    showSlide(activeIndex + (event.key === 'ArrowRight' ? 1 : -1), true);
                }
            });
        });

        track.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                event.preventDefault();
                showSlide(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
            }
        });

        track.addEventListener('scroll', () => {
            if (scrollFrame !== null) {
                cancelAnimationFrame(scrollFrame);
            }

            scrollFrame = requestAnimationFrame(() => {
                activeIndex = Math.min(slides.length - 1, Math.max(0, Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
                updateProjectMockupDots(dots, activeIndex);
                scrollFrame = null;
            });
        }, { passive: true });

        window.addEventListener('resize', () => {
            track.scrollLeft = activeIndex * track.clientWidth;
        });

        updateProjectMockupDots(dots, 0);
    });
}
/* END Helper: Initialize Project Mockup Carousels */