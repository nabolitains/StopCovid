import React from 'react'
import { View, Image,Text } from "react-native"
import {Button} from 'native-base'
import {withNavigation} from 'react-navigation'
import { resetStack } from '../../../utils/navigation'

const PasseScreen = ({navigation}:any) => {
    return(
        <View style={{display:"flex",flex:1,flexDirection:'column',justifyContent:'center',alignContent:'center'}}>
            <View>
                <Button style={{width:100,height:30,padding:15}} onPress={()=>resetStack(navigation, 'Home')} light>
                    <Text>Revenir</Text>
                </Button>
            </View>
            <View>         
                <Image style={{width:400,height:400}} source={require('../../../assets/images/qrCode.jpg')} />
            </View>
        </View>
    )
}

export default withNavigation(PasseScreen)
