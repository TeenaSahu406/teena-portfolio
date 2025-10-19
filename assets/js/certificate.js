// Certificates Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all certificate page functionality
    initCertificateAnimations();
    initStatsCounter();
    initImageLoading();
    initSmoothScrolling();
    initParallaxEffect();
    initHoverEffects();
});

// Initialize certificate animations
function initCertificateAnimations() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(30px)';
                navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
                navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    // Intersection Observer for fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add specific animations based on element type
                if (entry.target.classList.contains('certificate-card')) {
                    entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                }
                
                if (entry.target.classList.contains('stat-item')) {
                    animateStatItem(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.certificate-category, .certificate-card, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        fadeObserver.observe(el);
    });
}

// Animated counter for statistics
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetText = entry.target.textContent;
                const target = parseInt(targetText.replace('+', ''));
                const hasPlus = targetText.includes('+');
                const isPercentage = targetText.includes('%');
                
                animateCounter(entry.target, target, hasPlus, isPercentage);
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter animation function
function animateCounter(element, target, hasPlus = false, isPercentage = false) {
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + (hasPlus ? '+' : '') + (isPercentage ? '%' : '');
            clearInterval(timer);
            
            // Add celebration effect for 100%
            if (target === 100 && isPercentage) {
                element.style.color = '#27ae60';
                element.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 300);
            }
        } else {
            element.textContent = Math.floor(current) + (isPercentage ? '%' : '');
        }
    }, 16);
}

// Image loading and error handling
function initImageLoading() {
    const certificateImages = document.querySelectorAll('.certificate-image');
    
    certificateImages.forEach(imgContainer => {
        const img = imgContainer.querySelector('img');
        if (!img) return;
        
        // Check if image is already loaded
        if (img.complete) {
            handleImageLoad(imgContainer, img);
        } else {
            img.addEventListener('load', () => handleImageLoad(imgContainer, img));
            img.addEventListener('error', () => handleImageError(imgContainer, img));
        }
        
        // Add click to view larger functionality
        imgContainer.addEventListener('click', function() {
            viewCertificateLarge(img.src, img.alt);
        });
    });
}

function handleImageLoad(container, img) {
    container.classList.add('loaded');
    container.style.backgroundImage = `url(${img.src})`;
    img.style.opacity = '1';
    
    // Add subtle scale animation
    container.style.transform = 'scale(1)';
    setTimeout(() => {
        container.style.transition = 'transform 0.3s ease';
    }, 100);
}

function handleImageError(container, img) {
    container.classList.add('loaded');
    container.classList.add('error');
    
    // Create placeholder content
    const placeholder = document.createElement('div');
    placeholder.className = 'certificate-placeholder';
    placeholder.innerHTML = `
        <i class="fas fa-file-certificate"></i>
        <span>Certificate Image</span>
        <small>Click to view details</small>
    `;
    
    container.appendChild(placeholder);
    img.style.display = 'none';
}

// Large certificate viewer
function viewCertificateLarge(src, alt) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'certificate-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <img src="${src}" alt="${alt}" class="modal-image">
            <div class="modal-info">
                <h3>${alt}</h3>
                <p>Click outside or press ESC to close</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = `
        .certificate-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            animation: modalFadeIn 0.3s ease forwards;
        }
        
        @keyframes modalFadeIn {
            to { opacity: 1; }
        }
        
        .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            transform: scale(0.8);
            animation: modalScaleIn 0.3s ease 0.1s forwards;
        }
        
        @keyframes modalScaleIn {
            to { transform: scale(1); }
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            z-index: 10001;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(0, 0, 0, 0.9);
            transform: scale(1.1);
        }
        
        .modal-image {
            max-width: 100%;
            max-height: 70vh;
            display: block;
        }
        
        .modal-info {
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
        }
        
        .modal-info h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
        }
        
        .modal-info p {
            margin: 0;
            color: #7f8c8d;
            font-size: 0.9rem;
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Close functionality
    const closeModal = () => {
        modal.style.animation = 'modalFadeOut 0.3s ease forwards';
        modal.querySelector('.modal-content').style.animation = 'modalScaleOut 0.3s ease forwards';
        
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // ESC key to close
    document.addEventListener('keydown', function escClose(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escClose);
        }
    });
}

// Smooth scrolling for navigation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax effect for background particles
function initParallaxEffect() {
    const particles = document.querySelectorAll('.bg-particle');
    if (particles.length === 0) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        particles.forEach((particle, index) => {
            const speed = 0.2 + (index * 0.05);
            const yPos = -(scrolled * speed);
            const rotation = scrolled * 0.05;
            
            particle.style.transform = `translateY(${yPos}px) rotate(${rotation}deg) scale(${1 + (scrolled * 0.0001)})`;
        });
    });
}

// Enhanced hover effects
function initHoverEffects() {
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    certificateCards.forEach(card => {
        // Mouse enter effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.zIndex = '10';
            
            // Add subtle glow based on category
            const category = this.closest('.certificate-category');
            if (category) {
                if (category.classList.contains('cyber-security')) {
                    this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2), 0 0 30px rgba(52, 152, 219, 0.3)';
                } else if (category.classList.contains('hackathon')) {
                    this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2), 0 0 30px rgba(231, 76, 60, 0.3)';
                } else if (category.classList.contains('webinar')) {
                    this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2), 0 0 30px rgba(155, 89, 182, 0.3)';
                } else if (category.classList.contains('courses')) {
                    this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2), 0 0 30px rgba(243, 156, 18, 0.3)';
                }
            }
            
            // Animate tags
            const tags = this.querySelectorAll('.tag');
            tags.forEach((tag, index) => {
                tag.style.transform = `translateY(-${(index + 1) * 2}px)`;
                tag.style.transition = `transform 0.3s ease ${index * 0.1}s`;
            });
        });
        
        // Mouse leave effect
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.zIndex = '1';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
            
            // Reset tags
            const tags = this.querySelectorAll('.tag');
            tags.forEach(tag => {
                tag.style.transform = 'translateY(0)';
            });
        });
        
        // Touch device support
        card.addEventListener('touchstart', function() {
            this.classList.add('touched');
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touched');
            }, 150);
        });
    });
}

// Stat item animation
function animateStatItem(statItem) {
    const number = statItem.querySelector('.stat-number');
    const label = statItem.querySelector('.stat-label');
    
    // Add bounce animation
    statItem.style.animation = 'statBounce 0.6s ease';
    
    // Add styles for animation
    const bounceStyles = `
        @keyframes statBounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#bounce-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'bounce-styles';
        styleSheet.textContent = bounceStyles;
        document.head.appendChild(styleSheet);
    }
}

// Print functionality for certificates
function initPrintFunctionality() {
    // Add print button to page
    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Certificates';
    printButton.className = 'print-button';
    printButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--gradient-certificates);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    printButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 20px rgba(39, 174, 96, 0.6)';
    });
    
    printButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(39, 174, 96, 0.4)';
    });
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    document.body.appendChild(printButton);
}

// Initialize print functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPrintFunctionality();
});

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCertificateAnimations,
        initStatsCounter,
        initImageLoading,
        initSmoothScrolling,
        initParallaxEffect,
        initHoverEffects
    };
}