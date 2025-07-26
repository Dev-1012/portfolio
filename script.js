document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const currentViewSpan = document.getElementById('currentView');
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const closeButtons = document.querySelectorAll('.close-btn');

    // --- Sound Elements ---
    const clickSound = document.getElementById('clickSound');
    const closeSound = document.getElementById('closeSound');
    const lightModeSound = document.getElementById('lightModeSound');
    const darkModeSound = document.getElementById('darkModeSound');

    // --- Celestial Body Elements for Animation ---
    const moonRise = document.getElementById('moon-rise');
    const sunRise = document.getElementById('sun-rise');

    // --- Footer Element ---
    const currentYearSpan = document.getElementById('currentYear');

    // --- Initial Setup Functions ---

    // Set current year in footer
    currentYearSpan.textContent = new Date().getFullYear();

    // Initialize theme based on localStorage or default
    const updateThemeIcon = (isDark) => {
        if (isDark) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateThemeIcon(savedTheme === 'dark-theme');
    } else {
        // Default to light theme if no preference is saved
        body.classList.add('light-theme');
        updateThemeIcon(false); // false for light theme
    }

    // --- Sound Playing Helper Functions ---
    window.playClickSound = () => { // Made global for onclick in HTML
        if (clickSound) {
            clickSound.currentTime = 0; // Rewind to start
            clickSound.play().catch(e => console.error("Click sound play failed:", e));
        }
    };

    const playCloseSound = () => {
        if (closeSound) {
            closeSound.currentTime = 0; // Rewind to start
            closeSound.play().catch(e => console.error("Close sound play failed:", e));
        }
    };

    // --- Theme Toggle Event Listener ---
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            // Currently dark, switching to light (Day is coming)
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
            updateThemeIcon(false); // Update icon to sun
            if (lightModeSound) {
                lightModeSound.currentTime = 0;
                lightModeSound.play().catch(e => console.error("Light mode sound play failed:", e));
            }
            triggerCelestialAnimation(sunRise); // Trigger sun animation
        } else {
            // Currently light, switching to dark (Night is coming)
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            updateThemeIcon(true); // Update icon to moon
            if (darkModeSound) {
                darkModeSound.currentTime = 0;
                darkModeSound.play().catch(e => console.error("Dark mode sound play failed:", e));
            }
            triggerCelestialAnimation(moonRise); // Trigger moon animation
        }
    });

    // --- Celestial Animation Function ---
    function triggerCelestialAnimation(element) {
        // Remove 'animate' class first to reset animation if it was just played
        element.classList.remove('animate');
        // Force reflow/repaint to ensure animation resets
        // eslint-disable-next-line no-unused-expressions
        void element.offsetWidth; // This line forces a browser reflow
        // Add 'animate' class to start the animation
        element.classList.add('animate');
    }

    // --- Section Display Logic ---
    function showSection(sectionId) {
        // Hide all sections first
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show the target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Update current view text in the top bar
            const sectionName = sectionId.replace('-section', '');
            currentViewSpan.textContent = `Currently Viewing: ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`;
        }
    }

    // --- Navigation Item Click Handler ---
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior (page reload)
            playClickSound(); // Play sound on navigation click

            const sectionName = item.dataset.section; // Get section name from data-section attribute
            const sectionId = `${sectionName}-section`; // Construct the full section ID

            showSection(sectionId); // Display the corresponding section
        });
    });

    // --- Close Button Click Handler ---
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            playCloseSound(); // Play sound on close click
            // After closing a section, return to the 'home' section
            showSection('home-section');
        });
    });

    // --- Initial Load Action ---
    // Ensure 'home-section' is active when the page first loads
    showSection('home-section');
});