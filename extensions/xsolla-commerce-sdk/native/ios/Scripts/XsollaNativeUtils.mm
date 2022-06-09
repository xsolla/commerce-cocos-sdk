#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <AuthenticationServices/AuthenticationServices.h>

#import "XsollaSDKLoginKitObjectiveC-Bridging-Header.h"
#import "XsollaUtils.h"
#import "XsollaSDKPaymentsKitObjectiveC/XsollaSDKPaymentsKitObjectiveC-Swift.h"

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

+(NSString*) getBundleIdentifier {
	return [[NSBundle mainBundle] bundleIdentifier];
}

+(void) updateUserProfilePicture:(NSString*)picture authToken:(NSString*)token {
	NSBundle *main = [NSBundle mainBundle];
	NSString *resourcePath = [main pathForResource:picture ofType:nil];
	NSURL *resUrl = [NSURL URLWithString:[NSString stringWithFormat: @"file://%@", resourcePath]];

	[[LoginKitObjectiveC shared] uploadUserPictureWithAccessToken:token imageURL:resUrl completion:^(NSString * _Nullable url, NSError * _Nullable error) {
		if(error != nil) {
			NSLog(@"Error code: %ld", error.code);

			NSString* errorString = error.localizedDescription;
			NSString *errorScript = [NSString stringWithFormat: @"cc.director.getScene().emit(\"avatarUpdateError\", \"%@\"))", errorString];
			const char* errorScriptStr = [XsollaUtils createCStringFrom:errorScript];
			cc::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
				se::ScriptEngine::getInstance()->evalString(errorScriptStr);
			});

			return;
		}

		NSString *successScript = [NSString stringWithFormat: @"cc.director.getScene().emit(\"avatarUpdateSuccess\")"];
		const char* successScriptStr = [XsollaUtils createCStringFrom:successScript];
		cc::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
			se::ScriptEngine::getInstance()->evalString(successScriptStr);
		});
	}];
	
	NSLog(@"Picture name: %@", resourcePath);
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

		[[LoginKitObjectiveC shared] authBySocialNetwork:platform oAuth2Params:oauthParams jwtParams:jwtGenerationParams presentationContextProvider:context completion:^(AccessTokenInfo * _Nullable accesTokenInfo, NSError * _Nullable error){

			if(error != nil) {
				NSLog(@"Error code: %ld", error.code);

				if(error.code == NSError.loginKitErrorCodeASCanceledLogin) {
					NSString *errorScript = [NSString stringWithFormat: @"cc.director.getScene().emit(\"socialAuthCanceled\")"];
					const char* errorScriptStr = [XsollaUtils createCStringFrom:errorScript];
					cc::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
						se::ScriptEngine::getInstance()->evalString(errorScriptStr);
					});
					return;
				}
				
				NSString* errorString = error.localizedDescription;
				NSString *errorScript = [NSString stringWithFormat: @"cc.director.getScene().emit(\"socialAuthError\", (\"%@\"))", errorString];
				const char* errorScriptStr = [XsollaUtils createCStringFrom:errorScript];
				cc::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
					se::ScriptEngine::getInstance()->evalString(errorScriptStr);
				});

				return;
			}

			NSString* tokenInfoString = [XsollaUtils serializeTokenInfo:accesTokenInfo];
			NSString *successScript = [NSString stringWithFormat: @"cc.director.getScene().emit(\"socialAuthSuccess\", (%@))", tokenInfoString];
			const char* successScriptStr = [XsollaUtils createCStringFrom:successScript];
			cc::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
				se::ScriptEngine::getInstance()->evalString(successScriptStr);
			});
		}];
	} else {
		NSLog(@"Authentication via social networks with Xsolla is not supported for current iOS version.");
	}
}

+(void) modifyUserAccountData:(NSString*)authToken userBirthday:(NSString*)birthday userFirstName:(NSString*)firstName userGender:(NSString*)gender userLastName:(NSString*)lastName userNickname:(NSString*)nickname {
	NSBundle *main = [NSBundle mainBundle];

	NSDateFormatter* dateFormatter = [NSDateFormatter new];
    dateFormatter.dateFormat = @"yyyy-mm-dd";
    NSDate* date = [dateFormatter dateFromString: birthday];
    
	[[LoginKitObjectiveC shared] updateCurrentUserDetailsWithAccessToken:authToken birthday:date firstName:firstName lastName:lastName nickname:nickname gender:gender completion:^(NSError * _Nullable error) {
		if(error != nil) {
			NSLog(@"Error code: %ld", error.code);

			NSString* errorString = error.localizedDescription;
			NSString *errorScript = [NSString stringWithFormat: @"cc.director.getScene().emit(\"accountDataUpdateError\", \"%@\"))", errorString];
			const char* errorScriptStr = [XsollaUtils createCStringFrom:errorScript];
			cc::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
				se::ScriptEngine::getInstance()->evalString(errorScriptStr);
			});

			return;
		}

		NSString *successScript = [NSString stringWithFormat: @"cc.director.getScene().emit(\"accountDataUpdateSuccess\")"];
		const char* successScriptStr = [XsollaUtils createCStringFrom:successScript];
		cc::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
			se::ScriptEngine::getInstance()->evalString(successScriptStr);
		});
	}];
}

+(void) linkSocialNetwork:(NSString*)tokenStr networkName:(NSString*)networkNameStr redirectUri:(NSString*)redirectUriStr{
    if (@available(iOS 13.4, *)) {
        
        networkNameStr = networkNameStr.lowercaseString;
              
        [[LoginKitObjectiveC shared] linkSocialNetwork:networkNameStr accessToken:tokenStr redirectUrl:redirectUriStr  userAgent:NULL presenter:[UIApplication sharedApplication].keyWindow.rootViewController completion:^(NSError * _Nullable error) {     
            if(error != nil) {
                NSLog(@"XsollaSocialLinking error. Code: %ld", error.code);

                NSString* errorString = error.localizedDescription;
                NSString *errorScript = [NSString stringWithFormat: @"cc.director.getScene().emit(\"socialNetworkLinkingError\", \"%@\")", errorString];
                const char* errorScriptStr = [XsollaUtils createCStringFrom:errorScript];
                cc::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
                    se::ScriptEngine::getInstance()->evalString(errorScriptStr);
                });

                return;
            }
            
            NSString *successScript = [NSString stringWithFormat: @"cc.director.getScene().emit(\"socialNetworkLinkingSuccess\", \"%@\")", networkNameStr];
            const char* successScriptStr = [XsollaUtils createCStringFrom:successScript];
            cc::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
                se::ScriptEngine::getInstance()->evalString(successScriptStr);
            });
        }];
    } else {
        NSLog(@"Linking social network is not supported for current iOS version.");
    }
}

+(void) openPurchaseUI:(NSString*)tokenStr sandbox:(BOOL)sandboxBool redirectUri:(NSString*)redirectUriStr {
    if (@available(iOS 13.4, *)) {
        [[PaymentsKitObjectiveC shared] performPaymentWithPaymentToken:tokenStr presenter: [UIApplication sharedApplication].keyWindow.rootViewController isSandbox:sandboxBool redirectUrl:redirectUriStr completionHandler:^(NSError * _Nullable error) {
            if(error != nil) {
                NSLog(@"Error code: %ld", error.code);
            }
        }];
    } else {
        NSLog(@"Open purchase web view is not supported for current iOS version.");
    }
}
    
@end
