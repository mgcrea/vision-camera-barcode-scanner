import {
  type Size,
  scanBarcodes,
  visionCameraEventEmitter,
  iOSBoundingBox,
} from '@mgcrea/vision-camera-code-scanner';
import React, {useEffect, useRef, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {
  Camera,
  runAtTargetFps,
  useCameraDevices,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  Highlight,
  computeHighlights,
  computeiOSHighlights,
  requestCameraPermission,
} from './utils';
import {Worklets} from 'react-native-worklets-core';
import {ViewProps} from 'react-native';

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

  const height = 926;
  const width = 428;
  const [highlights, setHighlights] = useState<Highlight[]>([
    {
      key: '0',
      origin: {x: 0.33701424068874786 * width, y: 0.5604440689086914 * height},
      size: {width: 0.3209064271714952 * width, height: 0.1328125 * height},
    },
  ]);
  const setHighlightsJS = Worklets.createRunInJsFn(setHighlights);

  // Track camera layout
  const layoutRef = useRef<Size>({width: 0, height: 0});
  const onCameraLayout: ViewProps['onLayout'] = event => {
    const {width, height} = event.nativeEvent.layout;
    layoutRef.current = {width, height};
    console.log('layoutRef.current', layoutRef.current);
  };

  // libc++abi: terminating due to uncaught exception of type facebook::jsi::JSINativeException: Compiling JS failed: 1:1:invalid empty parentheses '( )' Buffer size 3 starts with: 280a29
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    runAtTargetFps(2, () => {
      'worklet';
      // console.log("I'm running synchronously at 2 FPS!");
      // console.log(
      //   `${frame.width}x${frame.height} ${frame.orientation} ${frame.pixelFormat}`,
      // );
      const barcodes = scanBarcodes(frame);
      // const highlights = computeHighlights(barcodes, frame, layoutRef.current);
      const highlights = computeiOSHighlights(
        barcodes,
        frame,
        layoutRef.current,
      );
      if (barcodes.length) {
        console.log(JSON.stringify(barcodes));
      }
      if (highlights.length) {
        console.log(highlights);
        setHighlightsJS(highlights);
      }
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
    <View style={{position: 'relative', width: 400, height: 600}}>
      <Camera
        onLayout={onCameraLayout}
        style={StyleSheet.absoluteFill}
        enableFpsGraph
        // style={{width: 300, height: 300}}
        frameProcessor={frameProcessor}
        device={device}
        // pixelFormat={Platform.OS === 'android' ? 'yuv' : 'native'}
        // format={format}
        isActive
      />
      {/* <View>
        <View
          style={{
            borderColor: 'red',
            width: 100,
            height: 100,
            top: 1,
            left: 1,
            borderWidth: 2,
          }}
        />
      </View> */}
      {highlights.length ? (
        <View>
          {highlights.map(({key, ...props}) => (
            <View
              key={key}
              style={{
                position: 'absolute',
                borderWidth: 2,
                borderColor: 'green',
                width: props.size.width,
                height: props.size.height,
                left: props.origin.x,
                top: props.origin.y,
                zIndex: 9999,
              }}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
