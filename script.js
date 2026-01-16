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

    // Setup navigation links for initial page load
    setupNavigationLinks();
    
    // Mobile menu toggle functionality - initialize immediately
    setupMobileMenu();
    
    // Also initialize after a short delay to ensure DOM is ready
    setTimeout(() => {
        setupMobileMenu();
    }, 100);
});

// Mobile menu functionality
function setupMobileMenu() {
    const menuToggles = document.querySelectorAll('.mobile-menu-toggle');
    const navLinks = document.querySelectorAll('.nav-links');
    
    menuToggles.forEach(toggle => {
        // Remove any existing event listeners by cloning
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Find the corresponding nav-links for this toggle
            const navbar = this.closest('nav');
            const links = navbar ? navbar.querySelector('.nav-links') : null;
            
            if (links) {
                const isActive = links.classList.contains('active');
                links.classList.toggle('active');
                
                // Change icon
                const icon = this.querySelector('i');
                if (icon) {
                    if (!isActive) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
    
    // Close menu when clicking outside (with delay to allow toggle click)
    document.addEventListener('click', function(e) {
        // Don't close if clicking on the toggle button or inside the menu
        if (e.target.closest('.mobile-menu-toggle') || e.target.closest('.nav-links')) {
            return;
        }
        
        // Close all menus
        navLinks.forEach(links => {
            if (links.classList.contains('active')) {
                links.classList.remove('active');
                const navbar = links.closest('nav');
                if (navbar) {
                    const toggle = navbar.querySelector('.mobile-menu-toggle');
                    if (toggle) {
                        const icon = toggle.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            }
        });
    });
}

function closeMobileMenu() {
    const navLinks = document.querySelectorAll('.nav-links');
    navLinks.forEach(links => {
        links.classList.remove('active');
    });
    const toggles = document.querySelectorAll('.mobile-menu-toggle');
    toggles.forEach(toggle => {
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Universal function to set up navigation links - works for all profiles
function setupNavigationLinks() {
    // Find all anchor links that start with # (section links) within profile pages
    const pageContainer = document.getElementById('profile-page-container');
    const currentPage = pageContainer ? pageContainer.querySelector('[id$="-page"]') : null;
    
    // Only set up links within the current profile page to avoid conflicts
    const anchors = currentPage 
        ? currentPage.querySelectorAll('a[href^="#"]')
        : document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        // Skip if this anchor already has our custom handler (check for data attribute)
        if (anchor.hasAttribute('data-nav-handler-set')) {
            return;
        }
        
        // Mark as handled
        anchor.setAttribute('data-nav-handler-set', 'true');
        
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const href = this.getAttribute('href');
            if (!href || href === '#' || href === '#!') return;
            
            const targetId = href.substring(1); // Remove the #
            
            // Try to use profile-specific scrollToSection function (it's in the profile's JS scope)
            // Since scrollToSection is defined in each profile's JS file, we need to check if it exists
            // The profile initialization should have set it up, but we'll also handle it here
            
            // First, try to find the target element
            const target = document.getElementById(targetId);
            if (!target) {
                console.warn(`Section with id "${targetId}" not found`);
                return;
            }
            
            // Use HistoryManager to update URL and scroll
            if (typeof HistoryManager !== 'undefined' && !HistoryManager.isNavigating) {
                const currentPageId = currentPage ? currentPage.id : null;
                if (currentPageId) {
                    const profileName = currentPageId.replace('-page', '');
                    const capitalizedProfile = profileName.charAt(0).toUpperCase() + profileName.slice(1);
                    HistoryManager.pushState('section', capitalizedProfile, targetId);
                }
            }
            
            // Scroll to target
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            closeMobileMenu();
        }, true); // Use capture phase to ensure it fires before other handlers
    });
}

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
        
        // Build URL using hash-based routing to avoid server-side routing issues
        let url = '/';
        if (profile) {
            url = `/#${profile.toLowerCase()}`;
            if (section) {
                url += `-${section}`;
            }
        } else if (section) {
            url = `/#${section}`;
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
            // Hide all existing profile pages first
            const allProfilePages = document.querySelectorAll('[id$="-page"]');
            allProfilePages.forEach(page => {
                page.classList.remove('active');
                page.style.display = 'none';
            });
            
            // Check if profile is already loaded in the container
            const existingPage = pageContainer.querySelector(`#${profileName.toLowerCase()}-page`);
            if (!existingPage) {
                // Load the profile page (it will handle visibility)
                console.log(`Loading new profile page: ${profileName}`);
                pageContainer.style.display = 'block';
                pageContainer.style.opacity = '1';
                pageContainer.style.visibility = 'visible';
                await loadProfilePage(profileName);
            } else {
                // Profile already exists, but we still need to preload videos
                console.log(`Profile ${profileName} already exists, reinitializing with preload`);
                
                // Ensure pageContainer is visible
                pageContainer.style.display = 'block';
                pageContainer.style.opacity = '1';
                pageContainer.style.visibility = 'visible';
                
                // Hide all other profile pages first
                const allPages = pageContainer.querySelectorAll('[id$="-page"]');
                allPages.forEach(page => {
                    if (page.id !== `${profileName.toLowerCase()}-page`) {
                        page.style.display = 'none';
                        page.classList.remove('active');
                        page.style.opacity = '0';
                        page.style.visibility = 'hidden';
                    }
                });
                
                // Show the existing page immediately
                existingPage.style.display = 'block';
                existingPage.classList.add('active');
                
                // Reinitialize the page's JavaScript
                const initFunction = window[`initialize${profileName}Page`];
                if (initFunction && typeof initFunction === 'function') {
                    console.log(`Reinitializing ${profileName} page`);
                    initFunction();
                }
                
                // Show the page immediately - don't wait for videos
                requestAnimationFrame(() => {
                    existingPage.style.transition = 'opacity 0.3s ease-in';
                    existingPage.style.visibility = 'visible';
                    existingPage.style.opacity = '1';
                    existingPage.style.display = 'block';
                    existingPage.classList.add('active'); // Ensure active class is set
                });
                
                // Safety: Force show after a short delay to ensure it's visible
                setTimeout(() => {
                    // Check computed styles, not inline styles
                    const computedStyle = window.getComputedStyle(existingPage);
                    if (computedStyle.opacity === '0' || computedStyle.visibility === 'hidden') {
                        console.warn('Page still hidden after switch, forcing visibility');
                        existingPage.style.opacity = '1';
                        existingPage.style.visibility = 'visible';
                        existingPage.style.display = 'block';
                        existingPage.classList.add('active');
                    }
                    // Also ensure pageContainer is visible
                    if (pageContainer) {
                        pageContainer.style.display = 'block';
                        pageContainer.style.opacity = '1';
                        pageContainer.style.visibility = 'visible';
                    }
                }, 200);
                
                // Reinitialize video carousel in background (don't block page display)
                const profileType = `${profileName.toLowerCase()}_profile`;
                if (typeof initializeVideoCarousel === 'function') {
                    // Initialize video carousel asynchronously without blocking
                    setTimeout(() => {
                        try {
                            console.log(`Reinitializing video carousel for ${profileType}`);
                            initializeVideoCarousel(profileType);
                            
                            // After video carousel init, ensure page is still visible
                            existingPage.classList.add('active');
                            existingPage.style.opacity = '1';
                            existingPage.style.visibility = 'visible';
                            existingPage.style.display = 'block';
                        } catch (error) {
                            console.warn('Video carousel reinitialization issue:', error);
                        }
                    }, 100);
                }
                
                // Ensure profile selector is initialized
                setTimeout(() => {
                    console.log('Initializing profile selector for existing page');
                    initializeProfileSelectorForAllPages();
                    
                    // Also setup navigation links
                    setupNavigationLinks();
                    
                    // Final check: ensure page is visible (CSS might have hidden it)
                    existingPage.classList.add('active');
                    existingPage.style.opacity = '1';
                    existingPage.style.visibility = 'visible';
                    existingPage.style.display = 'block';
                    if (pageContainer) {
                        pageContainer.style.opacity = '1';
                        pageContainer.style.visibility = 'visible';
                        pageContainer.style.display = 'block';
                    }
                }, 150);
            }
            
            // Wait for page to be ready and navigate to section if specified
            setTimeout(() => {
                const profilePage = document.getElementById(`${profileName.toLowerCase()}-page`);
                if (profilePage) {
                    // Ensure profile selector is initialized
                    initializeProfileSelectorForAllPages();
                    
                    // Setup navigation links for the profile page
                    setupNavigationLinks();
                    
                    // Re-initialize profile selector to ensure dropdown works
                    setTimeout(() => {
                        initializeProfileSelectorForAllPages();
                    }, 150);
                    
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
    
    // Check if we have a path-based route (legacy support) or hash-based route
    if (path !== '/' && path.length > 1) {
        // Legacy path-based routing - convert to hash-based
        const profileName = path.substring(1).split('/')[0];
        const capitalizedProfile = profileName.charAt(0).toUpperCase() + profileName.slice(1);
        
        // Convert to hash-based URL
        const newHash = hash ? `#${capitalizedProfile.toLowerCase()}-${hash.substring(1)}` : `#${capitalizedProfile.toLowerCase()}`;
        const newUrl = `/${newHash}`;
        
        // Set initial state
        const initialState = {
            type: 'profile',
            profile: capitalizedProfile,
            section: hash ? hash.substring(1) : null,
            depth: 0,
            timestamp: Date.now()
        };
        
        history.replaceState(initialState, '', newUrl);
        HistoryManager.currentDepth = 0;
        
        // Navigate to profile after a short delay to ensure DOM is ready
        setTimeout(async () => {
            await HistoryManager.navigateToProfile(capitalizedProfile, hash ? hash.substring(1) : null);
        }, 100);
    } else if (hash && hash.length > 1) {
        // Hash-based routing
        const hashParts = hash.substring(1).split('-');
        const profileName = hashParts[0];
        const section = hashParts.length > 1 ? hashParts.slice(1).join('-') : null;
        
        if (profileName && ['recruiter', 'developer', 'stalker', 'adventurer'].includes(profileName.toLowerCase())) {
            const capitalizedProfile = profileName.charAt(0).toUpperCase() + profileName.slice(1);
            
            const initialState = {
                type: 'profile',
                profile: capitalizedProfile,
                section: section,
                depth: 0,
                timestamp: Date.now()
            };
            
            history.replaceState(initialState, '', hash);
            HistoryManager.currentDepth = 0;
            
            // Navigate to profile after a short delay to ensure DOM is ready
            setTimeout(async () => {
                await HistoryManager.navigateToProfile(capitalizedProfile, section);
            }, 100);
        } else {
            // Just a section hash on home page
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
}

// Global functions available to all pages
function downloadResume() {
    // Download resume from assets/resume/shashwat_resume.pdf
    const resumeUrl = 'assets/resume/shashwat_resume.pdf';
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

// Make openEmail globally accessible - available to all pages
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

// Global profile switching function - available to all profile pages
window.switchProfile = async function(profileName) {
    console.log(`Switching to profile: ${profileName}`);
    
    // Close dropdown if open - try multiple ways to find it
    const pageContainer = document.getElementById('profile-page-container');
    let container = null;
    
    if (pageContainer) {
        const currentPage = pageContainer.querySelector('[id$="-page"]');
        if (currentPage) {
            container = currentPage.querySelector('.profile-selector-container');
        }
    }
    
    if (!container) {
        container = document.querySelector('.profile-selector-container');
    }
    
    if (container) {
        container.classList.remove('active');
    }
    
    // Don't switch if clicking on the same profile
    const currentPageId = pageContainer ? pageContainer.querySelector('[id$="-page"]')?.id : null;
    if (currentPageId === `${profileName.toLowerCase()}-page`) {
        console.log('Already on this profile');
        return; // Already on this profile
    }
    
    // Ensure pageContainer is visible when switching
    if (pageContainer) {
        pageContainer.style.display = 'block';
        pageContainer.style.opacity = '1';
        pageContainer.style.visibility = 'visible';
        
        // Hide all current profile pages first
        const allProfilePages = pageContainer.querySelectorAll('[id$="-page"]');
        allProfilePages.forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
            page.style.opacity = '0';
            page.style.visibility = 'hidden';
        });
    }
    
    // Use HistoryManager for navigation (it handles everything)
    if (typeof HistoryManager !== 'undefined' && HistoryManager.navigateToProfile) {
        try {
            // Push to history and navigate
            HistoryManager.pushState('profile', profileName, null);
            await HistoryManager.navigateToProfile(profileName, null);
        } catch (error) {
            console.error('Error navigating with HistoryManager:', error);
            // Fallback to direct loadProfilePage
            if (typeof loadProfilePage === 'function') {
                await loadProfilePageDirectly(profileName);
            }
        }
    } else if (typeof loadProfilePage === 'function') {
        // Fallback: use loadProfilePage directly
        await loadProfilePageDirectly(profileName);
    } else {
        console.error('Navigation functions not available. HistoryManager or loadProfilePage required.');
    }
};

// Helper function for direct profile loading
async function loadProfilePageDirectly(profileName) {
    const pageContainer = document.getElementById('profile-page-container');
    const profileSelection = document.getElementById('profile-selection');
    const mainApp = document.getElementById('main-app');
    
    // Hide profile selection if visible
    if (profileSelection) {
        profileSelection.style.display = 'none';
        profileSelection.classList.remove('active');
    }
    
    // Hide main app if visible
    if (mainApp) {
        mainApp.style.display = 'none';
    }
    
    // Show and load profile page (it will handle visibility)
    if (pageContainer) {
        pageContainer.style.display = 'block';
        await loadProfilePage(profileName);
        
        // Reset scroll and trigger fade-in animation
        window.scrollTo(0, 0);
        setTimeout(() => {
            const profilePage = document.getElementById(`${profileName.toLowerCase()}-page`);
            if (profilePage) {
                profilePage.classList.add('active');
            }
        }, 10);
    }
}

// Make toggleProfileDropdown globally accessible
window.toggleProfileDropdown = function(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Try to find container in current profile page first
    const pageContainer = document.getElementById('profile-page-container');
    let container = null;
    
    if (pageContainer) {
        const currentPage = pageContainer.querySelector('[id$="-page"]');
        if (currentPage) {
            container = currentPage.querySelector('.profile-selector-container');
        }
    }
    
    // Fallback to global search
    if (!container) {
        container = document.querySelector('.profile-selector-container');
    }
    
    if (container) {
        console.log('toggleProfileDropdown: Toggling container active state');
        const wasActive = container.classList.contains('active');
        container.classList.toggle('active');
        const isActive = container.classList.contains('active');
        console.log(`Container state: ${wasActive} -> ${isActive}`);
        
        // Also check if dropdown is visible
        const dropdown = container.querySelector('.profile-dropdown');
        if (dropdown) {
            console.log('Dropdown element found');
            const computedStyle = window.getComputedStyle(dropdown);
            console.log('Dropdown visibility:', computedStyle.visibility);
            console.log('Dropdown display:', computedStyle.display);
        }
    } else {
        console.error('toggleProfileDropdown: Could not find profile-selector-container');
    }
};

// Universal profile selector initialization - works for all profiles
function initializeProfileSelectorForAllPages() {
    console.log('=== Initializing profile selector for all pages ===');
    
    // Find the currently active/visible profile page
    const pageContainer = document.getElementById('profile-page-container');
    if (!pageContainer) {
        console.error('profile-page-container not found');
        return;
    }
    
    // Find the visible profile page
    const currentPage = pageContainer.querySelector('[id$="-page"][style*="block"], [id$="-page"].active') || 
                       pageContainer.querySelector('[id$="-page"]');
    
    if (!currentPage) {
        console.warn('No current profile page found');
        return;
    }
    
    const pageId = currentPage.id;
    const profileName = pageId.replace('-page', '');
    const capitalizedProfile = profileName.charAt(0).toUpperCase() + profileName.slice(1);
    
    console.log(`Current profile detected: ${capitalizedProfile} (from ${pageId})`);
    
    // Update Continue Watching section title
    const continueWatchingTitle = currentPage.querySelector('#continue-watching-title');
    if (continueWatchingTitle) {
        continueWatchingTitle.textContent = `Continue Watching for ${profileName}`;
        console.log(`Updated Continue Watching title to: Continue Watching for ${profileName}`);
    }
    
    const profileImages = {
        'Recruiter': '../assets/icons/recruiter.png',
        'Developer': '../assets/icons/developer.png',
        'Stalker': '../assets/icons/stalker.png',
        'Adventurer': '../assets/icons/adventurer.png'
    };
    
    // Update current profile image
    const currentProfileImg = currentPage.querySelector('#current-profile-img');
    if (currentProfileImg && profileImages[capitalizedProfile]) {
        currentProfileImg.src = profileImages[capitalizedProfile];
        currentProfileImg.alt = capitalizedProfile;
        console.log(`Updated profile image to: ${profileImages[capitalizedProfile]}`);
    } else {
        console.warn(`Could not find profile image element or image for ${capitalizedProfile}`);
    }
    
    // Set up event listeners for profile dropdown items
    const profileItems = currentPage.querySelectorAll('.profile-dropdown-item');
    console.log(`Found ${profileItems.length} profile dropdown items in current page`);
    
    if (profileItems.length === 0) {
        console.error('No profile dropdown items found! The profile selector HTML might not be loaded.');
        return;
    }
    
    profileItems.forEach((item, index) => {
        // Get profile name from data attribute or text content
        const profileName = item.getAttribute('data-profile') || 
                           item.querySelector('.profile-dropdown-name')?.textContent.trim();
        
        if (profileName) {
            // Remove any existing listeners by cloning
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Remove any inline onclick handlers
            newItem.removeAttribute('onclick');
            newItem.onclick = null;
            
            newItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Profile item clicked:', profileName);
                
                // Close dropdown first
                const container = newItem.closest('.profile-selector-container');
                if (container) {
                    container.classList.remove('active');
                }
                
                // Switch profile
                if (typeof window.switchProfile === 'function') {
                    window.switchProfile(profileName);
                } else {
                    console.error('switchProfile function not available');
                    // Fallback: try to navigate directly
                    if (typeof HistoryManager !== 'undefined' && HistoryManager.navigateToProfile) {
                        HistoryManager.pushState('profile', profileName, null);
                        HistoryManager.navigateToProfile(profileName, null);
                    }
                }
            }, true); // Use capture phase
            
            console.log(`✓ Set up listener for profile: ${profileName}`);
        }
    });
    
    // Set up click handler for profile tile wrapper
    const profileTileWrapper = currentPage.querySelector('.profile-tile-wrapper');
    if (profileTileWrapper) {
        console.log('Found profile tile wrapper, setting up click handler');
        
        // Remove existing onclick attribute
        profileTileWrapper.removeAttribute('onclick');
        profileTileWrapper.onclick = null;
        
        // Remove existing event listeners by cloning (but preserve structure)
        const newWrapper = profileTileWrapper.cloneNode(true);
        // Also remove onclick from cloned element
        newWrapper.removeAttribute('onclick');
        newWrapper.onclick = null;
        
        profileTileWrapper.parentNode.replaceChild(newWrapper, profileTileWrapper);
        
        // Set up new event listener
        newWrapper.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('=== Profile tile clicked ===');
            
            // Find the container (it should be the parent)
            const container = newWrapper.closest('.profile-selector-container');
            if (container) {
                console.log('Found container, toggling active class');
                const wasActive = container.classList.contains('active');
                container.classList.toggle('active');
                const isActive = container.classList.contains('active');
                console.log(`Container state: ${wasActive} -> ${isActive}`);
                console.log('Container classes:', container.className);
                
                // Check dropdown visibility
                const dropdown = container.querySelector('.profile-dropdown');
                if (dropdown) {
                    const computedStyle = window.getComputedStyle(dropdown);
                    console.log('Dropdown visibility:', computedStyle.visibility);
                    console.log('Dropdown opacity:', computedStyle.opacity);
                    console.log('Dropdown display:', computedStyle.display);
                    console.log('Dropdown z-index:', computedStyle.zIndex);
                } else {
                    console.error('Dropdown element not found!');
                }
            } else {
                console.error('Could not find profile-selector-container');
                // Try finding it globally as fallback
                const globalContainer = document.querySelector('.profile-selector-container');
                if (globalContainer) {
                    console.log('Found container globally, toggling');
                    globalContainer.classList.toggle('active');
                }
            }
        }, true); // Use capture phase to ensure it fires
        
        console.log('✓ Set up click handler for profile tile wrapper');
    } else {
        console.warn('Profile tile wrapper not found in current page');
        // Try finding it globally
        const globalWrapper = document.querySelector('.profile-tile-wrapper');
        if (globalWrapper) {
            console.log('Found profile tile wrapper globally, setting up handler');
            globalWrapper.removeAttribute('onclick');
            globalWrapper.onclick = null;
            globalWrapper.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const container = globalWrapper.closest('.profile-selector-container');
                if (container) {
                    container.classList.toggle('active');
                }
            });
        }
    }
    
    console.log('=== Profile selector initialization complete ===');
}

// Helper function to wait for video carousel to be ready
function waitForVideoCarouselReady(profileType) {
    return new Promise((resolve, reject) => {
        const pageContainer = document.getElementById('profile-page-container');
        if (!pageContainer) {
            resolve(); // No container, nothing to wait for
            return;
        }
        
        const currentPage = pageContainer.querySelector('[id$="-page"]');
        if (!currentPage) {
            resolve(); // No page, nothing to wait for
            return;
        }
        
        const videoContainer = currentPage.querySelector('#hero-video-container');
        if (!videoContainer) {
            // Video container not found, wait a bit and try again
            setTimeout(() => {
                waitForVideoCarouselReady(profileType).then(resolve).catch(reject);
            }, 200);
            return;
        }
        
        // Check if videos exist
        const videos = videoContainer.querySelectorAll('video');
        if (videos.length === 0) {
            // No videos yet, wait for initializeVideoCarousel to create them
            // We'll check again after a delay
            setTimeout(() => {
                waitForVideoCarouselReady(profileType).then(resolve).catch(reject);
            }, 300);
            return;
        }
        
        // Wait for all videos to be ready
        const totalVideos = videos.length;
        
        if (totalVideos === 0) {
            resolve(); // No videos to wait for
            return;
        }
        
        const checkVideoReady = (video) => {
            return new Promise((videoResolve) => {
                // Check if video is already ready
                if (video.readyState >= 3) { // HAVE_FUTURE_DATA or higher
                    videoResolve();
                    return;
                }
                
                // Wait for canplaythrough event (video can play without buffering)
                const onCanPlayThrough = () => {
                    video.removeEventListener('canplaythrough', onCanPlayThrough);
                    video.removeEventListener('error', onError);
                    videoResolve();
                };
                
                const onError = () => {
                    video.removeEventListener('canplaythrough', onCanPlayThrough);
                    video.removeEventListener('error', onError);
                    videoResolve(); // Resolve anyway to not block loading
                };
                
                video.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
                video.addEventListener('error', onError, { once: true });
                
                // Timeout after 5 seconds per video
                setTimeout(() => {
                    video.removeEventListener('canplaythrough', onCanPlayThrough);
                    video.removeEventListener('error', onError);
                    videoResolve(); // Resolve anyway after timeout
                }, 5000);
            });
        };
        
        // Wait for all videos
        Promise.all(Array.from(videos).map(checkVideoReady)).then(() => {
            console.log(`All ${totalVideos} videos are ready`);
            resolve();
        }).catch(reject);
    });
}

async function loadProfilePage(profileName) {
    const pageContainer = document.getElementById('profile-page-container');
    if (!pageContainer) return;

    // Keep page hidden while loading
    pageContainer.style.opacity = '0';
    pageContainer.style.visibility = 'hidden';
    pageContainer.style.display = 'block'; // Keep display: block for layout
    
    // Safety timeout: ensure page shows after 3 seconds even if something fails
    let safetyTimeout = setTimeout(() => {
        console.warn('Safety timeout: Forcing page to show after 3 seconds');
        pageContainer.style.transition = 'opacity 0.3s ease-in';
        pageContainer.style.visibility = 'visible';
        pageContainer.style.opacity = '1';
    }, 3000);

    // Load HTML
    try {
        const response = await fetch(`pages/${profileName.toLowerCase()}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load ${profileName} page`);
        }
        const html = await response.text();
        
        // Clear container and load new profile
        // Add 'active' class immediately so CSS doesn't hide it
        pageContainer.innerHTML = `<div id="${profileName.toLowerCase()}-page" class="active">${html}</div>`;
        
        // Setup mobile menu after HTML is loaded
        setTimeout(() => {
            setupMobileMenu();
        }, 100);
        
        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = `pages/${profileName.toLowerCase()}.css`;
        cssLink.id = `${profileName.toLowerCase()}-css`;
        
        // Remove previous profile CSS if exists
        const prevCss = document.getElementById(`${profileName.toLowerCase()}-css`);
        if (prevCss) prevCss.remove();
        
        document.head.appendChild(cssLink);
        
        // Wait for CSS to load
        await new Promise((resolve) => {
            if (cssLink.sheet) {
                resolve();
            } else {
                cssLink.onload = resolve;
                cssLink.onerror = resolve; // Continue even if CSS fails
                // Timeout after 2 seconds
                setTimeout(resolve, 2000);
            }
        });
        
        // Load JS
        const jsScript = document.createElement('script');
        jsScript.src = `pages/${profileName.toLowerCase()}.js`;
        jsScript.id = `${profileName.toLowerCase()}-js`;
        
        // Remove previous profile JS if exists
        const prevJs = document.getElementById(`${profileName.toLowerCase()}-js`);
        if (prevJs) prevJs.remove();
        
        // Wait for JS to load and initialize
        await new Promise((resolve) => {
            jsScript.onload = async () => {
                console.log(`Loaded ${profileName} page script`);
                
                // Wait a bit for the script to fully execute
                await new Promise(r => setTimeout(r, 100));
                
                const initFunction = window[`initialize${profileName}Page`];
                if (initFunction && typeof initFunction === 'function') {
                    console.log(`Calling initialize${profileName}Page`);
                    initFunction();
                } else {
                    console.warn(`initialize${profileName}Page function not found`);
                }
                
                // Setup mobile menu for dynamically loaded pages
                setupMobileMenu();
                
                // Show the page immediately - don't wait for videos
                clearTimeout(safetyTimeout); // Clear safety timeout since we're showing the page
                
                // Get the actual profile page element (not just the container)
                const profilePage = document.getElementById(`${profileName.toLowerCase()}-page`);
                
                requestAnimationFrame(() => {
                    // Show the container
                    pageContainer.style.transition = 'opacity 0.3s ease-in';
                    pageContainer.style.visibility = 'visible';
                    pageContainer.style.opacity = '1';
                    
                    // Also ensure the profile page itself is visible and has active class
                    if (profilePage) {
                        profilePage.classList.add('active');
                        profilePage.style.opacity = '1';
                        profilePage.style.visibility = 'visible';
                        profilePage.style.display = 'block';
                    }
                });
                
                // Initialize video carousel in background (don't block page display)
                const profileType = `${profileName.toLowerCase()}_profile`;
                if (typeof initializeVideoCarousel === 'function') {
                    // Initialize video carousel asynchronously without blocking
                    setTimeout(() => {
                        try {
                            console.log(`Initializing video carousel for ${profileType}`);
                            initializeVideoCarousel(profileType);
                            
                            // After video carousel init, ensure page is still visible
                            if (profilePage) {
                                profilePage.classList.add('active');
                                profilePage.style.opacity = '1';
                                profilePage.style.visibility = 'visible';
                            }
                        } catch (error) {
                            console.warn('Video carousel initialization issue:', error);
                        }
                    }, 100);
                }
                
                // Ensure profile selector is initialized
                setTimeout(() => {
                    console.log('Initializing profile selector after page load');
                    initializeProfileSelectorForAllPages();
                    
                    // Setup navigation links for the newly loaded profile page
                    setupNavigationLinks();
                    
                    // Final check: ensure page is visible (CSS might have hidden it)
                    if (profilePage) {
                        profilePage.classList.add('active');
                        profilePage.style.opacity = '1';
                        profilePage.style.visibility = 'visible';
                    }
                    if (pageContainer) {
                        pageContainer.style.opacity = '1';
                        pageContainer.style.visibility = 'visible';
                        pageContainer.style.display = 'block';
                    }
                }, 200); // Increased delay to ensure DOM is fully ready
                
                resolve();
            };
            
            jsScript.onerror = () => {
                console.error(`Failed to load ${profileName} page script`);
                clearTimeout(safetyTimeout); // Clear safety timeout
                // Show page even if JS fails
                pageContainer.style.transition = 'opacity 0.3s ease-in';
                pageContainer.style.visibility = 'visible';
                pageContainer.style.opacity = '1';
                resolve(); // Continue even if JS fails
            };
            
            document.body.appendChild(jsScript);
        });
        
        // Note: Page visibility is now handled inside the JS onload handler
        // This ensures the page shows immediately after JS loads, not waiting for videos
        
    } catch (error) {
        console.error(`Error loading ${profileName} page:`, error);
        clearTimeout(safetyTimeout); // Clear safety timeout
        pageContainer.innerHTML = `<div style="padding: 100px; text-align: center; color: white;"><h1>${profileName} Page - Coming Soon</h1></div>`;
        pageContainer.style.opacity = '1';
        pageContainer.style.visibility = 'visible';
        pageContainer.style.display = 'block';
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
            
            // Show page container (but it will be hidden until ready)
            if (pageContainer) {
                // Load the profile page (it will show itself when ready)
                await loadProfilePage(profile);
                
                // Reset scroll
                window.scrollTo(0, 0);
                
                // Trigger fade-in animation (page is already visible from loadProfilePage)
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
