import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log('Error saving notification: ', e);
    Alert.alert('Error saving notification: ', e);
  }
};

export const getData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('Error getting notification: ', e);
    Alert.alert('Error getting notification: ', e);
  }
};
