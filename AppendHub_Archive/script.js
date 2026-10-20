document.addEventListener('DOMContentLoaded', function() {
    const switcher = document.querySelector('.language-switcher');
    const switcherButton = document.querySelector('.switcher-button');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');

    // --- UI Functionality: Toggle Dropdown ---
    switcherButton.addEventListener('click', function() {
        switcher.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        if (!switcher.contains(event.target)) {
            switcher.classList.remove('active');
        }
    });

    // --- Core Logic: Set Correct Button Text & Language Attributes ---

    // Object to map URL paths to language codes and text
    const langMap = {
        '/es/': { code: 'ES', text: 'ES' },
        '/fr/': { code: 'FR', text: 'FR' },
        '/de/': { code: 'DE', text: 'Deutsch' },
        '/ar/': { code: 'AR', text: 'العربية' },
        '/': { code: 'EN', text: 'EN' }
    };

    // Find the current language based on the URL path
    const currentPath = window.location.pathname;
    const currentLang = Object.keys(langMap).find(key => currentPath.startsWith(key)) || '/';
    const langInfo = langMap[currentLang];

    // Update the button text to match the current page's language
    if (langInfo) {
        switcherButton.innerHTML = `${langInfo.text} <span class="arrow-down">▼</span>`;
    }

    // Handle Right-to-Left (RTL) for Arabic pages
    if (langInfo && langInfo.code === 'AR') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
    } else if (langInfo) {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = langInfo.code.toLowerCase();
    }
});
