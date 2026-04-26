document.addEventListener('DOMContentLoaded', initializePortfolioPage);
window.addEventListener('pageshow', handlePageShow);

function initializePortfolioPage() {
    initializePageTransitions();
    initializeMobileNavigation();
    initializeTopScrollButton();
}

function initializePageTransitions() {
    requestAnimationFrame(function addPageLoadedClass() {
        document.body.classList.add('pageLoaded');
    });

    document.querySelectorAll('a[href]').forEach(function bindPageTransitionLink(linkElement) {
        linkElement.addEventListener('click', function handlePageTransitionClick(event) {
            const shouldSkipTransition = shouldSkipPageTransition(linkElement, event);

            if (shouldSkipTransition) {
                return;
            }

            event.preventDefault();

            const destinationUrl = linkElement.href;

            document.body.classList.remove('pageLoaded');
            document.body.classList.add('pageLeaving');

            window.setTimeout(function navigateAfterTransition() {
                window.location.href = destinationUrl;
            }, 220);
        });
    });
}

function shouldSkipPageTransition(linkElement, event) {
    const hrefValue = linkElement.getAttribute('href');

    if (!hrefValue) {
        return true;
    }

    if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
    ) {
        return true;
    }

    if (linkElement.target === '_blank') {
        return true;
    }

    if (linkElement.hasAttribute('download')) {
        return true;
    }

    if (
        hrefValue.startsWith('#') ||
        hrefValue.startsWith('mailto:') ||
        hrefValue.startsWith('tel:')
    ) {
        return true;
    }

    const linkUrl = new URL(linkElement.href, window.location.href);
    const currentUrl = new URL(window.location.href);

    if (linkUrl.origin !== currentUrl.origin) {
        return true;
    }

    if (
        linkUrl.pathname === currentUrl.pathname &&
        linkUrl.hash
    ) {
        return true;
    }

    return false;
}

function handlePageShow() {
    document.body.classList.remove('pageLeaving');
    document.body.classList.add('pageLoaded');
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