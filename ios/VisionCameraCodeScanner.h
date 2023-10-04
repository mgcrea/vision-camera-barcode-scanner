#ifndef VisionCameraCodeScanner_h
#define VisionCameraCodeScanner_h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface VisionCameraCodeScanner : RCTEventEmitter <RCTBridgeModule>
+ (NSString*)name;
@end

#endif /* VisionCameraCodeScanner_h */
