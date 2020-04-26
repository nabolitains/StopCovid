import React, {Component}from 'react'
import { Text, View, Image, ImageSourcePropType} from 'react-native'
import { Container, Content, H1, Button } from 'native-base'
import { Row, Grid } from 'react-native-easy-grid'
import styles from './StepHome.css'
import { withNavigation, NavigationScreenProp } from 'react-navigation'

type StepHomeProps = {
  navigation: NavigationScreenProp<any, any>
  next: (x:number) => void
  done: () => void
  previous:(x:number) => void
  started:boolean
  countData:number
  donnee:Array<Data>
}
export interface Data{
  imgUrl:ImageSourcePropType
  description:string
}

class StepHome extends Component<StepHomeProps, any, any> {
  constructor(props: Readonly<StepHomeProps>){
    super(props)
    this.state = {}
  }
  render() { 
    const {donnee, next, started, done, countData, previous} = this.props 
    let btnBottom
    if(started){
      console.log(" if(started){ ==>", started)
       btnBottom = (
                      <View>
                        <Button style={styles.BtnInsCon} block onPress={() => done}><Text style={styles.textColorBtn}>Iscription !</Text></Button>
                        <Button style={styles.BtnInsCon} block onPress={() => this.props.navigation.navigate('Connexion')}><Text style={styles.textColorBtn}>Connexion!</Text></Button>
                      </View>)
    }else{
      console.log(" }else{ ==>", started)
      btnBottom= (
                    <View>
                      <Button style={styles.BtnInsCon} block onPress={() => next(1)}><Text style={styles.textColorBtn}>Suivant</Text></Button>
                      <Button style={styles.BtnInsCon} block onPress={() => previous(1)}><Text style={styles.textColorBtn}>Revenir</Text></Button>
                    </View> 
                )
    } 
    return (
      <Container>
        <Grid style={styles.root}>
          <Row >
            <H1 style={styles.DjibCare}>
              Libcare
            </H1>
          </Row>
          <Row size={3}>
            <Image style={styles.ImageHome} source={donnee[countData].imgUrl} />
          </Row>
          <Row size={2}>
            <Text style={styles.captionDescri}>{donnee[countData].description}
            </Text>
          </Row>
          <Row size={1.5} style={styles.button}>
            <Content>
            {btnBottom}
           </Content>
          </Row>
        </Grid>
      </Container>
    );
  }
}

export default withNavigation(StepHome)
