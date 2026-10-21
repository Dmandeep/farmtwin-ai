import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, HelpCircle, Globe, ChevronDown } from 'lucide-react';
import { HelpModal } from './HelpModal';
import type { TabType } from '../types';

interface HeaderProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { t, i18n } = useTranslation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const currentLang = i18n.language || 'te';

  const languages = [
    { code: 'te', label: 'తెలుగు', name: 'Telugu' },
    { code: 'en', label: 'English', name: 'English' },
    { code: 'hi', label: 'हिंदी', name: 'Hindi' },
  ];

  const navTabs: { id: TabType; labelKey: string }[] = [
    { id: 'home', labelKey: 'nav.home' },
    { id: 'land', labelKey: 'nav.myLand' },
    { id: 'advice', labelKey: 'nav.advice' },
    { id: 'ask', labelKey: 'nav.ask' },
    { id: 'profile', labelKey: 'nav.profile' },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('farmtwin_lang', code);
    setIsLangMenuOpen(false);
  };

  const activeLangObj = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#4A0810] text-[#FAF6F0] border-b border-[#C5A059]/30 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between">
          {/* Logo & Luxury Brand Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange && onTabChange('home')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 border border-[#C5A059]/50 bg-[#340409] flex items-center justify-center text-[#C5A059] shrink-0">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-luxury-serif text-xl sm:text-2xl font-bold tracking-[0.18em] uppercase text-[#FFFDF9] leading-none">
                  {t('header.appName')}
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase px-1.5 py-0.5 border border-[#C5A059]/40 bg-[#340409] text-[#C5A059]">
                  PRECISION
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#E8D5B5] mt-0.5 font-medium">
                {t('header.tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links (Visible on Tablet & Desktop) */}
          {onTabChange && (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-3" aria-label="Desktop Navigation">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-3 py-2 text-xs lg:text-sm font-bold tracking-wider uppercase transition-colors touch-target ${
                      isActive
                        ? 'text-[#C5A059] border-b-2 border-[#C5A059]'
                        : 'text-[#E8D5B5] hover:text-[#FFFDF9]'
                    }`}
                  >
                    {t(tab.labelKey)}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Controls: Always-Visible Language Selector & Help Option */}
          <div className="flex items-center space-x-2">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 bg-[#3A050B] hover:bg-[#520912] border border-[#C5A059]/40 text-[#FFFDF9] text-xs font-semibold transition touch-target"
                aria-label={t('header.changeLang')}
                aria-expanded={isLangMenuOpen}
              >
                <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-bold tracking-wider">{activeLangObj.label}</span>
                <ChevronDown className={`w-3 h-3 text-[#C5A059] transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown Menu */}
              {isLangMenuOpen && (
                <div 
                  className="absolute right-0 mt-1 w-40 bg-[#FFFDF9] border border-[#6B0F1A]/20 shadow-2xl py-1 z-50 animate-in fade-in duration-100"
                  role="menu"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition ${
                        currentLang === lang.code 
                          ? 'bg-[#6B0F1A] text-[#FFFDF9] font-bold' 
                          : 'text-[#2A080C] hover:bg-[#FAF6F0]'
                      }`}
                      role="menuitem"
                    >
                      <span className="font-semibold">{lang.label}</span>
                      <span className={`text-[10px] ${currentLang === lang.code ? 'text-[#E8D5B5]' : 'text-stone-500'}`}>
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Help Button */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-[#C5A059] hover:bg-[#B38F46] active:bg-[#9E7D38] text-[#2A080C] font-bold text-xs border border-[#C5A059] transition touch-target"
              aria-label={t('header.help')}
            >
              <HelpCircle className="w-4 h-4 text-[#2A080C]" />
              <span className="tracking-wide">{t('header.help')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};
