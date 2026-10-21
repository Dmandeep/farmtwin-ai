import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Sprout, Lightbulb, MessageSquare, User } from 'lucide-react';
import type { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  const tabs: { id: TabType; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', labelKey: 'nav.home', icon: Home },
    { id: 'land', labelKey: 'nav.myLand', icon: Sprout },
    { id: 'advice', labelKey: 'nav.advice', icon: Lightbulb },
    { id: 'ask', labelKey: 'nav.ask', icon: MessageSquare },
    { id: 'profile', labelKey: 'nav.profile', icon: User },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9] border-t border-[#E6D9C8] md:hidden shadow-[0_-2px_10px_rgba(42,8,12,0.04)]"
      aria-label="Main Navigation"
    >
      <div className="w-full flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full py-1 relative transition-colors touch-target select-none ${
                isActive 
                  ? 'text-[#6B0F1A]' 
                  : 'text-[#7D6B64] hover:text-[#4A0810]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Zero-slope active top border bar */}
              {isActive && (
                <div className="absolute top-0 left-3 right-3 h-[2px] bg-[#6B0F1A]" />
              )}
              
              <div className="p-1">
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${isActive ? 'stroke-[2.4] text-[#6B0F1A]' : 'stroke-[1.8]'}`} />
              </div>

              <span className={`text-[10px] sm:text-xs leading-tight truncate max-w-[80px] sm:max-w-[100px] tracking-tight ${
                isActive ? 'font-bold text-[#6B0F1A]' : 'font-medium'
              }`}>
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
