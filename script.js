document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const inputText = document.getElementById('input-text');
  const displayText = document.getElementById('display-text');
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
    thickness: 0.5,
    textColor: '#1F2937'
  };
  
  // Initialize text input with saved content or empty string
  const savedText = localStorage.getItem('miltonText') || '';
  inputText.value = savedText;
  
  // Update display text with saved content
  displayText.textContent = savedText || defaultSettings.text;
  
  // Auto-size the text based on content length
  autoSizeText(displayText, savedText || defaultSettings.text);
  
  // Initialize settings from localStorage or use defaults
  const savedThickness = localStorage.getItem('miltonThickness') || defaultSettings.thickness;
  const savedTextColor = localStorage.getItem('miltonTextColor') || defaultSettings.textColor;
  
  // Apply saved settings (removed font size)
  thicknessSlider.value = savedThickness;
  thicknessValue.textContent = savedThickness;
  displayText.style.fontWeight = getWeightFromThickness(savedThickness);
  
  textColor.value = savedTextColor;
  displayText.style.color = savedTextColor;
  
  // Event listeners
  // Input event for text field
  inputText.addEventListener('input', function() {
    const text = this.value;
    displayText.textContent = text || defaultSettings.text;
    
    // Auto-size the text based on content length
    autoSizeText(displayText, text || defaultSettings.text);
    
    // Save to localStorage
    localStorage.setItem('miltonText', text);
  });
  
  // Add keypress event to handle Enter key
  inputText.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission if in a form
    }
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
    
    // Auto-size the text
    autoSizeText(displayText, defaultSettings.text);
    
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
  
  // Auto-size text based on content length with much larger sizes
  function autoSizeText(element, text) {
    const length = text.length;
    let fontSize;
    
    // Much larger font sizes as requested
    if (length <= 3) {
      fontSize = 300; // Extremely large text for very short inputs
    } else if (length <= 6) {
      fontSize = 250; // Very large text for short inputs
    } else if (length <= 10) {
      fontSize = 200; // Large text
    } else if (length <= 20) {
      fontSize = 150; // Medium-large text
    } else if (length <= 40) {
      fontSize = 100; // Medium text
    } else if (length <= 60) {
      fontSize = 75; // Medium-small text for longer content
    } else {
      fontSize = 50; // Smallest text for the longest content
    }
    
    // Apply the font size
    element.style.fontSize = `${fontSize}px`;
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
