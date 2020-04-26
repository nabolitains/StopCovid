import ApiClient from '../ApiClient'
import auth from '@react-native-firebase/auth'

export const getUser = async (pushToken:string|null, uid:string|undefined) => {
  if(typeof uid === "undefined") {
    const user = auth().currentUser
    
    if(user){ 
      return ApiClient.put(`/user/${user.uid}`, {
        pushToken,
        uid: user.uid
      })
    }else{ 
      return new Error('User was non found')
    }
  }
  const data = await ApiClient.get(`/user/${uid}`)
  
  return (
    data && {
      dataRequested: data.dataRequested,
      requiresKennitala: data.requiresKennitala,
    }
  )
}

export const verifyToken = async (uid:string) => {
  
  return !!(await getUser(null, uid))
}

export const updatePushToken = async (pushToken:string) => {  
    const user = auth().currentUser
    if(user){ 
      return ApiClient.put(`/user/${user.uid}`, {
        pushToken
      }) 
    }
}

export const ignoreDataRequest = async () => {
  const user = auth().currentUser
  if(user){ 
    return ApiClient.delete(`/user/${user.uid}/data-request`, {})
  }
}
