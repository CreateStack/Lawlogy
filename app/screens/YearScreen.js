import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

import colors from '../config/colors';

const OptionButton = ({
  item,
  index,
  params,
  setMainsPapers,
  setShowMainsPapers,
}) => {
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
          setShowMainsPapers(true);
          setMainsPapers(params.quizzes[item].mains);
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
  const [showMainsPapers, setShowMainsPapers] = useState(false);
  const [mainsPapers, setMainsPapers] = useState({});

  const renderItem = ({item, index}) => {
    return (
      <OptionButton
        item={item}
        index={index}
        params={params}
        setMainsPapers={setMainsPapers}
        setShowMainsPapers={setShowMainsPapers}
      />
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(params.quizzes).sort(
          (a, b) => parseInt(a) - parseInt(b),
        )}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={styles.flatlist}
      />
      <Modal
        isVisible={showMainsPapers}
        onBackButtonPress={() => setShowMainsPapers(false)}
        onBackdropPress={() => setShowMainsPapers(false)}>
        <View style={styles.mainsPapers}>
          {Object.keys(mainsPapers)
            .sort((a, b) => -1)
            .map((paper, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setShowMainsPapers(false);
                    Linking.openURL(mainsPapers[paper]);
                  }}
                  style={[
                    styles.paper,
                    index % 2 !== 0 ? styles.evenPaper : {},
                  ]}>
                  <Text
                    style={[
                      styles.paperText,
                      index % 2 !== 0 ? styles.evenPaperText : {},
                    ]}>
                    {'Paper ' + (index + 1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </Modal>
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
  mainsPapers: {
    alignItems: 'center',
    backgroundColor: colors.white,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  paper: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    marginVertical: 8,
  },
  paperText: {
    color: colors.white,
    fontSize: 18,
  },
  evenPaper: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.yellow,
  },
  evenPaperText: {
    color: colors.yellow,
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
