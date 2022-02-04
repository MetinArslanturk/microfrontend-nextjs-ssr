import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const initI18n = (resources, locale) => {
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      lng: locale,
      defaultNS: "common",
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });

  return i18n;
};
