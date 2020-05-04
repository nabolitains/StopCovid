import ApiClient from '../ApiClient';

export const logPoints = (points, uid, background) => {
  //console.log("logPoints uid ==>", uid)
  return ApiClient.post(`/points/${uid}`, {
    points,
  },background)
};


export const uploadContacteList = (catactsList, uid, background) => {
  //console.log("uploadContacteList uid ==>", uid)
  return ApiClient.post(`/contacts/${uid}`, {
    catactsList,
  },
    background
  );
};
