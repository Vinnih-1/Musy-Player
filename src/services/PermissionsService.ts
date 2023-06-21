import { PermissionsAndroid } from 'react-native';

export const RequestPermissions = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );

  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('Access to external storage granted by the user.');
  } else
    console.log('Access to external storage has been denied by the user.');
};
