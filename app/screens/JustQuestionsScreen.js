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
  let count = 0;
  const render = ({item}) => {
    if (!item) return null;
    count++;
    return (
      <View style={styles.question}>
        <Text style={styles.questionText}>
          {count + '. ' + _.capitalize(item)}
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
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
        colors={[colors.primary, colors.secondary]}
        style={styles.gradient}>
        <View>
          <Text style={styles.gradientTopic}>{params.name}</Text>
          <Text style={styles.gradientText}>Mains Questions</Text>
        </View>
        <Image
          source={require('../assets/questions.jpg')}
          style={styles.image}
        />
      </LinearGradient>
      <FlatList
        data={params.quizzes}
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
    paddingVertical: 32,
    top: -20,
    width: '100%',
  },
  gradient: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '25%',
    justifyContent: 'space-between',

    paddingHorizontal: 32,
    width: '100%',
  },
  gradientText: {
    color: colors.white,
    fontSize: 22,
  },
  gradientTopic: {
    color: colors.white,
    fontSize: 35,
  },
  image: {
    borderColor: colors.white,
    borderRadius: 60,
    borderWidth: 6,
    height: 110,
    width: 110,
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
});

export default JustQuestionsScreen;
