"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "en" | "hi" | "ru" | "pl";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "hi", "ru", "pl"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const translations = {
      en: {
        // Common
        "common.dashboard": "Dashboard",
        "common.users": "Users",
        "common.settings": "Settings",
        "common.notifications": "Notifications",
        "common.home": "Home",
        "common.reports": "Reports",
        "common.calendar": "Calendar",
        "common.products": "Products",
        "common.analytics": "Analytics",
        "common.sales": "Sales",
        "common.revenue": "Revenue",
        "common.activity": "Activity",
        "common.documents": "Documents",
        "common.messages": "Messages",
        "common.tasks": "Tasks",
        "common.payments": "Payments",
        "common.database": "Database",
        "common.help": "Help & Support",
        "common.close": "Close",
        "common.open": "Open",
        "common.save": "Save",
        "common.cancel": "Cancel",
        "common.edit": "Edit",
        "common.delete": "Delete",
        "common.add": "Add",
        "common.search": "Search",
        "common.filter": "Filter",
        "common.export": "Export",
        "common.import": "Import",
        "common.refresh": "Refresh",
        "common.back": "Back",
        "common.next": "Next",
        "common.previous": "Previous",
        "common.submit": "Submit",
        "common.reset": "Reset",
        "common.loading": "Loading...",
        "common.error": "Error",
        "common.success": "Success",
        "common.warning": "Warning",
        "common.info": "Info",
        "common.yes": "Yes",
        "common.no": "No",
        "common.ok": "OK",
        "common.confirm": "Confirm",

        // Sidebar
        "sidebar.open_sidebar": "Open sidebar",
        "sidebar.close_sidebar": "Close sidebar",
        "sidebar.settings_panel": "Settings Panel",
        "sidebar.change_theme": "Change Theme",

        // Settings Panel
        "settings.page_style": "Page Style Setting",
        "settings.theme_color": "Theme Color",
        "settings.navigation_mode": "Navigation Mode",
        "settings.sidemenu_type": "SideMenu Type",
        "settings.content_width": "Content Width",
        "settings.fixed_header": "Fixed Header",
        "settings.fixed_sidebar": "Fixed Sidebar",
        "settings.split_menus": "Split Menus",
        "settings.regional_settings": "Regional Settings",
        "settings.header": "Header",
        "settings.footer": "Footer",
        "settings.menu": "Menu",
        "settings.menu_header": "Menu Header",
        "settings.weak_mode": "Weak Mode",
        "settings.copy_setting": "Copy Setting",
        "settings.development_warning":
          "Setting panel shows in development environment only, please manually modify",
        "settings.fluid": "Fluid",
        "settings.fixed": "Fixed",

        // Themes
        "theme.default": "Default",
        "theme.blue": "Blue",
        "theme.green": "Green",
        "theme.purple": "Purple",

        // Languages
        "language.english": "English",
        "language.hindi": "हिन्दी",
        "language.russian": "Русский",
        "language.polish": "Polski",
        "language.select_language": "Select Language",
      },
      hi: {
        // Common
        "common.dashboard": "डैशबोर्ड",
        "common.users": "उपयोगकर्ता",
        "common.settings": "सेटिंग्स",
        "common.notifications": "सूचनाएं",
        "common.home": "होम",
        "common.reports": "रिपोर्ट्स",
        "common.calendar": "कैलेंडर",
        "common.products": "उत्पाद",
        "common.analytics": "विश्लेषण",
        "common.sales": "बिक्री",
        "common.revenue": "राजस्व",
        "common.activity": "गतिविधि",
        "common.documents": "दस्तावेज",
        "common.messages": "संदेश",
        "common.tasks": "कार्य",
        "common.payments": "भुगतान",
        "common.database": "डेटाबेस",
        "common.help": "सहायता और समर्थन",
        "common.close": "बंद करें",
        "common.open": "खोलें",
        "common.save": "सहेजें",
        "common.cancel": "रद्द करें",
        "common.edit": "संपादित करें",
        "common.delete": "हटाएं",
        "common.add": "जोड़ें",
        "common.search": "खोजें",
        "common.filter": "फिल्टर",
        "common.export": "निर्यात",
        "common.import": "आयात",
        "common.refresh": "रिफ्रेश",
        "common.back": "वापस",
        "common.next": "अगला",
        "common.previous": "पिछला",
        "common.submit": "जमा करें",
        "common.reset": "रीसेट",
        "common.loading": "लोड हो रहा है...",
        "common.error": "त्रुटि",
        "common.success": "सफलता",
        "common.warning": "चेतावनी",
        "common.info": "जानकारी",
        "common.yes": "हाँ",
        "common.no": "नहीं",
        "common.ok": "ठीक है",
        "common.confirm": "पुष्टि करें",

        // Sidebar
        "sidebar.open_sidebar": "साइडबार खोलें",
        "sidebar.close_sidebar": "साइडबार बंद करें",
        "sidebar.settings_panel": "सेटिंग्स पैनल",
        "sidebar.change_theme": "थीम बदलें",

        // Settings Panel
        "settings.page_style": "पेज स्टाइल सेटिंग",
        "settings.theme_color": "थीम रंग",
        "settings.navigation_mode": "नेविगेशन मोड",
        "settings.sidemenu_type": "साइड मेनू प्रकार",
        "settings.content_width": "कंटेंट चौड़ाई",
        "settings.fixed_header": "फिक्स्ड हेडर",
        "settings.fixed_sidebar": "फिक्स्ड साइडबार",
        "settings.split_menus": "स्प्लिट मेनू",
        "settings.regional_settings": "क्षेत्रीय सेटिंग्स",
        "settings.header": "हेडर",
        "settings.footer": "फुटर",
        "settings.menu": "मेनू",
        "settings.menu_header": "मेनू हेडर",
        "settings.weak_mode": "कमजोर मोड",
        "settings.copy_setting": "सेटिंग कॉपी करें",
        "settings.development_warning":
          "सेटिंग पैनल केवल डेवलपमेंट वातावरण में दिखाई देता है, कृपया मैन्युअल रूप से संशोधित करें",
        "settings.fluid": "तरल",
        "settings.fixed": "फिक्स्ड",

        // Themes
        "theme.default": "डिफ़ॉल्ट",
        "theme.blue": "नीला",
        "theme.green": "हरा",
        "theme.purple": "बैंगनी",

        // Languages
        "language.english": "English",
        "language.hindi": "हिन्दी",
        "language.russian": "Русский",
        "language.polish": "Polski",
        "language.select_language": "भाषा चुनें",
      },
      ru: {
        // Common
        "common.dashboard": "Панель управления",
        "common.users": "Пользователи",
        "common.settings": "Настройки",
        "common.notifications": "Уведомления",
        "common.home": "Главная",
        "common.reports": "Отчеты",
        "common.calendar": "Календарь",
        "common.products": "Продукты",
        "common.analytics": "Аналитика",
        "common.sales": "Продажи",
        "common.revenue": "Доходы",
        "common.activity": "Активность",
        "common.documents": "Документы",
        "common.messages": "Сообщения",
        "common.tasks": "Задачи",
        "common.payments": "Платежи",
        "common.database": "База данных",
        "common.help": "Помощь и поддержка",
        "common.close": "Закрыть",
        "common.open": "Открыть",
        "common.save": "Сохранить",
        "common.cancel": "Отмена",
        "common.edit": "Редактировать",
        "common.delete": "Удалить",
        "common.add": "Добавить",
        "common.search": "Поиск",
        "common.filter": "Фильтр",
        "common.export": "Экспорт",
        "common.import": "Импорт",
        "common.refresh": "Обновить",
        "common.back": "Назад",
        "common.next": "Далее",
        "common.previous": "Предыдущий",
        "common.submit": "Отправить",
        "common.reset": "Сброс",
        "common.loading": "Загрузка...",
        "common.error": "Ошибка",
        "common.success": "Успех",
        "common.warning": "Предупреждение",
        "common.info": "Информация",
        "common.yes": "Да",
        "common.no": "Нет",
        "common.ok": "ОК",
        "common.confirm": "Подтвердить",

        // Sidebar
        "sidebar.open_sidebar": "Открыть боковую панель",
        "sidebar.close_sidebar": "Закрыть боковую панель",
        "sidebar.settings_panel": "Панель настроек",
        "sidebar.change_theme": "Изменить тему",

        // Settings Panel
        "settings.page_style": "Настройка стиля страницы",
        "settings.theme_color": "Цвет темы",
        "settings.navigation_mode": "Режим навигации",
        "settings.sidemenu_type": "Тип бокового меню",
        "settings.content_width": "Ширина контента",
        "settings.fixed_header": "Фиксированный заголовок",
        "settings.fixed_sidebar": "Фиксированная боковая панель",
        "settings.split_menus": "Разделенные меню",
        "settings.regional_settings": "Региональные настройки",
        "settings.header": "Заголовок",
        "settings.footer": "Подвал",
        "settings.menu": "Меню",
        "settings.menu_header": "Заголовок меню",
        "settings.weak_mode": "Слабый режим",
        "settings.copy_setting": "Копировать настройки",
        "settings.development_warning":
          "Панель настроек отображается только в среде разработки, пожалуйста, измените вручную",
        "settings.fluid": "Гибкий",
        "settings.fixed": "Фиксированный",

        // Themes
        "theme.default": "По умолчанию",
        "theme.blue": "Синий",
        "theme.green": "Зеленый",
        "theme.purple": "Фиолетовый",

        // Languages
        "language.english": "English",
        "language.hindi": "हिन्दी",
        "language.russian": "Русский",
        "language.polish": "Polski",
        "language.select_language": "Выберите язык",
      },
      pl: {
        // Common
        "common.dashboard": "Panel główny",
        "common.users": "Użytkownicy",
        "common.settings": "Ustawienia",
        "common.notifications": "Powiadomienia",
        "common.home": "Strona główna",
        "common.reports": "Raporty",
        "common.calendar": "Kalendarz",
        "common.products": "Produkty",
        "common.analytics": "Analityka",
        "common.sales": "Sprzedaż",
        "common.revenue": "Przychody",
        "common.activity": "Aktywność",
        "common.documents": "Dokumenty",
        "common.messages": "Wiadomości",
        "common.tasks": "Zadania",
        "common.payments": "Płatności",
        "common.database": "Baza danych",
        "common.help": "Pomoc i wsparcie",
        "common.close": "Zamknij",
        "common.open": "Otwórz",
        "common.save": "Zapisz",
        "common.cancel": "Anuluj",
        "common.edit": "Edytuj",
        "common.delete": "Usuń",
        "common.add": "Dodaj",
        "common.search": "Szukaj",
        "common.filter": "Filtruj",
        "common.export": "Eksportuj",
        "common.import": "Importuj",
        "common.refresh": "Odśwież",
        "common.back": "Wstecz",
        "common.next": "Dalej",
        "common.previous": "Poprzedni",
        "common.submit": "Wyślij",
        "common.reset": "Resetuj",
        "common.loading": "Ładowanie...",
        "common.error": "Błąd",
        "common.success": "Sukces",
        "common.warning": "Ostrzeżenie",
        "common.info": "Informacja",
        "common.yes": "Tak",
        "common.no": "Nie",
        "common.ok": "OK",
        "common.confirm": "Potwierdź",

        // Sidebar
        "sidebar.open_sidebar": "Otwórz pasek boczny",
        "sidebar.close_sidebar": "Zamknij pasek boczny",
        "sidebar.settings_panel": "Panel ustawień",
        "sidebar.change_theme": "Zmień motyw",

        // Settings Panel
        "settings.page_style": "Ustawienie stylu strony",
        "settings.theme_color": "Kolor motywu",
        "settings.navigation_mode": "Tryb nawigacji",
        "settings.sidemenu_type": "Typ menu bocznego",
        "settings.content_width": "Szerokość treści",
        "settings.fixed_header": "Stały nagłówek",
        "settings.fixed_sidebar": "Stały pasek boczny",
        "settings.split_menus": "Podzielone menu",
        "settings.regional_settings": "Ustawienia regionalne",
        "settings.header": "Nagłówek",
        "settings.footer": "Stopka",
        "settings.menu": "Menu",
        "settings.menu_header": "Nagłówek menu",
        "settings.weak_mode": "Tryb słaby",
        "settings.copy_setting": "Kopiuj ustawienia",
        "settings.development_warning":
          "Panel ustawień jest widoczny tylko w środowisku deweloperskim, proszę zmodyfikować ręcznie",
        "settings.fluid": "Płynny",
        "settings.fixed": "Stały",

        // Themes
        "theme.default": "Domyślny",
        "theme.blue": "Niebieski",
        "theme.green": "Zielony",
        "theme.purple": "Fioletowy",

        // Languages
        "language.english": "English",
        "language.hindi": "हिन्दी",
        "language.russian": "Русский",
        "language.polish": "Polski",
        "language.select_language": "Wybierz język",
      },
    };

    return (translations[language] as any)?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
