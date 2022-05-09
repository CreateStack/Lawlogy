import {Linking} from 'react-native';

const openURL = (link, check = false) => {
  check
    ? Linking.canOpenURL(link).then(
        (supported) => {
          console.log('su: ', supported);
          supported && Linking.openURL(link);
        },
        (err) => console.log(err),
      )
    : Linking.openURL(link);
};

export {openURL};
