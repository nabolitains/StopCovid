import  React,  {useEffect, useState, useRef}   from    'react'
import {Dimensions}   from    'react-native'
import MapView, {EventUserLocation, Circle} from 'react-native-maps'
import { Container, Spinner, View, Button,Text } from 'native-base'
import * as Permissions from 'expo-permissions'
import{getCurrentLocalisation} from '../../tracking'
import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import {withNavigation} from 'react-navigation'
import { resetStack } from '../../utils/navigation'
export interface MapsViewState{
    latitude: number
    longitude: number
    altitude: number
    accuracy: number
    speed: number
    heading: number
}
const mapsView = ({navigation}:any) =>{
    const ref_maps = useRef(null)
    const [userLocate, setUserLocate] = useState<MapsViewState>({
        latitude: 0,
        longitude: 0,
        altitude: 0,
        accuracy: 0,
        speed: 0,
        heading: 0,
    })
    const [location, setLocation]   =  useState(null)
    const [locations, setLocations]   =  useState({})

    const _onUserLocationChange = ( e:EventUserLocation["nativeEvent"] ) => {
        const {coordinate} = e 
        const user =auth().currentUser
        if(user){
            const getRef = database().ref(`users/stopCovid/locations/${user.uid}`)            
            //console.log('getRef===>',getRef)
            getRef.set({coordinate: {...coordinate }}).catch((erreur)=>{
                console.log('erreur===>',erreur)
            })
        }

        //console.log('coordinate===>',coordinate)
        setUserLocate({...coordinate })
        setLocation({location: e.coordinate })
    }
    

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
    //console.log('locations===>',locations)
    if(userLocate.latitude===0){
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}> 
              <Spinner /> 
            </View>
          )
    }else{
        return(
            <Container> 
                    <View style={{position:'absolute',zIndex:15,padding:20}}>
                        <Button style={{width:150,height:30,padding:15}} onPress={()=>resetStack(navigation, 'Home')} light>
                            <Text>Revenir</Text>
                        </Button>
                    </View>        
                    <MapView
                        ref={ref_maps}
                        followsUserLocation={true} 
                        showsUserLocation
                        onUserLocationChange={ (e) => _onUserLocationChange(e.nativeEvent) } 
                        style={{flex:1, width, height}} 
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
            </Container>
        )
    }
}

export default withNavigation(mapsView)