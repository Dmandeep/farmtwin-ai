# FarmTwin AI — AI-Powered Agricultural Digital Assistant
### డిజిటల్ రైతు మిత్రుడు (Farmer's Digital Twin)

FarmTwin AI is a mobile-first, responsive web application designed specifically for Indian farmers. It delivers personalized agricultural guidance, growth-stage task calendars, pest/disease diagnostics, and localized weather advisories in **Telugu (తెలుగు)**, **English**, and **Hindi (हिंदी)**.

---

## 🌟 Key Features

1. **Top Header with Always-Visible Language Selector & 1-Tap Help**:
   - Seamlessly switch between **తెలుగు**, **English**, and **हिंदी** from any screen without losing context.
   - Emergency **Kisan Call Center (1800-180-1551)** toll-free dialer and Krishi Vigyan Kendra (KVK) guidance.

2. **Home Page**:
   - **4 Large, Clearly Worded Action Buttons**:
     - 🌾 *"Which crop should I grow?"* (`నేను ఏ పంట వేయాలి?`)
     - 🌿 *"Help with my current crop"* (`నా ప్రస్తుత పంట సంరక్షణ`)
     - 🐛 *"Something is wrong with my crop"* (`పంటలో ఏదో సమస్య ఉంది`)
     - 💧 *"Help with soil, water or fertilizer"* (`నేల, నీరు లేదా ఎరువుల సలహా`)
   - **Saved Land Snapshot** with clear transparency tags:
     - 🟢 *Farmer-Reported* (Soil type, Water source)
     - 🔵 *System-Measured* (Open-Meteo local weather, rain probability)
     - 🟡 *Not Yet Known* (NPK soil test status)
   - **Severe Weather Advisory** with foliar spray safety condition (e.g. wind speed > 15 km/h alert).
   - Shortcut to the latest farming recommendation.

3. **My Land Page**:
   - **5-Step Progressive Registration Wizard**:
     - **Step 1**: Farm Location (State, District, Village/Town)
     - **Step 2**: Land Size (<1 Acre, 1–2 Acres, 2–5 Acres, etc.)
     - **Step 3**: Soil Type with Visual Cards (Red Soil, Black Cotton Soil, Sandy Loam, Clay)
     - **Step 4**: Water Source (Rainfed, Borewell, Canal, Open Well, Drip)
     - **Step 5**: Primary Assistance Needed (Choosing crop, Crop care, Problem remedy, Soil advice)
   - Saved fields management with *Set as Primary*, *Edit*, and *Delete*.

4. **Farming Advice Page (3 Goal Modes)**:
   - **Mode 1: Choosing a Crop**: Top recommended crops matched to soil and water with suitability rationale, required conditions, and market risks.
   - **Mode 2: Current Crop Care**: Tasks synchronized with growth stages (Sowing, Vegetative, Flowering, Fruiting, Maturity) and localized rain forecast.
   - **Mode 3: Crop Problem Reporting**: Symptom checklist & instant remedy reports structured as:
     - **What to Do** (Immediate action)
     - **Why** (Cause explained in everyday terms)
     - **Cautionary Notes** (Spraying safety, pre-harvest interval)
     - **Official Sources** (ANGRAU, PJTSAU, ICAR-CRIDA, KVK)

5. **Ask a Question Page**:
   - Clean, conversational chat interface in Telugu, English, and Hindi.
   - **Speech-to-Text Voice Input** for hands-free queries.
   - **Crop Photo Upload** for visual pest and leaf damage analysis.
   - Structured AI responses adhering to agricultural safety standards.

6. **My Profile Page**:
   - Manage personal details, language preferences, and land measurement units (Acres, Gunthas, Cents, Hectares).
   - Notification alert toggles for severe weather, stage tasks, and Mandi price updates.
   - Data privacy reset ("Clear Saved Farm Data") for shared kiosk devices.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, i18next + react-i18next
- **Backend**: Python 3.12+, FastAPI, Uvicorn, SQLAlchemy 2.0, SQLite (prototype) / PostgreSQL (production ready)
- **AI Integration**: Google Gemini API (`google-genai` SDK) with certified offline heuristic fallback
- **Weather API**: Open-Meteo Agricultural API (live hourly and 7-day forecast for Indian districts)

---

## 🚀 Running the Project Locally

### 1. Start the Backend API
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
- The backend will start on `http://127.0.0.1:8000`.
- API documentation (Swagger UI) is available at `http://127.0.0.1:8000/docs`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:5173` on your browser or mobile device.
- All `/api/*` calls are automatically proxied to the FastAPI server.

---

## 🌾 Verified Agricultural Knowledge Standard
FarmTwin AI advisories are aligned with:
- **ANGRAU** (Acharya N.G. Ranga Agricultural University) *Vyavasaya Panchangam*
- **PJTSAU** (Professor Jayashankar Telangana State Agricultural University) *Package of Practices*
- **ICAR** (Indian Council of Agricultural Research) & **CRIDA**
- **Krishi Vigyan Kendras (KVK)**
