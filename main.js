/**
 * NSS College Unit Website - Main JavaScript
 * Minimal vanilla JS for interactions and accessibility
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    const preloader = document.getElementById('preloader');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // ========================================
    // Preloader
    // ========================================
    
    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }

    // Hide preloader when page loads
    window.addEventListener('load', hidePreloader);

    // ========================================
    // Mobile Navigation
    // ========================================
    
    function toggleMobileMenu() {
        if (navToggle && navMenu) {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        }
    }

    function closeMobileMenu() {
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    // Event listeners for mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navToggle && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target) && 
            navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ========================================
    // Header Scroll Effect
    // ========================================
    
    function handleHeaderScroll() {
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // ========================================
    // Smooth Scrolling for Navigation Links
    // ========================================
    
    function smoothScrollToSection(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active nav link
            updateActiveNavLink(targetId);
        }
    }

    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }

    // Add smooth scrolling to all nav links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScrollToSection);
    });

    // ========================================
    // Gallery Filter
    // ========================================
    
    function filterGallery(filter) {
        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Event listeners for filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter gallery
            const filter = this.getAttribute('data-filter');
            filterGallery(filter);
        });
    });

    // ========================================
    // Gallery Lightbox
    // ========================================
    
    function openLightbox(img, title, desc) {
        if (lightbox && lightboxImg && lightboxTitle && lightboxDesc) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            lightboxClose.focus();
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Event listeners for gallery items
    galleryItems.forEach(item => {
        const img = item.querySelector('.gallery-img');
        const title = item.querySelector('.gallery-title');
        const desc = item.querySelector('.gallery-desc');
        
        if (img && title && desc) {
            item.addEventListener('click', () => {
                openLightbox(img, title.textContent, desc.textContent);
            });
            
            // Keyboard accessibility
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(img, title.textContent, desc.textContent);
                }
            });
            
            // Make gallery items focusable
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `View ${title.textContent} in lightbox`);
        }
    });

    // Event listeners for lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    // ========================================
    // Tab Functionality
    // ========================================
    
    function switchTab(tabId) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.add('active');
        }
        
        // Add active class to clicked button
        const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // Event listeners for tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // ========================================
    // Scroll Animations (Intersection Observer)
    // ========================================
    
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        if (animatedElements.length === 0) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Initialize scroll animations when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }

    // ========================================
    // Form Handling
    // ========================================
    
    function handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Create mailto link
        const mailtoLink = `mailto:nss@iiitnr.edu.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showNotification('Thank you! Your email client should open with the message ready to send.', 'success');
        
        // Reset form
        form.reset();
    }

    // Add form handler
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // ========================================
    // Notification System
    // ========================================
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10001',
            maxWidth: '400px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out'
        });
        
        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // ========================================
    // Print Functionality
    // ========================================
    
    function handlePrint() {
        // Add print-specific class to body
        document.body.classList.add('printing');
        
        // Print the page
        window.print();
        
        // Remove print class after printing
        setTimeout(() => {
            document.body.classList.remove('printing');
        }, 1000);
    }

    // Add print handler to print button
    const printBtn = document.querySelector('[onclick="window.print()"]');
    if (printBtn) {
        printBtn.addEventListener('click', handlePrint);
    }

    // ========================================
    // Accessibility Enhancements
    // ========================================
    
    function enhanceAccessibility() {
        // Add skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }
        
        // Add keyboard navigation for custom elements
        const focusableElements = document.querySelectorAll('.gallery-item, .initiative-card, .achievement-card');
        focusableElements.forEach(element => {
            element.setAttribute('tabindex', '0');
        });
        
        // Add ARIA labels where needed
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                button.setAttribute('aria-label', 'Button');
            }
        });
    }

    // Initialize accessibility enhancements
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceAccessibility);
    } else {
        enhanceAccessibility();
    }

    // ========================================
    // Performance Optimizations
    // ========================================
    
    // Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(handleHeaderScroll, 10);
    window.removeEventListener('scroll', handleHeaderScroll);
    window.addEventListener('scroll', debouncedScrollHandler);

    // ========================================
    // Error Handling
    // ========================================
    
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // You could send error reports to a logging service here
    });

    // ========================================
    // Liquid Glass Interactive Effects
    // ========================================
    
    function addLiquidGlassEffects() {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add liquid flow effect to cards on hover
        const cards = document.querySelectorAll('.card, .gallery-item, .initiative-card, .achievement-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Add glass morphism to navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(0, 122, 255, 0.1)';
                this.style.backdropFilter = 'blur(10px)';
                this.style.borderRadius = '8px';
                this.style.padding = '8px 16px';
                this.style.transition = 'all 0.3s ease';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
                this.style.backdropFilter = 'none';
                this.style.padding = '4px 0';
            });
        });
    }
    
    // Add CSS for ripple effect
    function addRippleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: liquidRipple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes liquidRipple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // Initialize Everything
    // ========================================
    
    function init() {
        console.log('NSS Website initialized successfully');
        
        // Set initial states
        if (header) {
            handleHeaderScroll();
        }
        
        // Initialize first tab as active
        if (tabContents.length > 0) {
            tabContents[0].classList.add('active');
        }
        
        // Initialize first filter as active
        if (filterBtns.length > 0) {
            filterBtns[0].classList.add('active');
        }
        
        // Initialize liquid glass effects
        addRippleStyles();
        addLiquidGlassEffects();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
