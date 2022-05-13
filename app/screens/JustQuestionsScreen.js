import React, {useRef} from 'react';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';

import colors from '../config/colors';
import {ms, s} from '../utils/scalingUtils';

const JustQuestionsScreen = ({route}) => {
  const {params} = route;
  const share = (shareRef, subject) => {
    if (shareRef?.current) {
      shareRef.current
        .capture()
        .then(uri => {
          Share.open({
            title: 'Share this important question with your friends',
            message:
              "Checkout this question from '" +
              params.name +
              "'. For more such questions, install Lawlogy (https://play.google.com/store/apps/details?id=com.lawlogy)",
            url: uri,
          });
        })
        .catch(e => {
          console.log('Error in capturing view: ', e);
        });
    }
  };
  const RenderItem = ({item, index}) => {
    const shareRef = useRef();
    return (
      <ViewShot ref={shareRef} style={styles.question}>
        <Text style={styles.questionText}>{index + 1 + '. ' + item}</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => share(shareRef, item)}
          style={styles.share}
        >
          <MaterialCommunityIcons
            name={'share-variant'}
            size={20}
            color={colors.black}
          />
        </TouchableOpacity>
      </ViewShot>
    );
  };
  const render = ({item, index}) => {
    if (!item) return null;
    return <RenderItem item={item} index={index} />;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.blue]}
        style={styles.gradient}
      >
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
        data={params.quizzes?.filter(quizzes => quizzes)}
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
    paddingHorizontal: s(28),
    width: '100%',
  },
  gradientText: {
    color: colors.white,
    fontSize: ms(18),
  },
  gradientTopic: {
    color: colors.white,
    fontSize: ms(26),
  },
  image: {
    borderColor: colors.white,
    borderRadius: 99,
    borderWidth: 6,
    height: s(86),
    width: s(86),
  },
  question: {
    backgroundColor: colors.lightBlue,
    borderRadius: 10,
    marginVertical: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: '100%',
  },
  questionText: {
    color: colors.black,
    fontSize: ms(16),
  },
  share: {
    alignSelf: 'flex-end',
    marginRight: 16,
  },
  shareImage: {
    height: s(18),
    width: s(18),
  },
  title: {
    flex: 1,
  },
});

export default JustQuestionsScreen;
