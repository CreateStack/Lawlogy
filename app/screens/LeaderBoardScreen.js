import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import database from '@react-native-firebase/database';
import ActivityIndicator from '../components/ActivityIndicator';
import colors from '../config/colors';
import Separator from '../components/Separator';

const fetchData = (path, setLoading, setData) => {
  const ref = path.trim();
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
      setData({});
      setLoading(false);
    });
};

const LeaderBoardScreen = ({route: {params}}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const state = params.state.trim();
  const quiz = params.quiz.trim();
  const rankStudents = (students = {}) => {
    const keys = Object.keys(students);
    const board = [];
    keys.forEach((student) => {
      let info = null;
      if (students[student].prelimsTestSeries)
        info = students[student].prelimsTestSeries[state][quiz];
      const score = info?.score;
      const attempts = info?.attempts;
      if (score !== undefined && score !== null) {
        const final = {
          name: students[student].name,
          score: score,
          attempts: attempts,
        };
        console.log('final: ', final);
        board.push(final);
      } else {
        return;
      }
    });
    setData(board.sort((a, b) => a.score - b.score));
  };

  useEffect(() => {
    fetchData('/student/', setLoading, rankStudents);
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <>
        <View
          style={[
            styles.rankContainer,
            index % 2 === 0 ? {backgroundColor: colors.lightBlue} : {},
          ]}>
          <Text style={{...styles.rank, textAlign: 'center'}}>{index + 1}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={{...styles.score, textAlign: 'right'}}>
            {item.score}
          </Text>
          <Text style={{...styles.attempts, textAlign: 'right'}}>
            {item.attempts}
          </Text>
        </View>
        <Separator dashColor={colors.greyLight} />
      </>
    );
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.rank, styles.bold]}>Rank</Text>
          <Text style={[styles.name, styles.bold]}>Name</Text>
          <Text style={[styles.score, styles.bold]}>Score</Text>
          <Text style={[styles.attempts, styles.bold]}>Attempts</Text>
        </View>
        <Separator dashColor={colors.black} style={{width: '99%'}} />
        <FlatList data={data} renderItem={renderItem} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  header: {
    backgroundColor: colors.greyDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  attempts: {
    flex: 0.2,
    textAlign: 'left',
  },
  name: {
    flex: 0.5,
    textAlign: 'left',
  },
  rank: {
    flex: 0.15,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  score: {
    flex: 0.15,
    textAlign: 'left',
  },
  rankContainer: {
    alignItems: 'center',
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
});

export default LeaderBoardScreen;
