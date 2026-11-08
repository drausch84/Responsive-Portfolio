document.addEventListener('DOMContentLoaded', () => {
    initializeHomeProcessAnimation();
    initializeHomeWorkShowcase();
    initializeHomeToolkitSearch();
});

/* Helper: Initialize Home Process Animation */
function initializeHomeProcessAnimation() {
    const panel = document.querySelector('.homeProcessPanel');

    if (!panel) {
        return;
    }

    const steps = [...panel.querySelectorAll('.homeProcessStep')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let animationStarted = false;

    /* Helper: Complete Home Process Animation */
    function completeAnimation() {
        panel.classList.add('isComplete');

        steps.forEach((step) => {
            step.classList.add('isReached');
        });
    }
    /* END Helper: Complete Home Process Animation */

    /* Helper: Start Home Process Animation */
    function startAnimation() {
        if (animationStarted) {
            return;
        }

        animationStarted = true;
        panel.classList.add('isPlaying');

        steps.forEach((step, index) => {
            window.setTimeout(() => {
                step.classList.add('isReached');
            }, 200 + index * 1650);
        });

        window.setTimeout(completeAnimation, 4400);
    }
    /* END Helper: Start Home Process Animation */

    if (reducedMotion.matches) {
        completeAnimation();
        return;
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                observer.disconnect();
                startAnimation();
            }
        }, { threshold: 0.25 });

        observer.observe(panel);
    } else {
        startAnimation();
    }
}
/* END Helper: Initialize Home Process Animation */

/* Helper: Initialize Home Work Showcase */
function initializeHomeWorkShowcase() {
    const showcase = document.getElementById('homeWorkShowcase');

    if (!showcase) {
        return;
    }

    const tabs = [...showcase.querySelectorAll('.homeWorkTab')];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));

    if (!tabs.length || panels.some((panel) => !panel)) {
        return;
    }

    let activeIndex = 0;

    /* Helper: Activate Featured Project */
    function activateFeaturedProject(nextIndex, shouldFocus = false) {
        if (nextIndex < 0 || nextIndex >= tabs.length) {
            return;
        }

        activeIndex = nextIndex;

        tabs.forEach((tab, index) => {
            const isActive = index === activeIndex;

            tab.setAttribute('aria-selected', String(isActive));
            tab.tabIndex = isActive ? 0 : -1;
            panels[index].hidden = !isActive;
        });

        if (shouldFocus) {
            tabs[activeIndex].focus();
        }
    }
    /* END Helper: Activate Featured Project */

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            activateFeaturedProject(index);
        });

        tab.addEventListener('keydown', (event) => {
            let nextIndex = null;

            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    nextIndex = (activeIndex + 1) % tabs.length;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
                    break;
                case 'Home':
                    nextIndex = 0;
                    break;
                case 'End':
                    nextIndex = tabs.length - 1;
                    break;
                default:
                    return;
            }

            event.preventDefault();
            activateFeaturedProject(nextIndex, true);
        });
    });

    activateFeaturedProject(0);
    showcase.classList.add('isEnhanced');
}
/* END Helper: Initialize Home Work Showcase */

/* Helper: Initialize Home Toolkit Search */
function initializeHomeToolkitSearch() {
    const workspace = document.getElementById('homeToolkitWorkspace');

    if (!workspace) {
        return;
    }

    const searchContainer = workspace.querySelector('.homeToolkitSearch');
    const searchInput = workspace.querySelector('#homeToolkitSearchInput');
    const groups = [...workspace.querySelectorAll('.homeToolkitGroup')];
    const emptyMessage = workspace.querySelector('#homeToolkitEmpty');
    const status = workspace.querySelector('#homeToolkitStatus');

    if (!searchContainer || !searchInput || !groups.length || !emptyMessage || !status) {
        return;
    }

    const groupData = groups.map((group) => ({
        element: group,
        title: group.querySelector('h3')?.textContent.toLowerCase() || '',
        tools: [...group.querySelectorAll('.homeToolkitTool')].map((tool) => ({
            element: tool,
            name: tool.textContent.toLowerCase()
        }))
    }));

    /* Helper: Filter Home Toolkit */
    function filterHomeToolkit() {
        const query = searchInput.value.trim().toLowerCase();
        let matchingTools = 0;
        let matchingGroups = 0;

        groupData.forEach((group) => {
            const matchesGroup = query !== '' && group.title.includes(query);
            let groupToolCount = 0;

            group.tools.forEach((tool) => {
                const matchesTool = !query || matchesGroup || tool.name.includes(query);

                tool.element.hidden = !matchesTool;

                if (matchesTool) {
                    groupToolCount++;
                    matchingTools++;
                }
            });

            group.element.hidden = groupToolCount === 0;

            if (groupToolCount > 0) {
                matchingGroups++;
            }
        });

        emptyMessage.hidden = matchingTools > 0;

        if (!query) {
            status.textContent = 'A selection of technologies and practices from my work.';
        } else if (matchingTools === 0) {
            status.textContent = 'No matching technologies or skills.';
        } else {
            const toolLabel = matchingTools === 1 ? 'result' : 'results';
            const groupLabel = matchingGroups === 1 ? 'group' : 'groups';

            status.textContent = `${matchingTools} ${toolLabel} across ${matchingGroups} ${groupLabel}`;
        }
    }
    /* END Helper: Filter Home Toolkit */

    searchInput.addEventListener('input', filterHomeToolkit);

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && searchInput.value) {
            searchInput.value = '';
            filterHomeToolkit();
        }
    });

    searchContainer.hidden = false;
    filterHomeToolkit();
}
/* END Helper: Initialize Home Toolkit Search */