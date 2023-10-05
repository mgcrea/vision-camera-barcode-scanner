import type { Frame } from "react-native-vision-camera";
import type { Barcode, Highlight, Size } from "src/types";
import { computeBoundingBoxFromCornerPoints } from "./convert";
import { applyScaleFactor, applyTransformation } from "./geometry";

export const computeHighlights = (
  barcodes: Barcode[],
  frame: Frame,
  layout: Size,
): Highlight[] => {
  "worklet";

  const highlights = barcodes.map<Highlight>(
    ({ value, cornerPoints }, index) => {
      let translatedCornerPoints;

      translatedCornerPoints = cornerPoints?.map((point) =>
        applyScaleFactor(point, frame, layout, "contain"),
      );

      translatedCornerPoints = translatedCornerPoints?.map((point) =>
        applyTransformation(point, layout, frame.orientation),
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

  return highlights;
};
