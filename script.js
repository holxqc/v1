document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const inputText = document.getElementById('input-text');
  const displayText = document.getElementById('display-text');
  const charCount = document.querySelector('.char-count');
  const fontSizeSlider = document.getElementById('font-size');
  const sizeValue = document.getElementById('size-value');
  const thicknessSlider = document.getElementById('thickness-slider');
  const thicknessValue = document.getElementById('thickness-value');
  const textColor = document.getElementById('text-color');
  const resetButton = document.getElementById('reset-button');
  const currentYear = document.getElementById('current-year');
  // Set current year in footer
  currentYear.textContent = new Date().getFullYear();

  // Default values
  const defaultSettings = {
    text: 'Start typing to see your text here',
    fontSize: 40,
    thickness: 0.5,
    textColor: '#1F2937'
  };
  
  // Initialize text input with saved content or empty string
  const savedText = localStorage.getItem('miltonText') || '';
  inputText.value = savedText;
  
  // Update display text with saved content
  displayText.textContent = savedText || defaultSettings.text;
  
  // Update character count
  updateCharCount();
  
  // Initialize settings from localStorage or use defaults
  const savedFontSize = localStorage.getItem('miltonFontSize') || defaultSettings.fontSize;
  const savedThickness = localStorage.getItem('miltonThickness') || defaultSettings.thickness;
  const savedTextColor = localStorage.getItem('miltonTextColor') || defaultSettings.textColor;
  
  // Apply saved settings
  fontSizeSlider.value = savedFontSize;
  sizeValue.textContent = `${savedFontSize}px`;
  displayText.style.fontSize = `${savedFontSize}px`;
  
  thicknessSlider.value = savedThickness;
  thicknessValue.textContent = savedThickness;
  displayText.style.fontWeight = getWeightFromThickness(savedThickness);
  
  textColor.value = savedTextColor;
  displayText.style.color = savedTextColor;
  
  // Event listeners
  // Input event for text field (works the same with input as it did with textarea)
  inputText.addEventListener('input', function() {
    const text = this.value;
    displayText.textContent = text || defaultSettings.text;
    updateCharCount();
    
    // Save to localStorage
    localStorage.setItem('miltonText', text);
  });
  
  // Add keypress event to handle Enter key - this is new for single-line inputs
  inputText.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission if in a form
    }
  });
  
  fontSizeSlider.addEventListener('input', function() {
    const size = this.value;
    displayText.style.fontSize = `${size}px`;
    sizeValue.textContent = `${size}px`;
    
    // Save to localStorage
    localStorage.setItem('miltonFontSize', size);
  });
  
  thicknessSlider.addEventListener('input', function() {
    const thickness = parseFloat(this.value);
    thicknessValue.textContent = thickness.toFixed(1);
    getWeightFromThickness(thickness);
    
    // Save to localStorage
    localStorage.setItem('miltonThickness', thickness);
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
    
    // Reset thickness
    thicknessSlider.value = defaultSettings.thickness;
    thicknessValue.textContent = defaultSettings.thickness;
    displayText.style.fontWeight = getWeightFromThickness(defaultSettings.thickness);
    
    // Reset color
    textColor.value = defaultSettings.textColor;
    displayText.style.color = defaultSettings.textColor;
    
    // Clear localStorage
    localStorage.removeItem('miltonText');
    localStorage.removeItem('miltonFontSize');
    localStorage.removeItem('miltonThickness');
    localStorage.removeItem('miltonTextColor');
  });
  
  function updateCharCount() {
    const count = inputText.value.length;
    charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
  }
  
  function getWeightFromThickness(thickness) {
    // Use both font-weight and text-shadow to create a more gradual thickness effect
    const normalizedThickness = Math.min(5, Math.max(0, thickness));
    
    const weight = Math.min(900, Math.max(400, Math.round(400 + normalizedThickness * 100)));
    
    // Apply both weight and a subtle text shadow for thickness effect
    displayText.style.fontWeight = weight.toString();
    
    // Add a subtle text shadow effect for lower values to simulate "thinness"
    if (normalizedThickness < 2.5) {
      displayText.style.textShadow = 'none';
    } else {
      // Add increasing shadow/stroke effect as thickness increases
      const blurAmount = (normalizedThickness - 2.5) * 0.2;
      const strokeAmount = (normalizedThickness - 2.5) * 0.5;
      displayText.style.textShadow = `0 0 ${blurAmount}px currentColor, 0 0 ${strokeAmount}px currentColor`;
    }
    
    return weight.toString();
  }
});
