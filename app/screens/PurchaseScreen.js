import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RNUpiPayment from 'react-native-upi-payment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';
import crashlytics from '@react-native-firebase/crashlytics';

import ActivityIndicator from '../components/ActivityIndicator';
import AuthContext from '../auth/context';
import colors from '../config/colors';

const PurchaseScreen = ({navigation, route: {params}}) => {
  const premium = params.premium;
  const premiumPath = params.premiumPath;
  const [payment, setPayment] = useState('Not initialized');
  const [txnId, setTxnId] = useState('');
  const [loading, setLoading] = useState(false);
  const [startRedirection, setStartRedirection] = useState(false);
  const [interval, setIntervalValue] = useState(null);
  const [progress, setProgress] = useState(0);
  const {user} = useContext(AuthContext);
  const total = parseInt(premium.cost) - parseInt(premium.discount || 0);

  const setPaymentInfo = (setLoading, txnId) => {
    const ref = ('student/' + user + '/' + premiumPath).trim();
    const updatation = {
      item: premium.item,
      discount: premium.discount || 0,
      payment: total,
      premium: true,
      premiumStartTime: Date.now(),
      txnId: txnId,
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
        handleCompletion();
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

  if (progress === 10) {
    setProgress(0);
    clearInterval(interval);
    setStartRedirection(false);
    navigation.pop(params.popScreens);
  }

  const successCallback = (data) => {
    console.log('See success: ', data);
    if (data['Status']?.toLowerCase() === 'success') {
      setPayment('Success!!');
      setTxnId(data['txnId']);
      setPaymentInfo(setLoading, data['txnId']);
    } else setPayment('Failure');
  };

  const failureCallback = (data) => {
    console.log('See failure: ', data);
    setPayment('Failure');
  };

  const initializePayment = () => {
    RNUpiPayment.initializePayment(
      {
        vpa: 'BHARATPE.9050980041@fbpe',
        payeeName: 'PARITOSH SHARMA',
        amount: total.toString(),
        transactionRef: 'LawlogyCourse',
        transactionNote: 'Lawlogy complete series',
      },
      successCallback,
      failureCallback,
    );
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
            size={64}
          />
          <Text style={styles.header}>WHAT YOU WILL GET</Text>
          {premium.info.split('\n')?.map((item, index) => {
            return (
              <View style={styles.info}>
                <Text style={styles.point}>{item}</Text>
                <MaterialCommunityIcons
                  name={'check-decagram'}
                  size={24}
                  color={colors.green}
                />
              </View>
            );
          })}
          <View
            style={{
              backgroundColor: colors.secondary,
              padding: 8,
              position: 'absolute',
              bottom: 40,
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
            {!txnId ? (
              <Text style={styles.payment}>
                {'(Please pay only using PayTM or GPay)'}
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
                  size={20}
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
              <Text style={[styles.purchaseText, {fontSize: 14}]}>
                {'YOU SAVE '}
              </Text>
              <Text
                style={[
                  styles.purchaseText,
                  {
                    color: colors.green,
                    fontSize: 18,
                    textDecorationLine: 'underline',
                  },
                ]}>
                {Math.round(
                  ((parseInt(premium.discount || 0) * 100) /
                    parseInt(premium.cost)) *
                    100,
                ) / 100}
              </Text>
              <Text style={[styles.purchaseText, {fontSize: 14}]}>{'% !'}</Text>
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
    marginTop: 64,
  },
  header: {
    color: colors.primary,
    fontSize: 20,
    lineHeight: 25,
    marginBottom: 16,
    marginTop: 56,
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
    fontSize: 16,
    lineHeight: 24,
  },
  point: {
    color: colors.black,
    fontSize: 16,
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
    fontSize: 20,
    lineHeight: 25,
  },
});

export default PurchaseScreen;
