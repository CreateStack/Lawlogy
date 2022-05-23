import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';

import colors from '../config/colors';
import {ms} from '../utils/scalingUtils';

function TopicScreen({navigation, route}) {
  const {params} = route;
  console.log('Params: ', params);
  let items = Object.keys(params.items || {});
  if (items.length) {
    items = items.sort((a, b) => {
      return a.normalize().localeCompare(b.normalize());
    });
  }
  const renderItem = ({item, index}) => {
    const noOfItems = Object.values(params.items[item]).filter(
      item => item !== null,
    ).length;
    return (
      <TouchableOpacity
        key={index}
        style={styles.topic}
        onPress={() =>
          navigation.navigate(params.navigateToScreen, {
            attempts: params.extraInfoData
              ? params.extraInfoData[item]?.attempts || 0
              : null,
            ...(params.data || {}),
            name: item,
            onPressRightIcon: () =>
              navigation.navigate('LeaderBoard', {
                state: params.data?.state,
                quiz: item,
              }),
            premium: params.premium,
            quizzes: params.items[item],
            title: (params.passTitle ? item : params.itemName)
              .replace(/\w+/g, _.lowerCase)
              .replace(/\w+/g, _.startCase),
          })
        }>
        {/* <Image source={params.image} style={styles.imageBackground} /> */}
        <Text key={index} style={styles.text}>
          {item.replace(/\w+/g, _.lowerCase).replace(/\w+/g, _.startCase)}
        </Text>
        {params.showExtraInfo && (
          <View style={styles.extraInfo}>
            <Text style={styles.extraInfoText}>
              {params.extraInfoData
                ? (params.extraInfoData[item]?.attempts || 0) + ' Attempts'
                : (noOfItems || 0) +
                  ' ' +
                  params.itemName +
                  (noOfItems > 1 ? 's' : '')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={styles.flatlist}
        contentContainerStyle={{alignItems: 'center'}}
      />
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: Dimensions.get('window').width - 40,
  },
});

export default TopicScreen;
