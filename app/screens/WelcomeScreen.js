import React from 'react';
import {useState} from 'react';
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
import logoImage from '../assets/logo.png';
import AppButton from '../components/AppButton';

export default function WelcomeScreen({navigation}) {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.contianer}
      blurRadius={3}>
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.tagline}>
          The ability to observe without evaluating is the highest form of
          intelligence
        </Text>
      </View>

      <View style={styles.loginCont}>
        <AppButton title="Login" onPress={() => navigation.navigate('Login')} />
        <AppButton
          title="Register"
          color="secondary"
          onPress={() => {
            navigation.navigate('Register');
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  contianer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'center',
    borderRadius: 80,
  },

  logoContainer: {
    flex: 0.3,
    alignSelf: 'center',
    marginTop: '10%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loginCont: {
    width: '100%',
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
  },
  tagline: {
    top: 20,
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 20,
    textAlign: 'center',
    color: '#444',
    backgroundColor: '#fff9',
    borderRadius: 20,
  },
});
