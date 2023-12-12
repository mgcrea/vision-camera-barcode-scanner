import {
  CameraHighlights,
  // onBarcodeDetected,
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
import {CameraOverlay} from './CameraOverlay';

// onBarcodeDetected(() => {
//   'worklet';
//   console.log('in');
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
    fps: 5,
    barcodeTypes: ['ean-13'],
    // regionOfInterest: {x: 0, y: 0, width: 0.5, height: 1},
    scanMode: 'continuous',
    onBarcodeScanned: barcodes => {
      'worklet';
      console.log(
        `Scanned ${barcodes.length} codes with values=${JSON.stringify(
          barcodes.map(barcode => `${barcode.type}:${barcode.value}`),
        )} !`,
      );
    },
  });

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
        orientation="landscape-right"
        style={StyleSheet.absoluteFill}
        device={device}
        format={format}
        {...cameraProps}
        resizeMode="contain"
        isActive
      />
      <CameraOverlay />
      <CameraHighlights highlights={highlights} color="peachpuff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    position: 'relative',
    // height: 640, // 1920 / 5
    // width: 320', // 1080 / 5
    // height: 384, // 1920 / 5
    // width: 384, // 1080 / 5
  },
});
