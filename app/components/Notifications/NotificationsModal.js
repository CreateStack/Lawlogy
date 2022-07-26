import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../config/colors';
import {deleteNotification} from './Notification';

const NotificationsModal = ({
  notifications,
  onPress,
  isVisible,
  refreshNotification,
  setVisible,
}) => {
  const onClose = () => {
    setVisible(false);
  };

  const SwipeRender = position => {
    return (
      <View
        style={{
          ...styles.swipe,
          alignItems: position === 'left' ? 'flex-start' : 'flex-end',
        }}>
        <Text style={styles.swipeText}>Clear</Text>
      </View>
    );
  };

  const SwipeActions = notifId => {
    deleteNotification(refreshNotification, notifId);
  };

  const Notification = (data, index) => {
    return (
      <GestureHandlerRootView>
        <Swipeable
          key={index}
          renderLeftActions={() => SwipeRender('left')}
          renderRightActions={() => SwipeRender('right')}
          onSwipeableRightOpen={() => SwipeActions(data.data.messageId)}
          onSwipeableLeftOpen={() => SwipeActions(data.data.messageId)}>
          <TouchableOpacity
            onPress={() => {
              onPress({navigateToScreen: data.data.data.navigateToScreen});
              onClose();
            }}
            style={styles.notification}
            swi>
            <Text style={styles.title}>{data.data.data.title}</Text>
            <Text style={styles.body}>{data.data.data.body}</Text>
          </TouchableOpacity>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  return (
    <Modal
      animationIn={'slideInRight'}
      animationOut={'slideOutRight'}
      coverScreen
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      propagateSwipe={true}
      style={{margin: 0, flex: 1}}
      swipeDirection="right"
      onSwipeComplete={onClose}
      useNativeDriver={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Notifications</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons
              name={'close'}
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
        {Object.keys(notifications || {}).length ? (
          <ScrollView>
            {Object.keys(notifications || {}).map((notifId, index) => {
              return (
                <Notification data={notifications[notifId]} index={index} />
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.noNotifs}>
            <Text style={styles.noNotifText}>
              You have no new notifications
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  body: {
    color: colors.greyDark,
    fontSize: 16,
  },
  container: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff0',
    flex: 1,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.primary,
  },
  headerText: {
    color: colors.white,
    fontSize: 16,
  },
  notification: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  noNotifs: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noNotifText: {
    fontSize: 18,
    color: colors.greyLight,
  },
  swipe: {
    backgroundColor: '#fff0',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  swipeText: {
    color: colors.white,
    fontSize: 16,
  },
  title: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default NotificationsModal;
