import uvicorn
import threading
import time
import requests

def run_server():
    from main import app
    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="error")

t = threading.Thread(target=run_server, daemon=True)
t.start()

time.sleep(3) # Wait for server to start

try:
    print("Testing Women category...")
    r1 = requests.get("http://127.0.0.1:8001/categories?gender=Women", timeout=5)
    print("Women:", r1.status_code, r1.text[:100])
    
    print("Testing Kids category...")
    r2 = requests.get("http://127.0.0.1:8001/categories?gender=Kids", timeout=5)
    print("Kids:", r2.status_code, r2.text)
except Exception as e:
    print("Error:", e)
