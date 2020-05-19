import sys
import os
from datetime import datetime
from datetime import timedelta
basepath = os.path.abspath(__file__)
parentdir = os.path.dirname(basepath)
picdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'pic')
libdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'lib')

# open("pyinit.txt", "w")

try:

    run_time = datetime.now() + timedelta(minutes=10)

    if run_time > datetime.now():
        print("run time is greater: true")
    elif run_time < datetime.now():
        print("run time is greater: false")

    openFile = open("pyinit.txt", "r")

    isInit = openFile.read()

    print("isInit " + isInit)

    if isInit == '':
        writeFile1 = open("pyinit.txt", "w")
        writeFile1.write("False")
        writeFile1.close()

    print("in try: " + isInit)

    if isInit == "False":
        writeFile2 = open("pyinit.txt", "w")
        writeFile2.write("False")
        writeFile2.close()

except IOError as e:
    isInit = "False"
    writeFile3 = open("pyinit.txt", "w")
    writeFile3.write("False")
    writeFile3.close()
    print("except" + isInit)
    print(e)

# print(basepath)
# print(picdir)
# print(libdir)

print('#Hello from python#')
print('First param:'+sys.argv[1]+'#')
print('Second param:'+sys.argv[2]+'#')
print('Third param:'+sys.argv[3]+'#')
print('Fourth param:'+sys.argv[4]+'#')
print('Fifth param:'+sys.argv[5]+'#')
print('Six param:'+sys.argv[6]+'#')

