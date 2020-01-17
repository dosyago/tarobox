#!/bin/sh

g++ -I./base64/include -L./base64/lib -lbase64 -c tarobox.cpp
gcc -shared -o libtarobox.so tarobox.o
