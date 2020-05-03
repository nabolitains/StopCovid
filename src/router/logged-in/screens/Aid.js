import React, { useEffect, useContext } from 'react'
import {
  AppState,
  AppStateStatus,
  ScrollView, 
  
} from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import * as Permissions from 'expo-permissions' 
import { useTranslation, withTranslation } from 'react-i18next'
import { UserContext } from '../../../context/user'
import PropTypes from 'prop-types'
import Colors from '../../../constants/Colors'
import { CtaButton, UrlButton } from '../../../components/Button/Button'
import { AuthConsumer } from '../../../context/authentication'
import { registerPushNotifications } from '../../../push-notifications'
import AppShell, { Content } from '../../../components/AppShell'
import Text, { Heading } from '../../../components/ui/Text'
import { ButtonGroup } from '../../../components/Button'
import bullHorn from '../../../assets/images/bullhorn.png'
import { scale } from '../../../utils'
import { Vertical } from '../../../components/ui/Spacer'
import messaging from '@react-native-firebase/messaging'
import Footer from '../../../components/Footer'
import { AuthenticationError } from '../../../api/ApiClient'

import { useAlert } from '../../../context/alert'
import auth from '@react-native-firebase/auth'

const privacyUrls = {
  en: 'https://www.libcare.net/app/privacystatement',
  pl: 'https://www.libcare.net/app/privacystatement-po',
  is: 'https://www.libcare.net/app/personuverndarstefna',
  fr: 'https://www.libcare.net/app/personuverndarstefna',
}

const links = {
  en: {
    primary: ['avoidInfection', 'possibleInfection', 'isolation', 'quarantine'],
    secondary: [
      'groupsAtRisk',
      'seniorCitizens',
      'childrenAndTeens',
      'worriesAndAnxiety',
      'workplaces',
      'travel',
      'foodPetsAndAnimals',
      'tourists',
      'riskAreas',
    ],
  },
  is: {
    primary: ['avoidInfection', 'possibleInfection', 'isolation', 'quarantine'],
    secondary: [
      'groupsAtRisk',
      'seniorCitizens',
      'childrenAndTeens',
      'worriesAndAnxiety',
      'workplaces',
      'travel',
      'foodPetsAndAnimals',
      'riskAreas',
    ],
  },
  pl: {
    primary: ['avoidInfection', 'possibleInfection', 'isolation', 'quarantine'],
    secondary: [
      'groupsAtRisk',
      'seniorCitizens',
      'childrenAndTeens',
      'worriesAndAnxiety',
      'workplaces',
      'travel',
      'foodPetsAndAnimals',
      'riskAreas',
    ],
  },
  fr: {
    primary: ['avoidInfection', 'possibleInfection', 'isolation', 'quarantine'],
    secondary: [
      'groupsAtRisk',
      'seniorCitizens',
      'childrenAndTeens',
      'worriesAndAnxiety',
      'workplaces',
      'travel',
      'foodPetsAndAnimals',
      'riskAreas',
    ],
  },
}

const smallBtnStyle = {
  width: '48.5%',
}

const Aid = ({ navigation, i18n, logout, getUid }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const { fetchUser, clearUserData } = useContext(UserContext)
  const { createAlert } = useAlert()

  // Check if we still have location access
  const checkLocationPermission = async () => {
    const { status } = await Permissions.getAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      resetStack(navigation, 'Permission')
    }
    return status === 'granted'
  }

  const logoutUser = () => {
    navigation.navigate({ routeName: 'LoggedOut' })
    stopBackgroundTracking()
    logout()
    clearUserData()
  }

  // Check if user has been requested to share data
  const checkUser = async () => {
    
    try {
      const user = auth().currentUser
      
      //console.log('user==>', user)
      if (false) {
        //console.log('user.userDatat==>', userRequestData)
        if (Platform.OS === 'ios') {
          // Reset badge on app icon
          PushNotificationIOS.setApplicationIconBadgeNumber(0)
        }
        resetStack(navigation, 'RequestData')
        return null
      }

      return user
    } catch (error) {
      
      if (error instanceof AuthenticationError) {        
        //logoutUser()
      } else {
        console.log('-------------------------checkUser else { error===>', error)
        console.error(error)
      }

      return null
    }
  }

  async function validateState() {
    if (!(await checkUser())) {
      return
    }

    if (!(await checkLocationPermission())) {
      return
    }

    return true
  }

  /**
   * @param {AppStateStatus} state
   */
  function onAppStateChange(state) {
    if (state === 'active') {
      validateState()
    }
  }

  useEffect(() => {
    const unsubscribePushMessage = messaging().onMessage(checkUser)
    AppState.addEventListener('change', onAppStateChange)

    return () => {
      unsubscribePushMessage()
      AppState.removeEventListener('change', onAppStateChange)
    }
  }, [])
  
 //footer={//<FooterUser navigation={navigation} resetStack={resetStack} />}

  return (
    <AppShell  title={t('trackingTitle')} subtitle={t('trackingSubtitle')}>
      <ScrollView>
        <Content>
          <Heading level={3}>{t('aboutCovidTitle')}</Heading>
          <Text>{t('aboutCovidDescription')}</Text>
          <ButtonGroup>
            <UrlButton
              align="left"
              justify="start"
              href={t('announcementsLink')}
              image={bullHorn}
              imageDimensions={{ height: scale(26), width: scale(26) }}
            >
              {t('announcements')}
            </UrlButton>
            {links[language].primary.map(link => (
              <UrlButton
                key={link}
                justify="start"
                href={t(`${link}Link`)}
                align="left"
                bgColor={Colors.text}
              >
                {t(`${link}Label`)}
              </UrlButton>
            ))}
          </ButtonGroup>

          <Vertical unit={0.5} />

          <ButtonGroup row>
            {links[language].secondary.map(link => (
              <UrlButton
                key={link}
                href={t(`${link}Link`)}
                bgColor={Colors.orange}
                style={smallBtnStyle}
                color={Colors.textDark}
                small
              >
                {t(`${link}Label`)}
              </UrlButton>
            ))}
          </ButtonGroup>

          <Vertical unit={1} />

          <ButtonGroup>
            <UrlButton bgColor={Colors.backgroundAlt} href={t('covidLink')}>
              <Text center>
                {t('covidLabel')}{' '}
                <Text bold color={Colors.blue}>
                stopcovidj.com
                </Text>
              </Text>
            </UrlButton>

            <UrlButton
              bgColor={Colors.backgroundAlt}
              href={privacyUrls[i18n.language] || privacyUrls.en}
            >
              <Text center>{t('privacyPolicy')}</Text>
            </UrlButton>

            <CtaButton
              bgColor={Colors.backgroundAlt}
              onPress={() => {
                createAlert({
                  type: 'info',
                  message: t('uninstallAppToast'),
                })
              }}
            >
              <Text center>{t('stopTracking')}</Text>
            </CtaButton>
          </ButtonGroup>

          <Vertical unit={2} />

          <Footer />

          <Vertical unit={1} />

          {__DEV__ && (
            <CtaButton bgColor={Colors.gray} onPress={logoutUser}>
              Dev only log out
            </CtaButton>
          )}
        </Content>
      </ScrollView>
    </AppShell>
  )
}

Aid.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
}

const Screen = withTranslation()(({ ...props }) => (
  <AuthConsumer>
    {({ logout, getUid }) => <Aid {...props} getUid={getUid} logout={logout} />}
  </AuthConsumer>
))

Screen.navigationOptions = {
  header: null,
}

export default Screen
