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
  
  setActiveTab('step1');
  
  function updateProgressBar() {
    const progressPercentage = (currentStep / totalSteps) * 100;
    progressBar.style.width = progressPercentage + '%';
    currentStepSpan.textContent = currentStep;
    
    prevButton.disabled = currentStep === 1;
    
    if (currentStep === totalSteps) {
      nextButton.textContent = 'Завершити';
    } else {
      nextButton.textContent = 'Наступний крок';
    }
  }
  
  function setActiveTab(tabId) {
    console.log('Setting active tab:', tabId);
    
    tabButtons.forEach(btn => btn.classList.remove('tabs__button--active'));
    tabPanels.forEach(panel => {
      panel.classList.remove('tabs__panel--active');
    });
    
    const activeTabButton = document.querySelector(`.tabs__button[data-tab="${tabId}"]`);
    const activeTabPanel = document.getElementById(`tab-${tabId}`);
    
    if (activeTabButton && activeTabPanel) {
      activeTabButton.classList.add('tabs__button--active');
      activeTabPanel.classList.add('tabs__panel--active');
      
      currentStep = parseInt(tabId.replace('step', ''));
      console.log('Current step updated to:', currentStep);
      updateProgressBar();
    } else {
      console.error('Tab not found:', tabId);
    }
  }
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      setActiveTab(tabId);
    });
  });
  
  nextButton.addEventListener('click', function() {
    console.log('Next button clicked. Current step before:', currentStep);
    
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      console.log('Moving to step:', nextStep);
      setActiveTab(`step${nextStep}`);
    } else {
      document.querySelector('.shipping-form').scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  prevButton.addEventListener('click', function() {
    console.log('Prev button clicked. Current step before:', currentStep);
    
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      console.log('Moving to step:', prevStep);
      setActiveTab(`step${prevStep}`);
    }
  });
  
  updateProgressBar();
});

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
  
  lengthInput.addEventListener('input', calculateVolume);
  widthInput.addEventListener('input', calculateVolume);
  heightInput.addEventListener('input', calculateVolume);
}); 