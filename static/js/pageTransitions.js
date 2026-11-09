/* Binary Page Transition Configuration */
const binaryTransitionConfig = {
    storageKey: 'rauschBinaryTransition',
    exitDuration: 1175,
    enterDuration: 1225,
    storageLifetime: 12000,
    background: '#101d2d'
};

const binaryIncomingTransition = readBinaryIncomingTransition();
let binaryNavigationInProgress = false;
let binaryCancelActiveTransition = null;

/* Prepare Incoming Transition Before Page Renders */
if (binaryIncomingTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('binaryTransitionIncoming');
}

document.addEventListener('DOMContentLoaded', () => {
    initializeBinaryPageTransitions();
});

window.addEventListener('pageshow', handleBinaryPageShow);

/* Helper: Read Incoming Binary Transition */
function readBinaryIncomingTransition() {
    try {
        const raw = window.sessionStorage.getItem(binaryTransitionConfig.storageKey);
        window.sessionStorage.removeItem(binaryTransitionConfig.storageKey);

        if (!raw) {
            return null;
        }

        const data = JSON.parse(raw);
        const currentRoute = window.location.pathname + window.location.search;
        const age = Date.now() - data.createdAt;

        if (!Number.isFinite(age) || age < 0 || age > binaryTransitionConfig.storageLifetime) {
            return null;
        }

        if (data.destination !== currentRoute || !Number.isInteger(data.seed)) {
            return null;
        }

        return data;
    } catch (error) {
        return null;
    }
}
/* END Helper: Read Incoming Binary Transition */

/* Helper: Initialize Binary Page Transitions */
function initializeBinaryPageTransitions() {
    document.addEventListener('click', handleBinaryNavigationClick);

    if (!binaryIncomingTransition || !document.documentElement.classList.contains('binaryTransitionIncoming')) {
        return;
    }

    const started = startBinaryTransition('enter', binaryIncomingTransition.seed, () => {
        document.documentElement.classList.remove('binaryTransitionIncoming');
    }, binaryIncomingTransition.createdAt);

    if (!started) {
        document.documentElement.classList.remove('binaryTransitionIncoming');
    }
}
/* END Helper: Initialize Binary Page Transitions */

/* Helper: Handle Binary Navigation Click */
function handleBinaryNavigationClick(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
    }

    const target = event.target;

    if (!(target instanceof Element)) {
        return;
    }

    const link = target.closest('a[href]');

    if (!link || link.hasAttribute('download') || link.closest('[data-no-page-transition]')) {
        return;
    }

    if (link.target && link.target.toLowerCase() !== '_self') {
        return;
    }

    if (link.relList?.contains('external')) {
        return;
    }

    let destination;

    try {
        destination = new URL(link.href, window.location.href);
    } catch (error) {
        return;
    }

    if (!['http:', 'https:'].includes(destination.protocol) || destination.origin !== window.location.origin) {
        return;
    }

    const currentRoute = window.location.pathname + window.location.search;
    const destinationRoute = destination.pathname + destination.search;

    // Preserve normal same-page and anchor navigation.
    if (currentRoute === destinationRoute) {
        return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    if (binaryNavigationInProgress) {
        event.preventDefault();
        return;
    }

    const seed = Math.floor(Math.random() * 0xffffffff);
    const transitionStartedAt = Date.now();

    try {
        window.sessionStorage.setItem(binaryTransitionConfig.storageKey, JSON.stringify({
            destination: destinationRoute,
            createdAt: transitionStartedAt,
            seed
        }));
    } catch (error) {
        return;
    }

    event.preventDefault();
    binaryNavigationInProgress = true;

    const started = startBinaryTransition('exit', seed, () => {
        window.location.assign(destination.href);
    }, transitionStartedAt);

    if (!started) {
        binaryNavigationInProgress = false;
        window.sessionStorage.removeItem(binaryTransitionConfig.storageKey);
        window.location.assign(destination.href);
    }
}
/* END Helper: Handle Binary Navigation Click */

/* Helper: Create Deterministic Binary Random Generator */
function createBinaryRandom(seed) {
    let state = seed >>> 0;

    return function nextBinaryRandom() {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state / 4294967296;
    };
}
/* END Helper: Create Deterministic Binary Random Generator */

/* Helper: Create Binary Glyph Field */
function createBinaryGlyphField(width, height, seed) {
    const random = createBinaryRandom(seed);
    const isMobile = width < 650;
    const fontSize = isMobile ? 16 : 19;
    const columnSpacing = isMobile ? 22 : 28;
    const rowSpacing = isMobile ? 25 : 31;
    const glyphs = [];

    for (let y = 8; y < height + rowSpacing; y += rowSpacing) {
        for (let x = 6; x < width + columnSpacing; x += columnSpacing) {
            if (random() < 0.25) {
                continue;
            }

            glyphs.push({
                x: x + (random() - 0.5) * 7,
                y: y + (random() - 0.5) * 8,
                digit: random() > 0.5 ? '1' : '0',
                phase: random() * Math.PI * 2,
                intensity: random(),
                spark: random(),
                speed: 0.7 + random() * 1.5
            });
        }
    }

    return {
        glyphs,
        fontSize
    };
}
/* END Helper: Create Binary Glyph Field */

/* Helper: Calculate Binary Sweep Edge */
function getBinarySweepEdge(width, progress, y, elapsed, phase) {
    if (progress <= 0) {
        return 0;
    }

    if (progress >= 1) {
        return width;
    }

    const eased = phase === 'enter'
        ? progress
        : progress * progress * (3 - 2 * progress);

    const edgeWave = Math.sin(y * 0.019 + elapsed * 0.005) * 17;
    const edgeDetail = Math.sin(y * 0.058 - elapsed * 0.008) * 8;
    const waveStrength = Math.sin(progress * Math.PI);

    return Math.max(0, Math.min(width, width * eased + (edgeWave + edgeDetail) * waveStrength));
}
/* END Helper: Calculate Binary Sweep Edge */

/* Helper: Render Binary Transition Frame */
function renderBinaryTransitionFrame(state, phase, progress, elapsed) {
    const { context, width, height, field } = state;
    const isExit = phase === 'exit';
    const bandHeight = 15;

    context.clearRect(0, 0, width, height);

    /* Draw Horizontal Binary Sweep */
    for (let y = 0; y < height; y += bandHeight) {
        const edge = getBinarySweepEdge(width, progress, y, elapsed, phase);

        context.fillStyle = Math.floor(y / bandHeight) % 4 === 0
            ? '#12232e'
            : binaryTransitionConfig.background;

        if (isExit) {
            context.fillRect(0, y, edge, bandHeight + 1);
        } else {
            context.fillRect(edge, y, width - edge, bandHeight + 1);
        }

        // A restrained emerald highlight follows the advancing edge.
        if (edge > 0 && edge < width) {
            context.fillStyle = 'rgba(112, 238, 169, 0.32)';
            context.fillRect(edge - 1.5, y, 2.5, bandHeight + 1);

            context.fillStyle = 'rgba(84, 207, 156, 0.09)';
            context.fillRect(edge - 14, y, 13, bandHeight + 1);
        }
    }

    /* Draw Binary Digits */
    context.font = `500 ${field.fontSize}px Consolas, Monaco, monospace`;
    context.textBaseline = 'top';

    field.glyphs.forEach((glyph) => {
        const verticalTravel = elapsed * glyph.speed * 0.012;
        const subtleDrift = Math.sin(elapsed * 0.0012 + glyph.phase) * 2.5;
        const x = glyph.x;
        const y = ((glyph.y + verticalTravel + subtleDrift + 24) % (height + 48)) - 24;

        const edge = getBinarySweepEdge(width, progress, y, elapsed, phase);

        const inCoveredArea = isExit ? x <= edge - 3 : x >= edge + 3;

        if (!inCoveredArea) {
            return;
        }

        const nearBoundary = Math.abs(x - edge) < 110;

        context.globalAlpha = nearBoundary
            ? 0.48 + glyph.intensity * 0.43
            : 0.15 + glyph.intensity * 0.35;

        context.fillStyle = nearBoundary && glyph.spark > 0.75
            ? '#d0ffe0'
            : glyph.intensity > 0.6
                ? '#8cdea9'
                : '#459578';

        
        const mutationInterval = 220 + glyph.speed * 105;
        const mutationTick = Math.floor((elapsed + glyph.phase * 95) / mutationInterval);
        const shouldMutate = glyph.spark > 0.80 && mutationTick % 2 === 1;
        const displayDigit = shouldMutate
            ? (glyph.digit === '0' ? '1' : '0')
            : glyph.digit;

        context.fillText(displayDigit, x, y);

    });

    context.globalAlpha = 1;
}
/* END Helper: Render Binary Transition Frame */

/* Helper: Start Binary Transition */
function startBinaryTransition(phase, seed, onComplete, transitionStartedAt = Date.now()) {
    const canvas = document.createElement('canvas');
    canvas.className = 'binaryTransitionCanvas';
    canvas.setAttribute('aria-hidden', 'true');

    const context = canvas.getContext('2d', { alpha: true });

    if (!context) {
        return false;
    }

    const state = {
        canvas,
        context,
        width: 0,
        height: 0,
        field: null,
        animationFrame: null,
        cancelled: false
    };

    /* Helper: Resize Binary Transition Canvas */
    function resizeCanvas() {
        const width = Math.max(1, window.innerWidth);
        const height = Math.max(1, window.innerHeight);
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);

        if (width === state.width && height === state.height) {
            return;
        }

        state.width = width;
        state.height = height;
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        state.field = createBinaryGlyphField(width, height, seed);
    }
    /* END Helper: Resize Binary Transition Canvas */

    try {
        document.body.append(canvas);
        resizeCanvas();
    } catch (error) {
        canvas.remove();
        return false;
    }

    const isExit = phase === 'exit';
    const duration = isExit
        ? binaryTransitionConfig.exitDuration
        : binaryTransitionConfig.enterDuration;

    const startTime = performance.now();
    let completed = false;
    let fallbackTimer = null;

    /* Helper: Get Continuous Binary Motion Time */
    function getContinuousBinaryMotionTime() {
        return Math.max(0, Date.now() - transitionStartedAt);
    }
    /* END Helper: Get Continuous Binary Motion Time */

    /* Helper: Cancel Active Binary Transition */
    function cancelTransition() {
        state.cancelled = true;

        if (state.animationFrame !== null) {
            window.cancelAnimationFrame(state.animationFrame);
        }

        window.clearTimeout(fallbackTimer);
        canvas.remove();

        if (binaryCancelActiveTransition === cancelTransition) {
            binaryCancelActiveTransition = null;
        }
    }
    /* END Helper: Cancel Active Binary Transition */

    /* Helper: Complete Binary Transition */
    function completeTransition() {
        if (completed || state.cancelled) {
            return;
        }

        completed = true;
        window.clearTimeout(fallbackTimer);

        if (state.animationFrame !== null) {
            window.cancelAnimationFrame(state.animationFrame);
            state.animationFrame = null;
        }

        if (isExit) {
            resizeCanvas();
            renderBinaryTransitionFrame(state, phase, 1, getContinuousBinaryMotionTime());
        } else {
            cancelTransition();
        }

        onComplete();
    }
    /* END Helper: Complete Binary Transition */

    /* Helper: Animate Binary Transition */
    function animate(timestamp) {
        if (state.cancelled || completed) {
            return;
        }

        const elapsed = Math.max(0, Math.min(timestamp - startTime, duration));
        const progress = Math.min(1, elapsed / duration);
        const motionElapsed = getContinuousBinaryMotionTime();

        resizeCanvas();
        renderBinaryTransitionFrame(state, phase, progress, motionElapsed);

        if (progress < 1) {
            state.animationFrame = window.requestAnimationFrame(animate);
        } else {
            state.animationFrame = null;
            completeTransition();
        }
    }
    /* END Helper: Animate Binary Transition */

    binaryCancelActiveTransition = cancelTransition;

    // Ensure navigation completes if the browser throttles animation frames.
    fallbackTimer = window.setTimeout(completeTransition, duration + 1000);

    // Both documents use the same seed and continuous animation clock.
    renderBinaryTransitionFrame(state, phase, 0, getContinuousBinaryMotionTime());
    document.documentElement.classList.remove('binaryTransitionIncoming');

    state.animationFrame = window.requestAnimationFrame(animate);

    return true;
}
/* END Helper: Start Binary Transition */

/* Helper: Handle Browser Page Restore */
function handleBinaryPageShow(event) {
    if (!event.persisted) {
        return;
    }

    binaryNavigationInProgress = false;
    document.documentElement.classList.remove('binaryTransitionIncoming');

    if (binaryCancelActiveTransition) {
        binaryCancelActiveTransition();
    }

    try {
        window.sessionStorage.removeItem(binaryTransitionConfig.storageKey);
    } catch (error) {
        // Session storage may be unavailable.
    }
}
/* END Helper: Handle Browser Page Restore */