import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import MainScreen from '../screens/MainScreen';
import TopicScreen from '../screens/TopicScreen';
import QuizzesScreen from '../screens/QuizzesScreen';
import colors from '../config/colors';
import QuestionsScreen from '../screens/QuestionsScreen';
import PurchaseScreen from '../screens/PurchaseScreen';
import {Image, StyleSheet, Text, View} from 'react-native';

const Stack = createStackNavigator();

const headerTitleCreater = (title) => (
  <View style={styles.header}>
    {/* <Image source={require('../assets/logo.jpg')} style={styles.image} /> */}
    <Text style={styles.title}>{title}</Text>
  </View>
);

const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        height: 50,
        backgroundColor: colors.primary,
        elevation: 8,
      },
      headerTitle: () => headerTitleCreater('Lawlogy'),
      headerTitleAlign: 'center',
    }}>
    <Stack.Screen
      name="Main"
      component={MainScreen}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="Topics"
      component={TopicScreen}
      options={{
        headerShown: true,
        headerTitle: () => headerTitleCreater('Topics'),
      }}
    />
    <Stack.Screen
      name="Quizzes"
      component={QuizzesScreen}
      options={{
        headerShown: true,
        headerTitle: () => headerTitleCreater('Quizzes'),
      }}
    />
    <Stack.Screen
      name="Quiz"
      component={QuestionsScreen}
      options={{
        headerShown: true,
        headerTitle: () => headerTitleCreater('Quiz'),
      }}
    />
    <Stack.Screen
      name="Purchase"
      component={PurchaseScreen}
      options={{
        headerShown: true,
        headerTitle: () => headerTitleCreater('Lawlogy complete course'),
      }}
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
