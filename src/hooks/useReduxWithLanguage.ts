import { useEffect } from "react";
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

  // Sync language context with Redux
  useEffect(() => {
    if (language !== reduxLanguage) {
      dispatch(setLanguage(language));
    }
  }, [language, reduxLanguage, dispatch]);

  // Sync Redux with language context
  useEffect(() => {
    if (reduxLanguage !== language) {
      setLanguageContext(reduxLanguage);
    }
  }, [reduxLanguage, language, setLanguageContext]);

  // Initialize Redux persistence
  useEffect(() => {
    setupReduxPersistence();
  }, []);

  return {
    language,
    reduxLanguage,
  };
};
