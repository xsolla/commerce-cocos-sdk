@echo OFF
echo =====================
echo BUILD ANDROID PROJECT

rem =================================
rem Define variables from launch args
set PROJECT_PATH=%1
echo PROJECT_PATH: %PROJECT_PATH%

rem =========================
rem Copy activities files
set SOURCE_PATH="%PROJECT_PATH%\extensions\xsolla-commerce-sdk\native\android\Activities"
set DEST_PATH="%PROJECT_PATH%\native\engine\android\app\src\com\cocos\game"
robocopy %SOURCE_PATH% %DEST_PATH% /s /z

rem =========================
rem Copy AndroidManifest.xml
set SOURCE_PATH="%PROJECT_PATH%\cicd\android\AndroidManifest.xml"
set DEST_PATH="%PROJECT_PATH%\native\engine\android\app\AndroidManifest.xml"
copy %SOURCE_PATH% %DEST_PATH%

rem =========================
rem Copy build.gradle
set SOURCE_PATH="%PROJECT_PATH%\cicd\android\build.gradle"
set DEST_PATH="%PROJECT_PATH%\native\engine\android\app\build.gradle"
copy %SOURCE_PATH% %DEST_PATH%

rem =========================
rem Copy proguard-rules.pro
set SOURCE_PATH="%PROJECT_PATH%\cicd\android\proguard-rules.pro"
set DEST_PATH="%PROJECT_PATH%\native\engine\android\app\proguard-rules.pro"
copy %SOURCE_PATH% %DEST_PATH%

rem =========================
rem Add gradle.properties settings
set SOURCE_PATH="%PROJECT_PATH%\cicd\android\gradle.properties"
set DEST_PATH="%PROJECT_PATH%\build\android\proj\gradle.properties"
type %SOURCE_PATH% >> %DEST_PATH%

rem =========================
rem Create android project build command and execute it
cd %PROJECT_PATH%\build\android\proj
set BUILD_COMMAND=.\gradlew.bat XsollaCommerceSdk:assembleRelease
echo BUILD_COMMAND: %BUILD_COMMAND%
call %BUILD_COMMAND%

exit /b %errorlevel%