import { store } from "@/store";
import { initializeAuthFromStorage } from "@/middleware/authMiddleware";
import { initializeSettings } from "@/store/slices/settingsSlice";

let isInitialized = false;
let saveTimeout: NodeJS.Timeout | null = null;

// Initialize Redux state from localStorage
export const initializeReduxFromStorage = () => {
  if (isInitialized) {
    return; // Already initialized, skip
  }

  // Initialize auth state
  initializeAuthFromStorage(store);

  // Initialize settings state
  const savedSettings = localStorage.getItem("settings");
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      store.dispatch(initializeSettings(settings));
    } catch (error) {
      console.error("Failed to parse settings from localStorage:", error);
    }
  }

  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    try {
      const theme = JSON.parse(savedTheme);
      store.dispatch(initializeSettings({ theme }));
    } catch (error) {
      console.error("Failed to parse theme from localStorage:", error);
    }
  }

  // Initialize language from localStorage
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage) {
    try {
      store.dispatch(
        initializeSettings({
          language: { language: savedLanguage as any },
        }),
      );
    } catch (error) {
      console.error("Failed to parse language from localStorage:", error);
    }
  }

  isInitialized = true;
};

// Save Redux state to localStorage with error handling
export const saveReduxToStorage = () => {
  try {
    const state = store.getState();

    // Only save essential data to avoid quota issues
    // Save language (small data)
    if (state.settings?.language) {
      localStorage.setItem("language", state.settings.language.language);
    }

    // Save theme (small data)
    if (state.settings?.theme?.theme) {
      localStorage.setItem("theme", state.settings.theme.theme);
    }

    // Don't save the entire settings object - it's too large
  } catch (error: any) {
    if (error.name === "QuotaExceededError") {
      console.warn("LocalStorage quota exceeded. Clearing old data...");
      // Clear non-essential data
      localStorage.removeItem("settings");
      // Keep only essential items
    } else {
      console.error("Failed to save to localStorage:", error);
    }
  }
};

// Subscribe to store changes for persistence
export const setupReduxPersistence = () => {
  if (isInitialized) {
    return; // Already set up, skip
  }

  // Initialize from storage on app start
  initializeReduxFromStorage();

  // Subscribe to store changes with debouncing
  store.subscribe(() => {
    // Debounce saves to prevent too many writes
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
      saveReduxToStorage();
    }, 500); // Save only after 500ms of no changes
  });
};
