import React, {useState} from 'react';
import {useEffect} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';
import {s, ms, vs} from '../utils/scalingUtils';
import SessionTimer from './SessionTimer';

function Header(props) {
  const [data, setData] = useState({});

  useEffect(() => {
    const params = props.scene.route.params || {};
    const {navigation} = props;
    const {
      disableLeftButton = false,
      title: onlyTitle,
      onFinish,
      onPressBack,
      onPressRightIcon,
      rightIcon,
      leftIcon = 'arrow-left',
      showRightIcon,
      showSessionTimer,
      time,
      timeToChangeStyle,
    } = params;
    setData((v) => ({
      ...v,
      disableLeftButton,
      onFinish,
      onlyTitle,
      navigation,
      onPressBack,
      onPressRightIcon,
      rightIcon,
      leftIcon,
      showRightIcon,
      showSessionTimer,
      time,
      timeToChangeStyle,
    }));
  }, [props]);

  return (
    <View style={styles.container}>
      <View style={styles.detailCont}>
        {!data.disableLeftButton &&
        (data.onPressBack || data.navigation?.canGoBack()) ? (
          <TouchableOpacity
            onPress={() =>
              data.onPressBack ? data.onPressBack() : data.navigation.goBack()
            }
            style={styles.backButtonContainer}>
            <MaterialCommunityIcons
              name={data.leftIcon}
              size={s(22)}
              color={colors.white}
            />
          </TouchableOpacity>
        ) : null}
        <View style={styles.headerTitleContainer}>
          <HeaderTitle {...data} />
        </View>
      </View>
      {data.showRightIcon && (
        <TouchableOpacity
          onPress={data.onPressRightIcon}
          style={styles.rightIconContainer}>
          <MaterialCommunityIcons
            name={data.rightIcon}
            size={24}
            color={colors.white}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const HeaderTitle = ({
  onlyTitle = '',
  showSessionTimer,
  time,
  styleTime,
  styleText,
  onFinish,
  timeToChangeStyle,
  styleTimeChange,
  styleTextChange,
  hideText,
}) => {
  return (
    <View style={styles.headerText}>
      <Text style={styles.titleText}> {onlyTitle}</Text>
      <View style={{marginLeft: 8}}>
        {showSessionTimer && (
          <SessionTimer
            time={time}
            styleTime={styleTime}
            styleText={styleText}
            onFinish={onFinish}
            timeToChangeStyle={timeToChangeStyle}
            styleTimeChange={styleTimeChange}
            styleTextChange={styleTextChange}
            hideText={hideText}
          />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  backButtonContainer: {
    height: Platform.OS === 'android' ? vs(47) : vs(37),
    justifyContent: 'center',
    alignItems: 'flex-start',
    left: s(16),
    position: 'absolute',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: Platform.OS === 'android' ? vs(47) : vs(37),
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: colors.primary,
  },
  detailCont: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    height: Platform.OS === 'android' ? vs(47) : vs(37),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  rightIconContainer: {
    height: Platform.OS === 'android' ? vs(47) : vs(37),
    justifyContent: 'center',
    alignItems: 'flex-end',
    right: s(16),
    position: 'absolute',
  },
  titleText: {
    color: colors.white,
    fontSize: ms(18),
    lineHeight: vs(24),
  },
  headerText: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: s(8),
  },
});

export default Header;
