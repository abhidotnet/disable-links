document.addEventListener('DOMContentLoaded', function() {
  const disableBtn = document.getElementById('disableBtn');
  const enableBtn = document.getElementById('enableBtn');
  const visualBtn = document.getElementById('visualBtn');
  const visualEffectsCheckbox = document.getElementById('visualEffects');
  const statusDiv = document.getElementById('status');

  // Load saved setting
  chrome.storage.local.get(['visualEffects'], function(result) {
    visualEffectsCheckbox.checked = result.visualEffects || true;
  });

  // Save visual effects setting
  visualEffectsCheckbox.addEventListener('change', function() {
    chrome.storage.local.set({ visualEffects: this.checked });
  });

  // Disable all links
  disableBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: "disableLinks",
        visualEffects: visualEffectsCheckbox.checked 
      }, function(response) {
        showStatus("Links disabled!", "active");
      });
    });
  });

  // Enable all links
  enableBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: "enableLinks" 
      }, function(response) {
        showStatus("Links enabled!", "inactive");
      });
    });
  });

  // Toggle visual mode
  visualBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: "toggleVisual" 
      }, function(response) {
        showStatus("Visual mode toggled!", "active");
      });
    });
  });

  function showStatus(message, className) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${className}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 2000);
  }
});