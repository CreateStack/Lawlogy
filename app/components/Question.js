import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RadioForm, {
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';

function Question({
  question,
  index = 0,
  prefill = '',
  view,
  selection,
  setSelections,
}) {
  const [value, setValue] = useState(view ? prefill : selection);

  useEffect(() => {
    setSelections(v => {
      v[index] = value;
      return {...v};
    });
  }, [value, index, setSelections]);

  const Radio = ({label, option}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        disabled={view}
        onPress={() => {
          setValue(option.toLowerCase());
        }}
        keyboardShouldPersistTaps="always"
        style={styles.radioContainer}>
        {view ? (
          value === option ? (
            option === question.correct.toLowerCase() ? (
              <MaterialCommunityIcons
                name={'check'}
                size={30}
                color={colors.green}
              />
            ) : (
              <MaterialCommunityIcons
                name={'close'}
                size={30}
                color={colors.redText}
              />
            )
          ) : (value !== option || !value) &&
            option === question.correct.trim().toLowerCase() ? (
            <MaterialCommunityIcons
              name={'check'}
              size={30}
              color={colors.green}
            />
          ) : (
            <RadioButtonInput
              index={1}
              obj={{label: question.a, value: 0}}
              onPress={() => {
                setValue(option.toLowerCase());
              }}
              isSelected={false}
              buttonInnerColor={colors.primary}
              buttonOuterColor={colors.primary}
              disabled={view}
              buttonSize={12}
              buttonWrapStyle={{paddingVertical: 8}}
            />
          )
        ) : (
          <RadioButtonInput
            index={1}
            obj={{label: question.a, value: 0}}
            onPress={() => {
              setValue(option.toLowerCase());
            }}
            isSelected={value === option}
            buttonInnerColor={colors.primary}
            buttonOuterColor={colors.primary}
            disabled={view}
            buttonSize={12}
            buttonWrapStyle={{paddingVertical: 8}}
          />
        )}
        <RadioButtonLabel
          index={1}
          obj={{label: label, value: 0}}
          labelHorizontal={true}
          onPress={() => {
            setValue(option.toLowerCase());
          }}
          labelStyle={styles.option}
          labelWrapStyle={{width: '90%'}}
          disabled={view}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.white,
        ...(view
          ? {
              borderWidth: 3,
              borderColor: value
                ? value === question.correct.toLowerCase()
                  ? colors.green
                  : colors.redText
                : colors.yellow,
            }
          : {}),
      }}>
      <Text style={styles.question}>
        {'Q.' + Number(index + 1) + ' ' + question.Question}
      </Text>
      <RadioForm
        animation={true}
        formHorizontal={false}
        style={styles.radioform}>
        <Radio label={'A) ' + question.a} option={'a'} />
        <Radio label={'B) ' + question.b} option={'b'} />
        <Radio label={'C) ' + question.c} option={'c'} />
        <Radio label={'D) ' + question.d} option={'d'} />
      </RadioForm>
      {view ? null : (
        <TouchableOpacity
          style={styles.clearSelection}
          onPress={() => {
            setValue('');
          }}>
          <Text style={styles.clearSelectionText}>Clear selection</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  clearSelection: {
    padding: 12,
    backgroundColor: colors.danger,
    borderRadius: 10,
    marginTop: 16,
  },
  clearSelectionText: {
    color: colors.white,
    fontSize: 16,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    padding: 16,
    marginVertical: 8,
    width: '100%',
  },
  option: {
    color: colors.black,
    fontSize: 16,
    textAlign: 'left',
    paddingLeft: 8,
    paddingVertical: 8,
  },
  question: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  radioContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginVertical: 8,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  radioform: {
    width: '100%',
  },
});

export default Question;
