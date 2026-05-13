// Store original hrefs to restore later
let originalHrefs = new Map();
let visualMode = false;

// Function to disable all links
function disableLinks(showVisual = true) {
  console.log('Disabling links...');
  
  document.querySelectorAll('a[href]').forEach((link, index) => {
    // Store original href
    if (!originalHrefs.has(link)) {
      originalHrefs.set(link, {
        href: link.getAttribute('href'),
        onclick: link.onclick,
        style: link.getAttribute('style')
      });
    }
    
    // Remove href
    link.removeAttribute('href');
    
    // Add click prevention
    link.addEventListener('click', preventLinkClick, true);
    
    // Visual effects
    if (showVisual) {
      link.style.cssText += `
        cursor: not-allowed !important;
        opacity: 0.6 !important;
        position: relative !important;
      `;
      
      // Add disabled indicator
      if (!link.querySelector('.link-disabled-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'link-disabled-indicator';
        indicator.innerHTML = ' ⛔';
        indicator.style.cssText = `
          font-size: 0.8em !important;
          color: #ff4444 !important;
          margin-left: 4px !important;
        `;
        link.appendChild(indicator);
      }
    }
  });
  
  // Prevent new links from being added dynamically
  observeDOMChanges();
  
  console.log(`Disabled ${originalHrefs.size} links`);
  return { disabled: originalHrefs.size };
}

// Function to enable all links
function enableLinks() {
  console.log('Enabling links...');
  
  originalHrefs.forEach((data, link) => {
    // Restore href
    if (data.href) {
      link.setAttribute('href', data.href);
    }
    
    // Remove click prevention
    link.removeEventListener('click', preventLinkClick, true);
    
    // Restore original onclick
    if (data.onclick) {
      link.onclick = data.onclick;
    }
    
    // Restore original style
    if (data.style) {
      link.setAttribute('style', data.style);
    } else {
      link.removeAttribute('style');
    }
    
    // Remove disabled indicator
    const indicator = link.querySelector('.link-disabled-indicator');
    if (indicator) {
      indicator.remove();
    }
  });
  
  // Clear storage
  originalHrefs.clear();
  
  // Stop observing DOM changes
  if (observer) {
    observer.disconnect();
  }
  
  console.log('All links enabled');
  return { enabled: true };
}

// Function to toggle visual effects
function toggleVisualMode() {
  visualMode = !visualMode;
  
  document.querySelectorAll('a').forEach(link => {
    if (visualMode) {
      link.style.cssText += `
        outline: 2px dashed #ff4444 !important;
        background-color: rgba(255, 68, 68, 0.1) !important;
      `;
    } else {
      // Remove visual effects but keep disabled state
      if (originalHrefs.has(link)) {
        link.style.cssText += `
          cursor: not-allowed !important;
          opacity: 0.6 !important;
          outline: none !important;
          background-color: transparent !important;
        `;
      }
    }
  });
  
  return { visualMode };
}

// Click prevention function
function preventLinkClick(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  
  // Show notification
  showNotification('Link disabled!');
  return false;
}

// Show notification
function showNotification(message) {
  // Remove existing notification
  const existing = document.getElementById('link-disabled-notification');
  if (existing) existing.remove();
  
  // Create new notification
  const notification = document.createElement('div');
  notification.id = 'link-disabled-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    background: #ff4444 !important;
    color: white !important;
    padding: 12px 20px !important;
    border-radius: 4px !important;
    z-index: 999999 !important;
    font-family: Arial, sans-serif !important;
    font-size: 14px !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
    animation: fadeInOut 2s ease-in-out !important;
  `;
  
  // Add styles for animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(-20px); }
      15% { opacity: 1; transform: translateY(0); }
      85% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-20px); }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto-remove after animation
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
    if (style.parentNode) {
      style.remove();
    }
  }, 2000);
}

// Observe DOM changes for dynamically added links
let observer;
function observeDOMChanges() {
  observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'A' && node.hasAttribute('href')) {
              // Disable new links
              disableLinksForElement(node);
            }
            // Check for links inside added nodes
            node.querySelectorAll('a[href]').forEach(link => {
              disableLinksForElement(link);
            });
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function disableLinksForElement(link) {
  if (!originalHrefs.has(link)) {
    originalHrefs.set(link, {
      href: link.getAttribute('href'),
      onclick: link.onclick,
      style: link.getAttribute('style')
    });
    
    link.removeAttribute('href');
    link.addEventListener('click', preventLinkClick, true);
    link.style.cssText += 'cursor: not-allowed !important; opacity: 0.6 !important;';
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let result;
  
  switch (request.action) {
    case "disableLinks":
      result = disableLinks(request.visualEffects);
      break;
    case "enableLinks":
      result = enableLinks();
      break;
    case "toggleVisual":
      result = toggleVisualMode();
      break;
  }
  
  sendResponse(result);
  return true;
});

// Initialize
console.log('Link Disabler extension loaded');