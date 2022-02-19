import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';

import colors from '../config/colors';

const JustQuestionsScreen = ({route}) => {
  const {params} = route;
  const render = ({item, index}) => {
    if (!item) return null;
    return (
      <View style={styles.question}>
        <Text style={styles.questionText}>{index + 1 + '. ' + item}</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => console.log('hello')}
          style={styles.share}>
          <Image
            source={require('../assets/share.png')}
            style={styles.shareImage}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.blue]}
        style={styles.gradient}>
        <View style={styles.title}>
          <Text style={styles.gradientTopic}>{params.name}</Text>
          <Text style={styles.gradientText}>Mains Questions</Text>
        </View>
        <Image
          source={require('../assets/questions.jpg')}
          style={styles.image}
        />
      </LinearGradient>
      <FlatList
        contentContainerStyle={styles.flatlistContent}
        data={params.quizzes?.filter((quizzes) => quizzes)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={render}
        style={styles.flatlist}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  flatlist: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 32,
    top: -20,
    width: '100%',
  },
  flatlistContent: {
    paddingBottom: 32,
  },
  gradient: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    height: '25%',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    width: '100%',
  },
  gradientText: {
    color: colors.white,
    fontSize: 20,
  },
  gradientTopic: {
    color: colors.white,
    fontSize: 30,
  },
  image: {
    borderColor: colors.white,
    borderRadius: 50,
    borderWidth: 6,
    height: 100,
    width: 100,
  },
  question: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    marginVertical: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: '100%',
  },
  questionText: {
    color: colors.black,
    fontSize: 18,
  },
  share: {
    alignSelf: 'flex-end',
    marginRight: 16,
  },
  shareImage: {
    height: 20,
    width: 20,
  },
  title: {
    flex: 1,
  },
});

export default JustQuestionsScreen;
