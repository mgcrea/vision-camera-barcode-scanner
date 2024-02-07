import { Platform } from "react-native";

const pixelFormat = Platform.OS === "ios" ? "native" : "yuv";

export const Templates = {
  /**
   * HD-quality for faster Frame Processing in YUV pixelFormat (e.g. 720p)
   */
  FrameProcessingYUV: [
    { videoResolution: { width: 1080, height: 720 } },
    { pixelFormat },
  ],
  /**
   * XGA-quality for faster Frame Processing in YUV pixelFormat
   */
  FrameProcessingBarcodeXGA: [
    { videoResolution: { width: 1024, height: 768 } },
    { pixelFormat },
  ],
};
