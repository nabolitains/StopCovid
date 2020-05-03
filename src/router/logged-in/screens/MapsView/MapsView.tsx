import  React,  {useEffect, useState, useRef}   from    'react'
import {Dimensions, StyleSheet}   from    'react-native'
import MapView, {EventUserLocation, Circle, PROVIDER_GOOGLE} from 'react-native-maps'
import {Spinner, View} from 'native-base'
import * as Permissions from 'expo-permissions'
import{getCurrentLocalisation} from '../../../../tracking'
import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
//import AppShell, { Content } from '../../../../components/AppShell'
//import { resetStack } from '../../utils/navigation'
export interface MapsViewState{
    latitude: number
    longitude: number
    altitude: number
    accuracy: number
    speed: number
}
const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex:1,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      flex:1
    },
   });
const mapsView = ({navigation}:any) =>{
    const ref_maps = useRef(null)
    const [userLocate, setUserLocate] = useState<MapsViewState>({
        latitude: 0,
        longitude: 0,
        altitude: 0,
        accuracy: 0,
        speed: 0,
    })
    //const [location, setLocation]   =  useState(null)
    const [locations, setLocations]   =  useState({})

    const _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION)
        if (status !== 'granted') {
         //this.setState({
         //  errorMessage: "La permission d'accéder à l'emplacement a été refusée",
         //})
        }
        const user =auth().currentUser
    
        let location = await getCurrentLocalisation()  
        if(user){            
            const getRefToSave = database().ref(`users/stopCovid/locations/${user.uid}`)            
            //console.log('getRef===>',getRef)
            getRefToSave.set({coordinate: {...location }}).catch((erreur)=>{
                console.log('erreur===>',erreur)
            })

            const getRef = database().ref(`users/stopCovid/locations`)
            getRef.on('value', (dataLocationSnapshot:FirebaseDatabaseTypes.DataSnapshot)=>{
                if(dataLocationSnapshot.exists()){
                    const coordinate = dataLocationSnapshot.val()
                    setLocations(coordinate)
                }
            })
        }
        setUserLocate({...location})
    } 
    useEffect(()=>{
          _getLocationAsync()
    },[])
    const { width, height } = Dimensions.get('window')
    const ASPECT_RATIO = (width/2) / (height/2)
    const LatLng = { latitude: userLocate.latitude, longitude: userLocate.longitude}
    console.log('LatLng===>',LatLng)
    if(userLocate.latitude===0){
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}> 
              <Spinner /> 
            </View>
          )
    }else{
        return(
                    <MapView
                    
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    ref={ref_maps}
                    style={styles.map} 
                    initialRegion={
                                    {
                                        latitude: userLocate.latitude, 
                                        longitude: userLocate.longitude, 
                                        latitudeDelta: 0.0922, 
                                        longitudeDelta: 0.0922 * ASPECT_RATIO
                                    }
                                    } 
                    camera={{
                                center: LatLng, 
                                heading: 1,
                                pitch: 2,
                                zoom: 17,
                                altitude:100,
                    }}
                    
                    >
                    <Circle center={{latitude:userLocate.latitude,longitude:userLocate.longitude}} radius={10} fillColor="#218c74" strokeColor="#b33939"/>
                    {
                        (Object.values(locations).length>0)
                        ? Object.values(locations).map( (value:any, index:number)=>(
                            <Circle key={index} center={{latitude:value.coordinate.latitude,longitude:value.coordinate.longitude}} radius={10} fillColor="#218c74" strokeColor="#b33939"/>
                            
                        ))
                        :null
                    }
                    </MapView>  
        )
    }
}

export default mapsView