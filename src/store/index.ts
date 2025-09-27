import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import settingsReducer from "./slices/settingsSlice";
import { authApi } from "./api/authApi";
import { usersApi } from "./api/usersApi";
import { authMiddleware } from "../middleware/authMiddleware";

export const store = configureStore({
  reducer: {
    // Slices
    auth: authReducer,
    settings: settingsReducer,

    // APIs
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
        ignoredActionsPaths: ["meta.arg", "payload.timestamp"],
        ignoredPaths: ["items.dates"],
      },
    })
      .concat(authMiddleware)
      .concat(authApi.middleware)
      .concat(usersApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Setup RTK Query listeners for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Store is already exported above with 'export const store'
