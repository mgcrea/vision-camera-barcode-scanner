#import "CodeScannerProcessorPlugin.h"
#include <Foundation/Foundation.h>
#import <React/RCTLog.h>

static RCTEventEmitter* eventEmitter = nil;

@implementation CodeScannerProcessorPlugin

- (instancetype)initWithOptions:(NSDictionary*)options {
  self = [super init];
  return self;
}

/**
 * Frame processor callback that is called when a new frame is available.
 *
 * @param frame The frame that is available.
 * @param arguments The arguments that were passed to the frame processor.
 */
- (id)callback:(Frame*)frame withArguments:(NSDictionary*)arguments {
  CMSampleBufferRef buffer = frame.buffer;
  // UIImageOrientation orientation = frame.orientation;

  CVPixelBufferRef pixelBuffer = CMSampleBufferGetImageBuffer(buffer);
  size_t width = CVPixelBufferGetWidth(pixelBuffer);
  size_t height = CVPixelBufferGetHeight(pixelBuffer);
  RCTLogInfo(@"Processing frame with width: %lu, height: %lu and arguments: %@", width, height, arguments);

  // Parse the barcode types to be detected
  NSDictionary* barcodeTypes = arguments[@"barcodeTypes"];
  NSMutableArray* symbologies = [NSMutableArray new];
  for (NSString* key in barcodeTypes) {
    NSString* barcodeType = [barcodeTypes objectForKey:key];
    VNBarcodeSymbology symbology = [self barcodeSymbologyFromString:barcodeType];
    if (symbology != nil) {
      [symbologies addObject:symbology];
    }
  }

  // Parse the regions of interest
  // The rectangle is normalized to the dimensions of the processed image. Its origin is specified relative to the image's lower-left corner.
  NSArray* regionOfInterestArg = arguments[@"regionOfInterest"];
  // The default value is { { 0, 0 }, { 1, 1 } }.
  CGRect regionOfInterest = CGRectMake(0, 0, 1, 1);
  if (regionOfInterestArg && regionOfInterestArg.count == 4) {
    NSNumber* x = regionOfInterestArg[0];
    NSNumber* y = regionOfInterestArg[1];
    NSNumber* width = regionOfInterestArg[2];
    NSNumber* height = regionOfInterestArg[3];
    if (x && y && width && height) {
      regionOfInterest = CGRectMake([x floatValue], [y floatValue], [width floatValue], [height floatValue]);
    }
  }

  dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
  __block NSMutableArray* result = [NSMutableArray new];

  [self
      detectBarcodeInBuffer:pixelBuffer
                symbologies:symbologies
           regionOfInterest:regionOfInterest
                 completion:^(NSArray* observations) {
                   for (VNBarcodeObservation* observation in observations) {
                     NSLog(@"Payload: %@ (%@)", observation.payloadStringValue, observation.symbology);
                     NSDictionary* observationResult = [self dictionaryFromObservation:observation];
                     // [observationResult setValue:[NSNumber numberWithInt:orientation] forKey:@"orientation"];
                     [eventEmitter sendEventWithName:@"onBarcodeDetected" body:observationResult];
                     [result addObject:observationResult];
                   }
                   dispatch_semaphore_signal(semaphore);
                 }];

  dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);

  return result;
}

/**
 * Detects barcodes in the given pixel buffer and calls the completion handler
 * with the results.
 *
 * @param pixelBuffer The pixel buffer to detect barcodes in.
 * @param completion The completion handler to call with the results.
 */
- (void)detectBarcodeInBuffer:(CVPixelBufferRef)pixelBuffer
                  symbologies:(NSArray*)symbologies
             regionOfInterest:(CGRect)regionOfInterest
                   completion:(void (^)(NSArray*))completion {
  VNImageRequestHandler* handler =
      [[VNImageRequestHandler alloc] initWithCVPixelBuffer:pixelBuffer
                                                   options:@{}];
  VNDetectBarcodesRequest* request = [[VNDetectBarcodesRequest alloc]
      initWithCompletionHandler:^(VNRequest* _Nonnull request,
                                  NSError* _Nullable error) {
        if (error) {
          NSLog(@"Error %@", error.localizedDescription);
          completion(@[]);
          return;
        }

        completion(request.results);
      }];

  // Set the symbologies to be detected
  if (symbologies.count > 0) {
    request.symbologies = symbologies;
    RCTLogInfo(@"Filtering with symbologies: %@", request.symbologies);
  }

  // Set the region of interest
  if (!CGRectEqualToRect(regionOfInterest, CGRectZero)) {
    request.regionOfInterest = regionOfInterest;
    RCTLogInfo(@"Filtering with regionOfInterest: %@", NSStringFromCGRect(request.regionOfInterest));
  }

  NSError* error;
  [handler performRequests:@[ request ] error:&error];
  if (error) {
    NSLog(@"Error %@", error.localizedDescription);
    completion(@[]);
  }
}

/**
 * Converts a barcode observation to a dictionary representation.
 *
 * @param observation The observation to convert.
 * @return A dictionary representation of the observation.
 */
- (NSDictionary*)dictionaryFromObservation:(VNBarcodeObservation*)observation {
  NSMutableDictionary* observationRepresentation = [@{
    @"uuid" : observation.uuid.UUIDString,
    @"payload" : observation.payloadStringValue ?: [NSNull null],
    @"symbology" : observation.symbology,
    @"boundingBox" : @{
      @"origin" : @{
        @"x" : @(observation.boundingBox.origin.x),
        @"y" : @(observation.boundingBox.origin.y),
      },
      @"size" : @{
        @"width" : @(observation.boundingBox.size.width),
        @"height" : @(observation.boundingBox.size.height)
      },
    },
    @"corners" : @{
      @"topLeft" : @{
        @"x" : @(observation.topLeft.x),
        @"y" : @(observation.topLeft.y)
      },
      @"topRight" : @{
        @"x" : @(observation.topRight.x),
        @"y" : @(observation.topRight.y)
      },
      @"bottomRight" : @{
        @"x" : @(observation.bottomRight.x),
        @"y" : @(observation.bottomRight.y)
      },
      @"bottomLeft" : @{
        @"x" : @(observation.bottomLeft.x),
        @"y" : @(observation.bottomLeft.y)
      }
    },
    @"confidence" : @(observation.confidence)
  } mutableCopy];

  if (@available(iOS 14.0, *)) {
    observationRepresentation[@"timeRange"] = @{
      @"duration" : @(CMTimeGetSeconds(observation.timeRange.duration)),
      @"start" : @(CMTimeGetSeconds(observation.timeRange.start))
    };
  }

  if (@available(iOS 17.0, *)) {
    observationRepresentation[@"supplementalPayload"] = observation.supplementalPayloadString ?: [NSNull null];
  }

  return [observationRepresentation copy];
}

- (VNBarcodeSymbology)barcodeSymbologyFromString:(NSString*)barcodeType {
  if ([barcodeType isEqualToString:@"aztec"]) {
    return VNBarcodeSymbologyAztec;
  } else if ([barcodeType isEqualToString:@"code-39"]) {
    return VNBarcodeSymbologyCode39;
  } else if ([barcodeType isEqualToString:@"code-93"]) {
    return VNBarcodeSymbologyCode93;
  } else if ([barcodeType isEqualToString:@"code-128"]) {
    return VNBarcodeSymbologyCode128;
  } else if ([barcodeType isEqualToString:@"data-matrix"]) {
    return VNBarcodeSymbologyDataMatrix;
  } else if ([barcodeType isEqualToString:@"ean-8"]) {
    return VNBarcodeSymbologyEAN8;
  } else if ([barcodeType isEqualToString:@"ean-13"]) {
    return VNBarcodeSymbologyEAN13;
  } else if ([barcodeType isEqualToString:@"itf"]) {
    return VNBarcodeSymbologyITF14;
  } else if ([barcodeType isEqualToString:@"pdf-417"]) {
    return VNBarcodeSymbologyPDF417;
  } else if ([barcodeType isEqualToString:@"qr"]) {
    return VNBarcodeSymbologyQR;
  } else if ([barcodeType isEqualToString:@"upc-e"]) {
    return VNBarcodeSymbologyUPCE;
  }

  if (@available(iOS 15.0, *)) {
    if ([barcodeType isEqualToString:@"gs1-databar"]) {
      return VNBarcodeSymbologyGS1DataBar;
    }
  }

  if (@available(iOS 17.0, *)) {
    if ([barcodeType isEqualToString:@"msi-plessey"]) {
      return VNBarcodeSymbologyMSIPlessey;
    }
  }

  return nil;
}

/**
 * Sets the event emitter that will be used to send events to the JS side.
 */
+ (void)setEventEmitter:(RCTEventEmitter*)eventEmitterArg {
  eventEmitter = eventEmitterArg;
}

/**
 * Registers this plugin with the frame processor plugin registry so that it
 * can be used.
 */
+ (void)load {
  [FrameProcessorPluginRegistry
      addFrameProcessorPlugin:[VisionCameraCodeScanner name]
              withInitializer:^FrameProcessorPlugin*(NSDictionary* options) {
                return [[CodeScannerProcessorPlugin alloc]
                    initWithOptions:options];
              }];
}

@end
