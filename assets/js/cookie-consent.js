// Cookie Consent Management System
(function() {
    'use strict';

    const COOKIE_CONSENT_KEY = 'sgi_cookie_consent';
    const COOKIE_PREFERENCES_KEY = 'sgi_cookie_preferences';
    const CONSENT_EXPIRY_DAYS = 365;

    // Cookie categories
    const cookieCategories = {
        necessary: true,
        functional: false,
        analytics: false
    };

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        initCookieConsent();
    });

    function initCookieConsent() {
        const consent = getCookieConsent();
        
        if (!consent) {
            // Show banner if no consent recorded
            showConsentBanner();
        } else {
            // Apply saved preferences
            const preferences = getCookiePreferences();
            applyConsent(preferences);
        }

        // Set up event listeners
        setupEventListeners();
    }

    function setupEventListeners() {
        // Accept all cookies
        const acceptBtn = document.getElementById('cookie-accept-all');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                acceptAllCookies();
            });
        }

        // Decline non-essential cookies
        const declineBtn = document.getElementById('cookie-decline');
        if (declineBtn) {
            declineBtn.addEventListener('click', function() {
                declineNonEssentialCookies();
            });
        }

        // Open settings modal
        const settingsBtn = document.getElementById('cookie-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', function() {
                openSettingsModal();
            });
        }

        // Open privacy policy modal
        const privacyLinks = document.querySelectorAll('.privacy-policy-link');
        privacyLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                openPrivacyModal();
            });
        });

        // Close modals
        const closeButtons = document.querySelectorAll('.privacy-modal-close, .cookie-settings-close');
        closeButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                closeModals();
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', function(e) {
            const privacyModal = document.getElementById('privacy-modal');
            const settingsModal = document.getElementById('cookie-settings-modal');
            
            if (e.target === privacyModal) {
                closeModal(privacyModal);
            }
            if (e.target === settingsModal) {
                closeModal(settingsModal);
            }
        });

        // Save custom preferences
        const savePrefsBtn = document.getElementById('save-cookie-preferences');
        if (savePrefsBtn) {
            savePrefsBtn.addEventListener('click', function() {
                saveCustomPreferences();
            });
        }

        // Accept all from settings
        const acceptAllSettingsBtn = document.getElementById('accept-all-settings');
        if (acceptAllSettingsBtn) {
            acceptAllSettingsBtn.addEventListener('click', function() {
                acceptAllCookies();
            });
        }
    }

    function showConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }

    function hideConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    }

    function acceptAllCookies() {
        const preferences = {
            necessary: true,
            functional: true,
            analytics: true
        };
        
        saveConsent(preferences);
        applyConsent(preferences);
        hideConsentBanner();
        closeModals();
    }

    function declineNonEssentialCookies() {
        const preferences = {
            necessary: true,
            functional: false,
            analytics: false
        };
        
        saveConsent(preferences);
        applyConsent(preferences);
        hideConsentBanner();
    }

    function saveCustomPreferences() {
        const preferences = {
            necessary: true, // Always required
            functional: document.getElementById('cookie-functional')?.checked || false,
            analytics: document.getElementById('cookie-analytics')?.checked || false
        };
        
        saveConsent(preferences);
        applyConsent(preferences);
        hideConsentBanner();
        closeModals();
    }

    function saveConsent(preferences) {
        // Save consent timestamp
        const consentData = {
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
        localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
        
        // Set consent cookie
        setCookie(COOKIE_CONSENT_KEY, 'true', CONSENT_EXPIRY_DAYS);
    }

    function getCookieConsent() {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        return consent ? JSON.parse(consent) : null;
    }

    function getCookiePreferences() {
        const preferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
        return preferences ? JSON.parse(preferences) : {
            necessary: true,
            functional: false,
            analytics: false
        };
    }

    function applyConsent(preferences) {
        // Apply functional cookies
        if (preferences.functional) {
            enableFunctionalCookies();
        } else {
            disableFunctionalCookies();
        }

        // Apply analytics cookies
        if (preferences.analytics) {
            enableAnalyticsCookies();
        } else {
            disableAnalyticsCookies();
        }
    }

    function enableFunctionalCookies() {
        console.log('Functional cookies enabled');
        // Add your functional cookie logic here
    }

    function disableFunctionalCookies() {
        console.log('Functional cookies disabled');
        // Remove functional cookies
    }

    function enableAnalyticsCookies() {
        console.log('Analytics cookies enabled');
        
        // Enable Google Consent Mode
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'analytics_storage': 'granted'
            });
        }
        
        // Push event to dataLayer for GTM
        if (window.dataLayer) {
            window.dataLayer.push({'event': 'analytics_consent_granted'});
        }
    }

    function disableAnalyticsCookies() {
        console.log('Analytics cookies disabled');
        
        // Disable Google Consent Mode
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
            });
        }
        
        // Push event to dataLayer for GTM
        if (window.dataLayer) {
            window.dataLayer.push({'event': 'analytics_consent_denied'});
        }
    }

    function openPrivacyModal() {
        const modal = document.getElementById('privacy-modal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function openSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            // Load current preferences
            const preferences = getCookiePreferences();
            
            const functionalCheckbox = document.getElementById('cookie-functional');
            const analyticsCheckbox = document.getElementById('cookie-analytics');
            
            if (functionalCheckbox) functionalCheckbox.checked = preferences.functional;
            if (analyticsCheckbox) analyticsCheckbox.checked = preferences.analytics;
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModals() {
        const modals = document.querySelectorAll('.privacy-modal, .cookie-settings-modal');
        modals.forEach(function(modal) {
            closeModal(modal);
        });
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Utility function to set cookies
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Strict';
    }

    // Utility function to get cookies
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Expose global function to reset consent (for testing or user request)
    window.resetCookieConsent = function() {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        localStorage.removeItem(COOKIE_PREFERENCES_KEY);
        document.cookie = COOKIE_CONSENT_KEY + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
        location.reload();
    };

})();
