import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLanguage } from "@/contexts/LanguageContext";
import { setLanguage } from "@/store/slices/settingsSlice";
import { setupReduxPersistence } from "@/utils/reduxPersistence";

// Custom hook to sync Redux settings with language context
export const useReduxWithLanguage = () => {
  const dispatch = useAppDispatch();
  const { language, setLanguage: setLanguageContext } = useLanguage();
  const reduxLanguage = useAppSelector(
    (state) => state.settings.language.language,
  );

  const isInitialized = useRef(false);

  // Only sync on initial mount - load from Redux to context
  useEffect(() => {
    if (!isInitialized.current && reduxLanguage && reduxLanguage !== language) {
      setLanguageContext(reduxLanguage);
      isInitialized.current = true;
    }
  }, []);

  // When language context changes (user action), update Redux
  useEffect(() => {
    if (isInitialized.current && language !== reduxLanguage) {
      dispatch(setLanguage(language));
    }
  }, [language, dispatch]);

  // Initialize Redux persistence only once
  useEffect(() => {
    setupReduxPersistence();
  }, []);

  return {
    language,
    reduxLanguage,
  };
};
