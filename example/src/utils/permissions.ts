import {
  Alert,
  type PermissionStatus,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Camera} from 'react-native-vision-camera';

const APP_NAME = 'My App';

export const requestCameraPermission = async (): Promise<
  PermissionStatus | 'restricted'
> => {
  if (Platform.OS === 'android') {
    return await requestAndroidCameraPermission();
  }
  const cameraPermission = await Camera.getCameraPermissionStatus();
  if (cameraPermission === 'not-determined') {
    const newCameraPermission = await Camera.requestCameraPermission();
    if (newCameraPermission !== 'granted') {
      Alert.alert('Please go to the settings to enable it!');
    }
    return newCameraPermission;
  }
  return cameraPermission;
};

export const requestAndroidCameraPermission =
  async (): Promise<PermissionStatus> => {
    try {
      const checkResult = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (checkResult) {
        console.log('Camera permission already granted');
        return PermissionsAndroid.RESULTS.GRANTED;
      }
      const requestResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: `${APP_NAME} Photo App Camera Permission`,
          message: `${APP_NAME} needs access to your camera to scan barcodes.`,
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (requestResult === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
      return requestResult;
    } catch (err) {
      console.warn(err);
      return PermissionsAndroid.RESULTS.DENIED;
    }
  };
