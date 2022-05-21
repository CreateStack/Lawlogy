import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import MainScreen from '../screens/MainScreen';
import TopicScreen from '../screens/TopicScreen';
import QuizzesScreen from '../screens/QuizzesScreen';
import colors from '../config/colors';
import QuestionsScreen from '../screens/QuestionsScreen';
import PurchaseScreen from '../screens/PurchaseScreen';
import {StyleSheet, Text, View} from 'react-native';
import JustQuestionsScreen from '../screens/JustQuestionsScreen';
import YearScreen from '../screens/YearScreen';
import TestSeriesScreen from '../screens/TestSeriesScreen';
import MainsTestSeriesScreen from '../screens/MainsTestSeriesScreen';
import Header from '../components/Header';
import PrelimsTestSeriesScreen from '../screens/PrelimsTestSeriesScreen';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import QuizAnalysisScreen from '../screens/QuizAnalysisScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      header: props => {
        return props.scene.route.params.hideHeader ? null : (
          <Header {...props} />
        );
      },
    }}
  >
    <Stack.Screen
      name="Main"
      component={MainScreen}
      initialParams={{title: 'LAWLOGY'}}
    />
    <Stack.Screen
      name="Topics"
      component={TopicScreen}
      initialParams={{title: 'Topics'}}
    />
    <Stack.Screen
      name="TestSeries"
      component={TestSeriesScreen}
      initialParams={{title: 'Topics'}}
    />
    <Stack.Screen
      name="MainsTestSeries"
      component={MainsTestSeriesScreen}
      initialParams={{title: 'Mains'}}
    />
    <Stack.Screen
      name="PrelimsTestSeries"
      component={PrelimsTestSeriesScreen}
      initialParams={{title: 'Prelims'}}
    />
    <Stack.Screen
      name="Quizzes"
      component={QuizzesScreen}
      initialParams={{title: 'Quizzes'}}
    />
    <Stack.Screen
      name="Quiz"
      component={QuestionsScreen}
      initialParams={{title: 'Quiz'}}
    />
    <Stack.Screen name="Purchase" component={PurchaseScreen} />
    <Stack.Screen name="JustQuestions" component={JustQuestionsScreen} />
    <Stack.Screen name="Years" component={YearScreen} />
    <Stack.Screen name="QuizAnalysis" component={QuizAnalysisScreen} />
    <Stack.Screen
      name="LeaderBoard"
      component={LeaderBoardScreen}
      initialParams={{title: 'Leaderboard'}}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    marginLeft: 8,
  },
});

export default AppNavigator;
