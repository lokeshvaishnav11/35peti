import { whiteLabelService } from "../services/white-label.service";

// Function to get white-label settings based on current domain
export const loadWhiteLabelSettings = async () => {
  try {
    const currentDomain = window.location.hostname;
    const response = await whiteLabelService.getWhiteLabelByDomain(currentDomain);
    
    if (response.data && response.data.data) {
      const whiteLabelData = response.data.data;
      
      // Apply the white-label settings to the page
      applyWhiteLabelSettings(whiteLabelData);
      
      return whiteLabelData;
    }
  } catch (error) {
    console.warn('Could not load white-label settings for domain:', window.location.hostname, error);
    // Return default settings if there's an error
    return getDefaultWhiteLabelSettings();
  }
};

// Function to apply white-label settings to the page
export const applyWhiteLabelSettings = (settings: any) => {
  // Update company name in title if available
  if (settings.companyName) {
    document.title = settings.companyName;
  }
  
  // Update logo if available
  if (settings.logoUrl) {
    const logoElements = document.querySelectorAll('img[src="/imgs/logo.png"]');
    logoElements.forEach(img => {
      img.setAttribute('src', settings.logoUrl);
    });
  }
  
  // Update favicon if available
  if (settings.faviconUrl) {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = settings.faviconUrl;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = settings.faviconUrl;
      document.head.appendChild(newFavicon);
    }
  }
  
  // Apply primary color as main theme color
  // if (settings.primaryColor) {
  //   document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
  // }
  
  // Apply secondary color
  // if (settings.secondaryColor) {
  //   document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
  // }
  
  // Apply background color
  if (settings.backgroundColor) {
    document.documentElement.style.setProperty('--background-color', settings.backgroundColor);
    document.body.style.backgroundColor = settings.backgroundColor;
  }
  
  // Apply text color
  if (settings.textColor) {
    document.documentElement.style.setProperty('--text-color', settings.textColor);
    document.body.style.color = settings.textColor;
  }
  
  // Apply font family
  if (settings.fontFamily) {
    document.documentElement.style.setProperty('--font-family', settings.fontFamily);
    document.body.style.fontFamily = settings.fontFamily;
  }
  
  // Inject custom CSS if available
  if (settings.customCSS) {
    let styleElement = document.getElementById('white-label-custom-css') as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'white-label-custom-css';
      document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = settings.customCSS;
  }
  
  // Inject custom JavaScript if available
  if (settings.customJS) {
    // Create a script element and add the custom JS
    const scriptElement = document.createElement('script');
    scriptElement.id = 'white-label-custom-js';
    scriptElement.textContent = settings.customJS;
    document.head.appendChild(scriptElement);
  }
  
  // Update header HTML if available (replace default header content)
  if (settings.headerHTML) {
    const headerElements = document.querySelectorAll('header');
    headerElements.forEach(header => {
      // We'll append the custom header HTML rather than replace everything
      const customHeaderDiv = document.createElement('div');
      customHeaderDiv.className = 'white-label-header';
      customHeaderDiv.innerHTML = settings.headerHTML;
      header.appendChild(customHeaderDiv);
    });
  }
  
  // Update footer HTML if available (replace default footer content)
  if (settings.footerHTML) {
    let footerElement = document.querySelector('footer') as HTMLElement;
    if (!footerElement) {
      // Create a footer if it doesn't exist
      footerElement = document.createElement('footer');
      document.body.appendChild(footerElement);
    }
    const customFooterDiv = document.createElement('div');
    customFooterDiv.className = 'white-label-footer';
    customFooterDiv.innerHTML = settings.footerHTML;
    footerElement.appendChild(customFooterDiv);
  }
};

// Function to get default white-label settings
export const getDefaultWhiteLabelSettings = () => {
  return {
    domain: window.location.hostname,
    companyName: 'Default Platform',
    logoUrl: '/imgs/logo.png',
    faviconUrl: '/favicon.ico',
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    backgroundColor: '#ffffff',
    textColor: '#212529',
    fontFamily: 'Arial, sans-serif',
    customCSS: '',
    customJS: '',
    headerHTML: '',
    footerHTML: ''
  };
};

// Function to check if current domain is white-labeled
export const isWhiteLabeledDomain = async (): Promise<boolean> => {
  try {
    const currentDomain = window.location.hostname;
    const response = await whiteLabelService.getWhiteLabelByDomain(currentDomain);
    
    if (response.data && response.data.data) {
      // Check if this is a custom white-label (not default)
      return response.data.data.domain !== currentDomain || 
             response.data.data.companyName !== 'Default Platform';
    }
    return false;
  } catch (error) {
    return false;
  }
};