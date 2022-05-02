import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  Text,
} from 'react-native';

import colors from '../config/colors';

const {width: windowWidth} = Dimensions.get('window');

function Card({
  imageUrl,
  width = windowWidth,
  handlePress,
  accessible,
  text,
  textColor = colors.black,
  textSize = 16,
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
          source={{uri: imageUrl}}
          style={{
            flex: 1,
            width,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{...styles.text, color: textColor, fontSize: textSize}}>
            {text}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  ) : null;
}

function Banner({
  height = 100,
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

  const nextSlide = () => {
    setSelectedBanner((prevState) => {
      return prevState === data.length - 1 ? 0 : prevState + 1;
    });
  };

  const validBanner = () => {
    return (
      data.length > 0 && selectedBanner >= 0 && selectedBanner < data.length
    );
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserInteracting]);

  const onHandlePress = (bannerData) => {
    if (handlePress) {
      handlePress(bannerData);
    }
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBanner]);

  return data?.length > 0 ? (
    <View
      testID={'hero_banner'}
      accessible={accessible}
      style={{...styles.container, height, width: windowWidth}}
      height={height}
      width={windowWidth}>
      <FlatList
        testID={'flat_list'}
        initialScrollIndex={selectedBanner}
        getItemLayout={(item, index) => ({
          length: windowWidth,
          offset: windowWidth * index,
          index,
        })}
        renderItem={({item}, index) => (
          <Card
            key={index}
            imageUrl={item.imageUrl}
            height={item.height}
            text={item.text}
            textColor={item.textColor}
            textSize={item.textSize}
            handlePress={() => onHandlePress(item)}
            width={windowWidth}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
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
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
