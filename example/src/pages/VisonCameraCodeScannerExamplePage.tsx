import {
  useCameraPermission,
  computeHighlights,
  CameraHighlights,
  convertVisionCameraCodeToBarcode,
} from '@mgcrea/vision-camera-code-scanner';
import React, {useState, type FunctionComponent, useCallback} from 'react';
import {Button, LayoutChangeEvent, StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  Code,
  runAtTargetFps,
  useCameraDevices,
  useCameraFormat,
  useCodeScanner,
} from 'react-native-vision-camera';

export const VisonCameraCodeScannerExamplePage: FunctionComponent = () => {
  const [codes, setCodes] = useState<Code[]>([]);
  const [permissionStatus, requestPermission] = useCameraPermission();

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: scannedCodes => {
      runAtTargetFps(5, () => {
        // console.log(`Scanned ${scannedCodes.length} codes!`);
        // setCodes((codes: Code[]) => [...codes, ...scannedCodes]);
        console.log(JSON.stringify(scannedCodes, null, 2));
        setCodes(scannedCodes);
      });
    },
  });
  const resizeMode = 'cover';
  const [layout, setLayout] = useState({width: 0, height: 0});
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    // console.log({event});
    setLayout({width, height});
  }, []);

  const devices = useCameraDevices();
  const device = devices.find(({position}) => position === 'back');
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 720}},
  ]);

  const highlights = computeHighlights(
    codes.map(convertVisionCameraCodeToBarcode),
    {
      width: format!.videoWidth,
      height: format!.videoHeight,
      orientation: 'portrait',
    },
    layout,
    resizeMode,
  );

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
      ) : (
        <>
          <Camera
            // enableFpsGraph
            // orientation="landscape-right"
            style={StyleSheet.absoluteFill}
            device={device}
            resizeMode={resizeMode}
            codeScanner={codeScanner}
            onLayout={onLayout}
            isActive
          />
          <CameraHighlights
            // codes={codes}
            // format={format}
            // resizeMode="cover"
            highlights={highlights}
            color="peachpuff"
          />
        </>
      )}
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
});
