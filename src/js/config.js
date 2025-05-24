// ===== CONFIGURATION FOR ADMIN PANEL =====

window.AdminConfig = {
  // API Configuration
  API_BASE_URL: '/api',
  
  // Features
  FEATURES: {
    REAL_TIME_UPDATES: true,
    BULK_OPERATIONS: true,
    ADVANCED_FILTERS: true,
    CSV_EXPORT: true,
    NOTIFICATIONS: true
  },
  
  // UI Settings
  UI: {
    ITEMS_PER_PAGE_DEFAULT: 10,
    AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
    TOAST_DURATION: 5000, // 5 seconds
    SIDEBAR_COLLAPSED: false
  },
  
  // Development/Demo mode
  DEMO_MODE: false, // Set to true to use mock data
  
  // Default priorities based on cargo characteristics
  PRIORITY_RULES: {
    adr: 'high',
    pharma: 'urgent',
    medical: 'urgent',
    heavy: 5000, // weight threshold for high priority
    urgent_keywords: ['терміново', 'urgent', 'асап', 'asap']
  },
  
  // Status flow configuration
  STATUS_FLOW: {
    pending: ['approved', 'rejected'],
    approved: ['in-progress', 'rejected'],
    'in-progress': ['completed', 'approved'],
    completed: [],
    rejected: ['pending', 'approved']
  },
  
  // Localization
  LOCALE: 'uk-UA',
  TIMEZONE: 'Europe/Kiev',
  
  // Security
  SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 days
  
  // Validation rules
  VALIDATION: {
    phone: /^\+380\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxWeight: 50000, // kg
    maxDimensions: 15 // meters
  }
};

// Development utilities
window.AdminUtils = {
  // Toggle demo mode
  toggleDemoMode() {
    const newMode = !window.AdminConfig.DEMO_MODE;
    window.AdminConfig.DEMO_MODE = newMode;
    
    if (newMode) {
      localStorage.setItem('admin_demo_mode', 'true');
      console.log('🎭 Demo mode enabled');
    } else {
      localStorage.removeItem('admin_demo_mode');
      console.log('📊 Real database mode enabled');
    }
    
    // Reload page to apply changes
    window.location.reload();
  },
  
  // Get current mode
  getCurrentMode() {
    return window.AdminConfig.DEMO_MODE ? 'Demo' : 'Production';
  },
  
  // Log configuration
  logConfig() {
    console.table({
      'Mode': this.getCurrentMode(),
      'API Base': window.AdminConfig.API_BASE_URL,
      'Auto Refresh': window.AdminConfig.UI.AUTO_REFRESH_INTERVAL + 'ms',
      'Items Per Page': window.AdminConfig.UI.ITEMS_PER_PAGE_DEFAULT,
      'Locale': window.AdminConfig.LOCALE
    });
  }
};

// Auto-detect mode based on localStorage
if (localStorage.getItem('admin_demo_mode') === 'true') {
  window.AdminConfig.DEMO_MODE = true;
}

console.log(`⚙️ Admin Config loaded - Mode: ${window.AdminUtils.getCurrentMode()}`); 