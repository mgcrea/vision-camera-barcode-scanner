import type { Frame } from "react-native-vision-camera";

export type BasicParameterType = string | number | boolean | undefined;
export type ParameterType =
  | BasicParameterType
  | BasicParameterType[]
  | Record<string, BasicParameterType | undefined>;

export interface FrameProcessorPlugin {
  /**
   * Call the native Frame Processor Plugin with the given Frame and options.
   * @param frame The Frame from the Frame Processor.
   * @param options (optional) Additional options. Options will be converted to a native dictionary
   * @returns (optional) A value returned from the native Frame Processor Plugin (or undefined)
   */
  call: (
    frame: Frame,
    options?: Record<string, ParameterType>,
  ) => ParameterType;
}
