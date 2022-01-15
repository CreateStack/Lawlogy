import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import MainScreen from '../screens/MainScreen';
import TopicScreen from '../screens/TopicScreen';
import QuizzesScreen from '../screens/QuizzesScreen';
import colors from '../config/colors';
import QuestionsScreen from '../screens/QuestionsScreen';
import PurchaseScreen from '../screens/PurchaseScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Main"
      component={MainScreen}
      options={{
        headerShown: true,
        title: 'Lawlogy',
        headerStyle: {elevation: 10},
        headerTitleAlign: 'center',
        headerTintColor: colors.primary,
      }}
    />
    <Stack.Screen
      name="Topics"
      component={TopicScreen}
      options={{
        headerShown: true,
        title: 'Topics',
        headerStyle: {elevation: 10},
        headerTitleAlign: 'center',
        headerTintColor: colors.primary,
      }}
    />
    <Stack.Screen
      name="Quizzes"
      component={QuizzesScreen}
      options={{
        headerShown: true,
        title: 'Quizzes',
        headerStyle: {elevation: 10},
        headerTitleAlign: 'center',
        headerTintColor: colors.primary,
      }}
    />
    <Stack.Screen
      name="Quiz"
      component={QuestionsScreen}
      options={{
        headerShown: true,
        title: 'Quiz',
        headerStyle: {elevation: 10},
        headerTitleAlign: 'center',
        headerTintColor: colors.primary,
      }}
    />
    <Stack.Screen
      name="Purchase"
      component={PurchaseScreen}
      options={{
        headerShown: true,
        title: 'Lawlogy complete course',
        headerStyle: {elevation: 10},
        headerTitleAlign: 'center',
        headerTintColor: colors.primary,
      }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
