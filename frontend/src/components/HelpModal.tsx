import React from 'react';
import { useTranslation } from 'react-i18next';
import { PhoneCall, X, BookOpen, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#2A080C]/70 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#FFFDF9] border border-[#C5A059]/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
      >
        {/* Luxury Burgundy Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#4A0810] text-[#FFFDF9] border-b border-[#C5A059]/40">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border border-[#C5A059]/40 bg-[#340409] flex items-center justify-center text-[#C5A059]">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h2 id="help-modal-title" className="font-luxury-serif text-lg font-bold tracking-wider text-[#FFFDF9] leading-tight">
                {t('helpModal.title')}
              </h2>
              <p className="text-[11px] uppercase tracking-wider text-[#E8D5B5]">
                {t('helpModal.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#E8D5B5] hover:text-[#FFFDF9] hover:bg-[#5E0B16] transition touch-target flex items-center justify-center"
            aria-label={t('helpModal.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-[#2A080C]">
          {/* Emergency Kisan Call Center Banner */}
          <div className="p-4 bg-[#FAF6F0] border border-[#6B0F1A]/20">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#6B0F1A] text-[#FFFDF9] mb-1.5">
                  {t('helpModal.kccTiming')}
                </span>
                <h3 className="font-luxury-serif font-bold text-[#2A080C] text-base">
                  {t('helpModal.kccTitle')}
                </h3>
                <p className="text-xs text-[#6B5A55] mt-0.5">
                  Direct government agricultural officers in Telugu, Hindi & English
                </p>
              </div>
              <a
                href="tel:18001801551"
                className="inline-flex items-center space-x-1 px-4 py-2.5 bg-[#6B0F1A] hover:bg-[#540912] active:bg-[#40060D] text-[#FFFDF9] font-bold text-xs uppercase tracking-wider border border-[#C5A059]/40 transition touch-target shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5 mr-1" />
                <span>Call 1551</span>
              </a>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#E6D9C8] text-xs font-mono font-bold text-[#6B0F1A]">
              TOLL-FREE HELPLINE: 1800-180-1551
            </div>
          </div>

          {/* KVK District Advice */}
          <div className="p-4 bg-[#FAF6F0] border border-[#E6D9C8]">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-[#EFE4D6] border border-[#C5A059]/30 text-[#6B0F1A] mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#2A080C] text-sm uppercase tracking-wide">
                  {t('helpModal.kvkTitle')}
                </h4>
                <p className="text-xs text-[#5D4B45] mt-1 leading-relaxed">
                  {t('helpModal.kvkDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Step Usage Tips */}
          <div className="border border-[#E6D9C8] p-4 bg-[#FFFDF9] space-y-2.5">
            <div className="flex items-center space-x-2 text-[#6B0F1A] font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{t('helpModal.howToUseTitle')}</span>
            </div>
            <ul className="text-xs space-y-2 text-[#4A3D39] leading-relaxed">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#6B0F1A] shrink-0">I.</span>
                <span>{t('helpModal.tip1')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#6B0F1A] shrink-0">II.</span>
                <span>{t('helpModal.tip2')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#6B0F1A] shrink-0">III.</span>
                <span>{t('helpModal.tip3')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF6F0] border-t border-[#E6D9C8] flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#2A080C] hover:bg-[#40060D] text-[#FFFDF9] font-bold text-xs uppercase tracking-wider transition touch-target"
          >
            {t('helpModal.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
