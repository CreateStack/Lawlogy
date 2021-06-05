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

function QuizzesScreen(props) {
  const quizzes = Object.keys(props.route.params.quizzes);
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity key={index} style={styles.topic}>
        <Text key={index} style={styles.text}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };
  const headetItem = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{props.route.params.name}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={quizzes}
        ListHeaderComponent={headetItem}
        ListHeaderComponentStyle={{width: '100%'}}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={styles.flatlist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    padding: 16,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    width: '100%',
  },
  headerText: {
    fontSize: 20,
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

export default QuizzesScreen;
