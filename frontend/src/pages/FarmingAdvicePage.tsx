import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  AlertOctagon, 
  ChevronRight,
  ShieldCheck,
  CloudSun
} from 'lucide-react';
import type { Field, CropRecommendation } from '../types';
import { api } from '../services/api';

interface FarmingAdvicePageProps {
  activeField: Field | null;
  initialSubTab?: string;
}

export const FarmingAdvicePage: React.FC<FarmingAdvicePageProps> = ({
  activeField,
  initialSubTab = 'choose',
}) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'choose' | 'care' | 'problem'>(
    (initialSubTab as any) || 'choose'
  );

  // Mode 1: Choosing a Crop State
  const [crops, setCrops] = useState<CropRecommendation[]>([]);
  const [loadingCrops, setLoadingCrops] = useState(false);

  // Mode 2: Crop Care State
  const [selectedCrop, setSelectedCrop] = useState(activeField?.current_crop || 'Cotton (పత్తి)');
  const [selectedStage, setSelectedStage] = useState(activeField?.crop_stage || 'vegetative');
  const [carePlan, setCarePlan] = useState<any>(null);

  // Mode 3: Problem Diagnosis State
  const [selectedSymptom, setSelectedSymptom] = useState('symYellow');
  const [customDesc, setCustomDesc] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);

  const lang = (i18n.language || 'te') as 'te' | 'en' | 'hi';

  useEffect(() => {
    if (activeTab === 'choose') {
      loadCropRecommendations();
    } else if (activeTab === 'care') {
      loadCarePlan();
    }
  }, [activeTab, activeField, lang]);

  const loadCropRecommendations = async () => {
    setLoadingCrops(true);
    try {
      const res = await api.getRecommendedCrops({
        soil_type: activeField?.soil_type || 'black',
        water_source: activeField?.water_source || 'borewell',
        district: activeField?.district || 'Guntur',
        language: lang
      });
      setCrops(res.crops || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCrops(false);
    }
  };

  const loadCarePlan = async () => {
    try {
      const plan = await api.getCropCare(
        selectedCrop,
        selectedStage,
        activeField?.district || 'Guntur',
        lang
      );
      setCarePlan(plan);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDiagnose = async () => {
    setLoadingDiagnosis(true);
    try {
      const formData = new FormData();
      formData.append('crop_name', selectedCrop);
      formData.append('symptoms', selectedSymptom);
      formData.append('custom_desc', customDesc);
      formData.append('district', activeField?.district || 'Guntur');
      formData.append('language', lang);

      const result = await api.diagnoseCrop(formData);
      setDiagnosisResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  const symptomsList = [
    { id: 'symYellow', labelKey: 'advice.symYellow' },
    { id: 'symHoles', labelKey: 'advice.symHoles' },
    { id: 'symSpots', labelKey: 'advice.symSpots' },
    { id: 'symWilt', labelKey: 'advice.symWilt' },
    { id: 'symFruitDrop', labelKey: 'advice.symFruitDrop' },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-[#2A080C]">
      {/* Header Info */}
      <div className="pb-3 border-b border-[#E6D9C8]">
        <h2 className="font-luxury-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#2A080C]">
          {t('advice.title')}
        </h2>
        <p className="text-xs sm:text-sm text-[#5D4B45] mt-1">
          {t('advice.subtitle')}
        </p>
      </div>

      {/* Active Field Banner */}
      {activeField ? (
        <div className="flex items-center justify-between px-4 py-3 bg-[#FFFDF9] border border-[#E6D9C8] text-xs sm:text-sm">
          <span className="font-medium text-[#5D4B45]">
            {t('advice.activeFieldBanner')} <span className="font-bold text-[#6B0F1A]">{activeField.name}</span> ({activeField.soil_type} soil • {activeField.water_source})
          </span>
        </div>
      ) : (
        <div className="p-4 bg-[#FFFDF9] border border-[#E6D9C8] text-sm text-[#6B0F1A] font-medium">
          {t('advice.noFieldWarning')}
        </div>
      )}

      {/* 3 Main Advisory Segmented Zero-Slope Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1.5 bg-[#EFE6D8] border border-[#E6D9C8]">
        <button
          onClick={() => setActiveTab('choose')}
          className={`py-3 sm:py-3.5 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all touch-target ${
            activeTab === 'choose'
              ? 'bg-[#6B0F1A] text-[#FFFDF9]'
              : 'text-[#5D4B45] hover:text-[#2A080C]'
          }`}
        >
          {t('advice.tabChoose')}
        </button>
        <button
          onClick={() => setActiveTab('care')}
          className={`py-3 sm:py-3.5 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all touch-target ${
            activeTab === 'care'
              ? 'bg-[#6B0F1A] text-[#FFFDF9]'
              : 'text-[#5D4B45] hover:text-[#2A080C]'
          }`}
        >
          {t('advice.tabCare')}
        </button>
        <button
          onClick={() => setActiveTab('problem')}
          className={`py-3 sm:py-3.5 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all touch-target ${
            activeTab === 'problem'
              ? 'bg-[#6B0F1A] text-[#FFFDF9]'
              : 'text-[#5D4B45] hover:text-[#2A080C]'
          }`}
        >
          {t('advice.tabProblem')}
        </button>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: CHOOSING A CROP */}
      {/* ========================================================= */}
      {activeTab === 'choose' && (
        <div className="space-y-3 animate-in fade-in">
          <div>
            <h3 className="font-luxury-serif font-bold text-[#2A080C] text-lg">
              {t('advice.chooseHeading')}
            </h3>
            <p className="text-xs text-[#5D4B45]">
              {t('advice.chooseDesc')}
            </p>
          </div>

          {loadingCrops ? (
            <div className="py-12 text-center text-xs sm:text-sm text-[#7D6B64] font-mono uppercase tracking-widest">
              Synthesizing agronomical recommendations...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crops.map((crop) => {
                const name = lang === 'te' ? crop.name_te : lang === 'hi' ? crop.name_hi : crop.name_en;
                const reason = lang === 'te' ? crop.suitability_reason_te : lang === 'hi' ? crop.suitability_reason_hi : crop.suitability_reason_en;
                const conditions = lang === 'te' ? crop.conditions_te : lang === 'hi' ? crop.conditions_hi : crop.conditions_en;
                const risks = lang === 'te' ? crop.risks_te : lang === 'hi' ? crop.risks_hi : crop.risks_en;

                return (
                  <div key={crop.id} className="p-4 bg-[#FFFDF9] border border-[#E6D9C8] shadow-2xs space-y-3">
                    <div className="flex items-start justify-between pb-2 border-b border-[#E6D9C8]">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 bg-[#FAF6F0] border border-[#6B0F1A]/20 text-[#6B0F1A] flex items-center justify-center">
                          <Sprout className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-luxury-serif font-bold text-[#2A080C] text-lg leading-tight">
                            {name}
                          </h4>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B0F1A]">
                            {crop.season}
                          </span>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <span className="block text-[10px] text-[#7D6B64] uppercase tracking-wider">{t('advice.duration')}</span>
                        <span className="font-mono font-bold text-[#2A080C]">{crop.duration_days}</span>
                      </div>
                    </div>

                    {/* Suitability */}
                    <div className="p-3 bg-[#FAF6F0] border border-[#E6D9C8] space-y-1">
                      <span className="text-[10px] font-bold text-[#6B0F1A] uppercase tracking-widest flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t('advice.suitability')}
                      </span>
                      <p className="text-xs text-[#2A080C] leading-relaxed font-medium">
                        {reason}
                      </p>
                    </div>

                    {/* Conditions */}
                    <div className="space-y-1 text-xs">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-[#2A080C] block">
                        🌱 {t('advice.conditions')}:
                      </span>
                      <p className="text-[#5D4B45] leading-relaxed">
                        {conditions}
                      </p>
                    </div>

                    {/* Potential Risks */}
                    <div className="p-3 bg-[#FFFBF5] border border-[#6B0F1A]/25 text-xs space-y-0.5">
                      <span className="font-bold text-[#6B0F1A] uppercase tracking-wider text-[10px] flex items-center gap-1 font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {t('advice.risks')}:
                      </span>
                      <p className="text-[#5D4B45] leading-relaxed">
                        {risks}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-[#E6D9C8] flex items-center justify-between text-[10px] text-[#7D6B64] font-mono uppercase tracking-wider">
                      <span>ANGRAU / PJTSAU ADVISORY</span>
                      <button
                        onClick={() => {
                          setSelectedCrop(name);
                          setActiveTab('care');
                        }}
                        className="font-bold text-[#6B0F1A] hover:underline flex items-center space-x-1"
                      >
                        <span>Select this crop</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: CURRENT CROP CARE */}
      {/* ========================================================= */}
      {activeTab === 'care' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-in fade-in">
          {/* Selectors for Crop and Stage */}
          <div className="lg:col-span-4 p-5 bg-[#FFFDF9] border border-[#E6D9C8] space-y-4 shadow-2xs">
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2A080C] mb-1.5">
                {t('advice.selectCrop')}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3.5 py-3 border border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] text-sm font-semibold focus:outline-none focus:border-[#6B0F1A] touch-target"
              >
                <option value="Cotton (పత్తి)">Cotton (పత్తి / कपास)</option>
                <option value="Chilli (మిరప)">Chilli (మిరప / मिर्च)</option>
                <option value="Paddy (వరి)">Paddy (వరి / धान)</option>
                <option value="Groundnut (వేరుశనగ)">Groundnut (వేరుశనగ / मूंगफली)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2A080C] mb-1.5">
                {t('advice.selectStage')}
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full px-3.5 py-3 border border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] text-sm font-semibold focus:outline-none focus:border-[#6B0F1A] touch-target"
              >
                <option value="sowing">{t('advice.stageSowing')}</option>
                <option value="vegetative">{t('advice.stageVeg')}</option>
                <option value="flowering">{t('advice.stageFlower')}</option>
                <option value="fruiting">{t('advice.stageFruit')}</option>
                <option value="maturity">{t('advice.stageMaturity')}</option>
              </select>
            </div>

            <button
              onClick={loadCarePlan}
              className="w-full py-3 bg-[#6B0F1A] hover:bg-[#540912] text-[#FFFDF9] font-bold text-xs sm:text-sm uppercase tracking-wider border border-[#C5A059]/40 touch-target transition"
            >
              {t('advice.getCarePlanBtn')}
            </button>
          </div>

          {/* Care Plan Output */}
          <div className="lg:col-span-8">
            {carePlan && (
              <div className="p-5 sm:p-6 bg-[#FFFDF9] border border-[#E6D9C8] shadow-2xs space-y-4">
              <div className="border-b border-[#E6D9C8] pb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#6B0F1A] text-[#FFFDF9] uppercase tracking-wider">
                  EXECUTION PROTOCOL
                </span>
                <h4 className="font-luxury-serif font-bold text-[#2A080C] text-xl mt-2">
                  {carePlan.title}
                </h4>
              </div>

              {/* Weather Synced Task Card */}
              {carePlan.weather_sync && (
                <div className="p-3 bg-[#FAF6F0] border border-[#E6D9C8] text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-[#6B0F1A] uppercase tracking-wider text-[10px] font-mono">
                    <CloudSun className="w-4 h-4" />
                    <span>Atmospheric Sync: Rain probability {carePlan.weather_sync.rain_chance}%</span>
                  </div>
                  <p className="text-[#5D4B45] leading-relaxed font-medium">
                    {carePlan.weather_sync.spray_message}
                  </p>
                </div>
              )}

              {/* Practical Steps Checklist */}
              <div>
                <h5 className="font-bold text-[#2A080C] text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#6B0F1A]" />
                  <span>{t('advice.whatToDo')}</span>
                </h5>
                <ul className="space-y-2 text-xs text-[#2A080C]">
                  {carePlan.practical_steps.map((st: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-3 p-3 bg-[#FAF6F0] border border-[#E6D9C8]">
                      <span className="w-5 h-5 bg-[#6B0F1A] text-[#FFFDF9] text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cautionary Notes */}
              {carePlan.cautions && (
                <div className="p-3 bg-[#FFFBF5] border border-[#6B0F1A]/25 text-xs space-y-1">
                  <h5 className="font-bold text-[#6B0F1A] uppercase tracking-wider text-[10px] font-mono flex items-center gap-1">
                    <AlertOctagon className="w-4 h-4" />
                    <span>{t('advice.cautions')}</span>
                  </h5>
                  <ul className="list-disc list-inside text-[#5D4B45] space-y-0.5">
                    {carePlan.cautions.map((c: string, idx: number) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sources */}
              <div className="pt-2 border-t border-[#E6D9C8] text-[10px] text-[#7D6B64] font-mono uppercase tracking-wider space-y-0.5">
                <span className="font-bold block text-[#2A080C]">{t('advice.sources')}:</span>
                <p>ANGRAU & PJTSAU University Package of Practices (2025-26)</p>
              </div>
            </div>
          )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 3: CROP PROBLEM REMEDY */}
      {/* ========================================================= */}
      {activeTab === 'problem' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-in fade-in">
          <div className="lg:col-span-5 p-5 bg-[#FFFDF9] border border-[#E6D9C8] space-y-4 shadow-2xs">
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2A080C] mb-2">
                {t('advice.selectSymptom')}
              </label>
              <div className="space-y-1.5">
                {symptomsList.map((sym) => (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => setSelectedSymptom(sym.id)}
                    className={`w-full text-left p-3 border text-xs font-bold transition touch-target flex items-center justify-between ${
                      selectedSymptom === sym.id
                        ? 'border-[#6B0F1A] bg-[#FFFBF5] text-[#6B0F1A] ring-1 ring-[#6B0F1A]'
                        : 'border-[#E6D9C8] bg-[#FAF6F0] text-[#2A080C] hover:border-[#6B0F1A]/40'
                    }`}
                  >
                    <span>{t(sym.labelKey)}</span>
                    {selectedSymptom === sym.id && <CheckCircle2 className="w-4 h-4 text-[#6B0F1A] shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2A080C] mb-1">
                {t('advice.customSymptom')}
              </label>
              <textarea
                rows={2}
                placeholder="ఉదా: ఆకుల అడుగున తెల్లటి చిన్న పురుగులు ఉన్నాయి..."
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                className="w-full px-3 py-2 border border-[#E6D9C8] bg-[#FAF6F0] text-xs focus:outline-none focus:border-[#6B0F1A]"
              />
            </div>

            <button
              onClick={handleDiagnose}
              disabled={loadingDiagnosis}
              className="w-full py-2.5 bg-[#6B0F1A] hover:bg-[#540912] active:bg-[#40060D] text-[#FFFDF9] font-bold text-xs uppercase tracking-wider border border-[#C5A059]/40 touch-target flex items-center justify-center space-x-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loadingDiagnosis ? 'Diagnosing...' : t('advice.diagnoseBtn')}</span>
            </button>
          </div>

          {/* Diagnosis Report Output adhering to: What to do, Why, Caution, Sources */}
          <div className="lg:col-span-7">
            {diagnosisResult ? (
              <div className="p-5 sm:p-6 bg-[#FFFDF9] border-2 border-[#6B0F1A] space-y-4 animate-in fade-in shadow-sm">
                <div className="border-b border-[#E6D9C8] pb-2.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#6B0F1A] text-[#FFFDF9] uppercase tracking-wider">
                    CLINICAL DIAGNOSIS REPORT
                  </span>
                  <h4 className="font-luxury-serif font-bold text-[#2A080C] text-xl sm:text-2xl mt-1.5">
                    {diagnosisResult.title || diagnosisResult.short_answer}
                  </h4>
                </div>

                {/* 1. What to Do (Immediate Action) */}
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#6B0F1A] mb-2 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('advice.whatToDo')}</span>
                  </h5>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#2A080C]">
                    {(diagnosisResult.practical_steps || []).map((step: string, idx: number) => (
                      <li key={idx} className="p-3 bg-[#FAF6F0] border border-[#E6D9C8] flex items-start space-x-2.5">
                        <span className="font-bold text-[#6B0F1A] shrink-0 font-mono">[{idx + 1}]</span>
                        <span className="font-medium leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Why this happens */}
                {diagnosisResult.why && (
                  <div className="p-3.5 bg-[#FAF6F0] border border-[#E6D9C8] text-xs sm:text-sm space-y-1">
                    <h5 className="font-bold text-[#2A080C] text-[10px] sm:text-xs uppercase tracking-wider font-mono flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-[#6B0F1A]" />
                      <span>{t('advice.why')}</span>
                    </h5>
                    <p className="text-[#5D4B45] leading-relaxed font-medium">
                      {diagnosisResult.why}
                    </p>
                  </div>
                )}

                {/* 3. Cautionary Notes */}
                {(diagnosisResult.cautions || []).length > 0 && (
                  <div className="p-3.5 bg-[#FFFBF5] border border-[#6B0F1A]/25 text-xs sm:text-sm space-y-1">
                    <h5 className="font-bold text-[#6B0F1A] uppercase tracking-wider text-[10px] sm:text-xs font-mono flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t('advice.cautions')}</span>
                    </h5>
                    <ul className="list-disc list-inside text-[#5D4B45] space-y-0.5">
                      {diagnosisResult.cautions.map((c: string, idx: number) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 4. Sources */}
                <div className="pt-2 border-t border-[#E6D9C8] text-[10px] sm:text-xs text-[#7D6B64] font-mono uppercase tracking-wider">
                  <span className="font-bold block text-[#2A080C]">{t('advice.sources')}:</span>
                  <p>ANGRAU & PJTSAU Vyavasaya Panchangam / ICAR Plant Protection Bulletin</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-[#FFFDF9] border border-[#E6D9C8] text-[#5D4B45]">
                <p className="text-sm">Select symptoms and click "Get Diagnosis" to view expert remedies.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
