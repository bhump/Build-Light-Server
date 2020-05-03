import sys
import os
basepath = os.path.abspath(__file__)
parentdir = os.path.dirname(basepath)
picdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'pic')
libdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'lib')

print(basepath)
print(picdir)
print(libdir)

print('#Hello from python#')
print('First param:'+sys.argv[1]+'#')
print('Second param:'+sys.argv[2]+'#')
print('Third param:'+sys.argv[3]+'#')
print('Fourth param:'+sys.argv[4]+'#')