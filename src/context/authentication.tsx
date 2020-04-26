import React from 'react';
import ApiClient from '../api/ApiClient';
import { updatePushToken } from '../api/User';
import auth from '@react-native-firebase/auth';

export const AuthContext:React.Context<any> = React.createContext({
  isLoggedIn: false,
  init: () => {},
  login: () => {},
  logout: () => {},
  checkForValidToken: () => {},
  getToken: () => null,
  getUid: () => null,
})

interface ProviderAuthContext {
  isLoggedIn: boolean
  init: () => Promise<string|boolean>
  login: (token:any, isNewUser:any, uid:any) => Promise<void>
  logout: () => Promise<void>
  checkForValidToken: () => Promise<string|boolean>
  getToken: () => Promise<void>
  getUid: () => string|boolean
}

export const AuthConsumer = AuthContext.Consumer;
interface StateAuthProvider {
  isLoggedIn:boolean
  token:any
  uid:any
}
class AuthProvider extends React.Component {
  state:StateAuthProvider = {
    isLoggedIn: false,
    token: null,
    uid:null
  }

  checkForValidToken = async () => {
    try {
      const token = await ApiClient.getToken(); 
      this.setState({ token });
      return token;
    } catch (error) {
      console.log(error);
    }
 
    return false;
  };

  checkForValidUid = async () => {
    try {
      const uid = await ApiClient.getUid(); 
      
      this.setState({ uid });
      return uid;
    } catch (error) {
      console.log("checkForValidUid error==>", error);
    }

    return false;
  };

  init = async () => {
    const hasValidToken = await this.checkForValidToken();  
    const hasValidUid = await this.checkForValidUid();  
    
    this.setState({ isLoggedIn: hasValidToken && hasValidUid });
    return hasValidToken;
  };

  login = async (token:any, isNewUser:any, uid:any) => {
    this.setState({ token, uid, isNewUser});
    await ApiClient.setToken(token);
    await ApiClient.setUid(uid);
  };

  logout = async () => {
    //await updatePushToken(null);
    this.setState({ token: null, uid: null });
    await ApiClient.clearToken();
    await ApiClient.clearUid();
    await auth().signOut();
  };

  getToken = () => {
    
    return this.state.token;
  };

  getUid = () => {
    const user = auth().currentUser
    if(user){ 
      return user.uid;
    }else{
      return false
    }
  };

  render() {
    const { isLoggedIn } = this.state;
    const { children } = this.props;
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn,
          init: this.init,
          login: this.login,
          logout: this.logout,
          checkForValidToken: this.checkForValidToken,
          getToken: this.getToken,
          getUid: this.getUid,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;
