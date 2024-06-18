import {create} from 'zustand';
export type NotificationState = 'grant' | 'dinei' | 'unknown';

type UserStore = {
  chur: number;
  notification: NotificationState;
  fcmToken: string;
  setNotification: (state: NotificationState) => void;
  setChur: (chur: number) => void;
  setFCMToken: (fcmToken: string) => void;
};

const useUserStateStore = create<UserStore>(set => ({
  chur: 0,
  notification: 'unknown',
  fcmToken: '',
  setNotification: state => set({notification: state}),
  setChur: chur => set({chur}),
  setFCMToken: fcmToken => set({fcmToken}),
}));

export default useUserStateStore;
