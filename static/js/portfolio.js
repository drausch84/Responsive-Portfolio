document.addEventListener('DOMContentLoaded', () => {
    initializeMobileNavigation();
    initializeTopScrollButton();
    initializeResumeRequestPrefill();
});

/* Helper: Update Mobile Navigation */
function updateMobileNavigation(isOpen) {
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const siteNav = document.getElementById('siteNav');

    if (!mobileNavToggle || !siteNav) {
        return;
    }

    siteNav.classList.toggle('navOpen', isOpen);
    mobileNavToggle.classList.toggle('navToggleOpen', isOpen);
    mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNavToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}
/* END Helper: Update Mobile Navigation */

/* Helper: Initialize Mobile Navigation */
function initializeMobileNavigation() {
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const siteNav = document.getElementById('siteNav');

    if (!mobileNavToggle || !siteNav) {
        return;
    }

    mobileNavToggle.addEventListener('click', () => {
        updateMobileNavigation(!siteNav.classList.contains('navOpen'));
    });

    siteNav.querySelectorAll('a[href]').forEach((link) => {
        link.addEventListener('click', () => updateMobileNavigation(false));
    });

    document.addEventListener('click', (event) => {
        if (siteNav.classList.contains('navOpen') && !event.target.closest('.siteHeader')) {
            updateMobileNavigation(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && siteNav.classList.contains('navOpen')) {
            updateMobileNavigation(false);
            mobileNavToggle.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && siteNav.classList.contains('navOpen')) {
            updateMobileNavigation(false);
        }
    });
}
/* END Helper: Initialize Mobile Navigation */

/* Helper: Initialize Scroll-to-Top Button */
function initializeTopScrollButton() {
    const topScrollButton = document.querySelector('.topScrollButton');

    if (!topScrollButton) {
        return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let ticking = false;

    function updateButtonVisibility() {
        topScrollButton.classList.toggle('isVisible', window.scrollY > 500);
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(updateButtonVisibility);
    }, { passive: true });

    topScrollButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    });

    updateButtonVisibility();
}
/* END Helper: Initialize Scroll-to-Top Button */

/* Helper: Prefill Resume Requests Without Automatically Submitting */
function initializeResumeRequestPrefill() {
    const contactSubject = document.getElementById('contactSubject');
    const contactMessage = document.getElementById('contactMessage');

    if (!contactSubject || !contactMessage) {
        return;
    }

    const query = new URLSearchParams(window.location.search);

    if (query.get('topic') !== 'resume') {
        return;
    }

    if (!contactSubject.value) {
        contactSubject.value = 'Request for current résumé';
    }

    if (!contactMessage.value) {
        contactMessage.value = 'Hello, I would like to request a copy of your current résumé for a software engineering opportunity.\n\n';
    }
}
/* END Helper: Prefill Resume Requests Without Automatically Submitting */