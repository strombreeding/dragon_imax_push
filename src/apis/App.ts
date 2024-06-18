import axios from 'axios';
import {IOS, deviceId} from '../configs/device';
import {SERVER_URL} from '../configs/server';
import type {ILoginResult} from '../types/App';
import messaging from '@react-native-firebase/messaging';
import {
  PERMISSIONS,
  check,
  checkNotifications,
  request,
} from 'react-native-permissions';
import {NativeModules, PermissionsAndroid, Platform} from 'react-native';
import {NotificationState} from '../hooks/useUserStateStore';
const {NotificationSetting, NotificationSettings} = NativeModules;

export const loginReq = async (): Promise<ILoginResult> => {
  // 디바이스 Id로 로그인 시도
  const res = await axios.get(SERVER_URL + 'users?' + 'deviceId=' + deviceId);
  return res.data;
};

export const permissionRequest = async (
  second?: boolean,
): Promise<NotificationState> => {
  let granted: NotificationState = 'grant';
  if (IOS) {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === 0) {
      granted = 'dinei';
    }
  } else {
    await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    const res = await checkNotifications();
    if (res.status !== 'granted') {
      granted = 'dinei';
    }
  }
  return granted;
};

export const getFCMTokenAndPutAPI = async () => {
  try {
    const token = await messaging().getToken();
    const res = await axios.put(SERVER_URL + 'users', {
      deviceId,
      fcmToken: token,
    });
    // console.log('# FCM 토큰 조회 : ', res.data);
  } catch (err) {
    console.log('App/getFCMTokenAndPutAPI Error', err);
  }
};
