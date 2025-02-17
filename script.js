// Navigation active state
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        if (email) {
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        }
    });
}

// Join Discord button
const joinDiscordButtons = document.querySelectorAll('.join-discord, .cta-button');
joinDiscordButtons.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();
        window.open('https://discord.gg/TGG8uWEuBm', '_blank');
    });
});

// Gallery image modal
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const modal = document.createElement('div');
        modal.classList.add('gallery-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    });
});

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .gallery-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
    }
    .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    .modal-content img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
    }
    .close-modal {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 30px;
        cursor: pointer;
    }
`;
document.head.appendChild(modalStyles);

// Mobile navigation menu
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    const menuButton = document.createElement('button');
    menuButton.classList.add('mobile-menu-button');
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    nav.querySelector('.nav-container').insertBefore(menuButton, navLinks);
    
    menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        menuButton.classList.toggle('active');
    });
};

// Initialize mobile menu on small screens
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// Add mobile menu styles
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    @media (max-width: 768px) {
        .mobile-menu-button {
            display: block;
            background: none;
            border: none;
            color: var(--text-color);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        }
        .nav-links {
            display: none;
        }
        .nav-links.show {
            display: flex;
        }
        .mobile-menu-button.active i::before {
            content: "\\f00d";
        }
    }
`;
document.head.appendChild(mobileStyles);

// Animate stats on scroll
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target + '+';
            }
        };
        updateCount();
    });
};

// Run stat animation when stats are in view
const observeStats = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observeStats.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    observeStats.observe(statsSection);
}

document.addEventListener('DOMContentLoaded', function() {
    // Get all tab links and content
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Add click event to each tab link
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links and panes
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked link and corresponding pane
            const tabId = this.getAttribute('data-tab');
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Handle hash changes for direct links
    function handleHash() {
        const hash = window.location.hash.slice(1) || 'home';
        const targetTab = document.querySelector(`[data-tab="${hash}"]`);
        if (targetTab) {
            targetTab.click();
        }
    }

    window.addEventListener('hashchange', handleHash);
    handleHash(); // Handle initial hash

    // Add click event to server profile picture
    const serverPfp = document.querySelector('.logo img');
    if (serverPfp) {
        serverPfp.style.cursor = 'pointer';
        serverPfp.addEventListener('click', () => {
            window.open('https://discord.gg/your-server-invite', '_blank');
        });
    }

    // Add click handler for the "Nigga" button
    const niggaBtn = document.querySelector('.sign-in-btn');
    if (niggaBtn) {
        niggaBtn.onclick = () => window.open('https://drive.google.com/drive/folders/175jXTdASbmbnO0k2ChjQRY57fWAH30Th?usp=sharing', '_blank');
    }
});

// Minecraft Particle Animation
document.addEventListener('DOMContentLoaded', function() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        // Set random initial positions
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        
        // Add animation with random delays and durations
        particle.style.animation = `
            float ${15 + Math.random() * 10}s infinite linear ${Math.random() * 5}s,
            pulse ${2 + Math.random() * 2}s infinite ${Math.random() * 2}s
        `;
    });
    
    // Add particles on mouse move
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) { // Only create particles 10% of the time
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            
            document.querySelector('.particles').appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    });
}); 
