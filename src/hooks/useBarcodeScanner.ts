import { useRef, useState } from "react";
import { Platform, type ViewProps } from "react-native";
import {
  runAtTargetFps,
  useFrameProcessor,
  type Camera,
} from "react-native-vision-camera";
import { Worklets } from "react-native-worklets-core";
import { scanCodes } from "src/module";
import type { Barcode, CodeType, Highlight, Size } from "src/types";
import { computeHighlights } from "src/utils";

export type UseBarcodeScannerOptions = {
  fps?: number;
  codeTypes?: CodeType[];
  onCodeScanned: (barcodes: Barcode[]) => void;
  disableHighlighting?: boolean;
};

export const useBarcodeScanner = ({
  codeTypes,
  onCodeScanned,
  disableHighlighting,
  fps = 2,
}: UseBarcodeScannerOptions) => {
  const ref = useRef<Camera>(null);

  // Layout of the <Camera /> component
  const layoutRef = useRef<Size>({ width: 0, height: 0 });
  const onLayout: ViewProps["onLayout"] = (event) => {
    const { width, height } = event.nativeEvent.layout;
    layoutRef.current = { width, height };
    console.log("layoutRef.current", layoutRef.current);
    console.log({ current: ref.current });
  };

  // Barcode highlights related state
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const setHighlightsJS = Worklets.createRunInJsFn(setHighlights);

  const pixelFormat = Platform.OS === "android" ? "yuv" : "native";
  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      runAtTargetFps(fps, () => {
        "worklet";
        const { current: layout } = layoutRef;
        console.log(
          `frame: ${frame.width}x${frame.height} (${
            frame.orientation
          }) -> layout: ${layout.width.toFixed(2)}x${layout.height.toFixed(2)}`,
        );
        const barcodes = scanCodes(frame, codeTypes);

        // console.log(JSON.stringify(barcodes, null, 2));
        if (disableHighlighting !== true) {
          const highlights = computeHighlights(barcodes, frame, layout);
          setHighlightsJS(highlights);
        }

        if (barcodes.length > 0) {
          onCodeScanned(barcodes);
        }
      });
    },
    [layoutRef.current, disableHighlighting],
  );

  return { props: { pixelFormat, frameProcessor, onLayout, ref }, highlights };
};
