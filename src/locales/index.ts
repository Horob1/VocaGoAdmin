import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./en.json";
import viTranslation from "./vi.json";

// Khởi tạo i18n với các cấu hình cơ bản
i18n
  .use(initReactI18next) // Kết nối i18n với React
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      vi: {
        translation: viTranslation,
      },
    },
    lng: "en", // Ngôn ngữ mặc định
    fallbackLng: "en", // Ngôn ngữ thay thế nếu ngôn ngữ cần không có
    interpolation: {
      escapeValue: false, // React đã tự escape HTML
    },
  });

export default i18n;
