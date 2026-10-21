"""
Agricultural Knowledge Base
Verified with ANGRAU, PJTSAU, ICAR & Krishi Vigyan Kendra (KVK) Package of Practices.
"""

from typing import List, Dict, Any

CROPS_DATABASE: List[Dict[str, Any]] = [
    {
        "id": "cotton",
        "name_en": "Cotton (కపాస్ / పత్తి)",
        "name_te": "పత్తి (Cotton)",
        "name_hi": "कपास (Cotton)",
        "soils": ["black", "red"],
        "waters": ["borewell", "rain", "canal", "drip"],
        "duration_days": "150–180 Days",
        "water_need": "medium",
        "season": "Kharif (June–July)",
        "suitability_reason_en": "Thrives best in deep black cotton soils with high moisture retention. Profitable cash crop with widespread AP/Telangana market access.",
        "suitability_reason_te": "నల్లరేగడి నేలల్లో ఎక్కువ తేమ నిలిచి ఉండటం వలన పత్తి పంట చాలా బాగా పెరుగుతుంది. మార్కెట్ గిరాకీ బాగుంటుంది.",
        "suitability_reason_hi": "गहरी काली कपासी मिट्टी में नमी लंबे समय तक बनी रहने से कपास की पैदावार बहुत अच्छी होती है।",
        "conditions_en": "Soil pH 6.0–8.0, 25°C–35°C temperature, requires 3–4 protective irrigations if rain fails.",
        "conditions_te": "నేల ఉదజసూచిక (pH) 6.0-8.0 ఉండాలి. పూత మరియు కాయ దశల్లో వర్షం లేకపోతే 3-4 తడులు అవసరం.",
        "conditions_hi": "मिट्टी का pH 6.0-8.0, तापमान 25-35 डिग्री सेल्सियस, फूल और गूलर बनते समय सिंचाई आवश्यक।",
        "risks_en": "Vulnerable to Pink Bollworm and Sucking Pests (thrips/whitefly). Install pheromone traps by day 45.",
        "risks_te": "గులాబీ రంగు పురుగు మరియు రసం పీల్చే పురుగుల బెడద ఎక్కువ. 45వ రోజు నాటికే లింగాకర్షక బుట్టలు పెట్టాలి.",
        "risks_hi": "गुलाबी सुंडी और रस चूसक कीटों का खतरा। 45 दिन पर फेरोमोन ट्रैप लगाएं।"
    },
    {
        "id": "chilli",
        "name_en": "Chilli (మిరప)",
        "name_te": "మిరప (Chilli)",
        "name_hi": "मिर्च (Chilli)",
        "soils": ["black", "red", "sandy"],
        "waters": ["borewell", "canal", "drip"],
        "duration_days": "180–210 Days",
        "water_need": "high",
        "season": "Kharif / Rabi",
        "suitability_reason_en": "High-value commercial spice crop widely grown in Guntur, Warangal, and Khammam with high export demand.",
        "suitability_reason_te": "గుంటూరు, వరంగల్, ఖమ్మం ప్రాంతాల్లో నల్లరేగడి మరియు ఎర్ర నేలల్లో మిరప అత్యధిక లాభాలనిచ్చే వాణిజ్య పంట.",
        "suitability_reason_hi": "काली व लाल मिट्टी में मिर्च एक उच्च लाभ देने वाली नकदी फसल है जिसकी बाजार मांग हमेशा अधिक रहती है।",
        "conditions_en": "Needs well-drained fertile loam soil, regular light drip irrigation, stakes or ridges to prevent waterlogging.",
        "conditions_te": "నీరు నిలవని సారవంతమైన నేలలు, క్రమం తప్పకుండా డ్రిప్ లేదా తేలికపాటి తడులు అందించాలి.",
        "conditions_hi": "जल निकास वाली उपजाऊ दोमट मिट्टी, नियमित ड्रिप सिंचाई, खेत में पानी जमा न होने दें।",
        "risks_en": "Black Thrips (Tamarixia) and leaf curl viral diseases. Avoid excessive nitrogen fertilizer.",
        "risks_te": "నల్ల తామర పురుగులు మరియు ఆకుముడుత తెగులు. అధిక మోతాదులో యూరియా వాడరాదు.",
        "risks_hi": "काली थ्रिप्स और पत्ती मरोड़ रोग का प्रकोप। अत्यधिक यूरिया के प्रयोग से बचें।"
    },
    {
        "id": "groundnut",
        "name_en": "Groundnut (వేరుశనగ)",
        "name_te": "వేరుశనగ (Groundnut)",
        "name_hi": "मूंगफली (Groundnut)",
        "soils": ["red", "sandy"],
        "waters": ["rain", "borewell", "well", "drip"],
        "duration_days": "105–125 Days",
        "water_need": "low",
        "season": "Kharif & Rabi",
        "suitability_reason_en": "Ideal for well-drained red sandy loam soils (Rayalaseema and South Telangana). Fixes atmospheric nitrogen to enrich soil.",
        "suitability_reason_te": "తేలికపాటి ఎర్ర నేలలు, ఇసుక గరప నేలలకు ఉత్తమమైన పంట. భూమిలో నత్రజనిని స్థిరీకరించి నేల సారాన్ని పెంచుతుంది.",
        "suitability_reason_hi": "लाल बलुई दोमट मिट्टी के लिए सबसे उपयुक्त। वायुमंडलीय नाइट्रोजन स्थिर करके मिट्टी को उपजाऊ बनाती है।",
        "conditions_en": "Needs loose soil for easy peg penetration. Apply gypsum (200 kg/acre) at flowering stage (day 40–45).",
        "conditions_te": "ఊడలు నేలలోకి సులభంగా దిగడానికి నేల గుల్లగా ఉండాలి. పూత దశలో ఎకరానికి 200 కిలోల జిప్సం వేయాలి.",
        "conditions_hi": "फूल आने के समय (40-45 दिन) 200 किग्रा/एकड़ जिप्सम डालें ताकि दाने सुडौल बनें।",
        "risks_en": "Tikka leaf spot and collar rot. Treat seed with Trichoderma viride (10g/kg) before sowing.",
        "risks_te": "టిక్కా ఆకుమచ్చ తెగులు మరియు మొదలు కుళ్లు తెగులు. విత్తన శుద్ధి తప్పనిసరి.",
        "risks_hi": "टिक्का पत्ती धब्बा रोग। बुवाई से पहले ट्राइकोडर्मा विरिडी से बीज उपचार करें।"
    },
    {
        "id": "paddy",
        "name_en": "Paddy / Rice (వరి)",
        "name_te": "వరి (Paddy / Rice)",
        "name_hi": "धान (Paddy)",
        "soils": ["clay", "black"],
        "waters": ["canal", "borewell"],
        "duration_days": "120–145 Days",
        "water_need": "high",
        "season": "Kharif / Rabi",
        "suitability_reason_en": "Staple crop suitable for heavy clay and canal command areas with dependable water supply.",
        "suitability_reason_te": "బంకమట్టి, నల్లరేగడి నేలలు మరియు కాలువ లేదా సమృద్ధిగా బోరు నీరు ఉన్న ప్రాంతాలకు అనువైన ప్రధాన పంట.",
        "suitability_reason_hi": "चिकनी मिट्टी और नहर या प्रचुर बोरवेल सिंचाई वाले क्षेत्रों के लिए मुख्य फसल।",
        "conditions_en": "Standing water 2–5 cm during tillering. Alternate wetting and drying (AWD) saves 30% water.",
        "conditions_te": "పిలకల దశలో 2-5 సెం.మీ నీరు ఉంచాలి. ఆరుతడుల విధానం (AWD) ద్వారా 30% నీరు ఆదా అవుతుంది.",
        "conditions_hi": "कल्ले फूटने के समय 2-5 सेमी पानी रखें। जल बचत के लिए एकांतर गीला-सूखा तरीका अपनाएं।",
        "risks_en": "Stem borer and Blast fungus. Monitor leaf tips for dead hearts.",
        "risks_te": "కాండం తొలిచే పురుగు మరియు అగ్గితెగులు. ముదురు ఆకులను గమనిస్తూ ఉండాలి.",
        "risks_hi": "तना छेदक और झुलसा रोग का खतरा। समय पर निगरानी आवश्यक।"
    },
    {
        "id": "redgram",
        "name_en": "Redgram / Pigeonpea (కందులు)",
        "name_te": "కందులు (Redgram)",
        "name_hi": "अरहर / तुअर (Redgram)",
        "soils": ["red", "black"],
        "waters": ["rain", "borewell"],
        "duration_days": "150–180 Days",
        "water_need": "low",
        "season": "Kharif",
        "suitability_reason_en": "Highly drought-tolerant deep-rooted pulse. Excellent intercrop with cotton or groundnut (1:7 ratio).",
        "suitability_reason_te": "లోతైన వేరు వ్యవస్థ కలిగి ఉండి కరువును తట్టుకుంటుంది. పత్తి లేదా వేరుశనగలో అంతర పంటగా అత్యుత్తమం.",
        "suitability_reason_hi": "गहरी जड़ों वाली सूखा प्रतिरोधी दलहनी फसल। कपास या मूंगफली के साथ अंतःफसल के लिए उत्तम।",
        "conditions_en": "Requires minimal irrigation; 1 protective wetting at pod development stage boosts yield by 35%.",
        "conditions_te": "తక్కువ నీటితో పండుతుంది. కాయ దశలో ఒక్క రక్షక తడి ఇస్తే 35% అధిక దిగుబడి వస్తుంది.",
        "conditions_hi": "कम पानी की आवश्यकता; फली बनते समय एक सुरक्षात्मक सिंचाई से 35% तक अधिक उपज।",
        "risks_en": "Helicoverpa pod borer and wilt. Use NPV spray or neem oil during early flowering.",
        "risks_te": "శనగపచ్చ పురుగు మరియు ఎండు తెగులు. పూత దశలో వేప నూనె 5 మి.లీ/లీటరు చొప్పున పిచికారీ చేయాలి.",
        "risks_hi": "फली छेदक कीट का खतरा। फूल आते ही 5 मिली/लीटर नीम के तेल का छिड़काव करें।"
    },
    {
        "id": "maize",
        "name_en": "Maize / Corn (మొక్కజొన్న)",
        "name_te": "మొక్కజొన్న (Maize)",
        "name_hi": "मक्का (Maize)",
        "soils": ["red", "black", "sandy"],
        "waters": ["borewell", "canal", "drip"],
        "duration_days": "100–115 Days",
        "water_need": "medium",
        "season": "Kharif / Rabi",
        "suitability_reason_en": "Fast 100-day grain crop with stable industrial & poultry feed market demand.",
        "suitability_reason_te": "100 రోజుల్లో త్వరగా చేతికి వచ్చే పంట. పౌల్ట్రీ పరిశ్రమ నుండి నిరంతరం గిరాకీ ఉంటుంది.",
        "suitability_reason_hi": "100 दिनों में तैयार होने वाली फसल। पोल्ट्री और औद्योगिक क्षेत्र से निरंतर स्थिर मांग।",
        "conditions_en": "Needs nitrogen split into 3 doses: basal, knee-high stage (day 30), and tasseling (day 55).",
        "conditions_te": "నత్రజని ఎరువును 3 దఫాలుగా వేయాలి: ఆఖరి దుక్కిలో, మోకాలు ఎత్తు దశలో మరియు కండె దశలో.",
        "conditions_hi": "यूरिया को 3 भागों में दें: बुवाई के समय, घुटने की ऊंचाई पर, और भुट्टा बनने पर।",
        "risks_en": "Fall Armyworm (కత్తెర పురుగు). Spray Emamectin Benzoate 0.4g/litre inside plant whorls if whorl damage occurs.",
        "risks_te": "కత్తెర పురుగు ఆశించే అవకాశం ఉంది. సుడులలో ఎమామెక్టిన్ బెంజోయేట్ 0.4 గ్రా/లీటరు పిచికారీ చేయాలి.",
        "risks_hi": "फॉल आर्मीवॉर्म (सैनिक कीट)। लक्षण दिखने पर 0.4 ग्राम/लीटर इमामेक्टिन बेंजोएट का छिड़काव करें।"
    }
]

STAGE_CARE_GUIDES = {
    "cotton": {
        "sowing": {
            "title_en": "Cotton: Sowing & Emergence (Day 0–20)",
            "title_te": "పత్తి: విత్తనం & మొలక దశ (0–20 రోజులు)",
            "title_hi": "कपास: बुवाई और अंकुरण (0–20 दिन)",
            "steps_en": [
                "Maintain row spacing of 90 cm x 60 cm for Bt hybrids.",
                "Ensure soil has sufficient residual moisture before dropping seed.",
                "Gap filling should be completed within 10 days of germination.",
                "Spray Pendimethalin 38.7% CS @ 700 ml/acre within 48 hours of sowing as pre-emergence weed control."
            ],
            "steps_te": [
                "బీటీ పత్తి హైబ్రిడ్లకు 90 సెం.మీ x 60 సెం.మీ వరుసల దూరం పాటించండి.",
                "విత్తే సమయంలో నేలలో సరైన పదును ఉండేలా చూసుకోండి.",
                "మొలకెత్తిన 10 రోజుల్లోపు ఖాళీలను పూడ్చడం (గ్యాప్ ఫిల్లింగ్) పూర్తి చేయండి.",
                "విత్తిన 48 గంటల్లో పెండిమిథాలిన్ 38.7% CS మందును ఎకరానికి 700 మి.లీ చొప్పున పిచికారీ చేయండి."
            ],
            "steps_hi": [
                "बीज बोते समय कतार से कतार 90 सेमी और पौधे से पौधे 60 सेमी रखें।",
                "अंकुरण के 10 दिनों के भीतर खाली स्थानों पर बीज दोबारा लगाएं।",
                "खरपतवार नियंत्रण के लिए बुवाई के 48 घंटे में पेंडीमेथालिन 700 मिली/एकड़ छिड़कें।"
            ],
            "cautions_en": ["Do not bury seeds deeper than 3-4 cm, or germination percentage drops drastically."],
            "cautions_te": ["విత్తనాన్ని 3-4 సెం.మీ కంటే లోతుగా వేయరాదు, లేకపోతే మొలక శాతం తగ్గుతుంది."],
            "cautions_hi": ["बीज 3-4 सेमी से अधिक गहरा न बोएं, अन्यथा अंकुरण प्रभावित होगा।"]
        },
        "vegetative": {
            "title_en": "Cotton: Vegetative Growth (Day 21–45)",
            "title_te": "పత్తి: శాకీయ ఎదుగుదల దశ (21–45 రోజులు)",
            "title_hi": "कपास: वानस्पतिक विकास (21–45 दिन)",
            "steps_en": [
                "Perform first intercultivation and hand weeding at day 25 to aerate roots.",
                "Top-dress with Urea 25 kg/acre + MOP (Potash) 15 kg/acre placed 5 cm away from the stem.",
                "Install yellow and blue sticky traps (8 per acre) to monitor sucking pests.",
                "If leafhoppers or thrips appear, spray Neem oil 5 ml/litre or Flonicamid 50 WG @ 0.3g/litre."
            ],
            "steps_te": [
                "25వ రోజున మొదటి దఫా అంతరకృషి చేసి కలుపు తీయండి, వేర్లకు గాలి తగులుతుంది.",
                "మొదటి దఫా ఎరువుగా ఎకరానికి 25 కిలోల యూరియా + 15 కిలోల పొటాష్ మొక్క మొదలుకు 5 సెం.మీ దూరంలో వేసి మట్టి కప్పండి.",
                "రసం పీల్చే పురుగుల కోసం ఎకరానికి 8 పసుపు, నీలి రంగు జిగురు అట్టలు అమర్చండి.",
                "తామర పురుగులు కనిపిస్తే వేపనూనె 5 మి.లీ/లీటరు లేదా ఫ్లోనికామిడ్ 0.3 గ్రా/లీటరు చొప్పున పిచికారీ చేయండి."
            ],
            "steps_hi": [
                "25वें दिन पहली गुड़ाई करें और खरपतवार निकालें।",
                "25 किग्रा यूरिया + 15 किग्रा पोटाश प्रति एकड़ तने से 5 सेमी दूर डालें।",
                "रस चूसक कीटों की निगरानी के लिए पीले और नीले स्टिकी ट्रैप लगाएं।",
                "नीम का तेल 5 मिली/लीटर या फ्लोनिकामाइड 0.3 ग्राम/लीटर का छिड़काव करें।"
            ],
            "cautions_en": ["Avoid waterlogging near stem collars; causes root suffocation and wilting."],
            "cautions_te": ["మొక్కల మొదళ్ల వద్ద నీరు నిలవకుండా డ్రైనేజీ కాలువలు తీయండి."],
            "cautions_hi": ["तने के पास पानी न जमने दें, इससे जड़ सड़न का खतरा होता है।"]
        },
        "flowering": {
            "title_en": "Cotton: Flowering & Squaring (Day 46–75)",
            "title_te": "పత్తి: పూత & కాయ దశ (46–75 రోజులు)",
            "title_hi": "कपास: फूल और गूलर बनना (46–75 दिन)",
            "steps_en": [
                "Critical water stage: Give protective irrigation if dry spell exceeds 7 days.",
                "Foliar spray of 19:19:19 (NPK) @ 5g/litre + Boron @ 1g/litre to prevent flower & square drop.",
                "Install 4 pheromone traps per acre for Pink Bollworm monitoring.",
                "Spray Profenofos 50 EC @ 2 ml/litre if square borer caterpillars are detected."
            ],
            "steps_te": [
                "ఇది నీటి అవసరం అత్యంత కీలకమైన దశ. వర్షాభావ పరిస్థితుల్లో ఖచ్చితంగా తేలికపాటి తడి ఇవ్వండి.",
                "పూత, పిందె రాలకుండా 19:19:19 ఎరువు 5 గ్రా/లీటరు + బోరాన్ 1 గ్రా/లీటరు కలిపి పిచికారీ చేయండి.",
                "గులాబీ రంగు పురుగు నిఘా కోసం ఎకరానికి 4 లింగాకర్షక బుట్టలు అమర్చండి.",
                "కాయ తొలిచే పురుగు కనిపిస్తే ప్రొఫెనోఫాస్ 2 మి.లీ/లీటరు నీటికి కలిపి పిచికారీ చేయండి."
            ],
            "steps_hi": [
                "फूल आते समय नमी बनाए रखें; सूखा होने पर हल्की सिंचाई अवश्य करें।",
                "फूल गिरने से रोकने के लिए 19:19:19 (5 ग्राम/लीटर) + बोरॉन (1 ग्राम/लीटर) छिड़कें।",
                "गुलाबी सुंडी के लिए 4 फेरोमोन ट्रैप प्रति एकड़ लगाएं।",
                "प्रोफेनोफॉस 50 EC @ 2 मिली/लीटर का छिड़काव करें।"
            ],
            "cautions_en": ["Do not spray during peak midday sunlight (11 AM – 3 PM) or pollinators like honeybees will be harmed."],
            "cautions_te": ["ఎండ తీవ్రంగా ఉన్నప్పుడు (ఉదయం 11 నుండి మధ్యాహ్నం 3 వరకు) పిచికారీ చేయరాదు. తేనెటీగలు చనిపోతాయి."],
            "cautions_hi": ["कड़ी धूप में (दोपहर 11 से 3 के बीच) दवा न छिड़कें ताकि मित्र कीट सुरक्षित रहें।"]
        }
    },
    "chilli": {
        "vegetative": {
            "title_en": "Chilli: Vegetative & Branching (Day 25–50)",
            "title_te": "మిరప: కొమ్మల పెరుగుదల దశ (25–50 రోజులు)",
            "title_hi": "मिर्च: शाखाएं और बढ़वार (25–50 दिन)",
            "steps_en": [
                "Apply second dose of fertilizers: Urea 20 kg + Potash 15 kg/acre.",
                "Spray systemic insecticide (Acetamiprid 20 SP @ 0.2g/litre) if leaf curl thrips appear.",
                "Maintain soil moisture at root zone with regular drip intervals of 2 hours daily."
            ],
            "steps_te": [
                "రెండవ దఫా ఎరువులుగా ఎకరానికి 20 కిలోల యూరియా + 15 కిలోల పొటాష్ వేయండి.",
                "తామర పురుగుల నివారణకు ఎసిటామిప్రిడ్ 0.2 గ్రా/లీటరు లేదా డయాఫెంథియురాన్ 1.25 గ్రా/లీటరు పిచికారీ చేయండి.",
                "రోజూ 2 గంటల పాటు డ్రిప్ ద్వారా తడి అందించి తేమ సమానంగా ఉండేలా చూడండి."
            ],
            "steps_hi": [
                "20 किग्रा यूरिया + 15 किग्रा पोटाश प्रति एकड़ डालें।",
                "पत्ती मुड़ने पर एसिटामिप्रिड 0.2 ग्राम/लीटर का छिड़काव करें।",
                "नियमित हल्की सिंचाई बनाए रखें।"
            ],
            "cautions_en": ["Avoid water stagnation around root crown to prevent Phytophthora collar rot."],
            "cautions_te": ["మొక్కల మొదళ్ల వద్ద నీరు నిలిస్తే మొదలు కుళ్లు తెగులు వస్తుంది, కాబట్టి మురుగునీటిని తీసివేయండి."],
            "cautions_hi": ["जड़ों के पास जलभराव न होने दें, अन्यथा जड़ गलन रोग हो सकता है।"]
        }
    }
}

DIAGNOSIS_RULES = {
    "symYellow": {
        "title_en": "Leaf Yellowing (Chlorosis / Nitrogen or Micronutrient Deficiency)",
        "title_te": "ఆకులు పసుపు రంగులోకి మారడం (నత్రజని లేదా సూక్ష్మపోషకాల లోపం)",
        "title_hi": "पत्तियों का पीला पड़ना (नाइट्रोजन या सूक्ष्म पोषक तत्व की कमी)",
        "causes_en": "Older bottom leaves yellowing indicates Nitrogen deficiency. Younger top leaves yellowing indicates Iron or Zinc deficiency or root waterlogging.",
        "causes_te": "క్రింది ముదురు ఆకులు పసుపు రంగులోకి మారితే నత్రజని లోపం; పై లేత ఆకులు పసుపుగా మారితే జింక్ లేదా ఇనుము లోపం.",
        "causes_hi": "पुरानी निचली पत्तियों का पीला पड़ना नाइट्रोजन की कमी है, जबकि ऊपरी नई पत्तियों का पीलापन जिंक या आयरन की कमी दर्शाता है।",
        "action_en": [
            "Check soil moisture: drain excess standing water immediately.",
            "Foliar spray 13:00:45 (Multi-K) @ 5g/litre + Chelated Zinc @ 1g/litre of water.",
            "Apply 15 kg Urea per acre as soil top-dressing after draining excess water."
        ],
        "action_te": [
            "ముందుగా నేలలో తేమను పరిశీలించండి; అదనపు నీరు ఉంటే కాలువలు తీసి వెంటనే బయటకు పంపండి.",
            "పైపాటుగా 13:00:45 ఎరువు 5 గ్రా/లీటరు + చీలేటెడ్ జింక్ 1 గ్రా/లీటరు కలిపి ఆకులపై పిచికారీ చేయండి.",
            "తడి ఆరిన తర్వాత ఎకరానికి 15 కిలోల యూరియాను మొదళ్లకు దూరంగా వేయండి."
        ],
        "action_hi": [
            "खेत से अतिरिक्त पानी तुरंत निकालें।",
            "13:00:45 (5 ग्राम/लीटर) + चिलेटेड जिंक (1 ग्राम/लीटर) का छिड़काव करें।",
            "खेत सूखने पर 15 किग्रा यूरिया प्रति एकड़ दें।"
        ],
        "cautions_en": ["Do not apply heavy doses of urea to wet, waterlogged soil as roots cannot absorb it and fungal rot occurs."],
        "cautions_te": ["నీరు నిలిచి ఉన్న నేలలో యూరియా వేయరాదు. వేర్లు పీల్చుకోలేక తెగుళ్లు వస్తాయి."],
        "cautions_hi": ["पानी भरे खेत में यूरिया न डालें, इससे फफूंद का खतरा बढ़ता है।"]
    },
    "symHoles": {
        "title_en": "Chewed Leaves & Stem Borer Damage (Caterpillar Infestation)",
        "title_te": "ఆకులకు రంధ్రాలు / కాండం తొలిచే గొంగళి పురుగులు",
        "title_hi": "पत्तियों में छेद / तना छेदक सुंडी का प्रकोप",
        "causes_en": "Spodoptera / Helicoverpa caterpillars or stem borers feeding on foliage and tender terminal shoots.",
        "causes_te": "లద్దె పురుగు లేదా శనగపచ్చ పురుగు ఆకులను కొరికి రంధ్రాలు చేయడం లేదా కాండంలోకి తొలిచి లోపలి భాగాలను తినడం.",
        "causes_hi": "सुंडी (कैटरपिलर) द्वारा पत्तियों और कोमल तनों को चबाकर नुकसान पहुंचाना।",
        "action_en": [
            "Handpick large egg masses and gregarious young larvae during morning hours and destroy them.",
            "Spray Emamectin Benzoate 5% SG @ 0.4g (4g per 10 litres) or Chlorantraniliprole 18.5% SC @ 0.3 ml/litre.",
            "Install bird perches (10–15 per acre) to encourage predatory birds that eat caterpillars."
        ],
        "action_te": [
            "ఉదయం పూట ఆకుల అడుగున ఉన్న గుడ్ల సముదాయాలను, చిన్న గొంగళి పురుగులను చేతితో ఏరి నాశనం చేయండి.",
            "ఎమామెక్టిన్ బెంజోయేట్ 5% SG మందును లీటరు నీటికి 0.4 గ్రాములు (పంపుకు 6 గ్రాములు) కలిపి పిచికారీ చేయండి.",
            "పొలంలో ఎకరానికి 10-15 పక్షి స్థావరాలు (టి ఆకారపు కర్రలు) ఏర్పాటు చేయండి."
        ],
        "action_hi": [
            "सुबह के समय सुंडियों और अंडों को हाथ से इकट्ठा कर नष्ट करें।",
            "इमामेक्टिन बेंजोएट 5% SG @ 0.4 ग्राम/लीटर या कोराजन 0.3 मिली/लीटर का छिड़काव करें।",
            "खेत में टी-आकार के पक्षी बसेरे (10-15 प्रति एकड़) लगाएं।"
        ],
        "cautions_en": ["Always wear face mask and gloves while spraying. Do not spray against the direction of wind."],
        "cautions_te": ["మందు పిచికారీ చేసేటప్పుడు తప్పనిసరిగా ముఖానికి మాస్క్, చేతులకు గ్లౌజులు ధరించండి. గాలికి ఎదురుగా కొట్టరాదు."],
        "cautions_hi": ["छिड़काव करते समय मास्क और दस्ताने पहनें। हवा की विपरीत दिशा में कभी न छिड़कें।"]
    },
    "symSpots": {
        "title_en": "Leaf Spot / Fungal Blight (Cercospora / Alternaria)",
        "title_te": "ఆకుమచ్చ తెగులు (శిలీంద్ర వ్యాధి)",
        "title_hi": "पत्ती धब्बा / फफूंद रोग",
        "causes_en": "Fungal spores germinating during high humidity (>80%) and cloudy weather with intermittent rain.",
        "causes_te": "గాలిలో తేమ 80% కంటే ఎక్కువగా ఉండి, మబ్బులు పట్టిన వాతావరణంలో శిలీంధ్ర బీజాలు వ్యాపించడం.",
        "causes_hi": "अधिक नमी और बादलों वाले मौसम में फफूंद के बीजाणुओं का तेजी से फैलना।",
        "action_en": [
            "Spray Mancozeb 75% WP @ 2.5g/litre or Azoxystrobin + Difenoconazole @ 1 ml/litre.",
            "Avoid overhead sprinkler irrigation which splashes fungal spores between leaves.",
            "Ensure good air circulation by removing lower infected leaves."
        ],
        "action_te": [
            "మాంకోజెబ్ 75% WP మందును లీటరు నీటికి 2.5 గ్రాములు లేదా ఎజోక్సిస్ట్రోబిన్ + డైఫెనోకోనజోల్ 1 మి.లీ కలిపి పిచికారీ చేయండి.",
            "స్ప్రింక్లర్లతో పైనుండి నీరు చిలకరించడం ఆపండి, దీనివల్ల తెగులు ఇతర ఆకులకు పాకుతుంది.",
            "తెగులు సోకిన క్రింది ఆకులను తుంచి పొలం బయట పారవేయండి."
        ],
        "action_hi": [
            "मैंकोजेब 75% WP @ 2.5 ग्राम/लीटर या अज़ोक्सीस्ट्रोबिन 1 मिली/लीटर का छिड़काव करें।",
            "ऊपर से फव्वारा सिंचाई से बचें जिससे फफूंद न फैले।",
            "संक्रमित निचली पत्तियों को तोड़कर खेत से बाहर नष्ट करें।"
        ],
        "cautions_en": ["Wait at least 15 days after spraying before harvesting edible fruits or leaves."],
        "cautions_te": ["మందు పిచికారీ చేసిన తర్వాత కనీసం 15 రోజుల పాటు కాయలు లేదా ఆకుకూరలు కోయరాదు."],
        "cautions_hi": ["छिड़काव के बाद कम से कम 15 दिन तक फल या पत्तियां न तोड़ें।"]
    }
}
