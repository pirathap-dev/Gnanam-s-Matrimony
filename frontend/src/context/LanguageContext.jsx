import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    if (language === 'ta') {
      document.body.classList.add('font-tamil');
    } else {
      document.body.classList.remove('font-tamil');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = (key) => {
    if (!translations[language]) return key;
    const value = translations[language][key];
    return value || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
