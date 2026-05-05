@echo off
setlocal

set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
set apksigner_jar=%ANDROID_HOME%\build-tools\33.0.1\lib\apksigner.jar

if not exist "%apksigner_jar%" (
    echo apksigner.jar not found at %apksigner_jar%
    echo Please install Android SDK Build-Tools 33.0.1 or later
    exit /b 1
)

java -jar "%apksigner_jar%" %*
