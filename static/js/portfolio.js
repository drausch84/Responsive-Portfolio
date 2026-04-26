document.addEventListener('DOMContentLoaded', initializePortfolioPage);

function initializePortfolioPage() {
    initializeMobileNavigation();
    initializeTopScrollButton();
}

function initializeMobileNavigation() {
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const siteNav = document.getElementById('siteNav');

    if (!mobileNavToggle || !siteNav) {
        return;
    }

    mobileNavToggle.addEventListener('click', function handleMobileNavToggleClick() {
        const isOpening = !siteNav.classList.contains('navOpen');

        siteNav.classList.toggle('navOpen', isOpening);
        mobileNavToggle.classList.toggle('navToggleOpen', isOpening);
        mobileNavToggle.setAttribute('aria-expanded', String(isOpening));
        mobileNavToggle.setAttribute('aria-label', isOpening ? 'Close navigation' : 'Open navigation');
    });

    siteNav.querySelectorAll('.siteNavLink').forEach(function bindMobileNavLinkClick(siteNavLink) {
        siteNavLink.addEventListener('click', function handleMobileNavLinkClick() {
            siteNav.classList.remove('navOpen');
            mobileNavToggle.classList.remove('navToggleOpen');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNavToggle.setAttribute('aria-label', 'Open navigation');
        });
    });

    document.addEventListener('click', function handleOutsideNavClick(event) {
        const clickedInsideHeader = event.target.closest('.siteHeader');

        if (clickedInsideHeader) {
            return;
        }

        siteNav.classList.remove('navOpen');
        mobileNavToggle.classList.remove('navToggleOpen');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNavToggle.setAttribute('aria-label', 'Open navigation');
    });
}

function initializeTopScrollButton() {
    const topScrollButton = document.querySelector('.topScrollButton');

    if (!topScrollButton) {
        return;
    }

    function updateTopScrollButtonVisibility() {
        const shouldShowButton = window.scrollY > 500;
        topScrollButton.classList.toggle('isVisible', shouldShowButton);
    }

    topScrollButton.addEventListener('click', function handleTopScrollButtonClick() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', updateTopScrollButtonVisibility);
    updateTopScrollButtonVisibility();
}