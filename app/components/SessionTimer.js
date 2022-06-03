import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../config/colors';

function SessionTimer({
  time,
  styleTime = {color: colors.green, fontSize: 16, fontWeight: 'bold'},
  styleText = {color: colors.green, fontSize: 16, fontWeight: 'bold'},
  onFinish,
  timeToChangeStyle,
  styleTimeChange = {color: colors.redText, fontSize: 16, fontWeight: 'bold'},
  styleTextChange = {color: colors.redText, fontSize: 16, fontWeight: 'bold'},
  hideText,
}) {
  const [changeStyle, setChangeStyle] = useState(false);
  const [timeLeft, setTimeLeft] = useState(time);
  const [hoursValue, setHours] = useState('00');
  const [minutesValue, setMinutes] = useState('00');
  const [secondsValue, setSeconds] = useState('00');
  const [lastCheck, setLastChek] = useState(new Date().getTime());
  useEffect(() => {
    if (timeLeft < 0) {
      onFinish();
      return;
    }
    if (timeLeft <= timeToChangeStyle && !hideText) {
      setChangeStyle(true);
    }
    const timerCount = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.floor((now - lastCheck) / 1000);
      if (diff >= 2) {
        setTimeLeft(preTimeLeft => preTimeLeft - diff);
      } else {
        setTimeLeft(preTimeLeft => preTimeLeft - 1);
      }
      let {hours, minutes, seconds} = convertTimerToString(
        timeLeft,
        setLastChek,
      );
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    }, 1000);
    return () => {
      clearInterval(timerCount);
    };
  }, [timeLeft, onFinish, timeToChangeStyle, hideText, lastCheck]);

  const convertTimerToString = (timeSeconds, setLastChek) => {
    if (timeSeconds > 0) {
      setLastChek(new Date().getTime());
    }
    timeSeconds = Number(timeSeconds);
    const hours = Math.floor(timeSeconds / 3600);
    const minutes = Math.floor((timeSeconds % 3600) / 60);
    const seconds = Math.floor((timeSeconds % 3600) % 60);

    return {
      hours: hours >= 10 ? hours : '0' + hours || '00',
      minutes: minutes >= 10 ? minutes : '0' + minutes || '00',
      seconds: seconds >= 10 ? seconds : '0' + seconds || '00',
    };
  };

  return (
    <View style={styles.wrapper}>
      {(hoursValue >= 0 || hideText) && (
        <>
          <Text style={changeStyle ? styleTimeChange : styleTime}>
            {hoursValue}
          </Text>
          <Text style={changeStyle ? styleTextChange : styleText}>
            {hideText ? ':' : ' hrs '}
          </Text>
        </>
      )}
      {(minutesValue >= 0 || hideText) && (
        <>
          <Text style={changeStyle ? styleTimeChange : styleTime}>
            {minutesValue}
          </Text>
          <Text style={changeStyle ? styleTextChange : styleText}>
            {hideText ? ':' : ' min '}
          </Text>
        </>
      )}
      {(secondsValue >= 0 || hideText) && (
        <>
          <Text style={changeStyle ? styleTimeChange : styleTime}>
            {secondsValue}
          </Text>
          {!hideText && (
            <Text style={changeStyle ? styleTextChange : styleText}> sec </Text>
          )}
        </>
      )}
      {!hideText && (
        <Text style={changeStyle ? styleTextChange : styleText}>left</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default SessionTimer;
