import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Text,
} from 'react-native';

import colors from '../config/colors';

const windowWidth = Dimensions.get('window').width - 32;

function Card({
  accessible,
  alignItems = 'center',
  handlePress,
  imageUrl,
  justifyContent = 'center',
  text,
  textColor = colors.black,
  textSize = 16,
  width = windowWidth,
}) {
  return imageUrl ? (
    <View
      accessible={accessible}
      testID={'Hero_Banner_Card'}
      style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          if (handlePress) {
            handlePress();
          }
        }}>
        <ImageBackground
          testID={'image'}
          resizeMode={'cover'}
          source={{uri: imageUrl}}
          style={{
            flex: 1,
            width,
            alignItems,
            justifyContent,
          }}>
          <Text
            style={{
              ...styles.text,
              color: textColor,
              fontSize: parseInt(textSize),
            }}>
            {text}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  ) : null;
}

function Banner({
  height = 150,
  data = [],
  timer,
  handlePress = null,
  activeIndicatorColor = colors.yellow,
  accessible = true,
  didScroll = null,
}) {
  const scrollRef = useRef(null);
  const [selectedBanner, setSelectedBanner] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const validBanner = useCallback(() => {
    return (
      data.length > 0 && selectedBanner >= 0 && selectedBanner < data.length
    );
  }, [data, selectedBanner]);

  const onChangeSlider = ({nativeEvent}) => {
    if (isUserInteracting) {
      const active = Math.floor(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (active >= 0 && active < data.length) {
        setSelectedBanner(active);
      }
      setIsUserInteracting(false);
    }
  };

  useEffect(() => {
    let bannerTimer;
    const nextSlide = () => {
      setSelectedBanner((prevState) => {
        return prevState === data.length - 1 ? 0 : prevState + 1;
      });
    };
    if (timer) {
      bannerTimer = setInterval(() => {
        if (isUserInteracting) {
          clearInterval(bannerTimer);
          return;
        }
        nextSlide();
      }, timer);
    }
    return () => {
      clearInterval(bannerTimer);
    };
  }, [data.length, isUserInteracting, timer]);

  useEffect(() => {
    if (scrollRef?.current && validBanner()) {
      scrollRef.current.scrollToIndex({
        animated: true,
        index: selectedBanner,
      });
    }
    if (didScroll && validBanner()) {
      didScroll(data[selectedBanner]);
    }
  }, [data, didScroll, selectedBanner, validBanner]);

  const renderItem = useCallback(
    ({item}, index) => {
      const onHandlePress = (bannerData) => {
        if (handlePress) {
          handlePress(bannerData);
        }
      };
      return (
        <Card
          alignItems={item.alignItems || 'center'}
          justifyContent={item.justifyContent || 'center'}
          key={index}
          imageUrl={item.imageUrl}
          text={item.text || ''}
          textColor={item.textColor || colors.white}
          textSize={item.textSize || 16}
          handlePress={() => onHandlePress(item)}
          width={windowWidth}
        />
      );
    },
    [handlePress],
  );
  return data?.length > 0 ? (
    <View
      testID={'banner'}
      accessible={accessible}
      style={{...styles.container, height, width: windowWidth}}
      height={height}
      width={windowWidth}>
      <FlatList
        testID={'flat_list'}
        getItemLayout={(item, index) => ({
          length: windowWidth,
          offset: windowWidth * index,
          index,
        })}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.scrollViewStyles}
        ref={scrollRef}
        data={data}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => {
          setIsUserInteracting(true);
        }}
        onMomentumScrollEnd={onChangeSlider}
      />
      {data.length > 1 && (
        <View style={styles.wrapperIndicator}>
          {data.map((_, i) => {
            const isActive = i === selectedBanner;
            return (
              <View
                key={i}
                style={{
                  ...styles.indicator,
                  borderColor: isActive ? activeIndicatorColor : colors.white,
                  opacity: isActive ? 1 : 0.5,
                }}
              />
            );
          })}
        </View>
      )}
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    marginRight: 8,
    borderWidth: 4,
    borderRadius: 4,
    borderStyle: 'solid',
    height: 8,
    width: 8,
    backgroundColor: 'transparent',
  },
  scrollViewStyles: {
    flex: 1,
    backgroundColor: colors.silver,
  },
  text: {
    fontWeight: 'bold',
  },
  wrapperIndicator: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
  },
});

export default Banner;
