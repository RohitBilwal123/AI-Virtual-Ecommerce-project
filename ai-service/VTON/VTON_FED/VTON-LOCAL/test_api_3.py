import requests
try:
    print("Testing Women category on 127.0.0.1:8000...")
    r1 = requests.get("http://127.0.0.1:8000/categories?gender=Women", timeout=5)
    print("Women:", r1.status_code, r1.text[:50])
except Exception as e:
    print("Error Women:", e)

try:
    print("Testing Kids category on 127.0.0.1:8000...")
    r2 = requests.get("http://127.0.0.1:8000/categories?gender=Kids", timeout=5)
    print("Kids:", r2.status_code, r2.text[:50])
except Exception as e:
    print("Error Kids:", e)
