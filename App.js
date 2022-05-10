import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import CodePush from 'react-native-code-push';
import crashlytics from '@react-native-firebase/crashlytics';

import AuthContext from './app/auth/context';
import AuthNavigator from './app/navigation/AuthNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import authStorage from './app/auth/storage';
import {ImageBackground, Text, View} from 'react-native';
import OfflineNotice from './app/components/OfflineNotice';
import AppNavigator from './app/navigation/AppNavigator';

let CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  updateDialog: {
    appendReleaseDescription: true,
    title: 'A new update is available!',
  },
};

const App = () => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeOut = setTimeout(() => setShowSplash(false), 3000);
    return () => timeOut && clearTimeout(timeOut);
  }, []);

  useEffect(() => {
    setIsReady(false);
    authStorage
      .getToken()
      .then(token => {
        if (!token) {
          setIsReady(true);
          crashlytics().log('User not signed in.');
          return;
        }
        setUser(JSON.parse(token));
        crashlytics().log('User signed in.');
        crashlytics()
          .setUserId(JSON.stringify(user))
          .then(() => {
            setIsReady(true);
          })
          .catch(error => {
            crashlytics().log('Not able to set user: ', error);
          });
      })
      .catch(error => {
        console.log('Error: ', error);
        crashlytics().log('Error in App.js while fetching authtoken: ', error);
        setIsReady(true);
      });
  }, [user]);

  if (!isReady || showSplash) {
    return (
      <View
        style={{
          justifyContent: 'center',
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ImageBackground
          source={require('./app/assets/logo.jpg')}
          style={{
            height: 200,
            width: 200,
          }}
        />
      </View>
    );
  }
  return (
    <AuthContext.Provider value={{user, setUser}}>
      <OfflineNotice />
      <NavigationContainer theme={navigationTheme}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

export default CodePush(CodePushOptions)(App);
