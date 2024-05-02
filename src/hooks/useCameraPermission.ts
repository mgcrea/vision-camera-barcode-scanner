import { useCallback, useEffect, useState } from "react";
import { Linking } from "react-native";
import {
  Camera,
  type CameraPermissionStatus,
} from "react-native-vision-camera";

export const useCameraPermission = () => {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  useEffect(() => {
    const runEffect = async () => {
      setCameraPermissionStatus(await Camera.getCameraPermissionStatus());
    };
    runEffect();
  }, []);

  const requestCameraPermission = useCallback(async () => {
    console.log("Requesting camera permission...");
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === "denied") {
      await Linking.openSettings();
    }
    setCameraPermissionStatus(permission);
  }, []);

  return [cameraPermissionStatus, requestCameraPermission] as const;
};
