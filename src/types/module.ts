import type { AndroidBarcode } from "./android";
import type { Key, Point } from "./common";
import type { iOSBarcode, iOSBoundingBox } from "./ios";

export type VisionCameraConstants = {
  MODULE_NAME: string;
  BARCODE_TYPES: { [key: string]: number };
  BARCODE_FORMATS: { [key: string]: number };
};

export type BoundingBox = iOSBoundingBox;
export type CornerPoints = Point[];
export type BarcodeHighlight = BoundingBox & { key: Key };

export type Barcode = {
  value: string;
  boundingBox: BoundingBox;
  cornerPoints: Point[];
  native: iOSBarcode | AndroidBarcode;
};
