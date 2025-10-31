import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ThemeSettings,
  LanguageSettings,
  NotificationSettings,
  GeneralSettings,
} from "../types";

interface SettingsState {
  theme: ThemeSettings;
  language: LanguageSettings;
  notifications: NotificationSettings;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  theme: {
    theme: "default",
    mode: "light",
  },
  language: {
    language: "en",
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  isLoading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action: PayloadAction<ThemeSettings["theme"]>) => {
      state.theme.theme = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<ThemeSettings["mode"]>) => {
      state.theme.mode = action.payload;
    },
    updateTheme: (state, action: PayloadAction<Partial<ThemeSettings>>) => {
      state.theme = { ...state.theme, ...action.payload };
    },

    // Language actions
    setLanguage: (
      state,
      action: PayloadAction<LanguageSettings["language"]>,
    ) => {
      state.language.language = action.payload;
    },
    updateLanguage: (
      state,
      action: PayloadAction<Partial<LanguageSettings>>,
    ) => {
      state.language = { ...state.language, ...action.payload };
    },

    // Notification settings actions
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<NotificationSettings>>,
    ) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    toggleEmailNotifications: (state) => {
      state.notifications.email = !state.notifications.email;
    },
    togglePushNotifications: (state) => {
      state.notifications.push = !state.notifications.push;
    },
    toggleSmsNotifications: (state) => {
      state.notifications.sms = !state.notifications.sms;
    },

    // General settings actions
    updateGeneralSettings: (
      state,
      action: PayloadAction<Partial<GeneralSettings>>,
    ) => {
      if (action.payload.theme) {
        state.theme = { ...state.theme, ...action.payload.theme };
      }
      if (action.payload.language) {
        state.language = { ...state.language, ...action.payload.language };
      }
      if (action.payload.notifications) {
        state.notifications = {
          ...state.notifications,
          ...action.payload.notifications,
        };
      }
    },

    // Loading and error actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Initialize settings from localStorage
    initializeSettings: (
      state,
      action: PayloadAction<Partial<GeneralSettings>>,
    ) => {
      if (action.payload.theme) {
        state.theme = { ...state.theme, ...action.payload.theme };
      }
      if (action.payload.language) {
        state.language = { ...state.language, ...action.payload.language };
      }
      if (action.payload.notifications) {
        state.notifications = {
          ...state.notifications,
          ...action.payload.notifications,
        };
      }
    },

    // Reset settings
    resetSettings: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  setTheme,
  setThemeMode,
  updateTheme,
  setLanguage,
  updateLanguage,
  updateNotificationSettings,
  toggleEmailNotifications,
  togglePushNotifications,
  toggleSmsNotifications,
  updateGeneralSettings,
  setLoading,
  setError,
  clearError,
  initializeSettings,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
