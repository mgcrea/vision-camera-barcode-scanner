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

  const adjustedLayout = {
    width: layout.height,
    height: layout.width,
  };

  const highlights = barcodes.map<Highlight>(
    ({ value, cornerPoints }, index) => {
      let translatedCornerPoints = cornerPoints;

      translatedCornerPoints = translatedCornerPoints?.map((point) => {
        const scaledPoint = applyScaleFactor(
          point,
          frame,
          adjustedLayout,
          resizeMode,
        );
        return applyTransformation(
          scaledPoint,
          adjustedLayout,
          frame.orientation,
        );
      });

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
