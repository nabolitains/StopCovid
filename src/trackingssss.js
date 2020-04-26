import * as Permissions from 'expo-permissions';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

export async function stopBackgroundTracking() {
  BackgroundGeolocation.stop();
}

async function startBackgroundTracking(title, text) {
  try {
    await stopBackgroundTracking();

    BackgroundGeolocation.configure({
      // Accept a 100 meter inaccuracy.
      desiredAccuracy: BackgroundGeolocation.MEDIUM_ACCURACY,

      // When the app is active, we update the location less often when it's stationary inside this radius.
      stationaryRadius: 50,

      // Only log a new location that is at least this distance from the previous location.
      distanceFilter: 50,

      // Run a foreground service on Android that shows up as a notification. This gives us
      // more reliability in monitoring the location when the app is closed.
      startForeground: true,
      notificationTitle: title,
      notificationText: text,

      // Restart the foreground service on Android when the device boots.
      startOnBoot: true,

      // Keep monitoring location after the app terminates.
      // - On Android, this works using a foreground service.
      // - On iOS it switches to the Significant-Change Location Service which wakes up the
      //   app when the device moves 500 meters or more.
      stopOnTerminate: false,

      // Only Android: The minimum time interval between location updates when not stationary.
      // - iOS ignores this and only posts location updates based on the `distanceFilter` above.
      interval: 1000 * 60,

      // Only iOS: Try and get more location data in the rare cases when the app wakes in the background.
      saveBatteryOnBackground: false,

      // When enabled, the plugin will emit sounds for life-cycle events of background-geolocation!
      debug: false,
    });
    BackgroundGeolocation.start();

    return true;
  } catch (error) {
    return false;
  }
}

export async function initBackgroundTracking(title, text) {
  console.log("coordinate ===>", location)
  try {
    await Permissions.askAsync(Permissions.LOCATION);
    await startBackgroundTracking(title, text);
    return true;
  } catch (error) {
    return false;
  }
}

// Filter points older than 14 days old.
const LOCATION_AGE_LIMIT = 1000 * 60 * 60 * 24 * 14;

// Trim lat/lon to 5 digits (1 meter accuracy).
const trimLocation = value => Number(value.toFixed(5));

export function getPoints() {
  return new Promise((resolve, reject) => {
    BackgroundGeolocation.getLocations(
      locations => {
        const timeCutoff = Date.now() - LOCATION_AGE_LIMIT;
        const filtered = locations.filter(
          location => location.time > timeCutoff,
        );

        // Minify point data before network upload.
        const cleaned = filtered.map(location => ({
          lat: trimLocation(location.latitude), 
          lon: trimLocation(location.longitude),
          acc: Math.round(location.accuracy),
          time: Math.round(location.time),
        }));
        resolve(cleaned);
      },
      error => reject(error),
    );
  });
}


export function getCurrentLocalisation (){
  return new Promise((resolve, reject) => {
    BackgroundGeolocation.getCurrentLocation(
      location => {        
        console.log("coordinate ===>", location)
        resolve({...location});
      },
      error => reject(error),
    );
  });  
}