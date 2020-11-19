"""
Exists for future potential to package into one executable 
"""


import sys 

import csvmat 
import actions 
import graphs

def main(): 
    funcs = {
        'csvmat': csvmat.main, 
        'actions': actions.main, 
        'graphs': graphs.main,
    }

    mod_name = sys.argv[1]

    if not mod_name in funcs: 
        return "False"

    func = funcs[mod_name]

    return func()

if __name__ == "__main__":
    print(main())
    sys.stdout.flush()
    # print('hi')