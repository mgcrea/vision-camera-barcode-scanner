import React, {useEffect} from 'react';
import {Alert, NativeModules, StyleSheet} from 'react-native';
import {
  Camera,
  runAsync,
  runAtTargetFps,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {scanCodes} from './plugin';
import {eventEmitter, multiply} from 'vision-camera-code-scanner';

eventEmitter.addListener('onBarcodeDetected', event => {
  console.log(event);
});

export default function App() {
  useEffect(() => {
    const runEffect = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission === 'not-determined') {
        const newCameraPermission = await Camera.requestCameraPermission();
        if (newCameraPermission !== 'granted') {
          Alert.alert('Please go to the settings to enable it!');
        }
      }
      const a = await multiply(2, 3);
      console.warn(a);
      // const microphonePermission = await Camera.getMicrophonePermissionStatus();
    };
    runEffect();
    setTimeout(() => {
      // emitEvent();
    }, 1000);
  }, []);

  // libc++abi: terminating due to uncaught exception of type facebook::jsi::JSINativeException: Compiling JS failed: 1:1:invalid empty parentheses '( )' Buffer size 3 starts with: 280a29
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    runAtTargetFps(2, () => {
      'worklet';
      // console.log("I'm running synchronously at 2 FPS!");
      const res = scanCodes(frame);
    });
  }, []);
  // @TODO
  /*const frameProcessor = useBarcodeScanner((barcode) => {

  })*/

  const devices = useCameraDevices();
  const device = devices.back!;
  if (!device) {
    return null;
  }
  // console.log({formats: device.formats});
  // device.formats.forEach(format => {
  //   console.log(`${format.photoWidth}x${format.photoHeight}@${format.maxFps}`);
  // });

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      frameProcessor={frameProcessor}
      device={device}
      isActive
    />
  );
}
