import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import database from '@react-native-firebase/database';
import ActivityIndicator from '../components/ActivityIndicator';
import colors from '../config/colors';

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

const LeaderBoardScreen = (props) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const rankStudents = (stundents = {}) => {
    const keys = Object.keys(stundents);
    keys.forEach((student) => {});
  };

  /* useEffect(() => {
    fetchData('/students/', setLoading, setData);
  }, []); */

  const renderItem = ({item, index}) => {};

  return (
    <>
      <ActivityIndicator visible={loading} />
      <View style={styles.container}>
        <FlatList data={data} renderItem={renderItem} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});

export default LeaderBoardScreen;
