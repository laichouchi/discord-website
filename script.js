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
});

// Global variables
let currentUser = null;

// Update user stats function (client-side version)
function updateUserStats(hasWon = false) {
    if (!currentUser) return;
    
    try {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const user = users[currentUser.username];
        
        if (user) {
            // Update stats
            user.gamesPlayed++;
            if (hasWon) {
                user.wins++;
            }
            
            // Save back to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Update current user
            currentUser.gamesPlayed = user.gamesPlayed;
            currentUser.wins = user.wins;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            const gamesElement = document.querySelector('.menu-item:nth-child(1)');
            const winsElement = document.querySelector('.menu-item:nth-child(2)');
            if (gamesElement) gamesElement.innerHTML = `<i class="fas fa-gamepad"></i> Games: ${currentUser.gamesPlayed}`;
            if (winsElement) winsElement.innerHTML = `<i class="fas fa-trophy"></i> Wins: ${currentUser.wins}`;
        }
    } catch (error) {
        console.error('Error updating user stats:', error);
    }
}

// Update the spin function
function spin() {
    if (isSpinning) return;
    isSpinning = true;
    
    const numbers = calculateSpinResult();
    // ... rest of the spin animation code ...
    
    // After animation completes:
    const hasWon = numbers[0] === numbers[1] && numbers[1] === numbers[2];
    if (hasWon) {
        // Handle win
        showWinAnimation();
        if (currentUser) {
            updateUserStats(true);
        }
    } else {
        // Handle loss
        if (currentUser) {
            updateUserStats(false);
        }
    }
    
    isSpinning = false;
}

// Initialize default users and config when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize users if none exist
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
        const defaultUsers = {
            'BiteLaiX': {
                username: 'BiteLaiX',
                password: 'admin',
                createdAt: new Date().toISOString(),
                gamesPlayed: 0,
                wins: 0,
                isAdmin: true
            },
            'me': {
                username: 'me',
                password: 'me',
                createdAt: new Date().toISOString(),
                gamesPlayed: 0,
                wins: 0,
                isAdmin: false
            }
        };
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    
    // Initialize slot machine config if none exists
    const existingConfig = localStorage.getItem('slotMachineConfig');
    if (!existingConfig) {
        const defaultConfig = {
            winChance: 30
        };
        localStorage.setItem('slotMachineConfig', JSON.stringify(defaultConfig));
    }
    
    // Check for remembered user
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        currentUser = JSON.parse(rememberedUser);
        updateUIForLoggedInUser(currentUser);
    }
});

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const signInBtn = document.querySelector('.sign-in-btn');
    signInBtn.innerHTML = `
        <i class="fas fa-user"></i> ${user.username}
    `;
    
    // Add click handler for username menu
    signInBtn.style.cursor = 'pointer';
    signInBtn.addEventListener('click', toggleUserMenu);
    
    // Create user menu if it doesn't exist
    if (!document.querySelector('.user-menu')) {
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <div class="menu-item">
                <i class="fas fa-gamepad"></i>
                Games: ${user.gamesPlayed || 0}
            </div>
            <div class="menu-item">
                <i class="fas fa-trophy"></i>
                Wins: ${user.wins || 0}
            </div>
            <div class="menu-item" onclick="signOut()">
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </div>
        `;
        signInBtn.parentNode.appendChild(userMenu);
    }
    
    // Enable profile popup
    const profilePic = document.querySelector('.logo img');
    if (profilePic) {
        profilePic.style.cursor = 'pointer';
        profilePic.addEventListener('click', showProfilePopup);
    }

    // Add admin panel tab if user is BiteLaiX
    if (user.username === 'BiteLaiX') {
        const navLinks = document.querySelector('.nav-links');
        const existingAdminTab = document.querySelector('[data-tab="admin-panel"]');
        
        if (!existingAdminTab) {
            const adminTab = document.createElement('a');
            adminTab.href = '#admin-panel';
            adminTab.className = 'tab-link';
            adminTab.setAttribute('data-tab', 'admin-panel');
            adminTab.innerHTML = '<i class="fas fa-shield-alt"></i> Admin Panel';
            navLinks.appendChild(adminTab);
            
            // Add click event
            adminTab.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                
                // Make sure admin panel exists and is visible
                let adminPanel = document.getElementById('admin-panel');
                if (!adminPanel) {
                    adminPanel = document.createElement('section');
                    adminPanel.id = 'admin-panel';
                    adminPanel.className = 'tab-pane';
                    document.querySelector('.tab-content').appendChild(adminPanel);
                }
                adminPanel.classList.add('active');
                
                // Load admin panel content
                loadAdminPanel();
            });
        }
    }
}

// Sign Out Function
function signOut() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberedUser');
    
    // Remove user menu
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.remove();
    }
    
    // Remove admin panel tab if it exists
    const adminTab = document.querySelector('[data-tab="admin-panel"]');
    if (adminTab) {
        adminTab.remove();
    }
    
    // Update sign in button
    const signInBtn = document.querySelector('.sign-in-btn');
    signInBtn.innerHTML = `<i class="fas fa-user"></i> Sign In`;
    signInBtn.style.cursor = 'pointer';
    signInBtn.onclick = openSignInModal;
    
    // Disable profile popup
    const profilePic = document.querySelector('.logo img');
    if (profilePic) {
        profilePic.style.cursor = 'default';
        profilePic.removeEventListener('click', showProfilePopup);
    }
    
    // Switch to home tab
    const homeTab = document.querySelector('[data-tab="home"]');
    if (homeTab) {
        homeTab.click();
    }
}

// Modal Functions
function openSignInModal() {
    const modal = document.getElementById('signInModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeSignInModal() {
    const modal = document.getElementById('signInModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
    
    // Reset form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('rememberMe').checked = false;
    if (isRegistering) {
        isRegistering = false;
        toggleRegistrationMode();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('signInModal');
    if (event.target === modal) {
        closeSignInModal();
    }
}

// Registration state
let isRegistering = false;

// Toggle between login and registration modes
function toggleRegistrationMode() {
    isRegistering = !isRegistering;
    const form = document.getElementById('signInForm');
    const formTitle = form.querySelector('.form-login');
    const submitBtn = form.querySelector('.btn');
    const registerText = form.querySelector('.register-link p');
    const usernameInput = document.getElementById('username');
    
    if (isRegistering) {
        formTitle.textContent = 'Register';
        submitBtn.textContent = 'Register';
        registerText.innerHTML = 'Already have an account? <a href="#" id="register-link">Sign In</a>';
        usernameInput.placeholder = 'Discord Username';
    } else {
        formTitle.textContent = 'Login';
        submitBtn.textContent = 'Login';
        registerText.innerHTML = 'Don\'t have an account? <a href="#" id="register-link">Register</a>';
        usernameInput.placeholder = 'Discord Username';
    }
    
    // Re-attach click event to the new register link
    document.getElementById('register-link').addEventListener('click', function(e) {
        e.preventDefault();
        toggleRegistrationMode();
    });
}

// Toggle user menu
function toggleUserMenu(e) {
    e.stopPropagation();
    const menu = document.querySelector('.user-menu');
    menu.classList.toggle('active');
    
    // Close menu when clicking outside
    const closeMenu = (e) => {
        if (!e.target.closest('.user-menu') && !e.target.closest('.sign-in-btn')) {
            menu.classList.remove('active');
            document.removeEventListener('click', closeMenu);
        }
    };
    document.addEventListener('click', closeMenu);
}

// Profile Popup Function
function showProfilePopup() {
    const popup = document.createElement('div');
    popup.className = 'profile-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <h3>「𝓤.𝓢.𝓢.𝓡」 Casino</h3>
                <span class="close-popup">&times;</span>
            </div>
            <div class="popup-body">
                <div class="user-stats">
                    <p><strong>Username:</strong> ${currentUser.username}</p>
                    <p><strong>Join Date:</strong> ${new Date(currentUser.joinDate).toLocaleDateString()}</p>
                    <p><strong>Games Played:</strong> ${currentUser.gamesPlayed}</p>
                    <p><strong>Wins:</strong> ${currentUser.wins}</p>
                </div>
                <div class="slot-machine">
                    <div class="slot-container">
                        <div class="slot-window">
                            <div class="slot-reel" id="reel1">
                                <div class="slot-strip">
                                    <div class="slot-symbol">1</div>
                                    <div class="slot-symbol">2</div>
                                    <div class="slot-symbol">3</div>
                                    <div class="slot-symbol">4</div>
                                    <div class="slot-symbol">5</div>
                                    <div class="slot-symbol">6</div>
                                </div>
                            </div>
                            <div class="slot-reel" id="reel2">
                                <div class="slot-strip">
                                    <div class="slot-symbol">1</div>
                                    <div class="slot-symbol">2</div>
                                    <div class="slot-symbol">3</div>
                                    <div class="slot-symbol">4</div>
                                    <div class="slot-symbol">5</div>
                                    <div class="slot-symbol">6</div>
                                </div>
                            </div>
                            <div class="slot-reel" id="reel3">
                                <div class="slot-strip">
                                    <div class="slot-symbol">1</div>
                                    <div class="slot-symbol">2</div>
                                    <div class="slot-symbol">3</div>
                                    <div class="slot-symbol">4</div>
                                    <div class="slot-symbol">5</div>
                                    <div class="slot-symbol">6</div>
                                </div>
                            </div>
                            <div class="win-line"></div>
                            <div class="slot-overlay"></div>
                        </div>
                        <button class="spin-button">
                            <span class="spin-text">SPIN</span>
                            <div class="spin-icon">🎰</div>
                        </button>
                    </div>
                </div>
                <button class="sign-out-btn" onclick="signOut()">Sign Out</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    // Add styles for the slot machine
    const style = document.createElement('style');
    style.textContent = `
        .profile-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
        }
        .popup-content {
            background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
            border-radius: 20px;
            padding: 25px;
            width: 90%;
            max-width: 400px;
            border: 2px solid #FFD700;
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.2),
                        inset 0 0 20px rgba(255, 215, 0, 0.1);
            transform: translateY(50px);
            opacity: 0;
            animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            border-bottom: 2px solid rgba(255, 215, 0, 0.3);
            padding-bottom: 15px;
        }
        .popup-header h3 {
            margin: 0;
            color: #FFD700;
            font-family: var(--heading-font);
            font-size: 1.8em;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        .slot-machine {
            background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
            border-radius: 15px;
            padding: 20px;
            box-shadow: inset 0 0 30px rgba(0,0,0,0.8);
        }
        .slot-container {
            position: relative;
            padding: 20px;
            background: #000;
            border-radius: 15px;
            border: 2px solid #FFD700;
            overflow: hidden;
        }
        .slot-window {
            background: #111;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
            display: flex;
            gap: 10px;
            justify-content: center;
            perspective: 1000px;
        }
        .slot-reel {
            width: 80px;
            height: 100px;
            position: relative;
            overflow: hidden;
            background: #000;
            border-radius: 8px;
            border: 2px solid rgba(255, 215, 0, 0.3);
            transform-style: preserve-3d;
        }
        .slot-strip {
            position: absolute;
            width: 100%;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slot-symbol {
            width: 100%;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            font-weight: bold;
            color: #FFD700;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }
        .slot-reel.spinning .slot-strip {
            animation: spinReel 0.2s linear infinite;
        }
        .slot-reel.stopping .slot-strip {
            animation: stopReel 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .slot-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom,
                rgba(0,0,0,0.5) 0%,
                transparent 20%,
                transparent 80%,
                rgba(0,0,0,0.5) 100%
            );
            pointer-events: none;
        }
        .win-line {
            position: absolute;
            top: 50%;
            left: 0;
            width: 0;
            height: 3px;
            background: linear-gradient(90deg, 
                transparent,
                #FFD700,
                transparent
            );
            transform: translateY(-50%);
            opacity: 0;
            transition: all 0.5s ease;
            box-shadow: 0 0 20px #FFD700;
        }
        .win-line.active {
            width: 100%;
            opacity: 1;
        }
        .spin-button {
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: #fff;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 20px;
            font-family: var(--heading-font);
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: 20px auto 0;
            transition: all 0.3s ease;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
            position: relative;
            overflow: hidden;
        }
        .spin-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4);
        }
        .spin-button:active {
            transform: translateY(1px);
        }
        .spin-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        .spin-button::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            transform: rotate(45deg);
            transition: all 0.3s ease;
        }
        .spin-button:hover::after {
            animation: shine 1.5s infinite;
        }
        @keyframes popIn {
            0% {
                transform: translateY(50px);
                opacity: 0;
            }
            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }
        @keyframes spinReel {
            0% { transform: translateY(0); }
            100% { transform: translateY(-600px); }
        }
        @keyframes stopReel {
            0% { transform: translateY(var(--start-pos)); }
            100% { transform: translateY(var(--end-pos)); }
        }
        @keyframes shine {
            0% { transform: rotate(45deg) translateX(-100%); }
            100% { transform: rotate(45deg) translateX(100%); }
        }
        @keyframes winPulse {
            0% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.1); filter: brightness(1.5); }
            100% { transform: scale(1); filter: brightness(1); }
        }
        .slot-symbol.win {
            animation: winPulse 0.5s ease-in-out infinite;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #fff;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        }
    `;
    document.head.appendChild(style);

    // Slot machine functionality
    const reels = [
        popup.querySelector('#reel1'),
        popup.querySelector('#reel2'),
        popup.querySelector('#reel3')
    ];
    const spinButton = popup.querySelector('.spin-button');
    const winLine = popup.querySelector('.win-line');
    let isSpinning = false;

    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        
        // Disable button during spin
        spinButton.disabled = true;
        
        // Start spinning animation for each reel
        reels.forEach(reel => {
            reel.classList.add('spinning');
            const strip = reel.querySelector('.slot-strip');
            strip.style.transform = 'translateY(0)';
        });
        
        // Remove previous win states
        popup.querySelectorAll('.slot-symbol.win').forEach(symbol => symbol.classList.remove('win'));
        winLine.classList.remove('active');
        
        // Stop each reel sequentially
        reels.forEach((reel, index) => {
            setTimeout(() => {
                const strip = reel.querySelector('.slot-strip');
                reel.classList.remove('spinning');
                reel.classList.add('stopping');
                
                // Calculate final position
                const finalNumber = Math.floor(Math.random() * 6) + 1;
                const position = -(finalNumber - 1) * 100;
                strip.style.setProperty('--start-pos', '0px');
                strip.style.setProperty('--end-pos', `${position}px`);
                
                // Store the final number
                reel.dataset.value = finalNumber;
                
                // Check for win after all reels stop
                if (index === reels.length - 1) {
                    setTimeout(() => {
                        const values = reels.map(r => r.dataset.value);
                        
                        // Check for three of a kind
                        if (values[0] === values[1] && values[1] === values[2]) {
                            // Winning animation
                            reels.forEach(r => {
                                const symbol = r.querySelector(`.slot-symbol:nth-child(${values[0]})`);
                                symbol.classList.add('win');
                            });
                            winLine.classList.add('active');
                            createFireworks(popup);
                        }
                        
                        // Reset and re-enable button
                        reels.forEach(r => r.classList.remove('stopping'));
                        setTimeout(() => {
                            spinButton.disabled = false;
                            isSpinning = false;
                        }, 500);
                    }, 500);
                }
            }, 1000 + index * 500);
        });
    });

    // Fireworks effect for wins
    function createFireworks(container) {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.cssText = `
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: radial-gradient(circle, #FFD700, #FFA500);
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: explode 1s ease-out forwards;
                    box-shadow: 0 0 20px #FFD700;
                `;
                container.appendChild(firework);
                
                setTimeout(() => firework.remove(), 1000);
            }, i * 200);
        }
    }

    // Close popup when clicking outside or on close button
    popup.addEventListener('click', function(e) {
        if (e.target.classList.contains('profile-popup') || 
            e.target.classList.contains('close-popup')) {
            popup.remove();
            style.remove();
        }
    });

    // Update game stats after each spin
    const originalSpinHandler = spinButton.onclick;
    spinButton.onclick = function() {
        if (!currentUser) return;
        
        currentUser.gamesPlayed++;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update user stats in storage
        updateUserStats(true);
        
        // Call original spin handler
        originalSpinHandler.call(this);
        
        // Update wins if player wins
        const values = Array.from(popup.querySelectorAll('.slot-symbol.win')).map(el => el.textContent);
        if (values.length === 3 && values[0] === values[1] && values[1] === values[2]) {
            currentUser.wins++;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserStats(true);
        }
    };
}

// Handle Discord sign in
document.querySelector('.discord-sign-in').addEventListener('click', function() {
    window.open('https://discord.gg/TGG8uWEuBm', '_blank');
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

// Add styles for new elements
const style = document.createElement('style');
style.textContent = `
    .form-checkbox {
        margin: 15px 0;
        user-select: none;
    }
    
    .checkbox-container {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        color: #c9d1d9;
    }
    
    .checkbox-container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
    }
    
    .checkmark {
        position: relative;
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 8px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .checkbox-container:hover .checkmark {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .checkbox-container input:checked ~ .checkmark {
        background: #4D6DFF;
        border-color: #4D6DFF;
    }
    
    .checkmark:after {
        content: '';
        position: absolute;
        display: none;
        left: 5px;
        top: 2px;
        width: 4px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }
    
    .checkbox-container input:checked ~ .checkmark:after {
        display: block;
    }
    
    .register-toggle {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .toggle-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .toggle-input {
        display: none;
    }
    
    .toggle-label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        user-select: none;
    }
    
    .toggle-switch {
        position: relative;
        width: 50px;
        height: 24px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 2px;
        transition: all 0.3s ease;
    }
    
    .toggle-switch:before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: #fff;
        left: 2px;
        transition: all 0.3s ease;
    }
    
    .toggle-input:checked + .toggle-label .toggle-switch {
        background: #4D6DFF;
    }
    
    .toggle-input:checked + .toggle-label .toggle-switch:before {
        transform: translateX(26px);
    }
    
    .toggle-text {
        color: #c9d1d9;
        font-size: 14px;
    }
`;
document.head.appendChild(style);

// Function to load admin panel content
function loadAdminPanel() {
    const adminPanel = document.querySelector('#admin-panel');
    if (!adminPanel) return;

    // Clear existing content
    adminPanel.innerHTML = `
        <div class="admin-section">
            <h2>Slot Machine Configuration</h2>
            <div class="config-controls">
                <div class="slider-container">
                    <label for="winChance">Win Chance: <span id="winChanceValue">${slotMachineConfig.winChance}</span>%</label>
                    <input type="range" id="winChance" min="1" max="100" value="${slotMachineConfig.winChance}">
                </div>
                <button id="updateConfig" class="cosmic-btn">Update Configuration</button>
                <div id="configStatus" class="status-message"></div>
            </div>
        </div>
    `;

    // Add event listeners
    const slider = document.getElementById('winChance');
    const valueDisplay = document.getElementById('winChanceValue');
    const updateButton = document.getElementById('updateConfig');

    slider.addEventListener('input', (e) => {
        valueDisplay.textContent = e.target.value;
    });

    updateButton.addEventListener('click', () => {
        const newWinChance = parseInt(slider.value);
        updateSlotMachineConfig(newWinChance);
    });
}

// Function to update slot machine configuration
function updateSlotMachineConfig(newWinChance) {
    if (!currentUser || currentUser.username !== 'BiteLaiX') return;
    
    const statusDiv = document.getElementById('configStatus');
    statusDiv.textContent = 'Updating configuration...';
    
    try {
        // Update configuration
        slotMachineConfig.winChance = newWinChance;
        
        // Save to localStorage
        localStorage.setItem('slotMachineConfig', JSON.stringify(slotMachineConfig));
        
        // Update UI
        statusDiv.textContent = 'Configuration updated successfully!';
        statusDiv.style.color = '#00ff00';
    } catch (error) {
        console.error('Error updating slot configuration:', error);
        statusDiv.textContent = 'Error updating configuration';
        statusDiv.style.color = '#ff0000';
    }
    
    // Clear status message after 3 seconds
    setTimeout(() => {
        statusDiv.textContent = '';
    }, 3000);
}

// Function to calculate spin result based on win chance
function calculateSpinResult() {
    const winChance = slotMachineConfig.winChance; // Use the stored configuration
    const random = Math.random() * 100;
    
    if (random < winChance) {
        // Generate a winning combination (all numbers the same)
        const number = Math.floor(Math.random() * 6) + 1;
        return [number, number, number];
    } else {
        // Generate a losing combination (at least one number different)
        let numbers = [];
        do {
            numbers = [
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1
            ];
        } while (numbers[0] === numbers[1] && numbers[1] === numbers[2]);
        return numbers;
    }
}

// Show win animation
function showWinAnimation() {
    // Implementation of showWinAnimation function
}

// Sign In Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('signInModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    const registerLink = document.getElementById('register-link');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleRegistrationMode();
        });
    }
    
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Basic validation
            if (!username || !password) {
                alert('Please fill in all fields');
                return;
            }

            // Get stored users
            const users = JSON.parse(localStorage.getItem('users')) || {};

            if (isRegistering) {
                // Check if username already exists
                if (users[username]) {
                    alert('Username already exists');
                    return;
                }
                
                // Create new user
                users[username] = {
                    username,
                    password,
                    createdAt: new Date().toISOString(),
                    gamesPlayed: 0,
                    wins: 0,
                    isAdmin: username === 'BiteLaiX'
                };
                
                // Save users
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registration successful! You can now log in.');
                isRegistering = false;
                toggleRegistrationMode();
                
            } else {
                // Check login credentials
                const user = users[username];
                if (!user || user.password !== password) {
                    alert('Invalid credentials');
                    return;
                }
                
                currentUser = {
                    username: user.username,
                    gamesPlayed: user.gamesPlayed,
                    wins: user.wins,
                    isAdmin: user.isAdmin
                };
                
                // Store current user
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', JSON.stringify(currentUser));
                } else {
                    localStorage.removeItem('rememberedUser');
                }
                
                closeSignInModal();
                updateUIForLoggedInUser(currentUser);
            }
        });
    }
}); 
