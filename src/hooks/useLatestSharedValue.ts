import { useEffect } from "react";
import { useSharedValue } from "react-native-worklets-core";

export function useLatestSharedValue<T>(
  value: T,
  dependencies: unknown[] = [value],
) {
  const sharedValue = useSharedValue<T>(value);
  useEffect(() => {
    sharedValue.value = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return sharedValue;
}
