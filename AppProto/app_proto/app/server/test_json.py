import json 
import os 
import pprint 

BASE_DIR = os.path.dirname(__file__)

def create():
    """
    Handle JSON file creation
    """
    name = str(input("Enter file name: ")).strip() 
    place = os.path.join(BASE_DIR, name + '.json')

    info = str(input("Enter key:val as key1:val1,key2:val2, ... ")).strip()
    pairs = info.split(',')
    dic = dict() 
    for pair in pairs:
        key, val = pair.split(':')
        dic[key] = val 

    with open(place, 'w') as f: 
        f.write(json.dumps(dic))

def read():
    """
    Handle read operation
    """
    while True: 
        name = str(input("File name (must be in same directory): "))
        if name.endswith('.json'):
            check = os.path.join(BASE_DIR, name)
        else: 
            check = os.path.join(BASE_DIR, name + '.json')
        if os.path.exists(check):
            break 
    
    with open(check) as f: 
        pprint.pprint(json.load(f))

def main():
    """
    Handle JSON testing 
    Only supports (READ), (CREATE)
    """

    print("ONLY FOR DEV TESTING PURPOSES")
    print("CMD/CTRL + C to quit at any time")

    choice = ''
    choices = set(('read', 'create')) 
    while choice.lower() not in choices:
        choice = str(input("(READ) or (CREATE) JSON file? ")).strip()
    if choice.lower() == 'read':
        read()
    elif choice.lower() == 'create': 
        create() 

if __name__ == '__main__':
    main() 