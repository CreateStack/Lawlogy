import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import RadioForm, {
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';

import colors from '../config/colors';

function Question({
  question,
  index = 0,
  prefill = '',
  view,
  reportPath,
  selection,
  setSelections,
  setShowReportSubmitted,
}) {
  const [value, setValue] = useState(view ? prefill : selection);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [issue, setIssuse] = useState('');

  const onCloseModal = () => {
    setReportModalVisible(false);
  };
  const submit = () => {
    let count = 0;
    let issues = '';
    database()
      .ref('/reports/' + reportPath + '/' + (index + 1))
      .once('value')
      .then(snapshot => {
        const value = snapshot?.val() || null;
        count = value?.count || 0;
        issues = value?.issue || '';
        const issueObject = {
          count: Number(count) + 1,
          issue: issues + issue + '\\n',
        };
        database()
          .ref('/reports/' + reportPath + '/' + (index + 1))
          .set(issueObject)
          .then(() => {
            setShowReportSubmitted(true);
            setTimeout(() => {
              setShowReportSubmitted(false);
            }, 3000);
          })
          .catch(e => {
            Alert.alert(
              'Error',
              'There was error in posting your issue on cloud: ' + e,
            );
          });
      });
    setReportModalVisible(false);
    setIssuse('');
  };

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
    <>
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
        {view ? (
          <TouchableOpacity
            onPress={() => setReportModalVisible(true)}
            style={styles.reportButton}>
            <MaterialCommunityIcons
              name={'alert'}
              size={18}
              color={colors.gold}
            />
            <Text style={styles.reportText}>Report</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.clearSelection}
            onPress={() => {
              setValue('');
            }}>
            <Text style={styles.clearSelectionText}>Clear selection</Text>
          </TouchableOpacity>
        )}
      </View>
      {reportModalVisible ? (
        <Modal
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          backdropColor={colors.grey}
          coverScreen
          isVisible={reportModalVisible}
          onBackButtonPress={onCloseModal}
          onBackdropPress={onCloseModal}
          style={styles.reportModal}
          useNativeDriver={true}>
          <View style={styles.issue}>
            <Text
              style={{
                ...styles.option,
                paddingLeft: 0,
                paddingVertical: 0,
                marginBottom: 16,
              }}>
              Report an issue:
            </Text>
            <TextInput
              placeholder="Please describe your issue"
              style={styles.issueInput}
              onChangeText={text => {
                setIssuse(text);
              }}
              value={issue}
              numberOfLines={5}
              multiline
            />
            <TouchableOpacity style={styles.submitIssue} onPress={submit}>
              <Text style={styles.submitIssueText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      ) : null}
    </>
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
  issue: {
    padding: 16,
    backgroundColor: colors.white,
  },
  issueInput: {
    borderColor: colors.yellow,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    marginVertical: 16,
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
  report: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    width: '100%',
  },
  reportButton: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    backgroundColor: colors.primary,
  },
  reportText: {
    color: colors.white,
    fontSize: 16,
    paddingLeft: 4,
  },
  radioform: {
    width: '100%',
  },
  submitIssue: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  submitIssueText: {
    color: colors.white,
    fontSize: 18,
  },
});

export default Question;
