
document.addEventListener('DOMContentLoaded', () => {
    initializeEngineerProfileEditor();
});

/* Helper: Get Engineer Profile Source */
function getEngineerProfileSource() {
    return `type EngineeringFocus =
    | "architecture"
    | "full-stack"
    | "automation"
    | "security";

type EngineeringProject = {
    readonly name: string;
    readonly focus: readonly EngineeringFocus[];
};

class DavidRausch {
    readonly name = "David Rausch";
    readonly role = "Full-Stack Software Engineer";
    readonly buildingForWebSince = 2018;

    readonly background = {
        education: "B.S. Computer Science",
        university: "Regis University",
        concentration: "Software Engineering"
    } as const;

    readonly engineeringStrengths = [
        "System architecture & data modeling",
        "Full-stack application development",
        "Security & access management",
        "Workflow automation",
        "Production deployment & ownership"
    ] as const;

    readonly primaryStack = {
        languages: ["JavaScript", "TypeScript"],
        frontend: ["React.js", "EJS", "CSS", "SCSS", "jQuery"],
        backend: ["Node.js", "Express.js", "REST APIs"],
        databases: ["MongoDB", "SQL"]
    } as const;

    readonly additionalLanguages = [
        "C++", "C#", "Java", "Python"
    ] as const;

    readonly enterpriseTechnologies = [
        "SharePoint Framework (SPFx)",
        "SharePoint",
        "Power Automate",
        "Google Cloud Storage"
    ] as const;

    readonly developmentToolsAndMethodologies = [
        "Git",
        "Version control",
        "CI/CD",
        "Agile"
    ] as const;

    readonly projects: readonly EngineeringProject[] = [
        {
            name: "Campos Deliverable Suite",
            focus: ["architecture", "full-stack", "automation", "security"]
        },
        {
            name: "Distribution Contract Design",
            focus: ["architecture", "full-stack", "automation", "security"]
        },
        {
            name: "Rotted Cellar",
            focus: ["full-stack", "security"]
        }
    ];

    readonly recognition = {
        award: "Campos Catalyst",
        achievement: "Highest-rated technical presentation"
    } as const;

    readonly outsideOfWork = [
        "Hiking & the outdoors",
        "Horror films",
        "Creative writing",
        "Ohio State football"
    ] as const;

    private supportsFocus(
        project: EngineeringProject,
        focus: EngineeringFocus
    ): boolean {
        return project.focus.includes(focus);
    }

    public findProjectsByFocus(focus: EngineeringFocus): string[] {
        return this.projects
            .filter((project) => this.supportsFocus(project, focus))
            .map((project) => project.name);
    }
}`;
}
/* END Helper: Get Engineer Profile Source */

/* Helper: Highlight TypeScript Line */
function highlightTypeScriptLine(text, container) {
    const tokenPattern = /\/\/.*|"(?:\\.|[^"\\])*"?|\b(?:type|class|readonly|private|public|return|as|const|boolean|string|this|true|false)\b|\b\d+\b|\b(?:DavidRausch|EngineeringFocus|EngineeringProject|supportsFocus|findProjectsByFocus)\b/g;

    let lastIndex = 0;
    let match;

    while ((match = tokenPattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            container.append(document.createTextNode(text.slice(lastIndex, match.index)));
        }

        const value = match[0];
        const token = document.createElement('span');

        token.textContent = value;

        if (value.startsWith('//')) {
            token.className = 'codeToken codeToken--comment';
        } else if (value.startsWith('"')) {
            token.className = 'codeToken codeToken--string';
        } else if (/^\d+$/.test(value)) {
            token.className = 'codeToken codeToken--number';
        } else if (/^(DavidRausch|EngineeringFocus|EngineeringProject)$/.test(value)) {
            token.className = 'codeToken codeToken--type';
        } else if (/^(supportsFocus|findProjectsByFocus)$/.test(value)) {
            token.className = 'codeToken codeToken--function';
        } else {
            token.className = 'codeToken codeToken--keyword';
        }

        container.append(token);
        lastIndex = tokenPattern.lastIndex;
    }

    if (lastIndex < text.length) {
        container.append(document.createTextNode(text.slice(lastIndex)));
    }
}
/* END Helper: Highlight TypeScript Line */

/* Helper: Initialize Engineer Profile Editor */
function initializeEngineerProfileEditor() {
    const editor = document.getElementById('engineerProfileEditor');

    if (!editor) {
        return;
    }

    const viewport = editor.querySelector('.engineerEditorViewport');
    const codeLines = editor.querySelector('#engineerCodeLines');
    const status = editor.querySelector('#engineerEditorStatus');
    const pauseButton = editor.querySelector('#engineerPauseButton');
    const replayButton = editor.querySelector('#engineerReplayButton');
    const skipButton = editor.querySelector('#engineerSkipButton');
    const transcript = document.getElementById('engineerTranscriptCode');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const source = getEngineerProfileSource();

    const characterDelay = 15;

    if (!viewport || !codeLines || !status || !pauseButton || !replayButton || !skipButton) {
        return;
    }

    if (transcript) {
        transcript.textContent = source;
    }

    let characterCount = 0;
    let animationFrame = null;
    let previousFrameTime = null;
    let elapsedTime = 0;
    let started = false;
    let paused = false;
    let finished = false;
    let followCursor = true;

    /* Helper: Render Visible Code */
    function renderCode() {
        const visibleLines = source.slice(0, characterCount).split('\n');
        const fragment = document.createDocumentFragment();

        visibleLines.forEach((lineText, index) => {
            const line = document.createElement('div');
            const lineNumber = document.createElement('span');
            const lineContent = document.createElement('span');

            line.className = 'engineerCodeLine';
            lineNumber.className = 'engineerCodeNumber';
            lineNumber.textContent = String(index + 1).padStart(2, '0');
            lineNumber.setAttribute('aria-hidden', 'true');
            lineContent.className = 'engineerCodeContent';

            highlightTypeScriptLine(lineText, lineContent);

            if (!finished && index === visibleLines.length - 1) {
                const cursor = document.createElement('span');

                cursor.className = 'engineerTypingCursor';
                cursor.setAttribute('aria-hidden', 'true');
                lineContent.append(cursor);
            }

            line.append(lineNumber, lineContent);
            fragment.append(line);
        });

        codeLines.replaceChildren(fragment);

        if (followCursor) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
    /* END Helper: Render Visible Code */

    /* Helper: Finish Animation */
    function finishAnimation() {
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
        }

        animationFrame = null;
        characterCount = source.length;
        finished = true;
        paused = false;

        pauseButton.disabled = true;
        skipButton.disabled = true;

        status.textContent = 'Profile complete · Explore the work below';

        renderCode();
    }
    /* END Helper: Finish Animation */

    /* Helper: Animate Code */
    function animate(timestamp) {
        if (paused || finished) {
            return;
        }

        if (previousFrameTime === null) {
            previousFrameTime = timestamp;
        }

        elapsedTime += Math.min(timestamp - previousFrameTime, 60);
        previousFrameTime = timestamp;

        const nextCharacters = Math.floor(elapsedTime / characterDelay);

        if (nextCharacters > 0) {
            elapsedTime -= nextCharacters * characterDelay;
            characterCount = Math.min(source.length, characterCount + nextCharacters);

            if (characterCount === source.length) {
                finishAnimation();
                return;
            }

            renderCode();
        }

        animationFrame = requestAnimationFrame(animate);
    }
    /* END Helper: Animate Code */

    /* Helper: Play Animation */
    function playAnimation() {
        if (reducedMotion.matches) {
            finishAnimation();
            return;
        }

        started = true;
        paused = false;
        finished = false;
        previousFrameTime = null;

        pauseButton.disabled = false;
        pauseButton.textContent = 'Pause';
        skipButton.disabled = false;

        status.textContent = 'Typing engineer-profile.ts';

        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
        }

        animationFrame = requestAnimationFrame(animate);
    }
    /* END Helper: Play Animation */

    pauseButton.addEventListener('click', () => {
        if (!started || finished) {
            return;
        }

        paused = !paused;
        pauseButton.textContent = paused ? 'Resume' : 'Pause';
        status.textContent = paused ? 'Typing paused' : 'Typing engineer-profile.ts';

        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
        }

        animationFrame = null;

        if (!paused) {
            previousFrameTime = null;
            animationFrame = requestAnimationFrame(animate);
        }
    });

    replayButton.addEventListener('click', () => {
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
        }

        animationFrame = null;
        characterCount = 0;
        elapsedTime = 0;
        followCursor = true;
        finished = false;
        paused = false;

        renderCode();
        playAnimation();
    });

    skipButton.addEventListener('click', finishAnimation);

    viewport.addEventListener('wheel', () => {
        followCursor = false;
    }, { passive: true });

    viewport.addEventListener('touchstart', () => {
        followCursor = false;
    }, { passive: true });

    viewport.addEventListener('keydown', () => {
        followCursor = false;
    });

    renderCode();

    if (reducedMotion.matches) {
        finishAnimation();
    } else if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                observer.disconnect();

                if (!started && !finished) {
                    playAnimation();
                }
            }
        }, { threshold: 0.2 });

        observer.observe(editor);
    } else {
        playAnimation();
    }
}
/* END Helper: Initialize Engineer Profile Editor */