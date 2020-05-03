function getConfig() {
  return {
    covidApiUrl:  "https://us-central1-lib-care.cloudfunctions.net/api", //"http://192.168.43.222:5001/lib-care/us-central1/api", //'https://us-central1-lib-care.cloudfunctions.net/api',
    covidApiMessaging: 'https://fcm.googleapis.com/fcm/send/topics/stopcovid-dj',
  };
}


export default getConfig();
