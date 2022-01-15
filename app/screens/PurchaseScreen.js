import React, {useState} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RNUpiPayment from 'react-native-upi-payment';

import colors from '../config/colors';

const PurchaseScreen = (props) => {
  const [payment, setPayment] = useState('Not initialized');
  const [txnId, setTxnId] = useState('');

  const successCallback = (data) => {
    console.log('See: ', data);
    if (data['Status']?.toLowerCase() === 'success') {
      setPayment('Success!!');
      setTxnId(data['txnId']);
    } else setPayment('Failure');
  };

  const failureCallback = (data) => {
    console.log('See: ', data);
    if (data['Status']?.toLowerCase() === 'success') {
      setPayment('Success!!');
      setTxnId(data['txnId']);
    } else setPayment('Failure');
  };

  const initializePayment = () => {
    RNUpiPayment.initializePayment(
      {
        vpa: 'BHARATPE.9050980041@fbpe',
        payeeName: 'PARITOSH SHARMA',
        amount: '1',
        transactionRef: 'LawlogyCourse',
        transactionNote: 'Lawlogy complete series',
      },
      successCallback,
      failureCallback,
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.lightBlue}}>
      <View style={styles.container}>
        <Text style={styles.header}>
          You will get access to our premium stuff listed below:
        </Text>
        <Text style={styles.point}>{'\u2022 First premium'}</Text>
        <Text style={styles.point}>{'\u2022 Second premium'}</Text>
        <Text style={styles.point}>{'\u2022 Third premium'}</Text>
        <Text style={styles.point}>{'\u2022 Fourth premium'}</Text>
        <Text style={styles.payment}>{'Payment: ' + payment}</Text>
        <Text style={styles.payment}>{'TxnId: ' + txnId}</Text>
      </View>
      <TouchableOpacity
        onPress={initializePayment}
        style={styles.purchaseButton}>
        <Text style={styles.purchaseText}>⚖️ Purchase ⚖️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightBlue,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  header: {
    color: colors.black,
    fontSize: 22,
    lineHeight: 25,
    marginBottom: 8,
  },
  payment: {
    marginTop: 64,
    color: colors.black,
    fontSize: 18,
    lineHeight: 24,
  },
  point: {
    color: colors.greyDark,
    fontSize: 16,
    lineHeight: 21,
  },
  purchaseButton: {
    alignItems: 'center',
    backgroundColor: colors.seaGreen,
    borderRadius: 8,
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  purchaseText: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 25,
  },
});

export default PurchaseScreen;
