import * as SecureStore from 'expo-secure-store'
import { userAgent } from './shared'
import { storage } from '../utils'
import config from '../config'
import auth from '@react-native-firebase/auth';

export class AuthenticationError extends Error {}

const getData = async (res:any) => {
  if (res.status === 401) {
    throw new AuthenticationError()
  }

  let data = null
  try {
    data = await res.json()
    
  } catch {
    console.log('data in Catch to getData==>', data)
  }

  if (!res.ok) {
    const error:any = new Error(
      (data && data.message) ||
        `Unexpected server error (${res.status} ${res.url})`,
    )
    error.status = res.status
    error.statusText = res.statusText
    error.body = data
    throw error
  }
  return data
}

const safeFetch = async (url:any, token:any, uid:any, options:any) => { 
  const fetchOptions = {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-User-Agent': userAgent,
      ...options.headers,
    },
  }

  if (token) {
    fetchOptions.headers.Authorization = `Bearer ${token}`
  }
  
  const response = await fetch(`${config.covidApiUrl}${url}`, fetchOptions)
  
  return getData(response)
} 

//connection use with token server in firebase client for future use
export const echangeTokenTotokenClient = (token:any) =>{
  return new Promise( (resolve, rejecte)=>{ 
    auth().signInWithCustomToken(token).then( async(userCredential) =>{
      const {user} = userCredential
      const uid = user.uid
      const token = await user.getIdToken()
      
      resolve({token:token, error:false, uid:uid})
    }).catch( (erreur) =>{ 
      rejecte({erreur: erreur, error:true, uid:null})
    })
  })
}

/**
 * Call the Covid API and handle errors.
 */
class ApiClient {
  token:string|undefined = undefined
  uid:string|undefined = undefined

  async setToken(token:string) { 
    this.token = token  
    
    return Promise.all([
      SecureStore.setItemAsync('token', token), 
      storage.save('isRegistered', true),
    ]) 
  } 

  setUid(uid:string) { 
    this.uid = uid  
    
    return Promise.all([
      SecureStore.setItemAsync('uid', uid), 
      storage.save('isRegisteredUid', true),
    ])
  } 

  clearToken() {
    this.token = undefined
    return Promise.all([
      SecureStore.deleteItemAsync('token'), 
      storage.remove('isRegistered'),
    ])
  }

  clearUid() {
    this.uid = undefined
    return Promise.all([
      SecureStore.deleteItemAsync('uid'), 
      storage.remove('isRegisteredUid'),
    ])
  } 

  async getToken() {
    const isRegistered = Boolean(await storage.get('isRegistered'))
    
    this.token = isRegistered
      ? await SecureStore.getItemAsync('token')
      : undefined
    return this.token
  }

  async getUid() {
    const isRegisteredUid = Boolean(await storage.get('isRegisteredUid'))
    
    this.uid = isRegisteredUid
      ? await SecureStore.getItemAsync('uid')
      : undefined
    return this.uid
  }

  get(url:any) {
    if (!this.getToken()) {
      return
    }

    return safeFetch(url, this.token, this.uid, {
      method: 'GET',
    })
  }

  post(url:any, body:any) {
    if (!this.getToken()) {
      return
    }
    
    return safeFetch(url, this.token, this.uid, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  delete(url:any, body:any) {
    if (!this.getToken()) {
      return
    }

    return safeFetch(url, this.token, this.uid, {
      method: 'DELETE',
      body: JSON.stringify(body),
    })
  }

  put(url:any, body:any) {
    if (!this.getToken()) {
      return
    }

    return safeFetch(url, this.token, this.uid, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }
}

export default new ApiClient()
