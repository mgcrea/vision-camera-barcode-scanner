import { Platform } from "react-native";
import type {
  CameraProps,
  Orientation,
  Frame,
} from "react-native-vision-camera";
import type { Point, Size, Barcode, BarcodeHighlight } from "src/types";
import { computeBoundingBoxFromCornerPoints } from "./convert";

const applyScaleFactor = (
  { x, y }: Point,
  source: Size,
  target: Size,
  resizeMode: CameraProps["resizeMode"] = "cover",
): Point => {
  "worklet";

  const ratio: Size = {
    width: target.width / source.width,
    height: target.height / source.height,
  };

  let scaleFactor;
  if (resizeMode === "contain") {
    scaleFactor = Math.min(ratio.width, ratio.height);
  } else if (resizeMode === "cover") {
    scaleFactor = Math.max(ratio.width, ratio.height);
  } else {
    throw new Error(`Invalid resize mode: ${resizeMode}`);
  }

  let newX = x * scaleFactor;
  let newY = y * scaleFactor;

  // iOS is using normalized coordinates
  // if (Platform.OS === 'ios') {
  //   newX *= source.width;
  //   newY *= source.height;
  // }

  // Center the image if it's contain mode
  if (resizeMode === "contain") {
    if (ratio.width < ratio.height) {
      newY += (target.height - source.height * scaleFactor) / 2;
    } else {
      newX += (target.width - source.width * scaleFactor) / 2;
    }
  }

  return { x: newX, y: newY };
};
export const applyTransformation = (
  { x, y }: Point,
  { width, height }: Size,
  orientation: Orientation,
): Point => {
  "worklet";

  if (Platform.OS === "android") {
    switch (orientation) {
      case "portrait":
        return { x: height - y, y: x };
      default:
        console.warn(`Unsupported orientation: ${orientation}`);
        return { x, y };
    }
  } else if (Platform.OS === "ios") {
    switch (orientation) {
      case "portrait-upside-down":
        return { x: y, y: x };
      default:
        console.warn(`Unsupported orientation: ${orientation}`);
        return { x, y };
    }
  } else {
    throw new Error(`Unsupported platform: ${Platform.OS}`);
  }
};
export const computeHighlights = (
  barcodes: Barcode[],
  frame: Frame,
  layout: Size,
): BarcodeHighlight[] => {
  "worklet";
  console.log(
    `frame: ${frame.width}x${frame.height} (${
      frame.orientation
    }) -> layout: ${layout.width.toFixed(2)}x${layout.height.toFixed(2)}`,
  );

  const highlights = barcodes.map<BarcodeHighlight>(
    ({ value, cornerPoints }, index) => {
      let translatedCornerPoints;

      translatedCornerPoints = cornerPoints?.map((point) =>
        applyScaleFactor(point, frame, layout, "contain"),
      );

      translatedCornerPoints = translatedCornerPoints?.map((point) =>
        applyTransformation(point, layout, frame.orientation),
      );

      const valueFromCornerPoints = computeBoundingBoxFromCornerPoints(
        translatedCornerPoints!,
      );

      return {
        key: `${value}.${index}`,
        ...valueFromCornerPoints,
      };
    },
  );
  console.log(JSON.stringify({ highlights }, null, 2));

  return highlights;
};
