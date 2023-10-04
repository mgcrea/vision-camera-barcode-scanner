import { Size, Point } from "./common";

export type iOSBoundingBox = {
  origin: Point;
  size: Size;
};
export type BoundingBox = iOSBoundingBox;

export type iOSCorners = {
  bottomRight: Point;
  topRight: Point;
  topLeft: Point;
  bottomLeft: Point;
};

export type iOSBarcode = {
  boundingBox: iOSBoundingBox;
  timeRange?: { start: number; duration: number };
  symbology: "VNBarcodeSymbologyEAN13";
  confidence: number;
  uuid: string;
  payload: string;
  corners: iOSCorners;
};
