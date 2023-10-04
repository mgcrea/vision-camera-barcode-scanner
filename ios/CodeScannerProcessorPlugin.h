#ifndef CodeScannerProcessorPlugin_h
#define CodeScannerProcessorPlugin_h

#import <React/RCTBridge.h>
#import <Vision/Vision.h>
#import <VisionCamera/Frame.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#import "VisionCameraCodeScanner.h"

@interface CodeScannerProcessorPlugin : FrameProcessorPlugin
@property(nonatomic, strong) VisionCameraCodeScanner* eventEmitter;
+ (void)setEventEmitter:(RCTEventEmitter*)eventEmitter;
@end

#endif /* CodeScannerProcessorPlugin_h */
