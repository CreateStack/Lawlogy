import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RadioForm, {
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import database from '@react-native-firebase/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';

const updateOption = (path, value, index) => {
  let x = {};
  x[index] = value;
  database().ref(path).update(x);
};

function Question({
  setScore,
  question,
  index = 0,
  prefill = '',
  setTotalAttempt,
  user,
  name,
  quizName,
  view,
}) {
  const [value, setValue] = useState(prefill);
  const [previousValue, setPreviousValue] = useState('');
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    if (selected) setTotalAttempt((v) => v + 1);
  }, [selected]);
  useEffect(() => {
    if (value) {
      setSelected(true);
      if (value === question.correct.toLowerCase()) {
        if (previousValue) {
          if (previousValue === question.correct.toLowerCase())
            setScore((v) => v);
          else setScore((v) => v + 0.25 + 1);
        } else setScore((v) => v + 1);
      } else {
        if (previousValue) {
          if (previousValue === question.correct.toLowerCase())
            setScore((v) => v - 1 - 0.25);
          else setScore((v) => v);
        } else setScore((v) => v - 0.25);
      }
    }
    updateOption(
      ('student/' + user + '/quizzes/' + name + '/' + quizName).trim(),
      value,
      index,
    );
    setPreviousValue(value);
  }, [value]);

  const Radio = ({label, option}) => {
    return (
      <View style={styles.radioContainer}>
        <RadioButtonLabel
          index={1}
          obj={{label: label, value: 0}}
          labelHorizontal={true}
          onPress={() => setValue(option)}
          labelStyle={styles.option}
          labelWrapStyle={{width: '82%'}}
          disabled={view ? true : false}
        />
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
          ) : value !== option && option === question.correct.toLowerCase() ? (
            <MaterialCommunityIcons
              name={'check'}
              size={30}
              color={colors.green}
            />
          ) : (
            <RadioButtonInput
              index={1}
              obj={{label: question.a, value: 0}}
              onPress={() => setValue(option.toLowerCase())}
              isSelected={false}
              buttonInnerColor={colors.primary}
              buttonOuterColor={colors.primary}
              disabled={view ? true : false}
            />
          )
        ) : (
          <RadioButtonInput
            index={1}
            obj={{label: question.a, value: 0}}
            onPress={() => setValue(option.toLowerCase())}
            isSelected={value === option}
            buttonInnerColor={colors.primary}
            buttonOuterColor={colors.primary}
            disabled={view ? true : false}
          />
        )}
      </View>
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
              borderColor:
                value === question.correct.toLowerCase()
                  ? colors.green
                  : colors.redText,
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
            if (
              previousValue &&
              previousValue === question.correct.toLowerCase()
            ) {
              setScore((v) => v - 1);
            } else if (
              previousValue &&
              previousValue !== question.correct.toLowerCase()
            ) {
              setScore((v) => v + 0.25);
            }
            setValue('');
            if (selected) {
              setTotalAttempt((v) => v - 1);
              setSelected(false);
            }
            setSelected(false);
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
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  option: {
    fontSize: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginVertical: 8,
    alignItems: 'center',
  },
  radioform: {
    width: '85%',
  },
});

export default Question;
