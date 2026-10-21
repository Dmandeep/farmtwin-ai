import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  ShieldAlert, 
  CloudSun, 
  ChevronRight, 
  Droplets, 
  Sparkles, 
  CheckCircle2, 
  Info,
  MapPin,
  Plus,
  Compass
} from 'lucide-react';
import type { Field, WeatherData, TabType } from '../types';
import { api } from '../services/api';

interface HomePageProps {
  activeField: Field | null;
  onNavigateTab: (tab: TabType, initialSubTab?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ activeField, onNavigateTab }) => {
  const { t, i18n } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [latestAdvice, setLatestAdvice] = useState<any>(null);

  const district = activeField?.district || 'Guntur';

  useEffect(() => {
    let isMounted = true;
    async function loadHomeData() {
      try {
        const [wData, adviceData] = await Promise.all([
          api.getWeather(district, activeField?.latitude, activeField?.longitude),
          fetch(`/api/advice/latest?language=${i18n.language || 'te'}`).then(r => r.ok ? r.json() : null).catch(() => null)
        ]);
        if (isMounted) {
          setWeather(wData);
          setLatestAdvice(adviceData || {
            title: i18n.language === 'te' 
              ? 'పత్తిలో పూత రాలకుండా 19:19:19 పిచికారీ' 
              : 'Foliar spray 19:19:19 to prevent flower drop',
            summary: i18n.language === 'te' 
              ? 'తేమ నిలిచి ఉన్న నేలలో మొక్కలకు సూక్ష్మపోషకాలు అందేలా 5 గ్రా/లీటరు పిచికారీ చేయండి.' 
              : 'Supply essential micronutrients by foliar application of 5g/litre.'
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadHomeData();
    return () => { isMounted = false; };
  }, [district, activeField, i18n.language]);

  return (
    <div className="space-y-5 sm:space-y-6 pb-2 text-[#2A080C]">
      {/* === HERO BANNER — Full Width === */}
      <div className="bg-[#4A0810] text-[#FFFDF9] p-6 sm:p-8 lg:p-10 border border-[#C5A059]/40 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 border border-[#C5A059]/40 bg-[#340409] text-[#C5A059] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#C5A059]" />
            <span>AI-POWERED AGRICULTURE</span>
          </div>
          <h2 className="font-luxury-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-[#FFFDF9]">
            {t('home.greeting')}
          </h2>
          <p className="text-[#E8D5B5] text-sm sm:text-base lg:text-lg mt-2 max-w-2xl leading-relaxed font-normal">
            {t('home.subheading')}
          </p>
        </div>

        {/* Geometric accent — desktop only */}
        <div className="absolute right-0 top-0 bottom-0 w-32 lg:w-48 border-l border-[#C5A059]/10 pointer-events-none" />
      </div>

      {/* === 4 ACTION CARDS — Responsive Grid === */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#6B0F1A]">
            {i18n.language === 'te' ? 'తక్షణ చర్యలు & సలహాలు' : i18n.language === 'hi' ? 'त्वरित कार्य और सलाह' : 'What would you like help with?'}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Action 1: Which crop should I grow? */}
          <button
            onClick={() => onNavigateTab('advice', 'choose')}
            className="flex items-start text-left p-5 sm:p-6 bg-[#FFFDF9] border border-[#E6D9C8] hover:border-[#6B0F1A] transition-all touch-target group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FAF6F0] border border-[#6B0F1A]/20 text-[#6B0F1A] flex items-center justify-center mr-4 shrink-0 group-hover:bg-[#6B0F1A] group-hover:text-[#FFFDF9] transition-colors">
              <Sprout className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
            </div>
            <div className="flex-1">
              <h4 className="font-luxury-serif font-bold text-[#2A080C] text-lg sm:text-xl leading-snug group-hover:text-[#6B0F1A]">
                {t('home.action1Title')}
              </h4>
              <p className="text-xs sm:text-sm text-[#5D4B45] mt-1 leading-relaxed">
                {t('home.action1Desc')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#A89689] group-hover:text-[#6B0F1A] self-center ml-2 shrink-0" />
          </button>

          {/* Action 2: Help with my current crop */}
          <button
            onClick={() => onNavigateTab('advice', 'care')}
            className="flex items-start text-left p-5 sm:p-6 bg-[#FFFDF9] border border-[#E6D9C8] hover:border-[#6B0F1A] transition-all touch-target group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FAF6F0] border border-[#6B0F1A]/20 text-[#6B0F1A] flex items-center justify-center mr-4 shrink-0 group-hover:bg-[#6B0F1A] group-hover:text-[#FFFDF9] transition-colors">
              <CloudSun className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
            </div>
            <div className="flex-1">
              <h4 className="font-luxury-serif font-bold text-[#2A080C] text-lg sm:text-xl leading-snug group-hover:text-[#6B0F1A]">
                {t('home.action2Title')}
              </h4>
              <p className="text-xs sm:text-sm text-[#5D4B45] mt-1 leading-relaxed">
                {t('home.action2Desc')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#A89689] group-hover:text-[#6B0F1A] self-center ml-2 shrink-0" />
          </button>

          {/* Action 3: Something is wrong with my crop */}
          <button
            onClick={() => onNavigateTab('advice', 'problem')}
            className="flex items-start text-left p-5 sm:p-6 bg-[#FFFDF9] border border-[#E6D9C8] hover:border-[#6B0F1A] transition-all touch-target group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FAF6F0] border border-[#6B0F1A]/20 text-[#6B0F1A] flex items-center justify-center mr-4 shrink-0 group-hover:bg-[#6B0F1A] group-hover:text-[#FFFDF9] transition-colors">
              <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
            </div>
            <div className="flex-1">
              <h4 className="font-luxury-serif font-bold text-[#2A080C] text-lg sm:text-xl leading-snug group-hover:text-[#6B0F1A]">
                {t('home.action3Title')}
              </h4>
              <p className="text-xs sm:text-sm text-[#5D4B45] mt-1 leading-relaxed">
                {t('home.action3Desc')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#A89689] group-hover:text-[#6B0F1A] self-center ml-2 shrink-0" />
          </button>

          {/* Action 4: Help with soil, water or fertilizer */}
          <button
            onClick={() => onNavigateTab('advice', 'care')}
            className="flex items-start text-left p-5 sm:p-6 bg-[#FFFDF9] border border-[#E6D9C8] hover:border-[#6B0F1A] transition-all touch-target group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FAF6F0] border border-[#6B0F1A]/20 text-[#6B0F1A] flex items-center justify-center mr-4 shrink-0 group-hover:bg-[#6B0F1A] group-hover:text-[#FFFDF9] transition-colors">
              <Droplets className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
            </div>
            <div className="flex-1">
              <h4 className="font-luxury-serif font-bold text-[#2A080C] text-lg sm:text-xl leading-snug group-hover:text-[#6B0F1A]">
                {t('home.action4Title')}
              </h4>
              <p className="text-xs sm:text-sm text-[#5D4B45] mt-1 leading-relaxed">
                {t('home.action4Desc')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#A89689] group-hover:text-[#6B0F1A] self-center ml-2 shrink-0" />
          </button>
        </div>
      </div>

      {/* === WEATHER + FIELD — Desktop side-by-side, Mobile stacked === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Weather Card */}
        {weather && (
          <div className="p-5 sm:p-6 bg-[#FFFDF9] border border-[#E6D9C8]">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#E6D9C8]">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-[#6B0F1A]" />
                <span className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#2A080C]">
                  {weather.district} — {weather.temperature}°C
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 border border-[#6B0F1A]/30 bg-[#FAF6F0] text-[#6B0F1A]">
                {weather.spray_condition === 'ideal' ? '🌿 SPRAY OK' : '⚠️ CAUTION'}
              </span>
            </div>

            <p className="text-sm text-[#5D4B45] leading-relaxed font-medium">
              {weather.spray_message}
            </p>

            <div className="mt-4 pt-3 border-t border-[#E6D9C8] grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-[#FAF6F0] border border-[#E6D9C8]/60">
                <span className="block text-[10px] sm:text-[11px] uppercase tracking-widest text-[#7D6B64] font-semibold">{t('weather.humidity')}</span>
                <span className="font-mono font-bold text-[#2A080C] text-base sm:text-lg">{weather.humidity}%</span>
              </div>
              <div className="p-2.5 bg-[#FAF6F0] border border-[#E6D9C8]/60">
                <span className="block text-[10px] sm:text-[11px] uppercase tracking-widest text-[#7D6B64] font-semibold">{t('weather.rainChance')}</span>
                <span className="font-mono font-bold text-[#2A080C] text-base sm:text-lg">{weather.rain_chance}%</span>
              </div>
              <div className="p-2.5 bg-[#FAF6F0] border border-[#E6D9C8]/60">
                <span className="block text-[10px] sm:text-[11px] uppercase tracking-widest text-[#7D6B64] font-semibold">{t('weather.wind')}</span>
                <span className="font-mono font-bold text-[#2A080C] text-base sm:text-lg">{weather.wind_speed} km/h</span>
              </div>
            </div>
          </div>
        )}

        {/* Active Field Summary Card */}
        <div className="p-5 sm:p-6 bg-[#FFFDF9] border border-[#E6D9C8]">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#E6D9C8]">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#6B0F1A]" />
              <h3 className="font-luxury-serif font-bold text-lg sm:text-xl text-[#2A080C]">
                {t('home.activeField')}
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('land')}
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#6B0F1A] hover:underline flex items-center space-x-0.5 touch-target"
            >
              <span>{t('home.switchField')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {activeField ? (
            <div className="p-4 sm:p-5 bg-[#FAF6F0] border border-[#E6D9C8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-luxury-serif font-bold text-xl sm:text-2xl text-[#2A080C]">
                  {activeField.name}
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold px-3 py-1 bg-[#6B0F1A] text-[#FFFDF9]">
                  {activeField.size}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="px-3 py-1.5 bg-[#FFFDF9] border border-[#E6D9C8] font-medium text-[#2A080C]">
                  {activeField.district}, {activeField.state}
                </span>
                <span className="px-3 py-1.5 bg-[#FFFDF9] border border-[#E6D9C8] capitalize font-medium text-[#2A080C]">
                  {activeField.soil_type} Soil
                </span>
                <span className="px-3 py-1.5 bg-[#FFFDF9] border border-[#E6D9C8] capitalize font-medium text-[#2A080C]">
                  {activeField.water_source}
                </span>
                {activeField.current_crop && (
                  <span className="px-3 py-1.5 bg-[#6B0F1A]/10 border border-[#6B0F1A]/30 text-[#6B0F1A] font-bold">
                    {activeField.current_crop}
                  </span>
                )}
              </div>

              {/* Data transparency */}
              <div className="pt-3 border-t border-[#E6D9C8] flex items-center space-x-3 text-[10px] sm:text-xs text-[#5D4B45] font-mono uppercase tracking-wider">
                <span className="inline-flex items-center space-x-1 text-[#6B0F1A] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6B0F1A]" />
                  <span>{t('home.farmerReported')}</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center space-x-1 text-[#7D6B64] font-medium">
                  <Info className="w-3.5 h-3.5" />
                  <span>OPEN-METEO {t('home.measured')}</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-10 px-4 bg-[#FAF6F0] border border-dashed border-[#D9CAB5]">
              <Sprout className="w-10 h-10 sm:w-12 sm:h-12 text-[#A89689] mx-auto mb-3" />
              <h4 className="font-luxury-serif font-bold text-[#2A080C] text-lg sm:text-xl">{t('home.noFieldTitle')}</h4>
              <p className="text-sm text-[#5D4B45] mt-1 max-w-sm mx-auto">
                {t('home.noFieldDesc')}
              </p>
              <button
                onClick={() => onNavigateTab('land')}
                className="mt-4 inline-flex items-center space-x-2 px-5 py-3 bg-[#6B0F1A] hover:bg-[#540912] text-[#FFFDF9] font-bold text-sm uppercase tracking-wider border border-[#C5A059]/40 touch-target"
              >
                <Plus className="w-5 h-5" />
                <span>{t('home.addFieldBtn')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* === LATEST ADVICE SHORTCUT === */}
      {latestAdvice && (
        <div 
          onClick={() => onNavigateTab('advice', 'care')}
          className="p-5 sm:p-6 bg-[#FFFDF9] border border-[#E6D9C8] hover:border-[#6B0F1A] cursor-pointer transition touch-target"
        >
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#6B0F1A] mb-2 pb-2 border-b border-[#E6D9C8]">
            <span className="flex items-center space-x-1.5 uppercase tracking-widest text-[11px] sm:text-xs">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>{t('home.latestAdviceTitle')}</span>
            </span>
            <span className="text-xs uppercase tracking-wider text-[#7D6B64] flex items-center">
              {t('home.readMore')} <ChevronRight className="w-4 h-4 ml-0.5" />
            </span>
          </div>
          <h4 className="font-luxury-serif font-bold text-[#2A080C] text-lg sm:text-xl leading-snug">
            {latestAdvice.title}
          </h4>
          <p className="text-sm text-[#5D4B45] mt-1.5 line-clamp-2 leading-relaxed">
            {latestAdvice.summary}
          </p>
        </div>
      )}
    </div>
  );
};
