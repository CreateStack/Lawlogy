import React from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import colors from '../config/colors';
import {headerTitleCreater} from '../navigation/AppNavigator';

const YearScreen = ({route, navigation}) => {
  const {params} = route;
  navigation.setOptions({headerTitle: headerTitleCreater(params.name)});

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.topic}
        onPress={() => {
          Linking.openURL(params.quizzes[item]);
        }}>
        <Text key={index} style={styles.text}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        columnWrapperStyle={{justifyContent: 'space-between'}}
        data={Object.keys(params.quizzes).sort()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={2}
        style={styles.flatlist}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flatlist: {
    paddingHorizontal: 16,
    marginVertical: 16,
    width: '100%',
  },
  pdf: {
    flex: 1,
  },
  text: {
    color: colors.primary,
    flex: 1,
    fontSize: 16,
    marginLeft: 4,
    textAlign: 'center',
  },
  topic: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '46%',
  },
});

export default YearScreen;
