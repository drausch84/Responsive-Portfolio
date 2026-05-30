document.addEventListener('DOMContentLoaded', () => {
    initializeProjectMockupCarousels();
});

/* Initialize Project Mockup Carousels */
function initializeProjectMockupCarousels() {
    const carousels = document.querySelectorAll('.projectMockupCarousel');

    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.projectMockupTrack');
        const slides = carousel.querySelectorAll('.projectMockupSlide');
        const dots = carousel.querySelectorAll('.projectMockupDot');

        if (!track || !slides.length || !dots.length) {
            return;
        }

        updateProjectMockupDots(dots, 0);

        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', () => {
                track.scrollTo({
                    left: dotIndex * track.clientWidth,
                    behavior: 'smooth'
                });

                updateProjectMockupDots(dots, dotIndex);
            });
        });

        let carouselAnimationFrame = null;

        track.addEventListener('scroll', () => {
            if (carouselAnimationFrame) {
                window.cancelAnimationFrame(carouselAnimationFrame);
            }

            carouselAnimationFrame = window.requestAnimationFrame(() => {
                const activeIndex = getActiveProjectMockupSlideIndex(track, slides);
                updateProjectMockupDots(dots, activeIndex);
            });
        });
    });
}
/* END Initialize Project Mockup Carousels */


/* Get Active Project Mockup Slide Index */
function getActiveProjectMockupSlideIndex(track, slides) {
    const slideWidth = track.clientWidth;

    if (!slideWidth) {
        return 0;
    }

    const activeIndex = Math.round(track.scrollLeft / slideWidth);
    const maxIndex = slides.length - 1;

    return Math.max(0, Math.min(activeIndex, maxIndex));
}
/* END Get Active Project Mockup Slide Index */


/* Update Project Mockup Dots */
function updateProjectMockupDots(dots, activeIndex) {
    dots.forEach((dot, dotIndex) => {
        const isActiveDot = dotIndex === activeIndex;

        dot.classList.toggle('active', isActiveDot);
        dot.setAttribute('aria-current', isActiveDot ? 'true' : 'false');
    });
}
/* END Update Project Mockup Dots */