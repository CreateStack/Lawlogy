import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import colors from '../config/colors';

const AnalysisLabelWithIcon = ({imageSource, mainText, subText}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
      </View>
      <View style={styles.labels}>
        <Text style={styles.mainText}>{mainText}</Text>
        <Text style={styles.subText}>{subText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  image: {
    borderRadius: 25,
    height: 36,
    width: 36,
  },
  imageContainer: {
    borderColor: colors.greyLight,
    borderRadius: 50,
    borderWidth: 1,
    padding: 4,
    overflow: 'hidden',
  },
  labels: {
    marginLeft: 8,
  },
  mainText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: 'bold',
  },
  subText: {
    color: colors.silver,
    fontSize: 15,
  },
});

export default AnalysisLabelWithIcon;
