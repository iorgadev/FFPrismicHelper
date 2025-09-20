// Get the slice count when popup opens
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: "getSliceCount" }, (response) => {
    const countElement = document.getElementById('sliceCount');
    const labelElement = document.querySelector('.label');
    
    if (response && response.isAvailable) {
      // We're on a Prismic builder page
      countElement.textContent = response.count;
      countElement.className = 'counter';
      labelElement.style.display = 'block';
    } else {
      // Not on a Prismic builder page
      countElement.textContent = 'Not available';
      countElement.className = 'counter not-available';
      labelElement.style.display = 'none';
    }
  });
});