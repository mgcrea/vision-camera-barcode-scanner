import { NativeModules, NativeEventEmitter, Platform } from "react-native";

const LINKING_ERROR =
  `The package 'vision-camera-code-scanner' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo Go\n";

const VisionCameraCodeScanner = NativeModules.VisionCameraCodeScanner
  ? NativeModules.VisionCameraCodeScanner
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export const eventEmitter = new NativeEventEmitter(VisionCameraCodeScanner);

// export function multiply(a: number, b: number): Promise<number> {
//   return VisionCameraCodeScanner.multiply(a, b);
// }

// export function emitEvent(): void {
//   return VisionCameraCodeScanner.emitEvent();
// }
