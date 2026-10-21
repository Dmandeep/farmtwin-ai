import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Phone, 
  Globe, 
  Bell, 
  Ruler, 
  Shield, 
  Trash2, 
  Check, 
  Save, 
  LogOut,
  MapPin,
  Sparkles
} from 'lucide-react';
import type { FarmerProfile } from '../types';
import { api } from '../services/api';

interface ProfilePageProps {
  onRefreshFields: () => Promise<void>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onRefreshFields }) => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<FarmerProfile>({
    id: 1,
    name: 'రైతు మిత్రుడు (Farmer)',
    phone: '',
    preferred_language: (i18n.language as any) || 'te',
    preferred_unit: 'acres',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    village: '',
    alerts_weather: true,
    alerts_crop_stage: true,
    alerts_mandi: false,
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const p = await api.getProfile();
        setProfile(p);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile(profile);
      // Persist language
      if (profile.preferred_language !== i18n.language) {
        i18n.changeLanguage(profile.preferred_language);
        localStorage.setItem('farmtwin_lang', profile.preferred_language);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    if (confirm(i18n.language === 'te' 
      ? 'మీ పొలం వివరాలన్నీ తొలగించాలా? (Reset all saved fields?)' 
      : 'Reset all stored farm data? This cannot be undone.')) {
      await api.resetData();
      await onRefreshFields();
      alert(i18n.language === 'te' ? 'డేటా విజయవంతంగా తొలగించబడింది.' : 'Data reset successfully.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4 text-[#2A080C]">
      {/* Page Header */}
      <div className="pb-2 border-b border-[#E6D9C8]">
        <h2 className="font-luxury-serif text-2xl font-bold tracking-tight text-[#2A080C]">
          {t('profile.title')}
        </h2>
        <p className="text-xs text-[#5D4B45] mt-0.5">
          {t('profile.subtitle')}
        </p>
      </div>

      {/* Save Success Toast */}
      {saveSuccess && (
        <div className="p-3 bg-[#FAF6F0] border border-[#1B7340]/30 text-[#1B7340] text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{t('profile.savedSuccess')}</span>
        </div>
      )}

      {/* Main Settings Grid: 2 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Farmer Details */}
        <div className="p-5 bg-[#FFFDF9] border border-[#E6D9C8] space-y-4 shadow-2xs">
          <h3 className="font-bold text-[#2A080C] text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FAF6F0] border border-[#6B0F1A]/20 text-[#6B0F1A] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span>{t('profile.farmerDetails')}</span>
          </h3>

          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2A080C] mb-1.5">
              {t('profile.name')}
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-3 border border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] text-sm font-medium focus:outline-none focus:border-[#6B0F1A] touch-target"
            />
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2A080C] mb-1.5">
              {t('profile.phone')}
            </label>
            <input
              type="tel"
              placeholder="98XXXXXXXX"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3.5 py-3 border border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] text-sm font-medium placeholder:text-[#A89689] focus:outline-none focus:border-[#6B0F1A] touch-target"
            />
          </div>
        </div>

        {/* 2. Language Preference */}
        <div className="p-5 bg-[#FFFDF9] border border-[#E6D9C8] space-y-4 shadow-2xs">
          <h3 className="font-bold text-[#2A080C] text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FAF6F0] border border-[#6B0F1A]/20 text-[#6B0F1A] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <span>{t('profile.langSettings')}</span>
          </h3>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { code: 'te', label: 'తెలుగు', sub: 'Telugu' },
              { code: 'en', label: 'English', sub: 'English' },
              { code: 'hi', label: 'हिंदी', sub: 'Hindi' },
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setProfile({ ...profile, preferred_language: item.code as any });
                  i18n.changeLanguage(item.code);
                  localStorage.setItem('farmtwin_lang', item.code);
                }}
                className={`p-3.5 border text-center transition touch-target ${
                  profile.preferred_language === item.code
                    ? 'border-[#6B0F1A] bg-[#FFFBF5] text-[#6B0F1A] font-bold ring-1 ring-[#6B0F1A]'
                    : 'border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] hover:border-[#6B0F1A]/40'
                }`}
              >
                <span className="block text-sm font-bold">{item.label}</span>
                <span className="text-[10px] sm:text-xs text-[#5D4B45] block mt-0.5">{item.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Measurement Units */}
        <div className="p-5 bg-[#FFFDF9] border border-[#E6D9C8] space-y-4 shadow-2xs">
          <h3 className="font-bold text-[#2A080C] text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FAF6F0] border border-[#6B0F1A]/20 text-[#6B0F1A] flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <span>{t('profile.unitSettings')}</span>
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'acres', label: 'Acres (ఎకరాలు)' },
              { id: 'gunthas', label: 'Gunthas (గుంటలు)' },
              { id: 'cents', label: 'Cents (సెంట్లు)' },
              { id: 'hectares', label: 'Hectares (హెక్టార్లు)' },
            ].map((unit) => (
              <button
                key={unit.id}
                type="button"
                onClick={() => setProfile({ ...profile, preferred_unit: unit.id as any })}
                className={`p-3 border text-xs sm:text-sm font-semibold text-center transition touch-target ${
                  profile.preferred_unit === unit.id
                    ? 'border-[#6B0F1A] bg-[#FFFBF5] text-[#6B0F1A] font-bold ring-1 ring-[#6B0F1A]'
                    : 'border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] hover:border-[#6B0F1A]/40'
                }`}
              >
                {unit.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Alert Preferences */}
        <div className="p-5 bg-[#FFFDF9] border border-[#E6D9C8] space-y-4 shadow-2xs">
          <h3 className="font-bold text-[#2A080C] text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FAF6F0] border border-[#6B0F1A]/20 text-[#6B0F1A] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <span>{t('profile.notifications')}</span>
          </h3>

          <div className="space-y-2.5 text-xs sm:text-sm text-[#2A080C]">
            <label className="flex items-center justify-between p-3.5 bg-[#FAF6F0] border border-[#E6D9C8] cursor-pointer touch-target">
              <span className="font-medium">{t('profile.weatherAlerts')}</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={profile.alerts_weather}
                  onChange={(e) => setProfile({ ...profile, alerts_weather: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#D9CAB5] peer-checked:bg-[#6B0F1A] transition-colors cursor-pointer">
                  <div className={`absolute top-0.5 w-4 h-4 bg-[#FFFDF9] transition-transform ${profile.alerts_weather ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </div>
            </label>

            <label className="flex items-center justify-between p-3.5 bg-[#FAF6F0] border border-[#E6D9C8] cursor-pointer touch-target">
              <span className="font-medium">{t('profile.cropAlerts')}</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={profile.alerts_crop_stage}
                  onChange={(e) => setProfile({ ...profile, alerts_crop_stage: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#D9CAB5] peer-checked:bg-[#6B0F1A] transition-colors cursor-pointer">
                  <div className={`absolute top-0.5 w-4 h-4 bg-[#FFFDF9] transition-transform ${profile.alerts_crop_stage ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </div>
            </label>

            <label className="flex items-center justify-between p-3.5 bg-[#FAF6F0] border border-[#E6D9C8] cursor-pointer touch-target">
              <span className="font-medium">{t('profile.mandiAlerts')}</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={profile.alerts_mandi}
                  onChange={(e) => setProfile({ ...profile, alerts_mandi: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#D9CAB5] peer-checked:bg-[#6B0F1A] transition-colors cursor-pointer">
                  <div className={`absolute top-0.5 w-4 h-4 bg-[#FFFDF9] transition-transform ${profile.alerts_mandi ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-[#6B0F1A] hover:bg-[#540912] active:bg-[#40060D] text-[#FFFDF9] font-bold text-xs uppercase tracking-wider border border-[#C5A059]/40 transition touch-target flex items-center justify-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>{saving ? 'Saving...' : t('profile.saveSettings')}</span>
      </button>

      {/* 5. Data Privacy & Kiosk Reset Controls */}
      <div className="p-4 bg-[#FAF6F0] border border-[#E6D9C8] space-y-2.5">
        <h4 className="font-bold text-[#2A080C] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#7D6B64]" />
          <span>{t('profile.dataPrivacy')}</span>
        </h4>
        <p className="text-[11px] text-[#5D4B45] leading-relaxed">
          {t('profile.clearDataDesc')}
        </p>
        <button
          onClick={handleResetData}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#FFFDF9] hover:bg-[#6B0F1A] hover:text-[#FFFDF9] text-[#6B0F1A] border border-[#6B0F1A]/30 text-xs font-bold uppercase tracking-wider transition touch-target"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('profile.clearData')}</span>
        </button>
      </div>

      {/* Version Tag */}
      <div className="text-center py-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#7D6B64]">
          FARMTWIN AI v1.0 — SOVEREIGN AGRI-INTELLIGENCE
        </span>
      </div>
    </div>
  );
};
