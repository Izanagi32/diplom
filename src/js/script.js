// Tabs functionality with back and forth navigation
document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tabs__button');
  const tabPanels = document.querySelectorAll('.tabs__panel');
  const nextButton = document.getElementById('nextButton');
  const prevButton = document.getElementById('prevButton');
  const progressBar = document.querySelector('.tabs__progress-bar');
  const currentStepSpan = document.getElementById('currentStep');
  
  let currentStep = 1;
  const totalSteps = tabPanels.length;
  
  // Відразу встановлюємо активний перший таб
  setActiveTab('step1');
  
  // Update progress bar width based on current step
  function updateProgressBar() {
    const progressPercentage = (currentStep / totalSteps) * 100;
    progressBar.style.width = progressPercentage + '%';
    currentStepSpan.textContent = currentStep;
    
    // Enable/disable prev button based on current step
    prevButton.disabled = currentStep === 1;
    
    // Change next button text on last step
    if (currentStep === totalSteps) {
      nextButton.textContent = 'Завершити';
    } else {
      nextButton.textContent = 'Наступний крок';
    }
  }
  
  // Set active tab and panel
  function setActiveTab(tabId) {
    console.log('Setting active tab:', tabId);
    
    // Remove active class from all tabs and panels
    tabButtons.forEach(btn => btn.classList.remove('tabs__button--active'));
    tabPanels.forEach(panel => {
      panel.classList.remove('tabs__panel--active');
    });
    
    // Add active class to current tab and panel
    const activeTabButton = document.querySelector(`.tabs__button[data-tab="${tabId}"]`);
    const activeTabPanel = document.getElementById(`tab-${tabId}`);
    
    if (activeTabButton && activeTabPanel) {
      activeTabButton.classList.add('tabs__button--active');
      activeTabPanel.classList.add('tabs__panel--active');
      
      // Get step number from tab id
      currentStep = parseInt(tabId.replace('step', ''));
      console.log('Current step updated to:', currentStep);
      updateProgressBar();
    } else {
      console.error('Tab not found:', tabId);
    }
  }
  
  // Tab button click handler
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      setActiveTab(tabId);
    });
  });
  
  // Next button click handler
  nextButton.addEventListener('click', function() {
    console.log('Next button clicked. Current step before:', currentStep);
    
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      console.log('Moving to step:', nextStep);
      setActiveTab(`step${nextStep}`);
    } else {
      // On last step, scroll to contact form or show a modal
      document.querySelector('.shipping-form').scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  // Previous button click handler
  prevButton.addEventListener('click', function() {
    console.log('Prev button clicked. Current step before:', currentStep);
    
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      console.log('Moving to step:', prevStep);
      setActiveTab(`step${prevStep}`);
    }
  });
  
  // Initialize UI based on first tab
  updateProgressBar();
});

// Calculate shipping volume for the form
document.addEventListener('DOMContentLoaded', function() {
  const lengthInput = document.getElementById('length');
  const widthInput = document.getElementById('width');
  const heightInput = document.getElementById('height');
  const volumeOutput = document.getElementById('volume');
  
  function calculateVolume() {
    const length = parseFloat(lengthInput.value) || 0;
    const width = parseFloat(widthInput.value) || 0;
    const height = parseFloat(heightInput.value) || 0;
    
    const volume = length * width * height;
    volumeOutput.textContent = volume.toFixed(2);
  }
  
  // Calculate on input change
  lengthInput.addEventListener('input', calculateVolume);
  widthInput.addEventListener('input', calculateVolume);
  heightInput.addEventListener('input', calculateVolume);
}); 