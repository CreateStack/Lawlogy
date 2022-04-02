import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import * as Yup from 'yup';
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
import stateData from '../utils/stateData.json';
import preparingForData from '../utils/preparingForData.json';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  state: Yup.string().lowercase().required().label('State'),
  email: Yup.string()
    .lowercase()
    .email('Must be a valid email address')
    .required()
    .label('Email address'),
  age: Yup.string().lowercase().required().label('Age'),
  preparingFor: Yup.string().lowercase().required().label('Preparing for'),
});
function RegisterScreen(props) {
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registerFailed, setRegisterFailed] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [getOTP, setGetOTP] = useState(61);
  const [phone, setPhone] = useState('');
  const [autoVerifying, setAutoVerifying] = useState(false);
  const [otpTimer, setOtpTimer] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const {logIn} = useAuth();

  const updateUserInfo = (name, value) => {
    setUserInfo((info) => {
      info[name] = value;
      return info;
    });
  };

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
                            email: userInfo.email,
                            age: userInfo.age,
                            preparingFor: userInfo.preparingFor,
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
                            crashlytics().log('Error in registration:  ', e);
                            setErrorMsg(e);
                          });
                      }
                    })
                    .catch((e) => {
                      setAutoVerifying(false);
                      setRegisterFailed(true);
                      setLoading(false);
                      console.log('Error: ', e);
                      crashlytics().log('Error in registration: ', e);
                      setErrorMsg(e);
                    });
                })
                .catch((e) => {
                  setAutoVerifying(false);
                  setRegisterFailed(true);
                  setLoading(false);
                  console.log('Error: ', e);
                  crashlytics().log('Error in registration: ', e);
                  setErrorMsg('Error: ', e);
                });
              break;
          }
        },
        (error) => {
          console.log('Error: ', error);
          crashlytics().log('Error in registration: ', error);
          setErrorMsg(error.message);
          setAutoVerifying(false);
          setLoading(false);
        },
      );
  }

  const handleRegister = async (userInfo) => {
    if (!userInfo.otp || userInfo.otp === '') {
      setRegisterFailed(true);
      setErrorMsg('Please enter a valid OTP');
      return;
    }
    console.log('Userinfo: ', userInfo);
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
                email: userInfo.email,
                age: userInfo.age,
                preparingFor: userInfo.preparingFor,
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
                crashlytics().log('Error in fetching student database: ', e);
                setErrorMsg(e);
              });
          }
        })
        .catch((e) => {
          setRegisterFailed(true);
          setLoading(false);
          console.log('Error: ', e);
          crashlytics().log('Error in auth: ', e);
          setErrorMsg(e);
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
            initialValues={{
              name: '',
              state: '',
              email: '',
              age: '',
              preparingFor: '',
            }}
            onSubmit={handleRegister}
            validationSchema={validationSchema}>
            <ErrorMessage visible={registerFailed} error={errorMsg} />
            <AppFormField
              autoCorrect={false}
              icon="account"
              name="name"
              onValueChange={updateUserInfo}
              placeholder="Name"
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              dropDown
              dropDownList={stateData.data}
              icon="book-open-page-variant"
              keyboardType="default"
              name="state"
              onValueChange={updateUserInfo}
              placeholder="State"
              textContentType="countryName"
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="cellphone-basic"
              keyboardType="number-pad"
              name="number"
              onValueChange={updateUserInfo}
              placeholder="10 digit Mobile number"
              textContentType="telephoneNumber"
              onChangeText={(v) => setPhone(v)}
              value={phone}
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="email"
              keyboardType="email-address"
              name="email"
              onValueChange={updateUserInfo}
              placeholder="Email address"
              textContentType="emailAddress"
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="human-male-height"
              keyboardType="number-pad"
              name="age"
              onValueChange={updateUserInfo}
              placeholder="Age"
              textContentType="none"
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              dropDown
              dropDownList={preparingForData.data}
              icon="human-male-height"
              keyboardType="default"
              name="preparingFor"
              onValueChange={updateUserInfo}
              placeholder="Preparing for"
              textContentType="none"
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
});

export default RegisterScreen;
