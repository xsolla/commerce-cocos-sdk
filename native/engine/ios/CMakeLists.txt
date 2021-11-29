cmake_minimum_required(VERSION 3.8)
set(CMAKE_SYSTEM_NAME iOS)
set(APP_NAME "XsollaCommerceSdk"  CACHE STRING "Project Name")
project(${APP_NAME} CXX)

include(${CMAKE_CURRENT_LIST_DIR}/../common/CMakeLists.txt)

set(LIB_NAME ${APP_NAME}-mobile)

set(UI_RESOURCES)
set(PROJ_SOURCES)
set(PROJ_COMMON_SOURCES
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/Game.h
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/Game.cpp
)

if(NOT EXISTS ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/jsb_module_register.cpp)
    file(COPY "${COCOS_X_PATH}/cocos/bindings/manual/jsb_module_register.cpp"
        DESTINATION ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/)
endif()
list(APPEND PROJ_COMMON_SOURCES ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/jsb_module_register.cpp)

set(UI_RESOURCES
    ${CMAKE_CURRENT_LIST_DIR}/LaunchScreenBackground.png
    ${CMAKE_CURRENT_LIST_DIR}/Images.xcassets
    ${CMAKE_CURRENT_LIST_DIR}/Base.lproj/Localizable.strings
    ${CMAKE_CURRENT_LIST_DIR}/Base.lproj/LaunchScreen.storyboard
)


# -------------- SRART ---------------
# USED BY COCOS SERVICE, DON'T REMOVE!
if(EXISTS ${RES_DIR}/proj/service.cmake)
    set(SERVICE_NATIVE_DIR ${CMAKE_CURRENT_LIST_DIR})
    include(${RES_DIR}/proj/service.cmake)
endif()
# --------------  END ----------------

list(APPEND PROJ_SOURCES
    ${CMAKE_CURRENT_LIST_DIR}/AppDelegate.mm
    ${CMAKE_CURRENT_LIST_DIR}/AppDelegate.h
    ${CMAKE_CURRENT_LIST_DIR}/service/SDKWrapper.m
    ${CMAKE_CURRENT_LIST_DIR}/service/SDKWrapper.h
    ${CMAKE_CURRENT_LIST_DIR}/main.m
    ${CMAKE_CURRENT_LIST_DIR}/ViewController.mm
    ${CMAKE_CURRENT_LIST_DIR}/ViewController.h
	${CMAKE_CURRENT_LIST_DIR}/XsollaUtils.h
	${CMAKE_CURRENT_LIST_DIR}/XsollaUtils.mm
	${CMAKE_CURRENT_LIST_DIR}/XsollaNativeUtils.mm
	${CMAKE_CURRENT_LIST_DIR}/XsollaSDKLoginKitUnity-Bridging-Header.h
    ${UI_RESOURCES}
)

include_resources(${RES_DIR}/assets)

add_executable(${LIB_NAME} ${PROJ_SOURCES} ${ASSET_FILES} ${PROJ_COMMON_SOURCES})
source_group(TREE ${RES_DIR}/assets PREFIX "Resources" FILES ${ASSET_FILES})
source_group(TREE ${CMAKE_CURRENT_LIST_DIR} PREFIX "Source Files" FILES ${PROJ_SOURCES})
source_group(TREE ${CMAKE_CURRENT_LIST_DIR}/../common PREFIX "Source Files" FILES ${PROJ_COMMON_SOURCES})


# -------------- SRART ---------------
# USED BY COCOS SERVICE, DON'T REMOVE!
if(COMMAND service_insert_library)
    service_insert_library()
endif()
# --------------  END ----------------

target_link_libraries(${LIB_NAME} cocos2d
	${CMAKE_CURRENT_LIST_DIR}/Frameworks/XsollaSDKUtilities.framework
    ${CMAKE_CURRENT_LIST_DIR}/Frameworks/XsollaSDKLoginKit.framework
	${CMAKE_CURRENT_LIST_DIR}/Frameworks/XsollaSDKLoginKitUnity.framework
)
target_include_directories(${LIB_NAME} PRIVATE
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes
    ${CMAKE_CURRENT_LIST_DIR}/service
	${CMAKE_CURRENT_LIST_DIR}/Frameworks/XsollaSDKLoginKit.framework/Headers
	${CMAKE_CURRENT_LIST_DIR}/Frameworks/XsollaSDKLoginKitUnity.framework/Headers
	${CMAKE_CURRENT_LIST_DIR}/Frameworks/XsollaSDKUtilities.framework/Headers
)

set_target_properties(${LIB_NAME} PROPERTIES XCODE_ATTRIBUTE_LD_RUNPATH_SEARCH_PATHS "@executable_path/Frameworks")

set(EXECUTABLE_NAME ${LIB_NAME}) # referenced in Info.plist
set(PRODUCT_NAME ${APP_NAME})

set_target_properties(${LIB_NAME} PROPERTIES 
    MACOSX_BUNDLE_INFO_PLIST "${CMAKE_CURRENT_LIST_DIR}/Info.plist"
    MACOSX_BUNDLE 1
    RESOURCE "${UI_RESOURCES}"
    OSX_ARCHITECTURES "arm64;x86_64"
    MACOSX_DEPLOYMENT_TARGET ${TARGET_IOS_VERSION}
    XCODE_ATTRIBUTE_DEVELOPMENT_TEAM "${DEVELOPMENT_TEAM}"
    XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "iPhone Developer"
    XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_APPICON_NAME "AppIcon"
    XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_LAUNCHSTORYBOARD_NAME "LaunchScreen"
    XCODE_ATTRIBUTE_IPHONEOS_DEPLOYMENT_TARGET ${TARGET_IOS_VERSION}
    XCODE_ATTRIBUTE_ENABLE_BITCODE NO
    XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH YES
    IOS_INSTALL_COMBINED YES
    XCODE_ATTRIBUTE_SKIP_INSTALL NO
    XCODE_ATTRIBUTE_INSTALL_PATH "$(LOCAL_APPS_DIR)"
)

add_custom_command(
    TARGET
    ${LIB_NAME}
    POST_BUILD COMMAND /bin/sh -c
    \"COMMAND_DONE=0 \;
    if ${CMAKE_COMMAND} -E make_directory
        ${PROJECT_BINARY_DIR}/\${CONFIGURATION}\${EFFECTIVE_PLATFORM_NAME}/${LIB_NAME}.app/Frameworks
        \&\>/dev/null \; then
        COMMAND_DONE=1 \;
    fi \;
    if ${CMAKE_COMMAND} -E make_directory
        \${BUILT_PRODUCTS_DIR}/${LIB_NAME}.app/Frameworks
        \&\>/dev/null \; then
        COMMAND_DONE=1 \;
    fi \;
    if [ \\$$COMMAND_DONE -eq 0 ] \; then
        echo Failed to create Frameworks directory in app bundle \;
        exit 1 \;
    fi\"
)

# Copy the framework into the app bundle
add_custom_command(
    TARGET
    ${LIB_NAME}
    POST_BUILD COMMAND /bin/sh -c
    \"COMMAND_DONE=0 \;
    if ${CMAKE_COMMAND} -E copy_directory
        ${CMAKE_CURRENT_LIST_DIR}/Frameworks
        \${CONFIGURATION}\${EFFECTIVE_PLATFORM_NAME}/${LIB_NAME}.app/Frameworks
        \&\>/dev/null \; then
        COMMAND_DONE=1 \;
    fi \;
    if ${CMAKE_COMMAND} -E copy_directory
        \${BUILT_PRODUCTS_DIR}/${FRAMEWORK_NAME}.framework
        \${BUILT_PRODUCTS_DIR}/${LIB_NAME}.app/Frameworks/${FRAMEWORK_NAME}.framework
        \&\>/dev/null \; then
        COMMAND_DONE=1 \;
    fi \;
    if [ \\$$COMMAND_DONE -eq 0 ] \; then
        echo Failed to copy the framework into the app bundle \;
        exit 1 \;
    fi\"
)
