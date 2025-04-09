document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const inputText = document.getElementById('input-text');
  const displayText = document.getElementById('display-text');
  const thicknessSlider = document.getElementById('thickness-slider');
  const thicknessValue = document.getElementById('thickness-value');
  const textColor = document.getElementById('text-color');
  const resetButton = document.getElementById('reset-button');
  const currentYear = document.getElementById('current-year');
  const themeBubbles = document.querySelector('.theme-bubbles');
  const container = document.querySelector('.container');
  
  // Set current year in footer
  currentYear.textContent = new Date().getFullYear();

  // Album themes based on Lana Del Rey
  const albumThemes = [
    {
      name: "Born To Die",
      textColor: "#F1EFF1", // Deep blue
      backgroundColor: "#86A1CC", // Light lavender
    },
    {
      name: "Ultraviolence",
      textColor: "#E1E1E3", // White
      backgroundColor: "#646466", // Black/dark blue
    },
    {
      name: "Honeymoon",
      textColor: "#E74C3C", // Red
      backgroundColor: "#F9E79F", // Soft yellow
    },
    {
      name: "Lust for Life",
      textColor: "#C0392B", // Deep red
      backgroundColor: "#FDEBD0", // Light cream
    },
    {
      name: "Norman Fucking Rockwell",
      textColor: "#39484C", // Ocean green
      backgroundColor: "#DCDBA3", // Golden sunset
    },
    {
      name: "Chemtrails Over the Country Club",
      textColor: "#FFFFFF", // Navy blue
      backgroundColor: "#2D2D2D", // Off-white
    },
    {
      name: "Blue Banisters",
      textColor: "#372623", // Blue
      backgroundColor: "#F9F9DD", // White
    },
    {
      name: "Did You Know That There's a Tunnel Under Ocean Blvd",
      textColor: "#FCE59B", // Purple
      backgroundColor: "#636675", // Light blue
    }
  ];
  
  // Basic themes (black/white)
  const basicThemes = [
    {
      name: "Black on White",
      textColor: "#000000", // Black
      backgroundColor: "#FFFFFF", // White
    },
    {
      name: "White on Black",
      textColor: "#FFFFFF", // White
      backgroundColor: "#000000", // Black
    }
  ];

  // Current basic theme index (0 = black on white, 1 = white on black)
  let currentBasicTheme = 0;

  // Default values
  const defaultSettings = {
    text: 'Milton Generator',
    thickness: 0.5,
    textColor: "#000000", // Default to black text
    backgroundColor: "#FFFFFF", // Default to white background
    themeType: 'basic',
    themeIndex: 0 // Default to Black on White
  };
  
  // Make container transparent
  if (container) {
    container.style.backgroundColor = 'transparent';
  }
  
  // Create theme bubbles for album themes
  themeBubbles.innerHTML = ''; // Clear any existing bubbles
  albumThemes.forEach((theme, index) => {
    const bubble = document.createElement('div');
    bubble.className = 'theme-bubble';
    
    // Just use background color for the circle
    bubble.style.backgroundColor = theme.backgroundColor;
    
    bubble.dataset.index = index;
    bubble.dataset.type = 'album';
    
    bubble.addEventListener('click', () => {
      document.querySelectorAll('.theme-bubble').forEach(b => b.classList.remove('active'));
      bubble.classList.add('active');
      
      // Apply the theme
      applyTheme('album', index);
      
      // Update the reset button to show the next state (White on Black)
      updateResetButton();
      
      // Save to localStorage
      localStorage.setItem('miltonThemeType', 'album');
      localStorage.setItem('miltonThemeIndex', index);
    });
    
    themeBubbles.appendChild(bubble);
  });
  
  // Apply a theme by type and index
  function applyTheme(type, index) {
    const theme = type === 'album' ? albumThemes[index] : basicThemes[index];
    
    // Apply text color
    displayText.style.color = theme.textColor;
    textColor.value = theme.textColor;
    
    // Apply background color to body
    document.body.style.backgroundColor = theme.backgroundColor;
    
    // Ensure no container backgrounds blocking the body background
    if (container) {
      container.style.backgroundColor = 'transparent';
    }
    
    // Make sure all elements with backgrounds are transparent
    const elementsToMakeTransparent = document.querySelectorAll('.text-display, .controls, .text-input, header, footer, .theme-selector');
    elementsToMakeTransparent.forEach(el => {
      if (el) {
        el.style.backgroundColor = 'transparent';
      }
    });
    
    // Save to localStorage
    localStorage.setItem('miltonTextColor', theme.textColor);
    localStorage.setItem('miltonBackgroundColor', theme.backgroundColor);
    
    // Update currentBasicTheme if we're using a basic theme
    if (type === 'basic') {
      currentBasicTheme = index;
      localStorage.setItem('miltonBasicThemeIndex', index);
    }
  }

  // Function to update reset button appearance based on current state
  function updateResetButton() {
    const themeType = localStorage.getItem('miltonThemeType') || defaultSettings.themeType;
    
    if (themeType === 'album') {
      // If using an album theme, show button for Black on White
      resetButton.textContent = 'BLACK ON WHITE';
      resetButton.style.backgroundColor = '#FFFFFF';
      resetButton.style.color = '#000000';
      resetButton.dataset.nextTheme = 'basic-0';
    } else {
      // Using a basic theme, toggle between White on Black and Black on White
      if (currentBasicTheme === 0) {
        // Currently Black on White, show button for White on Black
        resetButton.textContent = 'WHITE ON BLACK';
        resetButton.style.backgroundColor = '#000000';
        resetButton.style.color = '#FFFFFF';
        resetButton.dataset.nextTheme = 'basic-1';
      } else {
        // Currently White on Black, show button for Black on White
        resetButton.textContent = 'BLACK ON WHITE';
        resetButton.style.backgroundColor = '#FFFFFF';
        resetButton.style.color = '#000000';
        resetButton.dataset.nextTheme = 'basic-0';
      }
    }
  }
  
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
  const savedThemeType = localStorage.getItem('miltonThemeType') || defaultSettings.themeType;
  const savedThemeIndex = localStorage.getItem('miltonThemeIndex') || defaultSettings.themeIndex;
  const savedBasicThemeIndex = localStorage.getItem('miltonBasicThemeIndex') || 0;
  const savedBackgroundColor = localStorage.getItem('miltonBackgroundColor') || defaultSettings.backgroundColor;
  
  // Set current basic theme
  currentBasicTheme = parseInt(savedBasicThemeIndex);
  
  // Apply saved settings
  thicknessSlider.value = savedThickness;
  thicknessValue.textContent = savedThickness;
  displayText.style.fontWeight = getWeightFromThickness(savedThickness);
  
  textColor.value = savedTextColor;
  displayText.style.color = savedTextColor;
  document.body.style.backgroundColor = savedBackgroundColor;
  
  // Ensure container is transparent on load
  if (container) {
    container.style.backgroundColor = 'transparent';
  }
  
  // Set active theme bubble
  if (savedThemeType === 'album') {
    const activeBubble = document.querySelector(`.theme-bubble[data-type="album"][data-index="${savedThemeIndex}"]`);
    if (activeBubble) {
      activeBubble.classList.add('active');
    }
  }
  
  // Update the reset button appearance
  updateResetButton();
  
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
    // Get next theme from data attribute
    const nextTheme = this.dataset.nextTheme.split('-');
    const themeType = nextTheme[0];
    const themeIndex = parseInt(nextTheme[1]);
    
    // Clear any active theme bubbles
    document.querySelectorAll('.theme-bubble').forEach(b => b.classList.remove('active'));
    
    // If album theme, activate the corresponding bubble
    if (themeType === 'album') {
      const bubble = document.querySelector(`.theme-bubble[data-type="album"][data-index="${themeIndex}"]`);
      if (bubble) bubble.classList.add('active');
    }
    
    // Reset text only if switching to Black on White
    if (themeType === 'basic' && themeIndex === 0) {
      inputText.value = '';
      displayText.textContent = defaultSettings.text;
      autoSizeText(displayText, defaultSettings.text);
      localStorage.removeItem('miltonText');
      localStorage.removeItem('miltonFontSize');
      
      // Reset thickness
      thicknessSlider.value = defaultSettings.thickness;
      thicknessValue.textContent = defaultSettings.thickness;
      displayText.style.fontWeight = getWeightFromThickness(defaultSettings.thickness);
      localStorage.removeItem('miltonThickness');
    }
    
    // Apply the theme
    applyTheme(themeType, themeIndex);
    
    // Update localStorage
    localStorage.setItem('miltonThemeType', themeType);
    localStorage.setItem('miltonThemeIndex', themeIndex);
    
    // Update the reset button
    updateResetButton();
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
  
  // Apply the current theme immediately
  if (savedThemeType === 'album') {
    applyTheme(savedThemeType, parseInt(savedThemeIndex || 0));
  } else {
    applyTheme('basic', parseInt(savedBasicThemeIndex || 0));
  }
});
