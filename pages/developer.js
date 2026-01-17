// Developer Page Specific JavaScript

function downloadResume() {
    // Download resume from assets/resume/shashwat_resume.pdf
    const resumeUrl = '../assets/resume/shashwat_resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'shashwat_resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function scheduleInterview() {
    // Redirect to Google Calendar event creation page with email as recipient
    const calendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Interview+with+Shashwat+Raj&add=shashwatrajiitd@gmail.com';
    window.open(calendarUrl, '_blank');
}

// Make openEmail globally accessible
window.openEmail = function() {
    // Open email client with recipient - using multiple methods for maximum compatibility
    try {
        // Method 1: Create and click anchor element (most reliable)
        const emailLink = document.createElement('a');
        emailLink.href = 'mailto:shashwatrajiitd@gmail.com';
        emailLink.style.display = 'none';
        document.body.appendChild(emailLink);
        emailLink.click();
        setTimeout(() => {
            document.body.removeChild(emailLink);
        }, 100);
    } catch (e) {
        // Method 2: Fallback to window.location
        console.warn('Anchor click failed, using window.location:', e);
        window.location.href = 'mailto:shashwatrajiitd@gmail.com';
    }
};

function scrollToSection(sectionId) {
    // Push to history if HistoryManager is available
    if (typeof HistoryManager !== 'undefined' && !HistoryManager.isNavigating) {
        const currentProfile = 'Developer';
        HistoryManager.pushState('section', currentProfile, sectionId);
    }
    
    const target = document.getElementById(sectionId);
    if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function createArchedText(element) {
    if (!element) return;
    
    const text = element.textContent.trim();
    const letters = text.split('');
    element.innerHTML = '';
    
    letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        span.style.display = 'inline-block';
        span.style.transition = 'transform 0.3s ease';
        
        // Calculate arch position (convex curve: center higher, ends lower)
        // Only apply arch to non-space characters
        if (letter !== ' ') {
            const totalLetters = letters.filter(l => l !== ' ').length;
            const letterIndex = letters.slice(0, index + 1).filter(l => l !== ' ').length;
            const normalizedPosition = (letterIndex - 1) / (totalLetters - 1 || 1); // 0 to 1
            // Use sine wave for smooth convex arch - center peaks, ends are lower
            const archHeight = Math.sin(normalizedPosition * Math.PI) * 6; // 6px max arch height for subtle effect
            
            span.style.transform = `translateY(${-archHeight}px)`;
            span.style.transformOrigin = 'center bottom';
        }
        
        element.appendChild(span);
    });
}

// Profile Selector Functions
function toggleProfileDropdown(event) {
    if (event) {
        event.stopPropagation();
    }
    const container = document.querySelector('.profile-selector-container');
    if (container) {
        container.classList.toggle('active');
    }
}

function updateCurrentProfileImage(profileName) {
    const profileImages = {
        'Recruiter': '../assets/icons/recruiter.png',
        'Developer': '../assets/icons/developer.png',
        'Stalker': '../assets/icons/stalker.png',
        'Adventurer': '../assets/icons/adventurer.png'
    };
    
    const currentProfileImg = document.getElementById('current-profile-img');
    if (currentProfileImg && profileImages[profileName]) {
        currentProfileImg.src = profileImages[profileName];
        currentProfileImg.alt = profileName;
    }
}

function initializeProfileSelector() {
    // Set current profile image based on current page
    const currentPage = document.getElementById('developer-page');
    if (currentPage) {
        updateCurrentProfileImage('Developer');
    }
    
    // Wait for DOM to be ready, then set up event listeners
    setTimeout(() => {
        // Set up event listeners for profile dropdown items
        const profileItems = document.querySelectorAll('.profile-dropdown-item');
        profileItems.forEach(item => {
            // Get profile name from data attribute or text content
            const profileName = item.getAttribute('data-profile') || 
                               item.querySelector('.profile-dropdown-name')?.textContent.trim();
            
            if (profileName) {
                // Remove any existing listeners by cloning
                const newItem = item.cloneNode(true);
                item.parentNode.replaceChild(newItem, item);
                
                newItem.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Profile item clicked:', profileName);
                    if (typeof window.switchProfile === 'function') {
                        window.switchProfile(profileName);
                    } else {
                        console.error('switchProfile function not available');
                    }
                });
            }
        });
    }, 100);
    
    // Close dropdown when clicking outside (set up once, not per initialization)
    if (!window.profileDropdownClickHandler) {
        window.profileDropdownClickHandler = function(event) {
            const container = document.querySelector('.profile-selector-container');
            if (container && !container.contains(event.target)) {
                container.classList.remove('active');
            }
        };
        document.addEventListener('click', window.profileDropdownClickHandler);
    }
}

function initializeDeveloperPage() {
    // Initialize navbar scroll effect
    const developerNavbar = document.getElementById('developer-navbar');
    if (developerNavbar) {
        window.addEventListener('scroll', () => {
            // Check if scrolled past threshold
            if (window.scrollY > 50) {
                developerNavbar.classList.add('scrolled');
                developerNavbar.classList.add('scrolling-up');
            } else {
                developerNavbar.classList.remove('scrolled');
                developerNavbar.classList.remove('scrolling-up');
            }
        });
    }
    
    // Initialize profile selector
    initializeProfileSelector();
    
    // Create arched text effect for logo (only if logo contains text, not an image)
    const logo = document.querySelector('#developer-navbar .logo');
    if (logo) {
        // Only apply arched text if logo doesn't contain an image
        const logoImg = logo.querySelector('img');
        if (!logoImg) {
            createArchedText(logo);
        }
    }
    
    // Smooth scroll for anchor links with history support
    // Use a more specific selector to avoid conflicts
    const developerPage = document.getElementById('developer-page');
    if (developerPage) {
        const developerLinks = developerPage.querySelectorAll('a[href^="#"]');
        developerLinks.forEach(link => {
            // Skip if already handled by global setupNavigationLinks
            if (link.hasAttribute('data-nav-handler-set')) {
                return;
            }
            
            // Remove existing listeners by cloning
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            newLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const targetId = this.getAttribute('href').substring(1);
                if (targetId && typeof scrollToSection === 'function') {
                    scrollToSection(targetId);
                }
            }, true); // Use capture phase
        });
    }
    
    // Handle initial URL hash if present
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        setTimeout(() => {
            scrollToSection(hash);
        }, 500);
    }
    
    // Load background video carousel - wait a bit for DOM to be ready
    setTimeout(() => {
        console.log('Initializing video carousel for developer profile');
        initializeVideoCarousel('developer_profile');
    }, 300);
    
    // Initialize code editor
    setTimeout(() => {
        initializeCodeEditor();
    }, 400);
}

// Initialize Netflix-style video carousel
let videoCarouselInterval = null; // Store interval to prevent multiple instances

function initializeVideoCarousel(profileType) {
    console.log(`Initializing video carousel for: ${profileType}`);
    
    // Try to find video container in current profile page first
    const pageContainer = document.getElementById('profile-page-container');
    let videoContainer = null;
    
    if (pageContainer) {
        // Look for video container within the current profile page
        const currentPage = pageContainer.querySelector('[id$="-page"]');
        if (currentPage) {
            videoContainer = currentPage.querySelector('#hero-video-container');
        }
    }
    
    // Fallback to global search
    if (!videoContainer) {
        videoContainer = document.getElementById('hero-video-container');
    }
    
    if (!videoContainer) {
        console.error('hero-video-container not found');
        // Try again after a short delay
        setTimeout(() => {
            const retryContainer = document.getElementById('hero-video-container');
            if (retryContainer) {
                console.log('Found video container on retry, initializing...');
                initializeVideoCarousel(profileType);
            }
        }, 500);
        return;
    }
    
    console.log('Video container found:', videoContainer);
    
    // Clear any existing carousel interval
    if (videoCarouselInterval) {
        clearInterval(videoCarouselInterval);
        videoCarouselInterval = null;
    }
    
    // Clear existing videos
    videoContainer.innerHTML = '';
    
    // List of videos for the profile type
    const videoFiles = {
        'recruiter_profile': ['r0.mp4'],
        'developer_profile': ['v0.mp4', "v1.mp4", "v2.mp4"],
        'adventurer_profile': [ 'suits.mp4', 'bb.mp4'], // Add videos when available
        'stalker_profile': ["s0.mp4"] // Add videos when available
    };
    
    const videos = videoFiles[profileType] || [];
    if (videos.length === 0) {
        console.warn(`No videos found for profile type: ${profileType}`);
        return;
    }
    
    console.log(`Found ${videos.length} videos for ${profileType}:`, videos);
    
    let currentVideoIndex = 0;
    let videoElements = [];
    
    // Create video elements for each video
    videos.forEach((videoFile, index) => {
        const video = document.createElement('video');
        video.className = 'hero-video';
        // Use correct relative path from pages/ directory
        const videoPath = `../assets/bg_videos/${profileType}/${videoFile}`;
        video.src = videoPath;
        video.type = 'video/mp4'; // Explicitly set MIME type for MP4 files
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto'; // Preload videos for smoother transitions
        video.setAttribute('webkit-playsinline', 'true'); // iOS support
        
        console.log(`Loading video: ${videoPath}`);
        
        // Set first video as active
        if (index === 0) {
            video.classList.add('active');
        }
        
        // Handle video load errors
        video.addEventListener('error', (e) => {
            console.error(`Failed to load video: ${videoFile}`, e);
            console.error(`Video path attempted: ${videoPath}`);
            if (video.error) {
                console.error(`Video error code: ${video.error.code}`);
                console.error(`Video error message: ${video.error.message}`);
            }
            // Note: .mov files may not be supported in all browsers
            // Consider converting to .mp4 for better browser compatibility
        });
        
        // Log when video source is set
        video.addEventListener('loadstart', () => {
            console.log(`Video load started: ${videoFile}`);
        });
        
        // Ensure video plays when loaded
        video.addEventListener('loadeddata', () => {
            console.log(`Video loaded: ${videoFile}`);
            if (index === 0) {
                // Only autoplay the first video
                setTimeout(() => {
                    video.play().then(() => {
                        console.log(`Video playing: ${videoFile}`);
                    }).catch(err => {
                        console.warn(`Failed to autoplay video: ${videoFile}`, err);
                        // Try again after a short delay
                        setTimeout(() => {
                            video.play().catch(e => console.warn('Retry failed:', e));
                        }, 500);
                    });
                }, 100);
            }
        });
        
        // Also try to play on canplay event
        video.addEventListener('canplay', () => {
            if (index === 0 && video.paused) {
                video.play().catch(err => {
                    console.warn(`Failed to play video on canplay: ${videoFile}`, err);
                });
            }
        });
        
        // Try to play on loadedmetadata as well
        video.addEventListener('loadedmetadata', () => {
            if (index === 0 && video.paused) {
                video.play().catch(err => {
                    console.warn(`Failed to play video on loadedmetadata: ${videoFile}`, err);
                });
            }
        });
        
        // Preload other videos
        if (index > 0) {
            video.load(); // Preload but don't play yet
        }
        
        videoContainer.appendChild(video);
        videoElements.push(video);
    });
    
    // Function to switch to next video
    function switchToNextVideo() {
        if (videoElements.length === 0) return;
        
        const currentVideo = videoElements[currentVideoIndex];
        currentVideo.classList.remove('active');
        currentVideo.classList.add('fade-out');
        currentVideo.pause();
        
        // Move to next video (loop back to first if at end)
        currentVideoIndex = (currentVideoIndex + 1) % videoElements.length;
        
        const nextVideo = videoElements[currentVideoIndex];
        
        // Reset and play next video
        setTimeout(() => {
            currentVideo.classList.remove('fade-out');
            nextVideo.classList.add('active');
            nextVideo.currentTime = 0; // Restart video
            nextVideo.play().then(() => {
                console.log(`Playing video ${currentVideoIndex + 1} of ${videoElements.length}`);
            }).catch(err => {
                console.warn('Failed to play next video', err);
            });
        }, 500); // Small delay for smooth transition
    }
    
    // Add 'ended' event listener to each video to play next when current ends
    videoElements.forEach((video, index) => {
        video.addEventListener('ended', () => {
            console.log(`Video ${index + 1} ended, switching to next`);
            switchToNextVideo();
        });
    });
    
    // No need for interval - videos will switch automatically when they end
    // This creates a continuous loop: when last video ends, it loops back to first
    
    // Ensure first video starts playing
    if (videoElements.length > 0) {
        const firstVideo = videoElements[0];
        setTimeout(() => {
            if (firstVideo.paused) {
                console.log('First video is paused, attempting to play...');
                firstVideo.play().then(() => {
                    console.log('First video started playing');
                }).catch(err => {
                    console.error('Failed to start first video:', err);
                });
            }
        }, 500);
    }
}

// Function to set background video (legacy - now uses carousel system)
// This function is kept for backward compatibility but the carousel is preferred
function setHeroBackgroundVideo(videoUrl) {
    // If carousel is already initialized, don't override it
    const videoContainer = document.getElementById('hero-video-container');
    if (videoContainer && videoContainer.children.length > 0) {
        console.warn('Video carousel is already initialized. Use initializeVideoCarousel() instead.');
        return;
    }
    
    // Fallback: create single video element if carousel not initialized
    if (videoContainer && videoUrl) {
        const video = document.createElement('video');
        video.className = 'hero-video active';
        video.src = videoUrl;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        videoContainer.appendChild(video);
    }
}

// Function to set background GIF (call this when user provides GIF)
function setHeroBackgroundGif(gifUrl) {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground && gifUrl) {
        // Remove video container if exists
        const videoContainer = heroBackground.querySelector('#hero-video-container');
        if (videoContainer) videoContainer.remove();
        
        // Add GIF image
        const gifImg = document.createElement('img');
        gifImg.src = gifUrl;
        gifImg.className = 'hero-gif';
        gifImg.style.width = '100%';
        gifImg.style.height = '100%';
        gifImg.style.objectFit = 'cover';
        heroBackground.insertBefore(gifImg, heroBackground.firstChild);
    }
}

// Toggle experience card expand/collapse
function toggleExperienceCard(card) {
    card.classList.toggle('expanded');
    
    // Smooth scroll to card if expanding
    if (card.classList.contains('expanded')) {
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// ============================================
// Code Editor About Section Functionality
// ============================================

// Terminal output script
const TERMINAL_OUTPUT = `Hey fellow dev! I'm Shaz, a Software Developer from IIT Delhi.
Currently orchestrating multi-agent GenAI pipelines in production.
Stack: LLMs / VLMs, Stable Diffusion, LoRA Fine-Tuning, Google Gemini, OpenAI, RAG + MLOps & microservices.
Previously debugged revenue anomalies with PyTorch transformers @ Samsung R&D.
Always down to fork repos, review PRs, or pair on scalable AI infra.`;

// State management
let codeEditorState = {
    expanded: false,
    running: false,
    terminalVisible: false
};

// Initialize code editor
function initializeCodeEditor() {
    const codeEditor = document.getElementById('code-editor');
    const expandBtn = document.getElementById('expand-btn');
    const playBtn = document.getElementById('play-btn');
    const copyBtn = document.getElementById('copy-btn');
    const killBtn = document.getElementById('kill-btn');
    const codeContent = document.getElementById('code-content');
    const terminalOutput = document.getElementById('terminal-output');
    
    if (!codeEditor) return;
    
    // Add syntax highlighting - call after DOM is ready
    if (codeContent) {
        // Syntax highlighting should never break interactions
        try {
            applySyntaxHighlighting();
        } catch (e) {
            console.warn('applySyntaxHighlighting failed (non-fatal):', e);
        }
        // Also try after a delay to ensure everything is loaded
        setTimeout(() => {
            try {
                applySyntaxHighlighting();
            } catch (e) {
                console.warn('applySyntaxHighlighting failed (non-fatal):', e);
            }
        }, 200);
    }

    // Bind delegated handlers once (survives DOM replacements)
    bindCodeEditorDelegatedHandlers();
    
    // Expand/Collapse button
    if (expandBtn) {
        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCodeEditor();
        });
    }
    
    // Click on code editor to expand
    if (codeEditor) {
        codeEditor.addEventListener('click', (e) => {
            // Don't expand if clicking on controls
            if (e.target.closest('.code-editor-controls, .code-editor-control')) return;
            if (!codeEditorState.expanded) {
                toggleCodeEditor();
            }
        });
    }
    
    // Play button
    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!codeEditorState.running) {
                runCode();
            }
        });
    }
    
    // Copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyCode();
        });
    }
    
    // Kill button
    if (killBtn) {
        killBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            killExecution();
        });
    }
}

// Delegated click handlers so buttons keep working even if DOM is replaced.
function bindCodeEditorDelegatedHandlers() {
    if (window.__codeEditorDelegatedHandlersBound) return;
    window.__codeEditorDelegatedHandlersBound = true;

    document.addEventListener(
        'click',
        (e) => {
            const target = e.target instanceof Element ? e.target : null;
            if (!target) return;

            const btn = target.closest('#expand-btn, #play-btn, #copy-btn, #kill-btn');
            if (!btn) return;

            // Ensure we only respond for the developer page editor
            if (!document.getElementById('code-editor')) return;

            // Prevent the "click anywhere to expand" handler from interfering
            e.preventDefault();
            e.stopPropagation();

            switch (btn.id) {
                case 'expand-btn':
                    toggleCodeEditor();
                    break;
                case 'play-btn':
                    if (!codeEditorState.running) runCode();
                    break;
                case 'copy-btn':
                    copyCode();
                    break;
                case 'kill-btn':
                    killExecution();
                    break;
            }
        },
        true // capture phase so we run even if something stops bubbling
    );
}

// Toggle expand/collapse
function toggleCodeEditor() {
    const codeEditor = document.getElementById('code-editor');
    if (!codeEditor) return;
    
    codeEditorState.expanded = !codeEditorState.expanded;
    codeEditor.classList.toggle('expanded', codeEditorState.expanded);
    
    // Update expand button icon
    const expandBtn = document.getElementById('expand-btn');
    if (expandBtn) {
        const icon = expandBtn.querySelector('i');
        if (icon) {
            if (codeEditorState.expanded) {
                icon.className = 'fas fa-compress';
                expandBtn.title = 'Collapse';
            } else {
                icon.className = 'fas fa-bars';
                expandBtn.title = 'Expand';
            }
        }
    }
}

// Run code (show terminal output)
function runCode() {
    if (codeEditorState.running) return;
    
    codeEditorState.running = true;
    codeEditorState.terminalVisible = true;
    
    const playBtn = document.getElementById('play-btn');
    const killBtn = document.getElementById('kill-btn');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalContent = document.getElementById('terminal-content');
    const terminalStatus = document.getElementById('terminal-status');
    
    // Show kill button, hide play button
    if (playBtn) playBtn.style.display = 'none';
    if (killBtn) killBtn.style.display = 'flex';
    
    // Show terminal
    if (terminalOutput) {
        terminalOutput.style.display = 'block';
    }
    
    // Update status
    if (terminalStatus) {
        terminalStatus.textContent = 'Running...';
        terminalStatus.className = 'terminal-status running';
    }
    
    // Clear previous output
    if (terminalContent) {
        terminalContent.innerHTML = '';
    }
    
    // Animate terminal output line by line
    animateTerminalOutput();
}

// Animate terminal output
function animateTerminalOutput() {
    const terminalContent = document.getElementById('terminal-content');
    if (!terminalContent) return;
    
    const lines = TERMINAL_OUTPUT.split('\n');
    let currentLine = 0;
    
    function addNextLine() {
        if (currentLine >= lines.length) {
            // Finished
            const terminalStatus = document.getElementById('terminal-status');
            if (terminalStatus) {
                terminalStatus.textContent = 'Completed';
                terminalStatus.className = 'terminal-status';
            }
            return;
        }
        
        const line = lines[currentLine];
        const lineElement = document.createElement('div');
        lineElement.className = 'terminal-line';
        lineElement.textContent = line;
        terminalContent.appendChild(lineElement);
        
        currentLine++;
        
        // Add delay between lines (faster for better UX)
        setTimeout(addNextLine, 150);
    }
    
    // Start animation
    addNextLine();
}

// Kill execution
function killExecution() {
    codeEditorState.running = false;
    codeEditorState.terminalVisible = false;
    
    const playBtn = document.getElementById('play-btn');
    const killBtn = document.getElementById('kill-btn');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalStatus = document.getElementById('terminal-status');
    
    // Hide kill button, show play button
    if (playBtn) playBtn.style.display = 'flex';
    if (killBtn) killBtn.style.display = 'none';
    
    // Hide terminal
    if (terminalOutput) {
        terminalOutput.style.display = 'none';
    }
    
    // Reset status
    if (terminalStatus) {
        terminalStatus.textContent = '';
        terminalStatus.className = 'terminal-status';
    }
    
    // Clear terminal content
    const terminalContent = document.getElementById('terminal-content');
    if (terminalContent) {
        terminalContent.innerHTML = '';
    }
}

// Copy code to clipboard
function copyCode() {
    const codeContent = document.getElementById('code-content');
    if (!codeContent) return;
    
    // Get the full code text (without HTML tags)
    const codeText = codeContent.textContent || codeContent.innerText;
    
    // Copy to clipboard
    navigator.clipboard.writeText(codeText).then(() => {
        showCopyToast();
    }).catch(err => {
        console.error('Failed to copy code:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = codeText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showCopyToast();
        } catch (e) {
            console.error('Fallback copy failed:', e);
        }
        document.body.removeChild(textArea);
    });
}

// Show copy toast notification
function showCopyToast() {
    // Remove existing toast if any
    const existingToast = document.querySelector('.copy-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = '✓ Code copied to clipboard';
    document.body.appendChild(toast);
    
    // Remove after animation
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Apply VS Code-style Python syntax highlighting
function applySyntaxHighlighting() {
    const codeContent = document.getElementById('code-content');
    if (!codeContent) {
        console.warn('code-content element not found');
        return;
    }
    
    // Find the code element inside the pre
    let codeElement = codeContent.querySelector('code');
    if (!codeElement) {
        // If no code element, create one
        const code = codeContent.textContent || codeContent.innerText;
        codeElement = document.createElement('code');
        codeElement.className = 'language-python';
        codeElement.textContent = code;
        codeContent.innerHTML = '';
        codeContent.appendChild(codeElement);
    }
    
    // Get raw text content first (this removes any existing HTML)
    let code = codeElement.textContent || codeElement.innerText;
    
    if (!code || code.trim().length === 0) {
        console.warn('No code content found');
        return;
    }
    
    console.log('Applying syntax highlighting to code of length:', code.length);
    
    // First, escape the entire code to make it HTML-safe.
    // Important: we MUST also escape quotes so the browser never treats them as markup.
    const escapeHtml = (text) =>
        text
            .replace(/&/g, '&amp;') // must be first
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    
    const originalCode = code;
    code = escapeHtml(code);
    
    // Now all quotes are &quot;, < is &lt;, > is &gt;, etc.
    // We need to adjust our regex patterns to work with escaped content
    
    // Process in order to avoid conflicts
    // Step 1: Comments (must come first) - # doesn't get escaped
    code = code.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
    
    // Step 2: Strings - handle triple quotes first (docstrings)
    // Match &quot;&quot;&quot;...&quot;&quot;&quot; (escaped triple double quotes) - non-greedy
    code = code.replace(/(&quot;&quot;&quot;[\s\S]*?&quot;&quot;&quot;)/g, '<span class="string">$1</span>');
    // Match &#39;&#39;&#39;...&#39;&#39;&#39; (escaped triple single quotes) - non-greedy
    code = code.replace(/(&#39;&#39;&#39;[\s\S]*?&#39;&#39;&#39;)/g, '<span class="string">$1</span>');
    
    // Step 3: F-strings - match f&quot;...&quot; or f&#39;...&#39;
    // Match content until we find the closing quote (handling entities)
    code = code.replace(/(f&quot;(?:(?!&quot;)[\s\S])*?&quot;)/g, '<span class="string">$1</span>');
    code = code.replace(/(f&#39;(?:(?!&#39;)[\s\S])*?&#39;)/g, '<span class="string">$1</span>');
    
    // Step 4: Regular strings - match &quot;...&quot; or &#39;...&#39;
    // Match content until we find the closing quote (handling entities)
    code = code.replace(/(&quot;(?:(?!&quot;)[\s\S])*?&quot;)/g, '<span class="string">$1</span>');
    code = code.replace(/(&#39;(?:(?!&#39;)[\s\S])*?&#39;)/g, '<span class="string">$1</span>');
    
    // Step 5: Decorators
    code = code.replace(/(@[a-zA-Z_][a-zA-Z0-9_]*)/g, '<span class="decorator">$1</span>');
    
    // Step 6: Type hints with arrow
    code = code.replace(/(-&gt;)\s*([a-zA-Z_][a-zA-Z0-9_]*)/g, '<span class="keyword">$1</span> <span class="type">$2</span>');
    
    // Step 7: Type hints in brackets
    code = code.replace(/\b(list|dict|tuple|set|str|int|float|bool|Any|Optional|Union)\[([^\]]+)\]/g, '<span class="type">$1</span>[$2]');
    
    // Step 8: Standalone type hints
    code = code.replace(/\b(list|dict|tuple|set|str|int|float|bool|Any|Optional|Union)\b(?![\[\(])/g, '<span class="type">$1</span>');
    
    // Step 9: Python keywords
    const keywords = ['__init__', '__main__', '__name__', 'class', 'def', 'return', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'import', 'from', 'pass', 'break', 'continue', 'yield', 'lambda', 'and', 'or', 'not', 'in', 'is', 'None', 'True', 'False'];
    keywords.forEach(keyword => {
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b(${escapedKeyword})\\b`, 'g');
        code = code.replace(regex, (match, p1, offset, string) => {
            // Check if we're inside a span by looking backwards
            const before = string.substring(0, offset);
            const lastOpenSpan = before.lastIndexOf('<span');
            const lastCloseSpan = before.lastIndexOf('</span>');
            if (lastOpenSpan > lastCloseSpan) {
                return match; // Inside a span, don't replace
            }
            return `<span class="keyword">${match}</span>`;
        });
    });
    
    // Step 10: self keyword
    code = code.replace(/\b(self)\b/g, (match, p1, offset, string) => {
        const before = string.substring(0, offset);
        const lastOpenSpan = before.lastIndexOf('<span');
        const lastCloseSpan = before.lastIndexOf('</span>');
        if (lastOpenSpan > lastCloseSpan) {
            return match;
        }
        return '<span class="self">self</span>';
    });
    
    // Step 11: Numbers
    code = code.replace(/\b(\d+\.\d+|\d+)\b/g, (match, p1, offset, string) => {
        const before = string.substring(0, offset);
        const lastOpenSpan = before.lastIndexOf('<span');
        const lastCloseSpan = before.lastIndexOf('</span>');
        if (lastOpenSpan > lastCloseSpan) {
            return match;
        }
        return `<span class="number">${match}</span>`;
    });
    
    // Step 12: Function calls and definitions
    code = code.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, (match, funcName, offset, string) => {
        // Skip keywords
        if (keywords.includes(funcName) || funcName === 'self') {
            return match;
        }
        // Check if inside a span
        const before = string.substring(0, offset);
        const lastOpenSpan = before.lastIndexOf('<span');
        const lastCloseSpan = before.lastIndexOf('</span>');
        if (lastOpenSpan > lastCloseSpan) {
            return match;
        }
        return `<span class="function">${funcName}</span>`;
    });
    
    // Step 13: Class names after 'class' keyword
    // Note: class is escaped as-is, but we need to match the escaped version
    code = code.replace(/<span class="keyword">class<\/span>\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '<span class="keyword">class</span> <span class="function">$1</span>:');
    
    // The code is now properly escaped and highlighted
    // Update the innerHTML of the code element
    codeElement.innerHTML = code;
    
    console.log('Syntax highlighting applied successfully');
}

// Also try to initialize code editor if DOM is already ready (fallback)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeCodeEditor, 300);
    });
} else {
    setTimeout(initializeCodeEditor, 300);
}
