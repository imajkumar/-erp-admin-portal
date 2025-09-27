import { store } from "@/store";
import { initializeAuthFromStorage } from "@/middleware/authMiddleware";
import { initializeSettings } from "@/store/slices/settingsSlice";

// Initialize Redux state from localStorage
export const initializeReduxFromStorage = () => {
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
};

// Save Redux state to localStorage
export const saveReduxToStorage = () => {
  const state = store.getState();

  // Save settings
  if (state.settings) {
    localStorage.setItem("settings", JSON.stringify(state.settings));
  }

  // Save theme
  if (state.settings.theme) {
    localStorage.setItem("theme", JSON.stringify(state.settings.theme));
  }

  // Save language
  if (state.settings.language) {
    localStorage.setItem("language", state.settings.language.language);
  }
};

// Subscribe to store changes for persistence
export const setupReduxPersistence = () => {
  // Initialize from storage on app start
  initializeReduxFromStorage();

  // Subscribe to store changes
  store.subscribe(() => {
    saveReduxToStorage();
  });
};
