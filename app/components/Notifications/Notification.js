import notifee, {AndroidColor, EventType} from '@notifee/react-native';
import {getData, storeData} from '../../utils/AsyncStorage';

const displayNotification = (title = '', body = '', pressAction = 'none') => {
  if (!title && !body) return;
  notifee
    .createChannel({
      id: 'Lawlogy',
      lights: true,
      lightColor: AndroidColor.WHITE,
      name: 'Lawlogy',
      sound: 'default',
      vibration: true,
      vibrationPattern: [300, 500],
    })
    .then(resp => {
      notifee.displayNotification({
        title: `<p style="color: #7a75be;"><b>${title}</span></p></b></p>`,
        body,
        android: {
          channelId: resp,
          color: '#7a75be',
          pressAction: {
            id: pressAction,
            mainComponent: 'lawlogy',
          },
          smallIcon: 'ic_notification',
        },
      });
    })
    .catch(e => {
      console.log('error in notification: ', e);
    });
};

export const eventHandler = onPress => ({
  foreground: notifee.onForegroundEvent(({type, detail}) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        if (detail.notification.android.pressAction?.id !== 'none') {
          onPress && onPress(detail.notification.android.pressAction.id);
          notifee.cancelNotification(detail.notification.id);
        }
        break;
    }
  }),
  background: notifee.onBackgroundEvent(
    async ({type, detail: {notification}}) => {
      if (
        type === EventType.PRESS &&
        notification?.android.pressAction?.id !== 'none'
      ) {
        onPress && onPress(notification.android.pressAction.id);
        await notifee.cancelNotification(notification.id);
      }
    },
  ),
});

export const getInitialNotification = onPress => {
  notifee.getInitialNotification().then(initialNotification => {
    if (initialNotification) {
      console.log(
        'Notification caused application to open',
        initialNotification.notification,
      );
      console.log(
        'Press action used to open the app',
        initialNotification.pressAction,
      );
      onPress && onPress(initialNotification.pressAction?.id);
    }
  });
};

export const storeNotification = (notification, callback) => {
  console.log('Storing notification: ', notification.messageId);
  getData('notifications').then(notificaitons => {
    if (notificaitons && Object.keys(notificaitons || {}).length) {
      notificaitons[notification.messageId] = notification;
      storeData('notifications', notificaitons).then(
        () => callback && callback(),
      );
    } else {
      let newNotificationObject = {};
      newNotificationObject[notification.messageId] = notification;
      storeData('notifications', newNotificationObject);
    }
  });
};

export const getNotifications = async () => {
  const notifcations = await getData('notifications');
  return notifcations;
};

export const deleteNotification = (callback, messageId) => {
  getData('notifications').then(notificaitons => {
    if (notificaitons && Object.keys(notificaitons || {}).length) {
      delete notificaitons[messageId];
      storeData('notifications', notificaitons).then(() => callback());
    } else {
      console.log('No notifications to delete');
    }
  });
};

export default displayNotification;
