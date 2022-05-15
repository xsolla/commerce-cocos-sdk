@echo OFF
echo ===================
echo AFTER BUILDS ACTIONS

rem ===================================
rem Force kill cocos and java processes
tasklist | find /i "CocosCreator.exe" && taskkill /im CocosCreator.exe /F || echo process "CocosCreator.exe" not running.
tasklist | find /i "java.exe" && taskkill /im java.exe /F || echo process "java.exe" not running.