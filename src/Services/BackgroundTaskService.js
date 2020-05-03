import BackgroundFetch from 'react-native-background-fetch';
import { sync } from '../Helpers/SyncDB';
import BLEBackgroundService from '../Services/BLEBackgroundService'
import {getCurrentLocalisation} from '../tracking'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'

const INTERVAL = 15; // the value is received in minutes
const TASK_ID = "com.locnaute.stopCovid.contacttracer.pulse";

export async function executeTask() {
  console.log("[BackgroundService] ExecuteTask Sync");
  sync();
  console.log("[BackgroundService] ExecuteTask Pulse");
  BLEBackgroundService.pulse();
  console.log("[BackgroundService] ExecuteTask Finished Execute Task");

  
  console.log("[BackgroundService] ExecuteTask Start save locations in Db");
  const user =  auth().currentUser
  const location = await getCurrentLocalisation() 
  if(user){
      const getRef = database().ref(`users/stopCovid/locations/${user.uid}`)            
      //console.log('getRef===>',getRef)
      getRef.set({coordinate: {...location }}).catch((erreur)=>{
          console.log('erreur===>',erreur)
      })
  }
}

export const scheduleTask = async() => {
  try {
    await BackgroundFetch.scheduleTask({
      taskId: TASK_ID,
      stopOnTerminate: false,
      enableHeadless: true,
      delay: 60 * 1000,               // milliseconds (5s)
      forceAlarmManager: false,   // more precise timing with AlarmManager vs default JobScheduler
      periodic: false,           // Fire once only.
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
      requiresCharging: false, // Default
      requiresDeviceIdle: false, // Default
      requiresBatteryNotLow: false, // Default
      requiresStorageNotLow: false, // Default
    });
    console.log('[BackgroundService] Task scheduled');
  } catch (e) {
    console.warn('[BackgroundService] ScheduleTask fail', e);
  }
}

export default class BackgroundTaskServices {
  static start() {
    // Configure it.
    console.log('[BackgroundService] Configuring Background Task object');
    BackgroundFetch.configure(
      {
        minimumFetchInterval: INTERVAL,
        // Android options
        forceAlarmManager: true, // <-- Set true to bypass JobScheduler.
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false, // Default
        enableHeadless: true,
      },
      async (taskId) => {
        console.log('[BackgroundService] Inner task start: ', taskId);
        executeTask();

        // If it comes from the Scheduler, start it again. 
        if (taskId === 'com.locnaute.stopCovid.contacttracer.pulse') {
          // Test initiating a #scheduleTask when the periodic fetch event is received.
          try {
            console.log('[BackgroundFetch ForegroundTask] scheduling task again: ');
            await scheduleTask();
          } catch (e) {
            console.warn('[BackgroundFetch] scheduleTask falied', e);
          }
        }

        console.log('[BackgroundService] Inner task end: ', taskId);
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.warn('[BackgroundService] Failed to start', error);
      },
    );

    // Optional: Query the authorization status.
    BackgroundFetch.status((status) => {
        switch(status) {
        case BackgroundFetch.STATUS_RESTRICTED:
            console.warn("[BackgroundService] BackgroundFetch restricted");
            break;
        case BackgroundFetch.STATUS_DENIED:
            console.warn("[BackgroundService] BackgroundFetch denied");
            break;
        case BackgroundFetch.STATUS_AVAILABLE:
            console.log("[BackgroundService] BackgroundFetch is enabled");
            executeTask();
            scheduleTask();
            break;
        }
    });
    
    BackgroundFetch.start();
  }

  static stop() {
    BackgroundFetch.stop();
  }
}
