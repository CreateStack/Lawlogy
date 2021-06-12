import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import * as Yup from 'yup';
import LottieView from 'lottie-react-native';

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

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  state: Yup.string().lowercase().required().label('State'),
});
let otpTimer = null;
function RegisterScreen(props) {
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registerFailed, setRegisterFailed] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [getOTP, setGetOTP] = useState(0);
  const [phone, setPhone] = useState('');
  const [autoVerifying, setAutoVerifying] = useState(false);
  const {logIn} = useAuth();

  useEffect(() => {
    setGetOTP(props.route.params.otp.otpRemainingTime);
    setConfirm(props.route.params.otp.confirm);
    if (getOTP > 0) {
      otpTimer = setInterval(() => {
        setGetOTP((v) => {
          if (v > 0) return v - 1;
          else {
            clearInterval(otpTimer);
            return 0;
          }
        });
      }, 1000);
    }
    otpTimer = null;
    return () => {
      if (otpTimer) clearInterval(otpTimer);
      props.route.params.setOTP({otpRemainingTime: getOTP, confirm: confirm});
    };
  }, []);

  async function signInWithPhoneNumber(phoneNumber) {
    if (phoneNumber.length !== 10) {
      setRegisterFailed(true);
      setErrorMsg('Please enter a valid number');
      return;
    }
    setRegisterFailed(false);
    setErrorMsg('');
    setLoading(true);
    setGetOTP((v) => {
      otpTimer = setInterval(() => {
        setGetOTP((v) => {
          if (v > 0) return v - 1;
          else {
            clearInterval(otpTimer);
            return 0;
          }
        });
      }, 1000);
      return 61;
    });
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
              setErrorMsg(snapshot.error);
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
              database()
                .ref('/student/' + phone)
                .once('value')
                .then((snapshot) => {
                  if (snapshot.val() !== null) {
                    setAutoVerifying(false);
                    Alert.alert(
                      'Student exists',
                      'You are already registered, please login',
                      [
                        {
                          text: 'Login',
                          onPress: () => props.navigation.navigate('Login'),
                        },
                      ],
                    );
                    setLoading(false);
                  } else {
                    database()
                      .ref('/student/' + phone)
                      .update({
                        name: userInfo.name,
                        state: userInfo.state,
                        premium: false,
                      })
                      .then(() => {
                        setAutoVerifying(false);
                        setRegisterFailed(false);
                        logIn(phone);
                        setLoading(false);
                      })
                      .catch((e) => {
                        setAutoVerifying(false);
                        setRegisterFailed(true);
                        setLoading(false);
                        console.log('Error: ', e);
                        setErrorMsg(e);
                      });
                  }
                });
              break;
          }
        },
        (error) => {
          console.log('Error: ', error);
          setLoading(false);
        },
      );
    /* .signInWithPhoneNumber('+91' + phoneNumber)
      .then((confirmation) => {
        setConfirm(confirmation);
        setLoading(false);
      })
      .catch((error) => {
        setRegisterFailed(true);
        setErrorMsg(error.message);
        setGetOTP(0);
        setLoading(false);
      }); */
  }
  useEffect(() => {
    if (getOTP < 1 && otpTimer) {
      clearInterval(otpTimer);
    }
  }, [getOTP]);

  const handleRegister = async (userInfo) => {
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
          if (snapshot.val() !== null) {
            Alert.alert(
              'Student exists',
              'You are already registered, please login',
              [
                {
                  text: 'Login',
                  onPress: () => props.navigation.navigate('Login'),
                },
              ],
            );
            setLoading(false);
          } else {
            database()
              .ref('/student/' + phone)
              .update({
                name: userInfo.name,
                state: userInfo.state,
                premium: false,
              })
              .then(() => {
                setRegisterFailed(false);
                logIn(phone);
                setLoading(false);
              })
              .catch((e) => {
                setRegisterFailed(true);
                setLoading(false);
                console.log('Error: ', e);
                setErrorMsg(e);
              });
          }
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
        <Screen style={styles.container}>
          <AppForm
            initialValues={{name: '', state: ''}}
            onSubmit={handleRegister}
            validationSchema={validationSchema}>
            <ErrorMessage visible={registerFailed} error={errorMsg} />
            <AppFormField
              autoCorrect={false}
              icon="account"
              name="name"
              placeholder="Name"
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="book-open-page-variant"
              keyboardType="default"
              name="state"
              placeholder="State"
              textContentType="countryName"
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="cellphone-basic"
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
            {confirm ? <SubmitButton title={'Register'} /> : <></>}
          </AppForm>
          <AppButton
            title={getOTP === 0 ? 'Get OTP' : getOTP}
            onPress={() => signInWithPhoneNumber(phone)}
            color={'secondary'}
            disabled={getOTP === 0 ? false : true}
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
});

export default RegisterScreen;
