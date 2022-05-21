import React, {useContext, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';
import database from '@react-native-firebase/database';
import crashlytics from '@react-native-firebase/crashlytics';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../config/colors';
import AuthContext from '../auth/context';
import ActivityIndicator from '../components/ActivityIndicator';
import {vs} from '../utils/scalingUtils';
import Separator from '../components/Separator';

const fetchData = (path, phone, setLoading, setData) => {
  const ref = ('/student/' + phone + '/' + path).trim();
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
      crashlytics().log('Error while fetching in TestSeriesScreen: ', e);
      setData({});
      setLoading(false);
    });
};

function TopicScreen({navigation, route}) {
  const {user} = useContext(AuthContext);
  const {params} = route;
  const [loading, setLoading] = useState(false);
  let items = Object.keys(params.items);
  if (items.length) {
    items = items.sort((a, b) => {
      return a.normalize().localeCompare(b.normalize()); //alphabetically arranged confirm how to sort
    });
  }

  const StateButton = ({item, index}) => {
    const prelimsFlyerInfo = params.items[item].prelimsFlyer || {};
    const mainsFlyerInfo = params.items[item].mainsFlyer || {};

    const Flyer = ({flyerInfo, onPress}) => {
      const [width, setWidth] = useState(0);
      return (
        <TouchableOpacity
          style={styles.topic}
          onPress={onPress}
          onLayout={({nativeEvent}) => {
            const {width} = nativeEvent.layout;
            setWidth(width);
          }}
        >
          <LinearGradient colors={['#CCCCFF', '#fff']} style={styles.gradient}>
            {flyerInfo.image ? (
              <Image
                source={{uri: flyerInfo.image}}
                style={styles.flyerImage}
              />
            ) : null}
            <Text key={index} style={{...styles.flyerTitle, width: width - 64}}>
              {flyerInfo.title}
            </Text>
            <View style={styles.testNumberContainer}>
              <Text style={styles.testNumber}>
                {flyerInfo.testNumber?.split('|')[0] +
                  (flyerInfo.testNumber?.split('|')[1] ? ' | ' : '')}
              </Text>
              <Text style={styles.freeTestNumber}>
                {flyerInfo.testNumber?.split('|')[1]}
              </Text>
            </View>
            <View style={styles.testsInfo}>
              {Object.values(flyerInfo.info || {})
                .filter(v => v)
                .map((info, index) => {
                  return (
                    <Text key={index.toString()} style={styles.info}>
                      {info}
                    </Text>
                  );
                })}
            </View>
            <Separator style={styles.separator} dashColor={colors.silver} />
            <TouchableOpacity onPress={onPress} style={styles.view}>
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      );
    };

    return (
      <>
        {params.items[item].prelims ? (
          <Flyer
            flyerInfo={prelimsFlyerInfo}
            key={index.toString() + ' prelims'}
            onPress={() => {
              const setData = data => {
                navigation.navigate('Quizzes', {
                  extraInfoData: data,
                  itemName: 'Tests',
                  heading: prelimsFlyerInfo.title,
                  name: item,
                  navigateToScreen: 'PrelimsTestSeries',
                  premium: params.premium,
                  quizzes: params.items[item].prelims,
                  showExtraInfo: true,
                  testSeries: true,
                  title: 'Tests',
                });
              };
              fetchData('prelimsTestSeries/' + item, user, setLoading, setData);
            }}
          />
        ) : null}
        {params.items[item].mains ? (
          <Flyer
            flyerInfo={mainsFlyerInfo}
            key={index + 'mains'}
            onPress={() => {
              navigation.navigate('Topics', {
                itemName: 'Tests',
                items: params.items[item].mains,
                navigateToScreen: 'MainsTestSeries',
                showExtraInfo: false,
                title: 'Tests',
              }),
                console.log(params.items[item].mains);
            }}
          />
        ) : null}
      </>
    );
  };

  const renderItem = ({item, index}) => {
    return <StateButton item={item} index={index} />;
  };
  return (
    <>
      <ActivityIndicator visible={loading} />
      <View style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          style={styles.flatlist}
          contentContainerStyle={{alignItems: 'center'}}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  extraInfo: {
    paddingHorizontal: 8,
    paddingVertical: 1,
    position: 'absolute',
    top: 0,
  },
  extraInfoText: {
    fontSize: 12,
    color: colors.black,
  },
  flatlist: {
    paddingHorizontal: 16,
    width: '100%',
  },
  flyerImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  flyerTitle: {
    color: colors.black,
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 18,
    fontWeight: 'bold',
  },
  freeTestNumber: {
    color: colors.green,
    fontSize: 18,
    fontWeight: 'bold',
  },
  gradient: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  imageBackground: {
    height: 62,
    width: '20%',
    borderWidth: 2,
    borderColor: colors.secondary,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  info: {
    color: colors.greyDark,
    fontSize: 14,
  },
  separator: {
    marginVertical: 16,
    width: '100%',
  },
  testsInfo: {
    marginTop: vs(12),
  },
  testNumber: {
    color: colors.black,
    fontSize: 18,
  },
  testNumberContainer: {
    flexDirection: 'row',
  },
  topic: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 5,
    flexDirection: 'row',
    marginVertical: 8,
    overflow: 'hidden',
    width: Dimensions.get('window').width - 40,
  },
  view: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  viewText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TopicScreen;
