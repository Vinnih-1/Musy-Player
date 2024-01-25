#!/bin/bash

# Script to clean and build final apk release
cd android

echo "Cleaning build folder..."
./gradlew clean

echo "Building release app..."
./gradlew assembleRelease

cd ..

exit 0