"""
JSON Helper Module 
- Read
- Create 
"""

import json
import os 

def read(file_path: str) -> dict: 
    """
    String file_path to read from
    - IF exists, json as dict returned, ELSE None  
    """
    if not os.path.exists(file_path): return None 

    with open(file_path) as f: 
        info = json.load(f)
    
    return info 

def create(file_path: str, info: dict) -> bool: 
    """
    String file_path to write to with dict info as JSON
    - Will pretty much never fail (rewrites files even if exists,
    creates new files if does not exist) so use with caution
    - IF successful, True, ELSE False 
    """
    try: 
        with open(file_path, 'w') as f: 
            f.write(json.dumps(info))
        return True 
    except Exception: 
        return False 