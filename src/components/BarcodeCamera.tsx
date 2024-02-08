import type { FunctionComponent, PropsWithChildren } from "react";
import React, { useEffect } from "react";
import { Camera, type CameraProps } from "react-native-vision-camera";
import { useSharedValue } from "react-native-worklets-core";
import { useBarcodeScanner } from "../hooks";
import type { Barcode } from "../types";
import { CameraHighlights } from "./CameraHighlights";

export type BarcodeCameraProps = CameraProps & {
  onBarcodeScanned: (barcodes: Barcode[]) => void;
};

export const BarcodeCamera: FunctionComponent<
  PropsWithChildren<BarcodeCameraProps>
> = ({ children, device, format, onBarcodeScanned, ...otherProps }) => {
  const isMountedRef = useSharedValue<boolean>(true);
  useEffect(() => {
    return () => {
      console.log("unmont!");
      isMountedRef.value = false;
    };
  }, [isMountedRef]);

  const { props: cameraProps, highlights } = useBarcodeScanner({
    fps: 5,
    barcodeTypes: ["ean-13"],
    isMountedRef,
    // defaultResizeMode: 'contain',
    // regionOfInterest: {x: 0, y: 0, width: 0.5, height: 1},
    scanMode: "continuous",
    onBarcodeScanned: (barcodes) => {
      "worklet";
      console.log(
        `Scanned ${barcodes.length} codes with values=${JSON.stringify(
          barcodes.map((barcode) => `${barcode.type}:${barcode.value}`),
        )} !`,
      );
    },
  });

  // const devices = useCameraDevices();
  // const device = devices.find(({ position }) => position === "back");
  // const format = useCameraFormat(device, Templates.FrameProcessingBarcodeXGA);
  if (!device) {
    return null;
  }

  return (
    <>
      <Camera
        device={device}
        format={format}
        {...cameraProps}
        {...otherProps}
      />
      <CameraHighlights highlights={highlights} color="peachpuff" />
      {children}
    </>
  );
};
