/**
 * MowForce Consent Management System
 * Handles user consent for privacy compliance
 */

// Consent Management Class
class ConsentManager {
  constructor() {
    this.consentExpiryDays = 365; // 1 year
    this.consentBanner = null;
    this.consentModal = null;
    this.init();
  }

  init() {
    console.log('🍃 MowForce Consent Manager: Initializing...');
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupConsent());
    } else {
      this.setupConsent();
    }
  }

  setupConsent() {
    console.log('🍃 MowForce Consent Manager: Setting up consent...');
    this.createConsentBanner();
    this.createConsentModal();
    this.loadSavedConsent();
    this.setupGoogleConsentMode();
    console.log('🍃 MowForce Consent Manager: Setup complete!');
  }

  createConsentBanner() {
    const bannerHTML = `
      <div id="consent-banner" class="consent-banner">
        <div class="consent-content">
          <div class="consent-text">
            <h3>🍃 We Value Your Privacy</h3>
            <p>MowForce uses cookies and analytics to improve your experience and provide better lawn care services. We respect your privacy and give you control over your data.</p>
          </div>
          <div class="consent-buttons">
            <button class="consent-btn accept" onclick="consentManager.acceptAllConsent()">Accept All</button>
            <button class="consent-btn settings" onclick="consentManager.openConsentSettings()">Settings</button>
            <button class="consent-btn decline" onclick="consentManager.declineAllConsent()">Decline</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bannerHTML);
    this.consentBanner = document.getElementById('consent-banner');
  }

  createConsentModal() {
    const modalHTML = `
      <div id="consent-modal" class="consent-modal">
        <div class="consent-modal-content">
          <h2>🍃 Privacy Settings</h2>

          <div class="consent-option">
            <h4>Essential Cookies</h4>
            <p>These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services.</p>
            <div class="consent-toggle">
              <input type="checkbox" id="essential" checked disabled>
              <label for="essential">Always Active</label>
            </div>
          </div>

          <div class="consent-option">
            <h4>Analytics Cookies</h4>
            <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our lawn care services.</p>
            <div class="consent-toggle">
              <input type="checkbox" id="analytics" checked>
              <label for="analytics">Allow Analytics</label>
            </div>
          </div>

          <div class="consent-option">
            <h4>Advertising Cookies</h4>
            <p>These cookies are used to make advertising messages more relevant to you. They help us show you relevant lawn care services and measure the effectiveness of our campaigns.</p>
            <div class="consent-toggle">
              <input type="checkbox" id="advertising" checked>
              <label for="advertising">Allow Advertising</label>
            </div>
          </div>

          <div style="display: flex; gap: 15px; margin-top: 30px;">
            <button class="consent-btn accept" onclick="consentManager.saveConsentSettings()">Save Preferences</button>
            <button class="consent-btn decline" onclick="consentManager.closeConsentSettings()">Cancel</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.consentModal = document.getElementById('consent-modal');
  }

  setupGoogleConsentMode() {
    // Set default consent mode (deny all until user consents)
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
  }

  loadSavedConsent() {
    console.log('🍃 MowForce Consent Manager: Loading saved consent...');
    const analytics = localStorage.getItem('consent-analytics') === 'true';
    const advertising = localStorage.getItem('consent-advertising') === 'true';
    const consentDate = localStorage.getItem('consent-date');

    console.log('🍃 Saved consent:', { analytics, advertising, consentDate });

    // Check if consent has expired
    if (consentDate) {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (new Date(consentDate) < oneYearAgo) {
        // Consent expired, show banner
        console.log('🍃 Consent expired, showing banner');
        this.showConsentBanner();
        return;
      }
    }

    if (analytics || advertising) {
      console.log('🍃 User has given consent, hiding banner');
      this.hideConsentBanner();
    } else {
      console.log('🍃 No consent given, showing banner');
      this.showConsentBanner();
    }

    // Set consent mode based on saved preferences
    this.setConsent(true, analytics, advertising);
  }

  showConsentBanner() {
    console.log('🍃 Showing consent banner...');
    if (this.consentBanner) {
      this.consentBanner.classList.add('show');
      console.log('🍃 Banner should now be visible');
    } else {
      console.error('🍃 Consent banner element not found!');
    }
  }

  hideConsentBanner() {
    if (this.consentBanner) {
      this.consentBanner.classList.add('hidden');
    }
  }

  acceptAllConsent() {
    this.setConsent(true, true, true);
    this.hideConsentBanner();
    this.logConsentAction('accept_all');
  }

  declineAllConsent() {
    this.setConsent(false, false, false);
    this.hideConsentBanner();
    this.logConsentAction('decline_all');
  }

  openConsentSettings() {
    if (this.consentModal) {
      this.consentModal.classList.add('active');
    }
  }

  closeConsentSettings() {
    if (this.consentModal) {
      this.consentModal.classList.remove('active');
    }
  }

  saveConsentSettings() {
    const analytics = document.getElementById('analytics').checked;
    const advertising = document.getElementById('advertising').checked;

    this.setConsent(true, analytics, advertising);
    this.hideConsentBanner();
    this.closeConsentSettings();
    this.logConsentAction('custom_settings', { analytics, advertising });
  }

  setConsent(essential, analytics, advertising) {
    // Store consent in localStorage
    localStorage.setItem('consent-essential', essential);
    localStorage.setItem('consent-analytics', analytics);
    localStorage.setItem('consent-advertising', advertising);
    localStorage.setItem('consent-date', new Date().toISOString());

    // Update Google Consent Mode
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        analytics_storage: analytics ? 'granted' : 'denied',
        ad_storage: advertising ? 'granted' : 'denied',
        ad_user_data: advertising ? 'granted' : 'denied',
        ad_personalization: advertising ? 'granted' : 'denied',
      });
    }

    console.log('🍃 MowForce Consent Updated:', {
      essential,
      analytics,
      advertising,
    });
  }

  logConsentAction(action, data = {}) {
    // Log consent actions for analytics (if consent is granted)
    if (
      typeof gtag !== 'undefined' &&
      localStorage.getItem('consent-analytics') === 'true'
    ) {
      gtag('event', 'consent_action', {
        event_category: 'privacy',
        event_label: action,
        custom_parameters: data,
      });
    }
  }

  // Public method to check consent status
  getConsentStatus() {
    return {
      essential: localStorage.getItem('consent-essential') === 'true',
      analytics: localStorage.getItem('consent-analytics') === 'true',
      advertising: localStorage.getItem('consent-advertising') === 'true',
      date: localStorage.getItem('consent-date'),
    };
  }

  // Public method to reset consent (for testing)
  resetConsent() {
    localStorage.removeItem('consent-essential');
    localStorage.removeItem('consent-analytics');
    localStorage.removeItem('consent-advertising');
    localStorage.removeItem('consent-date');
    location.reload();
  }

  // Public method to force show banner (for testing)
  forceShowBanner() {
    console.log('🍃 Force showing banner for testing...');
    this.showConsentBanner();
  }
}

// Initialize consent manager
const consentManager = new ConsentManager();

// Make it globally available
window.consentManager = consentManager;
