import { Platform } from "react-native";
import type { Frame } from "react-native-vision-camera";
import type {
  AndroidBarcode,
  Barcode,
  BoundingBox,
  Point,
  iOSBarcode,
} from "src/types";
import { normalizeAndroidCodeType, normalizeiOSCodeType } from "./types";

export const isIOSBarcode = (
  barcode: iOSBarcode | AndroidBarcode,
): barcode is iOSBarcode => {
  "worklet";
  return Platform.OS === "ios";
};

export const isAndroidBarcode = (
  barcode: iOSBarcode | AndroidBarcode,
): barcode is AndroidBarcode => {
  "worklet";
  return Platform.OS === "android";
};

export const computeBoundingBoxFromCornerPoints = (
  cornerPoints: Point[],
): BoundingBox => {
  "worklet";
  const xArray = cornerPoints.map((corner) => corner.x);
  const yArray = cornerPoints.map((corner) => corner.y);
  // @NOTE we can't use destructuring here because babel would wrap it in non-worklet functions
  const x = Math.min.apply(null, xArray);
  const y = Math.min.apply(null, yArray);
  const width = Math.max.apply(null, xArray) - x;
  const height = Math.max.apply(null, yArray) - y;
  return {
    origin: { x, y },
    size: {
      width,
      height,
    },
  };
};

export const normalizePrecision = (number: number): number => {
  "worklet";
  return Math.round(number);
};

export const normalizeNativeBarcode = (
  barcode: iOSBarcode | AndroidBarcode,
  frame: Frame,
): Barcode => {
  "worklet";
  if (isIOSBarcode(barcode)) {
    const { payload, symbology, boundingBox, corners } = barcode;
    return {
      value: payload,
      type: normalizeiOSCodeType(symbology),
      boundingBox: {
        origin: {
          x: normalizePrecision(boundingBox.origin.x * frame.width),
          y: normalizePrecision(boundingBox.origin.y * frame.height),
        },
        size: {
          width: normalizePrecision(boundingBox.size.width * frame.width),
          height: normalizePrecision(boundingBox.size.height * frame.height),
        },
      },
      cornerPoints: Object.values(corners).map(({ x, y }) => ({
        x: normalizePrecision(x * frame.width),
        y: normalizePrecision(y * frame.height),
      })),
      native: barcode,
    };
  } else if (isAndroidBarcode(barcode)) {
    const { rawValue, format, cornerPoints } = barcode;
    return {
      value: rawValue,
      type: normalizeAndroidCodeType(format),
      boundingBox: computeBoundingBoxFromCornerPoints(cornerPoints),
      cornerPoints,
      native: barcode,
    };
  } else {
    throw new Error(`Unsupported platform: ${Platform.OS}`);
  }
};
