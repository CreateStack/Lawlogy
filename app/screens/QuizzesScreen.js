import React, {useContext, useEffect, useState} from 'react';
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
  setLoading(true);
  database()
    .ref(ref)
    .once('value')
    .then((snapshot) => {
      setData(snapshot.val() || {});
      setLoading(false);
    })
    .catch((e) => {
      console.log('Error while fetching: ', e);
      crashlytics().log('Error while fetching: ', e);
      setData({});
      setLoading(false);
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
      a = parseInt(testSeries ? a.split('-')[1] : a.replace(/^\D+/g, ''));
      b = parseInt(testSeries ? b.split('-')[1] : b.replace(/^\D+/g, ''));
      return a - b;
    });
  }
  const premium = props.route.params.premium;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [studentPremium, setStudentPremium] = useState(false);

  useEffect(() => {
    fetchData(fetchPath, user, setLoading, setData);
    fetchData(premiumPath, user, setLoading, (value) => {
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
  }, []);

  const getQuiz = (quiz) => {
    if (testSeries) {
      quiz = quiz.questions;
      if (quiz.length === undefined) {
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
    const total = questions.filter((ques) => ques).length;
    const testCompletionData = _.get(
      data,
      testSeries ? item : item.toUpperCase().trim(),
      {},
    );
    const score = _.get(testCompletionData, 'score', 'N_A');
    const completed = _.get(testCompletionData, 'completed', false);
    const [locked, setLocked] = useState(true);
    useEffect(() => {
      decideText(index, setLocked);
    }, []);
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
        <View style={{paddingHorizontal: 16, paddingVertical: 24}}>
          <View style={styles.quizOptionsView}>
            <Text
              style={{
                color: colors.black,
                fontSize: ms(14),
                fontWeight: 'bold',
              }}>
              {'Score: ' + score + '/' + total}
            </Text>
            {completed ? (
              <TouchableOpacity
                style={{
                  ...styles.button,
                  backgroundColor: colors.danger,
                  borderColor: colors.danger,
                }}
                onPress={() => {
                  props.navigation.navigate('Quiz', {
                    quiz: getQuiz(props.route.params.quizzes[item]),
                    quizName: item.toUpperCase(),
                    total: total,
                    name: props.route.params.name,
                    data: testCompletionData,
                    view: true,
                  });
                }}>
                <Text style={{color: colors.white, fontSize: ms(12)}}>
                  View
                </Text>
              </TouchableOpacity>
            ) : null}

            {testSeries && (
              <Text
                style={{
                  color: colors.black,
                  fontSize: ms(14),
                  fontWeight: 'bold',
                }}>
                {'⌛ ' + props.route.params.quizzes[item].testTime + ' hours'}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('LeaderBoard', {
                state: props.route.params.name,
                quiz: item,
              });
            }}
            style={styles.ledaerboard}>
            <Text style={styles.ledaerboardText}>Leaderboard 🥇</Text>
          </TouchableOpacity>
          {testSeries && (
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
                        total: total,
                        state: props.route.params.name,
                        onGoBack: () => {
                          console.log('fetching: ', fetchPath);
                          fetchData(fetchPath, user, setLoading, setData);
                        },
                      },
                    );
              }}
              style={{
                ...styles.attempt,
                ...(completed
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
          )}
        </View>
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
          {_.startCase(_.toLower(props.route.params.name))}
        </Text>
      </View>
    );
  };
  return (
    <>
      <ActivityIndicator visible={loading} />
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
          refreshing={loading}
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
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 3,
    paddingHorizontal: 16,
    marginLeft: 2,
    width: '100%',
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
