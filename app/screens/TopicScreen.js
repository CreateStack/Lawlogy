import React from 'react';
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

import colors from '../config/colors';

function TopicScreen({navigation, route}) {
  const {params} = route;
  const items = Object.keys(params.items);
  const renderItem = ({item, index}) => {
    const noOfItems = Object.keys(params.items[item]).length;
    return (
      <TouchableOpacity
        key={index}
        style={styles.topic}
        onPress={() =>
          navigation.navigate(params.navigateToScreen, {
            quizzes: params.items[item],
            name: item,
          })
        }>
        <Image source={params.image} style={styles.imageBackground} />
        <Text key={index} style={styles.text}>
          {_.startCase(_.toLower(item))}
        </Text>

        <View style={styles.extraInfo}>
          <Text style={styles.extraInfoText}>
            {(noOfItems || 0) + ' ' + params.itemName}
          </Text>
        </View>
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
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    position: 'absolute',
    top: 0,
    right: 0,
    borderBottomLeftRadius: 10,
  },
  extraInfoText: {
    fontSize: 14,
    color: colors.white,
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
    paddingVertical: 10,
    width: Dimensions.get('window').width - 40,
  },
});

export default TopicScreen;
