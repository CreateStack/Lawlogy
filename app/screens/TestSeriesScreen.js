import React, {useContext, useState} from 'react';
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

import colors from '../config/colors';
import AuthContext from '../auth/context';
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

function TopicScreen({navigation, route}) {
  const {user} = useContext(AuthContext);
  const {params} = route;
  const [loading, setLoading] = useState(false);
  let items = Object.keys(params.items);
  if (items.length) {
    items = items.sort((a, b) => {
      return a.normalize().localeCompare(b.normalize());
    });
  }

  const StateButton = ({item, index}) => {
    const [showOptions, setShowOptions] = useState(false);
    const noOfMains = Object.values(params.items[item].mains || {}).filter(
      (item) => item !== null,
    ).length;
    const noOfPrelims = Object.values(params.items[item].prelims || {}).filter(
      (item) => item !== null,
    ).length;
    return showOptions ? (
      <View style={styles.topic}>
        <TouchableOpacity
          key={index + 'prelims'}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 16,
            width: '50%',
          }}
          onPress={() => {
            const setData = (data) => {
              console.log('data: ', data);
              navigation.navigate('Topics', {
                extraInfoData: data,
                itemName: 'Tests',
                items: params.items[item].prelims,
                navigateToScreen: 'PrelimsTestSeries',
                data: {
                  rightIcon: 'podium',
                  showRightIcon: true,
                  state: item,
                },
                showExtraInfo: true,
                title: 'Tests',
              });
            };
            fetchData('prelimsTestSeries/' + item, user, setLoading, setData);
            console.log(params.items[item].prelims);
          }}>
          <Text key={index} style={{...styles.text, color: colors.white}}>
            Preliminary
          </Text>
          <View
            style={[
              styles.extraInfo,
              {
                backgroundColor: colors.yellow,
                borderBottomRightRadius: 10,
                left: 0,
              },
            ]}>
            <Text style={styles.extraInfoText}>
              {(noOfPrelims || 0) + ' Test' + (noOfPrelims > 1 ? 's' : '')}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          key={index + 'mains'}
          style={{
            backgroundColor: colors.yellow,
            paddingHorizontal: 16,
            paddingVertical: 16,
            width: '50%',
          }}
          onPress={() => {
            navigation.navigate('Topics', {
              itemName: 'Tests',
              items: params.items[item].mains,
              navigateToScreen: 'MainsTestSeries',
              showExtraInfo: false,
              title: 'Tests',
            }),
              console.log(params.items[item].mains);
          }}>
          <Text key={index} style={styles.text}>
            Mains
          </Text>
          <View
            style={[
              styles.extraInfo,
              {
                backgroundColor: colors.primary,
                borderBottomLeftRadius: 10,
                right: 0,
              },
            ]}>
            <Text style={[styles.extraInfoText, {color: colors.white}]}>
              {(noOfMains || 0) + ' Test' + (noOfMains > 1 ? 's' : '')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity
        key={index}
        style={{...styles.topic, paddingHorizontal: 16, paddingVertical: 16}}
        onPress={() => {
          setShowOptions(true);
          setTimeout(() => {
            setShowOptions(false);
          }, 5000);
        }}>
        <Text key={index} style={styles.text}>
          {_.startCase(_.toLower(item))}
        </Text>
      </TouchableOpacity>
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
  imageBackground: {
    height: 62,
    width: '20%',
    borderWidth: 2,
    borderColor: colors.secondary,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  text: {
    color: colors.black,
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 16,
    marginLeft: 4,
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
});

export default TopicScreen;
