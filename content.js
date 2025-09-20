// Bright vibrant color palette
const colorPalette = [
  { header: '#ff4757', text: '#ffffff', border: '#ff3742' }, // Vibrant Red
  { header: '#2ed573', text: '#ffffff', border: '#27c46b' }, // Electric Green
  { header: '#1e90ff', text: '#ffffff', border: '#0080ff' }, // Bright Blue
  { header: '#ff6b35', text: '#ffffff', border: '#ff5722' }, // Bright Orange
  { header: '#a55eea', text: '#ffffff', border: '#9c4de2' }, // Vivid Purple
  { header: '#ffa502', text: '#ffffff', border: '#ff9500' }, // Golden Yellow
  { header: '#ff3838', text: '#ffffff', border: '#ff2d2d' }, // Hot Pink
  { header: '#00d2d3', text: '#ffffff', border: '#00c9ca' }, // Bright Cyan
  { header: '#ff9ff3', text: '#000000', border: '#ff8ef0' }, // Neon Pink
  { header: '#7bed9f', text: '#000000', border: '#70e495' }  // Lime Green
];

// Function to check if we're on a Prismic builder page
function isPrismicBuilderPage() {
  return window.location.href.includes('.prismic.io/builder/pages/');
}

// Function to apply color styling to a fieldset
function applyFieldsetStyling(fieldset, colorIndex) {
  const colors = colorPalette[colorIndex % colorPalette.length];
  
  fieldset.style.setProperty('border', `2px solid ${colors.border}`, 'important');
  fieldset.style.setProperty('border-radius', '8px', 'important');
  
  const header = fieldset.querySelector('legend') || 
                 fieldset.querySelector('header') || 
                 fieldset.querySelector('div:first-child');
  
  if (header) {
    header.style.setProperty('background-color', colors.header, 'important');
    header.style.setProperty('padding', '8px 12px', 'important');
    header.style.setProperty('border-radius', '6px 6px 0 0', 'important');
    header.style.setProperty('margin', '-1px -1px 8px -1px', 'important');
    
    const spans = header.querySelectorAll('span');
    spans.forEach(span => {
      span.style.setProperty('color', colors.text, 'important');
    });
    
    header.style.setProperty('color', colors.text, 'important');
  }
}

// Function to apply color styling to a slice table li element
function applySliceTableStyling(listItem, colorIndex) {
  const colors = colorPalette[colorIndex % colorPalette.length];
  
  listItem.style.setProperty('border-left', `4px solid ${colors.border}`, 'important');
  listItem.style.setProperty('background-color', `${colors.header}20`, 'important');
  listItem.style.setProperty('margin', '2px 0', 'important');
  listItem.style.setProperty('padding', '8px 12px', 'important');
  listItem.style.setProperty('border-radius', '4px', 'important');
  listItem.style.setProperty('transition', 'all 0.2s ease', 'important');
  
  // Add hover effect
  listItem.addEventListener('mouseenter', () => {
    listItem.style.setProperty('background-color', `${colors.header}40`, 'important');
  });
  
  listItem.addEventListener('mouseleave', () => {
    listItem.style.setProperty('background-color', `${colors.header}20`, 'important');
  });
}

// Function to apply styling to all slice table li elements
function applyAllSliceTableStyling() {
  if (!isPrismicBuilderPage()) {
    return 0;
  }
  
  // Look for slice table li elements (commonly found in sidebar)
  const sliceTableItems = document.querySelectorAll('li[data-slice], li[data-testid*="slice"], .slice-table li, [data-testid="slice-table"] li');
  let colorIndex = 0;
  
  sliceTableItems.forEach(listItem => {
    applySliceTableStyling(listItem, colorIndex);
    colorIndex++;
  });
  
  return sliceTableItems.length;
}

// Function to apply styling to all fieldsets with unique IDs
function applyAllFieldsetStyling() {
  if (!isPrismicBuilderPage()) {
    return 0;
  }
  
  const fieldsets = document.querySelectorAll('fieldset[id]');
  const uniqueIds = new Set();
  let colorIndex = 0;
  
  fieldsets.forEach(fieldset => {
    const id = fieldset.getAttribute('id');
    if (id && id.trim() !== '') {
      uniqueIds.add(id);
      applyFieldsetStyling(fieldset, colorIndex);
      colorIndex++;
    }
  });
  
  return uniqueIds.size;
}

// Function to count fieldset elements (for popup)
function countFieldsetSlices() {
  if (!isPrismicBuilderPage()) {
    return null;
  }
  
  return applyAllFieldsetStyling();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSliceCount") {
    const count = countFieldsetSlices();
    sendResponse({ 
      count: count,
      isAvailable: count !== null 
    });
  }
});

// Auto-apply styling when page loads
console.log('FF Prismic Helper loaded');
if (isPrismicBuilderPage()) {
  const fieldsetCount = applyAllFieldsetStyling();
  const sliceTableCount = applyAllSliceTableStyling();
  console.log(`FF Prismic Helper: Applied styling to ${fieldsetCount} fieldset slices and ${sliceTableCount} slice table items`);
}