import SecureStorage from 'react-native-secure-storage';

const key = 'authtoken';
const storeToken = async (authToken) => {
  try {
    await SecureStorage.setItem(key, authToken);
  } catch (error) {
    console.log('Error storing auth token: ', error);
  }
};

const getToken = async () => {
  try {
    return await SecureStorage.getItem(key);
  } catch (error) {
    console.log('Error getting auth token: ', error);
  }
};

const removeToken = async () => {
  try {
    await SecureStorage.removeItem(key);
  } catch (error) {
    console.log('Error removing auth token: ', error);
  }
};

export default {getToken, removeToken, storeToken};
