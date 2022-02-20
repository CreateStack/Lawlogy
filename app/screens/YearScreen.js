import React, {useState} from 'react';
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

const OptionButton = ({item, index, params}) => {
  const [showOptions, setShowOptions] = useState(false);
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
          Linking.openURL(params.quizzes[item].prelims);
        }}>
        <Text key={index} style={{...styles.text, color: colors.white}}>
          Preliminary
        </Text>
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
          Linking.openURL(params.quizzes[item].mains);
        }}>
        <Text key={index} style={styles.text}>
          Mains
        </Text>
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
        {item}
      </Text>
    </TouchableOpacity>
  );
};

const YearScreen = ({route, navigation}) => {
  const {params} = route;
  navigation.setOptions({
    headerTitle: headerTitleCreater(params.name.toUpperCase()),
  });

  const renderItem = ({item, index}) => {
    return <OptionButton item={item} index={index} params={params} />;
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(params.quizzes).sort()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
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
    color: colors.black,
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
    width: '100%',
  },
});

export default YearScreen;
