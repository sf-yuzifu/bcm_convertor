@echo off
setlocal
chcp 65001 2>nul >nul

set java_exe=java.exe

if defined JAVA_HOME (
    set java_exe="%JAVA_HOME%\bin\java.exe"
)

set apktool_jar=%~dp0apktool.jar

if exist "%apktool_jar%" (
    %java_exe% -jar "%apktool_jar%" %*
) else (
    echo apktool.jar not found in %~dp0
    exit /b 1
)
