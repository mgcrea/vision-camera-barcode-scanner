import {
  CameraHighlights,
  // onBarcodeDetected,
  Templates,
  useBarcodeScanner,
  useCameraPermission,
} from '@mgcrea/vision-camera-code-scanner';
import React, {type FunctionComponent, useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCameraFormat,
} from 'react-native-vision-camera';
// import {CameraOverlay} from './../components';

const TEST_CRASH = false;

export const BarcodeScannerHookExamplePage: FunctionComponent = () => {
  // Ask for camera permission
  const [permissionStatus, requestPermission] = useCameraPermission();

  const [isActive, setIsActive] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  useEffect(() => {
    const runEffect = () => {
      setTimeout(() => {
        setIsActive(true);
      }, 500);
    };
    runEffect();
  }, []);

  TEST_CRASH &&
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const interval = setInterval(() => {
        setIsMounted(prevIsMounted => {
          console.warn('\n/!\\ isMounted !!!', prevIsMounted);
          return !prevIsMounted;
        });
      }, 3000);
      return () => {
        clearInterval(interval);
      };
    }, []);

  const {props: cameraProps, highlights} = useBarcodeScanner({
    fps: 5,
    barcodeTypes: ['ean-13'],
    // defaultResizeMode: 'contain',
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
  const format = useCameraFormat(device, Templates.FrameProcessingBarcodeXGA);
  if (!device || !format) {
    return null;
  }

  return (
    <View style={styles.container}>
      {permissionStatus !== 'granted' ? (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Vision Camera needs{' '}
            <Text style={styles.bold}>Camera permission</Text>.{' '}
          </Text>
          <Button
            onPress={requestPermission}
            title="Grant Permission"
            color="#007aff"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      ) : isMounted ? (
        <>
          <Camera
            // enableFpsGraph
            // orientation="landscape-right"
            style={StyleSheet.absoluteFill}
            device={device}
            {...cameraProps}
            resizeMode="cover"
            format={format}
            isActive={isActive}
            // photo
          />
          <CameraHighlights highlights={highlights} color="peachpuff" />
        </>
      ) : null}
      {/* <CameraOverlay /> */}
      <View style={styles.actions}>
        <Button
          onPress={() => {
            setIsActive(prevIsActive => !prevIsActive);
          }}
          title={isActive ? 'Pause' : 'Resume'}
          color="#007aff"
        />
        <Button
          onPress={() => {
            setIsMounted(prevIsMounted => !prevIsMounted);
          }}
          title={isMounted ? 'Unmount' : 'Mount'}
          color="#007aff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'chalk',
    position: 'relative',
    // height: 640, // 1920 / 5
    // width: 320', // 1080 / 5
    // height: 384, // 1920 / 5
    // width: 384, // 1080 / 5
  },
  permissionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
  },
  permissionText: {
    fontSize: 17,
    paddingVertical: 12,
  },
  hyperlink: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
