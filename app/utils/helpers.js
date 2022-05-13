import {Alert, Linking} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import colors from '../config/colors';

const openInAppBrowser = async url => {
  if (!url) {
    return;
  }
  try {
    const isAvailable = await InAppBrowser.isAvailable();
    if (isAvailable) {
      setTimeout(async () => {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'close',
          preferredBarTintColor: 'white',
          preferredControlTintColor: 'black',
          animated: true,
          // Android Properties
          showTitle: true,
          enableUrlBarHiding: true,
          showInRecents: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: true,
          toolbarColor: colors.primary,
          navigationBarColor: colors.primary,
        });
      }, 500);
    } else {
      Linking.openURL(url);
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

const openURL = (link, inAppBrowser = false) => {
  inAppBrowser
    ? openInAppBrowser(link)
    : Linking.canOpenURL(link).then(
        supported => {
          supported
            ? Linking.openURL(link)
            : Alert.alert(
                'Not supported',
                "The device doesn't have any supported applications to open: '" +
                  link +
                  "'",
              );
        },
        err => console.log(err),
      );
};

export {openURL};
