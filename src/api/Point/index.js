import ApiClient from '../ApiClient';

export const logPoints = (points, uid) => {
  //console.log("logPoints uid ==>", uid)
  return ApiClient.post(`/points/${uid}`, {
    points,
  });
};


export const uploadContacteList = (catactsList, uid) => {
  //console.log("uploadContacteList uid ==>", uid)
  return ApiClient.post(`/contacts/${uid}`, {
    catactsList,
  });
};
