import React, {useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import colors from '../config/colors';

const ScoreCard = ({
  isVisible,
  onClose,
  quizName,
  score,
  subjectName,
  total,
  totalAttempt,
}) => {
  const viewShot = useRef();
  const share = () => {
    if (viewShot?.current) {
      viewShot.current.capture().then(uri => {
        Share.open({
          title: 'Share your Lawlogy score',
          url: uri,
          message:
            'Install Lawlogy (https://play.google.com/store/apps/details?id=com.lawlogy) for incredible quizzes, test series, and more!!',
        });
      });
    }
  };
  return (
    <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      backdropColor={colors.primary}
      coverScreen
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={styles.scoreContainer}
      useNativeDriver={true}>
      <>
        <TouchableOpacity onPress={onClose} style={styles.closeScore}>
          <MaterialCommunityIcons
            name={'close'}
            size={32}
            color={colors.white}
          />
        </TouchableOpacity>
        <View style={{...styles.score, borderRadius: 24}}>
          <ViewShot ref={viewShot} style={styles.score}>
            <LottieView
              autoPlay={true}
              loop={true}
              source={require('../assets/animations/trophy.json')}
              style={styles.trophy}
            />
            <Text style={styles.congratulations}>Congratulations!</Text>
            <Text style={styles.scoreText}>
              {'Your score is ' +
                Math.round(score.score * 100) / 100 +
                ' / ' +
                total}
            </Text>
            <Text style={styles.scoreNormal}>{subjectName}</Text>
            <Text style={styles.scoreNormal}>{quizName}</Text>
            <Text style={{...styles.scoreNormal, marginBottom: 18}}>
              Completed Successfully
            </Text>
            <Text>
              <Text>You attempted </Text>
              <Text style={styles.questionAttempt}>
                {totalAttempt +
                  (totalAttempt === 1 ? ' question, ' : ' questions, ')}
              </Text>
            </Text>
            <Text>
              <Text>out of which </Text>
              <Text style={styles.rightAnswer}>
                {score.count + (score.count === 1 ? ' answer ' : ' answers ')}
              </Text>
              <Text>{(score.count === 1 ? 'is' : 'are') + ' correct'}</Text>
            </Text>
          </ViewShot>
          <TouchableOpacity style={styles.share} onPress={share}>
            <Text>Share with friends </Text>
            <MaterialCommunityIcons name={'share-variant'} size={20} />
          </TouchableOpacity>
        </View>
      </>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeScore: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  congratulations: {
    color: colors.black,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questionAttempt: {
    color: colors.blue,
    fontWeight: 'bold',
  },
  rightAnswer: {
    color: colors.green,
    fontWeight: 'bold',
  },
  score: {
    alignItems: 'center',
    backgroundColor: colors.lightBlue,
    justifyContent: 'center',
    padding: 16,
    overflow: 'hidden',
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: '#fff0',
    flex: 1,
    justifyContent: 'center',
    margin: 0,
    padding: 16,
  },
  scoreNormal: {
    color: colors.black,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  scoreText: {
    color: colors.green,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  share: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  trophy: {
    height: 200,
    marginBottom: 8,
    width: 200,
    zIndex: 1,
  },
});

export default ScoreCard;
