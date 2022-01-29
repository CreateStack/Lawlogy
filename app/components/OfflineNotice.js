import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

import AppText from './AppText';
import colors from '../config/colors';

function OfflineNotice(props) {
  const netInfo = useNetInfo();

  if (netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)
    return (
      <View style={styles.container}>
        <AppText style={styles.text}>No Internet Connection</AppText>
      </View>
    );

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    height: 50,
    position: 'absolute',
    width: '100%',
    top: StatusBar.currentHeight,
    zIndex: 1,
    elevation: Platform.OS === 'android' ? 1 : 0,
  },
  text: {
    color: colors.white,
  },
});

export default OfflineNotice;
