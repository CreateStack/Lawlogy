import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../config/colors';

const PrelimsTestSeriesScreen = ({route, navigation}) => {
  const {params} = route;
  const testTime = parseInt(params.quizzes.testTime || 2) * 60 * 60;
  const getQuiz = (quiz) => {
    if (quiz.length === undefined) {
      quiz = Object.values(quiz);
    }
    return quiz;
  };
  const quiz = getQuiz(params.quizzes.questions).filter((ques) => ques);
  const negativeMarking = Math.abs(
    parseFloat(params.quizzes.negativeMarking) || 0,
  );
  return (
    <View style={styles.container}>
      <Text style={styles.instructionsHeading}>Test Instructions</Text>
      <Text style={styles.instructions}>{params.quizzes.rules}</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Quiz', {
            attempts: params.attempts,
            name: params.state,
            negativeMarking: negativeMarking,
            path: 'prelimsTestSeries/',
            popScreens: 3,
            quiz: quiz,
            quizName: params.name,
            showSessionTimer: true,
            testSeries: true,
            time: testTime,
            timeToChangeStyle: testTime * 0.1,
            total: quiz.length,
          })
        }
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

export default PrelimsTestSeriesScreen;
