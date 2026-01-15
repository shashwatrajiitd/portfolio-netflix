// Stalker Page Specific JavaScript

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
        const currentProfile = 'Stalker';
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
    const currentPage = document.getElementById('stalker-page');
    if (currentPage) {
        updateCurrentProfileImage('Stalker');
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

function initializeStalkerPage() {
    // Initialize navbar scroll effect
    const stalkerNavbar = document.getElementById('stalker-navbar');
    if (stalkerNavbar) {
        window.addEventListener('scroll', () => {
            // Check if scrolled past threshold
            if (window.scrollY > 50) {
                stalkerNavbar.classList.add('scrolled');
                stalkerNavbar.classList.add('scrolling-up');
            } else {
                stalkerNavbar.classList.remove('scrolled');
                stalkerNavbar.classList.remove('scrolling-up');
            }
        });
    }
    
    // Initialize profile selector
    initializeProfileSelector();
    
    // Create arched text effect for logo (only if logo contains text, not an image)
    const logo = document.querySelector('#stalker-navbar .logo');
    if (logo) {
        // Only apply arched text if logo doesn't contain an image
        const logoImg = logo.querySelector('img');
        if (!logoImg) {
            createArchedText(logo);
        }
    }
    
    // Smooth scroll for anchor links with history support
    const stalkerLinks = document.querySelectorAll('#stalker-page a[href^="#"], .instagram-main a[href^="#"]');
    stalkerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Handle initial URL hash if present
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        setTimeout(() => {
            scrollToSection(hash);
        }, 500);
    }
    
    // Load background video carousel
    initializeVideoCarousel('stalker_profile');
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
        'developer_profile': ['v0.mp4', 'v1.mp4', 'v2.mp4'],
        'adventurer_profile': ['suits.mp4', 'bb.mp4'],
        'stalker_profile': ['s0.mp4'] // Add videos when available
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
        video.src = `../assets/bg_videos/${profileType}/${videoFile}`;
        video.type = 'video/mp4'; // Explicitly set MIME type for MP4 files
        video.autoplay = index === 0; // Only autoplay first video
        video.muted = true;
        video.loop = false; // Don't loop individual videos - we'll handle sequential playback
        video.playsInline = true;
        video.setAttribute('webkit-playsinline', 'true'); // iOS support
        video.preload = 'auto'; // Preload videos for smoother transitions
        
        console.log(`Loading video: ${video.src}`);
        
        // Set first video as active
        if (index === 0) {
            video.classList.add('active');
        }
        
        // Handle video load errors
        video.addEventListener('error', (e) => {
            console.error(`Failed to load video: ${videoFile}`, e);
            console.error(`Video path attempted: ${video.src}`);
            if (video.error) {
                console.error(`Video error code: ${video.error.code}`);
                console.error(`Video error message: ${video.error.message}`);
            }
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
