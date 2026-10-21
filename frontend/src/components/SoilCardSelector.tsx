import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

interface SoilOption {
  id: string;
  swatchColor: string;
  titleKey: string;
  descKey: string;
  characteristics: string;
  code: string;
}

interface SoilCardSelectorProps {
  selectedSoil: string;
  onChange: (soilId: string) => void;
}

export const SoilCardSelector: React.FC<SoilCardSelectorProps> = ({ selectedSoil, onChange }) => {
  const { t } = useTranslation();

  const soils: SoilOption[] = [
    {
      id: 'red',
      swatchColor: 'bg-[#9E3D24]',
      titleKey: 'land.soilRed',
      descKey: 'land.soilRedDesc',
      characteristics: 'High drainage • Enrich with organic compost',
      code: 'RED-LOAM-01'
    },
    {
      id: 'black',
      swatchColor: 'bg-[#2B2321]',
      titleKey: 'land.soilBlack',
      descKey: 'land.soilBlackDesc',
      characteristics: 'Superior water retention • Cotton & Pulses',
      code: 'VERTISOL-02'
    },
    {
      id: 'sandy',
      swatchColor: 'bg-[#C29853]',
      titleKey: 'land.soilSandy',
      descKey: 'land.soilSandyDesc',
      characteristics: 'Rapid drainage • Groundnut & Millets',
      code: 'ARENOSOL-03'
    },
    {
      id: 'clay',
      swatchColor: 'bg-[#5C493E]',
      titleKey: 'land.soilClay',
      descKey: 'land.soilClayDesc',
      characteristics: 'Nutrient-dense • Prime for Paddy & Rice',
      code: 'FLUVISOL-04'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {soils.map((soil) => {
        const isSelected = selectedSoil === soil.id;
        return (
          <div
            key={soil.id}
            onClick={() => onChange(soil.id)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onChange(soil.id);
              }
            }}
            className={`cursor-pointer border p-4 transition-all text-left flex flex-col justify-between ${
              isSelected
                ? 'border-[#6B0F1A] bg-[#FFFBF5] ring-1 ring-[#6B0F1A] shadow-xs'
                : 'border-[#E6D9C8] bg-[#FFFDF9] hover:border-[#6B0F1A]/50'
            }`}
          >
            {/* Top Swatch with Hairline Border */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E6D9C8]">
              <div className="flex items-center space-x-2.5">
                <div className={`w-6 h-6 ${soil.swatchColor} border border-[#2A080C]/20 shrink-0`} />
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#6B0F1A]">
                  {soil.code}
                </span>
              </div>
              {isSelected ? (
                <span className="w-5 h-5 bg-[#6B0F1A] text-[#FFFDF9] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              ) : (
                <div className="w-4 h-4 border border-[#D9CAB5]" />
              )}
            </div>

            <div>
              <h4 className="font-luxury-serif font-bold text-[#2A080C] text-base leading-snug">
                {t(soil.titleKey)}
              </h4>
              <p className="text-xs text-[#5D4B45] mt-1 leading-relaxed">
                {t(soil.descKey)}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#E6D9C8] flex items-center justify-between text-[10px]">
              <span className="font-bold tracking-wide text-[#6B0F1A] uppercase">
                {soil.characteristics}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
