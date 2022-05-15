@echo OFF
echo ===================
echo BUILD COCOS PROJECT

rem =================================
rem Define variables from launch args
set PROJECT_PATH=%1
set BUILD_TARGET=%2

echo PROJECT_PATH: %PROJECT_PATH%
echo BUILD_TARGET: %BUILD_TARGET%

rem =========================
rem Clear build target folder
set BUILD_TARGET_PATH="%PROJECT_PATH%\build\%BUILD_TARGET%"
echo BUILD_TARGET_PATH: %BUILD_TARGET_PATH%

if exist %BUILD_TARGET_PATH% (rmdir /s /q %BUILD_TARGET_PATH%)
mkdir %BUILD_TARGET_PATH%

rem =========================
rem Clear build native folder
SET BUILD_NATIVE_PATH="%PROJECT_PATH%\native"
echo BUILD_NATIVE_PATH: %BUILD_NATIVE_PATH%

if exist %BUILD_NATIVE_PATH% (rmdir /s /q %BUILD_NATIVE_PATH%)

rem =========================
rem Select build config path
set BUILD_CONFIG_PATH="%PROJECT_PATH%\cicd\build-config-web-desktop.json"
if %BUILD_TARGET%==android (set BUILD_CONFIG_PATH="%PROJECT_PATH%\cicd\build-config-android.json")
echo BUILD_CONFIG_PATH: %BUILD_CONFIG_PATH%

rem ===================================
rem Create cocos project build command and execute it
set COCOS_EDITOR_PATH="C:\CocosDashboard_1.2.0\resources\.editors\Creator\3.3.1\CocosCreator.exe"
set COCOS_HOME_PATH="C:\Users\Runner\.CocosCreator"

set BUILD_COMMAND=%COCOS_EDITOR_PATH% --project "%PROJECT_PATH%" --home %COCOS_HOME_PATH% --build "configPath=%BUILD_CONFIG_PATH%"
echo BUILD_COMMAND: %BUILD_COMMAND%
call %BUILD_COMMAND%

rem ===================================
rem Finish if this is a WebGL build
if %BUILD_TARGET%==web-desktop (
	rem Cocos Creator return exit code 36 on successful build ¯\_(ツ)_/¯
	if errorlevel 36 (
		exit /b 0
	) else (
		exit /b %errorlevel%
	)
)

rem ===================================
rem Launch android build script
if %BUILD_TARGET%==android (
	call "%PROJECT_PATH%\cicd\build-demo-android.bat" %PROJECT_PATH%
)