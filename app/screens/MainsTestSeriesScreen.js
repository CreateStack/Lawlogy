import React from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../config/colors';

const MainsTestSeriesScreen = ({route, navigation}) => {
  const {params} = route;
  return (
    <View style={styles.container}>
      <Text style={styles.instructionsHeading}>Test Instructions</Text>
      <Text style={styles.instructions}>{params.quizzes.rules}</Text>
      <TouchableOpacity
        onPress={() => Linking.openURL(params.quizzes.link)}
        style={styles.button}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    bottom: 24,
    left: 16,
    padding: 16,
    position: 'absolute',
    right: 16,
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    fontSize: 22,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  instructions: {
    color: colors.black,
    fontSize: 20,
    marginTop: 16,
    lineHeight: 32,
    textAlign: 'left',
  },
  instructionsHeading: {
    color: colors.black,
    fontSize: 30,
    textAlign: 'center',
  },
});

export default MainsTestSeriesScreen;
