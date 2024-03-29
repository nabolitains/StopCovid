import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Text from '../ui/Text';

import { useAlert } from '../../context/alert';
import { verifyPin } from '../../api/Login';
import PinCode from '../PinCode';

import { styles } from './styles';
import Colors from '../../constants/Colors';
import { scale } from '../../utils';
import { CtaButton } from '../Button';
import { Vertical } from '../ui/Spacer';
 
const PinNumber = ({
  phoneNumber,
  pinToken, 
  countryCode,
  resetPin,
  onVerified,
  confirm
}) => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetBtn, setShowResetBtn] = useState(false);
  const timeOutRef = useRef(null);
  const { createAlert } = useAlert();
  const { t } = useTranslation();

  const startTimeout = () => {
    timeOutRef.current = setTimeout(() => {
      setShowResetBtn(true);
    }, 12000);
  };

  const cancelTimeout = () => {
    clearTimeout(timeOutRef.current); 
  };

  const onVerifyPin = async pinNumber => {
    setIsLoading(true);
    cancelTimeout();

    console.log('-----------onVerifyPin pinNumber ===>', pinNumber)
    try {
      const { token, isNewUser, uid } = await verifyPin(
        pinNumber,
        pinToken,
        countryCode,
        phoneNumber,
        confirm
      )  
      if(isLoading){
        setIsLoading(false);  
      }
      return onVerified(token, isNewUser, uid);
    } catch (error) {
        console.log('catch onVerifyPin error===>', error)
        setShowResetBtn(true);
      if(isLoading){
        setIsLoading(false);  
      }

      if (error.erreur) {
        console.log('if (e onVerifyPin error===>', error)
        createAlert({
          message:`${t('incorrentPINMessage')}`,
          type: 'error',
        });
      } else { 
        console.log('else { onVerifyPin error  ===>', error)
        createAlert({
          message: `${t('genericErrorMessage')}`,
          type: 'error',
        });
      }
    }
  };

  const updatePin = value => {
    setPin(value);

    if (value.length === 6) {
      onVerifyPin(value);
    }
  };

  const textColor = isLoading ? Colors.placeholder : Colors.text;

  useEffect(() => {
    startTimeout();
    return cancelTimeout;
  }, []);

  return (
    <View style={styles.container}>
      <Vertical unit={2} />
      <PinCode
        autoFocus
        value={pin}
        onTextChange={updatePin}
        codeLength={6}
        cellSpacing={scale(2)}
        textStyle={{
          color: textColor,
          fontSize: 36,
        }}
      />
      <Vertical fill />

      <CtaButton transparent disabled={!showResetBtn} onPress={resetPin}>
        <Text
          marginBottom={0}
          color={showResetBtn ? Colors.gray : 'transparent'}
        >
          {t('pinResendBtn')}
        </Text>
      </CtaButton>
    </View>
  );
};

PinNumber.propTypes = {
  onVerified: PropTypes.func.isRequired,
  pinToken: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
};

export default PinNumber;
