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
  
  // Update display text with saved content and format with special wrapping
  const formattedText = formatTextWithSpecialWrapping(savedText || defaultSettings.text);
  displayText.innerHTML = formattedText;
  
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
    
    // Format text with special wrapping (like the brat generator)
    const formattedText = formatTextWithSpecialWrapping(text || defaultSettings.text);
    displayText.innerHTML = formattedText;
    
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
    const formattedText = formatTextWithSpecialWrapping(defaultSettings.text);
    displayText.innerHTML = formattedText;
    
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
    
    // Much larger font sizes as requested with more gradual steps
    if (length <= 3) {
      fontSize = 300; // Extremely large text for very short inputs
    } else if (length <= 6) {
      fontSize = 250; // Very large text for short inputs
    } else if (length <= 10) {
      fontSize = 200; // Large text
    } else if (length <= 20) {
      fontSize = 150; // Medium-large text
    } else if (length <= 30) {
      fontSize = 125; // Medium-large to medium transition
    } else if (length <= 40) {
      fontSize = 100; // Medium text
    } else if (length <= 45) {
      fontSize = 90; // Gradual step down
    } else if (length <= 50) {
      fontSize = 80; // Another gradual step
    } else if (length <= 60) {
      fontSize = 70; // Medium-small text
    } else if (length <= 70) {
      fontSize = 60; // Approaching smallest
    } else {
      fontSize = 50; // Smallest text for the longest content
    }
    
    // Apply the font size
    element.style.fontSize = `${fontSize}px`;
  }
  
  // Function to format text with special wrapping behavior
  function formatTextWithSpecialWrapping(text) {
    if (!text || text.length === 0) {
      return defaultSettings.text;
    }
    
    // If text is short enough to fit on one line, just return it
    if (text.length <= 20) {
      return text;
    }
    
    // For longer text, create special brat-generator style formatting
    const charLimit = 20; // Characters per line before wrapping
    let result = '';
    let currentLine = '';
    let lineCount = 0;
    
    // Process the text character by character for more control
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // Add character to current line
      currentLine += char;
      
      // If we've reached our character limit or hit a natural break point
      if (currentLine.length >= charLimit || (char === ' ' && currentLine.length > charLimit * 0.75) || i === text.length - 1) {
        if (lineCount === 0) {
          // First line - center aligned
          result += `<div style="width: 100%; text-align: center;">${currentLine}</div>`;
        } else {
          // Subsequent lines - right-aligned with increasing left margin as more lines are added
          // This creates the effect of new text starting from right and "pushing" existing text
          const marginLeft = Math.max(0, 60 - (lineCount * 10));
          result += `<div style="width: 100%; text-align: right; padding-right: ${marginLeft}px;">${currentLine}</div>`;
        }
        
        currentLine = '';
        lineCount++;
      }
    }
    
    // If there's any remaining text
    if (currentLine.length > 0) {
      const marginLeft = Math.max(0, 60 - (lineCount * 10));
      result += `<div style="width: 100%; text-align: right; padding-right: ${marginLeft}px;">${currentLine}</div>`;
    }
    
    return result;
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
