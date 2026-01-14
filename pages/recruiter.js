// Recruiter Page Specific JavaScript

function downloadResume() {
    // Placeholder - replace with actual resume URL
    const resumeUrl = '#'; // Add your resume PDF URL here
    if (resumeUrl && resumeUrl !== '#') {
        window.open(resumeUrl, '_blank');
    } else {
        // Fallback: open email with resume request
        window.location.href = 'mailto:shashwatrajiitd@gmail.com?subject=Resume Request&body=Hi Shashwat, I would like to request your resume.';
    }
}

function scheduleInterview() {
    // Placeholder - replace with actual calendar booking URL
    const calendarUrl = '#'; // Add your calendar booking URL (Calendly, etc.)
    if (calendarUrl && calendarUrl !== '#') {
        window.open(calendarUrl, '_blank');
    } else {
        // Fallback: open email for interview scheduling
        window.location.href = 'mailto:shashwatrajiitd@gmail.com?subject=Interview Scheduling&body=Hi Shashwat, I would like to schedule an interview with you.';
    }
}

function scrollToSection(sectionId) {
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

function initializeRecruiterPage() {
    // Initialize navbar scroll effect
    const recruiterNavbar = document.getElementById('recruiter-navbar');
    if (recruiterNavbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                recruiterNavbar.classList.add('scrolled');
            } else {
                recruiterNavbar.classList.remove('scrolled');
            }
        });
    }
    
    // Create arched text effect for logo
    const logo = document.querySelector('#recruiter-navbar .logo');
    if (logo) {
        createArchedText(logo);
    }
    
    // Smooth scroll for anchor links
    const recruiterLinks = document.querySelectorAll('#recruiter-page a[href^="#"], .instagram-main a[href^="#"]');
    recruiterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Load background video carousel
    initializeVideoCarousel('recruiter_profile');
}

// Initialize Netflix-style video carousel
let videoCarouselInterval = null; // Store interval to prevent multiple instances

function initializeVideoCarousel(profileType) {
    const videoContainer = document.getElementById('hero-video-container');
    if (!videoContainer) return;
    
    // Clear any existing carousel interval
    if (videoCarouselInterval) {
        clearInterval(videoCarouselInterval);
        videoCarouselInterval = null;
    }
    
    // Clear existing videos
    videoContainer.innerHTML = '';
    
    // List of videos for the profile type
    const videoFiles = {
        'recruiter_profile': ['bb.mp4', 'suits.mp4'],
        'developer_profile': [], // Add videos when available
        'adventurer_profile': [], // Add videos when available
        'stalker_profile': [] // Add videos when available
    };
    
    const videos = videoFiles[profileType] || [];
    if (videos.length === 0) return;
    
    let currentVideoIndex = 0;
    let videoElements = [];
    
    // Create video elements for each video
    videos.forEach((videoFile, index) => {
        const video = document.createElement('video');
        video.className = 'hero-video';
        video.src = `assets/bg_videos/${profileType}/${videoFile}`;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto'; // Preload videos for smoother transitions
        
        // Set first video as active
        if (index === 0) {
            video.classList.add('active');
        }
        
        // Handle video load errors
        video.addEventListener('error', (e) => {
            console.warn(`Failed to load video: ${videoFile}`, e);
        });
        
        // Ensure video plays when loaded
        video.addEventListener('loadeddata', () => {
            if (index === 0) {
                // Only autoplay the first video
                video.play().catch(err => {
                    console.warn(`Failed to autoplay video: ${videoFile}`, err);
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
        if (videoElements.length === 0 || videoElements.length === 1) return;
        
        const currentVideo = videoElements[currentVideoIndex];
        currentVideo.classList.remove('active');
        currentVideo.classList.add('fade-out');
        
        // Move to next video
        currentVideoIndex = (currentVideoIndex + 1) % videoElements.length;
        
        const nextVideo = videoElements[currentVideoIndex];
        
        // Reset and play next video
        setTimeout(() => {
            currentVideo.classList.remove('fade-out');
            nextVideo.classList.add('active');
            nextVideo.currentTime = 0; // Restart video
            nextVideo.play().catch(err => {
                console.warn('Failed to play next video', err);
            });
        }, 500); // Small delay for smooth transition
    }
    
    // Start the carousel - switch videos every 30 seconds
    if (videoElements.length > 1) {
        videoCarouselInterval = setInterval(switchToNextVideo, 30000); // 30 seconds
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
