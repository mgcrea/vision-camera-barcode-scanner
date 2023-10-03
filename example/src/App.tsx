import React, {useEffect} from 'react';
import {
  Alert,
  NativeModules,
  PermissionsAndroid,
  StyleSheet,
} from 'react-native';
import {
  Camera,
  runAsync,
  runAtTargetFps,
  useCameraDevices,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  scanBarcodes,
  visionCameraEventEmitter,
  BARCODE_TYPES,
  BARCODE_FORMATS,
} from '@mgcrea/vision-camera-code-scanner';

visionCameraEventEmitter.addListener('onBarcodeDetected', event => {
  console.log(event);
});

export default function App() {
  useEffect(() => {
    const runEffect = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      console.log({cameraPermission});
      if (cameraPermission === 'not-determined') {
        const newCameraPermission = await Camera.requestCameraPermission();
        if (newCameraPermission !== 'granted') {
          Alert.alert('Please go to the settings to enable it!');
        }
      }
      // const a = await multiply(2, 3);
      // console.warn(a);
      // const request = await requestCameraPermission();
      // console.log({request});
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
      console.log("I'm running synchronously at 2 FPS!");
      const res = scanBarcodes(frame);
      console.log(JSON.stringify(res));
    });
  }, []);
  // @TODO
  /*const frameProcessor = useBarcodeScanner((barcode) => {

  })*/

  const devices = useCameraDevices();
  console.log({devices});
  const device = devices.find(({position}) => position === 'back');
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 768}},
  ]);
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

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
