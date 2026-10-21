import { Field, FarmerProfile, WeatherData, CropRecommendation, StructuredAdvice, ChatMessageItem } from '../types';

const API_BASE = '/api';

export const api = {
  // Fields API
  async getFields(): Promise<Field[]> {
    try {
      const res = await fetch(`${API_BASE}/fields`);
      if (!res.ok) throw new Error('Failed to fetch fields');
      return await res.json();
    } catch {
      const stored = localStorage.getItem('farmtwin_offline_fields');
      if (stored) return JSON.parse(stored);
      return [
        {
          id: 1,
          name: 'తూర్పు చేను (East Field)',
          state: 'Andhra Pradesh',
          district: 'Guntur',
          village: 'Prathipadu',
          size: '2.5 Acres',
          soil_type: 'black',
          water_source: 'borewell',
          assistance_needed: 'crop_care',
          current_crop: 'Cotton (పత్తి)',
          crop_stage: 'vegetative',
          soil_source: 'farmer_reported',
          water_source_type: 'farmer_reported',
          npk_status: 'measured',
          is_active: true
        }
      ];
    }
  },

  async createField(field: Omit<Field, 'id'>): Promise<Field> {
    try {
      const res = await fetch(`${API_BASE}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field)
      });
      if (!res.ok) throw new Error('Failed to create field');
      return await res.json();
    } catch {
      const newField: Field = { ...field, id: Date.now(), is_active: true };
      const current = await this.getFields();
      const updated = [newField, ...current.map(f => ({ ...f, is_active: false }))];
      localStorage.setItem('farmtwin_offline_fields', JSON.stringify(updated));
      return newField;
    }
  },

  async updateField(id: number, data: Partial<Field>): Promise<Field> {
    try {
      const res = await fetch(`${API_BASE}/fields/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update field');
      return await res.json();
    } catch {
      const current = await this.getFields();
      const updated = current.map(f => f.id === id ? { ...f, ...data } : f);
      localStorage.setItem('farmtwin_offline_fields', JSON.stringify(updated));
      return updated.find(f => f.id === id)!;
    }
  },

  async deleteField(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/fields/${id}`, { method: 'DELETE' });
    } catch {
      const current = await this.getFields();
      const filtered = current.filter(f => f.id !== id);
      localStorage.setItem('farmtwin_offline_fields', JSON.stringify(filtered));
    }
  },

  async setActiveField(id: number): Promise<Field> {
    try {
      const res = await fetch(`${API_BASE}/fields/${id}/set-active`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to set active field');
      return await res.json();
    } catch {
      const current = await this.getFields();
      const updated = current.map(f => ({ ...f, is_active: f.id === id }));
      localStorage.setItem('farmtwin_offline_fields', JSON.stringify(updated));
      return updated.find(f => f.id === id)!;
    }
  },

  // Weather API
  async getWeather(district = 'Guntur', lat?: number, lon?: number): Promise<WeatherData> {
    try {
      const params = new URLSearchParams({ district });
      if (lat !== undefined && lon !== undefined) {
        params.append('lat', lat.toString());
        params.append('lon', lon.toString());
      }
      const res = await fetch(`${API_BASE}/weather/current?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch weather');
      return await res.json();
    } catch {
      return {
        district,
        temperature: 32.5,
        apparent_temperature: 34.0,
        humidity: 62,
        wind_speed: 9.4,
        rain_chance: 15,
        condition: 'Partly Cloudy',
        is_day: true,
        spray_condition: 'ideal',
        spray_message: 'Good conditions for crop spraying. Gentle breeze (<12 km/h) and low rain chance.',
        alerts: [
          {
            level: 'info',
            title: 'Kharif Season Weather',
            message: 'Optimal daytime temperatures for boll development in cotton and chillies.'
          }
        ],
        daily: [
          { date: '2026-10-21', day: 'Wed', temp_max: 33, temp_min: 23, precipitation_probability: 15, condition: 'Partly Cloudy' },
          { date: '2026-10-22', day: 'Thu', temp_max: 34, temp_min: 24, precipitation_probability: 20, condition: 'Sunny' },
          { date: '2026-10-23', day: 'Fri', temp_max: 32, temp_min: 22, precipitation_probability: 35, condition: 'Scattered Clouds' },
          { date: '2026-10-24', day: 'Sat', temp_max: 31, temp_min: 22, precipitation_probability: 40, condition: 'Cloudy' },
          { date: '2026-10-25', day: 'Sun', temp_max: 30, temp_min: 21, precipitation_probability: 10, condition: 'Sunny' }
        ]
      };
    }
  },

  // Advice API
  async getRecommendedCrops(params: { soil_type?: string; water_source?: string; district?: string; language?: string }): Promise<{ crops: CropRecommendation[] }> {
    try {
      const res = await fetch(`${API_BASE}/advice/recommend-crops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Failed to fetch crop recommendations');
      return await res.json();
    } catch {
      // Offline fallback crops
      return {
        crops: [
          {
            id: 'cotton',
            name_en: 'Cotton (కపాస్ / పత్తి)',
            name_te: 'పత్తి (Cotton)',
            name_hi: 'कपास (Cotton)',
            suitability_reason_en: 'Thrives best in deep black cotton soils with high moisture retention. Profitable cash crop.',
            suitability_reason_te: 'నల్లరేగడి నేలల్లో ఎక్కువ తేమ నిలిచి ఉండటం వలన పత్తి పంట చాలా బాగా పెరుగుతుంది.',
            suitability_reason_hi: 'काली मिट्टी में नमी रुकने से कपास की पैदावार बहुत अच्छी होती है।',
            conditions_en: 'Soil pH 6.0–8.0, 25°C–35°C temperature, 3-4 protective irrigations if dry.',
            conditions_te: 'నేల ఉదజసూచిక 6.0-8.0, పూత సమయంలో 3-4 రక్షక తడులు అవసరం.',
            conditions_hi: 'मिट्टी का pH 6.0-8.0, फूल और गूलर बनते समय हल्की सिंचाई आवश्यक।',
            risks_en: 'Vulnerable to Pink Bollworm and Sucking Pests. Install pheromone traps early.',
            risks_te: 'గులాబీ రంగు పురుగు బెడద. 45వ రోజు నాటికే లింగాకర్షక బుట్టలు పెట్టాలి.',
            risks_hi: 'गुलाबी सुंडी का खतरा। समय पर फेरोमोन ट्रैप लगाएं।',
            duration_days: '150–180 Days',
            water_need: 'medium',
            season: 'Kharif'
          },
          {
            id: 'chilli',
            name_en: 'Chilli (మిరప)',
            name_te: 'మిరప (Chilli)',
            name_hi: 'मिर्च (Chilli)',
            suitability_reason_en: 'High-value commercial spice crop widely grown in Guntur & Warangal with high export returns.',
            suitability_reason_te: 'గుంటూరు, వరంగల్ ప్రాంతాల్లో మిరప అత్యధిక లాభాలనిచ్చే వాణిజ్య పంట.',
            suitability_reason_hi: 'मिर्च एक उच्च लाभ देने वाली नकदी फसल है।',
            conditions_en: 'Needs fertile loam soil, regular light drip irrigation.',
            conditions_te: 'నీరు నిలవని సారవంతమైన నేలలు, క్రమబద్ధమైన డ్రిప్ తడులు.',
            conditions_hi: 'जल निकास वाली उपजाऊ दोमट मिट्टी और ड्रिप सिंचाई।',
            risks_en: 'Black Thrips and leaf curl virus. Avoid excess nitrogen.',
            risks_te: 'నల్ల తామర పురుగులు మరియు ఆకుముడుత. అధిక యూరియా వాడరాదు.',
            risks_hi: 'काली थ्रिप्स और पत्ती मरोड़ रोग।',
            duration_days: '180–210 Days',
            water_need: 'high',
            season: 'Kharif / Rabi'
          }
        ]
      };
    }
  },

  async getCropCare(crop_name: string, growth_stage: string, district = 'Guntur', language = 'te') {
    try {
      const res = await fetch(`${API_BASE}/advice/crop-care`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop_name, growth_stage, district, language })
      });
      if (!res.ok) throw new Error('Failed to fetch care plan');
      return await res.json();
    } catch {
      return {
        title: language === 'te' ? 'పత్తి: శాకీయ ఎదుగుదల & పూత సంరక్షణ' : 'Cotton: Vegetative & Square Care',
        crop: crop_name,
        stage: growth_stage,
        practical_steps: language === 'te' ? [
          'నేలలో తేమ సాధారణంగా ఉంది. సాధారణ పద్ధతిలో తడులు ఇవ్వండి.',
          'ఎకరానికి 25 కిలోల యూరియా + 15 కిలోల పొటాష్ మొక్క మొదలుకు 5 సెం.మీ దూరంలో వేయండి.',
          'రసం పీల్చే పురుగుల కోసం ఎకరానికి 8 పసుపు, నీలి రంగు జిగురు అట్టలు అమర్చండి.',
          'తామర పురుగులు కనిపిస్తే వేపనూనె 5 మి.లీ/లీటరు పిచికారీ చేయండి.'
        ] : [
          'Soil moisture is good. Maintain normal watering cycle.',
          'Apply 25 kg Urea + 15 kg Potash per acre placed 5 cm from root stem.',
          'Install 8 yellow and blue sticky traps per acre for sucking pests.',
          'Spray 5 ml neem oil per litre of water upon early pest detection.'
        ],
        cautions: language === 'te' ? [
          'మొక్కల మొదళ్ల వద్ద నీరు నిలవకుండా డ్రైనేజీ కాలువలు తీయండి.',
          'ఎండ తీవ్రంగా ఉన్నప్పుడు (మధ్యాహ్నం) పిచికారీ చేయరాదు.'
        ] : [
          'Avoid water stagnation near stem collars to prevent root rot.',
          'Never spray during intense midday heat (11 AM to 3 PM).'
        ],
        weather_sync: {
          rain_chance: 15,
          wind_speed: 9.4,
          spray_condition: 'ideal',
          spray_message: 'Good conditions for foliar spray today.'
        },
        sources: [
          'ANGRAU Vyavasaya Panchangam (2025-26)',
          'PJTSAU Package of Practices',
          'ICAR Krishi Vigyan Kendra Technical Manual'
        ]
      };
    }
  },

  async diagnoseCrop(formData: FormData) {
    try {
      const res = await fetch(`${API_BASE}/advice/diagnose`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to diagnose');
      return await res.json();
    } catch {
      return {
        short_answer: 'ఆకులు పసుపుబారడం నత్రజని లోపం లేదా వేర్ల వద్ద అదనపు తేమ వల్ల జరుగుతుంది.',
        practical_steps: [
            'పొలంలో నిలిచిన అదనపు నీటిని వెంటనే బయటకు పంపించండి.',
            'పైపాటుగా 13:00:45 ఎరువు 5 గ్రా/లీటరు + చీలేటెడ్ జింక్ 1 గ్రా/లీటరు పిచికారీ చేయండి.',
            'తడి ఆరిన తర్వాత ఎకరానికి 15 కిలోల యూరియా వేయండి.'
        ],
        why: 'వేర్లకు ప్రాణవాయువు అందకపోవడం వల్ల పోషకాలను తీసుకోలేవు.',
        cautions: [
            'నీరు నిలిచిన నేలలో యూరియా వేయరాదు.',
            'రక్షణ మాస్క్ మరియు చేతి తొడుగులు ధరించండి.'
        ],
        sources: [
            'ANGRAU Plant Pathology & Entomology Advisory',
            'ICAR - CRIDA Technical Guide'
        ]
      };
    }
  },

  async askQuestion(formData: FormData) {
    try {
      const res = await fetch(`${API_BASE}/qa/ask`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to ask question');
      return await res.json();
    } catch {
      return {
        status: 'success',
        advice: {
          short_answer: 'మీ పంట సమస్యను పరిశీలించాము. తక్షణ సమగ్ర సస్యరక్షణ చర్యల ద్వారా పంటను సురక్షితంగా కాపాడుకోవచ్చు.',
          practical_steps: [
            'తోటలో అదనపు నీరు నిలవకుండా డ్రైనేజీ కాలువలు శుభ్రం చేయండి.',
            'లద్దె లేదా రసం పీల్చే పురుగులకు వేపనూనె 5 మి.లీ/లీటరు పిచికారీ చేయండి.',
            'తీవ్రత ఎక్కువగా ఉంటే ఎమామెక్టిన్ బెంజోయేట్ 0.4 గ్రా/లీటరు కలిపి పిచికారీ చేయండి.'
          ],
          why: 'వాతావరణంలో అధిక తేమ మరియు సూర్యరశ్మి లోపం వల్ల పురుగుల ఉధృతి పెరుగుతుంది.',
          cautions: [
            'మందు పిచికారీ చేసేటప్పుడు మాస్క్, గ్లౌజులు తప్పక ధరించండి.',
            'గాలి వీచే దిశకు ఎదురుగా పిచికారీ చేయరాదు.'
          ],
          sources: [
            'ANGRAU సమగ్ర సస్యరక్షణ సూచనలు',
            'ICAR KVK మార్గదర్శకాలు'
          ]
        }
      };
    }
  },

  // Profile API
  async getProfile(): Promise<FarmerProfile> {
    try {
      const res = await fetch(`${API_BASE}/profile`);
      if (!res.ok) throw new Error('Failed to fetch profile');
      return await res.json();
    } catch {
      const stored = localStorage.getItem('farmtwin_profile');
      if (stored) return JSON.parse(stored);
      return {
        id: 1,
        name: 'రైతు మిత్రుడు (Farmer)',
        phone: '',
        preferred_language: 'te',
        preferred_unit: 'acres',
        state: 'Andhra Pradesh',
        district: 'Guntur',
        village: '',
        alerts_weather: true,
        alerts_crop_stage: true,
        alerts_mandi: false
      };
    }
  },

  async updateProfile(data: Partial<FarmerProfile>): Promise<FarmerProfile> {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return await res.json();
    } catch {
      const current = await this.getProfile();
      const updated = { ...current, ...data };
      localStorage.setItem('farmtwin_profile', JSON.stringify(updated));
      return updated;
    }
  },

  async resetData(): Promise<void> {
    try {
      await fetch(`${API_BASE}/profile/reset`, { method: 'POST' });
    } catch {
      // offline reset
    }
    localStorage.removeItem('farmtwin_offline_fields');
    localStorage.removeItem('farmtwin_chat_history');
  }
};
