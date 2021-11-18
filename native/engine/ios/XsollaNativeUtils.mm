#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface XsollaNativeUtils: NSObject

@end

@implementation XsollaNativeUtils

+(NSString*) getDeviceId {
	return [[[UIDevice currentDevice] identifierForVendor] UUIDString];
}

+(NSString*) getDeviceName {
	return [UIDevice currentDevice].name;
}

@end
