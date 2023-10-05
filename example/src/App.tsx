import {
  CameraHighlights,
  useBarcodeScanner,
} from '@mgcrea/vision-camera-code-scanner';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCameraFormat,
} from 'react-native-vision-camera';
import {requestCameraPermission} from './utils';

// visionCameraEventEmitter.addListener('onBarcodeDetected', event => {
//   console.log('event', event);
// });

export default function App() {
  // Ask for camera permission
  const [hasPermission, setHasPermission] = useState(false);
  useEffect(() => {
    const runEffect = async () => {
      const status = await requestCameraPermission();
      setHasPermission(status === 'granted');
    };
    runEffect();
  }, []);

  const {props: cameraProps, highlights} = useBarcodeScanner({
    fps: 2,
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      'worklet';
      // console.log(`Scanned ${codes.length} codes!`);
    },
  });
  // const codeScanner = useCodeScanner({
  //   codeTypes: ['qr', 'ean-13'],
  //   onCodeScanned: codes => {
  //     console.log(`Scanned ${codes.length} codes!`);
  //   },
  // });

  const devices = useCameraDevices();
  const device = devices.find(({position}) => position === 'back');
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1920, height: 1080}},
  ]);
  if (!device || !hasPermission) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Camera
        enableFpsGraph
        resizeMode="contain"
        style={StyleSheet.absoluteFill}
        device={device}
        format={format}
        // orientation="portrait-upside-down"
        // codeScanner={codeScanner}
        {...cameraProps}
        isActive
      />
      <CameraHighlights highlights={highlights} color="peachpuff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    position: 'relative',
    // width: 384,
    // height: 384,
  },
});
