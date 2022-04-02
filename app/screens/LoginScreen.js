import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import LottieView from 'lottie-react-native';
import crashlytics from '@react-native-firebase/crashlytics';

import Screen from '../components/Screen';
import {
  AppForm,
  AppFormField,
  SubmitButton,
  ErrorMessage,
} from '../components/forms';
import ActivityIndicator from '../components/ActivityIndicator';
import useAuth from '../auth/useAuth';
import ImageBackground from 'react-native/Libraries/Image/ImageBackground';
import AppButton from '../components/AppButton';
import colors from '../config/colors';

function LoginScreen(props) {
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registerFailed, setRegisterFailed] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [getOTP, setGetOTP] = useState(61);
  const [phone, setPhone] = useState('');
  const [autoVerifying, setAutoVerifying] = useState(false);
  const [otpTimer, setOtpTimer] = useState(false);
  const {logIn} = useAuth();

  useEffect(() => {
    return () => {
      if (otpTimer) {
        clearInterval(otpTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (getOTP < 1 && otpTimer) {
      clearInterval(otpTimer);
      setGetOTP(61);
    }
  }, [getOTP]);

  const startTimer = () => {
    const timer = setInterval(() => setGetOTP((v) => v - 1), 1000);
    setOtpTimer(timer);
  };

  async function signInWithPhoneNumber(phoneNumber) {
    if (phoneNumber.length !== 10) {
      setRegisterFailed(true);
      setErrorMsg('Please enter a valid number');
      return;
    }
    setRegisterFailed(false);
    setErrorMsg('');
    setLoading(true);
    startTimer();
    auth()
      .verifyPhoneNumber('+91' + phoneNumber, 10, false)
      .on(
        'state_changed',
        (snapshot) => {
          switch (snapshot.state) {
            case auth.PhoneAuthState.CODE_SENT:
              setLoading(false);
              setAutoVerifying(true);
              break;
            case auth.PhoneAuthState.ERROR:
              setErrorMsg(snapshot.error.message);
              setRegisterFailed(true);
              setGetOTP(0);
              setLoading(false);
              setAutoVerifying(false);
              break;
            case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT:
              setConfirm(snapshot.verificationId);
              setLoading(false);
              setAutoVerifying(false);
              break;
            case auth.PhoneAuthState.AUTO_VERIFIED:
              setConfirm(snapshot.verificationId);
              const credential = auth.PhoneAuthProvider.credential(
                snapshot.verificationId,
                snapshot.code,
              );
              auth()
                .signInWithCredential(credential)
                .then((data) => {
                  database()
                    .ref('/student/' + phone)
                    .once('value')
                    .then((snapshot) => {
                      if (snapshot.val() === null) {
                        Alert.alert(
                          "Student doesn't exists",
                          'Please register yourself first',
                          [
                            {
                              text: 'Register',
                              onPress: () =>
                                props.navigation.navigate('Register'),
                            },
                          ],
                        );
                        setLoading(false);
                        setAutoVerifying(false);
                        setRegisterFailed(true);
                      } else {
                        console.log('Logged in');
                        logIn(phone);
                        setLoading(false);
                        setAutoVerifying(false);
                        setRegisterFailed(false);
                      }
                    })
                    .catch((e) => {
                      setErrorMsg(e);
                      console.log('error logging in: ', e);
                      crashlytics().log('error logging in: ', e);
                      setLoading(false);
                      setAutoVerifying(false);
                      setRegisterFailed(true);
                    });
                })
                .catch((e) => {
                  setErrorMsg('Login failed: ', e);
                  console.log('error logging in: ', e);
                  crashlytics().log('error logging in: ', e);
                  setLoading(false);
                  setAutoVerifying(false);
                  setRegisterFailed(true);
                });
              break;
            default:
              setErrorMsg('Login failed');
              console.log('error logging in');
              crashlytics().log('error logging in');
              setLoading(false);
              setAutoVerifying(false);
              setRegisterFailed(true);
              break;
          }
        },
        (error) => {
          console.log('Error: ', error);
          crashlytics().log('Error: ', error);
          setLoading(false);
        },
      );
  }

  const handleLogin = async (userInfo) => {
    if (!userInfo.otp || userInfo.otp === '') {
      setRegisterFailed(true);
      setErrorMsg('Please enter a valid OTP');
      return;
    }
    setRegisterFailed(false);
    setErrorMsg('');
    setLoading(true);
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirm,
        userInfo.otp,
      );
      await auth().signInWithCredential(credential);
      database()
        .ref('/student/' + phone)
        .once('value')
        .then((snapshot) => {
          if (snapshot.val() === null) {
            Alert.alert(
              "Student doesn't exists",
              'Please register yourself first',
              [
                {
                  text: 'Register',
                  onPress: () => props.navigation.navigate('Register'),
                },
              ],
            );
            setLoading(false);
          } else {
            console.log('Logged in');
            logIn(phone);
            setLoading(false);
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log('Error: ', e);
          crashlytics().log('Error in logging in: ', e);
          setErrorMsg('Login failed: ', e);
          setRegisterFailed(true);
        });
    } catch (error) {
      setLoading(false);
      console.log('Invalid code: ', error);
      setRegisterFailed(true);
      setErrorMsg('Invalid OTP');
    }
  };

  return (
    <>
      <ImageBackground
        blurRadius={2}
        resizeMode="cover"
        source={require('../assets/background.jpg')}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          position: 'absolute',
          flex: 1,
        }}>
        <ActivityIndicator visible={loading} />
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        <Screen style={styles.container}>
          <AppForm onSubmit={handleLogin} initialValues={{otp: ''}}>
            <ErrorMessage visible={registerFailed} error={errorMsg} />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="cellphone-basic"
              inputContainer={styles.inputContainer}
              name="number"
              placeholder="10 digit Mobile number"
              textContentType="telephoneNumber"
              onChangeText={(v) => setPhone(v)}
              value={phone}
            />
            {confirm ? (
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="numeric"
                name="otp"
                placeholder="OTP"
                textContentType="oneTimeCode"
              />
            ) : (
              <></>
            )}
            {confirm ? <SubmitButton title={'Login'} /> : <></>}
          </AppForm>
          <AppButton
            title={getOTP === 61 ? 'Get OTP' : getOTP}
            onPress={() => signInWithPhoneNumber(phone)}
            color={'yellow'}
            disabled={getOTP === 61 ? false : true}
          />
        </Screen>
      </ImageBackground>
      {autoVerifying ? (
        <View
          style={{
            position: 'absolute',
            bottom: 50,
            width: '100%',
            alignItems: 'center',
            padding: 16,
            zIndex: 1,
            backgroundColor: colors.white,
          }}>
          <LottieView
            autoPlay
            loop
            source={require('../assets/animations/verifying.json')}
            style={{height: 100}}
          />
          <Text
            style={{
              marginTop: 16,
              fontSize: 18,
              color: colors.black,
              textAlign: 'center',
            }}>
            Auto-Verifying OTP
          </Text>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputContainer: {
    backgroundColor: colors.white,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 20,
    borderRadius: 50,
  },
});

export default LoginScreen;
