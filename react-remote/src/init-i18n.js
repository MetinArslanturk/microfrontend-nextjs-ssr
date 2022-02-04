import i18next from "i18next";

export const initI18n = (resources, locale) => {
  const i18n = i18next.createInstance();
  i18n
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
