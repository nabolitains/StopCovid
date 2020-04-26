import React, { useEffect, useState, ReactNode } from 'react';
import {
  Platform,
  ScrollView,
  Linking,
  AppState,
  AppStateStatus,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import PropTypes from 'prop-types';
import { Trans, WithTranslation } from 'react-i18next';
import { CtaButton } from '../../../components/Button/Button';
import { useTranslation, withTranslation } from 'react-i18next';
import { AuthConsumer } from "../../../context/authentication"
import { initBackgroundTracking } from '../../../tracking';
import AppShell, { Content } from '../../../components/AppShell';
import Text, { Heading } from '../../../components/ui/Text';
import LoadingScreen from "../../../components/LoadingScreen"
import { resetStack } from '../../../utils/navigation';
import { Vertical } from '../../../components/ui/Spacer';
import Footer from '../../../components/Footer';
import { scale } from '../../../utils';

// @ts-ignore
import covidIcon from '../../../assets/images/covid-icon.png';
import { NavigationStackScreenOptions, NavigationTabScreenOptions, NavigationNavigatorProps } from 'react-navigation';

const isIOS = Platform.OS === 'ios';

const Status = Permissions.PermissionStatus;

const ContentView = ({
  ctaTitle,
  ctaAction,
  children,
}: {
  ctaTitle: string;
  ctaAction: () => any;
  children: ReactNode;
}) => (
  <AppShell
    footer={
      <>
        <Footer />
        <Vertical unit={0.5} />
        <CtaButton
          onPress={ctaAction}
          image={covidIcon}
          imageDimensions={{ height: scale(28), width: scale(24) }}
        >
          {ctaTitle}
        </CtaButton>
      </>
    }
  >
    <Content>{children}</Content>
  </AppShell>
);

const AllowLocationScreen = ({ navigation }:any) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermission] = useState<
    Permissions.PermissionStatus
  >(Status.UNDETERMINED);
  const [didAsk, setDidAsk] = useState(false);
  const settingsIssue = isIOS && permissionStatus === Status.DENIED && didAsk;

  async function handlePermission({
    permissions: { location: locationPermission },
  }: Permissions.PermissionResponse) {
    if (locationPermission.granted) {
      const hasScopeAlways = locationPermission.ios?.scope === 'always';

      if (!isIOS || hasScopeAlways) {
        resetStack(navigation, 'Home');
        return true;
      }

      setPermission(Status.DENIED);
    } else {
      setPermission(locationPermission.status);
    }

    setLoading(false);
    return false;
  }

  function getPermission() {
    if (settingsIssue) {
      return Linking.openSettings();
    }

    Permissions.askAsync(Permissions.LOCATION)
      .then(handlePermission)
      .then(hasPermission => {
        if (!hasPermission) {
          setDidAsk(true);
        }
      })
    
  }

  function onAppStateChange(state: AppStateStatus) {
    if (state === 'active') {
      Permissions.getAsync(Permissions.LOCATION).then(handlePermission);
    }
  }

  useEffect(() => {
    Permissions.getAsync(Permissions.LOCATION).then(handlePermission);
    AppState.addEventListener('change', onAppStateChange);

    return () => {
      AppState.removeEventListener('change', onAppStateChange);
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (settingsIssue) {
    return (
      <ContentView
        ctaAction={getPermission}
        ctaTitle={t('changeLocationSettings')}
      >
        <Heading level={1}>{t('changeLocationAllow')}</Heading>
        <Text>
          <Trans i18nKey={'changeLocationDescriptionIOS'}>
            <Text bold>„Always“</Text>
          </Trans>
        </Text>
      </ContentView>
    );
  }

  return (
    <ContentView ctaAction={getPermission} ctaTitle={t('enableLocationButton')}>
      <Heading level={1}>{t('enableLocationAllow')}</Heading>
      <Text>
        <Trans
          i18nKey={
            isIOS
              ? 'enableLocationDescriptionIOS'
              : 'enableLocationDescriptionAndroid'
          }
        >
          <Text bold>„Allow while using app“</Text>
        </Trans>
      </Text>
      {isIOS && (
        <Text>
          <Trans i18nKey="enableLocationMessageIOS">
            <Text bold>„Change to Always Allow“</Text>
          </Trans>
        </Text>
      )}

      {isIOS && (
        <Text marginBottom={1}>{t('enableNotificationDescription')}</Text>
      )}
    </ContentView>
  );
};

AllowLocationScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
type ScreenType = NavigationNavigatorProps<any, any> | React.ComponentType<Pick<WithTranslation, never>>


const Screen = withTranslation()( ({ ...props }) => (
  <AuthConsumer>
    {() => <AllowLocationScreen {...props} />}
  </AuthConsumer>
))

export default Screen;
