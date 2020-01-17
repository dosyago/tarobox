#!/bin/sh

g++ -g -Wall -L/home/cris/tarobox/c_src_ref -lbase64 -o main main.cpp tarobox.cpp
gdb ./main
