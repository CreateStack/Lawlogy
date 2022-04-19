import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';
import database from '@react-native-firebase/database';

import AuthContext from '../auth/context';
import Question from '../components/Question';
import colors from '../config/colors';
import ActivityIndicator from '../components/ActivityIndicator';
import {calculateScore} from '../utils/calculateScore';

function QuestionsScreen(props) {
  const {user} = useContext(AuthContext);
  const [showScore, setShowScore] = useState(false);
  const [selections, setSelections] = useState({});
  const {data, negativeMarking = 0, view} = props.route.params;
  useEffect(() => {
    props.navigation.setParams({
      onPressBack: leaveQuiz,
      onFinish: submit,
    });
  }, [leaveQuiz, props.navigation, submit]);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', leaveQuiz);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', leaveQuiz);
    };
  }, [leaveQuiz]);
  let name = props.route.params.name;
  let path = props.route.params.path || 'quizzes/';
  name = name?.trim();
  let quizName = props.route.params.quizName;
  quizName = quizName.trim();

  const leaveQuiz = useCallback(() => {
    if (view) {
      props.navigation.goBack();
    } else {
      Alert.alert(
        'Leave quiz?',
        'All your progress for this quiz will be lost. Are you sure to leave?',
        [
          {
            text: 'Leave',
            onPress: () => {
              const onGoBack = props.route.params.onGoBack;
              onGoBack && onGoBack();
              const popScreens = props.route.params.popScreens;
              popScreens
                ? props.navigation.pop(popScreens)
                : props.navigation.goBack();
            },
          },
          {text: 'Cancel'},
        ],
      );
    }
    return true;
  }, [
    props.navigation,
    view,
    props.route.params.onGoBack,
    props.route.params.popScreens,
  ]);

  const submit = useCallback(() => {
    const ref = ('student/' + user + '/' + path + name + '/' + quizName).trim();
    console.log('Ref: ', ref);
    const updatation = {
      completed: true,
      score: calculateScore(
        negativeMarking,
        props.route.params.quiz.filter((ques) => ques),
        selections,
      ),
      attempts: parseInt(props.route.params.attempts || 0) + 1,
      ...selections,
    };
    console.log('updation: ', updatation);
    database()
      .ref(ref)
      .update(updatation)
      .then(() => {})
      .catch((e) => {
        Alert.alert('Error', 'There was error in setting score on cloud: ' + e);
      });
    setShowScore(true);
    setTimeout(() => {
      setShowScore(false);
      const onGoBack = props.route.params.onGoBack;
      onGoBack && onGoBack();
      const popScreens = props.route.params.popScreens;
      popScreens ? props.navigation.pop(popScreens) : props.navigation.goBack();
    }, 5000);
  }, [
    user,
    name,
    path,
    props.navigation,
    props.route.params.onGoBack,
    props.route.params.popScreens,
    quizName,
    selections,
    props.route.params.attempts,
    negativeMarking,
    props.route.params.quiz,
  ]);
  let quiz = props.route.params.quiz;
  if (!quiz)
    return (
      <View style={{padding: 16, marginTop: 40, alignItems: 'center'}}>
        <Image
          source={require('../assets/noQuiz.jpg')}
          style={{width: '100%', height: 350, borderRadius: 20}}
        />
        <Text
          style={{
            marginTop: 40,
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 30,
          }}>
          Oops! The quiz is not yet ready 😢.{'\n'}Try another?
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 10,
            marginTop: 20,
          }}
          onPress={() => props.navigation.goBack()}>
          <Text style={{color: colors.white, fontSize: 20}}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  quiz = quiz.filter((ques) => ques);
  const renderItem = ({item, index}) => {
    return (
      <Question
        index={index}
        question={item}
        prefill={view ? data[index] : ''}
        view={view}
        selection={selections[index] || ''}
        setSelections={setSelections}
      />
    );
  };
  const headerItem = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{props.route.params.quizName}</Text>
      </View>
    );
  };
  const footerItem = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: colors.primary,
          }}
          onPress={() => {
            let totalAttempt = Object.keys(selections || {}).filter(
              (selection) => selection,
            ).length;
            if (totalAttempt !== props.route.params.total) {
              Alert.alert(
                'Sure to submit?',
                'You have not attempted all the questions. Are you sure to submit?',
                [{text: 'Submit', onPress: () => submit()}, {text: 'Cancel'}],
              );
            } else submit();
          }}>
          <Text style={{fontSize: 16, color: colors.white}}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: colors.yellow,
          }}
          onPress={leaveQuiz}>
          <Text style={{fontSize: 16, color: colors.black}}>Leave Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={quiz}
        disableVirtualization
        initialNumToRender={20}
        ListHeaderComponent={headerItem}
        ListHeaderComponentStyle={{width: '100%'}}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          alignItems: 'center',
          width: '100%',
          padding: 16,
        }}
        style={{width: '100%', marginBottom: view ? 0 : 88}}
        keyboardShouldPersistTaps="always"
      />
      {view ? null : <View style={styles.footer}>{footerItem()}</View>}
      {showScore ? (
        <>
          <ActivityIndicator
            opacity={0.7}
            source={require('../assets/animations/confetti.json')}
            visible={showScore}
          />
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.yellow,
              justifyContent: 'center',
              position: 'absolute',
              zIndex: 5,
              opacity: 1,
              width: '100%',
              top: 200,
            }}>
            <Text
              style={{
                fontSize: 32,
                color: colors.primary,
                fontWeight: 'bold',
                textAlign: 'center',
                zIndex: 5,
              }}>
              Your score is:{' '}
              {'\n' +
                calculateScore(negativeMarking, quiz, selections) +
                ' / ' +
                props.route.params.total}
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    width: '100%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: colors.lightBlue,
    elevation: 5,
    paddingHorizontal: 40,
    paddingVertical: 8,
    width: Dimensions.get('window').width - 16,
    position: 'absolute',
    bottom: 16,
  },
});

export default QuestionsScreen;
