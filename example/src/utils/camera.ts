import {
  AndroidBarcode as Barcode,
  BoundingBox,
  Size,
  iOSBarcode,
  iOSBoundingBox,
} from '@mgcrea/vision-camera-code-scanner';
import {Key} from 'react';
import {Frame} from 'react-native-vision-camera';

export type Highlight = iOSBoundingBox & {key: Key};

const getBoundingBoxFromCornerPoints = (
  cornerPoints: NonNullable<Barcode['cornerPoints']>,
): BoundingBox => {
  'worklet';
  const xArray = cornerPoints.map(corner => corner.x);
  const yArray = cornerPoints.map(corner => corner.y);
  const x = Math.min(...xArray);
  const y = Math.min(...yArray);
  const width = Math.max(...xArray) - x;
  const height = Math.max(...yArray) - y;
  return {
    origin: {x, y},
    size: {
      width,
      height,
    },
  };
};
const translateCornerPoints = (
  cornerPoints: NonNullable<Barcode['cornerPoints']>,
  source: Size,
  target: Size,
): NonNullable<Barcode['cornerPoints']> => {
  'worklet';
  const ratio: Size = {
    width: target.width / source.width,
    height: target.height / source.height,
  };
  return cornerPoints.map(({x, y}) => {
    if (ratio.width > ratio.height) {
      const offsetY = (target.height - source.height * ratio.width) / 2;
      return {x: x * ratio.width, y: y * ratio.width + offsetY};
    } else {
      const offsetX = (target.width - source.width * ratio.height) / 2;
      return {x: x * ratio.height + offsetX, y: y * ratio.height};
    }
  });
};

export const computeAndroidHighlights = (
  barcodes: Barcode[],
  frame: Frame,
  layout: Size,
): Highlight[] => {
  'worklet';
  return barcodes
    .filter(({cornerPoints}) => cornerPoints && cornerPoints.length)
    .map(({rawValue, cornerPoints}, index) => {
      const translatedCornerPoints = translateCornerPoints(
        cornerPoints!,
        frame,
        layout,
      );
      return {
        ...getBoundingBoxFromCornerPoints(translatedCornerPoints),
        key: rawValue || `${index}`,
      };
    })
    .filter(Boolean);
};

export const computeiOSHighlights = (
  barcodes: iOSBarcode[],
  frame: Frame,
  layout: Size,
): Highlight[] => {
  'worklet';
  console.log({frame: frame.width, layout: layout.width});

  // return barcodes.map<Highlight>(({corners}, index) => {
  //   const cornerPoints = Object.values(corners).map(({x, y}) => ({
  //     x: x * layout.width,
  //     y: y * layout.height,
  //   }));
  //   console.log({cornerPoints});
  //   const translatedCornerPoints = translateCornerPoints(
  //     cornerPoints!,
  //     frame,
  //     layout,
  //   );
  //   console.log({translatedCornerPoints});
  //   const foo = getBoundingBoxFromCornerPoints(translatedCornerPoints);
  //   return {
  //     ...foo,
  //     key: `${index}`,
  //   };
  // });

  const ratio: Size = {
    width: layout.width / frame.width,
    height: layout.height / frame.height,
  };
  let offsetX = 0,
    offsetY = 0;
  // console.log(`layout.height: ${frame.width}, frame.height: ${frame.height}`);
  if (ratio.width > ratio.height) {
    offsetY = (layout.height - frame.height * ratio.width) / 2;
    console.log('width > height', offsetY);
  } else {
    offsetX = (layout.width - frame.width * ratio.height) / 2;
    console.log('width < height', offsetX);
  }
  console.log(ratio);
  return barcodes.map<Highlight>(({payload, boundingBox}, index) => ({
    key: `${payload}-${index}`,
    origin: {
      x: boundingBox.origin.x * frame.width * ratio.width,
      y:
        (1 - boundingBox.origin.y) * frame.height * ratio.height +
        offsetY * 1.2,
    },
    size: {
      width: boundingBox.size.width * frame.width * ratio.width,
      height: boundingBox.size.height * frame.height * ratio.height,
    },
  }));
};
