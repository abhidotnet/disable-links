// Background script for future functionality
chrome.runtime.onInstalled.addListener(() => {
  console.log('Link Disabler extension installed');
  
  // Set default settings
  chrome.storage.local.set({
    visualEffects: true,
    autoDisable: false
  });
});