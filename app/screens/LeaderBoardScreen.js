import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';

import ActivityIndicator from '../components/ActivityIndicator';
import colors from '../config/colors';
import Separator from '../components/Separator';
import {rankStudents} from '../utils/helpers';
import AuthContext from '../auth/context';

const LeaderBoardScreen = ({route: {params}}) => {
  const {user} = useContext(AuthContext);
  const [data, setData] = useState({});
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const state = params.state.trim();
  const quiz = params.quiz.trim();
  const testSeries = params.testSeries;
  useEffect(() => {
    rankStudents(
      testSeries ? quiz : quiz.toUpperCase(),
      state,
      setLoading,
      (ranks, username) => {
        setData(ranks);
        setUsername(username);
      },
      '/student/',
      user,
      testSeries ? 'prelimsTestSeries' : 'quizzes',
    );
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

  const getRank = (index, isUser) => {
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
        style={{
          ...styles.rank,
          color,
          textAlign: 'center',
          ...(isUser ? {fontWeight: 'bold'} : {}),
        }}
      />
    ) : (
      <Text
        style={{
          ...styles.rank,
          textAlign: 'center',
          ...(isUser ? styles.bold : {}),
        }}>
        {index + 1}
      </Text>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <View
          style={[
            styles.rankContainer,
            index % 2 === 0 ? {backgroundColor: colors.lightBlue} : {},
          ]}>
          {getRank(index, item.name === username)}
          <Text
            style={[styles.name, item.name === username ? styles.bold : {}]}>
            {getName(item.name)}
          </Text>
          <Text
            style={{
              ...styles.score,
              textAlign: 'center',
              ...(item.name === username ? styles.bold : {}),
            }}>
            {item.score}
          </Text>
          <Text
            style={{
              ...styles.attempts,
              textAlign: 'center',
              ...(item.name === username ? styles.bold : {}),
            }}>
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
    color: colors.black,
    flex: 0.3,
    textAlign: 'center',
  },
  name: {
    color: colors.black,
    flex: 0.4,
    textAlign: 'left',
  },
  rank: {
    color: colors.black,
    flex: 0.15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  score: {
    color: colors.black,
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
