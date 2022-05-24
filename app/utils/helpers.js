import {Alert, Linking} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import colors from '../config/colors';
import database from '@react-native-firebase/database';

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

const fetchData = (path, setLoading, setData) => {
  const ref = path.trim();
  setLoading(true);
  database()
    .ref(ref)
    .once('value')
    .then(snapshot => {
      setData(snapshot.val() || {});
      setLoading(false);
    })
    .catch(e => {
      console.log('Error while fetching: ', e);
      crashlytics().log('Error while fetching: ', e);
      setData({});
      setLoading(false);
    });
};

const rankStudents = (
  quiz,
  state,
  setLoading,
  setData,
  path,
  user,
  testType,
) => {
  const rankStudents = (students = {}) => {
    const keys = Object.keys(students);
    const board = [];
    let username = '';
    keys.forEach(student => {
      let info = null;
      if (student === user) username = students[student].name;
      if (students[student][testType]?.[state]) {
        info = students[student][testType][state][quiz];
      }
      const score = info?.score;
      const attempts = info?.attempts;
      if (score !== undefined && score !== null) {
        const final = {
          name: students[student].name,
          score: score,
          attempts: attempts,
        };
        board.push(final);
      } else {
        return;
      }
    });
    setData(
      board.sort((a, b) => b.score - a.score),
      username,
    );
  };
  fetchData(path, setLoading, rankStudents);
};

export {fetchData, openURL, rankStudents};
