import {VisionCameraProxy, Frame} from 'react-native-vision-camera';
import {NativeEventEmitter, NativeModules} from 'react-native';

// const { CodeScannerProcessorPlugin } = NativeModules;
// const eventEmitter = new NativeEventEmitter(CodeScannerProcessorPlugin);
console.log({NativeModules});

const plugin = VisionCameraProxy.getFrameProcessorPlugin('codeScanner')!;

export function scanCodes(frame: Frame) {
  'worklet';
  return plugin.call(frame);
}
