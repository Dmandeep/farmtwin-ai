export type TabType = 'home' | 'land' | 'advice' | 'ask' | 'profile';

export type LanguageCode = 'te' | 'en' | 'hi';

export interface Field {
  id: number;
  name: string;
  state: string;
  district: string;
  village?: string;
  size: string;
  soil_type: 'red' | 'black' | 'sandy' | 'clay' | string;
  water_source: 'rain' | 'borewell' | 'canal' | 'well' | 'drip' | string;
  assistance_needed?: string;
  current_crop?: string;
  crop_stage?: string;
  latitude?: number;
  longitude?: number;
  soil_source?: 'farmer_reported' | 'measured' | 'not_yet_known';
  water_source_type?: 'farmer_reported' | 'measured' | 'not_yet_known';
  npk_status?: 'farmer_reported' | 'measured' | 'not_yet_known';
  is_active?: boolean;
}

export interface FarmerProfile {
  id: number;
  name: string;
  phone: string;
  preferred_language: LanguageCode;
  preferred_unit: 'acres' | 'gunthas' | 'cents' | 'hectares';
  state: string;
  district: string;
  village?: string;
  alerts_weather: boolean;
  alerts_crop_stage: boolean;
  alerts_mandi: boolean;
}

export interface WeatherDaily {
  date: string;
  day: string;
  temp_max: number;
  temp_min: number;
  precipitation_probability: number;
  condition: string;
}

export interface WeatherData {
  district: string;
  temperature: number;
  apparent_temperature: number;
  humidity: number;
  wind_speed: number;
  rain_chance: number;
  condition: string;
  is_day: boolean;
  spray_condition: 'ideal' | 'caution' | 'avoid';
  spray_message: string;
  alerts: {
    level: 'warning' | 'info' | 'critical';
    title: string;
    message: string;
  }[];
  daily: WeatherDaily[];
}

export interface StructuredAdvice {
  short_answer: string;
  practical_steps: string[];
  why: string;
  cautions: string[];
  sources: string[];
}

export interface CropRecommendation {
  id: string;
  name_en: string;
  name_te: string;
  name_hi: string;
  suitability_reason_en: string;
  suitability_reason_te: string;
  suitability_reason_hi: string;
  conditions_en: string;
  conditions_te: string;
  conditions_hi: string;
  risks_en: string;
  risks_te: string;
  risks_hi: string;
  duration_days: string;
  water_need: 'low' | 'medium' | 'high';
  season: string;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  structuredContent?: StructuredAdvice;
  timestamp: string;
}
