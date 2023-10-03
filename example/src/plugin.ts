import {VisionCameraProxy, Frame} from 'react-native-vision-camera';

// const { CodeScannerProcessorPlugin } = NativeModules;
// const eventEmitter = new NativeEventEmitter(CodeScannerProcessorPlugin);

const plugin = VisionCameraProxy.getFrameProcessorPlugin('codeScanner')!;

export function scanCodes(frame: Frame) {
  'worklet';
  return plugin.call(frame);
}
