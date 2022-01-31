import React from 'react';
import {
  View,
  ImageBackground,
  StatusBar,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

import backgroundImage from '../assets/background.jpg';
import logoImage from '../assets/logo.jpg';
import AppButton from '../components/AppButton';
import colors from '../config/colors';

export default function WelcomeScreen({navigation}) {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.contianer}
      blurRadius={2}>
      <View style={styles.logoContainer}>
        <Text style={styles.tagline}>
          "Motivation is what gets you started. Habit is what keeps you going"
        </Text>
        <Image source={logoImage} style={styles.logo} />
      </View>

      <View style={styles.loginCont}>
        <AppButton title="Login" onPress={() => navigation.navigate('Login')} />
        <AppButton
          title="Register"
          color="yellow"
          onPress={() => {
            navigation.navigate('Register');
          }}
          textColor={colors.primary}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  contianer: {
    width: '100%',
    height: '100%',
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  logo: {
    borderRadius: 75,
    height: 150,
    position: 'absolute',
    resizeMode: 'center',
    top: Dimensions.get('window').height / 2 - 190,
    width: 150,
  },

  logoContainer: {
    backgroundColor: 'rgba(122,117,190,0.3)',
    marginTop: '10%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    top: 40,
  },
  loginCont: {
    width: '100%',
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    bottom: 80,
  },
  tagline: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 20,
    textAlign: 'center',
    color: colors.black,
    paddingHorizontal: 16,
  },
});
