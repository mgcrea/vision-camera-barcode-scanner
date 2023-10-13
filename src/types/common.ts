export type Point = {
  x: number;
  y: number;
};
export type Size = {
  width: number;
  height: number;
};
export type Rect = Point & Size;

export type Key = string | number | bigint;
