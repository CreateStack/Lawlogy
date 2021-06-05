import React from 'react';
import {View, TextInput, StyleSheet, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import defaultStyles from '../config/styles';

function AppTextInput({icon, width = '100%', ...otherProps}) {
  return (
    <View style={[styles.container, {width}]}>
      {icon && <MaterialCommunityIcons name={icon} size={22} />}
      <TextInput
        placeholderTextColor={defaultStyles.colors.medium}
        style={defaultStyles.text}
        {...otherProps}
        width={width}
      />
    </View>
  );
}

export default AppTextInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
});
