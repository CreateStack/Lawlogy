import React from 'react';
import LottieView from 'lottie-react-native';
import {Platform, View, StyleSheet} from 'react-native';
import colors from '../config/colors';

function ActivityIndicator({
  visible = false,
  source = require('../assets/animations/loader.json'),
  opacity = 0.6,
  progress = false,
}) {
  if (!visible) return null;
  return (
    <View style={{...styles.overlay, opacity: opacity}}>
      <LottieView
        autoPlay={progress === false ? true : false}
        loop={progress === false ? true : false}
        source={source}
        style={{
          zIndex: 1,
          elevation: Platform.OS === 'android' ? 1 : 0,
        }}
        progress={progress === false ? 0 : progress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.secondary,
    height: '100%',
    width: '100%',
    flex: 1,
    position: 'absolute',
    zIndex: 1,
    elevation: Platform.OS === 'android' ? 1 : 0,
    opacity: 0.6,
  },
});

export default ActivityIndicator;
