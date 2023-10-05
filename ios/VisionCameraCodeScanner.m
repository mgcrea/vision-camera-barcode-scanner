#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "CodeScannerProcessorPlugin.h"
#import "VisionCameraCodeScanner.h"

@implementation VisionCameraCodeScanner {
  bool hasListeners;
}

+ (NSString*)name {
  return @"VisionCameraCodeScanner";
}

RCT_EXPORT_MODULE();

- (instancetype)init;
{
  self = [super init];
  if (self) {
    // Publish ourselves as an RCTEventEmitter on the frame processor plugin
    [CodeScannerProcessorPlugin setEventEmitter:self];
  }
  return self;
}

- (NSArray<NSString*>*)supportedEvents {
  return @[ @"onBarcodeDetected" ];
}

- (void)startObserving {
  hasListeners = YES;
}

- (void)stopObserving {
  hasListeners = NO;
}

- (void)sendEventWithName:(NSString*)eventName body:(id)body {
  if (hasListeners) {
    [super sendEventWithName:eventName body:body];
  }
}

- (NSDictionary*)constantsToExport {
  return @{@"MODULE_NAME" : [[self class] name]};
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

@end
