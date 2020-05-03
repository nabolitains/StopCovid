import React, {Component} from 'react'
import {
  ScrollView, 
  Animated, 
  View,
  Easing,
} from 'react-native'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { AuthConsumer } from '../../../context/authentication'
import AppShell, {Content} from '../../../components/AppShell'
import Text, { Heading } from '../../../components/ui/Text'
import i18n from "i18next";
import initI18n from '../../../i18n'
import {
  List,
  ListItem,
  Left,
  Card,
  Right,
} from 'native-base'
import LottieView from 'lottie-react-native';

import update from 'immutability-helper';
import { resetStack } from '../../../utils/navigation'
import * as Permissions from 'expo-permissions' 
import { hasPhonePermission, hasLocationPermission } from '../../../Services/PermissionRequests';
import { registerPushNotifications } from '../../../push-notifications'

import {
  initBackgroundTracking,
  stopBackgroundTracking,
} from '../../../tracking'
import BLEBackgroundService from '../../../Services/BLEBackgroundService';
import BackgroundTaskServices from '../../../Services/BackgroundTaskService'
import DeviceInfo from 'react-native-device-info';
import { sync, readyToUploadCounter } from '../../../Helpers/SyncDB';
import  auth  from  '@react-native-firebase/auth'
import  database  from  '@react-native-firebase/database'
import { map } from 'lodash'

//init language preference
initI18n()

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        powerProgress:new Animated.Value(0),
        contacts:[],
        powerPlay:false,
        progress:new Animated.Value(0),
        deviceSerial:'',
        devicesFound:[], 
        scanStatus:'',
        broadcastStatus:'', 
        bluetoothStatus:'',
        locationPermission: false,
        phonePermission: false,
        readyToUpload: 0,
    }
  }
  
  refreshReadyToUpload() {
    readyToUploadCounter().then(toUpload => {
      this.setState({readyToUpload: toUpload});
    });
  }

  onDevice(device) {
    console.log('[onDevice]====>',device)
    let index = -1;
    for(let i=0; i< this.state.devicesFound.length; i++){
      if (this.state.devicesFound[i].serial == device.serial) {
        index = i;
      }
    }
    if (index<0) {
      let dev = {serial:device.serial, name:device.name, rssi:device.rssi, start:device.date, end:device.date};
      this.setState({
        devicesFound: update(this.state.devicesFound, 
          {$push: [dev]}
        )
      });
    } else {
      const itemIndex = index;
      this.setState({
        devicesFound: update(this.state.devicesFound, 
          {[itemIndex]: {end: {$set: device.date}, rssi: {$set: device.rssi || this.state.devicesFound[itemIndex].rssi }}}
        )
      });
    }

    this.refreshReadyToUpload();
  }

  onScanStatus(status) {
    this.setState({
      scanStatus: status.toString(),
      devicesFound:[]
    });
  }

  onBroadcastStatus(status) {
    this.setState({
      broadcastStatus: status.toString(),
      devicesFound:[]
    });
  }

  onBluetoothStatus(status) {
    this.setState({
      bluetoothStatus: status.toString()
    });
  }

  setID(id) {
    this.setState({ deviceSerial: id });
    BLEBackgroundService.setServicesUUID(id);
    this.start(); 
  }
  checkLocationPermission = async () => {
    const { status } = await Permissions.getAsync(Permissions.LOCATION)
    console.log('status===>',status)
    if (status !== 'granted') {
      resetStack(navigation, 'Permission')
      return
    }
    
    const phonePermissions = await hasPhonePermission()
    if (phonePermissions !== 'Yes') {
      resetStack(navigation, 'Permission')
      return
    }
    return status === 'granted' && phonePermissions === "Yes"
  }
  async componentDidMount(){    
    const {t} = this.props
   await initBackgroundTracking(t('trackingTitle'), t('trackingNotification'))
   await registerPushNotifications() 

    BackgroundTaskServices.start()
    
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
    }).start();
    BLEBackgroundService.init();
    BLEBackgroundService.addNewDeviceListener(this);
    BLEBackgroundService.requestBluetoothStatus();  
    this.refreshReadyToUpload();

    this.authorizeCollect()

    this.getContacts()
  }
  getContacts = ()  =>  {
    const user  = auth().currentUser
    if(user){
      const refGetContacts =  database().ref(`users/${user.uid}/contacts`)
      refGetContacts.once('value').then((datasnapshot)=>{
        if(datasnapshot.exists()){
          this.setState({contacts:datasnapshot.val()})
        }
      })
    }
   
  }
  componentWillUnmount() { 
    BLEBackgroundService.removeNewDeviceListener(this);
  }

  authorizeCollect = () =>{    
    DeviceInfo.getSerialNumber().then(deviceSerial => {
        if (deviceSerial && deviceSerial !== "unknown") { 
          this.setID(deviceSerial);
        } else {
          DeviceInfo.getDeviceName().then(deviceName => {
              this.setID(deviceName);
          });
        }
      });
  }

  start() {
    BLEBackgroundService.enableBT();
    BLEBackgroundService.start();

    this.setState({
      isLogging: true,
    });

    sync();
  }

  stop(){
    BLEBackgroundService.stop();

    this.setState({
      isLogging: false,
    });

    sync();
  }

  onClearArray = () => {
    this.setState({ devicesFound: [] });
  };

  dateDiffSecs(start, end) {
    return Math.floor((end.getTime() - start.getTime())/1000);
  }

  dateStr(dt) {
    return Moment(dt).format('H:mm:ss');
  }
  render() {
    
    return (
      <AppShell>      
        <ScrollView>
          <Content >
            <View style={{display:'flex',flexDirection:'column',justifyContent:"center",alignContent:'center', alignItems:'center'}}>
              {
                (this.state.devicesFound.length>0)
                ? this.state.devicesFound.map((device, key)=>(
                    <View key={key} style={{backgroundColor:'blue', borderRadius:50, width:10,height:10,position:"absolute",zIndex:15,top:Math.abs(device.rssi)}}>
                    </View>
                  ))
                :null
              }            
              </View>
              <LottieView style={{display:"flex", flex:0.7}} autoPlay loop autoSize source={require("./assets/radar.json")} progress={this.state.progress} />                     
          </Content>  
          {
            (this.state.contacts.length<=0)
            ?null
            :(
              <Card style={{marginTop:-195, backgroundColor:"#346564"}}>
                <List >
                  <ListItem selected>
                    <Heading invert level={3}>
                    {
                      i18n.t('contacteDeproximity')
                    }
                    </Heading>
                  </ListItem>
                  {
                    this.state.contacts.map((contactPush,index)=>(
                          <ListItem key={index}>
                              <Left>
                                <Text invert>{index+1}    |    </Text>
                                <Text invert>{contactPush.contact}</Text>
                              </Left>
                          </ListItem>
                        )
                      )
                  }
                </List>
              </Card>
            )
          }                      
        </ScrollView>
      </AppShell>
    )
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
}

const Screen = withTranslation()(({ ...props }) => (
  <AuthConsumer>
    {({ logout, getUid }) => <HomeScreen {...props} getUid={getUid} logout={logout} />}
  </AuthConsumer>
))

Screen.navigationOptions = {
  header: null,
}

export default Screen
