import React, {useEffect, useState} from 'react';
import {
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

  return (
    <>
      <ActivityIndicator visible={loading} />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Topics', {quizzes})}
          style={styles.subContainer}
          activeOpacity={0.5}
          disabled={!quizzes}>
          <ImageBackground
            source={require('../assets/quizzes.jpg')}
            style={styles.imageBackground}
            blurRadius={1}>
            <Text style={{...styles.text, color: colors.white}}>Quizzes</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.subContainer}
          activeOpacity={0.5}
          disabled={!questions}>
          <ImageBackground
            source={require('../assets/questions.jpg')}
            style={styles.imageBackground}
            blurRadius={1.2}>
            <Text style={{...styles.text, color: colors.black}}>Questions</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    padding: 16,
  },
  imageBackground: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subContainer: {
    flex: 1,
    marginVertical: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    overflow: 'hidden',
  },
  text: {
    fontSize: 40,
  },
});

export default MainScreen;
