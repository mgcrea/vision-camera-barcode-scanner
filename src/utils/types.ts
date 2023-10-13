import type { BarcodeType, iOSSymbology } from "src/types";
import { AndroidBarcodeFormat } from "..";

export const normalizeiOSCodeType = (symbology: iOSSymbology): BarcodeType => {
  "worklet";
  switch (symbology) {
    case "VNBarcodeSymbologyAztec":
      return "aztec";
    case "VNBarcodeSymbologyCode39":
    case "VNBarcodeSymbologyCode39Checksum":
    case "VNBarcodeSymbologyCode39FullASCII":
    case "VNBarcodeSymbologyCode39FullASCIIChecksum":
      return "code-39";
    case "VNBarcodeSymbologyCode93":
    case "VNBarcodeSymbologyCode93i":
      return "code-93";
    case "VNBarcodeSymbologyCode128":
      return "code-128";
    case "VNBarcodeSymbologyDataMatrix":
      return "data-matrix";
    case "VNBarcodeSymbologyEAN8":
      return "ean-8";
    case "VNBarcodeSymbologyEAN13":
      return "ean-13";
    case "VNBarcodeSymbologyGS1DataBar":
    case "VNBarcodeSymbologyGS1DataBarExpanded":
    case "VNBarcodeSymbologyGS1DataBarLimited":
      return "gs1-databar";
    case "VNBarcodeSymbologyI2of5":
    case "VNBarcodeSymbologyI2of5Checksum":
    case "VNBarcodeSymbologyITF14":
      return "itf";
    case "VNBarcodeSymbologyMicroPDF417":
    case "VNBarcodeSymbologyPDF417":
      return "pdf-417";
    case "VNBarcodeSymbologyMicroQR":
    case "VNBarcodeSymbologyQR":
      return "qr";
    case "VNBarcodeSymbologyMSIPlessey":
      return "msi-plessey";
    case "VNBarcodeSymbologyUPCE":
      return "upc-e";
    default:
      return "unknown";
  }
};

export const normalizeAndroidCodeType = (
  format: AndroidBarcodeFormat,
): BarcodeType => {
  "worklet";
  switch (format) {
    case AndroidBarcodeFormat.AZTEC:
      return "aztec";
    case AndroidBarcodeFormat.CODABAR:
      return "codabar";
    case AndroidBarcodeFormat.CODE_39:
      return "code-39";
    case AndroidBarcodeFormat.CODE_93:
      return "code-93";
    case AndroidBarcodeFormat.CODE_128:
      return "code-128";
    case AndroidBarcodeFormat.DATA_MATRIX:
      return "data-matrix";
    case AndroidBarcodeFormat.EAN_8:
      return "ean-8";
    case AndroidBarcodeFormat.EAN_13:
      return "ean-13";
    case AndroidBarcodeFormat.ITF:
      return "itf";
    case AndroidBarcodeFormat.PDF417:
      return "pdf-417";
    case AndroidBarcodeFormat.QR_CODE:
      return "qr";
    case AndroidBarcodeFormat.UPC_A:
      return "upc-a";
    case AndroidBarcodeFormat.UPC_E:
      return "upc-e";
    case AndroidBarcodeFormat.UNKNOWN:
    default:
      return "unknown";
  }
};
