const startExperience = () => {
    const splashScreen = document.getElementById('splash-screen');
    const introSound = document.getElementById('intro-sound');
    const spectrumContainer = document.querySelector('.spectrum-container');
    const profileSelection = document.getElementById('profile-selection');

    // Show splash screen directly
    splashScreen.style.display = 'flex';

    // Image-matched Clustered Ribbons Logic (Straight & Clean)
    const getColor = (pos) => {
        if (pos < 20) return ['#ff0000', '#ee0000', '#cc0000'][Math.floor(Math.random() * 3)]; // Left Reds
        if (pos < 35) return ['#ffcc00', '#ffaa00', '#eeb800'][Math.floor(Math.random() * 3)]; // Mid-Left Yellows
        if (pos < 50) return ['#ff0077', '#ff00aa', '#ff0055'][Math.floor(Math.random() * 3)]; // Middle Pinks
        if (pos < 75) return ['#00ffff', '#00ccff', '#0099ff'][Math.floor(Math.random() * 3)]; // Mid-Right Cyans
        return ['#0000ff', '#0000cc', '#000099'][Math.floor(Math.random() * 3)]; // Right Blues
    };

    const lineCount = 100; // Significantly reduced for a clean light-bar look

    for (let i = 0; i < lineCount; i++) {
        const line = document.createElement('div');
        line.className = 'spectrum-line';

        
        // Scattered horizontally but perfectly straight vertically
        const xPos = Math.random() * 100;
        const width = Math.random() * 10 + 2; // Varying widths for visual depth
        const height = 150 + Math.random() * 100;
        const opacity = Math.random() * 0.8 + 0.2;
        const color = getColor(xPos);

        line.style.left = `${xPos}%`;
        line.style.width = `${width}px`;
        line.style.height = `${height}%`;
        line.style.opacity = opacity;
        line.style.backgroundColor = color;
        line.style.color = color; // Used for box-shadow currentColor

        // Perfectly straight (0 rotation)
        line.style.transform = `rotate(0deg) translateY(${Math.random() * 20 - 10}%)`;

        // Staggered cinematic entry
        line.style.animationDelay = `${Math.random() * 1.5}s`;

        spectrumContainer.appendChild(line);
    }

    // Trigger Audio and Animation
    introSound.currentTime = 0;
    introSound.play().then(() => {
        console.log('Intro audio playing...');
    }).catch(e => {
        console.warn('Audio auto-play failed:', e);
    });

    spectrumContainer.classList.add('spectrum-active');

    // Pre-render profile selection early for smooth transition
    setTimeout(() => {
        // Prepare profile selection (render but keep invisible)
        profileSelection.style.display = 'flex';
        profileSelection.style.opacity = '0';
        profileSelection.style.pointerEvents = 'none';
        profileSelection.style.zIndex = '9999'; // Higher than splash during transition
        // Force browser to render/prepare the profiles
        void profileSelection.offsetHeight;
    }, 3500);

    // Start smooth transition - overlap animations for seamless experience
    setTimeout(() => {
        // Lower splash z-index so profiles can show through during fade
        splashScreen.style.zIndex = '9997';
        
        // Start showing profiles FIRST (before splash fades)
        profileSelection.style.pointerEvents = 'auto';
        profileSelection.style.transition = 'opacity 0.6s ease-in';
        profileSelection.classList.add('active');
        
        // Trigger reflow to ensure transition starts
        void profileSelection.offsetHeight;
        
        // Fade in profiles immediately - use double RAF for smoother start
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                profileSelection.style.opacity = '1';
            });
        });
        
        // Simultaneously start fading out splash (overlapping animations)
        splashScreen.style.opacity = '0';
        splashScreen.style.transition = 'opacity 0.5s ease-out';
        
        // Hide splash after fade completes
        setTimeout(() => {
            splashScreen.style.display = 'none';
            splashScreen.style.zIndex = '10000'; // Reset for future use
        }, 500);
    }, 3750); // Start at 3.75s for seamless overlap with 4s animation
};

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        // Handle main navbar
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Handle profile-specific navbars (they have their own scroll handlers in their respective JS files)
    });

    const introSound = document.getElementById('intro-sound');
    if (introSound) introSound.load();
    
    // Handle initial URL navigation
    handleInitialNavigation();
    
    // Auto-start the Netflix animation
    startExperience();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ============================================
// Browser History Management System
// ============================================
const HistoryManager = {
    maxDepth: 5,
    currentDepth: 0,
    isNavigating: false, // Flag to prevent recursive navigation
    
    // Initialize history state
    init() {
        // Set initial state
        const initialState = {
            type: 'home',
            profile: null,
            section: null,
            depth: 0
        };
        
        if (history.state === null) {
            history.replaceState(initialState, '', '/');
        }
        
        // Listen for browser back/forward
        window.addEventListener('popstate', (e) => {
            this.handlePopState(e.state);
        });
        
        this.currentDepth = history.state?.depth || 0;
    },
    
    // Push new state to history
    pushState(type, profile = null, section = null) {
        if (this.isNavigating) return;
        
        // Check depth limit - if at max, we'll still allow but track it
        // Browser history API doesn't allow us to remove entries, so we track depth
        if (this.currentDepth >= this.maxDepth) {
            console.warn(`History depth limit (${this.maxDepth}) reached. New navigation will exceed limit.`);
            // We'll still allow navigation but note the depth
        }
        
        const newState = {
            type: type, // 'home', 'profile', 'section'
            profile: profile,
            section: section,
            depth: Math.min(this.currentDepth + 1, this.maxDepth), // Cap at max depth
            timestamp: Date.now()
        };
        
        // Build URL
        let url = '/';
        if (profile) {
            url = `/${profile.toLowerCase()}`;
            if (section) {
                url += `#${section}`;
            }
        }
        
        this.isNavigating = true;
        history.pushState(newState, '', url);
        this.currentDepth = newState.depth;
        
        // Reset flag after a short delay
        setTimeout(() => {
            this.isNavigating = false;
        }, 100);
    },
    
    // Handle browser back/forward navigation
    handlePopState(state) {
        if (!state) {
            // Navigate to home
            this.currentDepth = 0;
            this.navigateToHome();
            return;
        }
        
        this.isNavigating = true;
        this.currentDepth = state.depth || 0;
        
        if (state.type === 'home') {
            this.navigateToHome();
        } else if (state.type === 'profile') {
            this.navigateToProfile(state.profile, state.section);
        } else if (state.type === 'section') {
            this.navigateToSection(state.profile, state.section);
        }
        
        setTimeout(() => {
            this.isNavigating = false;
        }, 100);
    },
    
    // Navigate to home/profile selection
    navigateToHome() {
        const profileSelection = document.getElementById('profile-selection');
        const pageContainer = document.getElementById('profile-page-container');
        const mainApp = document.getElementById('main-app');
        const splashScreen = document.getElementById('splash-screen');
        
        // Hide profile page
        if (pageContainer) {
            pageContainer.style.display = 'none';
        }
        
        // Hide main app
        if (mainApp) {
            mainApp.style.display = 'none';
        }
        
        // Show profile selection
        if (profileSelection) {
            profileSelection.style.display = 'flex';
            profileSelection.style.opacity = '1';
            profileSelection.classList.add('active');
        }
        
        window.scrollTo(0, 0);
    },
    
    // Navigate to a profile
    async navigateToProfile(profileName, section = null) {
        const profileSelection = document.getElementById('profile-selection');
        const mainApp = document.getElementById('main-app');
        const pageContainer = document.getElementById('profile-page-container');
        
        // Hide profile selection
        if (profileSelection) {
            profileSelection.style.display = 'none';
            profileSelection.classList.remove('active');
        }
        
        // Hide main app
        if (mainApp) {
            mainApp.style.display = 'none';
        }
        
        // Show and load profile page
        if (pageContainer) {
            pageContainer.style.display = 'block';
            
            // Check if profile is already loaded
            const existingPage = document.getElementById(`${profileName.toLowerCase()}-page`);
            if (!existingPage) {
                await loadProfilePage(profileName);
            }
            
            // Wait for page to be ready
            setTimeout(() => {
                const profilePage = document.getElementById(`${profileName.toLowerCase()}-page`);
                if (profilePage) {
                    profilePage.classList.add('active');
                    
                    // Navigate to section if specified
                    if (section) {
                        setTimeout(() => {
                            this.scrollToSection(section);
                        }, 300);
                    } else {
                        window.scrollTo(0, 0);
                    }
                }
            }, 100);
        }
    },
    
    // Navigate to a section within current profile
    navigateToSection(profileName, sectionId) {
        // If we're not on the right profile, navigate to it first
        const currentPage = document.getElementById(`${profileName.toLowerCase()}-page`);
        if (!currentPage) {
            this.navigateToProfile(profileName, sectionId);
            return;
        }
        
        // Scroll to section
        this.scrollToSection(sectionId);
    },
    
    // Scroll to section helper
    scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    },
    
    // Get current profile from URL or state
    getCurrentProfile() {
        const path = window.location.pathname;
        if (path !== '/' && path.length > 1) {
            const profile = path.substring(1).split('/')[0];
            return profile.charAt(0).toUpperCase() + profile.slice(1);
        }
        return history.state?.profile || null;
    },
    
    // Get current section from URL or state
    getCurrentSection() {
        const hash = window.location.hash;
        if (hash) {
            return hash.substring(1);
        }
        return history.state?.section || null;
    },
    
    // Navigate back to home/profile selection
    navigateToHomeWithHistory() {
        this.pushState('home', null, null);
        this.navigateToHome();
    }
};

// Global function to navigate back to home
function navigateToHome() {
    HistoryManager.navigateToHomeWithHistory();
}

// Initialize history manager on page load
HistoryManager.init();

// Handle initial navigation based on URL
async function handleInitialNavigation() {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    // If we have a profile path, navigate to it
    if (path !== '/' && path.length > 1) {
        const profileName = path.substring(1).split('/')[0];
        const capitalizedProfile = profileName.charAt(0).toUpperCase() + profileName.slice(1);
        
        // Set initial state
        const initialState = {
            type: 'profile',
            profile: capitalizedProfile,
            section: hash ? hash.substring(1) : null,
            depth: 0,
            timestamp: Date.now()
        };
        
        history.replaceState(initialState, '', window.location.pathname + hash);
        HistoryManager.currentDepth = 0;
        
        // Navigate to profile after a short delay to ensure DOM is ready
        setTimeout(async () => {
            await HistoryManager.navigateToProfile(capitalizedProfile, hash ? hash.substring(1) : null);
        }, 100);
    } else if (hash) {
        // Just a hash on home page - this shouldn't happen but handle it
        const initialState = {
            type: 'home',
            profile: null,
            section: hash.substring(1),
            depth: 0,
            timestamp: Date.now()
        };
        history.replaceState(initialState, '', '/');
    }
}

// Global functions available to all pages
function downloadResume() {
    // Placeholder - replace with actual resume URL
    const resumeUrl = '#'; // Add your resume PDF URL here
    if (resumeUrl && resumeUrl !== '#') {
        window.open(resumeUrl, '_blank');
    } else {
        // Fallback: open email with resume request
        window.location.href = 'mailto:rajshashwatiitd@gmail.com?subject=Resume Request&body=Hi Shashwat, I would like to request your resume.';
    }
}

function scheduleInterview() {
    // Placeholder - replace with actual calendar booking URL
    const calendarUrl = '#'; // Add your calendar booking URL (Calendly, etc.)
    if (calendarUrl && calendarUrl !== '#') {
        window.open(calendarUrl, '_blank');
    } else {
        // Fallback: open email for interview scheduling
        window.location.href = 'mailto:rajshashwatiitd@gmail.com?subject=Interview Scheduling&body=Hi Shashwat, I would like to schedule an interview with you.';
    }
}

async function loadProfilePage(profileName) {
    const pageContainer = document.getElementById('profile-page-container');
    if (!pageContainer) return;

    // Load HTML
    try {
        const response = await fetch(`pages/${profileName.toLowerCase()}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load ${profileName} page`);
        }
        const html = await response.text();
        pageContainer.innerHTML = `<div id="${profileName.toLowerCase()}-page">${html}</div>`;
        
        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = `pages/${profileName.toLowerCase()}.css`;
        cssLink.id = `${profileName.toLowerCase()}-css`;
        
        // Remove previous profile CSS if exists
        const prevCss = document.getElementById(`${profileName.toLowerCase()}-css`);
        if (prevCss) prevCss.remove();
        
        document.head.appendChild(cssLink);
        
        // Load JS
        const jsScript = document.createElement('script');
        jsScript.src = `pages/${profileName.toLowerCase()}.js`;
        jsScript.id = `${profileName.toLowerCase()}-js`;
        
        // Remove previous profile JS if exists
        const prevJs = document.getElementById(`${profileName.toLowerCase()}-js`);
        if (prevJs) prevJs.remove();
        
        document.body.appendChild(jsScript);
        
        // Initialize page-specific functions
        jsScript.onload = () => {
            const initFunction = window[`initialize${profileName}Page`];
            if (initFunction && typeof initFunction === 'function') {
                initFunction();
            }
        };
        
    } catch (error) {
        console.error(`Error loading ${profileName} page:`, error);
        pageContainer.innerHTML = `<div style="padding: 100px; text-align: center;"><h1>${profileName} Page - Coming Soon</h1></div>`;
    }
}

function selectProfile(profile) {
    console.log(`Profile selected: ${profile}`);
    const profileSelection = document.getElementById('profile-selection');
    const mainApp = document.getElementById('main-app');
    const pageContainer = document.getElementById('profile-page-container');

    // Get the clicked profile card using event.target
    const clickedCard = event.currentTarget;

    // Add zoom animation to clicked card
    clickedCard.classList.add('selected');

    // Push to history
    HistoryManager.pushState('profile', profile, null);

    // Start fade-out after brief card zoom
    setTimeout(() => {
        profileSelection.classList.add('fade-out');

        // After fade-out completes, hide profile screen and show appropriate page
        setTimeout(async () => {
            profileSelection.style.display = 'none';
            profileSelection.classList.remove('fade-out', 'active');
            
            // Hide main app
            if (mainApp) mainApp.style.display = 'none';
            
            // Show page container
            if (pageContainer) {
                pageContainer.style.display = 'block';
                
                // Load the profile page
                await loadProfilePage(profile);
                
                // Reset scroll and trigger fade-in animation
                window.scrollTo(0, 0);
                setTimeout(() => {
                    const profilePage = document.getElementById(`${profile.toLowerCase()}-page`);
                    if (profilePage) {
                        profilePage.classList.add('active');
                    }
                }, 10);
            }
        }, 500); // Match fade-out duration
    }, 300); // Match profile zoom duration
}
