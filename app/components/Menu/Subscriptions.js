import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import _ from 'lodash';

import colors from '../../config/colors';

const daysToMiliSecs = 24 * 60 * 60 * 1000;

const Subscriptions = ({premiums = {}}) => {
  const [subs, setSubs] = useState([]);
  const trim = (text = '') => {
    return _.startCase(
      text.replace(' ', '').replace('_', ' ').replace('Premium', ''),
    );
  };
  useEffect(() => {
    Object.keys(premiums).forEach(premium => {
      let expiry = premiums[premium].expiry;
      if (expiry) {
        if (expiry.toString().includes('/')) {
          let date = expiry.split('/');
          expiry = Date.parse(date[1] + '/' + date[0] + '/' + date[2]);
          let remainingMiliSecs = expiry - Date.now();
          let remainingDays = remainingMiliSecs / daysToMiliSecs;
          setSubs(prevState => {
            prevState.push({
              premium: trim(premium) + ': ',
              daysLeft:
                remainingDays > 0
                  ? Math.floor(remainingDays) + ' days left'
                  : 'Expired!',
              color: remainingDays > 0 ? colors.green : colors.redText,
            });
            return [...prevState];
          });
        } else {
          expiry = parseInt(expiry);
          let dateOfExpiry =
            parseInt(premiums[premium].premiumStartTime || Date.now()) +
            expiry * daysToMiliSecs;
          let remainingMiliSecs = dateOfExpiry - Date.now();
          let remainingDays = remainingMiliSecs / daysToMiliSecs;
          setSubs(prevState => {
            prevState.push({
              premium: trim(premium) + ': ',
              daysLeft:
                remainingDays > 0
                  ? Math.floor(remainingDays) + ' days left'
                  : 'Expired!',
              color: remainingDays > 0 ? colors.green : colors.redText,
            });
            return [...prevState];
          });
        }
      }
    });
  }, [premiums]);
  return (
    <View style={styles.dropDown}>
      {subs.length ? (
        subs.map((sub, index) => {
          return (
            <Text key={index}>
              <Text style={styles.subscriptions}>{sub.premium}</Text>
              <Text
                style={[
                  styles.subscriptions,
                  {color: sub.color, fontWeight: 'normal'},
                ]}
              >
                {sub.daysLeft}
              </Text>
            </Text>
          );
        })
      ) : (
        <Text style={styles.subscriptions}>
          You don't have any active subscription!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropDown: {
    marginLeft: 8,
    marginTop: -4,
  },
  subscriptions: {
    color: colors.black,
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default Subscriptions;
