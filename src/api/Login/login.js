import ApiClient from '../ApiClient'
import { getLanguage } from '../../i18n'
import auth from "@react-native-firebase/auth" 

export const getPin = (countryCode, phoneNumber) => { 
  return new Promise( (resolve, reject) =>{
    auth().signInWithPhoneNumber(`+${countryCode}${phoneNumber}`).then( (confirmResult) =>{
      resolve({pinToken: 'confirmResult.verificationId', confirm:confirmResult, erreur:false, erreurInfo:""})
    }).catch( (erreur) =>{
      resolve({pinToken: null, confirm:null, erreur:true, erreurInfo:erreur})
    })
  })
}

export const verifyPin = (pin, requestToken, countryCode, phoneNumber, confirm) => {
  return new Promise( (resolve, reject) =>{
      confirm.confirm(pin).then( async () =>{ 
        resolve(await ApiClient.post(`/user/pin`, {
          pin,
          locale: getLanguage(),
          token: requestToken,
          role:'user',
          phone: `+${countryCode}${phoneNumber}`,
          verificationChecked:{
            status: "approved",
            pin:pin,
            verificationId: requestToken,
          }
        }))
      }).catch( (erreur) =>{
        reject({token: null, isNewUser: false, uid:null, erreurInfo: {...erreur}, erreur: true})
      })

  })
}
