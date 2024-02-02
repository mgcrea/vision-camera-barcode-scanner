import { NativeEventEmitter, NativeModules, Platform } from "react-native";
import { VisionCameraProxy, type Frame } from "react-native-vision-camera";
import type {
  AndroidBarcode,
  Barcode,
  BarcodeType,
  FrameProcessorPlugin,
  VisionCameraConstants,
  iOSBarcode,
} from "./types";
import { normalizeNativeBarcode } from "./utils";

const LINKING_ERROR =
  `The package 'vision-camera-code-scanner' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo Go\n";

export const VisionCameraCodeScanner = NativeModules.VisionCameraCodeScanner
  ? NativeModules.VisionCameraCodeScanner
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

const { MODULE_NAME, BARCODE_TYPES, BARCODE_FORMATS } =
  VisionCameraCodeScanner.getConstants() as VisionCameraConstants;

export { BARCODE_FORMATS, BARCODE_TYPES };

const visionCameraEventEmitter = new NativeEventEmitter(
  VisionCameraCodeScanner,
);

export const onBarcodeDetected = (
  callback: (barcode: iOSBarcode | AndroidBarcode) => unknown,
) => {
  visionCameraEventEmitter.addListener("onBarcodeDetected", (nativeBarcode) => {
    callback(nativeBarcode);
  });
};

const visionCameraProcessorPlugin = VisionCameraProxy.initFrameProcessorPlugin(
  MODULE_NAME,
) as FrameProcessorPlugin | null;

export type ScanBarcodesOptions = {
  barcodeTypes?: BarcodeType[];
  regionOfInterest?: [number, number, number, number];
};

export const scanCodes = (
  frame: Frame,
  options?: ScanBarcodesOptions,
): Barcode[] => {
  "worklet";
  if (visionCameraProcessorPlugin == null) {
    throw new Error(`Failed to load Frame Processor Plugin "${MODULE_NAME}"!`);
  }
  const nativeCodes = visionCameraProcessorPlugin.call(
    frame,
    options,
  ) as unknown as (AndroidBarcode | iOSBarcode)[];
  if (!Array.isArray(nativeCodes)) {
    console.warn("Native frame processor failed to return a proper array!");
    return [];
  }
  return nativeCodes
    .slice() // Prevent "Frame Processor Error: Exception in HostObject::get for prop 'width': java.lang.RuntimeException: Frame is already closed! Are you trying to access the Image data outside of a Frame Processor's lifetime?" with fast refresh
    .map((nativeBarcode) => normalizeNativeBarcode(nativeBarcode, frame));
};
