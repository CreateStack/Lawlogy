import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import crashlytics from '@react-native-firebase/crashlytics';
import _ from 'lodash';

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
    .then(snapshot => {
      setData(snapshot.val() || {});
      setLoading(false);
    })
    .catch(e => {
      console.log('Error while fetching: ', e);
      crashlytics().log('Error while fetching: ', e);
      setData({});
      setLoading(false);
    });
};

const LeaderBoardScreen = ({route: {params}}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const state = params.state.trim();
  const quiz = params.quiz.trim();
  useEffect(() => {
    const rankStudents = (students = {}) => {
      const keys = Object.keys(students);
      const board = [];
      keys.forEach(student => {
        let info = null;
        if (students[student].prelimsTestSeries?.[state]) {
          info = students[student].prelimsTestSeries[state][quiz];
        }
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
      setData(board.sort((a, b) => b.score - a.score));
    };
    fetchData('/student/', setLoading, rankStudents);
  }, [quiz, state]);

  const getName = (name = '') => {
    name = name.trim().split(' ');
    name =
      name[0].replace(/\w+/g, _.capitalize) +
      ' ' +
      (name.length > 1 ? name[name.length - 1] : '').replace(
        /\w+/g,
        _.capitalize,
      );
    return name;
  };

  const getRank = index => {
    let color = colors.gold;
    switch (index) {
      case 0:
        color = colors.gold;
        break;
      case 1:
        color = colors.silver;
        break;
      case 2:
        color = colors.bronze;
        break;
    }
    return index < 3 ? (
      <MaterialCommunityIcons
        name={'medal'}
        color={color}
        size={24}
        style={{...styles.rank, textAlign: 'center'}}
      />
    ) : (
      <Text style={{...styles.rank, textAlign: 'center'}}>{index + 1}</Text>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <View
          style={[
            styles.rankContainer,
            index % 2 === 0 ? {backgroundColor: colors.lightBlue} : {},
          ]}
        >
          {getRank(index)}
          <Text style={styles.name}>{getName(item.name)}</Text>
          <Text style={{...styles.score, textAlign: 'center'}}>
            {item.score}
          </Text>
          <Text style={{...styles.attempts, textAlign: 'center'}}>
            {item.attempts}
          </Text>
        </View>
        <Separator dashColor={colors.greyLight} dashThickness={2} />
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
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
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
    backgroundColor: colors.yellow,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  attempts: {
    flex: 0.3,
    textAlign: 'center',
  },
  name: {
    flex: 0.4,
    textAlign: 'left',
  },
  rank: {
    flex: 0.15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  score: {
    flex: 0.15,
    textAlign: 'center',
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
