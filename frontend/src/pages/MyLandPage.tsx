import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  Droplets, 
  CheckCircle, 
  Trash2, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Info, 
  CloudRain,
  Star
} from 'lucide-react';
import type { Field } from '../types';
import { api } from '../services/api';
import { SoilCardSelector } from '../components/SoilCardSelector';

interface MyLandPageProps {
  fields: Field[];
  activeField: Field | null;
  onRefreshFields: () => Promise<void>;
  onSetActiveField: (fieldId: number) => Promise<void>;
}

export const MyLandPage: React.FC<MyLandPageProps> = ({
  fields,
  activeField,
  onRefreshFields,
  onSetActiveField,
}) => {
  const { t, i18n } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    village: '',
    size: '1 – 2 Acres',
    soil_type: 'black',
    water_source: 'borewell',
    assistance_needed: 'choose_crop',
    current_crop: 'Cotton'
  });

  const statesAndDistricts: Record<string, string[]> = {
    'Andhra Pradesh': ['Guntur', 'Krishna', 'Kurnool', 'Anantapur', 'Prakasam', 'East Godavari', 'West Godavari', 'Chittoor', 'Kadapa', 'Nellore', 'Visakhapatnam'],
    'Telangana': ['Warangal', 'Khammam', 'Karimnagar', 'Nalgonda', 'Nizamabad', 'Mahbubnagar', 'Adilabad', 'Medak', 'Hyderabad'],
    'Karnataka': ['Raichur', 'Bellary', 'Koppal', 'Gulbarga', 'Belgaum'],
    'Maharashtra': ['Nagpur', 'Amravati', 'Yavatmal', 'Akola', 'Nanded']
  };

  const landSizes = [
    { id: 'Less than 1 Acre', labelKey: 'land.sizeLess1' },
    { id: '1 – 2 Acres', labelKey: 'land.size1to2' },
    { id: '2 – 5 Acres', labelKey: 'land.size2to5' },
    { id: '5 – 10 Acres', labelKey: 'land.size5to10' },
    { id: 'More than 10 Acres', labelKey: 'land.sizeMore10' },
  ];

  const waterSources = [
    { id: 'rain', titleKey: 'land.waterRain', descKey: 'land.waterRainDesc', icon: CloudRain },
    { id: 'borewell', titleKey: 'land.waterBorewell', descKey: 'land.waterBorewellDesc', icon: Droplets },
    { id: 'canal', titleKey: 'land.waterCanal', descKey: 'land.waterCanalDesc', icon: Droplets },
    { id: 'well', titleKey: 'land.waterWell', descKey: 'land.waterWellDesc', icon: Droplets },
    { id: 'drip', titleKey: 'land.waterDrip', descKey: 'land.waterDripDesc', icon: Droplets },
  ];

  const assistanceOptions = [
    { id: 'choose_crop', titleKey: 'land.goalChoose' },
    { id: 'crop_care', titleKey: 'land.goalCare' },
    { id: 'problem', titleKey: 'land.goalProblem' },
    { id: 'soil_advice', titleKey: 'land.goalSoil' },
  ];

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSaveField();
    }
  };

  const handleSaveField = async () => {
    setSubmitting(true);
    try {
      const fieldNameToSave = formData.name.trim() || 
        `${formData.district} ${formData.soil_type.toUpperCase()} Plot (${formData.size})`;

      await api.createField({
        name: fieldNameToSave,
        state: formData.state,
        district: formData.district,
        village: formData.village,
        size: formData.size,
        soil_type: formData.soil_type,
        water_source: formData.water_source,
        assistance_needed: formData.assistance_needed,
        current_crop: formData.current_crop,
        soil_source: 'farmer_reported',
        water_source_type: 'farmer_reported',
        npk_status: 'not_yet_known',
        is_active: true
      });

      await onRefreshFields();
      setIsAdding(false);
      setCurrentStep(1);
    } catch (e) {
      console.error(e);
      alert('Could not save field details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(i18n.language === 'te' ? 'ఈ పొలం వివరాలను తొలగించాలా?' : 'Are you sure you want to remove this field?')) {
      await api.deleteField(id);
      await onRefreshFields();
    }
  };

  return (
    <div className="space-y-4 text-[#2A080C]">
      {/* Page Title & Add Button */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E6D9C8]">
        <div>
          <h2 className="font-luxury-serif text-2xl font-bold tracking-tight text-[#2A080C]">
            {t('land.title')}
          </h2>
          <p className="text-xs text-[#5D4B45]">
            {t('land.subtitle')}
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => { setIsAdding(true); setCurrentStep(1); }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#6B0F1A] hover:bg-[#540912] text-[#FFFDF9] font-bold text-xs uppercase tracking-wider border border-[#C5A059]/40 touch-target"
          >
            <Plus className="w-4 h-4" />
            <span>{t('land.addNewBtn')}</span>
          </button>
        )}
      </div>

      {/* Multi-Step Wizard: Zero-Slope Luxury Card */}
      {isAdding && (
        <div className="bg-[#FFFDF9] border-2 border-[#6B0F1A] p-5 space-y-4 shadow-lg animate-in fade-in">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E6D9C8]">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#6B0F1A] uppercase tracking-[0.2em]">
                {t('land.step')} {currentStep} {t('land.of')} 5
              </span>
              <h3 className="font-luxury-serif font-bold text-[#2A080C] text-lg">
                {currentStep === 1 && t('land.step1Title')}
                {currentStep === 2 && t('land.step2Title')}
                {currentStep === 3 && t('land.step3Title')}
                {currentStep === 4 && t('land.step4Title')}
                {currentStep === 5 && t('land.step5Title')}
              </h3>
            </div>
            <button
              onClick={() => setIsAdding(false)}
              className="text-[#7D6B64] hover:text-[#2A080C] text-xs font-semibold px-2 py-1 uppercase tracking-wider"
            >
              {t('land.cancel')}
            </button>
          </div>

          {/* Step 1: Farm Location */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-[#5D4B45]">{t('land.step1Desc')}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2A080C] mb-1.5">
                    {t('land.stateLabel')}
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      const districts = statesAndDistricts[newState] || ['Guntur'];
                      setFormData({ ...formData, state: newState, district: districts[0] });
                    }}
                    className="w-full px-3.5 py-3 border border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] text-sm font-medium focus:outline-none focus:border-[#6B0F1A] touch-target"
                  >
                    {Object.keys(statesAndDistricts).map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2A080C] mb-1.5">
                    {t('land.districtLabel')}
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-3 border border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] text-sm font-medium focus:outline-none focus:border-[#6B0F1A] touch-target"
                  >
                    {(statesAndDistricts[formData.state] || []).map((dt) => (
                      <option key={dt} value={dt}>{dt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2A080C] mb-1.5">
                    {t('land.villageLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('land.villagePlaceholder')}
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3.5 py-3 border border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] text-sm placeholder:text-[#A89689] focus:outline-none focus:border-[#6B0F1A] touch-target"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2A080C] mb-1.5">
                    {t('land.fieldName')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('land.fieldNamePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-3 border border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] text-sm placeholder:text-[#A89689] focus:outline-none focus:border-[#6B0F1A] touch-target"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Land Size */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-[#5D4B45]">{t('land.step2Desc')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {landSizes.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, size: size.id })}
                    className={`w-full flex items-center justify-between p-3.5 sm:p-4 border text-left font-bold text-sm transition touch-target ${
                      formData.size === size.id
                        ? 'border-[#6B0F1A] bg-[#FFFBF5] text-[#6B0F1A] ring-1 ring-[#6B0F1A]'
                        : 'border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] hover:border-[#6B0F1A]/40'
                    }`}
                  >
                    <span>{t(size.labelKey)}</span>
                    {formData.size === size.id && <Check className="w-4 h-4 text-[#6B0F1A]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Soil Type with Visual Cards */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-[#5D4B45]">{t('land.step3Desc')}</p>
              <SoilCardSelector
                selectedSoil={formData.soil_type}
                onChange={(s) => setFormData({ ...formData, soil_type: s })}
              />
            </div>
          )}

          {/* Step 4: Water Source */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-[#5D4B45]">{t('land.step4Desc')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {waterSources.map((ws) => (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, water_source: ws.id })}
                    className={`w-full flex items-start p-3.5 sm:p-4 border text-left transition touch-target ${
                      formData.water_source === ws.id
                        ? 'border-[#6B0F1A] bg-[#FFFBF5] ring-1 ring-[#6B0F1A]'
                        : 'border-[#E6D9C8] bg-[#FAF6F0] hover:border-[#6B0F1A]/40'
                    }`}
                  >
                    <div className="p-2 border border-[#6B0F1A]/20 bg-[#FFFDF9] text-[#6B0F1A] mr-3 mt-0.5 shrink-0">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[#2A080C] text-sm">
                        {t(ws.titleKey)}
                      </div>
                      <div className="text-xs text-[#5D4B45] mt-0.5">
                        {t(ws.descKey)}
                      </div>
                    </div>
                    {formData.water_source === ws.id && (
                      <Check className="w-4 h-4 text-[#6B0F1A] ml-2 self-center shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Primary Assistance Needed */}
          {currentStep === 5 && (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-[#5D4B45]">{t('land.step5Desc')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {assistanceOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, assistance_needed: opt.id })}
                    className={`w-full flex items-center justify-between p-3.5 sm:p-4 border text-left font-bold text-sm transition touch-target ${
                      formData.assistance_needed === opt.id
                        ? 'border-[#6B0F1A] bg-[#FFFBF5] text-[#6B0F1A] ring-1 ring-[#6B0F1A]'
                        : 'border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] hover:border-[#6B0F1A]/40'
                    }`}
                  >
                    <span>{t(opt.titleKey)}</span>
                    {formData.assistance_needed === opt.id && <Check className="w-4 h-4 text-[#6B0F1A]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-3 border-t border-[#E6D9C8] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2.5 border border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] font-bold text-xs uppercase tracking-wider flex items-center space-x-1 touch-target hover:bg-[#FFFDF9]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('land.prev')}</span>
              </button>
            ) : <div />}

            <button
              type="button"
              disabled={submitting}
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-[#6B0F1A] hover:bg-[#540912] text-[#FFFDF9] font-bold text-xs uppercase tracking-wider border border-[#C5A059]/40 flex items-center space-x-1.5 touch-target"
            >
              <span>{currentStep === 5 ? t('land.saveField') : t('land.next')}</span>
              {currentStep < 5 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Saved Fields Directory */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-[#6B0F1A] uppercase tracking-[0.2em] px-1">
          {t('land.savedFields')} ({fields.length})
        </h3>

        {fields.length === 0 ? (
          <div className="p-8 sm:p-12 bg-[#FFFDF9] border border-dashed border-[#D9CAB5] text-center space-y-2">
            <Sprout className="w-10 h-10 text-[#A89689] mx-auto" />
            <p className="text-sm sm:text-base font-bold text-[#2A080C]">{t('land.noFieldsYet')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((f) => {
              const isActive = activeField?.id === f.id;
              return (
                <div
                  key={f.id}
                  className={`p-4 border bg-[#FFFDF9] transition-all shadow-2xs ${
                    isActive ? 'border-[#6B0F1A] ring-1 ring-[#6B0F1A]' : 'border-[#E6D9C8]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-luxury-serif font-bold text-lg text-[#2A080C]">
                          {f.name}
                        </h4>
                        {isActive && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#6B0F1A] text-[#FFFDF9]">
                            <Star className="w-3 h-3 fill-[#FFFDF9]" />
                            <span>{t('land.active')}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5D4B45] mt-0.5">
                        {f.district}, {f.state} {f.village ? `• ${f.village}` : ''}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(f.id)}
                      className="p-2 text-[#A89689] hover:text-[#6B0F1A] hover:bg-[#FAF6F0] transition touch-target"
                      aria-label={t('land.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-[#FAF6F0] border border-[#E6D9C8] font-bold text-[#2A080C]">
                      {f.size}
                    </span>
                    <span className="px-2.5 py-1 bg-[#FAF6F0] border border-[#E6D9C8] capitalize font-medium text-[#2A080C]">
                      {f.soil_type} Soil
                    </span>
                    <span className="px-2.5 py-1 bg-[#FAF6F0] border border-[#E6D9C8] capitalize font-medium text-[#2A080C]">
                      {f.water_source}
                    </span>
                  </div>

                  {/* Transparency Meta Badges */}
                  <div className="mt-3 pt-2.5 border-t border-[#E6D9C8] flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase font-mono tracking-wider">
                    <div className="flex items-center space-x-2 text-[#5D4B45]">
                      <span className="inline-flex items-center space-x-1 text-[#6B0F1A] font-bold">
                        <CheckCircle className="w-3 h-3" />
                        <span>{t('land.dataTagReported')}</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center space-x-1 text-[#7D6B64]">
                        <Info className="w-3 h-3" />
                        <span>NPK: {t('land.dataTagUnknown')}</span>
                      </span>
                    </div>

                    {!isActive && (
                      <button
                        onClick={() => onSetActiveField(f.id)}
                        className="text-xs font-bold text-[#6B0F1A] hover:underline touch-target"
                      >
                        {t('land.makeActive')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
