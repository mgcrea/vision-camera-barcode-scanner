import { type FormatFilter } from "react-native-vision-camera";

export const Templates = {
  /**
   * HD-quality for faster Frame Processing in YUV pixelFormat (e.g. 720p)
   */
  FrameProcessingYUV: [
    { videoResolution: { width: 1080, height: 720 } },
    { pixelFormat: "yuv" },
  ],
  /**
   * XGA-quality for faster Frame Processing in YUV pixelFormat
   */
  FrameProcessingBarcodeXGA: [
    { videoResolution: { width: 1024, height: 768 } },
    { pixelFormat: "yuv" },
  ],
} as const satisfies Record<string, FormatFilter[]>;
