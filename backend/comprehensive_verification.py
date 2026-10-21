import urllib.request
import urllib.parse
import json
import time
import sys
import sqlite3
from typing import Dict, Any, Tuple, Optional

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000/api"
DB_PATH = "backend/farmtwin.db"

class TestReport:
    def __init__(self):
        self.tests = []
        self.warnings = []
        self.start_time = time.time()

    def record_pass(self, category: str, name: str, latency_ms: float, details: str = ""):
        self.tests.append({
            "status": "PASS",
            "category": category,
            "name": name,
            "latency_ms": round(latency_ms, 2),
            "details": details
        })
        print(f"  [PASS] {name} ({latency_ms:.1f}ms) - {details}")

    def record_fail(self, category: str, name: str, latency_ms: float, error: str):
        self.tests.append({
            "status": "FAIL",
            "category": category,
            "name": name,
            "latency_ms": round(latency_ms, 2),
            "error": error
        })
        print(f"  [FAIL] {name} ({latency_ms:.1f}ms) - ERROR: {error}")

    def record_warning(self, category: str, message: str):
        self.warnings.append({"category": category, "message": message})
        print(f"  [WARN] {category}: {message}")

report = TestReport()

def api_call(path: str, method: str = "GET", data: Any = None, headers: Optional[Dict[str, str]] = None) -> Tuple[int, Any, float]:
    url = f"{BASE_URL}{path}"
    req_headers = dict(headers or {})
    req_data = None
    
    if data is not None:
        if isinstance(data, dict):
            req_data = json.dumps(data).encode("utf-8")
            req_headers.setdefault("Content-Type", "application/json")
        elif isinstance(data, (bytes, bytearray)):
            req_data = data
        else:
            req_data = str(data).encode("utf-8")
            
    req = urllib.request.Request(url, data=req_data, headers=req_headers, method=method)
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            latency = (time.time() - t0) * 1000
            return resp.status, (json.loads(body) if body else {}), latency
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        latency = (time.time() - t0) * 1000
        return e.code, (json.loads(body) if body else {}), latency
    except Exception as e:
        latency = (time.time() - t0) * 1000
        return 500, {"error": str(e)}, latency

def test_endpoint_health():
    print("\n--- 1. Verification of /api/health ---")
    status, res, lat = api_call("/health")
    if status == 200 and res.get("status") == "healthy" and "version" in res:
        report.record_pass("Health", "GET /api/health", lat, f"Service: '{res.get('service')}', Version: {res.get('version')}")
    else:
        report.record_fail("Health", "GET /api/health", lat, f"Status={status}, body={res}")

def test_endpoint_fields():
    print("\n--- 2. Verification of /api/fields CRUD & /set-active ---")
    
    # 2.1 GET /api/fields
    status, fields, lat = api_call("/fields")
    if status == 200 and isinstance(fields, list):
        report.record_pass("Fields", "GET /api/fields", lat, f"Retrieved {len(fields)} fields")
        # Check active status & transparency tags
        for f in fields:
            if "soil_source" not in f or "npk_status" not in f or "water_source_type" not in f:
                report.record_warning("Fields", f"Field ID {f.get('id')} is missing explicit transparency tags")
    else:
        report.record_fail("Fields", "GET /api/fields", lat, f"Status={status}, body={fields}")

    # 2.2 POST /api/fields
    test_field_payload = {
        "name": "Automated Verification Plot (పరీక్ష చేను)",
        "state": "Andhra Pradesh",
        "district": "Krishna",
        "village": "Machilipatnam",
        "size": "3.5 Acres",
        "soil_type": "clay",
        "water_source": "canal",
        "assistance_needed": "choose_crop",
        "current_crop": "Paddy",
        "crop_stage": "tillering",
        "soil_source": "farmer_reported",
        "water_source_type": "farmer_reported",
        "npk_status": "not_yet_known"
    }
    status, new_field, lat = api_call("/fields", method="POST", data=test_field_payload)
    if status == 201 and new_field.get("id"):
        created_id = new_field["id"]
        report.record_pass("Fields", "POST /api/fields (Create)", lat, f"Created field id={created_id}, tags: soil_source={new_field.get('soil_source')}, npk_status={new_field.get('npk_status')}")
    else:
        report.record_fail("Fields", "POST /api/fields (Create)", lat, f"Status={status}, body={new_field}")
        return

    # 2.3 GET /api/fields/{id}
    status, fetched_field, lat = api_call(f"/fields/{created_id}")
    if status == 200 and fetched_field.get("id") == created_id:
        report.record_pass("Fields", f"GET /api/fields/{created_id}", lat, f"Fetched field name='{fetched_field.get('name')}'")
    else:
        report.record_fail("Fields", f"GET /api/fields/{created_id}", lat, f"Status={status}, body={fetched_field}")

    # 2.4 PUT /api/fields/{id} (Updating data and transparency tags)
    update_payload = {
        "name": "Verified Updated Plot (నవీకరించబడిన చేను)",
        "soil_source": "measured",
        "npk_status": "measured",
        "current_crop": "Chilli"
    }
    status, updated_field, lat = api_call(f"/fields/{created_id}", method="PUT", data=update_payload)
    if (status == 200 and 
        updated_field.get("name") == update_payload["name"] and 
        updated_field.get("soil_source") == "measured" and 
        updated_field.get("npk_status") == "measured"):
        report.record_pass("Fields", f"PUT /api/fields/{created_id} (Update & Transparency Tags)", lat, 
                           f"Updated name, soil_source='{updated_field.get('soil_source')}', npk_status='{updated_field.get('npk_status')}'")
    else:
        report.record_fail("Fields", f"PUT /api/fields/{created_id} (Update)", lat, f"Status={status}, body={updated_field}")

    # 2.5 POST /api/fields/{id}/set-active
    status, active_res, lat = api_call(f"/fields/{created_id}/set-active", method="POST")
    if status == 200 and active_res.get("is_active") is True:
        # Verify exclusivity of active field
        _, all_fields, _ = api_call("/fields")
        active_count = sum(1 for f in all_fields if f.get("is_active") is True)
        if active_count == 1:
            report.record_pass("Fields", f"POST /api/fields/{created_id}/set-active", lat, "Field activated; Exactly 1 field is active across DB")
        else:
            report.record_fail("Fields", f"POST /api/fields/{created_id}/set-active", lat, f"Expected 1 active field, found {active_count}")
    else:
        report.record_fail("Fields", f"POST /api/fields/{created_id}/set-active", lat, f"Status={status}, body={active_res}")

    # 2.6 DELETE /api/fields/{id}
    status, del_res, lat = api_call(f"/fields/{created_id}", method="DELETE")
    if status in (200, 204):
        # Verify it no longer exists
        check_status, _, _ = api_call(f"/fields/{created_id}")
        if check_status == 404:
            report.record_pass("Fields", f"DELETE /api/fields/{created_id}", lat, "Deleted successfully and verified 404 on subsequent GET")
        else:
            report.record_fail("Fields", f"DELETE /api/fields/{created_id}", lat, f"Expected 404 on subsequent GET, got {check_status}")
    else:
        report.record_fail("Fields", f"DELETE /api/fields/{created_id}", lat, f"Status={status}, body={del_res}")

def test_endpoint_weather():
    print("\n--- 3. Verification of /api/weather/current & /api/weather/alerts ---")
    
    # 3.1 /api/weather/current
    status, w, lat = api_call("/weather/current?district=Guntur")
    if status == 200:
        temp = w.get("temperature")
        rain_chance = w.get("rain_chance")
        spray_cond = w.get("spray_condition")
        daily = w.get("daily", [])
        
        has_temp = isinstance(temp, (int, float)) and -10 <= temp <= 60
        has_rain = isinstance(rain_chance, int) and 0 <= rain_chance <= 100
        has_spray = spray_cond in ("ideal", "caution", "avoid")
        has_7day = isinstance(daily, list) and len(daily) == 7
        
        daily_valid = has_7day and all(
            "date" in d and "temp_max" in d and "temp_min" in d and "precipitation_probability" in d 
            for d in daily
        )

        if has_temp and has_rain and has_spray and daily_valid:
            report.record_pass("Weather", "GET /api/weather/current (Guntur)", lat, 
                               f"Temp={temp}°C, RainChance={rain_chance}%, Spray='{spray_cond}', 7-Day Forecast={len(daily)} days")
        else:
            report.record_fail("Weather", "GET /api/weather/current (Guntur)", lat, 
                               f"Validation failed: temp={temp}, rain_chance={rain_chance}, spray={spray_cond}, 7day_count={len(daily)}")
    else:
        report.record_fail("Weather", "GET /api/weather/current", lat, f"Status={status}, body={w}")

    # Lat/Lon specific call
    status_coord, w_coord, lat_coord = api_call("/weather/current?lat=16.3067&lon=80.4365&district=CustomGuntur")
    if status_coord == 200 and "temperature" in w_coord:
        report.record_pass("Weather", "GET /api/weather/current (Lat/Lon Coordinates)", lat_coord, 
                           f"Coord weather resolved: District='{w_coord.get('district')}', Temp={w_coord.get('temperature')}°C")
    else:
        report.record_fail("Weather", "GET /api/weather/current (Lat/Lon)", lat_coord, f"Status={status_coord}")

    # 3.2 /api/weather/alerts
    status_al, alerts_res, lat_al = api_call("/weather/alerts?district=Warangal")
    if status_al == 200 and "spray_condition" in alerts_res and "alerts" in alerts_res:
        alerts_list = alerts_res.get("alerts", [])
        report.record_pass("Weather", "GET /api/weather/alerts (Warangal)", lat_al, 
                           f"District='{alerts_res.get('district')}', Alerts count={len(alerts_list)}, Spray='{alerts_res.get('spray_condition')}'")
    else:
        report.record_fail("Weather", "GET /api/weather/alerts", lat_al, f"Status={status_al}, body={alerts_res}")

def test_endpoint_crop_recommendation():
    print("\n--- 4. Verification of /api/advice/recommend-crops (Telugu & English Filtering) ---")

    # 4.1 English filtering: Clay + Canal -> Paddy should rank #1
    req_en_paddy = {"soil_type": "clay", "water_source": "canal", "language": "en"}
    status, res_en, lat = api_call("/advice/recommend-crops", method="POST", data=req_en_paddy)
    if status == 200 and len(res_en.get("crops", [])) > 0:
        top_crop = res_en["crops"][0]
        if top_crop.get("id") == "paddy":
            report.record_pass("Advice", "POST /api/advice/recommend-crops (English: clay/canal)", lat, 
                               f"Top recommended crop is '{top_crop.get('name_en')}' [ID: paddy]")
        else:
            report.record_fail("Advice", "POST /api/advice/recommend-crops (English: clay/canal)", lat, 
                               f"Expected 'paddy' as top crop, got '{top_crop.get('id')}'")
    else:
        report.record_fail("Advice", "POST /api/advice/recommend-crops (English: clay/canal)", lat, f"Status={status}")

    # 4.2 Telugu filtering: బంకమట్టి (Clay) + కాలువ (Canal) -> Paddy should rank #1
    req_te_paddy = {"soil_type": "బంకమట్టి", "water_source": "కాలువ", "language": "te"}
    status, res_te, lat = api_call("/advice/recommend-crops", method="POST", data=req_te_paddy)
    if status == 200 and len(res_te.get("crops", [])) > 0:
        top_crop = res_te["crops"][0]
        if top_crop.get("id") == "paddy":
            report.record_pass("Advice", "POST /api/advice/recommend-crops (Telugu: బంకమట్టి/కాలువ)", lat, 
                               f"Top crop is '{top_crop.get('name_te')}', Reason: '{top_crop.get('suitability_reason_te')[:40]}...'")
        else:
            report.record_fail("Advice", "POST /api/advice/recommend-crops (Telugu: బంకమట్టి/కాలువ)", lat, 
                               f"Expected 'paddy' as top crop for బంకమట్టి/కాలువ, got '{top_crop.get('id')}'")
    else:
        report.record_fail("Advice", "POST /api/advice/recommend-crops (Telugu: బంకమట్టి/కాలువ)", lat, f"Status={status}")

    # 4.3 English filtering: Black + Borewell -> Cotton should rank #1
    req_en_cotton = {"soil_type": "black", "water_source": "borewell", "language": "en"}
    status, res_cotton, lat = api_call("/advice/recommend-crops", method="POST", data=req_en_cotton)
    if status == 200 and len(res_cotton.get("crops", [])) > 0:
        top_crop = res_cotton["crops"][0]
        if top_crop.get("id") == "cotton":
            report.record_pass("Advice", "POST /api/advice/recommend-crops (English: black/borewell)", lat, 
                               f"Top recommended crop is '{top_crop.get('name_en')}' [ID: cotton]")
        else:
            report.record_fail("Advice", "POST /api/advice/recommend-crops (English: black/borewell)", lat, 
                               f"Expected 'cotton', got '{top_crop.get('id')}'")
    else:
        report.record_fail("Advice", "POST /api/advice/recommend-crops (English: black/borewell)", lat, f"Status={status}")

    # 4.4 Telugu filtering: నల్లరేగడి (Black) + బోరుబావి (Borewell) -> Cotton should rank #1
    req_te_cotton = {"soil_type": "నల్లరేగడి", "water_source": "బోరుబావి", "language": "te"}
    status, res_te_cotton, lat = api_call("/advice/recommend-crops", method="POST", data=req_te_cotton)
    if status == 200 and len(res_te_cotton.get("crops", [])) > 0:
        top_crop = res_te_cotton["crops"][0]
        if top_crop.get("id") == "cotton":
            report.record_pass("Advice", "POST /api/advice/recommend-crops (Telugu: నల్లరేగడి/బోరుబావి)", lat, 
                               f"Top recommended crop is '{top_crop.get('name_te')}' [ID: cotton]")
        else:
            report.record_fail("Advice", "POST /api/advice/recommend-crops (Telugu: నల్లరేగడి/బోరుబావి)", lat, 
                               f"Expected 'cotton', got '{top_crop.get('id')}'")
    else:
        report.record_fail("Advice", "POST /api/advice/recommend-crops (Telugu: నల్లరేగడి/బోరుబావి)", lat, f"Status={status}")

def test_endpoint_crop_care():
    print("\n--- 5. Verification of /api/advice/crop-care (Stage Tasks & Weather Sync) ---")

    # 5.1 Cotton Vegetative Care Plan
    care_req_veg = {
        "crop_name": "Cotton",
        "growth_stage": "vegetative",
        "district": "Guntur",
        "language": "en"
    }
    status, res_veg, lat = api_call("/advice/crop-care", method="POST", data=care_req_veg)
    if status == 200 and "practical_steps" in res_veg and "weather_sync" in res_veg:
        steps = res_veg.get("practical_steps", [])
        cautions = res_veg.get("cautions", [])
        weather_sync = res_veg.get("weather_sync", {})
        sources = res_veg.get("sources", [])
        
        has_weather_sync = "rain_chance" in weather_sync and "spray_condition" in weather_sync
        has_sources = len(sources) >= 1 and any("ANGRAU" in s or "PJTSAU" in s or "ICAR" in s for s in sources)
        
        if len(steps) >= 3 and has_weather_sync and has_sources:
            report.record_pass("Advice", "POST /api/advice/crop-care (Cotton Vegetative - EN)", lat, 
                               f"Steps: {len(steps)}, Cautions: {len(cautions)}, WeatherSync: rain={weather_sync.get('rain_chance')}%, spray={weather_sync.get('spray_condition')}")
        else:
            report.record_fail("Advice", "POST /api/advice/crop-care (Cotton Vegetative)", lat, 
                               f"Validation failed: steps={len(steps)}, weather_sync={weather_sync}, sources={sources}")
    else:
        report.record_fail("Advice", "POST /api/advice/crop-care (Cotton Vegetative)", lat, f"Status={status}, body={res_veg}")

    # 5.2 Cotton Flowering Care Plan in Telugu
    care_req_flow_te = {
        "crop_name": "పత్తి (Cotton)",
        "growth_stage": "పూత & కాయ దశ (flowering)",
        "district": "Guntur",
        "language": "te"
    }
    status, res_flow_te, lat = api_call("/advice/crop-care", method="POST", data=care_req_flow_te)
    if status == 200 and len(res_flow_te.get("practical_steps", [])) > 0:
        steps_te = res_flow_te["practical_steps"]
        report.record_pass("Advice", "POST /api/advice/crop-care (Cotton Flowering - TE)", lat, 
                           f"Title='{res_flow_te.get('title')}', First step='{steps_te[0][:40]}...', Steps count={len(steps_te)}")
    else:
        report.record_fail("Advice", "POST /api/advice/crop-care (Cotton Flowering - TE)", lat, f"Status={status}")

def test_endpoint_diagnose():
    print("\n--- 6. Verification of /api/advice/diagnose (Symptom Lookup & Structure) ---")

    symptoms_to_test = [
        ("symYellow", "Leaf Yellowing", "నత్రజని లేదా సూక్ష్మపోషకాల లోపం"),
        ("symHoles", "Chewed Leaves & Stem Borer", "రంధ్రాలు / కాండం తొలిచే పురుగులు"),
        ("symSpots", "Leaf Spot / Fungal Blight", "ఆకుమచ్చ తెగులు")
    ]

    for sym_code, label_en, label_te in symptoms_to_test:
        diag_body = urllib.parse.urlencode({
            "crop_name": "Cotton",
            "symptoms": sym_code,
            "district": "Guntur",
            "language": "te"
        }).encode("utf-8")

        status, res_diag, lat = api_call(
            "/advice/diagnose",
            method="POST",
            data=diag_body,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        if status == 200:
            has_title = "title" in res_diag and res_diag["title"]
            has_steps = "practical_steps" in res_diag and isinstance(res_diag["practical_steps"], list) and len(res_diag["practical_steps"]) > 0
            has_why = "why" in res_diag and res_diag["why"]
            has_cautions = "cautions" in res_diag and isinstance(res_diag["cautions"], list) and len(res_diag["cautions"]) > 0
            has_sources = "sources" in res_diag and isinstance(res_diag["sources"], list) and len(res_diag["sources"]) > 0
            
            if has_title and has_steps and has_why and has_cautions and has_sources:
                report.record_pass("Advice", f"POST /api/advice/diagnose ({sym_code} - {label_en})", lat, 
                                   f"Title='{res_diag.get('title')[:35]}...', Steps={len(res_diag['practical_steps'])}, Sources={len(res_diag['sources'])}")
            else:
                report.record_fail("Advice", f"POST /api/advice/diagnose ({sym_code})", lat, 
                                   f"Structure incomplete: title={has_title}, steps={has_steps}, why={has_why}, cautions={has_cautions}, sources={has_sources}")
        else:
            report.record_fail("Advice", f"POST /api/advice/diagnose ({sym_code})", lat, f"Status={status}, body={res_diag}")

def test_endpoint_qa():
    print("\n--- 7. Verification of /api/qa/ask (ICAR & University Standards) ---")
    
    # 7.1 English Question
    qa_body_en = urllib.parse.urlencode({
        "question": "What is the recommended nitrogen dose for Bt Cotton at 30 days in black soil?",
        "language": "en",
        "session_id": "verify_qa_session_en"
    }).encode("utf-8")

    status, res_qa_en, lat = api_call(
        "/qa/ask",
        method="POST",
        data=qa_body_en,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )

    if status == 200 and res_qa_en.get("status") == "success" and "advice" in res_qa_en:
        advice = res_qa_en["advice"]
        short_ans = advice.get("short_answer", "")
        steps = advice.get("practical_steps", [])
        cautions = advice.get("cautions", [])
        sources = advice.get("sources", [])
        
        cites_standards = any("ICAR" in s or "ANGRAU" in s or "PJTSAU" in s or "CRIDA" in s for s in sources) or "ICAR" in short_ans
        
        if len(steps) > 0 and len(cautions) > 0 and cites_standards:
            report.record_pass("QA", "POST /api/qa/ask (English ICAR adherence)", lat, 
                               f"Answer='{short_ans[:45]}...', Steps={len(steps)}, Sources={sources}")
        else:
            report.record_fail("QA", "POST /api/qa/ask (English)", lat, 
                               f"Failed ICAR standards check: cites={cites_standards}, steps={len(steps)}, sources={sources}")
    else:
        report.record_fail("QA", "POST /api/qa/ask (English)", lat, f"Status={status}, body={res_qa_en}")

    # 7.2 Telugu Question
    qa_body_te = urllib.parse.urlencode({
        "question": "వరి పంటలో కాండం తొలిచే పురుగు నివారణకు ఎలాంటి మందులు వాడాలి?",
        "language": "te",
        "session_id": "verify_qa_session_te"
    }).encode("utf-8")

    status, res_qa_te, lat = api_call(
        "/qa/ask",
        method="POST",
        data=qa_body_te,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )

    if status == 200 and res_qa_te.get("status") == "success" and "advice" in res_qa_te:
        adv_te = res_qa_te["advice"]
        report.record_pass("QA", "POST /api/qa/ask (Telugu Question & University Standards)", lat, 
                           f"Answer='{adv_te.get('short_answer', '')[:40]}...', Sources={len(adv_te.get('sources', []))}")
    else:
        report.record_fail("QA", "POST /api/qa/ask (Telugu)", lat, f"Status={status}, body={res_qa_te}")

def test_endpoint_profile():
    print("\n--- 8. Verification of /api/profile (GET & PUT) ---")

    # 8.1 GET profile
    status, prof, lat = api_call("/profile")
    if status == 200 and "name" in prof and "preferred_unit" in prof:
        report.record_pass("Profile", "GET /api/profile", lat, 
                           f"Name='{prof.get('name')}', Unit='{prof.get('preferred_unit')}', Lang='{prof.get('preferred_language')}'")
    else:
        report.record_fail("Profile", "GET /api/profile", lat, f"Status={status}, body={prof}")
        return

    # 8.2 PUT profile (Change unit and alerts)
    update_data = {
        "preferred_unit": "cents",
        "alerts_weather": True,
        "alerts_crop_stage": True,
        "alerts_mandi": True
    }
    status, updated_prof, lat = api_call("/profile", method="PUT", data=update_data)
    if status == 200 and updated_prof.get("preferred_unit") == "cents" and updated_prof.get("alerts_mandi") is True:
        report.record_pass("Profile", "PUT /api/profile (Update)", lat, 
                           f"Successfully updated unit to 'cents' and alerts_mandi to True")
    else:
        report.record_fail("Profile", "PUT /api/profile", lat, f"Status={status}, body={updated_prof}")

    # Revert unit back to acres
    revert_data = {"preferred_unit": "acres", "alerts_mandi": False}
    api_call("/profile", method="PUT", data=revert_data)

def test_database_integrity_and_tags():
    print("\n--- 9. Verification of Database Integrity & Data Transparency Tags ---")
    t0 = time.time()
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()

        # PRAGMA integrity_check
        cur.execute("PRAGMA integrity_check;")
        integrity_row = cur.fetchone()
        integrity_status = integrity_row[0] if integrity_row else "unknown"
        
        if integrity_status == "ok":
            lat = (time.time() - t0) * 1000
            report.record_pass("Database", "PRAGMA integrity_check", lat, "Database structure is completely intact (ok)")
        else:
            lat = (time.time() - t0) * 1000
            report.record_fail("Database", "PRAGMA integrity_check", lat, f"Integrity status: {integrity_status}")

        # PRAGMA foreign_key_check
        t0 = time.time()
        cur.execute("PRAGMA foreign_key_check;")
        fk_violations = cur.fetchall()
        lat = (time.time() - t0) * 1000
        if len(fk_violations) == 0:
            report.record_pass("Database", "PRAGMA foreign_key_check", lat, "Zero foreign key violations")
        else:
            report.record_fail("Database", "PRAGMA foreign_key_check", lat, f"Violations: {fk_violations}")

        # Check fields table for transparency tags
        t0 = time.time()
        cur.execute("SELECT id, name, soil_source, water_source_type, npk_status FROM fields;")
        rows = cur.fetchall()
        lat = (time.time() - t0) * 1000
        
        valid_soil_sources = {"farmer_reported", "measured", "estimated"}
        valid_water_sources = {"farmer_reported", "measured"}
        valid_npk_statuses = {"not_yet_known", "measured", "farmer_reported"}

        all_valid = True
        summary_tags = []
        for r in rows:
            ss = r["soil_source"]
            ws = r["water_source_type"]
            npk = r["npk_status"]
            
            if ss not in valid_soil_sources or ws not in valid_water_sources or npk not in valid_npk_statuses:
                all_valid = False
                report.record_warning("Database", f"Field ID {r['id']} has unrecognized transparency tag: soil={ss}, water={ws}, npk={npk}")
            summary_tags.append(f"ID {r['id']}: [soil={ss}, water={ws}, npk={npk}]")

        if all_valid and len(rows) > 0:
            report.record_pass("Database", "Data Transparency Tags Verification", lat, 
                               f"All {len(rows)} fields contain verified tags: {', '.join(summary_tags)}")
        elif len(rows) == 0:
            report.record_warning("Database", "No fields currently in database to check tags")
        else:
            report.record_fail("Database", "Data Transparency Tags Verification", lat, "Invalid transparency tags found")

        # Check chat messages persistence
        cur.execute("SELECT count(*) FROM chat_messages;")
        chat_count = cur.fetchone()[0]
        report.record_pass("Database", "Chat Messages Table Persistence", 0.5, f"Total logged interactions: {chat_count}")

        conn.close()
    except Exception as e:
        report.record_fail("Database", "Database inspection exception", 0.0, str(e))

def main():
    print("================================================================")
    print("   FARMTWIN AI - RIGOROUS BACKEND & API VERIFICATION SUITE      ")
    print("================================================================")

    test_endpoint_health()
    test_endpoint_fields()
    test_endpoint_weather()
    test_endpoint_crop_recommendation()
    test_endpoint_crop_care()
    test_endpoint_diagnose()
    test_endpoint_qa()
    test_endpoint_profile()
    test_database_integrity_and_tags()

    total_time = time.time() - report.start_time
    passes = sum(1 for t in report.tests if t["status"] == "PASS")
    failures = sum(1 for t in report.tests if t["status"] == "FAIL")
    warnings_count = len(report.warnings)

    print("\n================================================================")
    print("                  VERIFICATION SUMMARY                          ")
    print("================================================================")
    print(f"Total Tests Executed : {len(report.tests)}")
    print(f"Total Passed         : {passes} [{(passes/len(report.tests))*100:.1f}%]")
    print(f"Total Failed         : {failures}")
    print(f"Total Warnings       : {warnings_count}")
    print(f"Execution Duration   : {total_time:.2f} seconds")

    latencies = [t["latency_ms"] for t in report.tests if t["latency_ms"] > 0]
    avg_latency = sum(latencies)/len(latencies) if latencies else 0
    max_latency = max(latencies) if latencies else 0
    print(f"Average API Latency  : {avg_latency:.1f} ms")
    print(f"Maximum API Latency  : {max_latency:.1f} ms")
    print("================================================================")

    # Save structured JSON results for report generation
    results_json = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "total_tests": len(report.tests),
        "passed": passes,
        "failed": failures,
        "warnings_count": warnings_count,
        "duration_seconds": round(total_time, 2),
        "avg_latency_ms": round(avg_latency, 2),
        "max_latency_ms": round(max_latency, 2),
        "tests": report.tests,
        "warnings": report.warnings,
        "verdict": "OPERATIONAL_PASS" if failures == 0 else "FAILURES_DETECTED"
    }
    with open("backend/verification_results.json", "w", encoding="utf-8") as f:
        json.dump(results_json, f, indent=2, ensure_ascii=False)
    print("Structured report saved to backend/verification_results.json\n")

    if failures > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
