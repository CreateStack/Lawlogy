import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import defaultStyles from '../config/styles';
import {s, vs} from '../utils/scalingUtils';

function AppTextInput({
  icon,
  inputContainer = {},
  width = '100%',
  ...otherProps
}) {
  return (
    <View style={[styles.container, {width}, inputContainer]}>
      {icon && <MaterialCommunityIcons name={icon} size={22} />}
      <TextInput
        placeholderTextColor={defaultStyles.colors.medium}
        style={defaultStyles.text}
        width={width}
        {...otherProps}
      />
    </View>
  );
}

export default AppTextInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: s(8),
    flexDirection: 'row',
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    marginVertical: vs(10),
    alignItems: 'center',
  },
  icon: {
    marginRight: s(10),
  },
});
