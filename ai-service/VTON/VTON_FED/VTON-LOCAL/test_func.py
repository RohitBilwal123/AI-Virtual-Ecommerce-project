import sys
import os

os.chdir(r"c:\Users\navee\OneDrive\Desktop\VTON - Project\VTON-LOCAL")
sys.path.append(os.getcwd())

from main import get_categories

try:
    print("Testing Women:")
    res_women = get_categories("Women")
    print(res_women)
    
    print("\nTesting Kids:")
    res_kids = get_categories("Kids")
    print(res_kids)
except Exception as e:
    import traceback
    traceback.print_exc()
