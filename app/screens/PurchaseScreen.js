import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';
import crashlytics from '@react-native-firebase/crashlytics';
import RNPgReactNativeSDK from 'react-native-pg-react-native-sdk';
import axios from 'axios';

import ActivityIndicator from '../components/ActivityIndicator';
import AuthContext from '../auth/context';
import colors from '../config/colors';
import {ms, s, vs} from '../utils/scalingUtils';

const appId = '15201826579c8733507d992ebf810251';
const key = '0489ea0c3a6e62994c4dbe0c5e02da931268679b';
const endpoint = 'https://test.cashfree.com/api/v2/cftoken/order';

const PurchaseScreen = ({navigation, route: {params}}) => {
  const premium = params.premium;
  const premiumPath = params.premiumPath;
  const [payment, setPayment] = useState('Not initialized');
  const [paymentError, setPaymentError] = useState('');
  const [txnId, setTxnId] = useState('');
  const [loading, setLoading] = useState(false);
  const [startRedirection, setStartRedirection] = useState(false);
  const [interval, setIntervalValue] = useState(null);
  const [progress, setProgress] = useState(0);
  const {user} = useContext(AuthContext);
  const total = parseInt(premium.cost) - parseInt(premium.discount || 0);
  const ENV = 'TEST';
  const orderNumber = parseInt(premium.orderNumber || 1) + 1;
  const setPaymentInfo = (setLoading, data) => {
    const ref = ('student/' + user + '/' + premiumPath).trim();
    const updatation = {
      item: params.item,
      discount: premium.discount || 0,
      orderId: data.orderId,
      payment: total,
      premium: true,
      premiumStartTime: Date.now(),
      signature: data.signature,
      txnId: data.referenceId,
    };
    const handleCompletion = () => {
      setLoading(false);
      navigation.setParams({disableLeftButton: true});
      setStartRedirection(true);
    };
    setLoading(true);
    database()
      .ref(ref)
      .update(updatation)
      .then(() => {
        database()
          .ref(
            'premium/' +
              (params.item.includes('testSeries') ? 'testSeries' : 'quizes'),
          )
          .update({orderNumber: orderNumber})
          .then(() => {
            handleCompletion();
          })
          .catch((e) => {
            crashlytics().log('Failed to update orderNumber: ', e);
            handleCompletion();
          });
      })
      .catch((e) => {
        crashlytics().log('Failed to uplaod txn details: ', e);
        handleCompletion();
      });
  };
  useEffect(() => {
    if (startRedirection) {
      setIntervalValue(
        setInterval(() => {
          setProgress((v) => v + 1);
        }, 1000),
      );
    }
    return () => clearInterval(interval);
  }, [startRedirection]);

  useEffect(() => {
    if (progress === 10) {
      setProgress(0);
      clearInterval(interval);
      setStartRedirection(false);
      navigation.pop(params.popScreens);
    }
  }, [progress]);

  const successCallback = (data) => {
    console.log('See success: ', data);
    setPayment('Success!!');
    setPaymentError('');
    setTxnId(data.referenceId);
    setPaymentInfo(setLoading, data);
  };

  const failureCallback = (data) => {
    console.log('See failure: ', data);
    setPayment('Failure');
    setPaymentError(data.txMsg);
  };

  const initializePayment = () => {
    setLoading(true);
    const orderId = 'lawlogy_' + params.item + '_' + orderNumber;
    axios
      .post(
        endpoint,
        {
          orderId: orderId,
          orderAmount: total.toString(),
          orderCurrency: 'INR',
        },
        {
          timeout: 60 * 1000,
          headers: {
            'x-client-id': appId,
            'x-client-secret': key,
          },
        },
      )
      .then((resp) => {
        console.log('resp: ', resp);
        crashlytics().log('token resp: ', resp);
        let data = {
          appId: appId,
          customerEmail: 'lawlogyonlineclasses@gmail.com',
          customerPhone: user.toString(),
          orderAmount: total.toString(),
          orderCurrency: 'INR',
          orderId: orderId,
          orderNote: 'lawlogy ' + params.item + ' pruchase',
          tokenData: resp.data?.cftoken || '',
        };
        console.log('map: ', data);
        RNPgReactNativeSDK.startPaymentUPI(data, ENV, (result) => {
          result = JSON.parse(result);
          console.log('result: ', result);
          if (result.txStatus === 'SUCCESS') {
            setLoading(false);
            successCallback(result);
          } else {
            setLoading(false);
            failureCallback(result);
          }
        });
      })
      .catch((e) => {
        crashlytics().log('Error in fetching token: ', e);
        console.log('Error in fetching token: ', e);
        failureCallback(result);
        setLoading(false);
      });
  };

  return (
    <>
      <ActivityIndicator
        visible={startRedirection}
        source={require('../assets/animations/progress.json')}
        opacity={1}
        progress={progress / 10}
      />
      {startRedirection && (
        <Text style={{alignSelf: 'center', fontSize: 18}}>
          {'Taking you to home in ' + (10 - progress) + ' seconds'}
        </Text>
      )}
      <ActivityIndicator visible={loading} />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.lightBlue,
        }}>
        <View style={styles.container}>
          <MaterialCommunityIcons
            name={'scale-balance'}
            color={colors.primary}
            size={s(60)}
          />
          <Text style={styles.header}>WHAT YOU WILL GET</Text>
          {premium.info.split('\n')?.map((item, index) => {
            return (
              <View style={styles.info}>
                <Text style={styles.point}>{item}</Text>
                <MaterialCommunityIcons
                  name={'check-decagram'}
                  size={s(20)}
                  color={colors.green}
                />
              </View>
            );
          })}
          <View
            style={{
              backgroundColor: colors.secondary,
              padding: s(6),
              position: 'absolute',
              bottom: vs(32),
              width: '100%',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.payment}>{'Payment status: '}</Text>
              <Text
                style={[
                  styles.payment,
                  {
                    color:
                      payment === 'Success!!' ? colors.green : colors.redText,
                  },
                ]}>
                {payment}
              </Text>
            </View>
            {paymentError ? (
              <Text style={styles.payment}>
                {'Payment error: ' + paymentError}
              </Text>
            ) : null}
            {txnId ? (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.payment}>{'TxnId: '}</Text>
                <Text
                  style={[
                    styles.payment,
                    {
                      color:
                        payment === 'Success!!' ? colors.green : colors.redText,
                      flex: 1,
                      flexWrap: 'wrap',
                    },
                  ]}>
                  {txnId}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          onPress={initializePayment}
          style={styles.purchaseButton}>
          <Text style={styles.purchaseText}>PAY</Text>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            {parseInt(premium.discount) ? (
              <Text
                style={[
                  styles.purchaseText,
                  {
                    color: colors.yellow,
                    textDecorationLine: 'line-through',
                  },
                ]}>
                <MaterialCommunityIcons
                  name={'currency-inr'}
                  color={colors.yellow}
                  size={ms(18)}
                />
                {parseInt(premium.cost)}
              </Text>
            ) : null}
            <Text style={styles.purchaseText}>
              <MaterialCommunityIcons
                name={'currency-inr'}
                color={colors.white}
                size={20}
              />
              {total}
            </Text>
          </View>
          {parseInt(premium.discount) ? (
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <Text style={[styles.purchaseText, {fontSize: ms(12)}]}>
                {'YOU SAVE '}
              </Text>
              <Text
                style={[
                  styles.purchaseText,
                  {
                    color: colors.green,
                    fontSize: ms(16),
                    textDecorationLine: 'underline',
                  },
                ]}>
                {Math.round(
                  ((parseInt(premium.discount || 0) * 100) /
                    parseInt(premium.cost)) *
                    100,
                ) / 100}
              </Text>
              <Text style={[styles.purchaseText, {fontSize: ms(12)}]}>
                {'% !'}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.lightBlue,
    flex: 1,
    paddingHorizontal: 16,
    marginTop: vs(60),
  },
  header: {
    color: colors.primary,
    fontSize: ms(18),
    lineHeight: 25,
    marginBottom: vs(14),
    marginTop: vs(50),
    fontWeight: 'bold',
  },
  info: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inner: {
    alignItems: 'center',
    padding: 8,
    flex: 1,
    backgroundColor: colors.greyLight,
  },
  payment: {
    color: colors.black,
    fontSize: ms(14),
    lineHeight: 24,
  },
  point: {
    color: colors.black,
    fontSize: ms(14),
    lineHeight: 21,
    textAlign: 'right',
  },
  purchaseButton: {
    alignItems: 'center',
    backgroundColor: colors.blue,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    bottom: 0,
    width: '100%',
  },
  purchaseText: {
    alignItems: 'center',
    color: colors.white,
    fontSize: ms(18),
    lineHeight: 25,
  },
});

export default PurchaseScreen;
