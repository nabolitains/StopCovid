import React, {Component} from 'react'
import Text from '../ui/Text';
import { ButtonGroup } from '../Button'; 
import { CtaButton } from '../Button/Button'; 
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
interface PropsFooterUser {
    resetStack:(navitagion: any, routeName: any) => void
    navigation:any
}
const FooterUser = (props:PropsFooterUser) =>{ 
    const {
        t,
        i18n: { language },
        } = useTranslation();
    return( 
        <CtaButton onPress={() => props.resetStack(props.navigation, 'ClientScreen')} disabled={false} bgColor={Colors.backgroundUserFooter}  >
            <Text center>{t('userSearchProfessional')}</Text>
        </CtaButton>
    )  
}


export default FooterUser