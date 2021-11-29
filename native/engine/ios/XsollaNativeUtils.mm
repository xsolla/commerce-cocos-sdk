#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <AuthenticationServices/AuthenticationServices.h>

#import "XsollaSDKLoginKitUnity/XsollaSDKLoginKitUnity-Swift.h"

#import "XsollaUtils.h"

#include "platform/Application.h"
#include "cocos/bindings/jswrapper/SeApi.h"

@interface XsollaNativeUtils: NSObject

@end

@implementation XsollaNativeUtils

+(NSString*) getDeviceId {
	return [[[UIDevice currentDevice] identifierForVendor] UUIDString];
}

+(NSString*) getDeviceName {
	return [UIDevice currentDevice].name;
}

+(void) authViaSocialNetwork:(NSString*)platform client:(NSNumber*)clientId state:(NSString*)stateStr redirect:(NSString*)redirectUriStr {
	OAuth2Params *oauthParams = [[OAuth2Params alloc] initWithClientId:[clientId integerValue]
																 state:stateStr
																 scope:@"offline"
																 redirectUri:redirectUriStr];

	JWTGenerationParams *jwtGenerationParams = [[JWTGenerationParams alloc] initWithGrantType:TokenGrantTypeAuthorizationCode
														 clientId:[clientId integerValue]
														 refreshToken:nil
														 clientSecret:nil
														 redirectUri:redirectUriStr];

	if (@available(iOS 13.4, *)) {
		UIWindow* window = [[UIApplication sharedApplication] keyWindow];
		WebAuthenticationPresentationContextProvider* context = [[WebAuthenticationPresentationContextProvider alloc] initWithPresentationAnchor:window];

		[[LoginKitUnity shared] authBySocialNetwork:platform oAuth2Params:oauthParams jwtParams:jwtGenerationParams presentationContextProvider:context completion:^(AccessTokenInfo * _Nullable accesTokenInfo, NSError * _Nullable error){

			if(error != nil) {
				NSLog(@"Error code: %ld", error.code);

				if(error.code == NSError.loginKitErrorCodeASCanceledLogin) {
					return;
				}
				
				NSString* errorString = error.localizedDescription;
				NSString *errorScript = [NSString stringWithFormat: @"cc.find(\"Canvas/Widget_SocialAuth\").getComponent(\"SocialAuthManager\").handleErrorSocialAuth(\"%@\")", errorString];
				const char* errorScriptStr = [XsollaUtils createCStringFrom:errorScript];
				cc::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
					se::ScriptEngine::getInstance()->evalString(errorScriptStr);
				});

				return;
			}

			NSString* tokenInfoString = [XsollaUtils serializeTokenInfo:accesTokenInfo];
			NSString *successScript = [NSString stringWithFormat: @"cc.find(\"Canvas/Widget_SocialAuth\").getComponent(\"SocialAuthManager\").handleSuccessfulSocialAuth(%@)", tokenInfoString];
			const char* successScriptStr = [XsollaUtils createCStringFrom:successScript];
			cc::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
				se::ScriptEngine::getInstance()->evalString(successScriptStr);
			});
		}];
	} else {
		NSLog(@"Authentication via social networks with Xsolla is not supported for current iOS version.");
	}
}

@end
