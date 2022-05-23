import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from '../config/colors';
import {s, ms, vs} from '../utils/scalingUtils';

function AppButton({
  title,
  onPress,
  color = 'primary',
  textColor = colors.white,
  ...rest
}) {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: colors[color]}]}
      onPress={onPress}
      {...rest}>
      <Text style={{...styles.text, color: textColor}}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(12),
    width: '100%',
    marginVertical: vs(5),
  },
  text: {
    color: colors.white,
    fontSize: ms(18),
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default AppButton;
