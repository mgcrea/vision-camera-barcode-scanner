import { Platform } from "react-native";

export const Templates = {
  /**
   * XGA-quality for faster Frame Processing in YUV pixelFormat (e.g. 720p)
   */
  FrameProcessingBarcodeXGA: [
    { videoResolution: { width: 1024, height: 768 } },
    { pixelFormat: Platform.OS === "ios" ? "native" : "yuv" },
  ],
};
