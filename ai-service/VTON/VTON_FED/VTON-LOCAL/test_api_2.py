import requests
try:
    print("Testing Kids category on port 8000...")
    r2 = requests.get("http://localhost:8000/categories?gender=Kids", timeout=5)
    print("Kids:", r2.status_code, r2.text)
except Exception as e:
    print("Error:", e)
