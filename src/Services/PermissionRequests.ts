import BLEAdvertiser from 'react-native-ble-advertiser'
import { PermissionsAndroid, Platform, Alert } from 'react-native';

export async function hasLocationPermission() {
  if (Platform.OS === 'ios') {
    return "Yes"
  }
  try {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    console.log("Location Permission:", granted);
    return granted ? 'Yes' : 'No';
  } catch (e) {
    return e.toString();
  }
}

export async function hasPhonePermission() {
  if (Platform.OS === 'ios') {
    return "Yes"
  }
  try {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
    console.log("Phone Permission:", granted);
    return granted ? 'Yes' : 'No';
  } catch (e) {
    return e.toString();
  }
}

export async function isBluetoothActive() {
  return await BLEAdvertiser.getAdapterState() === "STATE_ON";
}

export async function requestLocationPermission() {
  try {
    if (Platform.OS === 'android') {
      const locationGranted = await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE]
      );
      console.log("Permissions Granted? ", locationGranted);
    }

    BLEAdvertiser.getAdapterState().then(result => {
      console.log('[Bluetooth]', "isBTActive", result)

      if (result !== "STATE_ON") {
        Alert.alert(
          'BCH Contact Tracing requires bluetooth to be enabled',
          'Would you like to enable Bluetooth?',
          [
            {
              text: 'Yes',
              onPress: () => BLEAdvertiser.enableAdapter(),
            },
            {
              text: 'No',
              onPress: () => console.log('No Pressed'),
              style: 'cancel',
            },
          ],
        )
      }
    }).catch(error => { 
      console.log('[Bluetooth]', "BT Not Enabled")
      return false;
    });
  } catch (err) {
    console.warn(err)
  }
}