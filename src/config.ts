function getConfig() {
  return {
    covidApiUrl: 'https://us-central1-lib-care.cloudfunctions.net/api',
    covidApiMessaging: 'https://fcm.googleapis.com/fcm/send/topics/stopcovid-dj',
  };
}


export default getConfig();
