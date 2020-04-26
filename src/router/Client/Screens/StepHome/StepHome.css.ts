import {Platform, StyleSheet} from 'react-native';


const Styles = StyleSheet.create({
  root: {
    backgroundColor: '#FCFCFF',
    alignItems : 'center',
    justifyContent: 'center',
  },
  ImageHome:{
    alignItems : 'center',
    justifyContent: 'center',
    width: 300,
    height: 300
  },
  DjibCare:{
    textAlign:'center',
    top: Platform.OS === "android" ?  40 :  75,
    color: '#3742fa',
  },
  captionDescri:{
    textAlign:'center',
    margin: 30,
    color: '#747d8c'
  },
  button:{
      textAlign:'center',
      color: '#ffa502',
      width: 150
  },
  textColorBtn:{ 
    color: '#36618A',
  },
  BtnInsCon:{
    backgroundColor: "#E7A946",
    marginBottom: 15,
  }
});

export default Styles
