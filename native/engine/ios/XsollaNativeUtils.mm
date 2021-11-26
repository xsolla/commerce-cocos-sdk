#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <AuthenticationServices/AuthenticationServices.h>

#import "XsollaSDKLoginKitUnity/XsollaSDKLoginKitUnity-Swift.h"

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
	NSLog(@"boi");
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

				return;
			}

			//NSString* tokenInfoString = [XsollaUtils serializeTokenInfo:accesTokenInfo];
		}];
	} else {
		NSLog(@"Authentication via social networks with Xsolla is not supported for current iOS version.");
	}
}

@end
