import React, { type FunctionComponent } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { Highlight, Point, Size } from "src/types";

type CameraHighlightsProps = {
  highlights: Highlight[];
  color?: string;
  style?: StyleProp<ViewStyle>;
};
export const CameraHighlights: FunctionComponent<CameraHighlightsProps> = ({
  highlights,
  color,
  style,
}) => {
  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      {highlights.map(({ key, ...props }) => (
        <CameraHighlight key={key} color={color} {...props} />
      ))}
    </View>
  );
};

type CameraHighlightProps = {
  size: Size;
  origin: Point;
  color?: string;
};
export const CameraHighlight: FunctionComponent<CameraHighlightProps> = ({
  size,
  origin,
  color,
}) => {
  const { x: left, y: top } = origin;
  const { width, height } = size;
  return (
    <View
      style={[
        styles.highlight,
        { width, height, top, left, borderColor: color },
      ]}
    ></View>
  );
};

const styles = StyleSheet.create({
  highlight: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: 2,
    zIndex: 9999,
  },
});
