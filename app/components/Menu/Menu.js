import React, {useEffect, useState} from 'react';
import {
  Alert,
  Animated,
  Easing,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../config/colors';
import {s} from '../../utils/scalingUtils';
import Separator from '../Separator';
import useAuth from '../../auth/useAuth';
import {openURL} from '../../utils/helpers';
import Subscriptions from './Subscriptions';

const SocialIcon = ({color, name, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.socialIcon}>
      <MaterialCommunityIcons name={name} size={32} color={color} />
    </TouchableOpacity>
  );
};

const Item = ({
  expanded = false,
  icon,
  iconColor,
  onPress,
  showDropDownIcon = false,
  text,
}) => {
  const spinValue = new Animated.Value(0);
  useEffect(() => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [expanded]);
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: expanded ? ['0deg', '180deg'] : ['180deg', '0deg'],
  });
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={iconColor}
          style={styles.itemIcon}
        />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemText}>{text}</Text>
          {showDropDownIcon && (
            <Animated.View
              style={{
                transform: [{rotate: spin}],
              }}>
              <MaterialCommunityIcons
                name={'chevron-down'}
                size={20}
                color={colors.silver}
              />
            </Animated.View>
          )}
        </View>
      </>
    </TouchableOpacity>
  );
};

const Contact = ({icon = 'phone-incoming', onPress, text, textStyle = {}}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.contactNumberContainer}>
      <MaterialCommunityIcons
        name={icon}
        size={16}
        color={colors.silver}
        style={styles.contactIcon}
      />
      <Text style={[styles.contactNumber, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const Menu = ({isVisible, setVisible, userInfo}) => {
  const {logOut} = useAuth();
  const [contactVisible, setContactVisible] = useState(false);
  const [subscriptionVisible, setSubscriptionVisible] = useState(false);
  const onMenuClose = () => {
    setVisible(false);
    setContactVisible(false);
    setSubscriptionVisible(false);
  };
  return (
    <Modal
      animationIn={'slideInLeft'}
      animationOut={'slideOutLeft'}
      coverScreen
      isVisible={isVisible}
      onBackButtonPress={onMenuClose}
      onBackdropPress={onMenuClose}
      propagateSwipe
      style={{margin: 0}}
      swipeDirection="left"
      onSwipeComplete={onMenuClose}
      useNativeDriver={true}>
      <View
        colors={[colors.seaGreen, colors.orangeLighter]}
        style={styles.menuContainer}>
        <View
          style={{backgroundColor: colors.primary, padding: 16, width: '100%'}}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons
              name={'account-tie'}
              color={colors.greyDark}
              size={32}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{userInfo.name || ''} </Text>
            <Text style={styles.email}>
              {userInfo.phone ? '+91 ' + userInfo.phone : ''}
            </Text>
          </View>
        </View>
        <Separator style={styles.separator} dashColor={colors.greyLight} />
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.itemsContianer}>
            <Item
              expanded={subscriptionVisible}
              icon={'cash-usd'}
              iconColor={colors.silver}
              text={'My Subscriptions'}
              onPress={() => setSubscriptionVisible((v) => !v)}
              showDropDownIcon={true}
            />
            {subscriptionVisible && (
              <Subscriptions premiums={userInfo.premium || {}} />
            )}
            <Item
              icon={'star'}
              iconColor={colors.silver}
              text={'Rate Us'}
              onPress={() => {
                openURL('market://details?id=com.lawlogy');
              }}
            />
            <Item
              icon={'share-variant'}
              iconColor={colors.silver}
              text={'Share with Friends'}
              onPress={() => {
                Share.share(
                  {
                    title: 'Share lawlogy with your friends',
                    message:
                      'Checkout this amazing law app: Lawlogy (https://play.google.com/store/apps/details?id=com.lawlogy)',
                  },
                  {
                    dialogTitle: 'Share lawlogy with your friends',
                  },
                );
              }}
            />
            <Item
              icon={'logout'}
              iconColor={colors.silver}
              text={'Logout'}
              onPress={() => {
                Alert.alert('Logout', 'Are you sure you want to logout?', [
                  {text: 'cancel', style: 'cancel'},
                  {
                    text: 'logout',
                    onPress: () => logOut(),
                    style: 'destructive',
                  },
                ]);
              }}
            />
            <Item
              expanded={contactVisible}
              icon={'account-box'}
              iconColor={colors.silver}
              text={'Contact Us'}
              onPress={() => setContactVisible((v) => !v)}
              showDropDownIcon
            />
            {contactVisible && (
              <View style={styles.dropDown}>
                <Contact
                  onPress={() => openURL('tel://+919826024430')}
                  text={'+91 98260 24430'}
                />
                <Contact
                  onPress={() => openURL('tel://+919575652265')}
                  text={'+91 95756 52265'}
                />
                <Contact
                  icon={'email'}
                  onPress={() =>
                    openURL('mailto:lawlogyonlineclasses@gmail.com')
                  }
                  text={'Email'}
                  textStyle={styles.emailContact}
                />
              </View>
            )}
          </View>
        </ScrollView>
        <View style={styles.social}>
          <SocialIcon
            color={colors.darkPink}
            name={'instagram'}
            onPress={() => openURL('https://www.instagram.com/lawlogy/')}
          />
          <SocialIcon
            color={'#25D366'}
            name={'whatsapp'}
            onPress={() =>
              openURL('https://chat.whatsapp.com/FoOp1UTf6IAHFraWD2JE43')
            }
          />
          <SocialIcon
            color={'#229ED9'}
            name={'telegram'}
            onPress={() => openURL('https://t.me/lawlogyclasses')}
          />
          <SocialIcon
            color={'#4267B2'}
            name={'facebook'}
            onPress={() => openURL('https://m.facebook.com/lawlogy/')}
          />
        </View>
        <View style={styles.version}>
          <Text style={styles.versionText}>v1.1</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contactIcon: {
    marginRight: 8,
  },
  dropDown: {
    marginLeft: 16,
    marginTop: -4,
  },
  contactNumber: {
    color: colors.black,
    fontSize: 13,
    marginVertical: 6,
    marginLeft: 4,
  },
  contactNumberContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  contactText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    color: colors.white,
    fontSize: 14,
  },
  emailContact: {
    color: colors.grey,
    fontSize: 14,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 12,
    width: '100%',
  },
  itemIcon: {
    marginRight: 8,
  },
  itemsContianer: {
    marginVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  itemText: {
    fontSize: 16,
    marginLeft: 8,
  },
  itemTextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    justifyContent: 'center',
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  menuContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    height: '100%',
    width: '75%',
  },
  menuLogo: {
    borderRadius: 25,
    height: s(25),
    width: s(25),
  },
  name: {
    color: colors.white,
    fontSize: 20,
  },
  scrollContainer: {
    width: '100%',
  },
  separator: {
    width: '100%',
  },
  social: {
    alignItems: 'center',
    bottom: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    position: 'absolute',
    width: '100%',
  },
  socialIcon: {
    marginHorizontal: 8,
  },
  userInfo: {
    marginTop: 4,
    width: '100%',
  },
  version: {
    alignItems: 'center',
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    position: 'absolute',
    width: '100%',
  },
  versionText: {
    color: colors.grey,
    fontSize: 12,
  },
});

export default Menu;
