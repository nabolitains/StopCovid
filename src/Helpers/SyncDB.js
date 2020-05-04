import { CONTACT, LAST_SEEN, TOKEN, UID } from '../constants/storage';
import AsyncStorage from '@react-native-community/async-storage';
import {getPoints} from '../tracking'
import {logPoints, uploadContacteList} from "../api/Point"
import auth from '@react-native-firebase/auth'
import config from "../config"

const c1MIN = 1000 * 60;
const ACCEPT_JSON = { "Accept": "application/json", "Content-Type": "application/json" };

export async function saveContactToUpload(_uploader, _contact, _rssi, _date) {
  AsyncStorage.getItem(LAST_SEEN + _contact).then(lastSeenInMilliseconds => {
      // Only records one per minute. 
      if (!lastSeenInMilliseconds || _date.getTime() > parseInt(lastSeenInMilliseconds) + c1MIN) {
        let contactData = { uploader:_uploader, contact: _contact, rssi:_rssi, date:_date.toISOString() };
        AsyncStorage.setItem(CONTACT + _contact + _date.toISOString(), JSON.stringify(contactData));  
        AsyncStorage.setItem(LAST_SEEN + _contact, _date.getTime().toString()); 
      }
  }); 
};

export async function readyToUploadCounter() {
    let ks = await AsyncStorage.getAllKeys();
    return ks.filter(key => key.startsWith(CONTACT)).length;
}

async function upload1000Keys(background) {
    let uid = await AsyncStorage.getItem(UID)
    const points = await getPoints()
    // Send geolocation data to the API.
    uid=uid
    logPoints(points, uid, background)

    AsyncStorage.getAllKeys().then(ks => {
    let keysToUpload = ks.sort().filter(key => key.startsWith(CONTACT)).slice(0,10000);
    AsyncStorage.multiGet(keysToUpload).then(data => {
            if (data.length > 0) { 
                keys = data.map(keyValue => keyValue[0]);
                values = data.map(keyValue => JSON.parse(keyValue[1]));
                
                uploadContacteList(values, uid, background).then(response => {
                    if (response.status == 200) {
                        AsyncStorage.multiRemove(keys);
                    }
                }).catch(error => {
                    console.log("Upload Error", error); 
                });
            }
        });
    });
}

async function isOnline() {
    return fetch(config.covidApiUrl, { method: "GET", headers: ACCEPT_JSON } );
}

export async function sync (background) {
    isOnline().then(response => {
        if (response.status == 200) { // is online
            upload1000Keys(background);
        }
    }).catch(error => {
        console.log("Phone Offline", error); 
    });
}