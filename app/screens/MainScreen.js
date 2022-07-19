import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import database from '@react-native-firebase/database';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';

import AuthContext from '../auth/context';
import colors from '../config/colors';
import ActivityIndicator from '../components/ActivityIndicator';
import {ms} from '../utils/scalingUtils';
import Banner from '../components/Banner';
import Menu from '../components/Menu/Menu';
import displayNotification, {
  eventHandler,
  getInitialNotification,
} from '../components/Notifications/Notification';

const loadData = (path, setData, setLoading) => {
  setLoading(v => {
    v.push(path);
    return [...v];
  });
  database()
    .ref(path)
    .once('value')
    .then(snapshot => {
      setData(snapshot.val());
      setLoading(v => {
        let index = v.indexOf(path);
        if (index > -1) {
          v.splice(index, 1);
        }
        return [...v];
      });
    })
    .catch(e => {
      console.log(`Error fetching ${path}: `, e);
      crashlytics().log(`Error fetching ${path}: `, e);
      setLoading(v => {
        let index = v.indexOf(path);
        if (index > -1) {
          v.splice(index, 1);
        }
        return [...v];
      });
    });
};

function MainScreen(props) {
  const {user} = useContext(AuthContext);

  const [questions, setQuestions] = useState();
  const [quizzes, setQuizzes] = useState();
  const [previousYearPapers, setPreviousYearPapers] = useState();
  const [testSeries, setTestSeries] = useState();
  const [extraQuizzes, setExtraQuizzes] = useState();
  const [banners, setBanners] = useState();
  const [loading, setLoading] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [userInfo, setUserInfo] = useState({phone: user});
  const [initialLaunch, setInitialLaunch] = useState(true);

  const loadFunc = useCallback(() => {
    loadData(
      '/student/' + user,
      data => {
        setUserInfo(v => {
          v.name = data.name;
          v.premium = {};
          Object.keys(data).forEach(key => {
            if (
              key.toLowerCase() !== 'premium' &&
              key.toLowerCase().includes('premium')
            ) {
              v.premium[key] = data[key];
            }
          });
          return {...v};
        });
      },
      setLoading,
    );
    loadData('/questions', setQuestions, setLoading);
    loadData('/quizes', setQuizzes, setLoading);
    loadData('/previousYearQuestions', setPreviousYearPapers, setLoading);
    loadData('/testSeries', setTestSeries, setLoading);
    loadData('/extraQuizzes', setExtraQuizzes, setLoading);
    loadData(
      '/banner',
      data => setBanners(Object.values(data) || {}),
      setLoading,
    );
  }, [user]);

  useEffect(() => {
    loadFunc();
    props.navigation.setParams({
      leftIcon: 'menu',
      onPressBack: () => setShowMenu(true),
    });
  }, [props.navigation, loadFunc]);

  useEffect(() => {
    if (loading.length < 1) {
      if (initialLaunch) {
        getInitialNotification(navigateToScreen =>
          handleBannerOnPress({navigateToScreen}),
        );
        setInitialLaunch(false);
      }
      messaging()
        .subscribeToTopic('lawlogy')
        .then(() => console.log('Subscribed to topic!'));
      messaging()
        .registerDeviceForRemoteMessages()
        .then(() => {
          messaging()
            .getToken()
            .then(token => {
              console.log('FCM token: ', token);
            });
        });
      console.log('set to receive');
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log(
          'A new FCM message arrived!',
          JSON.stringify(remoteMessage),
        );
        displayNotification(
          remoteMessage.data?.title,
          remoteMessage.data?.body,
          remoteMessage.data?.navigateToScreen,
        );
      });
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log(
          'A new FCM message arrived!',
          JSON.stringify(remoteMessage),
        );
        displayNotification(
          remoteMessage.data?.title,
          remoteMessage.data?.body,
          remoteMessage.data?.navigateToScreen,
        );
      });

      const eventHandlerUnsubscribe = eventHandler(navigateToScreen =>
        handleBannerOnPress({navigateToScreen}),
      );

      return () => {
        console.log('unsubscribing');
        unsubscribe();
        eventHandlerUnsubscribe.foreground();
      };
    }
  }, [loading.length]);

  const data = [
    {
      onPress: () => {
        const navigate = data => {
          quizzes &&
            props.navigation.navigate('Topics', {
              itemName: 'Quizzes',
              items: quizzes,
              image: require('../assets/quizzes.jpg'),
              navigateToScreen: 'Quizzes',
              showExtraInfo: true,
              premium: data,
            });
        };
        loadData('/premium/quizes', navigate, setLoading);
      },
      disabled: quizzes,
      imageBackground: require('../assets/quizzes.jpg'),
      blurRadius: 2,
      text: "Subject-wise MCQ's",
      extraInfo: quizzes
        ? Object.keys(quizzes).length +
          (Object.keys(quizzes).length > 1 ? ' Topics' : ' Topic')
        : 'Coming soon',
    },
    {
      onPress: () => {
        testSeries &&
          props.navigation.navigate('TestSeries', {
            itemName: 'Year',
            items: testSeries,
            title: 'Series',
          });
      },
      disabled: testSeries,
      imageBackground: require('../assets/testSeries.jpg'),
      blurRadius: 0.5,
      text: 'Test Series',
      extraInfo: testSeries
        ? Object.keys(testSeries).length + ' Series'
        : 'Coming soon',
    },
    {
      onPress: () =>
        questions &&
        props.navigation.navigate('Topics', {
          itemName: 'Questions',
          items: questions,
          image: require('../assets/questions.jpg'),
          navigateToScreen: 'JustQuestions',
          showExtraInfo: true,
        }),
      disabled: questions,
      imageBackground: require('../assets/questions.jpg'),
      blurRadius: 1.2,
      text: 'Mains Questions',
      extraInfo: questions
        ? Object.keys(questions).length +
          (Object.keys(questions).length > 1 ? ' Topics' : ' Topic')
        : 'Coming soon',
    },
    {
      onPress: () =>
        extraQuizzes &&
        props.navigation.navigate('TestSeries', {
          itemName: 'Year',
          items: extraQuizzes,
          title: 'Topics',
          extraQuizzes: true,
        }),
      disabled: extraQuizzes,
      imageBackground: require('../assets/extraQuizzes.jpg'),
      blurRadius: 0.5,
      text: 'Extra Quizzes',
      extraInfo: extraQuizzes
        ? Object.keys(extraQuizzes).length + ' Topics'
        : 'Coming soon',
    },
    {
      onPress: () =>
        previousYearPapers &&
        props.navigation.navigate('Topics', {
          itemName: 'Year',
          items: previousYearPapers,
          image: require('../assets/previousYearPapers.jpg'),
          navigateToScreen: 'Years',
          passTitle: true,
          showExtraInfo: true,
          title: 'States',
        }),
      disabled: previousYearPapers,
      imageBackground: require('../assets/previousYearPapers.jpg'),
      blurRadius: 0.5,
      text: 'Previous Year Papers',
      extraInfo: previousYearPapers
        ? Object.keys(previousYearPapers).length +
          (Object.keys(previousYearPapers).length > 1 ? ' Items' : ' Item')
        : 'Coming soon',
    },
    {
      onPress: () => {},
      disabled: null,
      imageBackground: require('../assets/studyMaterial.jpg'),
      blurRadius: 0.5,
      text: 'Study Material',
      extraInfo: 'Coming soon',
    },
    {
      onPress: () => {},
      disabled: null,
      imageBackground: require('../assets/ourCourses.jpg'),
      blurRadius: 0.5,
      text: 'Our Courses',
      extraInfo: 'Coming soon',
    },
    {
      onPress: () => {},
      disabled: null,
      imageBackground: require('../assets/liveClasses.jpg'),
      blurRadius: 0.5,
      text: 'Live Classes',
      extraInfo: 'Coming soon',
    },
  ];

  const render = item => {
    return (
      <TouchableOpacity
        onPress={item.onPress}
        style={styles.subContainer}
        activeOpacity={0.5}
        disabled={!item.disabled}>
        <Image source={item.imageBackground} style={styles.imageBackground} />
        <Text style={styles.text}>{item.text}</Text>
        {item.extraInfo ? (
          <View style={styles.extraInfo}>
            <Text style={styles.extraInfoText}>{item.extraInfo}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  const handleBannerOnPress = ({navigateToScreen}) => {
    switch (navigateToScreen) {
      case 'Quizzes':
        data[0].onPress();
        break;
      case 'TestSeries':
        data[1].onPress();
        break;
      case 'Questions':
        data[2].onPress();
        break;
      case 'ExtraQuizzes':
        data[3].onPress();
        break;
      case 'Years':
        data[4].onPress();
        break;
      case 'StudyMaterial':
        data[5].onPress();
        break;
      case 'OurCourses':
        data[6].onPress();
        break;
      case 'LiveClasses':
        data[7].onPress();
        break;
      default:
        break;
    }
  };

  const headerComponent = () => {
    return banners?.length ? (
      <View style={styles.banner}>
        <Banner
          data={banners.filter(banner => banner)}
          height={150}
          timer={3000}
          handlePress={handleBannerOnPress}
        />
      </View>
    ) : null;
  };

  return (
    <>
      <ActivityIndicator visible={loading.length > 0} />
      <Menu isVisible={showMenu} setVisible={setShowMenu} userInfo={userInfo} />
      <FlatList
        columnWrapperStyle={{justifyContent: 'space-between'}}
        data={data}
        ListHeaderComponent={headerComponent}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        onRefresh={loadFunc}
        refreshing={loading.length > 0}
        renderItem={({item}) => render(item)}
        style={styles.flatlist}
      />
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  extraInfo: {
    backgroundColor: colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    top: 0,
    right: 0,
    borderBottomLeftRadius: 10,
  },
  extraInfoText: {
    fontSize: ms(12),
    color: colors.black,
  },
  flatlist: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    width: '100%',
  },
  imageBackground: {
    height: '60%',
    width: '100%',
    borderWidth: 2,
    borderColor: colors.secondary,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  subContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 1,
    height: 150,
    justifyContent: 'space-between',
    marginVertical: 12,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '46%',
  },
  text: {
    color: colors.black,
    flexWrap: 'wrap',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default MainScreen;
