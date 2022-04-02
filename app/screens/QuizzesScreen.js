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
  let quizzes = Object.keys(props.route.params.quizzes);
  if (quizzes.length) {
    quizzes = quizzes.sort((a, b) => {
      a = parseInt(testSeries ? a.split('-')[1] : a.replace(/^\D+/g, ''));
      b = parseInt(testSeries ? b.split('-')[1] : b.replace(/^\D+/g, ''));
      return a - b;
    });
  }
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(fetchPath, user, setLoading, setData);
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

  const renderItem = ({item, index}) => {
    const questions = getQuiz(props.route.params.quizzes[item]);
    const total = questions.filter((ques) => ques).length;
    const testCompletionData = _.get(
      data,
      testSeries ? item : item.toUpperCase().trim(),
      {},
    );
    const score = _.get(testCompletionData, 'score', 'N_A');
    const completed = _.get(testCompletionData, 'completed', false);
    return (
      <View key={index} style={styles.topic}>
        <View
          style={[
            styles.seriesTime,
            {backgroundColor: colors.blue, paddingVertical: 8},
          ]}>
          <Text key={index} style={styles.text}>
            {item.toUpperCase()}
          </Text>
        </View>
        <View style={{paddingHorizontal: 16, paddingVertical: 24}}>
          <View style={styles.quizOptionsView}>
            <Text
              style={{color: colors.black, fontSize: 16, fontWeight: 'bold'}}>
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
                <Text style={{color: colors.white, fontSize: 14}}>View</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={{
                ...styles.button,
                ...(completed
                  ? {
                      borderColor: colors.secondary,
                      backgroundColor: colors.secondary,
                    }
                  : {}),
              }}
              onPress={() => {
                props.navigation.navigate(
                  testSeries ? 'PrelimsTestSeries' : 'Quiz',
                  {
                    attempts: props.route.params.extraInfoData[item]?.attempts,
                    name: item,
                    onPressRightIcon: () =>
                      props.navigation.navigate('LeaderBoard', {
                        state: props.route.params.name,
                        quiz: item,
                      }),
                    quiz: getQuiz(props.route.params.quizzes[item]),
                    quizzes: props.route.params.quizzes[item],
                    quizName: item.toUpperCase(),
                    rightIcon: 'podium',
                    showRightIcon: testSeries ? true : false,
                    total: total,
                    state: props.route.params.name,
                    onGoBack: () => {
                      console.log('fetching: ', fetchPath);
                      fetchData(fetchPath, user, setLoading, setData);
                    },
                  },
                );
              }}>
              <Text style={{color: colors.black, fontSize: 14}}>
                {(completed ? 'Re-' : '') +
                  (testSeries ? 'Attempt Series' : 'Take Quiz')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {testSeries && (
          <View style={styles.seriesTime}>
            <Text style={styles.seriesTimeText}>
              {props.route.params.quizzes[item].testTime + ' hours'}
            </Text>
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
          ListFooterComponent={() => (
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Purchase')}
              style={{
                width: '100%',
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: colors.secondary,
              }}>
              <Text style={{color: colors.black, fontSize: 14, lineHeight: 21}}>
                Purchase full course
              </Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={headerItem}
          ListHeaderComponentStyle={{width: '100%'}}
          renderItem={renderItem}
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
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    fontSize: 14,
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
  seriesTime: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: 16,
    width: '100%',
  },
  seriesTimeText: {
    color: colors.white,
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
