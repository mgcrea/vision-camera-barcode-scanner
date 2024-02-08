import type { CameraProps, Frame } from "react-native-vision-camera";
import type { Barcode, Highlight, Size } from "src/types";
import { computeBoundingBoxFromCornerPoints } from "./convert";
import { applyScaleFactor, applyTransformation } from "./geometry";

export const computeHighlights = (
  barcodes: Pick<Barcode, "value" | "cornerPoints">[],
  frame: Pick<Frame, "width" | "height" | "orientation">,
  layout: Size,
  resizeMode: CameraProps["resizeMode"] = "cover",
): Highlight[] => {
  "worklet";

  // If the layout is not yet known, we can't compute the highlights
  if (layout.width === 0 || layout.height === 0) {
    return [];
  }

  /* iOS:
   * "portrait" -> "landscape-right"
   * "portrait-upside-down" -> "landscape-left"
   * "landscape-left" -> "portrait"
   * "landscape-right" -> "portrait-upside-down"
   */
  // @NOTE destructure the object to make sure we don't hold a reference to the original layout
  const adjustedLayout = ["portrait", "portrait-upside-down"].includes(
    frame.orientation,
  )
    ? {
        width: layout.height,
        height: layout.width,
      }
    : {
        width: layout.width,
        height: layout.height,
      };

  const highlights = barcodes.map<Highlight>(
    ({ value, cornerPoints }, index) => {
      let translatedCornerPoints = cornerPoints;

      translatedCornerPoints = translatedCornerPoints?.map((point) =>
        applyScaleFactor(point, frame, adjustedLayout, resizeMode),
      );
      translatedCornerPoints = translatedCornerPoints?.map((point) =>
        applyTransformation(point, adjustedLayout, frame.orientation),
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
  // console.log(JSON.stringify(highlights, null, 2));

  return highlights;
};
