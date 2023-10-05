import { Size, Point } from "./common";

export type iOSBoundingBox = {
  origin: Point;
  size: Size;
};

export type iOSCorners = {
  bottomRight: Point;
  topRight: Point;
  topLeft: Point;
  bottomLeft: Point;
};

/**
 * {@link https://developer.apple.com/documentation/vision/vnbarcodesymbology}
 */
export type iOSBarcodeSymbology =
  | "VNBarcodeSymbologyAztec"
  | "VNBarcodeSymbologyCode39"
  | "VNBarcodeSymbologyCode39Checksum"
  | "VNBarcodeSymbologyCode39FullASCII"
  | "VNBarcodeSymbologyCode39FullASCIIChecksum"
  | "VNBarcodeSymbologyCode93"
  | "VNBarcodeSymbologyCode93i"
  | "VNBarcodeSymbologyCode128"
  | "VNBarcodeSymbologyDataMatrix"
  | "VNBarcodeSymbologyEAN8"
  | "VNBarcodeSymbologyEAN13"
  | "VNBarcodeSymbologyGS1DataBar"
  | "VNBarcodeSymbologyGS1DataBarExpanded"
  | "VNBarcodeSymbologyGS1DataBarLimited"
  | "VNBarcodeSymbologyI2of5"
  | "VNBarcodeSymbologyI2of5Checksum"
  | "VNBarcodeSymbologyITF14"
  | "VNBarcodeSymbologyMicroPDF417"
  | "VNBarcodeSymbologyMicroQR"
  | "VNBarcodeSymbologyMSIPlessey"
  | "VNBarcodeSymbologyPDF417"
  | "VNBarcodeSymbologyQR"
  | "VNBarcodeSymbologyUPCE";

/**
 * {@link https://developer.apple.com/documentation/vision/vnbarcodeobservation}
 */
export type iOSBarcode = {
  boundingBox: iOSBoundingBox;
  timeRange?: { start: number; duration: number } /* iOS 14.0+ */;
  symbology: iOSBarcodeSymbology;
  confidence: number;
  uuid: string;
  payload: string;
  supplementalPayload?: string /* iOS 17.0+ */;
  corners: iOSCorners;
};
