import React from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';
import {s} from '../utils/scalingUtils';
import Separator from '../components/Separator';
import useAuth from '../auth/useAuth';

const SocialIcon = ({color, name, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialCommunityIcons name={name} size={36} color={color} />
    </TouchableOpacity>
  );
};

const Item = ({icon, iconColor, onPress, text}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={iconColor}
        style={styles.itemIcon}
      />
      <Text style={styles.itemText}>{text}</Text>
    </TouchableOpacity>
  );
};

const Menu = ({isVisible, setVisible, userInfo}) => {
  const {logOut} = useAuth();
  return (
    <Modal
      animationIn={'slideInLeft'}
      animationOut={'slideOutLeft'}
      coverScreen
      isVisible={isVisible}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      propagateSwipe
      style={{margin: 0}}
      swipeDirection="left"
      onSwipeComplete={(e) => {
        setVisible(false);
      }}
      useNativeDriver={true}>
      <View
        colors={[colors.seaGreen, colors.orangeLighter]}
        style={styles.menuContainer}>
        <View
          style={{backgroundColor: colors.primary, padding: 16, width: '100%'}}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.jpg')}
              style={styles.menuLogo}
              resizeMode={'contain'}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>
              {'Hello ' + userInfo.name + '!'}{' '}
              <MaterialCommunityIcons
                name={'human-greeting'}
                size={24}
                color={colors.seaGreen}
              />
            </Text>
            <Text style={styles.email}>{'(' + userInfo.email + ')'}</Text>
          </View>
        </View>
        <Separator style={styles.separator} dashColor={colors.black} />
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.itemsContianer}>
            <Item
              icon={'share-variant'}
              iconColor={colors.primary}
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
              iconColor={colors.redText}
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
          </View>
          <Separator style={styles.separator} dashColor={colors.black} />
          <View style={styles.contact}>
            <Text style={styles.contactText}>Contact Us</Text>
            <Text style={styles.contactNumber}>
              {'+91 98260 24430\n+91 95756 52265'}
            </Text>
            <View style={styles.social}>
              <SocialIcon
                color={colors.darkPink}
                name={'instagram'}
                onPress={() =>
                  Linking.openURL('https://www.instagram.com/lawlogy/')
                }
              />
              <SocialIcon
                color={'#25D366'}
                name={'whatsapp'}
                onPress={() =>
                  Linking.openURL(
                    'https://chat.whatsapp.com/FoOp1UTf6IAHFraWD2JE43',
                  )
                }
              />
              <SocialIcon
                color={'#229ED9'}
                name={'telegram'}
                onPress={() => Linking.openURL('https://t.me/lawlogyclasses')}
              />
              <SocialIcon
                color={'#4267B2'}
                name={'facebook'}
                onPress={() =>
                  Linking.openURL('https://m.facebook.com/lawlogy/')
                }
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contact: {
    alignItems: 'center',
    marginTop: 32,
    width: '100%',
  },
  contactText: {
    fontSize: 20,
    textAlign: 'center',
  },
  contactNumber: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  email: {
    color: colors.white,
    fontSize: 14,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 4,
    width: '100%',
  },
  itemIcon: {
    marginRight: 16,
  },
  itemsContianer: {
    marginVertical: 32,
    paddingHorizontal: 16,
    width: '100%',
  },
  itemText: {
    fontSize: 18,
  },
  logoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
  },
  menuContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    height: '100%',
    width: '75%',
  },
  menuLogo: {
    borderRadius: 100,
    height: s(60),
    width: s(60),
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 16,
    width: '100%',
  },
  userInfo: {
    marginTop: 16,
    width: '100%',
  },
});

export default Menu;
