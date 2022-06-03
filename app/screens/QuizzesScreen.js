import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';
import database from '@react-native-firebase/database';
import crashlytics from '@react-native-firebase/crashlytics';

import AuthContext from '../auth/context';
import colors from '../config/colors';
import ActivityIndicator from '../components/ActivityIndicator';
import {ms, s, vs} from '../utils/scalingUtils';

const fetchData = (path, phone, setLoading, setData) => {
  const ref = ('/student/' + phone + '/' + path).trim();
  setLoading(v => {
    v.push(path);
    return [...v];
  });
  database()
    .ref(ref)
    .once('value')
    .then(snapshot => {
      setData(snapshot.val() || {});
      setLoading(v => {
        let index = v.indexOf(path);
        if (index > -1) {
          v.splice(index, 1);
        }
        return [...v];
      });
    })
    .catch(e => {
      console.log('Error while fetching: ', e);
      crashlytics().log('Error while fetching: ', e);
      setData({});
      setLoading(v => {
        let index = v.indexOf(path);
        if (index > -1) {
          v.splice(index, 1);
        }
        return [...v];
      });
    });
};

function QuizzesScreen(props) {
  const {user} = useContext(AuthContext);
  const testSeries = props.route.params.testSeries || false;
  const fetchPath =
    (testSeries ? 'prelimsTestSeries/' : 'quizzes/') + props.route.params.name;
  const premiumPath = testSeries
    ? props.route.params.name.replace(' ', '') + '_TestSeriesPremium/'
    : 'quizzesPremium/';
  let quizzes = Object.keys(props.route.params.quizzes);
  if (quizzes.length) {
    quizzes = quizzes.sort((a, b) => {
      a = parseInt(a.replace(/^\D+/g, '')) || Number.POSITIVE_INFINITY;
      b = parseInt(b.replace(/^\D+/g, '')) || Number.POSITIVE_INFINITY;
      return a - b;
    });
  }
  const premium = props.route.params.premium;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState([]);
  const [studentPremium, setStudentPremium] = useState(false);

  const fetch = useCallback(() => {
    fetchData(fetchPath, user, setLoading, setData);
    fetchData(premiumPath, user, setLoading, value => {
      let premium = value.premium;
      if (typeof premium === 'string') {
        premium = premium.toLowerCase();
        setStudentPremium(premium === 'true' ? true : false);
        return;
      } else if (typeof premium === 'boolean') {
        setStudentPremium(premium);
        return;
      } else {
        setStudentPremium(false);
        return;
      }
    });
  }, [fetchPath, premiumPath, user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const getQuiz = quiz => {
    if (testSeries) {
      quiz = quiz.questions;
      if (quiz?.length === undefined) {
        quiz = Object.values(quiz);
      }
    }
    return quiz;
  };
  const decideText = (index, setLocked) => {
    if (studentPremium) {
      setLocked(false);
    } else {
      if (index < parseInt(premium.trials)) {
        setLocked(false);
      } else {
        setLocked(true);
      }
    }
  };

  const RenderItem = ({item, index}) => {
    const questions = getQuiz(props.route.params.quizzes[item]);
    const total = questions.filter(ques => ques).length;
    const testCompletionData = _.get(
      data,
      testSeries ? item.trim() : item.toUpperCase().trim(),
      {},
    );
    const score = _.get(testCompletionData, 'score', 'N_A');
    const completed = _.get(testCompletionData, 'completed', false);
    const [locked, setLocked] = useState(true);

    const AttemptButton = () => {
      return (
        <TouchableOpacity
          onPress={() => {
            locked
              ? props.navigation.navigate('Purchase', {
                  item: testSeries ? 'testSeries' : 'quizzes',
                  popScreens: 3,
                  premium: premium,
                  premiumPath: premiumPath,
                  title: testSeries ? 'Buy Test Series' : 'Buy Quizzes',
                })
              : props.navigation.navigate(
                  testSeries ? 'PrelimsTestSeries' : 'Quiz',
                  {
                    attempts:
                      props.route.params.extraInfoData?.[item]?.attempts,
                    name: testSeries ? item : props.route.params.name,
                    /*  onPressRightIcon: () =>
                    props.navigation.navigate('LeaderBoard', {
                      state: props.route.params.name,
                      quiz: item,
                    }), */
                    quiz: getQuiz(props.route.params.quizzes[item]),
                    quizzes: props.route.params.quizzes[item],
                    quizName: item.toUpperCase(),
                    //rightIcon: 'podium',
                    //showRightIcon: testSeries ? true : false,
                    subjectName: testSeries
                      ? props.route.params.heading
                      : (props.route.params.name || '')
                          .replace(/\w+/g, _.lowerCase)
                          .replace(/\w+/g, _.startCase),
                    state: props.route.params.name,
                    total: total,
                    onGoBack: () => {
                      console.log('fetching: ', fetchPath);
                      fetch();
                    },
                  },
                );
          }}
          style={{
            ...styles.attempt,
            ...(testSeries ? {flex: 1, width: '100%'} : {}),
            ...(completed && !locked
              ? {
                  borderColor: '#4B4FA655',
                  backgroundColor: colors.secondary,
                }
              : {}),
          }}>
          <Text style={styles.seriesTimeText}>
            {/* {props.route.params.quizzes[item].testTime + ' hours'} */}
            {locked ? 'Unlock 🔓' : (completed ? 'Re-' : '') + 'Attempt'}
          </Text>
        </TouchableOpacity>
      );
    };

    useEffect(() => {
      decideText(index, setLocked);
    }, [index]);
    return (
      <View key={index} style={styles.topic}>
        <View
          style={[
            styles.seriesTime,
            {
              backgroundColor: colors.blue,
              paddingVertical: 8,
              borderWidth: 0,
              marginLeft: 0,
            },
          ]}>
          <Text key={index} style={styles.text}>
            {item.toUpperCase()}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: testSeries ? 16 : 24,
            paddingTop: 24,
          }}>
          <View style={styles.quizOptionsView}>
            <Text
              style={{
                color: colors.black,
                fontSize: ms(14),
                fontWeight: 'bold',
              }}>
              {'Score: ' +
                Math.round(parseFloat(score) * 100) / 100 +
                '/' +
                total}
            </Text>
            {completed && !locked ? (
              <TouchableOpacity
                style={{
                  ...styles.button,
                  backgroundColor: colors.danger,
                  borderColor: colors.danger,
                }}
                onPress={() => {
                  props.navigation.navigate('QuizAnalysis', {
                    negativeMarking: Math.abs(
                      parseFloat(
                        props.route.params.quizzes[item]?.negativeMarking,
                      ) || 0,
                    ),
                    quiz: getQuiz(props.route.params.quizzes[item]),
                    quizName: item,
                    topicName: testSeries
                      ? props.route.params.heading
                      : (props.route.params.name || '')
                          .replace(/\w+/g, _.lowerCase)
                          .replace(/\w+/g, _.startCase),
                    total: total,
                    name: props.route.params.name,
                    data: testCompletionData,
                    state: props.route.params.name,
                    testSeries,
                    testTime: props.route.params.quizzes[item].testTime,
                    title: 'Analysis',
                    view: true,
                  });
                }}>
                <Text style={{color: colors.white, fontSize: ms(12)}}>
                  Analyse
                </Text>
              </TouchableOpacity>
            ) : null}

            {testSeries ? (
              <Text
                style={{
                  color: colors.black,
                  fontSize: ms(14),
                  fontWeight: 'bold',
                }}>
                {Number(props.route.params.quizzes[item].testTime)
                  ? '⌛ ' +
                    parseFloat(props.route.params.quizzes[item].testTime || 0) *
                      60 +
                    ' minutes'
                  : 'Time: N/A'}
              </Text>
            ) : (
              <AttemptButton />
            )}
          </View>
        </View>
        {testSeries && (
          <View style={styles.footer}>
            {/*  {!locked && (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('LeaderBoard', {
                    state: props.route.params.name,
                    quiz: item,
                    testSeries,
                  });
                }}
                style={styles.ledaerboard}>
                <Text style={styles.ledaerboardText}>Leaderboard</Text>
              </TouchableOpacity>
            )} */}
            <AttemptButton />
          </View>
        )}
        {props.route.params.showExtraInfo && (
          <View style={styles.extraInfo}>
            <Text style={styles.extraInfoText}>
              {(props.route.params.extraInfoData[item]?.attempts || 0) +
                ' Attempts'}
            </Text>
          </View>
        )}
      </View>
    );
  };
  const headerItem = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {testSeries
            ? props.route.params.heading
            : (props.route.params.name || '')
                .replace(/\w+/g, _.lowerCase)
                .replace(/\w+/g, _.startCase)}
        </Text>
      </View>
    );
  };
  return (
    <>
      <ActivityIndicator visible={loading.length > 0} />
      <View style={styles.container}>
        <FlatList
          data={quizzes}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={headerItem}
          ListHeaderComponentStyle={{width: '100%'}}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
          style={styles.flatlist}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          onRefresh={() => fetchData(fetchPath, user, setLoading, setData)}
          refreshing={loading.length > 0}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.seaGreen,
    borderRadius: 10,
    paddingHorizontal: s(6),
    paddingVertical: vs(4),
    backgroundColor: colors.seaGreen,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  extraInfo: {
    backgroundColor: colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    position: 'absolute',
    top: 0,
    right: 0,
    borderBottomLeftRadius: 10,
  },
  extraInfoText: {
    fontSize: ms(13),
    color: colors.black,
  },
  flatlist: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.yellow,
    borderRadius: 10,
    width: '100%',
  },
  headerText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quizOptionsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  separator: {
    marginVertical: 8,
    width: '60%',
    alignSelf: 'center',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '100%',
  },
  seriesTime: {
    alignItems: 'center',
    backgroundColor: colors.seaGreen,
    borderWidth: 2,
    borderColor: '#30b0b0',
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 3,
    paddingHorizontal: 16,
    marginLeft: 2,
    width: '100%',
  },
  attempt: {
    alignItems: 'center',
    backgroundColor: colors.seaGreen,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#30b0b0',
    justifyContent: 'flex-end',
    paddingVertical: 3,
    paddingHorizontal: 16,
    marginLeft: 2,
  },
  ledaerboard: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.secondaryDark,
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 16,
    marginRight: 2,
    width: '100%',
  },
  ledaerboardText: {
    color: colors.white,
    fontSize: 14,
  },
  seriesTimeText: {
    color: colors.black,
    fontSize: 14,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  topic: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 5,
    marginVertical: 8,
    overflow: 'hidden',
    width: Dimensions.get('window').width - 40,
  },
});

export default QuizzesScreen;
