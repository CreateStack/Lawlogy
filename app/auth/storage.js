import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';

const key = 'authtoken';
const storeToken = async authToken => {
  try {
    await AsyncStorage.setItem(key, authToken);
  } catch (error) {
    console.log('Error storing auth token: ', error);
    crashlytics().log('Error storing auth token: ', error);
  }
};

const getToken = async () => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log('Error getting auth token: ', error);
    crashlytics().log('Error getting auth token: ', error);
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Error removing auth token: ', error);
    crashlytics().log('Error removing auth token: ', error);
  }
};

export default {getToken, removeToken, storeToken};
