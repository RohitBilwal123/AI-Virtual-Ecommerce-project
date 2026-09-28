import threading
import time
import requests
import uvicorn
from contextlib import contextmanager

def run_server():
    from main import app
    uvicorn.run(app, host="127.0.0.1", port=8002, log_level="error")

t = threading.Thread(target=run_server, daemon=True)
t.start()

print("Waiting for server to start...")
time.sleep(5)

try:
    print("Testing Women category on port 8002...")
    r1 = requests.get("http://127.0.0.1:8002/categories?gender=Women", timeout=5)
    print("Women status:", r1.status_code)
    print("Women result:", r1.text[:100])
except Exception as e:
    print("Error Women:", e)

try:
    print("Testing Kids category on port 8002...")
    r2 = requests.get("http://127.0.0.1:8002/categories?gender=Kids", timeout=5)
    print("Kids status:", r2.status_code)
    print("Kids result:", r2.text)
except Exception as e:
    print("Error Kids:", e)
