import {
  scanBarcodes,
  visionCameraEventEmitter,
} from '@mgcrea/vision-camera-code-scanner';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  Camera,
  runAtTargetFps,
  useCameraDevices,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {requestAndroidCameraPermission} from './utils';

visionCameraEventEmitter.addListener('onBarcodeDetected', event => {
  console.log(event);
});

export default function App() {
  // Ask for camera permission
  const [hasPermission, setHasPermission] = useState(false);
  useEffect(() => {
    const runEffect = async () => {
      const status = await requestAndroidCameraPermission();
      setHasPermission(status === 'granted');
      // const cameraPermission = await Camera.getCameraPermissionStatus();
      // console.log({cameraPermission});
      // if (cameraPermission === 'not-determined') {
      //   const newCameraPermission = await Camera.requestCameraPermission();
      //   if (newCameraPermission !== 'granted') {
      //     Alert.alert('Please go to the settings to enable it!');
      //   }
      // }
    };
    runEffect();
  }, []);

  // libc++abi: terminating due to uncaught exception of type facebook::jsi::JSINativeException: Compiling JS failed: 1:1:invalid empty parentheses '( )' Buffer size 3 starts with: 280a29
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    runAtTargetFps(2, () => {
      'worklet';
      console.log("I'm running synchronously at 2 FPS!");
      const res = scanBarcodes(frame);
      console.log(JSON.stringify(res));
    });
  }, []);

  const devices = useCameraDevices();
  const device = devices.find(({position}) => position === 'back');
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 768}},
  ]);
  if (!device || !hasPermission) {
    return null;
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      enableFpsGraph
      // style={{width: 300, height: 300}}
      frameProcessor={frameProcessor}
      device={device}
      pixelFormat="yuv"
      format={format}
      isActive
    />
  );
}
