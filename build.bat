@echo off
setlocal enabledelayedexpansion

set BINARY_NAME=future.exe

if "%1"=="" goto build
if "%1"=="build" goto build
if "%1"=="clean" goto clean
if "%1"=="run" goto run
goto help

:build
echo Building...
for /f "tokens=*" %%i in ('git describe --tags --always --dirty') do set VERSION=%%i
go build -ldflags "-X main.version=%VERSION%" -o %BINARY_NAME% .\cmd\future
if %ERRORLEVEL% neq 0 (
    echo Build failed
    exit /b %ERRORLEVEL%
)
echo Build successful: %BINARY_NAME% created in the current directory.
goto :eof

:clean
echo Cleaning...
if exist %BINARY_NAME% del %BINARY_NAME%
echo Clean successful
goto :eof

:run
call :build
if %ERRORLEVEL% neq 0 (
    echo Build failed, cannot run
    exit /b %ERRORLEVEL%
)
echo Running...
.\%BINARY_NAME% %2 %3 %4 %5 %6 %7 %8 %9
goto :eof

:help
echo Usage:
echo   build.bat               - Build the project (default)
echo   build.bat build         - Build the project
echo   build.bat clean         - Clean build artifacts
echo   build.bat run [args]    - Build and run the project with optional arguments
goto :eof
