import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import database from '@react-native-firebase/database';

import colors from '../config/colors';
import ActivityIndicator from '../components/ActivityIndicator';

const loadData = (path, setData, setLoading) => {
  setLoading(true);
  database()
    .ref(path)
    .once('value')
    .then((snapshot) => {
      setData(snapshot.val());
      setLoading(false);
    })
    .catch((e) => {
      console.log(`Error fetching ${path}: `, e);
      setLoading(false);
    });
};

function MainScreen(props) {
  const [questions, setQuestions] = useState();
  const [quizzes, setQuizzes] = useState();
  const [previousYearPapers, setPreviousYearPapers] = useState();
  const [testSeries, setTestSeries] = useState();
  const [loading, setLoading] = useState(false);

  const loadFunc = () => {
    loadData('/questions', setQuestions, setLoading);
    loadData('/quizes', setQuizzes, setLoading);
    loadData('/previousYearQuestions', setPreviousYearPapers, setLoading);
    loadData('/testSeries', setTestSeries, setLoading);
  };

  useEffect(() => {
    loadFunc();
  }, []);

  const data = [
    {
      onPress: () =>
        props.navigation.navigate('Topics', {
          itemName: 'Quizzes',
          items: quizzes,
          image: require('../assets/quizzes.jpg'),
          navigateToScreen: 'Quizzes',
          showExtraInfo: true,
        }),
      disabled: quizzes,
      imageBackground: require('../assets/quizzes.jpg'),
      blurRadius: 2,
      text: 'Quizzes',
      extraInfo: quizzes
        ? Object.keys(quizzes).length +
          (Object.keys(quizzes).length > 1 ? ' Topics' : ' Topic')
        : 'Coming soon',
    },
    {
      onPress: () =>
        props.navigation.navigate('TestSeries', {
          itemName: 'Year',
          items: testSeries,
          image: require('../assets/previousYearPapers.jpg'),
          title: 'States',
        }),
      disabled: testSeries,
      imageBackground: require('../assets/testSeries.jpg'),
      blurRadius: 0.5,
      text: 'Test Series',
      extraInfo: testSeries
        ? Object.keys(testSeries).length +
          (Object.keys(testSeries).length > 1 ? ' States' : ' State')
        : 'Coming soon',
    },
    {
      onPress: () =>
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
      text: ' Mains Questions',
      extraInfo: questions
        ? Object.keys(questions).length +
          (Object.keys(questions).length > 1 ? ' Topics' : ' Topic')
        : 'Coming soon',
    },
    {
      onPress: () =>
        props.navigation.navigate('Topics', {
          itemName: 'Year',
          items: previousYearPapers,
          image: require('../assets/previousYearPapers.jpg'),
          navigateToScreen: 'Years',
          showExtraInfo: true,
          title: 'States',
        }),
      disabled: previousYearPapers,
      imageBackground: require('../assets/previousYearPapers.jpg'),
      blurRadius: 0.5,
      text: 'Previous Year Papers',
      extraInfo: previousYearPapers
        ? Object.keys(previousYearPapers).length +
          (Object.keys(previousYearPapers).length > 1 ? ' States' : ' State')
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

  const render = (item) => {
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

  return (
    <>
      <ActivityIndicator visible={loading} />
      <FlatList
        columnWrapperStyle={{justifyContent: 'space-between'}}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        onRefresh={loadFunc}
        refreshing={loading}
        renderItem={({item}) => render(item)}
        style={styles.flatlist}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 16,
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
