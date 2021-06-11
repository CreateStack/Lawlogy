import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';

import AuthContext from './app/auth/context';
import AuthNavigator from './app/navigation/AuthNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import authStorage from './app/auth/storage';
import {ImageBackground, View} from 'react-native';
import OfflineNotice from './app/components/OfflineNotice';
import AppNavigator from './app/navigation/AppNavigator';
import Question from './app/components/Question';

const App = () => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [score, setScore] = useState(0);
  useEffect(() => {
    console.log('score: ', score);
  }, [score]);
  useEffect(() => {
    setIsReady(false);
    authStorage
      .getToken()
      .then((token) => {
        if (!token) {
          setIsReady(true);
          return;
        }
        setUser(JSON.parse(token));
        setIsReady(true);
      })
      .catch((error) => {
        console.log('Error: ', error);
        setIsReady(true);
      });
  }, []);
  if (!isReady) {
    return (
      <View
        style={{
          justifyContent: 'center',
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <ImageBackground
          source={require('./app/assets/logo.png')}
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
        {/*  <Question
          setScore={setScore}
          question={{
            Question:
              'On which date the ‘Objective resolution ‘was moved in the Constituent assembly? ',
            a: 'December 13, 1946 ',
            b: 'December 09, 1946 ',
            c: 'December 16, 1946 ',
            d: 'December 19, 1946 ',
            correct: 'A',
            premium: true,
          }}
        /> */}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
