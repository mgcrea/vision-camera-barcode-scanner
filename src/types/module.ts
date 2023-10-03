import type { AndroidBarcode } from "./android";

export type VisionCameraConstants = {
  MODULE_NAME: string;
  BARCODE_TYPES: { [key: string]: number };
  BARCODE_FORMATS: { [key: string]: number };
};

export type AndroidImage = {
  orientation:
    | "portrait"
    | "landscape-right"
    | "landscape-left"
    | "portrait-upside-down";
  pixelFormat: "yuv" | "rgb" | "native" | "unknown";
  width: number;
  height: number;
};

export type AndroidResponse = {
  image: AndroidImage;
  barcodes: AndroidBarcode[];
};
