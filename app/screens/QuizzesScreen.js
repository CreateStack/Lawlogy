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

import AuthContext from '../auth/context';
import colors from '../config/colors';
import Separator from '../components/Separator';
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
      setData({});
      setLoading(false);
    });
};

function QuizzesScreen(props) {
  const {user} = useContext(AuthContext);
  let quizzes = Object.keys(props.route.params.quizzes);
  if (quizzes.length) {
    quizzes = quizzes.sort((a, b) => {
      a = parseInt(a.replace(/^\D+/g, ''));
      b = parseInt(b.replace(/^\D+/g, ''));
      return a - b;
    });
  }
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData('quizzes/' + props.route.params.name, user, setLoading, setData);
  }, []);
  const renderItem = ({item, index}) => {
    const total = props.route.params.quizzes[item].filter(
      (ques) => ques,
    ).length;
    return (
      <View key={index} style={styles.topic}>
        <Text key={index} style={styles.text}>
          {item.toUpperCase()}
        </Text>
        <Separator
          dashColor={colors.primary}
          style={styles.separator}
          dashThickness={1.1}
          dashGap={2}
        />
        <View style={styles.quizOptionsView}>
          <Text style={{color: colors.black, fontSize: 16, fontWeight: 'bold'}}>
            {'Score: ' +
              _.get(data, item.toUpperCase().trim() + '.score', 'N_A') +
              '/' +
              total}
          </Text>
          {_.get(data, item.toUpperCase().trim() + '.completed', false) ? (
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor: colors.danger,
                borderColor: colors.danger,
              }}
              onPress={() => {
                props.navigation.navigate('Quiz', {
                  quiz: props.route.params.quizzes[item],
                  quizName: item.toUpperCase(),
                  total: total,
                  name: props.route.params.name,
                  data: _.get(data, item.toUpperCase().trim(), {}),
                  view: true,
                });
              }}>
              <Text style={{color: colors.white, fontSize: 14}}>View</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={{
              ...styles.button,
              ...(_.get(data, item.toUpperCase().trim() + '.completed', false)
                ? {
                    borderColor: colors.secondary,
                    backgroundColor: colors.secondary,
                  }
                : {}),
            }}
            onPress={() => {
              props.navigation.navigate('Quiz', {
                quiz: props.route.params.quizzes[item],
                quizName: item.toUpperCase(),
                total: total,
                name: props.route.params.name,
                onGoBack: () =>
                  fetchData(
                    'quizzes/' + props.route.params.name,
                    user,
                    setLoading,
                    setData,
                  ),
              });
            }}>
            <Text style={{color: colors.black, fontSize: 14}}>
              {(_.get(data, item.toUpperCase().trim() + '.completed', false)
                ? 'Re-'
                : '') + 'Take quiz'}
            </Text>
          </TouchableOpacity>
        </View>
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
          onRefresh={() =>
            fetchData(
              'quizzes/' + props.route.params.name,
              user,
              setLoading,
              setData,
            )
          }
          refreshing={loading}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.yellow,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.yellow,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingVertical: 16,
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
  text: {
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
    padding: 16,
    width: Dimensions.get('window').width - 40,
  },
});

export default QuizzesScreen;
