import ApiClient from '../ApiClient';

export const logPoints = (points, kennitala = '') => {
  console.log("point  ==>", points)
  console.log("kennitala  ==>", kennitala)
 //return ApiClient.post(`/points`, {
 //  points,
 //  kennitala,
 //});
};
