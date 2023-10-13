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
    
    NSMutableDictionary* BARCODE_FORMATS = [@{
        @"VNBarcodeSymbologyAztec" : VNBarcodeSymbologyAztec,
        @"VNBarcodeSymbologyCode39" : VNBarcodeSymbologyCode39,
        @"VNBarcodeSymbologyCode39Checksum" : VNBarcodeSymbologyCode39Checksum,
        @"VNBarcodeSymbologyCode39FullASCII" : VNBarcodeSymbologyCode39FullASCII,
        @"VNBarcodeSymbologyCode39FullASCIIChecksum" : VNBarcodeSymbologyCode39FullASCIIChecksum,
        @"VNBarcodeSymbologyCode93" : VNBarcodeSymbologyCode93,
        @"VNBarcodeSymbologyCode93i" : VNBarcodeSymbologyCode93i,
        @"VNBarcodeSymbologyCode128" : VNBarcodeSymbologyCode128,
        @"VNBarcodeSymbologyDataMatrix" : VNBarcodeSymbologyDataMatrix,
        @"VNBarcodeSymbologyEAN8" : VNBarcodeSymbologyEAN8,
        @"VNBarcodeSymbologyEAN13" : VNBarcodeSymbologyEAN13,
        @"VNBarcodeSymbologyI2of5" : VNBarcodeSymbologyI2of5,
        @"VNBarcodeSymbologyI2of5Checksum" : VNBarcodeSymbologyI2of5Checksum,
        @"VNBarcodeSymbologyITF14" : VNBarcodeSymbologyITF14,
        @"VNBarcodeSymbologyPDF417" : VNBarcodeSymbologyPDF417,
        @"VNBarcodeSymbologyQR" : VNBarcodeSymbologyQR,
        @"VNBarcodeSymbologyUPCE" : VNBarcodeSymbologyUPCE,
    } mutableCopy];
    
    if (@available(iOS 15.0, *)) {
        BARCODE_FORMATS[@"VNBarcodeSymbologyGS1DataBar"] = VNBarcodeSymbologyGS1DataBar;
        BARCODE_FORMATS[@"VNBarcodeSymbologyGS1DataBarExpanded"] = VNBarcodeSymbologyGS1DataBarExpanded;
        BARCODE_FORMATS[@"VNBarcodeSymbologyGS1DataBarLimited"] = VNBarcodeSymbologyGS1DataBarLimited;
        BARCODE_FORMATS[@"VNBarcodeSymbologyMicroQR"] = VNBarcodeSymbologyMicroQR;
    }

    if (@available(iOS 17.0, *)) {
        BARCODE_FORMATS[@"VNBarcodeSymbologyMSIPlessey"] = VNBarcodeSymbologyMSIPlessey;
    }
    
  return @{
    @"MODULE_NAME" : [[self class] name],
    @"BARCODE_FORMATS" : BARCODE_FORMATS
  };
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

@end
