import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import database from '@react-native-firebase/database';

import colors from '../config/colors';
import ActivityIndicator from '../components/ActivityIndicator';

function MainScreen(props) {
  const [questions, setQuestions] = useState();
  const [quizzes, setQuizzes] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    database()
      .ref('/questions')
      .once('value')
      .then((snapshot) => {
        setQuestions(snapshot.val());
        setLoading(false);
      })
      .catch((e) => {
        console.log('Error fetching questions: ', e);
        setLoading(false);
      });
    setLoading(true);
    database()
      .ref('/quizes')
      .once('value')
      .then((snapshot) => {
        setQuizzes(snapshot.val());
        setLoading(false);
      })
      .catch((e) => {
        console.log('Error fetching quizes: ', e);
        setLoading(false);
      });
  }, []);

  const data = [
    {
      onPress: () => props.navigation.navigate('Topics', {quizzes}),
      disabled: quizzes,
      imageBackground: require('../assets/quizzes.jpg'),
      blurRadius: 2,
      text: 'Quizzes',
    },
    {
      onPress: () => {},
      disabled: questions,
      imageBackground: require('../assets/questions.jpg'),
      blurRadius: 1.2,
      text: ' Important Questions',
    },
    {
      onPress: () => {},
      disabled: null,
      imageBackground: require('../assets/comingSoon.png'),
      blurRadius: 0.5,
      text: ' Coming Soon  :)',
    },
    {
      onPress: () => {},
      disabled: null,
      imageBackground: require('../assets/comingSoon.png'),
      blurRadius: 0.5,
      text: ' Coming Soon  :)',
    },
    {
      onPress: () => {},
      disabled: null,
      imageBackground: require('../assets/comingSoon.png'),
      blurRadius: 0.5,
      text: ' Coming Soon  :)',
    },
    {
      onPress: () => {},
      disabled: null,
      imageBackground: require('../assets/comingSoon.png'),
      blurRadius: 0.5,
      text: ' Coming Soon  :)',
    },
    {
      onPress: () => {},
      disabled: null,
      imageBackground: require('../assets/comingSoon.png'),
      blurRadius: 0.5,
      text: ' Coming Soon  :)',
    },
    {
      onPress: () => {},
      disabled: null,
      imageBackground: require('../assets/comingSoon.png'),
      blurRadius: 0.5,
      text: ' Coming Soon  :)',
    },
  ];

  const render = (item) => {
    return (
      <TouchableOpacity
        onPress={item.onPress}
        style={styles.subContainer}
        activeOpacity={0.5}
        disabled={!item.disabled}>
        <ImageBackground
          source={item.imageBackground}
          style={styles.imageBackground}
          blurRadius={item.blurRadius}>
          <Text style={{...styles.text, color: colors.black}}>{item.text}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <FlatList
        contentContainerStyle={styles.flatlistContent}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => render(item)}
        style={{
          flex: 1,
          backgroundColor: colors.secondary,
          paddingHorizontal: 16,
          width: '100%',
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: '100%',
  },
  imageBackground: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subContainer: {
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
    flex: 1,
    height: 100,
    justifyContent: 'center',
    marginVertical: 8,
    overflow: 'hidden',
    width: '100%',
  },
  text: {
    fontSize: 40,
    textAlign: 'center',
  },
});

export default MainScreen;
