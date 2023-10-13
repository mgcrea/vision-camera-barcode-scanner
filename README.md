# vision-camera-barcode-scanner

<!-- markdownlint-disable MD033 -->
<p align="center">
  <a href="https://mgcrea.github.io/vision-camera-barcode-scanner">
    <img src="./.github/assets/logo.png" alt="logo" width="320" height="200"/>
  </a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@mgcrea/vision-camera-barcode-scanner">
    <img src="https://img.shields.io/npm/v/@mgcrea/vision-camera-barcode-scanner.svg?style=for-the-badge" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@mgcrea/vision-camera-barcode-scanner">
    <img src="https://img.shields.io/npm/dt/@mgcrea/vision-camera-barcode-scanner.svg?style=for-the-badge" alt="npm total downloads" />
  </a>
  <a href="https://www.npmjs.com/package/@mgcrea/vision-camera-barcode-scanner">
    <img src="https://img.shields.io/npm/dm/@mgcrea/vision-camera-barcode-scanner.svg?style=for-the-badge" alt="npm monthly downloads" />
  </a>
  <a href="https://www.npmjs.com/package/@mgcrea/vision-camera-barcode-scanner">
    <img src="https://img.shields.io/npm/l/@mgcrea/vision-camera-barcode-scanner.svg?style=for-the-badge" alt="npm license" />
  </a>
  <br />
  <a href="https://github.com/mgcrea/vision-camera-barcode-scanner/actions/workflows/main.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/mgcrea/vision-camera-barcode-scanner/main.yml?style=for-the-badge&branch=master" alt="build status" />
  </a>
  <a href="https://depfu.com/github/mgcrea/vision-camera-barcode-scanner">
    <img src="https://img.shields.io/depfu/dependencies/github/mgcrea/vision-camera-barcode-scanner?style=for-the-badge" alt="dependencies status" />
  </a>
</p>
<!-- markdownlint-enable MD037 -->

## Features

High performance barcode scanner for React Native using VisionCamera.

- **Modern and future-proof:** Built on [react-native-vision-camera v3](https://github.com/mrousavy/react-native-vision-camera) with minimal native dependencies for each platforms to minimize future build-failure risk.

- **Minimal footprint:** Leverages [Google's MLKit BarcodeScanner](https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/package-summary) on Android and [Apple's Vision VNDetectBarcodesRequest](https://developer.apple.com/documentation/vision/vndetectbarcodesrequest).

- **Powerful & Performant:** The implementation has been tailored for advanced use cases where performance is critical. Scanning barcodes is butter smooth at 30fps, and you can customize the detection speed loop (detection fps).

- **Hooks based:** Exposes easy-to-use hooks [`useBarcodeScanner`](./src/hooks/useBarcodeScanner.ts) to quickly get started

<!-- Check the [**Documentation**](https://mgcrea.github.io/vision-camera-barcode-scanner/) for usage details. -->

## Demo

![demo](./.github/assets/demo.gif)

A working project can be found at [vision-camera-barcode-scanner-example](./example)

## Install

```bash
npm install @mgcrea/vision-camera-barcode-scanner
# or
yarn add @mgcrea/vision-camera-barcode-scanner
# or
pnpm add @mgcrea/vision-camera-barcode-scanner
```

### Dependencies

This package relies on:

- [react-native-vision-camera@>=3](https://github.com/mrousavy/react-native-vision-camera)
- [react-native-worklets-core](https://github.com/margelo/react-native-worklets-core)

You must add them as dependencies to your project:

```bash
npm install react-native-vision-camera react-native-worklets-core
# or
yarn add react-native-vision-camera react-native-worklets-core
# or
pnpm add react-native-vision-camera react-native-worklets-core
```

Then you must follow their respective installation instructions:

- [react-native-worklets-core](https://github.com/margelo/react-native-worklets-core#installation)

## Quickstart

```tsx
import {
  CameraHighlights,
  useBarcodeScanner,
} from "@mgcrea/vision-camera-barcode-scanner";
import type { FunctionComponent } from "react";
import { StyleSheet } from "react-native";

export const App: FunctionComponent = () => {
  // @NOTE you must properly ask for camera permissions first!
  // You should use `PermissionsAndroid` for Android and `Camera.requestCameraPermission()` on iOS.

  const { props: cameraProps, highlights } = useBarcodeScanner({
    fps: 5,
    barcodeTypes: ["qr", "ean-13"], // optional
    onBarcodeScanned: (barcodes) => {
      "worklet";
      console.log(
        `Scanned ${barcodes.length} codes with values=${JSON.stringify(
          barcodes.map(({ value }) => value),
        )} !`,
      );
    },
  });

  const devices = useCameraDevices();
  const device = devices.find(({ position }) => position === "back");
  const format = useCameraFormat(device, [
    { videoResolution: { width: 1920, height: 1080 } },
  ]);
  if (!device) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        {...cameraProps}
      />
      <CameraHighlights highlights={highlights} color="peachpuff" />
    </View>
  );
};
```

## Credits

Inspired by:

- [rodgomesc/vision-camera-code-scanner](https://github.com/rodgomesc/vision-camera-code-scanner)

## Authors

- [Olivier Louvignes](https://github.com/mgcrea) <<olivier@mgcrea.io>>

## License

```txt
The MIT License

Copyright (c) 2023 Olivier Louvignes <olivier@mgcrea.io>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
