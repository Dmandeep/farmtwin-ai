import urllib.request
import urllib.parse
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(path, method="GET", data=None, headers=None):
    url = f"{BASE_URL}{path}"
    req_headers = headers or {}
    req_data = None
    if data is not None:
        if isinstance(data, dict):
            req_data = json.dumps(data).encode("utf-8")
            req_headers["Content-Type"] = "application/json"
        elif isinstance(data, (bytes, bytearray)):
            req_data = data
        else:
            req_data = str(data).encode("utf-8")
    
    req = urllib.request.Request(url, data=req_data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        return e.code, json.loads(body) if body else {}
    except Exception as e:
        return 500, {"error": str(e)}

def run_tests():
    passed = 0
    failed = 0

    print("==========================================")
    print("FARMTWIN AI BACKEND AUTOMATED TEST SUITE")
    print("==========================================")

    # 1. Health check
    status, res = make_request("/health")
    if status == 200 and res.get("status") == "healthy":
        print("[PASS] 1. Health Check passed")
        passed += 1
    else:
        print(f"[FAIL] 1. Health Check failed: {status} {res}")
        failed += 1

    # 2. Get Fields
    status, fields = make_request("/fields")
    if status == 200 and isinstance(fields, list):
        print(f"[PASS] 2. Fields Listing passed: found {len(fields)} fields")
        passed += 1
    else:
        print(f"[FAIL] 2. Fields Listing failed: {status} {fields}")
        failed += 1

    # 3. Create Field
    new_field_payload = {
        "name": "North Canal Plot (ఉత్తర కాలువ చేను)",
        "state": "Andhra Pradesh",
        "district": "Krishna",
        "village": "Gudivada",
        "size": "2 – 5 Acres",
        "soil_type": "clay",
        "water_source": "canal",
        "assistance_needed": "choose_crop",
        "current_crop": "Paddy"
    }
    status, new_field = make_request("/fields", method="POST", data=new_field_payload)
    if status == 201 and new_field.get("id"):
        created_id = new_field["id"]
        print(f"[PASS] 3. Create Field passed: created id {created_id}")
        passed += 1
    else:
        print(f"[FAIL] 3. Create Field failed: {status} {new_field}")
        created_id = None
        failed += 1

    # 4. Set Active Field
    if created_id:
        status, act_res = make_request(f"/fields/{created_id}/set-active", method="POST")
        if status == 200 and act_res.get("is_active") is True:
            print("[PASS] 4. Set Active Field passed")
            passed += 1
        else:
            print(f"[FAIL] 4. Set Active Field failed: {status} {act_res}")
            failed += 1

    # 5. Live Weather Check (Open-Meteo)
    status, weather = make_request("/weather/current?district=Guntur")
    if status == 200 and "temperature" in weather and "spray_condition" in weather:
        print(f"[PASS] 5. Weather API passed: Temp={weather['temperature']}°C, Condition='{weather['condition']}', Spray='{weather['spray_condition']}'")
        passed += 1
    else:
        print(f"[FAIL] 5. Weather API failed: {status} {weather}")
        failed += 1

    # 6. Weather Alerts Check
    status, alerts_res = make_request("/weather/alerts?district=Warangal")
    if status == 200 and "spray_condition" in alerts_res:
        print(f"[PASS] 6. Weather Alerts passed: Spray status: {alerts_res.get('spray_condition')}")
        passed += 1
    else:
        print(f"[FAIL] 6. Weather Alerts failed: {status} {alerts_res}")
        failed += 1

    # 7. Crop Recommendation Advisory
    crop_req = {
        "soil_type": "black",
        "water_source": "borewell",
        "district": "Guntur",
        "language": "te"
    }
    status, crop_res = make_request("/advice/recommend-crops", method="POST", data=crop_req)
    if status == 200 and len(crop_res.get("crops", [])) > 0:
        first_crop = crop_res["crops"][0]
        print(f"[PASS] 7. Crop Recommendation passed: Found {len(crop_res['crops'])} crops, first: {first_crop.get('name_te')}")
        passed += 1
    else:
        print(f"[FAIL] 7. Crop Recommendation failed: {status} {crop_res}")
        failed += 1

    # 8. Crop Care Plan with Weather Sync
    care_req = {
        "crop_name": "Cotton",
        "growth_stage": "vegetative",
        "district": "Guntur",
        "language": "en"
    }
    status, care_res = make_request("/advice/crop-care", method="POST", data=care_req)
    if status == 200 and len(care_res.get("practical_steps", [])) > 0:
        print(f"[PASS] 8. Crop Care Plan passed: {len(care_res['practical_steps'])} steps, Cautions: {len(care_res.get('cautions', []))}")
        passed += 1
    else:
        print(f"[FAIL] 8. Crop Care Plan failed: {status} {care_res}")
        failed += 1

    # 9. Symptom Diagnosis (What to do, Why, Cautions, Sources)
    diag_body = urllib.parse.urlencode({
        "crop_name": "Cotton",
        "symptoms": "symYellow",
        "district": "Guntur",
        "language": "te"
    }).encode("utf-8")
    status, diag_res = make_request(
        "/advice/diagnose", 
        method="POST", 
        data=diag_body, 
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    if status == 200 and "practical_steps" in diag_res and "cautions" in diag_res:
        print(f"[PASS] 9. Symptom Diagnosis passed: Title='{diag_res.get('title')}', Sources: {len(diag_res.get('sources', []))}")
        passed += 1
    else:
        print(f"[FAIL] 9. Symptom Diagnosis failed: {status} {diag_res}")
        failed += 1

    # 10. Ask a Question (Conversational Gemini / Heuristic)
    qa_body = urllib.parse.urlencode({
        "question": "What fertilizer dose for paddy at 30 days?",
        "language": "en",
        "session_id": "test_session_1"
    }).encode("utf-8")
    status, qa_res = make_request(
        "/qa/ask",
        method="POST",
        data=qa_body,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    if status == 200 and qa_res.get("status") == "success" and "advice" in qa_res:
        print(f"[PASS] 10. Ask a Question passed: Answer='{qa_res['advice'].get('short_answer')[:60]}...'")
        passed += 1
    else:
        print(f"[FAIL] 10. Ask a Question failed: {status} {qa_res}")
        failed += 1

    # 11. Profile Get & Update
    status, prof = make_request("/profile")
    if status == 200 and "name" in prof:
        print(f"[PASS] 11. Profile Get passed: Name='{prof.get('name')}', Unit='{prof.get('preferred_unit')}'")
        passed += 1
    else:
        print(f"[FAIL] 11. Profile Get failed: {status} {prof}")
        failed += 1

    # Update profile
    prof_update = {"preferred_unit": "gunthas", "alerts_mandi": True}
    status, prof_updated = make_request("/profile", method="PUT", data=prof_update)
    if status == 200 and prof_updated.get("preferred_unit") == "gunthas":
        print("[PASS] 12. Profile Update passed: Unit updated to 'gunthas'")
        passed += 1
    else:
        print(f"[FAIL] 12. Profile Update failed: {status} {prof_updated}")
        failed += 1

    # 12. Delete Test Field
    if created_id:
        status, _ = make_request(f"/fields/{created_id}", method="DELETE")
        if status in (200, 204):
            print(f"[PASS] 13. Delete Field passed: removed id {created_id}")
            passed += 1
        else:
            print(f"[FAIL] 13. Delete Field failed: {status}")
            failed += 1

    print("==========================================")
    print(f"RESULTS: {passed} PASSED, {failed} FAILED")
    print("==========================================")

    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
