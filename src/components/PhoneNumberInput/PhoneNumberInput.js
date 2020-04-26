import React, { useReducer, useRef, useState } from 'react';
import { View, TextInput, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import PhoneInput from '../PhoneInput';
import CountryPicker from 'react-native-country-picker-modal';
import { withTranslation, Trans } from 'react-i18next';
import * as WebBrowser from 'expo-web-browser';
import libPhoneNumber from 'google-libphonenumber';

import { useAlert } from '../../context/alert';
import { getPin } from '../../api/Login';
import Colors from '../../constants/Colors';
import { CtaButton } from '../Button';
import { styles, TOSLink } from './styles';
import covidIcon from '../../assets/images/covid-icon.png';
import { scale } from '../../utils';
import { useWindowDimensions } from '../../utils/hooks';
import Checkbox from '../ui/Checkbox';
import { Vertical } from '../ui/Spacer';

const phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance();
const linkTouchPadding = 12;

const initialState = {
  cca2: 'DJ',
  callingCode: '253',
  phoneNumber: '',
};

const privacyUrls = {
  en: 'https://www.libcare.net/app/privacystatement',
  fr: 'https://www.libcare.net/app/privacystatement-fr', 
};

function isValid(countryCode, phoneNumber) {
  const fullPhoneNumber = `+${countryCode}${phoneNumber}`;
  const fullCountryCode =  `+${countryCode}`

  // For testing purposes
  if (fullPhoneNumber.length === 14 || fullCountryCode === "+253" || fullCountryCode === "+1") {
    return true;
  } 
  try {
    console.log('phoneUtil.isValidNumber ===>', phoneUtil.isValidNumber(phoneUtil.parse(fullPhoneNumber)))
    return phoneUtil.isValidNumber(phoneUtil.parse(fullPhoneNumber));
  } catch (error) {
    return false;
  }
}

const reducer = (state, { phoneNumber, cca2, callingCode, type } = {}) => {
  switch (type) {
    case 'updateLocation':
      return {
        ...state,
        cca2,
        callingCode,
      };
    case 'updateCallingCode':
      return {
        ...state,
        callingCode,
      };
    case 'updatePhoneNumber':
      return {
        ...state,
        phoneNumber,
      };
    default:
      return state;
  }
};

const PhoneNumberInput = ({ t, i18n, onSendPin }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { createAlert } = useAlert();
  const phoneInputRef = useRef();
  const [tosAccepted, setTosAccepted] = useState(false);
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const dimensions = useWindowDimensions();
  const fontScale = isNaN(dimensions.fontScale) ? 1 : dimensions.fontScale;
  const inputHeight = scale(50 * fontScale);

  const onPressFlag = () => {
    setCountryPickerOpen(true);
  };

  const onCountryPickerClose = () => setCountryPickerOpen(false);

  const onChangePhoneNumber = phoneNumber => {
    dispatch({ type: 'updatePhoneNumber', phoneNumber });
  };

  const onChangeCallingCode = callingCode => {
    if(callingCode.length <= 4) {  
      dispatch({ type: 'updateCallingCode', callingCode });
    }
  };

  const onSelectCountry = ({ cca2, callingCode }) => {
    setCountryPickerOpen(false);
    phoneInputRef.current.selectCountry(cca2.toLowerCase());
    dispatch({ type: 'updateLocation', cca2, callingCode });
  };

  const acceptTOS = () => {
    setTosAccepted(!tosAccepted);
  };

  const openPP = () => {
    WebBrowser.openBrowserAsync(privacyUrls[i18n.language] || privacyUrls.en);
  };

  const getPinNumber = async () => {
    const { phoneNumber } = state;
    const countryCode = phoneInputRef.current; 
    if (!isValid(countryCode.getCountryCode(), phoneNumber)) { 
      createAlert({
        message: t('phoneValidationMessage'),
        type: 'error',
      });
      return;
    }
         
    const {pinToken, erreur, confirm, erreurInfo} = await getPin(countryCode.getCountryCode(), phoneNumber);
    if(erreur){ 
      const errorInfo = erreurInfo.toString().split('[') 
      const codeErreur = errorInfo[1].split(']')[0]
      const MessageErreur = errorInfo[1].split(']')[1] 
      switch (codeErreur.replace(/\s/g, '')) {
        case "auth/captcha-check-failed": 
          createAlert({
            message: t('authCaptchaCheckFailed'),
            type: 'error',
          });
          break;
          case "auth/invalid-phone-number": 
            createAlert({
              message: t('authInvalidPhoneNumber'),
              type: 'error',
            });
            break;  
          case "auth/missing-phone-number": 
            createAlert({
              message: t('authMissingPhoneNumber'),
              type: 'error',
            });
            break;  
        case "auth/quota-exceeded": 
          createAlert({
            message: t('authQotaExceeded'),
            type: 'error',
          }); 
        case "auth/unknown": 
          createAlert({
            message: MessageErreur,
            type: 'error',
          });
          break;  
        case "auth/user-disabled": 
          createAlert({
            message: t('authUserDisabled'),
            type: 'error',
          });
          break;            
        case "auth/operation-not-allowed": 
          createAlert({
            message: t("authOperationNotAllowed"),
            type: 'error',
          });
          break;          
        case "auth/app-not-authorized": 
          createAlert({
            message: t("authAppNotAuthorized"),
            type: 'error',
          });
          break;
        default:        
        console.log('default swift codeErreur ==>', codeErreur)
        console.log('default swift MessageErreur ==>', MessageErreur)
        case "auth/operation-not-allowed": 
          createAlert({
            message: t("authOperationNotAllowed"),
            type: 'error',
          });
          break;          
      }
    }else{
      onSendPin(countryCode.getCountryCode(), phoneNumber, pinToken, confirm);
    }
      
  };

  const linkHitSlop = {
    top: linkTouchPadding,
    right: linkTouchPadding,
    bottom: linkTouchPadding,
    left: linkTouchPadding,
  };

  const Link = ({ children, onPress }) => {
    return (
      <TouchableWithoutFeedback onPress={onPress} hitSlop={linkHitSlop}>
        <TOSLink>{children[0]}</TOSLink>
      </TouchableWithoutFeedback>
    );
  };
  
  return (
    <View style={styles.container}>
      <Vertical unit={1} />
      <View
        style={{
          ...styles.phoneInputContainer,
          ...(fontScale <= 1 && {
            flexDirection: 'row',
          }),
        }}
      >
        <PhoneInput
          ref={phoneInputRef}
          onPressFlag={onPressFlag}
          initialCountry="dj"
          style={{
            ...styles.phoneKeyViewStyle,
            height: inputHeight,
          }}
          textStyle={{ ...styles.phoneTextStyle, height: inputHeight }}
          flagStyle={styles.flag}
          offset={6}
          onChangePhoneNumber={onChangeCallingCode}          
        />
        <TextInput
          placeholder={t('phoneNr').toUpperCase()}
          keyboardType="phone-pad"
          returnKeyType="done"
          autoCapitalize="none"
          placeholderTextColor={Colors.placeholder}
          autoCorrect={false}
          style={{
            ...styles.phoneViewStyle,
            ...styles.phoneTextStyle,
            height: inputHeight,
          }}
          onChangeText={onChangePhoneNumber}
        />
      </View>
      <CountryPicker
        withCallingCode
        withFilter
        visible={countryPickerOpen}
        onSelect={onSelectCountry}
        onClose={onCountryPickerClose}
        translation="eng"
        countryCode={state.cca2}
        renderFlagButton={() => <View />}
      />
      <Vertical unit={1} />
      <Checkbox checked={tosAccepted} onPress={acceptTOS}>
        <Trans i18nKey="tosAcceptance">
          I agree to the <Link onPress={openPP}>Privacy Policy</Link>.
        </Trans>
      </Checkbox>
      <Vertical unit={1} />
      <View style={styles.btn}>
        <CtaButton
          disabled={!((state.phoneNumber.length === 10 || state.phoneNumber.length === 8) && tosAccepted)}
          onPress={getPinNumber}  
          image={covidIcon}
          imageDimensions={{ height: scale(28), width: scale(24) }}
        >
          {t('next')}
        </CtaButton>
      </View>
    </View>
  );
};

PhoneNumberInput.propTypes = {
  onSendPin: PropTypes.func.isRequired,
};

export default withTranslation()(PhoneNumberInput);
