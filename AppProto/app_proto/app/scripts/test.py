from logs import logDecorator 

MODULE_NAME = "test.py"

@logDecorator.genericLog(MODULE_NAME)
def testFunction():
    raise Exception("TEST EXCEPTION!!!")

    return "Test Function Return"

@logDecorator.mainLog(MODULE_NAME)
def main():
    testFunction()


    return "Main Function return"

if __name__ == "__main__":
    print(main())