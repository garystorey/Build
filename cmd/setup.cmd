@echo off

@echo Creating folders....

cd ..

mkdir docs

mkdir docs\core

mkdir docs\mp

mkdir docs\build

mkdir dest\js

mkdir dest\css

@echo Initial Build....

copy config\sp.config.txt config\sp.config.js

gulp initial
