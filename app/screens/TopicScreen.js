import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../config/colors';

function TopicScreen(props) {
  const quizzes = Object.keys(props.route.params.quizzes);
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.topic}
        onPress={() =>
          props.navigation.navigate('Quizzes', {
            quizzes: props.route.params.quizzes[item],
            name: item,
          })
        }>
        <Text key={index} style={styles.text}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={quizzes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={styles.flatlist}
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
  flatlist: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  topic: {
    padding: 16,
    width: Dimensions.get('window').width - 40,
    elevation: 5,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.light,
    overflow: 'hidden',
  },
});

export default TopicScreen;
