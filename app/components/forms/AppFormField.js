import React from 'react';
import {useFormikContext} from 'formik';
import {Picker} from '@react-native-picker/picker';

import AppTextInput from '../AppTextInput';
import ErrorMessage from './ErrorMessage';
import {StyleSheet, View} from 'react-native';
import colors from '../../config/colors';
import {s, vs} from '../../utils/scalingUtils';

const AppFormField = ({
  dropDown = false,
  dropDownList = [],
  name,
  inputContainer,
  onValueChange = () => {},
  width,
  ...otherProps
}) => {
  const {errors, setFieldValue, setFieldTouched, touched, values} =
    useFormikContext();

  return (
    <>
      {dropDown && dropDownList.length > 0 ? (
        <View style={styles.dropDownContainer}>
          <Picker
            dropdownIconColor={colors.primary}
            dropdownIconRippleColor={colors.secondaryDark}
            onBlur={() => setFieldTouched(name)}
            onValueChange={(value, index) => {
              setFieldValue(name, value);
              onValueChange(name, value);
            }}
            selectedValue={values[name]}
            style={styles.container}
          >
            {dropDownList.map((item, index) => (
              <Picker.Item
                label={item.label}
                value={item.value}
                key={index}
                style={styles.container}
              />
            ))}
          </Picker>
        </View>
      ) : (
        <AppTextInput
          inputContainer={inputContainer}
          onBlur={() => setFieldTouched(name)}
          onChangeText={text => {
            setFieldValue(name, text);
            onValueChange(name, text);
          }}
          value={values[name]}
          width={width}
          {...otherProps}
        />
      )}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default AppFormField;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 8,
    flexDirection: 'row',
  },
  dropDownContainer: {
    backgroundColor: colors.light,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
    paddingHorizontal: s(12),
    paddingVertical: vs(1),
  },
});
