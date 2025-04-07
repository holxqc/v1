document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const inputText = document.getElementById('input-text');
  const displayText = document.getElementById('display-text');
  const charCount = document.querySelector('.char-count');
  const fontSizeSlider = document.getElementById('font-size');
  const sizeValue = document.getElementById('size-value');
  const textColor = document.getElementById('text-color');
  const resetButton = document.getElementById('reset-button');
  const currentYear = document.getElementById('current-year');
  
  // Set current year in footer
  currentYear.textContent = new Date().getFullYear();
  // Default values
  const defaultSettings = {
    text: 'Start typing to see your text here',
    fontSize: 40,
    textColor: '#1F2937'
  };
  
  // Initialize text area with saved content or empty string
  const savedText = localStorage.getItem('miltonText') || '';
  inputText.value = savedText;
  
  // Update display text with saved content
  displayText.textContent = savedText || defaultSettings.text;
  
  // Update character count
  updateCharCount();
  
  // Initialize settings from localStorage or use defaults
  const savedFontSize = localStorage.getItem('miltonFontSize') || defaultSettings.fontSize;
  const savedTextColor = localStorage.getItem('miltonTextColor') || defaultSettings.textColor;
  
  // Apply saved settings
  fontSizeSlider.value = savedFontSize;
  sizeValue.textContent = `${savedFontSize}px`;
  displayText.style.fontSize = `${savedFontSize}px`;
  
  textColor.value = savedTextColor;
  displayText.style.color = savedTextColor;
  
  // Event listeners
  inputText.addEventListener('input', function() {
    const text = this.value;
    displayText.textContent = text || defaultSettings.text;
    updateCharCount();
    
    // Save to localStorage
    localStorage.setItem('miltonText', text);
  });
  
  fontSizeSlider.addEventListener('input', function() {
    const size = this.value;
    displayText.style.fontSize = `${size}px`;
    sizeValue.textContent = `${size}px`;
    
    // Save to localStorage
    localStorage.setItem('miltonFontSize', size);
  });
  
  textColor.addEventListener('input', function() {
    const color = this.value;
    displayText.style.color = color;
    
    // Save to localStorage
    localStorage.setItem('miltonTextColor', color);
  });
  
  resetButton.addEventListener('click', function() {
    // Reset text
    inputText.value = '';
    displayText.textContent = defaultSettings.text;
    updateCharCount();
    
    // Reset font size
    fontSizeSlider.value = defaultSettings.fontSize;
    sizeValue.textContent = `${defaultSettings.fontSize}px`;
    displayText.style.fontSize = `${defaultSettings.fontSize}px`;
    
    // Reset color
    textColor.value = defaultSettings.textColor;
    displayText.style.color = defaultSettings.textColor;
    
    // Clear localStorage
    localStorage.removeItem('miltonText');
    localStorage.removeItem('miltonFontSize');
    localStorage.removeItem('miltonTextColor');
  });
  
  function updateCharCount() {
    const count = inputText.value.length;
    charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
  }
});
