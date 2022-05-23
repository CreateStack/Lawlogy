import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import colors from '../config/colors';
import AnalysisLabelWithIcon from './AnalysisLabelWithIcon';
import Separator from '../components/Separator';
import {rankStudents} from '../utils/helpers';
import ActivityIndicator from '../components/ActivityIndicator';
import AuthContext from '../auth/context';
import {calculateScore} from '../utils/calculateScore';

const TwoItems = ({
  first = true,
  second = true,
  image1,
  image2,
  mainText1,
  mainText2,
  subText1,
  subText2,
}) => {
  return (
    <View style={styles.twoItems}>
      {first && (
        <AnalysisLabelWithIcon
          imageSource={image1}
          mainText={mainText1}
          subText={subText1}
        />
      )}
      {second && (
        <AnalysisLabelWithIcon
          imageSource={image2}
          mainText={mainText2}
          subText={subText2}
        />
      )}
    </View>
  );
};

const QuizAnalysisScreen = ({navigation, route: {params}}) => {
  const {
    data,
    name,
    negativeMarking,
    quiz,
    quizName,
    state,
    topicName,
    testTime,
    total,
  } = params;
  const viewShot = useRef();
  const share = () => {
    if (viewShot?.current) {
      viewShot.current.capture().then(uri => {
        Share.open({
          title: 'Share your Lawlogy analysis',
          url: uri,
          message:
            "Check out my incredible '" +
            topicName +
            "' analysis by Lawlogy (https://play.google.com/store/apps/details?id=com.lawlogy) !!",
        });
      });
    }
  };
  const [loading, setLoading] = useState(false);
  const [rank, setRank] = useState({});
  const [allRanks, setAllRanks] = useState([]);
  const [highestMarks, setHighestMarks] = useState(0);
  const {user} = useContext(AuthContext);
  const accuracyStats = calculateScore(0, quiz, data);
  useEffect(() => {
    rankStudents(
      quizName.trim(),
      state.trim(),
      setLoading,
      (ranks, username) => {
        setAllRanks(ranks);
        let maxScore = Number.NEGATIVE_INFINITY;
        ranks.forEach((rank, index) => {
          if (rank.score > maxScore) maxScore = rank.score;
          if (rank.name === username) setRank({...rank, rank: index + 1});
        });
        setHighestMarks(maxScore);
      },
      '/student/',
      user,
    );
  }, [quizName, state]);
  return (
    <>
      <ActivityIndicator visible={loading} />
      <View style={styles.mainContainer}>
        <ViewShot ref={viewShot} style={styles.viewShow}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentStyle}>
            <View style={styles.topicInfo}>
              <Text style={styles.topicName}>{topicName}</Text>
              <Text style={styles.quizName}>
                {quizName
                  .replace(/\w+/g, _.lowerCase)
                  .replace(/\w+/g, _.startCase)}
              </Text>
            </View>
            <Separator
              dashColor={colors.greyLight}
              dashThickness={4}
              style={styles.separator}
            />
            <TwoItems
              image1={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/lawlogy-0908.appspot.com/o/IMG_20220523_220954_662.jpg?alt=media&token=406e8d43-099f-41fe-a735-057860fce7d9',
              }}
              mainText1={total}
              subText1={'Questions'}
              image2={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/lawlogy-0908.appspot.com/o/IMG_20220523_220951_703.jpg?alt=media&token=14aea832-fd19-4591-86de-f927adfce274',
              }}
              mainText2={total}
              subText2={'Total Marks'}
            />
            <TwoItems
              image1={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/lawlogy-0908.appspot.com/o/IMG_20220523_224005_682.jpg?alt=media&token=358002ee-08b7-493b-8939-b07ab6eebd56',
              }}
              mainText1={parseFloat(testTime || 0) * 60 + ' minutes'}
              subText1={'Total Time'}
              image2={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/lawlogy-0908.appspot.com/o/istockphoto-862557392-170667a.jpg?alt=media&token=7fb1fa02-f2c8-4eff-965d-c43a2646fdae',
              }}
              mainText2={'+1, -' + negativeMarking}
              subText2={'Marking Scheme'}
            />
            <Separator
              dashColor={colors.greyLight}
              dashThickness={4}
              style={styles.separator}
            />
            <View>
              <TwoItems
                image1={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/lawlogy-0908.appspot.com/o/IMG_20220523_220948_516.jpg?alt=media&token=74d75672-d398-461f-b69a-c14459e620b4',
                }}
                mainText1={(rank.rank || 'N/A') + '/' + allRanks.length}
                subText1={'Rank'}
                image2={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/lawlogy-0908.appspot.com/o/images.jpeg?alt=media&token=03bf7c07-c464-49cb-ba9f-424779c58127',
                }}
                mainText2={
                  highestMarks > 0
                    ? Math.round(
                        ((Number(accuracyStats.score) * 100) / highestMarks) *
                          100,
                      ) / 100
                    : 'N/A'
                }
                subText2={'Percentile'}
              />
              <TwoItems
                image1={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/lawlogy-0908.appspot.com/o/IMG_20220523_220941_256.jpg?alt=media&token=85560a29-4f38-4907-950a-b4b40d7c63b3',
                }}
                mainText1={accuracyStats.score}
                subText1={'Score'}
                image2={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/lawlogy-0908.appspot.com/o/images%20(1).jpeg?alt=media&token=a287aa4b-745c-4806-9db8-e318bb55a761',
                }}
                mainText2={
                  total > 0 ? (Number(rank.score) * 100) / total + ' %' : 'N/A'
                }
                subText2={'Percentage'}
              />
              <TwoItems
                image1={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/lawlogy-0908.appspot.com/o/IMG_20220523_234638_764.jpg?alt=media&token=785759c9-bab2-429f-bf0f-5959e6d77f4e',
                }}
                mainText1={accuracyStats.count}
                subText1={'Correct'}
                image2={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/lawlogy-0908.appspot.com/o/IMG_20220523_234641_644.jpg?alt=media&token=4254b834-908b-4553-9eb5-c0b2441d5e97',
                }}
                mainText2={accuracyStats.incorrect}
                subText2={'Incorrect'}
              />
              <TwoItems
                image1={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjb2GIr1EH41sSvdnwXrmsmEJ9P1FFbikbtPFkDERVYqvLRHdGjsaVhjQOJj6BQJCzBoc&usqp=CAU',
                }}
                mainText1={
                  total - accuracyStats.count - accuracyStats.incorrect
                }
                subText1={'Unattempted'}
                image2={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/lawlogy-0908.appspot.com/o/IMG_20220523_234645_503.jpg?alt=media&token=85885995-0e72-4d33-942b-9e9bfdf60c2e',
                }}
                mainText2={
                  accuracyStats.count + accuracyStats.incorrect > 0
                    ? (accuracyStats.count * 100) /
                        (accuracyStats.count + accuracyStats.incorrect) +
                      ' %'
                    : 'N/A'
                }
                subText2={'Accuracy'}
              />
            </View>
          </ScrollView>
        </ViewShot>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Quiz', {
                quiz,
                quizName,
                total,
                name,
                data,
                title: 'Answers',
                view: true,
              });
            }}
            style={styles.solution}>
            <Text style={styles.solutionText}>Answers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LeaderBoard', {
                state,
                quiz: quizName,
              });
            }}
            style={styles.solution}>
            <Text style={styles.solutionText}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={share} style={styles.solution}>
            <Text style={styles.solutionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  contentStyle: {
    paddingVertical: 12,
  },
  footer: {
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    bottom: 0,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingVertical: 16,
    position: 'absolute',
    width: '100%',
    zIndex: 9,
  },
  mainContainer: {
    backgroundColor: colors.white,
    flex: 1,
  },
  paperInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
  quizName: {
    color: colors.greyDark,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 16,
  },
  solution: {
    alignItems: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    marginHorizontal: 8,
  },
  solutionText: {
    color: colors.black,
    fontSize: 14,
    textAlign: 'center',
  },
  topicInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  topicName: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  twoItems: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  viewShow: {
    flex: 1,
  },
});

export default QuizAnalysisScreen;
